import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
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

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e7,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

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

// Helper function to get file structure from DB
const getFileStructure = async (roomId) => {
  try {
    let fileStructure = await FileStructure.findOne({ roomId });
    if (!fileStructure) {
      fileStructure = new FileStructure({ 
        roomId, 
        files: [] 
      });
      await fileStructure.save();
      console.log(`📁 Created new file structure for room: ${roomId}`);
    }
    return fileStructure.files;
  } catch (error) {
    console.error('❌ Error getting file structure:', error);
    return [];
  }
};

// Helper function to save file structure to DB
const saveFileStructure = async (roomId, files) => {
  try {
    await FileStructure.findOneAndUpdate(
      { roomId },
      { 
        files,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    console.log(`💾 Saved file structure for room: ${roomId}`);
  } catch (error) {
    console.error('❌ Error saving file structure:', error);
  }
};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", async ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      if (rooms.has(currentRoom)) {
        rooms.get(currentRoom).delete(currentUser);
        io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      }
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(userName);
    io.to(roomId).emit("userJoined", Array.from(rooms.get(roomId)));
    
    const fileStructure = await getFileStructure(roomId);
    socket.emit("fileStructureUpdate", fileStructure);
    console.log(`📁 Sent file structure to ${userName} in room ${roomId}`);
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      socket.leave(currentRoom);
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
      if (rooms.has(roomId)) {
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
      }
    } catch (error) {
      io.to(roomId).emit("codeResponse", {
        output: "",
        stderr: error.message || "Compilation failed",
      });
    }
  });

  socket.on("chatMessage", ({ roomId, msg }) => {
    socket.to(roomId).emit("chatMessage", msg);
  });

  socket.on("voiceMessage", ({ roomId, message }) => {
    socket.to(roomId).emit("voiceMessage", message);
  });

  // File management events
  socket.on("createItem", async ({ roomId, item }) => {
    try {
      const fileStructure = await getFileStructure(roomId);
      
      if (!fileStructure.some(existingItem => existingItem.id === item.id)) {
        fileStructure.push(item);
        await saveFileStructure(roomId, fileStructure);
        io.to(roomId).emit("fileCreated", item);
        console.log(`✅ Created ${item.type}: ${item.name} in room ${roomId}`);
      }
    } catch (error) {
      console.error('❌ Error creating item:', error);
    }
  });

  socket.on("deleteItem", async ({ roomId, itemId }) => {
    try {
      const fileStructure = await getFileStructure(roomId);
      
      const getAllChildren = (parentId) => {
        const children = fileStructure.filter(item => item.parentId === parentId);
        let allIds = [parentId];
        
        children.forEach(child => {
          allIds = [...allIds, ...getAllChildren(child.id)];
        });
        
        return allIds;
      };
      
      const idsToDelete = getAllChildren(itemId);
      const originalLength = fileStructure.length;
      
      const newFileStructure = fileStructure.filter(item => !idsToDelete.includes(item.id));
      
      if (newFileStructure.length !== originalLength) {
        await saveFileStructure(roomId, newFileStructure);
        
        idsToDelete.forEach(id => {
          io.to(roomId).emit("fileDeleted", id);
        });
        
        console.log(`🗑️ Deleted item ${itemId} and ${idsToDelete.length - 1} children from room ${roomId}`);
      }
    } catch (error) {
      console.error('❌ Error deleting item:', error);
    }
  });

  socket.on("renameItem", async ({ roomId, itemId, name }) => {
    try {
      const fileStructure = await getFileStructure(roomId);
      const item = fileStructure.find(i => i.id === itemId);
      
      if (item) {
        item.name = name;
        item.lastModified = new Date();
        await saveFileStructure(roomId, fileStructure);
        io.to(roomId).emit("fileRenamed", { id: itemId, name });
        console.log(`✏️ Renamed item ${itemId} to ${name} in room ${roomId}`);
      }
    } catch (error) {
      console.error('❌ Error renaming item:', error);
    }
  });

  socket.on("updateFileContent", async ({ roomId, fileId, content }) => {
    try {
      const fileStructure = await getFileStructure(roomId);
      const file = fileStructure.find(item => item.id === fileId && item.type === "file");
      
      if (file) {
        file.content = content;
        file.lastModified = new Date();
        await saveFileStructure(roomId, fileStructure);
        
        io.to(roomId).emit("fileContentUpdated", { id: fileId, content });
        console.log(`💾 File content updated: ${file.name} in room ${roomId}`);
      }
    } catch (error) {
      console.error('❌ Error updating file content:', error);
    }
  });

  socket.on("fileSelected", ({ roomId, file, language }) => {
    console.log(`📂 File selected in room ${roomId}:`, file.name, "Language:", language);
    socket.to(roomId).emit("fileSelected", { file, language });
  });

  socket.on("folderExpanded", ({ roomId, folderId }) => {
    console.log(`📂 Folder expanded in room ${roomId}:`, folderId);
    socket.to(roomId).emit("folderExpanded", folderId);
  });

  socket.on("folderCollapsed", ({ roomId, folderId }) => {
    console.log(`📂 Folder collapsed in room ${roomId}:`, folderId);
    socket.to(roomId).emit("folderCollapsed", folderId);
  });

  socket.on("getFileStructure", async ({ roomId }) => {
    try {
      const fileStructure = await getFileStructure(roomId);
      socket.emit("fileStructureUpdate", fileStructure);
      console.log(`📁 Sent file structure to user in room ${roomId}`);
    } catch (error) {
      console.error('❌ Error getting file structure:', error);
    }
  });

  // ============ VIDEO CALL EVENTS ============
  
  socket.on("startVideoCall", ({ roomId, userName }) => {
    console.log(`📹 ${userName} started video call in room ${roomId}`);
    // Notify all other users in the room about incoming call
    socket.to(roomId).emit("incomingVideoCall", { 
      callerId: socket.id, 
      callerName: userName 
    });
  });

  socket.on("acceptVideoCall", ({ roomId, callerId }) => {
    console.log(`📹 User accepted video call in room ${roomId}`);
    // Notify the caller that someone accepted
    io.to(callerId).emit("videoCallAccepted", { userId: socket.id });
  });

  socket.on("declineVideoCall", ({ roomId, callerId }) => {
    console.log(`📹 User declined video call in room ${roomId}`);
    io.to(callerId).emit("videoCallDeclined", { userId: socket.id });
  });

  socket.on("joinVideoCall", ({ roomId, userName }) => {
    console.log(`📹 ${userName} joined video call in room ${roomId}`);
    // Notify all users in the room that someone joined the video call
    socket.to(roomId).emit("userJoinedVideoCall", { 
      userId: socket.id, 
      userName 
    });
  });

  socket.on("leaveVideoCall", ({ roomId }) => {
    console.log(`📹 User ${socket.id} left video call in room ${roomId}`);
    socket.to(roomId).emit("userLeftVideoCall", { userId: socket.id });
  });

  // WebRTC Signaling
  socket.on("videoOffer", ({ roomId, offer, targetId, senderName }) => {
    console.log(`📹 Video offer from ${socket.id} to ${targetId}`);
    io.to(targetId).emit("videoOffer", { 
      offer, 
      senderId: socket.id, 
      senderName 
    });
  });

  socket.on("videoAnswer", ({ roomId, answer, targetId }) => {
    console.log(`📹 Video answer from ${socket.id} to ${targetId}`);
    io.to(targetId).emit("videoAnswer", { 
      answer, 
      senderId: socket.id 
    });
  });

  socket.on("iceCandidate", ({ roomId, candidate, targetId }) => {
    io.to(targetId).emit("iceCandidate", { 
      candidate, 
      senderId: socket.id 
    });
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      
      // Also notify that user left video call if they were in one
      io.to(currentRoom).emit("userLeftVideoCall", { userId: socket.id });
      
      if (rooms.get(currentRoom).size === 0) {
        rooms.delete(currentRoom);
        console.log(`🧹 Cleaned up empty room from memory: ${currentRoom}`);
      }
    }
    console.log("User Disconnected", socket.id);
  });
});

// ---------------- Serve Frontend ----------------
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log(`🚀 Server is working on port ${port}`);
});