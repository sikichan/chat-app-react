import { useEffect, useState } from "react"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import useConversation from "@/zustand/useConversation.ts"
import { ResponseError, ResponseMessages } from "@/types.ts"

const limit = 10
const useGetMessages = () => {
  const [fetching, setFetching] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const { selectedConversation, messages, setMessages, clearMessages } =
    useConversation()

  const fetchMessages = async (createdAt: number) => {
    try {
      setFetching(true)
      const response: ResponseMessages = await request.get(
        `/messages/${selectedConversation?._id}?createdAt=${createdAt}`,
      )
      const { data: dataMessages, error } = response
      if (error) {
        toast.error(error)
        return []
      }
      return dataMessages || []
    } catch (error) {
      toast.error((error as ResponseError).message)
      return []
    } finally {
      setFetching(false)
    }
  }

  const loadMore = async (createdAt: number, changeChat: boolean) => {
    if (Number.isNaN(createdAt)) {
      createdAt = new Date().getTime()
    }
    const data = await fetchMessages(createdAt)
    if (data.length < limit) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    if (changeChat) {
      setMessages(data)
    } else {
      const total = [...messages, ...data]
      setMessages(total)
    }
    return !(data.length < limit)
  }

  useEffect(() => {
    clearMessages()
    // setHasMore(true)
    loadMore(new Date().getTime(), true)
    return () => {
      clearMessages()
    }
  }, [selectedConversation])

  return {
    fetching,
    messages,
    hasMore,
    loadMore,
  }
}
export default useGetMessages
