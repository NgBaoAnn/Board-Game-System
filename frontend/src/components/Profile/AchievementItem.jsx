import { Progress, Button } from 'antd'
import { motion } from 'framer-motion'
import { Gift, Sparkles } from 'lucide-react'

/**
 * AchievementItem - Gaming-style achievement with rarity glow and claim button
 * @param {Object} props
 * @param {Object} props.achievement - Achievement data
 * @param {string} props.achievement.rarity - common/rare/epic/legendary
 */
export function AchievementItem({ achievement, onClaim }) {
  const Icon = achievement.icon
  
  const rarityConfig = {
    common: {
      bgClass: 'bg-slate-100 dark:bg-slate-700/50',
      textClass: 'text-slate-600 dark:text-slate-300',
      borderClass: 'achievement-common',
      label: null,
    },
    rare: {
      bgClass: 'bg-blue-100 dark:bg-blue-900/30',
      textClass: 'text-blue-600 dark:text-blue-400',
      borderClass: 'achievement-rare',
      label: 'Rare',
      labelColor: 'bg-blue-500',
    },
    epic: {
      bgClass: 'bg-purple-100 dark:bg-purple-900/30',
      textClass: 'text-purple-600 dark:text-purple-400',
      borderClass: 'achievement-epic',
      label: 'Epic',
      labelColor: 'bg-purple-500',
    },
    legendary: {
      bgClass: 'bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
      textClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'achievement-legendary',
      label: 'Legendary',
      labelColor: 'metallic-gold',
    },
  }

  const colorToRarity = {
    yellow: 'legendary',
    blue: 'rare',
    purple: 'epic',
    green: 'common',
  }

  const rarity = achievement.rarity || colorToRarity[achievement.color] || 'common'
  const config = rarityConfig[rarity] || rarityConfig.common

  const progressColors = {
    common: '#6b7280',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: { '0%': '#f59e0b', '100%': '#fbbf24' },
  }

  const isCompleted = achievement.progress >= 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className={`relative flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${config.borderClass} bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm`}
    >
      
      {config.label && (
        <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${config.labelColor}`}>
          {config.label}
        </span>
      )}

      
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgClass} ${config.textClass}`}
      >
        <Icon size={22} />
      </motion.div>

      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">
            {achievement.name}
          </span>
          {!isCompleted && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {achievement.current}/{achievement.total}
            </span>
          )}
        </div>
        
        {!isCompleted ? (
          <Progress
            percent={achievement.progress}
            showInfo={false}
            strokeColor={progressColors[rarity]}
            trailColor="rgba(107, 114, 128, 0.2)"
            size="small"
          />
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
              <Sparkles size={12} className="fill-current" />
              Completed!
            </span>
            {onClaim && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="small"
                  type="primary"
                  icon={<Gift size={12} />}
                  onClick={() => onClaim(achievement)}
                  className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] border-none text-[10px] font-bold h-6"
                >
                  Claim
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AchievementItem
