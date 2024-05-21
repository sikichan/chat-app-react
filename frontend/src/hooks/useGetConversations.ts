import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ResponseError, UserModel } from "@/types.ts"
import { request } from "@/fetch.ts"

const useGetConversations = ({ needFetch = true, searchKeyword = "" }) => {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<UserModel[]>([])
  const fetchConversations = async () => {
    try {
      setLoading(true)
      const { data } = await request.get("/users")
      console.log(data)
      if (data.error) {
        return toast.error(data.error)
      }
      setConversations(data as UserModel[])
    } catch (error) {
      toast.error((error as ResponseError).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (searchKeyword?.trim() === "" && needFetch) fetchConversations()
  }, [])

  const filteredConversations =
    searchKeyword?.trim() !== ""
      ? conversations.filter((conversation) =>
          conversation.fullName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()),
        )
      : conversations

  return {
    loading,
    conversations: filteredConversations,
    setConversations,
  }
}
export default useGetConversations
