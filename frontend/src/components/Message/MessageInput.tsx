import React, {useEffect, useRef, useState} from 'react'
import {BsSend} from 'react-icons/bs'
import useSendMessage from '@/hooks/useSendMessage'
import useConversation from '@/zustand/useConversation.ts';

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const {loading, sendMessage} = useSendMessage()
  const {selectedConversation} = useConversation()
  
  const ref = useRef<HTMLInputElement>(null)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return
    await sendMessage(message)
    setMessage('')
  }
  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [selectedConversation?._id]);
  
  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 border-gray-600"
          placeholder="Send a message"
          ref={ref}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend/>
          )}
        </button>
      </div>
    </form>
  )
}
export default MessageInput
