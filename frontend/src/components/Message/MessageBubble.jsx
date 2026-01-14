import { useState } from 'react'
import { Avatar, Tooltip, Image } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download } from 'lucide-react'

const reactions = ['❤️', '😂', '🎮', '👍', '🔥', '👏']

// Check if file is an image
const isImageType = (fileType) => {
  return fileType?.startsWith('image/')
}

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * MessageBubble - Gaming-style message bubble with gradient and reactions
 * Supports dark/light mode and file attachments
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

  const hasFile = message.file_url || message.fileUrl
  const fileUrl = message.file_url || message.fileUrl
  const fileName = message.file_name || message.fileName
  const fileType = message.file_type || message.fileType
  const fileSize = message.file_size || message.fileSize
  const isImage = isImageType(fileType)

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
        {/* Avatar for received messages */}
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

        {/* Message Content */}
        <div className="relative">
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-lg`}>
            
            {/* File/Image Attachment */}
            {hasFile && (
              <div className={`mb-1 rounded-2xl overflow-hidden ${isOwn ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                {isImage ? (
                  <Image
                    src={fileUrl}
                    alt={fileName || 'Image'}
                    className="max-w-[280px] max-h-[300px] object-cover rounded-2xl cursor-pointer"
                    preview={{
                      maskClassName: 'rounded-2xl',
                    }}
                  />
                ) : (
                  <a 
                    href={fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-2xl ${
                      isOwn 
                        ? 'bg-gradient-to-br from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:via-[#6366f1] dark:to-[#a855f7]' 
                        : 'bg-white dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isOwn ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-600'
                    }`}>
                      <FileText size={20} className={isOwn ? 'text-white' : 'text-gray-600 dark:text-gray-300'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {fileName || 'File'}
                      </p>
                      <p className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatFileSize(fileSize)}
                      </p>
                    </div>
                    <Download size={18} className={isOwn ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                  </a>
                )}
              </div>
            )}

            {/* Text Content */}
            {message.content && (
              <div
                className={`px-5 py-3 rounded-2xl shadow-sm text-sm relative ${
                  isOwn
                    ? 'bg-gradient-to-br from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:via-[#6366f1] dark:to-[#a855f7] text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-700/60 dark:backdrop-blur-sm border border-gray-200 dark:border-slate-600/50 text-gray-900 dark:text-white rounded-tl-sm'
                }`}
              >
                {message.content}

                {/* Reaction Badge */}
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
            )}

            {/* Show reaction on file-only messages */}
            {hasFile && !message.content && selectedReaction && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute -bottom-3 ${isOwn ? 'right-2' : 'left-2'} bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-full px-1.5 py-0.5 text-sm shadow-lg`}
              >
                {selectedReaction}
              </motion.span>
            )}
          </div>

          {/* Reaction Picker */}
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

      {/* Timestamp & Read Receipt */}
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
