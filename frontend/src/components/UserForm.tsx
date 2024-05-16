import React from 'react'
import { LoginUser, SignupUser } from '@/types.ts'
import { Link } from 'react-router-dom'
import Gender from './Gender.tsx'

type UserFormProps = {
  title: 'Login' | 'Signup'
  user: SignupUser | LoginUser
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  loading: boolean
  handleGender?: (gender: 'boy' | 'girl') => void
}
const UserForm = (props: UserFormProps) => {
  const { handleChange, handleSubmit, handleGender, loading, title, user } =
    props
  const isSignupPage = title === 'Signup'
  const footer = !isSignupPage ? `Don't` : `Already`
  return (
    <div className='flex flex-col gap-2 justify-center items-center min-w-96 mx-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 backdrop-blur-lg backdrop-filter bg-opacity-0'>
        <h1 className='text-3xl text-center text-gray-300'>{title} ChatApp</h1>
        <form className='mt-4 flex flex-col gap-1' onSubmit={handleSubmit}>
          {isSignupPage && (
            <div>
              <label className='label text-blue-400 p-2 justify-start'>
                <span className='text-base label-text text-gray-500'>
                  Chinese name
                </span>
              </label>
              <input
                type='text'
                className='w-full input input-bordered h-10'
                placeholder='Enter your Chinese name'
                name='fullName'
                maxLength={16}
                value={(user as SignupUser).fullName}
                onChange={handleChange}
              />
            </div>
          )}
          <div>
            <label className='label text-blue-400 p-2 justify-start'>
              <span className='text-base label-text text-gray-500'>
                Username
              </span>
            </label>
            <input
              type='text'
              className='w-full input input-bordered h-10'
              placeholder='Enter your username'
              name='username'
              maxLength={16}
              value={user.username}
              onChange={handleChange}
            />
          </div>
          {isSignupPage && (
            <Gender
              gender={(user as SignupUser).gender}
              handleChange={handleGender!}
            />
          )}
          <div>
            <label className='label text-blue-400 p-2 justify-start'>
              <span className='text-base label-text text-gray-500'>
                Password
              </span>
            </label>
            <input
              type='password'
              className='w-full input input-bordered h-10'
              name='password'
              value={user.password}
              maxLength={16}
              placeholder='Enter your password'
              onChange={handleChange}
            />
          </div>
          {isSignupPage && (
            <div>
              <label className='label text-blue-400 p-2 justify-start'>
                <span className='text-base label-text text-gray-500'>
                  Confirm Your Password
                </span>
              </label>
              <input
                type='password'
                className='w-full input input-bordered h-10'
                name='confirmedPassword'
                maxLength={16}
                value={(user as SignupUser).confirmedPassword}
                placeholder='Enter your confirmed password'
                onChange={handleChange}
              />
            </div>
          )}
          <button disabled={loading} className={'btn btn-primary mt-4'}>
            {loading ? (
              <span className='loading loading-spinner' />
            ) : title === 'Signup' ? (
              'Sign Up'
            ) : (
              'Log In'
            )}
          </button>
          <label className='label text-gray-500 p-2 justify-start'>
            {footer} have an account ?
            <span className='ml-1 text-blue-400 underline'>
              {isSignupPage ? (
                <Link to='/login'>Login</Link>
              ) : (
                <Link to='/signup'>Sign up</Link>
              )}
            </span>
          </label>
        </form>
      </div>
    </div>
  )
}
export default UserForm
