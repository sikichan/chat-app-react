import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import connectMongodb from './db/connectMongodb.js'
import AuthRoutes from './routes/AuthRoutes.js'
import MessageRoutes from './routes/MessageRoutes.js'
import UserRoutes from './routes/UserRoutes.js'
import { app, server } from './socket.js'

const PORT = process.env.PORT || 3000
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', AuthRoutes)
app.use('/api/messages', MessageRoutes)
app.use('/api/users', UserRoutes)

server.listen(PORT, () => {
  connectMongodb()
  console.log(`Server started on port ${PORT}`)
})
