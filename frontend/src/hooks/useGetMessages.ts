import { useEffect, useState } from "react"
import { request } from "@/fetch.ts"
import useConversation from "@/zustand/useConversation.ts"
import { MessageModel, ResponseMessages } from "@/types.ts"

const limit = 10
const useGetMessages = () => {
  const [fetching, setFetching] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const { selectedConversation, messages, setMessages, clearMessages } =
    useConversation()

  const fetchMessages = async (createdAt: number): Promise<MessageModel[]> => {
    try {
      setFetching(true)
      if (!selectedConversation) return []
      if (abortController) abortController.abort()
      const url = `/messages/${selectedConversation._id}?createdAt=${createdAt}`
      const newAbortController = new AbortController()
      setAbortController(newAbortController)
      const response: ResponseMessages = await request.get(
        selectedConversation.isGroup
          ? `${url}&isGroup=${selectedConversation.isGroup}`
          : url,
        { signal: newAbortController.signal },
      )
      const { data: dataMessages } = response
      return dataMessages || []
    } catch (error) {
      // toast.error((error as ResponseError).message)
      console.log("error", error)
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
