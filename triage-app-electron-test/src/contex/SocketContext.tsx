import { createContext } from 'react'
import { io, Socket } from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_URL),
  SocketContext = createContext<Socket>(socket)

socket.on('connect', () => {
  console.log('someone connected: ', socket?.id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketProvider = ({ children }: any) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
export { SocketContext, SocketProvider }
