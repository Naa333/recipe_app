// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'http'
import { Server } from 'socket.io'
import { app } from './app.js'
import { initDatabase } from './db/init.js'
import { handleSocket } from './socket.js'

// Initialize backend server with MongoDB, Express, and Socket.IO
try {
  await initDatabase()

  const PORT = process.env.PORT
  const httpServer = createServer(app)

  // Socket.IO with CORS
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  handleSocket(io)

  // Make io available to routes
  app.set('io', io) // Start server
  httpServer.listen(PORT)
  console.info(`express server running on http://localhost:${PORT}`)
  console.info(`socket.io server running`)
} catch (err) {
  console.error('error connecting to database:', err)
}
