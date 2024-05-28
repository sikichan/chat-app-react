export interface LoginUser {
  username: string
  password: string
}

export interface SignupUser extends LoginUser {
  fullName: string
  confirmedPassword: string
  gender: "boy" | "girl"
}

export type MessageModel = {
  _id: string
  senderId: UserModel
  receiverId: string
  message: object | string
  messageType: MessageType
  shouldShake: boolean | undefined
  createdAt: Date | string | number
  groupId?: string
}

export type UserModel = {
  _id: string
  fullName: string
  username: string
  avatar: string
  gender: "boy" | "girl"
}
export type ConversationModel = UserModel & {
  owner?: string
  isGroup?: boolean
  groupName?: string
}

export enum MessageType {
  "text" = "text",
  "image" = "image",
  "video" = "video",
  "audio" = "audio",
  "file" = "file",
}

export type ResponseError = {
  status: number
  message: string
}
export type ResponseMessages = {
  data: MessageModel[]
}
export type ResponseUsers = {
  data: UserModel[]
}
