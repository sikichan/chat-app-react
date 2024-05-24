import useGetMessages from "@/hooks/useGetMessages.ts"
import { useEffect, useRef, useState } from "react"
import Message from "@/components/Message/Message.tsx"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import { MessageModel, ResponseError } from "@/types.ts"
import useConversation from "@/zustand/useConversation.ts"
import useSocketContext from "@/hooks/useSocketContext.ts"
import useAuthContext from "@/hooks/useAuthContext.ts"
import InfiniteScroll from "react-infinite-scroll-component"

const Messages = () => {
  const { messages, loadMore, hasMore, fetching } = useGetMessages()
  const [activeMessageId, setActiveMessageId] = useState("")
  const { socket } = useSocketContext()
  const { authUser } = useAuthContext()
  const { setMessages, selectedConversation } = useConversation()
  const scrollParentRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<number>(0)
  const handleLoadMore = async () => {
    if (!scrollParentRef.current) return
    const topMessage = messages[messages.length - 1]
    if (!topMessage) return
    if (scrollParentRef.current.scrollTop === 0) {
      setPage((page) => page + 1)
      if (hasMore && !fetching) {
        await loadMore(new Date(topMessage.createdAt).getTime(), false)
      }
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
    lastMsg.style.height = "10px"
    scrollParentRef.current?.appendChild(lastMsg)
    lastMsg.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    // setLoading((prev) => (prev ? !prev : prev))
    return () => {
      scrollParentRef.current?.removeChild(lastMsg)
    }
  }, [selectedConversation, messages])

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
      id="scrollableDiv"
      className="px-2 flex-1 overflow-auto"
      ref={scrollParentRef}
    >
      <InfiniteScroll
        onScroll={handleLoadMore}
        dataLength={messages.length}
        next={handleLoadMore}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        hasMore={hasMore}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
        loader={
          <div
            className="flex items-center text-[11px] justify-center pt-2"
            key={0}
          >
            <span className="loading loading-spinner mr-2 text-sm" />
            Loading...
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
