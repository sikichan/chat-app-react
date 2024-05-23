import Sidebar from "../components/Sidebar/Sidebar.tsx"
import MessageContainer from "../components/Message/MessageContainer.tsx"

const Home = () => {
  return (
    <div
      className="Home p-4 flex
      rounded-lg"
    >
      <Sidebar />
      <MessageContainer />
    </div>
  )
}
export default Home
