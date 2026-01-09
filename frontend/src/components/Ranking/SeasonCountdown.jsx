import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Gift } from 'lucide-react'
import { Tooltip } from 'antd'

/**
 * SeasonCountdown - Circular progress ring with urgency colors
 * Supports dark/light mode
 * @param {Object} props
 * @param {number} props.daysRemaining - Days remaining in the season
 */
export function SeasonCountdown({
  daysRemaining = 14,
  hoursRemaining = 5,
  minutesRemaining = 22,
  totalDays = 90,
}) {
  const progress = useMemo(() => {
    const daysElapsed = totalDays - daysRemaining
    return Math.min(100, (daysElapsed / totalDays) * 100)
  }, [daysRemaining, totalDays])

  const urgency = useMemo(() => {
    if (daysRemaining > 7) return 'safe'
    if (daysRemaining > 3) return 'warning'
    return 'urgent'
  }, [daysRemaining])

  const colors = {
    safe: { stroke: '#22c55e', text: 'text-green-500 dark:text-green-400', bg: 'bg-green-500/10' },
    warning: { stroke: '#eab308', text: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-500/10' },
    urgent: { stroke: '#ef4444', text: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10' },
  }

  const color = colors[urgency]
  const circumference = 2 * Math.PI * 36 // radius = 36

  const rewardsPreview = (
    <div className="p-3 min-w-[200px]">
      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
        <Gift size={14} className="text-yellow-400" />
        Season Rewards
      </h4>
      <ul className="text-xs space-y-1.5 text-slate-300">
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          Top 10: Exclusive Avatar Frame
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          Top 100: 500 Bonus Coins
        </li>
        <li className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          All: Season Badge
        </li>
      </ul>
    </div>
  )

  return (
    <Tooltip title={rewardsPreview} placement="bottom" color="#1e293b">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${color.bg} border border-gray-200 dark:border-slate-700 cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-slate-600 bg-white/50 dark:bg-transparent backdrop-blur-sm`}
      >
        
        <div className="relative">
          <svg width="50" height="50" className="-rotate-90">
            
            <circle
              cx="25"
              cy="25"
              r="18"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="4"
              fill="none"
            />
            
            <motion.circle
              cx="25"
              cy="25"
              r="18"
              stroke={color.stroke}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 18}
              initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 18) * (1 - progress / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock
              size={16}
              className={`${color.text} ${urgency === 'urgent' ? 'animate-pulse' : ''}`}
            />
          </div>
        </div>

        
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wider font-medium">
            Season ends in
          </span>
          <div className={`font-mono font-bold ${color.text} ${urgency === 'urgent' ? 'countdown-urgent' : ''}`}>
            <span className="text-lg">{daysRemaining}</span>
            <span className="text-xs opacity-70">d </span>
            <span className="text-lg">{String(hoursRemaining).padStart(2, '0')}</span>
            <span className="text-xs opacity-70">h </span>
            <span className="text-lg">{String(minutesRemaining).padStart(2, '0')}</span>
            <span className="text-xs opacity-70">m</span>
          </div>
        </div>

        
        <Gift size={16} className="text-yellow-500 dark:text-yellow-400 ml-1 opacity-60" />
      </motion.div>
    </Tooltip>
  )
}

export default SeasonCountdown
