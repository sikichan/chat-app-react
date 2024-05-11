import {useState} from 'react'
import {LoginUser} from '@/types.ts'
import {Fetch} from '@/fetch.ts'
import toast from 'react-hot-toast'
import useAuthContext from '@/hooks/useAuthContext.ts'

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const {setAuthUser} = useAuthContext()
  const logIn = async ({username, password}: LoginUser) => {
    try {
      setLoading(true)
      const data = await Fetch({
        url: '/api/auth/login',
        body: {username, password},
        method: 'POST'
      })
      console.log(data)
      if (data.error) {
        return toast.error(data.error)
      }
      localStorage.setItem('chat-user', JSON.stringify(data))
      setAuthUser(data)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  
  return {
    loading,
    logIn
  }
}
export default useLogin
