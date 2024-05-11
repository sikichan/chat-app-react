import Sidebar from '../components/Sidebar.tsx';
import MessageContainer from '../components/MessageContainer.tsx';

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
      className="p-6 flex
      md:w-2/3 md:h-4/5
      sm:w-3/4 sm:h-3/4
      rounded-lg overflow-lg overflow-hidden bg-gray-400
      bg-clip-padding backdrop-filter
      backdrop-blur-lg bg-opacity-0"
    >
      <Sidebar/>
      <MessageContainer message={''}/>
    </div>
  )
}
export default Home
