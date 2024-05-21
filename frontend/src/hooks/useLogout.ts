import { useState } from "react"
import { request } from "@/fetch.ts"
import toast from "react-hot-toast"
import useAuthContext from "@/hooks/useAuthContext.ts"
import { ResponseError } from "@/types.ts"

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const logout = async () => {
    try {
      setLoading(true)
      const { data } = await request.post("/auth/logout", {})
      if (data.error) {
        return toast.error(data.error)
      }
      if (data.message) {
        toast.success(data.message)
      }
      localStorage.removeItem("chat-user")
      setAuthUser(null)
    } catch (error) {
      toast.error((error as ResponseError).message)
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
