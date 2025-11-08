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

  socket.on("chatMessage", ({ roomId, msg }) => {
    socket.to(roomId).emit("chatMessage", msg);
  });

  socket.on("voiceMessage", ({ roomId, message }) => {
    socket.to(roomId).emit("voiceMessage", message);
  });

  // ✅ File structure events omitted for brevity (same code as yours)

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      io.to(currentRoom).emit("userLeftVideoCall", { userId: socket.id });

      if (rooms.get(currentRoom).size === 0) {
        rooms.delete(currentRoom);
      }
    }
  });
});

// ✅ REMOVE the frontend serving code — DO NOT include it on Render

// ✅ Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
