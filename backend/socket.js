import http from "http"
import express from "express"
import { Server } from "socket.io"

const app = express()

const server = http.createServer(app)
export const UserSocketMap = {}
const getSocketIdByUserId = (userId) => {
  return UserSocketMap[userId]
}
const io = new Server(server, {
  cors: ["http://localhost:5173"],
  methods: ["GET", "POST"],
})
io.on("connection", (socket) => {
  console.log("user connected:", socket.id)
  io.socketsJoin("all-users")
  const userId = socket.handshake.query.userId
  if (userId !== undefined) {
    UserSocketMap[userId] = socket.id
  }
  console.info(`UserSocketMap:`, UserSocketMap)
  io.emit("online-users", Object.keys(UserSocketMap))
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id)
    delete UserSocketMap[userId]
    io.emit("online-users", Object.keys(UserSocketMap))
  })
})
export { app, io, server, getSocketIdByUserId }
