import Sidebar from "../components/Sidebar/Sidebar.tsx"
import MessageContainer from "../components/Message/MessageContainer.tsx"

const Home = () => {
  return (
    <div
      className="Home p-4 flex
      md:w-9/10 md:h-9/10
      sm:w-5/6 sm:h-5/6
      rounded-lg overflow-lg overflow-hidden bg-gray-400
      bg-clip-padding backdrop-filter
      backdrop-blur-lg bg-opacity-0"
    >
      <Sidebar />
      <MessageContainer />
    </div>
  )
}
export default Home
