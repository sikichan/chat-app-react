import { useEffect, useRef, useState } from "react"
import EmojiPicker from "emoji-picker-react"
import { BsEmojiSmile } from "react-icons/bs"

interface Props {
  getEmoji: (emoji: string) => void
}

const ChatTools = ({ getEmoji }: Props) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const handleEmojiClick = ({ emoji }: { emoji: string }) => {
    getEmoji(emoji)
    setShowEmojiPicker(false)
  }
  const pickerRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: MouseEvent) => {
    if (
      !emojiRef.current?.contains(event.target as Node) &&
      !pickerRef.current?.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])
  return (
    <div className="relative w-full rounded-md">
      <div
        ref={pickerRef}
        className={`absolute z-10 bottom-1 ${showEmojiPicker ? "" : "hidden"}`}
      >
        <EmojiPicker
          lazyLoadEmojis={true}
          autoFocusSearch={false}
          onEmojiClick={handleEmojiClick}
        />
      </div>
      <div
        ref={emojiRef}
        className="ChatTools p-2 flex translate-y-2 rounded-tr-lg rounded-tl-lg items-center z-100"
      >
        <BsEmojiSmile
          className="cursor-pointer"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
      </div>
    </div>
  )
}
export default ChatTools
