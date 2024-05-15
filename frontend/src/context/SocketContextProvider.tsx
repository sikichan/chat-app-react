import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState
} from 'react'
import {Socket, io} from 'socket.io-client'
import useAuthContext from '@/hooks/useAuthContext.ts'

interface SocketContextType {
  socket: Socket | null
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
  onlineUsers: string[]
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  setSocket: () => {
  },
  onlineUsers: [],
  setOnlineUsers: () => {
  }
})

const SocketProvider = ({children}: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const {authUser} = useAuthContext()
  useEffect(() => {
    if (authUser) {
      const socket = io(import.meta.env.VITE_SERVER_URL, {
        query: {
          userId: authUser._id
        }
      })
      setSocket(socket)
      
      socket.on('online-users', (onlineUsers: string[]) => {
        setOnlineUsers(onlineUsers)
      })
      return () => {
        socket.close()
        setSocket(null)
        setOnlineUsers([])
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [authUser])
  return (
    <SocketContext.Provider
      value={{socket, setSocket, onlineUsers, setOnlineUsers}}
    >
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider
