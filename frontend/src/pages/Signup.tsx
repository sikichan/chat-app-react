import UserForm from '../components/UserForm.tsx'
import React, {useState} from 'react'
import {SignupUser} from '../types.ts'

const Signup = () => {
  const [user, setUser] = useState<SignupUser>({
    username: '',
    password: '',
    fullName: '',
    confirmedPassword: '',
    gender: 'girl'
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  const handleGender = (gender: 'boy' | 'girl') => {
    setUser({
      ...user,
      gender
    })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(user)
  }
  return <UserForm title={`Signup`} user={user} handleChange={handleChange} handleGender={handleGender}
                   handleSubmit={handleSubmit}/>
}
export default Signup
