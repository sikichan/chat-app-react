import UserForm from '../components/UserForm.tsx';
import React, {useState} from 'react';
import {LoginUser} from '../types.ts';

const Login = () => {
  const [user, setUser] = useState<LoginUser>({
    username: '',
    password: ''
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(user)
  }
  return <UserForm title={`Login`} user={user} handleChange={handleChange} handleSubmit={handleSubmit}/>
}
export default Login;