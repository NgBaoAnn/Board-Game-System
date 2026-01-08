import { useState, useRef } from 'react'
import { Popover } from 'antd'
import { Send, Smile, PlusCircle, Image, Paperclip, Mic } from 'lucide-react'

// Common emoji list
const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🔥', '🎮', '🎲', '🏆', '⭐', '🎯', '💪', '🙌', '👏', '🤝', '✌️']

// Chat Input Component
export function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('')
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const inputRef = useRef(null)
  const isSendingRef = useRef(false)

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !isSendingRef.current) {
      isSendingRef.current = true
      // Clear both state and input directly
      setMessage('')
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      onSend?.(trimmedMessage)
      setTimeout(() => {
        isSendingRef.current = false
        inputRef.current?.focus()
      }, 50)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertEmoji = (emoji) => {
    setMessage(prev => prev + emoji)
    inputRef.current?.focus()
  }

  // Emoji picker content
  const emojiContent = (
    <div className="grid grid-cols-5 gap-2 p-2 w-48">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => insertEmoji(emoji)}
          className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  )

  // Attachment menu content
  const attachContent = (
    <div className="flex flex-col p-2 min-w-[160px]">
      <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Image size={18} />
        </div>
        <span className="text-sm font-medium">Photo</span>
      </button>
      <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Paperclip size={18} />
        </div>
        <span className="text-sm font-medium">File</span>
      </button>
      <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
        <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
          <Mic size={18} />
        </div>
        <span className="text-sm font-medium">Voice</span>
      </button>
    </div>
  )

  return (
    <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        {/* Attachment Button */}
        <Popover
          content={attachContent}
          trigger="click"
          placement="topLeft"
          open={showAttachMenu}
          onOpenChange={setShowAttachMenu}
        >
          <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#1d7af2] rounded-full transition-colors">
            <PlusCircle size={22} />
          </button>
        </Popover>

        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full rounded-full pl-5 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-none text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1d7af2]/50"
          />
          {/* Emoji Button */}
          <Popover content={emojiContent} trigger="click" placement="topRight">
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-[#1d7af2] transition-colors p-1">
              <Smile size={20} />
            </button>
          </Popover>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`p-3 rounded-full shadow-lg transition-all transform flex items-center justify-center ${
            message.trim() && !disabled
              ? 'bg-[#1d7af2] hover:bg-blue-600 text-white shadow-blue-500/30 hover:scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
