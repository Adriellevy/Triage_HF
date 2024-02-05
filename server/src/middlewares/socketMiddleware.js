// socketMiddleware.js
import { Server } from 'socket.io'
import 'dotenv/config'

const initializeSocketMiddleware = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connect', (socket) => {
    console.log('a user connected', socket?.id)
  })

  return (req, res, next) => {
    req.io = io
    next()
  }
}

export default initializeSocketMiddleware
