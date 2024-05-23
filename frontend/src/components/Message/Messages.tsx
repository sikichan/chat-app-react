import useGetMessages from "@/hooks/useGetMessages.ts"
import { useEffect, useRef, useState } from "react"
import Message from "@/components/Message/Message.tsx"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import { MessageModel, ResponseError } from "@/types.ts"
import useConversation from "@/zustand/useConversation.ts"
import useSocketContext from "@/hooks/useSocketContext.ts"
import useAuthContext from "@/hooks/useAuthContext.ts"
import InfiniteScroll from "react-infinite-scroller"

const Messages = () => {
  const { messages, loadMore, hasMore, fetching } = useGetMessages()
  const [activeMessageId, setActiveMessageId] = useState("")
  const { socket } = useSocketContext()
  const { authUser } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const { setMessages, selectedConversation } = useConversation()
  const scrollParentRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<number>(0)
  const lastMessageId = messages[messages.length - 1]
  const handleLoadMore = async () => {
    if (!scrollParentRef.current) return
    if (loading && scrollParentRef.current.scrollTop > 0 && loading) return

    if (scrollParentRef.current.scrollTop === 0) {
      setLoading((prev) => (prev ? prev : !prev))
      setPage((page) => page + 1)
      if (hasMore && loading && !fetching) {
        setLoading((prev) => (prev ? !prev : prev))
        await loadMore(new Date(messages[0]?.createdAt).getTime(), false)
      }
    } else {
      setLoading((prev) => (prev ? !prev : prev))
    }
  }

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

  useEffect(() => {
    if (messages.length === 0 || page > 0) return
    const lastMsg = document.createElement("div")
    scrollParentRef.current?.appendChild(lastMsg)
    lastMsg.scrollIntoView({
      behavior: "smooth",
    })
    setLoading((prev) => (prev ? !prev : prev))
    return () => {
      scrollParentRef.current?.removeChild(lastMsg)
    }
  }, [selectedConversation, messages])

  useEffect(() => {
    const lastMsg = document.createElement("div")
    scrollParentRef.current?.appendChild(lastMsg)
    lastMsg.scrollIntoView({
      behavior: "instant",
    })
    return () => {
      scrollParentRef.current?.removeChild(lastMsg)
    }
  }, [lastMessageId])
  useEffect(() => {
    setPage(0)
  }, [selectedConversation])

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
    <div
      className="px-4 flex-1 overflow-auto"
      ref={scrollParentRef}
      onScroll={handleLoadMore}
    >
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMore}
        hasMore={hasMore}
        isReverse={true}
        useWindow={false}
        initialLoad={false}
        loader={
          <div
            className="flex items-center text-[11px] justify-center pt-2"
            key={0}
          >
            <span className="loading loading-spinner mr-2 text-sm" />
            加载中...
          </div>
        }
      >
        {messages.map((message) => (
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
      </InfiniteScroll>
    </div>
  )
}
export default Messages
