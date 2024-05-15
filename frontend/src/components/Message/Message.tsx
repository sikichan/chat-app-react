import useAuthContext from '@/hooks/useAuthContext'
import {subtractTime} from '@/utils/formatTime.ts'
import useConversation from '@/zustand/useConversation'
import {MessageModel} from '@/types.ts'

const Message = (message: MessageModel) => {
  const {authUser} = useAuthContext()
  const {selectedConversation} = useConversation()
  const fromMe = message.senderId === authUser?._id
  const formattedTime = subtractTime(message.createdAt)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const avatar = fromMe
    ? authUser?.avatar
    : selectedConversation?.avatar
  const bubbleBgColor = fromMe ? 'bg-green' : ''
  
  const shakeClass = message.shouldShake ? 'shake' : ''
  
  return (
    <div className={`chat ${chatClassName}`}>
      
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={avatar}/>
        </div>
      </div>
      <div className="chat-header text-gray-600">
        {fromMe ? 'me' : selectedConversation?.fullName}
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
      >
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs text-gray-300 flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  )
}
export default Message
