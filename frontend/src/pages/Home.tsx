import Sidebar from '../components/Sidebar/Sidebar.tsx';
import MessageContainer from '../components/Message/MessageContainer.tsx';

const Home = () => {
  return (
    // <div className="flex flex-col h-screen">
    //   <nav
    //     className="flex justify-end w-full p-3 bg-gray-400 rounded-lg shadow-md backdrop-blur-lg backdrop-filter bg-opacity-0">
    
    //     <Link to={`/login`}>
    //       <button className="btn btn-accent btn-sm">Login</button>
    //     </Link>
    
    //     <Link to={`/signup`}>
    //       <button className="btn btn-link btn-sm">Sign up</button>
    //     </Link>
    
    //   </nav>
    //   <div className="text-6xl flex flex-1 justify-center items-center">Welcome To Chat App</div>
    // </div>
    
    <div
      className="p-4 flex
      md:w-9/10 md:h-9/10
      sm:w-5/6 sm:h-5/6
      rounded-lg overflow-lg overflow-hidden bg-gray-400
      bg-clip-padding backdrop-filter
      backdrop-blur-lg bg-opacity-0"
    >
      <Sidebar/>
      <MessageContainer/>
    </div>
  )
}
export default Home
