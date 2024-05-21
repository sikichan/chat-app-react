import { useEffect, useState } from "react"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import useConversation from "@/zustand/useConversation.ts"
import { ResponseError } from "@/types.ts"

const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const { selectedConversation, messages, setMessages } = useConversation()
  useEffect(() => {
    setLoading(true)
    const fetchMessages = async () => {
      try {
        const { data } = await request.get(
          `/messages/${selectedConversation?._id}`,
        )
        if (data.error) {
          return toast.error(data.error)
        }
        setMessages(data)
      } catch (error) {
        toast.error((error as ResponseError).message)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [selectedConversation?._id])
  return {
    loading,
    messages,
  }
}
export default useGetMessages
