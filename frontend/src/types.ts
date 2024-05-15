export interface LoginUser {
  username: string
  password: string
}

export interface SignupUser extends LoginUser {
  fullName: string
  confirmedPassword: string
  gender: 'boy' | 'girl'
}

export interface FetchProps {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: object
}

export type MessageModel = {
  _id: string
  senderId: string
  receiverId: string
  message: object | string
  messageType: MessageType
  shouldShake: boolean | undefined
  createdAt: Date | string | number
}

export type UserModel = {
  _id: string
  fullName: string
  username: string
  avatar: string
  gender: 'boy' | 'girl'
}

export enum MessageType {
  'text' = 'text',
  'image' = 'image',
  'video' = 'video',
  'audio' = 'audio',
  'file' = 'file',
}
