import Conversation from "./Conversation.tsx"
import useGetConversations from "@/hooks/useGetConversations.ts"
import { UserModel } from "@/types.ts"
import { useEffect } from "react"
import useSocketContext from "@/hooks/useSocketContext.ts"

const Conversations = ({ searchKeyword }: { searchKeyword: string }) => {
  const { loading, conversations, setConversations } = useGetConversations({
    searchKeyword,
  })
  const { socket } = useSocketContext()
  useEffect(() => {
    if (socket) {
      socket.on("modify-avatar", (updatedUser) => {
        console.log("updatedUser:", updatedUser)
        setConversations((conversations) =>
          conversations.map((conversation) => {
            if (conversation._id === updatedUser._id) {
              return updatedUser
            } else {
              return conversation
            }
          }),
        )
      })
    }
  }, [socket])
  return (
    <div className="flex-auto overflow-auto">
      {loading ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : (
        <div className="py-2 flex flex-col overflow-auto">
          {conversations.map((conversation: UserModel, index: number) => (
            <Conversation
              conversation={conversation}
              lastIndex={index === conversations.length - 1}
              key={conversation._id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Conversations
