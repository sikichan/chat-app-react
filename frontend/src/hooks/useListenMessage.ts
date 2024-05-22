import useSocketContext from "@/hooks/useSocketContext.ts"
import useConversation from "@/zustand/useConversation.ts"
import { useEffect } from "react"
import { MessageModel } from "@/types.ts"
import notice from "@/assets/notice.wav"
import useAuthContext from "@/hooks/useAuthContext.ts"
import toast from "react-hot-toast"

const useListenMessage = () => {
  const { socket } = useSocketContext()
  const { messages, setMessages, selectedConversation } = useConversation()
  const { authUser } = useAuthContext()
  useEffect(() => {
    socket?.on("new-message", (newMessage: MessageModel) => {
      if (newMessage.senderId === selectedConversation?._id) {
        // in chatting
        newMessage.shouldShake = true
      }
      if (newMessage.receiverId === authUser?._id) {
        // out chatting
        console.log(newMessage, "new!!")
        const audio = new Audio(notice)
        audio?.play().catch((err) => console.log(err))
        toast("你有一条新消息", {
          position: "top-right",
          duration: 1500,
        })
      }
      if (
        selectedConversation &&
        [newMessage.senderId, newMessage.receiverId].includes(
          selectedConversation._id,
        )
      ) {
        setMessages([...messages, newMessage])
      }
    })
    // }

    return () => {
      socket?.off("new-message")
    }
  }, [socket, messages])
}
export default useListenMessage
