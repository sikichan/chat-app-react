import {UserModel} from '@/types.ts';
import reactLogo from '@/assets/react.svg'
import useConversation from '@/zustand/useConversation.ts';

type Props = {
  conversation: UserModel,
  lastIndex: boolean
}
const Conversation = ({conversation, lastIndex}: Props) => {
  const {fullName, avatar, gender, _id: receiverId} = conversation
  const {selectedConversation, setSelectedConversation} = useConversation()
  const handleClick = () => {
    setSelectedConversation(conversation)
  }
  return (
    <>
      <div
        className={
          'flex gap-2 items-center text-gray-300 hover:bg-yellow-light hover:text-black rounded p-2 py-1 cursor-pointer transition ease-in-out duration-500 '
            .concat(receiverId === selectedConversation?._id ? 'selected-to-chat' : '')
        }
        onClick={handleClick}>
        <div className="avatar online">
          {
            <div className="w-12 rounded-full">
              <img
                src={avatar}
                onError={event => {
                  console.log(event)
                  event.currentTarget.src = reactLogo
                }}
                alt="user avatar"
              />
            </div>
          }
        
        </div>
        <div className="flex flex-1 justify-between">
          <p className="font-bold">{fullName}</p>
          <div>{gender === 'boy' ? '👦🏻' : '👧🏻'}</div>
        </div>
      </div>
      {
        !lastIndex && <div className="border-base-100"></div>
      }
    </>
  )
}
export default Conversation
