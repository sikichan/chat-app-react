import { Navigate, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup.tsx"
import Login from "./pages/Login.tsx"
import Home from "./pages/Home.tsx"
import { Toaster } from "react-hot-toast"
import useAuthContext from "./hooks/useAuthContext.ts"
import ModifyAvatar from "@/pages/ModifyAvatar.tsx"

function App() {
  const { authUser } = useAuthContext()
  return (
    <div className="h-screen flex justify-center items-center ">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        ></Route>
        <Route path="/personal">
          <Route path="avatar" element={<ModifyAvatar />}></Route>
        </Route>
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        ></Route>
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        ></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
