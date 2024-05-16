import { useState } from 'react'
import { AuthedFetch } from '@/fetch.ts'
import toast from 'react-hot-toast'
import useAuthContext from '@/hooks/useAuthContext.ts'

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const logout = async () => {
    try {
      setLoading(true)
      const data = await AuthedFetch({
        url: '/api/auth/logout',
        method: 'POST',
      })
      console.log(data, 'logout')
      if (data.error) {
        return toast.error(data.error)
      }
      if (data.message) {
        toast.success(data.message)
      }
      localStorage.removeItem('chat-user')
      setAuthUser(null)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  return {
    loading,
    logout,
  }
}
export default useLogout
