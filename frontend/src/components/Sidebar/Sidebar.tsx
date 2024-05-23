import SearchInput from "./SearchInput.tsx"
import Conversations from "./Conversations.tsx"
import Logout from "./Logout.tsx"
import { useState } from "react"

const Sidebar = () => {
  const [value, setValue] = useState("")

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
