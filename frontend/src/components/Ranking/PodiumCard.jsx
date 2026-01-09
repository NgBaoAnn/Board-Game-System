import { Avatar } from 'antd'
import { motion } from 'framer-motion'
import { Crown, Award, Sparkles } from 'lucide-react'

/**
 * PodiumCard - Enhanced gaming-style podium card for top 3 players
 * Features animated glows, crown shimmer, and hover effects
 * Supports dark/light mode
 */
export function PodiumCard({ player, position }) {
  const configs = {
    1: {
      borderColor: 'border-yellow-400',
      bgGradient: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:via-yellow-800/10 dark:to-amber-900/20',
      glowClass: 'podium-gold',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      avatarRing: 'ring-4 ring-yellow-400/50',
      avatarGlow: 'shadow-[0_0_30px_rgba(250,204,21,0.5)]',
      scale: 'md:scale-105',
      height: 'min-h-[320px]',
    },
    2: {
      borderColor: 'border-gray-300 dark:border-gray-400',
      bgGradient: 'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-700/20 dark:via-gray-600/10 dark:to-slate-800/20',
      glowClass: 'podium-silver',
      iconBg: 'bg-gradient-to-br from-gray-300 to-gray-500',
      avatarRing: 'ring-2 ring-gray-400/40',
      avatarGlow: 'shadow-[0_0_20px_rgba(156,163,175,0.4)]',
      scale: '',
      height: 'min-h-[280px]',
    },
    3: {
      borderColor: 'border-orange-300 dark:border-orange-400',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:via-amber-800/10 dark:to-orange-800/20',
      glowClass: 'podium-bronze',
      iconBg: 'bg-gradient-to-br from-orange-400 to-amber-600',
      avatarRing: 'ring-2 ring-orange-400/40',
      avatarGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      scale: '',
      height: 'min-h-[280px]',
    },
  }

  const config = configs[position]
  const avatarSize = position === 1 ? 100 : 80
  const iconSize = position === 1 ? 52 : 44

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.15, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative ${config.height} ${config.scale} z-${position === 1 ? 20 : 10}`}
    >
      <div
        className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border-t-4 ${config.borderColor} ${config.glowClass} p-6 flex flex-col items-center relative h-full shadow-lg dark:shadow-none`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 ${config.bgGradient} rounded-2xl opacity-50`} />

        {/* Rank Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: position * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
          className={`absolute -top-6 ${config.iconBg} rounded-full flex items-center justify-center text-white font-bold shadow-lg z-20`}
          style={{ width: iconSize, height: iconSize }}
        >
          {position === 1 ? (
            <Crown size={28} className="crown-shimmer" />
          ) : (
            <span className="text-xl font-black">{position}</span>
          )}
        </motion.div>

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col items-center mt-4 flex-1">
          {/* Avatar */}
          <div className="relative mb-4">
            {player.avatar ? (
              <Avatar
                src={player.avatar}
                size={avatarSize}
                className={`border-4 border-white dark:border-slate-700 ${config.avatarRing} ${config.avatarGlow}`}
              />
            ) : (
              <div
                className={`rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold border-4 border-white dark:border-slate-700 ${config.avatarRing} ${config.avatarGlow}`}
                style={{ width: avatarSize, height: avatarSize, fontSize: avatarSize / 3 }}
              >
                {player.initials}
              </div>
            )}

            {/* Champion badge for #1 */}
            {position === 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
              >
                <Sparkles size={10} className="fill-current" />
                CHAMPION
              </motion.div>
            )}

            {/* Award icon for #2 and #3 */}
            {position !== 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-700 rounded-full p-1.5 shadow-lg border border-gray-100 dark:border-slate-600"
              >
                <Award size={14} className={position === 2 ? 'text-gray-400 dark:text-gray-300' : 'text-orange-400'} />
              </motion.div>
            )}
          </div>

          {/* Player Info */}
          <h3
            className={`font-bold ${position === 1 ? 'text-xl' : 'text-lg'} text-gray-900 dark:text-white text-center mb-1`}
          >
            {player.name}
          </h3>
          <p className="text-[#1d7af2] dark:text-[#00f0ff] text-sm font-medium mb-4">{player.title}</p>

          {/* Stats */}
          <div
            className={`flex items-center ${position === 1 ? 'gap-6' : 'gap-4'} w-full justify-center bg-gray-50/80 dark:bg-slate-900/50 backdrop-blur-sm ${position === 1 ? 'p-4' : 'p-3'} rounded-xl border border-gray-100 dark:border-slate-700/50 mt-auto`}
          >
            <div className="text-center">
              <p
                className={`text-[10px] ${position === 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-slate-400'} uppercase tracking-wider font-semibold mb-1`}
              >
                Rating
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`${position === 1 ? 'text-xl' : 'text-lg'} font-bold text-gray-900 dark:text-white font-mono`}
              >
                {player.rating?.toLocaleString()}
              </motion.p>
            </div>
            <div
              className={`w-px ${position === 1 ? 'h-10' : 'h-8'} bg-gray-200 dark:bg-slate-600`}
            />
            <div className="text-center">
              <p
                className={`text-[10px] ${position === 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-slate-400'} uppercase tracking-wider font-semibold mb-1`}
              >
                Win Rate
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className={`${position === 1 ? 'text-xl' : 'text-lg'} font-bold text-green-500 dark:text-green-400`}
              >
                {player.winRate}%
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PodiumCard
