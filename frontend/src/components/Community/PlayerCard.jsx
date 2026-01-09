import { Avatar, Tooltip } from 'antd'
import { UserPlus, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const tierConfig = {
  grandmaster: { border: 'from-purple-500 to-violet-600', glow: 'avatar-glow-grandmaster', label: 'Grandmaster' },
  diamond: { border: 'from-cyan-400 to-teal-500', glow: 'avatar-glow-diamond', label: 'Diamond' },
  platinum: { border: 'from-slate-400 to-gray-500', glow: 'avatar-glow-platinum', label: 'Platinum' },
  gold: { border: 'from-amber-400 to-yellow-500', glow: 'avatar-glow-gold', label: 'Gold' },
  silver: { border: 'from-gray-300 to-slate-400', glow: '', label: 'Silver' },
  bronze: { border: 'from-orange-400 to-amber-600', glow: '', label: 'Bronze' },
}

/**
 * PlayerCard - Card for non-friend players (for "All Players" tab)
 * Shows avatar, name, tier, and Add Friend / View Profile buttons
 * Supports dark/light mode
 */
export function PlayerCard({ player, onAddFriend, index = 0 }) {
  const navigate = useNavigate()
  const isOnline = player.status === 'online'
  const tier = tierConfig[player.tier] || tierConfig.gold

  const handleViewProfile = () => {
    navigate(`/player/${player.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700/50 p-5 flex flex-col items-center overflow-hidden group"
    >
      
      <Tooltip title={tier.label}>
        <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r ${tier.border} text-white`}>
          {tier.label}
        </span>
      </Tooltip>

      
      <div className="relative mb-3 cursor-pointer" onClick={handleViewProfile}>
        <div className={`p-0.5 rounded-full bg-gradient-to-br ${tier.border} ${isOnline ? tier.glow : ''}`}>
          <Avatar
            src={player.avatar}
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
        {player.name}
      </h3>

      
      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-3">
        {isOnline ? 'Online now' : player.lastSeen || 'Offline'}
      </p>

      
      <div className="grid grid-cols-2 gap-2 w-full mt-auto pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddFriend?.(player)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-[#1d7af2]/20 dark:hover:shadow-[#00f0ff]/20 transition-shadow"
        >
          <UserPlus size={12} />
          Add Friend
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewProfile}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-gray-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
        >
          <User size={12} />
          Profile
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PlayerCard
