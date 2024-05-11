import React, { createContext, useState, PropsWithChildren } from "react"

interface AuthUserType {
  _id: string
  username: string
  fullName: string
  gender: "boy" | "girl"
}

interface AuthContextType {
  authUser: AuthUserType | null
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUserType | null>>
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
})

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(() => {
    const storedUser = localStorage.getItem("chat-user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
