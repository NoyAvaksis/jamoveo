const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// התחברות למסד נתונים
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ראוטים
app.use("/api", userRoutes);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🟢 WebSocket connected:", socket.id);

  // ✅ כשהאדמין בוחר שיר
  socket.on("songSelected", (song) => {
    console.log("📢 Song selected by admin:", song);
    io.emit("songSelected", song);
  });

  // ✅ כשהאדמין מסיים סשן
  socket.on("sessionEnded", () => {
    console.log("🛑 Session ended by admin");
    io.emit("sessionEnded"); // משדר לכולם
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected:", socket.id);
  });
});

// הפעלת השרת
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
