import { motion } from 'framer-motion'
import { Avatar } from 'antd'
import { MoreVertical, Eye, Swords, Clock } from 'lucide-react'

const gameIcons = {
  Chess: '♟️',
  Catan: '🏝️',
  Monopoly: '🎩',
  default: '🎮',
}

const tierConfig = {
  grandmaster: { border: 'from-purple-500 to-violet-600', glow: 'avatar-glow-grandmaster' },
  diamond: { border: 'from-cyan-400 to-teal-500', glow: 'avatar-glow-diamond' },
  platinum: { border: 'from-slate-400 to-gray-500', glow: 'avatar-glow-platinum' },
  gold: { border: 'from-amber-400 to-yellow-500', glow: 'avatar-glow-gold' },
}

/**
 * FriendCard - Gaming-style friend card with tier glow and activity status
 * Supports dark/light mode
 */
export function FriendCard({ friend, onViewProfile, onRemove, onInvite, index = 0 }) {
  const isOnline = friend.status === 'online'
  const tier = tierConfig[friend.tier] || tierConfig.gold
  const gameIcon = friend.activity?.includes('Playing')
    ? gameIcons[friend.activity.replace('Playing ', '')] || gameIcons.default
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700/50 p-5 flex flex-col items-center overflow-hidden group"
    >
      
      <button className="absolute top-3 right-3 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-lg">
        <MoreVertical size={16} />
      </button>

      
      <div className="relative mb-3 cursor-pointer" onClick={() => onViewProfile(friend)}>
        <div className={`p-0.5 rounded-full bg-gradient-to-br ${tier.border} ${isOnline ? tier.glow : ''}`}>
          <Avatar
            src={friend.avatar}
            size={70}
            className={`border-2 border-white dark:border-slate-900 ${!isOnline ? 'grayscale opacity-80' : ''}`}
          />
        </div>
        
        <span
          className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-3 border-white dark:border-slate-900 ${
            isOnline ? 'bg-green-500 online-status-pulse' : 'bg-gray-400 dark:bg-slate-500'
          }`}
        />
      </div>

      
      <h3 className="font-bold text-gray-900 dark:text-white text-base truncate w-full text-center mb-1">
        {friend.name}
      </h3>

      
      {friend.activity ? (
        <div className="flex items-center gap-1.5 mb-1">
          {gameIcon && <span className="text-lg">{gameIcon}</span>}
          <p className="text-xs text-[#1d7af2] dark:text-[#00f0ff] font-semibold">{friend.activity}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-1">
          {isOnline ? 'Online' : friend.lastSeen}
        </p>
      )}

      
      {friend.playingFor && (
        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 mb-3">
          <Clock size={10} />
          <span>Playing for {friend.playingFor}</span>
        </div>
      )}

      
      <div className="grid grid-cols-2 gap-2 w-full mt-auto pt-2">
        {friend.activity?.includes('Playing') ? (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onInvite?.(friend, 'spectate')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-gray-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <Eye size={12} />
              Spectate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewProfile?.(friend)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-gray-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Profile
            </motion.button>
          </>
        ) : isOnline ? (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onInvite?.(friend, 'game')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-[#1d7af2]/20 dark:hover:shadow-[#00f0ff]/20 transition-shadow"
            >
              <Swords size={12} />
              Invite
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewProfile?.(friend)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-gray-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Profile
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewProfile?.(friend)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-gray-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              View Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRemove?.(friend.id)}
              className="flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-slate-600 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-semibold rounded-lg transition-colors"
            >
              Remove
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default FriendCard
