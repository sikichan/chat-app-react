import { useState } from 'react'
import { Fetch } from '@/fetch'
import toast from 'react-hot-toast'
import useConversation from '@/zustand/useConversation'
import { MessageType } from '@/types'
const useSendMessage = () => {
  const [loading, setLoading] = useState(false)
  const { selectedConversation } = useConversation()
  const sendMessage = async (message: object | string) => {
    try {
      setLoading(true)
      const data = await Fetch({
        url: `/api/messages/send/${selectedConversation?._id}`,
        method: 'POST',
        body: {
          message,
          MessageType: MessageType.text,
        },
      })
      if (data.error) {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  return {
    loading,
    sendMessage,
  }
}
export default useSendMessage
