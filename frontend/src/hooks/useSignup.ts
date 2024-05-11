import {useState} from 'react'
import {SignupUser} from '@/types.ts'
import {Fetch} from '@/fetch.ts'
import toast from 'react-hot-toast'
import useAuthContext from '@/hooks/useAuthContext.ts';

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const {setAuthUser} = useAuthContext()
  const signUp = async ({fullName, gender, username, password, confirmedPassword}: SignupUser) => {
    try {
      setLoading(true)
      const data = await Fetch({
        url: '/api/auth/signup',
        body: {fullName, gender, username, password, confirmedPassword},
        method: 'POST'
      })
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
    signUp
  }
}
export default useSignup