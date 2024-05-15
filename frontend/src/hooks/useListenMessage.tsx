import useSocketContext from '@/hooks/useSocketContext.ts';
import useConversation from '@/zustand/useConversation.ts';
import {useEffect} from 'react';
import {MessageModel} from '@/types.ts';

const useListenMessage = () => {
  const {socket} = useSocketContext()
  const {messages, setMessages} = useConversation()
  
  useEffect(() => {
    socket?.on('new-message', (newMessage: MessageModel) => {
      console.log(newMessage, 'new!!')
      newMessage.shouldShake = true
      
      setMessages([...messages, newMessage])
      
    })
    return () => {
      socket?.off('new-message')
    }
  }, [socket, messages, setMessages])
}
export default useListenMessage