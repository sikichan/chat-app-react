import {useEffect, useState} from 'react';
import {Fetch} from '@/fetch.ts';
import toast from 'react-hot-toast';
import {UserModel} from '@/types.ts';

const useGetConversations = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<UserModel[]>([]);
  
  useEffect(() => {
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
        setConversations(data)
      } catch (error) {
        toast.error((error as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
    return setConversations([])
  }, []);
  return {
    loading,
    conversations,
    setConversations
  }
}
export default useGetConversations;