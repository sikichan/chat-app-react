import useAuthContext from '@/hooks/useAuthContext'
import {subtractTime} from '@/utils/formatTime.ts'
import useConversation from '@/zustand/useConversation'
import {MessageModel} from '@/types.ts'
import React, {useRef, useEffect} from 'react'

type Props = {
  message: MessageModel
  isSingleChat: boolean
  onWithdraw: (messageId: string, selectedConversationId: string) => void
  activeMessageId: string
  setActiveMessageId: (id: string) => void
}
const Message = ({
                   message,
                   isSingleChat,
                   onWithdraw,
                   activeMessageId,
                   setActiveMessageId
                 }: Props) => {
  const {authUser} = useAuthContext()
  const {selectedConversation} = useConversation()
  const fromMe = message.senderId === authUser?._id
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const avatar = fromMe ? authUser?.avatar : selectedConversation?.avatar
  const bubbleBgColor = fromMe ? 'bg-green' : ''
  const shakeClass = message.shouldShake ? 'shake' : ''
  const msgRef = useRef<HTMLDivElement | null>(null)
  const withdrawRef = useRef<HTMLDivElement | null>(null)
  const createdAt = new Date(message.createdAt).getTime()
  const currentTime = new Date().getTime()
  const canWithdraw =
    createdAt >= currentTime - 2 * 60 * 1000 && createdAt <= currentTime
  
  const formattedTime = subtractTime(message.createdAt)
  const handleWithdraw = () => {
    onWithdraw(message._id, selectedConversation!._id)
    setActiveMessageId('')
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
      setActiveMessageId('')
    }
  }
  
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  return (
    <div className="relative">
      <div className={`chat ${chatClassName}`}>
        {!isSingleChat ? (
          <div className="chat-image avatar online">
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS chat bubble component" src={avatar}/>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="chat-header text-gray-600">
          {fromMe ? 'me' : selectedConversation?.fullName}
        </div>
        <div
          className={`chat-bubble min-w-[86px] text-white ${bubbleBgColor} ${shakeClass} pb-2 ${
            fromMe ? 'cursor-pointer' : ''
          }`}
          onContextMenu={handleContextMenu}
          ref={msgRef}
        >
          {message.message as string}
          {activeMessageId === message._id && canWithdraw && (
            <div className="relative z-10" ref={withdrawRef}>
              <button
                className="absolute btn btn-xs font-thin flex"
                onClick={handleWithdraw}
              >
                撤回
              </button>
            </div>
          )}
          {/*  todo: implement more messageType*/}
        </div>
        
        <div
          className={
            'chat-footer z-[-1] opacity-50 text-xs text-gray-300 flex gap-1 items-center'
          }
        >
          {formattedTime}
        </div>
      </div>
    </div>
  )
}
export default Message
