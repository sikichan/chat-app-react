import {useContext} from 'react'
import {SocketContext} from '@/context/SocketContextProvider.tsx'

const useSocketContext = () => {
  return useContext(SocketContext)
}
export default useSocketContext