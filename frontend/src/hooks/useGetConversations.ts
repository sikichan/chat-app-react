import {useEffect, useState} from 'react';
import {Fetch} from '@/fetch.ts';
import toast from 'react-hot-toast';
import {UserModel} from '@/types.ts';

const useGetConversations = ({needFetch = true, searchKeyword = ''}) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<UserModel[]>([]);
  const fetchConversations = async () => {
    try {
      setLoading(true)
      const data = await Fetch({
        url: '/api/users',
        method: 'GET'
      })
      console.log(data)
      if (data.error) {
        return toast.error(data.error)
      }
      setConversations(data as UserModel[])
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (searchKeyword?.trim() === '' && needFetch) fetchConversations()
  }, []);
  
  const filteredConversations = searchKeyword?.trim() !== ''
    ? conversations.filter((conversation) =>
      conversation.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    : conversations;
  
  return {
    loading,
    conversations: filteredConversations,
    setConversations
  }
}
export default useGetConversations;