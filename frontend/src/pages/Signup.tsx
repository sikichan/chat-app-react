import UserForm from '../components/UserForm.tsx'
import React, { useState } from 'react'
import { SignupUser } from '../types.ts'
import useSignup from '@/hooks/useSignup.ts'
import toast from 'react-hot-toast'

const Signup = () => {
  const [user, setUser] = useState<SignupUser>({
    username: '',
    password: '',
    fullName: '',
    confirmedPassword: '',
    gender: 'girl',
  })
  const { loading, signUp } = useSignup()
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    })
  }
  const handleGender = (gender: 'boy' | 'girl') => {
    setUser({
      ...user,
      gender,
    })
  }
  const handleValidate = (): string => {
    if (!user.fullName.trim()) {
      return 'Chinese Name is required'
    }
    if (!user.username.trim()) {
      return 'Username is required'
    }
    if (!user.password.trim()) {
      return 'Password is required'
    }
    if (user.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    if (user.confirmedPassword !== user.password) {
      return 'Confirmed Password must be equal to Password'
    }
    return ''
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const msg = handleValidate()
    if (msg) {
      return toast.error(msg)
    }
    await signUp(user)
  }
  return (
    <UserForm
      title={`Signup`}
      loading={loading}
      user={user}
      handleChange={handleChange}
      handleGender={handleGender}
      handleSubmit={handleSubmit}
    />
  )
}
export default Signup
