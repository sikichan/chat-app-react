import { useState } from "react"
import { LoginUser, ResponseError } from "@/types.ts"
import toast from "react-hot-toast"
import useAuthContext from "@/hooks/useAuthContext.ts"
import { request } from "@/fetch.ts"

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const logIn = async ({ username, password }: LoginUser) => {
    try {
      setLoading(true)
      const { data } = await request.post("/auth/login", { username, password })
      console.log(data)
      if (data.error) {
        return toast.error(data.error)
      }
      localStorage.setItem("chat-user", JSON.stringify(data))
      setAuthUser(data)
    } catch (error) {
      toast.error((error as ResponseError).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    logIn,
  }
}
export default useLogin
