import io from 'socket.io-client'

const initializeSocket = () => {
  const newSocket = io(import.meta.env.VITE_API_URL)

  newSocket.on('connect', () => {
    console.log('Connected to Socket.IO')
  })

  newSocket.on('notification', (data) => {
    console.log('Notification:', data)
  })

  return newSocket
}

export default initializeSocket
