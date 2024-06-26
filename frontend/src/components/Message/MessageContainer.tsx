import useAuthContext from "@/hooks/useAuthContext.ts"
import { BiSolidMessageRoundedDots } from "react-icons/bi"
import Messages from "./Messages.tsx"
import MessageInput from "./MessageInput.tsx"
import useConversation from "@/zustand/useConversation.ts"
import useListenMessage from "@/hooks/useListenMessage.ts"

const MessageContainer = () => {
  const { selectedConversation } = useConversation()
  useListenMessage()
  return (
    <div className="w-full flex flex-col pl-4">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="px-4 py-2 mb-2 rounded flex items-center gap-2">
            <span className="text-gray-200 font-bold flex-1">
              {selectedConversation.fullName || selectedConversation.groupName}
            </span>
          </div>
          <Messages />
          <MessageInput key={selectedConversation._id} />
        </>
      )}
    </div>
  )
}
const NoChatSelected = () => {
  const { authUser } = useAuthContext()
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👏🏻 {authUser!.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <BiSolidMessageRoundedDots className="text-3xl md:text-4xl text-center text-green" />
      </div>
    </div>
  )
}

export default MessageContainer
