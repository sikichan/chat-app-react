import React, { useEffect, useRef, useState } from "react"
import useSendMessage from "@/hooks/useSendMessage"
import useConversation from "@/zustand/useConversation.ts"
import EmojiPicker from "emoji-picker-react"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import { BsFillSendArrowUpFill } from "react-icons/bs"

const MessageInput = () => {
  const [message, setMessage] = useState("")
  const { loading, sendMessage } = useSendMessage()
  const { selectedConversation } = useConversation()
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const ref = useRef<HTMLInputElement>(null)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return
    await sendMessage(message)
    setMessage("")
  }
  const handleEmojiClick = ({ emoji }: { emoji: string }) => {
    setMessage((prev) => prev.concat(emoji))
    setShowEmojiPicker(false)
    ref.current?.focus()
  }
  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [selectedConversation?._id])

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className={`${showEmojiPicker ? "" : "hidden"}`}>
        <EmojiPicker
          lazyLoadEmojis={true}
          autoFocusSearch={false}
          onEmojiClick={handleEmojiClick}
        />
      </div>
      <div className="w-full relative">
        <div className="relative">
          <MdOutlineEmojiEmotions
            className="absolute h-full w-[38px] pl-2 cursor-pointer text-orange hover:text-yellow"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          <input
            type="text"
            className="border text-md rounded-lg block w-full p-3 border-gray-600 px-9"
            placeholder="Send a message"
            ref={ref}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsFillSendArrowUpFill className="w-[40px] text-dark-green hover:text-green" />
          )}
        </button>
      </div>
    </form>
  )
}
export default MessageInput
