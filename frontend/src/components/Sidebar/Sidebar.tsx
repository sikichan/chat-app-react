import SearchInput from "./SearchInput.tsx"
import Conversations from "./Conversations.tsx"
import Logout from "./Logout.tsx"
import { useEffect, useState } from "react"
import useConversation from "@/zustand/useConversation.ts"

const Sidebar = () => {
  const [value, setValue] = useState("")
  const { selectedConversation } = useConversation()
  useEffect(() => {
    setValue("")
  }, [selectedConversation])
  return (
    <div className="flex flex-col relative">
      <SearchInput value={value} setValue={setValue} />
      <div className="divider"></div>
      <Conversations searchKeyword={value} />
      <Logout />
    </div>
  )
}
export default Sidebar
