import { Avatar } from 'antd'

// Chat Message Bubble Component
export function MessageBubble({ message, isOwn, showAvatar = true, recipientAvatar, recipientInitials, recipientGradient }) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        {/* Other person's avatar */}
        {!isOwn && showAvatar && (
          message.avatar ? (
            <Avatar src={message.avatar} size={32} className="flex-shrink-0" />
          ) : (
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${message.gradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0`}>
              {message.initials}
            </div>
          )
        )}
        {!isOwn && !showAvatar && <div className="w-8" />}

        {/* Message content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-lg`}>
          <div
            className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${
              isOwn
                ? 'bg-[#1d7af2] text-white rounded-tr-sm'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-sm border border-gray-100 dark:border-gray-600'
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>

      {/* Time and Read Receipt */}
      <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? 'mr-1' : 'ml-10'}`}>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {message.time}
        </span>
        {/* Read receipt - show recipient avatar */}
        {isOwn && message.read && recipientAvatar && (
          <Avatar src={recipientAvatar} size={14} className="border border-gray-200 dark:border-gray-600" />
        )}
        {isOwn && message.read && !recipientAvatar && recipientInitials && (
          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${recipientGradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-[6px]`}>
            {recipientInitials}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
