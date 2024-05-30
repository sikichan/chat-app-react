import useGetMessages from "@/hooks/useGetMessages.ts"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Message from "@/components/Message/Message.tsx"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import { MessageModel, ResponseError } from "@/types.ts"
import useConversation from "@/zustand/useConversation.ts"
import useSocketContext from "@/hooks/useSocketContext.ts"
import useAuthContext from "@/hooks/useAuthContext.ts"
import InfiniteScroll from "react-infinite-scroll-component"
import { throttle } from "@/utils/throttle-debounce.ts"

const Messages = () => {
  const { messages, loadMore, hasMore, fetching } = useGetMessages()
  const [activeMessageId, setActiveMessageId] = useState("")
  const { socket } = useSocketContext()
  const { authUser } = useAuthContext()
  const { setMessages, selectedConversation } = useConversation()
  const scrollParentRef = useRef<HTMLDivElement>(null)
  const bottomMsg = messages[0]
  const topMsg = messages[messages.length - 1]
  const [parentScrollTop, setParentScrollTop] = useState<number>(0)
  const handleLoadMore = async () => {
    if (!scrollParentRef.current) return
    const topMessage = messages[messages.length - 1]
    if (!topMessage) return
    if (scrollParentRef.current.scrollTop === 0) {
      if (hasMore && !fetching) {
        const hasMore = await loadMore(
          new Date(topMessage.createdAt).getTime(),
          false,
        )
        if (hasMore) {
          scrollParentRef.current.scrollTop = parentScrollTop
        }
      }
    }
  }

  const handleWithdraw = async (id: string, selectedConversationId: string) => {
    try {
      const { data } = await request.delete(`/messages/withdraw/${id}`, {
        params: {
          receiverId: selectedConversationId,
          isGroup: selectedConversation?.isGroup,
          groupId: selectedConversationId,
        },
      })
      setMessages(messages.filter((m) => m._id !== data.id))
      toast.success("消息撤回成功")
    } catch (error) {
      toast.error((error as ResponseError).message)
    }
  }
  useEffect(() => {
    if (selectedConversation?.isGroup) {
      socket?.emit("join-room", selectedConversation?._id)
    }
    return () => {
      socket?.off("join-room")
      socket?.emit("leave-room", selectedConversation?._id)
    }
  }, [selectedConversation])
  useEffect(() => {
    if (!scrollParentRef.current || !bottomMsg) return
    scrollParentRef.current.scrollTop = scrollParentRef.current.scrollHeight
    setParentScrollTop(scrollParentRef.current.scrollTop)
  }, [selectedConversation, bottomMsg])

  useLayoutEffect(() => {
    if (!scrollParentRef.current || !topMsg) return

    scrollParentRef.current.scrollTop =
      parentScrollTop + scrollParentRef.current.clientHeight - 30
  }, [topMsg, scrollParentRef.current?.scrollHeight, parentScrollTop])

  useEffect(() => {
    socket?.on("withdraw-message", (deletedMessage: MessageModel) => {
      if (
        !selectedConversation?.isGroup &&
        deletedMessage.receiverId === authUser!._id &&
        deletedMessage.senderId._id === selectedConversation!._id
      ) {
        setMessages(messages.filter((m) => m._id !== deletedMessage._id))
        toast("对方撤回了一条消息", {
          icon: "👈",
        })
      } else if (
        selectedConversation?.isGroup &&
        deletedMessage.senderId._id !== authUser?._id
      ) {
        setMessages(messages.filter((m) => m._id !== deletedMessage._id))
        toast(`${deletedMessage.senderId.fullName}撤回了一条消息`, {
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
        onScroll={throttle(handleLoadMore)}
        dataLength={messages.length}
        next={throttle(handleLoadMore)}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        hasMore={hasMore}
        endMessage={
          <p className="text-center mb-2 text-xs">-- 没有更多消息了 --</p>
        }
        scrollThreshold={0.9}
        scrollableTarget="scrollableDiv"
        loader={<p className="text-center">加载中...</p>}
      >
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            isSingleChat={!selectedConversation?.isGroup}
            onWithdraw={handleWithdraw}
            activeMessageId={activeMessageId}
            setActiveMessageId={setActiveMessageId}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}
export default Messages
