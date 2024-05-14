import useGetMessages from '@/hooks/useGetMessages.ts'
import MessageSkeleton from '@/components/MessageSkeleton'
import {useEffect, useRef} from 'react'
import Message from '@/components/Message/Message.tsx'

const Messages = () => {
  const {messages, loading} = useGetMessages()
  const lastMessageRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const timerId = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }, 100)
    return () => {
      clearTimeout(timerId)
    }
  }, [messages])
  
  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id}>
            <Message {...message} />
          </div>
        ))}
      <div ref={lastMessageRef}></div>
      
      {loading &&
        [...new Array(3)].map((_, idx) => <MessageSkeleton key={idx}/>)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  )
}
export default Messages
