import { useEffect, useState } from "react"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import useConversation from "@/zustand/useConversation.ts"
import { ResponseError, ResponseMessages } from "@/types.ts"

const limit = 10
const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const { selectedConversation, messages, setMessages } = useConversation()

  const fetchMessages = async (page: number) => {
    try {
      setLoading(true)
      const response: ResponseMessages = await request.get(
        `/messages/${selectedConversation?._id}?page=${page}`,
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
      setLoading(false)
    }
  }

  const loadMore = async (page: number) => {
    const data = await fetchMessages(page)
    if (data.length < limit) {
      setHasMore(false)
    } else {
      setHasMore(true)
      setPage(page + 1)
    }
    setMessages(data)
  }

  useEffect(() => {
    if (selectedConversation) {
      setMessages([])
      setHasMore(true)
      setPage(1)
      loadMore(1)
    }
  }, [selectedConversation])

  return {
    loading,
    messages,
    hasMore,
    loadMore,
    page,
  }
}
export default useGetMessages
