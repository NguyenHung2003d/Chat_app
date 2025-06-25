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

const userSocketMap = {}; 

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
  }
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
  });
});

export { io, server, app };
