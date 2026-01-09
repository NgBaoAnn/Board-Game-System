import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'

/**
 * EmptyState - Custom empty state for Community page
 */
export function EmptyState({ type, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="text-6xl mb-4">
        {type === 'requests' ? '📬' : '👥'}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">
        {type === 'requests' ? 'No Pending Requests' : 'No Friends Yet'}
      </h3>
      <p className="text-sm text-slate-400 mb-6 max-w-xs">
        {type === 'requests'
          ? "You're all caught up! No friend requests waiting."
          : 'Start connecting with other players and build your gaming circle!'}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-shadow"
      >
        <UserPlus size={18} />
        Find Players
      </motion.button>
    </motion.div>
  )
}

export default EmptyState
