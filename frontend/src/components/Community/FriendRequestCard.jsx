import { motion } from 'framer-motion'
import { Avatar } from 'antd'
import { UserCheck, UserX } from 'lucide-react'

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
 * FriendRequestCard - Friend request with mutual friends and games in common
 * Supports dark/light mode
 */
export function FriendRequestCard({ friend, onAccept, onDecline, index = 0 }) {
  const tier = tierConfig[friend.tier] || tierConfig.gold

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700/50 p-5 flex flex-col items-center text-center overflow-hidden"
    >
      
      {friend.isNew && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
        >
          NEW
        </motion.span>
      )}

      
      <div className="relative mb-3">
        <div className={`p-0.5 rounded-full bg-gradient-to-br ${tier.border} ${tier.glow}`}>
          <Avatar src={friend.avatar} size={70} className="border-2 border-white dark:border-slate-900" />
        </div>
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{friend.name}</h3>

      
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
        {friend.mutualFriends} mutual friends
      </p>

      
      <div className="flex gap-1 mb-4">
        {friend.gamesInCommon?.slice(0, 3).map((game) => (
          <span
            key={game}
            className="text-lg"
            title={game}
          >
            {gameIcons[game] || gameIcons.default}
          </span>
        ))}
      </div>

      
      <div className="flex gap-2 w-full mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAccept?.(friend.id)}
          className="flex-1 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] hover:shadow-lg hover:shadow-[#1d7af2]/30 dark:hover:shadow-[#00f0ff]/30 text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <UserCheck size={16} />
          Accept
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onDecline?.(friend.id)}
          className="flex-1 bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <UserX size={16} />
          Decline
        </motion.button>
      </div>
    </motion.div>
  )
}

export default FriendRequestCard
