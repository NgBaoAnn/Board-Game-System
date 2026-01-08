import { Avatar, Badge } from 'antd'

// Conversation List Item Component
export function ConversationItem({ conversation, isActive, onClick }) {
  const isOnline = conversation.status === 'online'
  const hasUnread = conversation.unreadCount > 0

  return (
    <div
      onClick={() => onClick?.(conversation)}
      className={`px-4 py-4 flex items-center cursor-pointer transition-colors border-l-4 ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/10 border-[#1d7af2]'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0 mr-3">
        {conversation.avatar ? (
          <Avatar src={conversation.avatar} size={48} />
        ) : (
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${conversation.gradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-lg shadow-sm`}
          >
            {conversation.initials}
          </div>
        )}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {conversation.name}
          </h3>
          <span className={`text-xs font-medium ${isActive ? 'text-[#1d7af2]' : 'text-gray-500 dark:text-gray-400'}`}>
            {conversation.time}
          </span>
        </div>
        <div className="flex items-center">
          {hasUnread && (
            <span className="bg-[#1d7af2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-2">
              {conversation.unreadCount}
            </span>
          )}
          <p className={`text-sm truncate ${hasUnread ? 'font-medium' : ''} text-gray-500 dark:text-gray-400`}>
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationItem
