import UserForm from '@/components/UserForm.tsx'
import React, { useState } from 'react'
import { LoginUser } from '@/types.ts'
import useLogin from '@/hooks/useLogin.ts'
import toast from 'react-hot-toast'

const Login = () => {
  const { loading, logIn } = useLogin()
  const [user, setUser] = useState<LoginUser>({
    username: '',
    password: '',
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    })
  }
  const handleValidate = (): string => {
    if (!user.username.trim()) {
      return 'Username is required'
    }
    if (!user.password.trim()) {
      return 'Password is required'
    }
    if (user.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return ''
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const msg = handleValidate()
    if (msg) {
      return toast.error(msg)
    }
    await logIn(user)
  }
  return (
    <UserForm
      loading={loading}
      title={`Login`}
      user={user}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}
export default Login
