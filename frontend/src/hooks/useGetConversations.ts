import {useEffect, useState} from 'react';
import {Fetch} from '@/fetch.ts';
import toast from 'react-hot-toast';
import {UserModel} from '@/types.ts';

const useGetConversations = (searchKeyword: string) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<UserModel[]>([]);
  // const search = (fullName: string) => {
  //   console.log(fullName, 'search')
  //   setLoading(true);
  //   const results = conversations.filter(item => item.fullName.toLowerCase().includes(fullName.toLowerCase()));
  //   console.log(results);
  //   setLoading(false);
  // }
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
    if (searchKeyword?.trim() === '') fetchConversations()
  }, [searchKeyword]);
  
  const filteredConversations = searchKeyword
    ? conversations.filter((conversation) =>
      conversation.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    : conversations;
  
  return {
    loading,
    conversations: filteredConversations
  }
}
export default useGetConversations;