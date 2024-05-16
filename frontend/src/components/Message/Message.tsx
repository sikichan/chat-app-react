import useAuthContext from '@/hooks/useAuthContext'
import { subtractTime } from '@/utils/formatTime.ts'
import useConversation from '@/zustand/useConversation'
import { MessageModel } from '@/types.ts'
import React, { useState, useRef, useEffect } from 'react'

type Props = {
  message: MessageModel
  isSingleChat: boolean
  onWithdraw: (messageId: string) => void
  activeMessageId: string
  setActiveMessageId: (id: string) => void
}
const Message = ({ message, isSingleChat }: Props) => {
  const { authUser } = useAuthContext()
  const { selectedConversation } = useConversation()
  const fromMe = message.senderId === authUser?._id
  const formattedTime = subtractTime(message.createdAt)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const avatar = fromMe ? authUser?.avatar : selectedConversation?.avatar
  const bubbleBgColor = fromMe ? 'bg-green' : ''
  const shakeClass = message.shouldShake ? 'shake' : ''
  const msgRef = useRef<HTMLDivElement | null>(null)
  const withdrawRef = useRef<HTMLDivElement | null>(null)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const handleWithdraw = () => {
    setShowWithdraw(false)
    console.log('handleWithdraw', message.message)
  }
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    console.log(msgRef.current)
    setShowWithdraw(() => false)
    setShowWithdraw(true)
    if (msgRef.current && withdrawRef.current) {
      const rect = msgRef.current.getBoundingClientRect()
      withdrawRef.current.style.left = `${rect.width + 100}px`
      withdrawRef.current.style.top = `${rect.height}px`
    }
  }
  const handleClickOutside = (event: MouseEvent) => {
    if (
      withdrawRef.current &&
      !withdrawRef.current.contains(event.target as Node)
    ) {
      setShowWithdraw(false)
    }
  }

  useEffect(() => {
    setShowWithdraw(false)
  }, [msgRef])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  return (
    <div className=''>
      <div className={`chat ${chatClassName}`}>
        {!isSingleChat ? (
          <div className='chat-image avatar online'>
            <div className='w-10 rounded-full'>
              <img alt='Tailwind CSS chat bubble component' src={avatar} />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className='chat-header text-gray-600'>
          {fromMe ? 'me' : selectedConversation?.fullName}
        </div>
        <div
          className={`relative chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 overflow-hidden`}
          ref={msgRef}
          onContextMenu={handleContextMenu}
          onBlur={() => {
            setShowWithdraw(false)
          }}
        >
          {message.message as string}
          {showWithdraw && (
            <div className='absolute z-10 bottom-0' ref={withdrawRef}>
              <button className='btn btn-xs' onClick={handleWithdraw}>
                withdraw
              </button>
            </div>
          )}
          {/*  todo: implement more messageType*/}
        </div>

        <div className='chat-footer opacity-50 text-xs text-gray-300 flex gap-1 items-center'>
          {formattedTime}
        </div>
      </div>
    </div>
  )
}
export default Message
