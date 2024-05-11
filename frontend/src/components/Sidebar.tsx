import SearchInput from './SearchInput.tsx';
import Conversations from './Conversations.tsx';
import Logout from './Logout.tsx';

const Sidebar = () => {
  return <div className="p-2 flex flex-col">
    <SearchInput/>
    <div className="divider px-3"></div>
    <Conversations/>
    <Logout/>
  </div>
}
export default Sidebar;