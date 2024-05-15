import {UserModel} from '@/types.ts'
import Conversation from '@/components/Sidebar/Conversation.tsx';

type Props = {
  conversations: UserModel[]
  fullName: string
}
const UserSearch = ({fullName, conversations}: Props) => {
  return <div className="py-2 flex flex-col overflow-auto">
    {conversations.map((conversation: UserModel, index: number) => (
      <Conversation
        conversation={conversation}
        lastIndex={index === conversations.length - 1}
        key={conversation._id}
      />
    ))}
  </div>
}
export default UserSearch