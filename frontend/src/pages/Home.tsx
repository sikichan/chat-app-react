import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <nav
        className="flex justify-end w-full p-3 bg-gray-400 rounded-lg shadow-md backdrop-blur-lg backdrop-filter bg-opacity-0">
        
        <Link to={`/login`}>
          <button className="btn btn-accent btn-sm">Login</button>
        </Link>
        
        <Link to={`/signup`}>
          <button className="btn btn-link btn-sm">Sign up</button>
        </Link>
      
      </nav>
      <div className="text-6xl flex flex-1 justify-center items-center">Welcome To Chat App</div>
    </div>
  )
}
export default Home;