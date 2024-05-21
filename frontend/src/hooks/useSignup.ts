import { useState } from "react"
import { ResponseError, SignupUser } from "@/types.ts"
import toast from "react-hot-toast"
import useAuthContext from "@/hooks/useAuthContext.ts"
import { request } from "@/fetch.ts"

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const signUp = async ({
    fullName,
    gender,
    username,
    password,
    confirmedPassword,
  }: SignupUser) => {
    try {
      setLoading(true)
      const { data } = await request.post("auth/signup", {
        fullName,
        gender,
        username,
        password,
        confirmedPassword,
      })
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
    signUp,
  }
}
export default useSignup
