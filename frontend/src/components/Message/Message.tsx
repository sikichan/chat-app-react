import useAuthContext from "@/hooks/useAuthContext"
import { subtractTime } from "@/utils/formatTime.ts"
import useConversation from "@/zustand/useConversation"
import { MessageModel } from "@/types.ts"
import React, { useEffect, useRef } from "react"
import useSocketContext from "@/hooks/useSocketContext.ts"

type Props = {
  message: MessageModel
  isSingleChat: boolean
  onWithdraw: (messageId: string, selectedConversationId: string) => void
  activeMessageId: string
  setActiveMessageId: (id: string) => void
}
const Message = ({
  message,
  isSingleChat = true,
  onWithdraw,
  activeMessageId,
  setActiveMessageId,
}: Props) => {
  const { authUser } = useAuthContext()
  const { selectedConversation } = useConversation()
  const fromMe = message.senderId === authUser?._id
  const chatClassName = fromMe ? "chat-end" : "chat-start"
  const avatar = fromMe ? authUser?.avatar : selectedConversation?.avatar
  const bubbleBgColor = fromMe ? "bg-green" : ""
  const shakeClass = message.shouldShake ? "shake" : ""
  const msgRef = useRef<HTMLDivElement | null>(null)
  const withdrawRef = useRef<HTMLDivElement | null>(null)
  const createdAt = new Date(message.createdAt).getTime()
  const currentTime = new Date().getTime()
  const canWithdraw =
    createdAt >= currentTime - 2 * 60 * 1000 && createdAt <= currentTime

  const { onlineUsers } = useSocketContext()
  const isOnline = fromMe
    ? "online"
    : onlineUsers && selectedConversation
      ? onlineUsers.includes(selectedConversation._id)
      : false
  const formattedTime = subtractTime(message.createdAt)
  const handleWithdraw = () => {
    onWithdraw(message._id, selectedConversation!._id)
    setActiveMessageId("")
  }
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setActiveMessageId(message._id)
  }
  const handleClickOutside = (event: MouseEvent) => {
    if (
      withdrawRef.current &&
      !withdrawRef.current.contains(event.target as Node)
    ) {
      setActiveMessageId("")
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])
  return (
    <div className="relative">
      <div className={`chat ${chatClassName}`}>
        <div className={`chat-image avatar  ${isOnline ? "online" : ""}`}>
          <div className={`w-10 rounded-full`}>
            <img alt="avatar" src={avatar} />
          </div>
        </div>
        {!isSingleChat && (
          <div className="chat-header text-gray-300">
            {fromMe ? "me" : selectedConversation?.fullName}
          </div>
        )}
        <div className="relative">
          <div
            className={`chat-bubble text-sm text-white ${bubbleBgColor} ${shakeClass} pb-2 ${
              fromMe ? "cursor-pointer" : ""
            }`}
            onContextMenu={handleContextMenu}
            ref={msgRef}
          >
            {message.message as string}
            {authUser?._id === message.senderId &&
              activeMessageId === message._id &&
              canWithdraw && (
                <div
                  className="absolute z-10 left-0 bottom-0"
                  ref={withdrawRef}
                >
                  <button
                    className="btn btn-xs font-thin"
                    onClick={handleWithdraw}
                  >
                    撤回
                  </button>
                </div>
              )}
            {/*  todo: implement more messageType*/}
          </div>
        </div>
        <div
          className={
            "chat-footer opacity-50 text-xs text-gray-300 flex items-center"
          }
        >
          {formattedTime}
        </div>
      </div>
    </div>
  )
}
export default Message
