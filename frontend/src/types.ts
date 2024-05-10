export type LoginUser = {
  username: string
  password: string
}
export type SignupUser = LoginUser & {
  fullName: string
  confirmedPassword: string,
  gender: 'boy' | 'girl'
}
