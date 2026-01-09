import { Avatar } from 'antd'
import { motion } from 'framer-motion'

// Game icons mapping
const gameIcons = {
  Chess: '♟️',
  Catan: '🏝️',
  Monopoly: '🎩',
  default: '🎮',
}

/**
 * ConversationItem - Gaming-style conversation list item with game status
 * Supports dark/light mode
 */
export function ConversationItem({ conversation, isActive, onClick }) {
  const isOnline = conversation.status === 'online'
  const hasUnread = conversation.unreadCount > 0
  const isPlaying = conversation.gameStatus?.includes('Playing')

  // Parse game name from gameStatus
  const gameName = isPlaying ? conversation.gameStatus.replace('Playing ', '') : null
  const gameIcon = gameName ? (gameIcons[gameName] || gameIcons.default) : null

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => onClick?.(conversation)}
      className={`px-4 py-4 flex items-center cursor-pointer transition-all border-l-4 ${
        isActive
          ? 'bg-blue-50 dark:bg-slate-700/50 border-[#1d7af2] dark:border-[#00f0ff]'
          : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 border-transparent'
      }`}
    >
      {/* Avatar with status */}
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
        {/* Online/Game status indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
            isPlaying ? 'bg-amber-500' : isOnline ? 'bg-green-500 online-status-pulse' : 'bg-gray-400 dark:bg-slate-500'
          }`}
        />
        {/* Game icon badge */}
        {isPlaying && gameIcon && (
          <span className="absolute -top-1 -right-1 text-sm bg-white dark:bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center border border-gray-200 dark:border-slate-600">
            {gameIcon}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {conversation.name}
          </h3>
          <span className={`text-xs font-medium ${isActive ? 'text-[#1d7af2] dark:text-[#00f0ff]' : 'text-gray-500 dark:text-slate-400'}`}>
            {conversation.time}
          </span>
        </div>
        <div className="flex items-center">
          {hasUnread && (
            <span className="bg-[#1d7af2] dark:bg-gradient-to-r dark:from-[#00f0ff] dark:to-[#a855f7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-2">
              {conversation.unreadCount}
            </span>
          )}
          {/* Game activity or last message */}
          {conversation.activity ? (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium truncate flex items-center gap-1">
              {gameIcon && <span>{gameIcon}</span>}
              {conversation.activity}
            </p>
          ) : (
            <p className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>
              {conversation.lastMessage}
            </p>
          )}
        </div>
      </div>

      {/* Typing indicator */}
      {conversation.isTyping && (
        <div className="flex gap-0.5 ml-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.2,
              }}
              className="w-1 h-1 rounded-full bg-[#1d7af2] dark:bg-[#00f0ff]"
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ConversationItem
