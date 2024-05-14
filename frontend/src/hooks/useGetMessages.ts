import {useEffect, useState} from 'react';
import {Fetch} from '@/fetch.ts';
import toast from 'react-hot-toast';
import {MessageModel} from '@/types.ts';
import useConversation from '@/zustand/useConversation.ts';

const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const {selectedConversation} = useConversation()
  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      try {
        const data = await Fetch({
          url: `/api/messages/${selectedConversation?._id}`,
          method: 'GET'
        })
        if (data.error) {
          return toast.error(data.error)
        }
        console.log(data)
        setMessages(data)
      } catch (error) {
        toast.error((error as Error).message)
      } finally {
        setLoading(false);
      }
    }
    fetchMessages()
  }, [selectedConversation?._id])
  return {
    loading,
    messages
  }
}
export default useGetMessages