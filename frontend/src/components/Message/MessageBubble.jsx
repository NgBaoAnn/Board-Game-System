import { useState } from 'react'
import { Avatar, Tooltip } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'

const reactions = ['❤️', '😂', '🎮', '👍', '🔥', '👏']

/**
 * MessageBubble - Gaming-style message bubble with gradient and reactions
 * Supports dark/light mode
 */
export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  recipientAvatar,
  recipientInitials,
  recipientGradient,
  onReact,
}) {
  const [showReactions, setShowReactions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState(message.reaction || null)

  const handleReaction = (emoji) => {
    setSelectedReaction(emoji)
    setShowReactions(false)
    onReact?.(message.id, emoji)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} group`}
    >
      <div
        className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        
        {!isOwn && showAvatar && (
          message.avatar ? (
            <Avatar src={message.avatar} size={32} className="flex-shrink-0" />
          ) : (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${message.gradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0`}
            >
              {message.initials}
            </div>
          )
        )}
        {!isOwn && !showAvatar && <div className="w-8" />}

        
        <div className="relative">
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-lg`}>
            <div
              className={`px-5 py-3 rounded-2xl shadow-sm text-sm relative ${
                isOwn
                  ? 'bg-gradient-to-br from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:via-[#6366f1] dark:to-[#a855f7] text-white rounded-tr-sm'
                  : 'bg-white dark:bg-slate-700/60 dark:backdrop-blur-sm border border-gray-200 dark:border-slate-600/50 text-gray-900 dark:text-white rounded-tl-sm'
              }`}
            >
              {message.content}

              
              {selectedReaction && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -bottom-3 ${isOwn ? 'right-2' : 'left-2'} bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-full px-1.5 py-0.5 text-sm shadow-lg`}
                >
                  {selectedReaction}
                </motion.span>
              )}
            </div>
          </div>

          
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 5 }}
                className={`absolute ${isOwn ? 'right-0' : 'left-10'} -top-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-full px-2 py-1.5 flex gap-1 shadow-xl z-20`}
              >
                {reactions.map((emoji) => (
                  <Tooltip key={emoji} title={emoji === '🎮' ? 'Challenge!' : undefined}>
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReaction(emoji)}
                      className="text-lg hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  </Tooltip>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      
      <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? 'mr-1' : 'ml-10'}`}>
        <span className="text-[10px] text-gray-500 dark:text-slate-400">
          {message.time}
        </span>
        
        {isOwn && message.read && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {recipientAvatar ? (
              <Avatar
                src={recipientAvatar}
                size={14}
                className="border border-gray-200 dark:border-slate-600"
              />
            ) : recipientInitials ? (
              <div
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${recipientGradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-[6px]`}
              >
                {recipientInitials}
              </div>
            ) : null}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble
