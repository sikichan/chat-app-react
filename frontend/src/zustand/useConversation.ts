import {create} from 'zustand'
import {MessageModel, UserModel} from '@/types.ts';
import {devtools} from 'zustand/middleware'

type State = {
  selectedConversation: UserModel | null
  messages: MessageModel[]
}
type Action = {
  setSelectedConversation: (selectedConversation: State['selectedConversation']) => void
  setMessages: (message: MessageModel[]) => void
}

const useConversation = create<State & Action>()(
  devtools((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({selectedConversation}),
    messages: [],
    setMessages: (messages) => set({messages})
  }))
)

export default useConversation