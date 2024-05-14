import SearchInput from './SearchInput.tsx';
import Conversations from './Conversations.tsx';
import Logout from './Logout.tsx';

const Sidebar = () => {
  return <div className="pt-1 flex flex-col border-r border-gray-400 pr-4">
    <SearchInput/>
    <div className="divider"></div>
    <Conversations/>
    <Logout/>
  </div>
}
export default Sidebar;