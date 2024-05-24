import React, { useEffect, useRef, useState } from "react"
import useSendMessage from "@/hooks/useSendMessage"
import useConversation from "@/zustand/useConversation.ts"
import ChatTools from "@/components/ChatTools/ChatTools.tsx"

const MessageInput = () => {
  const [message, setMessage] = useState("")
  const { sendMessage } = useSendMessage()
  const { selectedConversation } = useConversation()
  const [selectionStart, setSelectionStart] = useState(0)
  const ref = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleSend()
  }
  const handleSend = async () => {
    if (!message.trim()) return
    await sendMessage(message.trim())
    setMessage("")
  }
  const handleEmojiClick = (emoji: string) => {
    if (!ref.current) return
    const cursorPosition = ref.current.selectionStart
    setSelectionStart(cursorPosition)
    setMessage((prev) => {
      return prev.slice(0, cursorPosition) + emoji + prev.slice(cursorPosition)
    })
    ref.current!.focus()
    ref.current!.setSelectionRange(selectionStart + 2, selectionStart + 2)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      await handleSend()
    }
  }
  useEffect(() => {
    ref.current!.focus()
    ref.current!.setSelectionRange(selectionStart + 2, selectionStart + 2)
  }, [selectionStart])
  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [selectedConversation?._id])

  return (
    <form className="px-4" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <div className="relative">
          <ChatTools getEmoji={handleEmojiClick} />
          <textarea
            className="text-md rounded-lg w-full p-2 outline-0 outline-none resize-none"
            ref={ref}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/*<button*/}
        {/*  type="submit"*/}
        {/*  className="absolute bottom-2 right-2 flex items-center"*/}
        {/*>*/}
        {/*  {loading ? (*/}
        {/*    <div className="loading loading-spinner"></div>*/}
        {/*  ) : (*/}
        {/*    <BsFillSendArrowUpFill className="" />*/}
        {/*  )}*/}
        {/*</button>*/}
      </div>
    </form>
  )
}
export default MessageInput
