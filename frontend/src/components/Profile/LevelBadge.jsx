import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * LevelBadge - Circular XP progress ring with level display
 * @param {Object} props
 * @param {number} props.level - Current player level
 * @param {number} props.currentXP - Current XP amount
 * @param {number} props.xpToNextLevel - XP needed for next level
 * @param {string} props.tier - Player tier (grandmaster/diamond/platinum/gold/silver/bronze)
 * @param {number} props.size - Ring size in pixels (default: 120)
 */
export function LevelBadge({
  level = 1,
  currentXP = 0,
  xpToNextLevel = 1000,
  tier = 'gold',
  size = 120,
}) {
  const progress = useMemo(() => {
    return Math.min(100, (currentXP / xpToNextLevel) * 100)
  }, [currentXP, xpToNextLevel])

  const tierColors = {
    grandmaster: { from: '#7c3aed', to: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' },
    diamond: { from: '#06b6d4', to: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)' },
    platinum: { from: '#64748b', to: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)' },
    gold: { from: '#d97706', to: '#fbbf24', glow: 'rgba(245, 158, 11, 0.5)' },
    silver: { from: '#6b7280', to: '#d1d5db', glow: 'rgba(156, 163, 175, 0.4)' },
    bronze: { from: '#92400e', to: '#d97706', glow: 'rgba(180, 83, 9, 0.4)' },
  }

  const colors = tierColors[tier?.toLowerCase()] || tierColors.gold
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-50"
        style={{ background: colors.glow }}
      />

      
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
      >
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="8"
          fill="none"
        />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#levelGradient-${tier})`}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        <defs>
          <linearGradient id={`levelGradient-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
      </svg>

      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-2xl font-black text-white"
          style={{ textShadow: `0 0 20px ${colors.glow}` }}
        >
          {level}
        </motion.span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Level
        </span>
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-6 left-0 right-0 text-center"
      >
        <span className="text-xs font-medium text-slate-400">
          {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
        </span>
      </motion.div>
    </div>
  )
}

export default LevelBadge
