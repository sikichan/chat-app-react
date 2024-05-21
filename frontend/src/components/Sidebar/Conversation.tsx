import { UserModel } from "@/types.ts"
import reactLogo from "@/assets/react.svg"
import useConversation from "@/zustand/useConversation.ts"
import useSocketContext from "@/hooks/useSocketContext.ts"

type Props = {
  conversation: UserModel
  lastIndex: boolean
}
const Conversation = ({ conversation, lastIndex }: Props) => {
  const { fullName, avatar, gender, _id: receiverId } = conversation
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { onlineUsers } = useSocketContext()
  const handleClick = () => {
    setSelectedConversation(conversation)
  }
  const isOnline = onlineUsers?.includes(conversation._id)
  return (
    <>
      <div
        className={"flex gap-2 items-center text-gray-300 hover:bg-yellow-light hover:text-black rounded p-2 py-1 cursor-pointer transition ease-in-out duration-500 ".concat(
          receiverId === selectedConversation?._id ? "selected-to-chat" : "",
        )}
        onClick={handleClick}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          {
            <div className={`w-10 rounded-full ring`}>
              <img
                src={avatar}
                onError={(event) => {
                  console.log(event)
                  event.currentTarget.src = reactLogo
                }}
                alt="user avatar"
              />
            </div>
          }
        </div>
        <div className="flex flex-1 justify-between">
          <p className="font-bold">{fullName}</p>
          <div>{gender === "boy" ? "👦🏻" : "👧🏻"}</div>
        </div>
      </div>
      {!lastIndex && <div className="border-base-100"></div>}
    </>
  )
}
export default Conversation
