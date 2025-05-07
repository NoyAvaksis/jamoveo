// Load core dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables from .env
dotenv.config();

// Import database connection function and route definitions
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");

// Initialize Express app
const app = express();

// Create HTTP server to be used with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO server and allow CORS for all origins
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Define port from environment or fallback to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// API Routes
app.use("/api", userRoutes);

// WebSocket logic
io.on("connection", (socket) => {
  console.log("🟢 WebSocket connected:", socket.id);

  // Admin selects a song → broadcast it to all connected clients
  socket.on("songSelected", (song) => {
    console.log("📢 Song selected by admin:", song);
    io.emit("songSelected", song); // Broadcast to all clients
  });

  // Admin ends the session → notify all clients
  socket.on("sessionEnded", () => {
    console.log("🛑 Session ended by admin");
    io.emit("sessionEnded");
  });

  // Optional ping/pong event to test WebSocket communication
  socket.on("pingFromClient", () => {
    console.log("📨 Ping received from client");
    socket.emit("pongFromServer", "Pong!");
  });

  // Log disconnection
  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
