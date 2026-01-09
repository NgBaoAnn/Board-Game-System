import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Search, MoreVertical, Swords, Eye } from 'lucide-react'
import { Avatar, Dropdown, message } from 'antd'

// Game icons mapping
const gameIcons = {
  Chess: '♟️',
  Catan: '🏝️',
  Monopoly: '🎩',
  default: '🎮',
}

// Quick game options
const gameOptions = [
  { key: 'chess', label: '♟️ Play Chess', game: 'Chess' },
  { key: 'catan', label: '🏝️ Play Catan', game: 'Catan' },
  { key: 'monopoly', label: '🎩 Play Monopoly', game: 'Monopoly' },
]

/**
 * ChatHeader - Gaming-style header with invite button and game status
 * Supports dark/light mode
 */
export function ChatHeader({ conversation, onInvite, onSpectate }) {
  const [showInviteMenu, setShowInviteMenu] = useState(false)

  if (!conversation) return null

  const isOnline = conversation.status === 'online'
  const isPlaying = conversation.gameStatus?.includes('Playing')
  const gameName = isPlaying ? conversation.gameStatus.replace('Playing ', '') : null
  const gameIcon = gameName ? (gameIcons[gameName] || gameIcons.default) : null

  const handleInvite = (game) => {
    message.success(`Game invite sent: ${game}`)
    onInvite?.(conversation, game)
    setShowInviteMenu(false)
  }

  const handleSpectate = () => {
    message.info(`Spectating ${conversation.name}'s game...`)
    onSpectate?.(conversation)
  }

  const inviteMenuItems = gameOptions.map((opt) => ({
    key: opt.key,
    label: opt.label,
    onClick: () => handleInvite(opt.game),
  }))

  return (
    <div className="h-16 flex-shrink-0 border-b border-gray-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        {/* Avatar */}
        {conversation.avatar ? (
          <Avatar src={conversation.avatar} size={40} className="shadow-sm mr-3" />
        ) : (
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${conversation.gradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-sm shadow-sm mr-3`}
          >
            {conversation.initials}
          </div>
        )}

        {/* Name and status */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{conversation.name}</h3>
          <div className="flex items-center gap-2">
            {/* Online/Playing status */}
            <div
              className={`flex items-center text-xs font-medium ${
                isPlaying ? 'text-amber-600 dark:text-amber-400' : isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isPlaying ? 'bg-amber-500' : isOnline ? 'bg-green-500' : 'bg-gray-400 dark:bg-slate-500'
                }`}
              />
              {isPlaying ? (
                <span className="flex items-center gap-1">
                  {gameIcon} {conversation.gameStatus}
                </span>
              ) : isOnline ? (
                'Online'
              ) : (
                'Offline'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {/* Spectate button (if playing) */}
        <AnimatePresence>
          {isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSpectate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors"
            >
              <Eye size={14} />
              Spectate
            </motion.button>
          )}
        </AnimatePresence>

        {/* Invite to Game button */}
        {isOnline && !isPlaying && (
          <Dropdown
            menu={{ items: inviteMenuItems }}
            trigger={['click']}
            open={showInviteMenu}
            onOpenChange={setShowInviteMenu}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-[#1d7af2]/20 dark:hover:shadow-[#00f0ff]/20 transition-shadow"
            >
              <Swords size={14} />
              Invite to Game
            </motion.button>
          </Dropdown>
        )}

        {/* Other actions */}
        <button className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Search size={18} />
        </button>
        <button className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
