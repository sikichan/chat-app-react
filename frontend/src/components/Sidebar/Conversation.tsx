import { ConversationModel } from "@/types.ts"
import reactLogo from "@/assets/react.svg"
import useConversation from "@/zustand/useConversation.ts"
import useSocketContext from "@/hooks/useSocketContext.ts"
import { BiSolidGroup } from "react-icons/bi"

type Props = {
  conversation: ConversationModel
  lastIndex: boolean
}
const Conversation = ({ conversation, lastIndex }: Props) => {
  const { fullName, isGroup, groupName, avatar, _id: receiverId } = conversation
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { onlineUsers } = useSocketContext()
  const handleClick = () => {
    setSelectedConversation(conversation)
  }
  const isOnline = onlineUsers?.includes(conversation._id)
  return (
    <>
      <div
        className={"flex gap-1 p-2 items-center rounded cursor-pointer transition ease-in-out duration-500 ".concat(
          receiverId === selectedConversation?._id ? "selected-to-chat" : "",
        )}
        onClick={handleClick}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          {
            <div className={`w-10 rounded-full ring`}>
              {isGroup ? (
                <BiSolidGroup className="w-full h-full p-2" />
              ) : (
                <img
                  src={avatar}
                  onError={(event) => {
                    console.log(event)
                    event.currentTarget.src = reactLogo
                  }}
                  alt="user avatar"
                />
              )}
            </div>
          }
        </div>
        <div className="flex justify-between items-center flex-1">
          <p className="font-bold ml-1">
            {isGroup
              ? groupName + `(${conversation.members?.length}人)`
              : fullName}
          </p>
          {/*<RedDot>99+</RedDot>*/}
          {/*  todo: red dot*/}
        </div>
      </div>
      {!lastIndex && <div className="border-base-100"></div>}
    </>
  )
}
export default Conversation
