import useGetMessages from "@/hooks/useGetMessages.ts"
import MessageSkeleton from "@/components/MessageSkeleton"
import { useEffect, useRef, useState } from "react"
import Message from "@/components/Message/Message.tsx"
import useListenMessage from "@/hooks/useListenMessage.ts"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import useConversation from "@/zustand/useConversation.ts"
import { ResponseError } from "@/types.ts"

const Messages = () => {
  const { messages, loading } = useGetMessages()
  const [activeMessageId, setActiveMessageId] = useState("")
  const { setMessages } = useConversation()
  useListenMessage()
  const handleWithdraw = async (id: string, selectedConversationId: string) => {
    console.log(id)
    try {
      const { data } = await request.delete(`/messages/withdraw/${id}`, {
        params: { receiverId: selectedConversationId },
      })
      if (data.error) {
        return toast.error(data.error)
      }
      setMessages(messages.filter((m) => m._id !== data.id))
      toast.success(data.message)
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
