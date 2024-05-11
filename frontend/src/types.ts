export interface LoginUser {
  username: string
  password: string
}

export interface SignupUser extends LoginUser {
  fullName: string
  confirmedPassword: string,
  gender: 'boy' | 'girl'
}

export interface FetchProps {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: object
}
