import Conversation from './Conversation.tsx'
import useGetConversations from '@/hooks/useGetConversations.ts'
import {UserModel} from '@/types.ts'

const Conversations = ({searchKeyword}: { searchKeyword: string }) => {
  const {loading, conversations} = useGetConversations(searchKeyword)
  return (
    <div className="flex-auto overflow-auto">
      {loading ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : (
        <div className="py-2 flex flex-col overflow-auto">
          {conversations.map((conversation: UserModel, index: number) => (
            <Conversation
              conversation={conversation}
              lastIndex={index === conversations.length - 1}
              key={conversation._id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Conversations
