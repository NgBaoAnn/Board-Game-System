import { motion } from 'framer-motion'
import { Avatar } from 'antd'

/**
 * TypingIndicator - Bouncing dots animation to show user is typing
 * Supports dark/light mode
 */
export function TypingIndicator({ avatar, initials, gradient }) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -6 },
  }

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-end gap-2"
    >
      {/* Avatar */}
      {avatar ? (
        <Avatar src={avatar} size={32} className="flex-shrink-0" />
      ) : initials ? (
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient || 'from-indigo-400 to-purple-500'} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
        >
          {initials}
        </div>
      ) : null}

      {/* Typing bubble */}
      <div className="bg-white dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600/50 dark:backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 0.4,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-[#1d7af2] dark:bg-[#00f0ff]"
          />
        ))}
      </div>
    </motion.div>
  )
}

export default TypingIndicator
