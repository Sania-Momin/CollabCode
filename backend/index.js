import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";  
import FileStructure from "./models/FileStructure.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Correct frontend URL handling
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ✅ Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e7,
});

// ✅ REST API CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.get('/', (req, res) => {
  res.send('✅ CollabCode Backend is running!');
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// ---------------- Socket.IO Logic ----------------
const rooms = new Map();
const roomCodes = new Map(); // Store current code for each room

// ---------------- Helper DB functions ------------
const getFileStructure = async (roomId) => {
  try {
    let fileStructure = await FileStructure.findOne({ roomId });
    if (!fileStructure) {
      fileStructure = new FileStructure({
        roomId,
        files: [],
      });
      await fileStructure.save();
    }
    return fileStructure.files;
  } catch (error) {
    return [];
  }
};

const saveFileStructure = async (roomId, files) => {
  try {
    await FileStructure.findOneAndUpdate(
      { roomId },
      {
        files,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("❌ Error saving file structure:", error);
  }
};

// ---------------- Socket Events ------------------
io.on("connection", (socket) => {
  console.log("🔌 User Connected", socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", async ({ roomId, userName }) => {
    console.log(`🔄 User ${userName} attempting to join room: ${roomId}`);
    
    try {
      // Leave previous room if any
      if (currentRoom) {
        socket.leave(currentRoom);
        if (rooms.has(currentRoom)) {
          rooms.get(currentRoom).delete(currentUser);
          io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
          console.log(`⬅️ User ${currentUser} left room: ${currentRoom}`);
        }
      }

      currentRoom = roomId;
      currentUser = userName;

      // Join the room
      socket.join(roomId);
      console.log(`✅ User ${userName} joined room: ${roomId}`);

      // Initialize room if it doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
        roomCodes.set(roomId, "// Welcome to the collaborative editor!\n// Start coding here...");
        console.log(`🏠 New room created: ${roomId}`);
      }

      // Add user to room
      rooms.get(roomId).add(userName);
      
      // Notify all users in the room about updated user list
      io.to(roomId).emit("userJoined", Array.from(rooms.get(roomId)));
      console.log(`📢 Room ${roomId} now has users:`, Array.from(rooms.get(roomId)));

      // Send current room code to the joining user
      const currentCode = roomCodes.get(roomId) || "// Welcome to the collaborative editor!";
      socket.emit("codeUpdate", currentCode);

      // Send file structure to the joining user
      const fileStructure = await getFileStructure(roomId);
      socket.emit("fileStructureUpdate", fileStructure);

      // Notify others that a new user joined
      socket.to(roomId).emit("userNotification", {
        type: "join",
        user: userName,
        message: `${userName} joined the room`
      });

    } catch (error) {
      console.error("❌ Error joining room:", error);
      socket.emit("joinError", "Failed to join room");
    }
  });

  socket.on("codeChange", ({ roomId, code }) => {
    // Store the latest code for the room
    roomCodes.set(roomId, code);
    // Broadcast to all other users in the room
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      console.log(`🚪 User ${currentUser} leaving room: ${currentRoom}`);
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      socket.to(currentRoom).emit("userNotification", {
        type: "leave",
        user: currentUser,
        message: `${currentUser} left the room`
      });
      socket.leave(currentRoom);
      
      // Clean up room if empty
      if (rooms.get(currentRoom).size === 0) {
        console.log(`🧹 Cleaning up empty room: ${currentRoom}`);
        rooms.delete(currentRoom);
        roomCodes.delete(currentRoom);
      }
      
      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("compileCode", async ({ code, roomId, language, version, input }) => {
    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version,
        files: [{ content: code }],
        stdin: input || "",
      });

      io.to(roomId).emit("codeResponse", {
        output: response.data.run.output,
        stderr: response.data.run.stderr,
      });
    } catch (error) {
      io.to(roomId).emit("codeResponse", {
        output: "",
        stderr: error.message || "Compilation failed",
      });
    }
  });

  // ✅ FIXED: Chat and Voice messages - only broadcast to other users
  socket.on("chatMessage", ({ roomId, msg }) => {
    // Broadcast to all OTHER users in the room (excluding sender)
    socket.to(roomId).emit("chatMessage", msg);
  });

  socket.on("voiceMessage", ({ roomId, message }) => {
    // Broadcast to all OTHER users in the room (excluding sender)
    socket.to(roomId).emit("voiceMessage", message);
  });

  // File structure events
  socket.on("getFileStructure", async (roomId) => {
    const fileStructure = await getFileStructure(roomId);
    socket.emit("fileStructureUpdate", fileStructure);
  });

  socket.on("createFile", async ({ roomId, fileName, parentId }) => {
    const fileStructure = await getFileStructure(roomId);
    
    const newFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: fileName,
      type: "file",
      content: "// New file",
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };

    fileStructure.push(newFile);
    await saveFileStructure(roomId, fileStructure);
    io.to(roomId).emit("fileStructureUpdate", fileStructure);
    io.to(roomId).emit("fileCreated", newFile);
  });

  socket.on("createFolder", async ({ roomId, folderName, parentId }) => {
    const fileStructure = await getFileStructure(roomId);
    
    const newFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: folderName,
      type: "folder",
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };

    fileStructure.push(newFolder);
    await saveFileStructure(roomId, fileStructure);
    io.to(roomId).emit("fileStructureUpdate", fileStructure);
    io.to(roomId).emit("fileCreated", newFolder);
  });

  socket.on("deleteFile", async ({ roomId, fileId }) => {
    const fileStructure = await getFileStructure(roomId);
    const updatedStructure = fileStructure.filter(f => f.id !== fileId);
    
    await saveFileStructure(roomId, updatedStructure);
    io.to(roomId).emit("fileStructureUpdate", updatedStructure);
    io.to(roomId).emit("fileDeleted", fileId);
  });

  socket.on("renameFile", async ({ roomId, fileId, name }) => {
    const fileStructure = await getFileStructure(roomId);
    const fileIndex = fileStructure.findIndex(f => f.id === fileId);
    
    if (fileIndex !== -1) {
      fileStructure[fileIndex].name = name;
      fileStructure[fileIndex].lastModified = new Date().toISOString();
      await saveFileStructure(roomId, fileStructure);
      io.to(roomId).emit("fileStructureUpdate", fileStructure);
      io.to(roomId).emit("fileRenamed", { id: fileId, name });
    }
  });

  socket.on("updateFileContent", async ({ roomId, fileId, content }) => {
    const fileStructure = await getFileStructure(roomId);
    const fileIndex = fileStructure.findIndex(f => f.id === fileId && f.type === "file");
    
    if (fileIndex !== -1) {
      fileStructure[fileIndex].content = content;
      fileStructure[fileIndex].lastModified = new Date().toISOString();
      await saveFileStructure(roomId, fileStructure);
      
      // Update room code if this is the current file
      roomCodes.set(roomId, content);
      io.to(roomId).emit("fileContentUpdated", { id: fileId, content });
      io.to(roomId).emit("codeUpdate", content);
    }
  });

  socket.on("fileSelected", ({ roomId, file }) => {
    io.to(roomId).emit("fileSelected", file);
  });

  socket.on("folderExpanded", ({ roomId, folderId }) => {
    socket.to(roomId).emit("folderExpanded", folderId);
  });

  socket.on("folderCollapsed", ({ roomId, folderId }) => {
    socket.to(roomId).emit("folderCollapsed", folderId);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      io.to(currentRoom).emit("userNotification", {
        type: "leave",
        user: currentUser,
        message: `${currentUser} left the room`
      });

      // Clean up room if empty
      if (rooms.get(currentRoom).size === 0) {
        console.log(`🧹 Cleaning up empty room: ${currentRoom}`);
        rooms.delete(currentRoom);
        roomCodes.delete(currentRoom);
      }
    }
  });
});

// ✅ Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
