import useGetMessages from "@/hooks/useGetMessages.ts"
import MessageSkeleton from "@/components/MessageSkeleton"
import { useEffect, useRef, useState } from "react"
import Message from "@/components/Message/Message.tsx"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import { MessageModel, ResponseError } from "@/types.ts"
import useConversation from "@/zustand/useConversation.ts"
import useSocketContext from "@/hooks/useSocketContext.ts"
import useAuthContext from "@/hooks/useAuthContext.ts"

const Messages = () => {
  const { messages, loading } = useGetMessages()
  const [activeMessageId, setActiveMessageId] = useState("")
  const { socket } = useSocketContext()
  const { authUser } = useAuthContext()
  const { setMessages, selectedConversation } = useConversation()

  const handleWithdraw = async (id: string, selectedConversationId: string) => {
    try {
      const { data } = await request.delete(`/messages/withdraw/${id}`, {
        params: { receiverId: selectedConversationId },
      })
      if (data.error) {
        return toast.error(data.error)
      }
      setMessages(messages.filter((m) => m._id !== data.id))
      toast.success("消息撤回成功")
    } catch (error) {
      toast.error((error as ResponseError).message)
    }
  }
  const lastMessageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const timerId = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
      })
    }, 100)
    return () => {
      clearTimeout(timerId)
    }
  }, [messages])
  useEffect(() => {
    socket?.on("withdraw-message", (deletedMessage: MessageModel) => {
      if (
        deletedMessage.receiverId === authUser!._id &&
        deletedMessage.senderId === selectedConversation!._id
      ) {
        setMessages(messages.filter((m) => m._id !== deletedMessage._id))
        toast("对方撤回了一条消息", {
          icon: "👈",
        })
      }
    })
    return () => {
      socket?.off("withdraw-message")
    }
  }, [socket, selectedConversation, messages])
  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id}>
            <Message
              message={message}
              isSingleChat={true}
              onWithdraw={handleWithdraw}
              activeMessageId={activeMessageId}
              setActiveMessageId={setActiveMessageId}
            />
          </div>
        ))}
      <div ref={lastMessageRef}></div>

      {loading &&
        [...new Array(5)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  )
}
export default Messages
