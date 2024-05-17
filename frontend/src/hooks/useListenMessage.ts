import useSocketContext from '@/hooks/useSocketContext.ts'
import useConversation from '@/zustand/useConversation.ts'
import { useEffect } from 'react'
import { MessageModel } from '@/types.ts'
import notice from '@/assets/notice.wav'

const useListenMessage = () => {
  const { socket } = useSocketContext()
  const { messages, setMessages } = useConversation()
  const { selectedConversation } = useConversation()
  useEffect(() => {
    socket?.on('new-message', (newMessage: MessageModel) => {
      console.log(newMessage, 'new!!')
      if (newMessage.senderId === selectedConversation?._id) {
        newMessage.shouldShake = true
        const audio = new Audio(notice)
        audio.play()
      }
      setMessages([...messages, newMessage])
    })
    return () => {
      socket?.off('new-message')
    }
  }, [socket, messages, setMessages])
}
export default useListenMessage
