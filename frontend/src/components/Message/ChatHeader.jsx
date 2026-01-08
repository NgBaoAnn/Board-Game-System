import { Gamepad2, Search, MoreVertical } from 'lucide-react'
import { Avatar } from 'antd'

// Chat Header Component
export function ChatHeader({ conversation }) {
  if (!conversation) return null

  const isOnline = conversation.status === 'online'

  return (
    <div className="h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center">
        {conversation.avatar ? (
          <Avatar src={conversation.avatar} size={40} className="shadow-sm mr-3" />
        ) : (
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${conversation.gradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-sm shadow-sm mr-3`}>
            {conversation.initials}
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{conversation.name}</h3>
          <div className={`flex items-center text-xs font-medium ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Start Game">
          <Gamepad2 size={20} />
        </button>
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
