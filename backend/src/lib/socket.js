import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Lưu trữ người dùng trực tuyến
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;

    //io.emit() // Gửi sự kiện cho tất cả người dùng
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Gửi danh sách người dùng trực tuyến cho tất cả người dùng
  }
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    // Xóa người dùng khỏi danh sách trực tuyến
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Gửi danh sách người dùng trực tuyến cho tất cả người dùng
  });
});

export { io, server, app };
