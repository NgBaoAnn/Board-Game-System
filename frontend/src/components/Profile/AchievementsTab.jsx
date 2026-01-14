import { useState, useEffect, useMemo } from 'react'
import { Progress, Spin, Empty, Select, Button } from 'antd'
import { motion } from 'framer-motion'
import { Trophy, Filter, Sparkles, Gift } from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import { userApi } from '@/api/user'
import gameApi from '@/api/api-game'

// Game icons mapping
const gameIcons = {
  'MINESWEEPER': '💣',
  'SNAKE': '🐍',
  'TETRIS': '🧱',
}

// Rarity configuration with gaming-style colors
const rarityConfig = {
  common: {
    bgClass: 'bg-slate-100 dark:bg-slate-700/50',
    textClass: 'text-slate-600 dark:text-slate-300',
    borderClass: 'border-slate-200 dark:border-slate-600',
    label: null,
    progressColor: '#6b7280',
  },
  rare: {
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-300 dark:border-blue-500/50 shadow-blue-500/20',
    label: 'Rare',
    labelColor: 'bg-blue-500',
    progressColor: '#3b82f6',
  },
  epic: {
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-300 dark:border-purple-500/50 shadow-purple-500/20',
    label: 'Epic',
    labelColor: 'bg-purple-500',
    progressColor: '#a855f7',
  },
  legendary: {
    bgClass: 'bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-300 dark:border-amber-500/50 shadow-amber-500/30',
    label: 'Legendary',
    labelColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    progressColor: { '0%': '#f59e0b', '100%': '#fbbf24' },
  },
}

// Map condition value to rarity
function getRarityFromCondition(conditionValue) {
  if (conditionValue >= 1000) return 'legendary'
  if (conditionValue >= 500) return 'epic'
  if (conditionValue >= 100) return 'rare'
  return 'common'
}

function AchievementCard({ achievement, index }) {
  const rarity = achievement.rarity || 'common'
  const config = rarityConfig[rarity] || rarityConfig.common

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-lg ${config.borderClass}`}
    >
      {/* Rarity Label */}
      {config.label && (
        <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${config.labelColor}`}>
          {config.label}
        </span>
      )}

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${config.bgClass} ${config.textClass}`}
      >
        <Trophy size={24} />
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">
            {achievement.name}
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 whitespace-nowrap">
            {gameIcons[achievement.game_code] || '🎮'} {achievement.game_name}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
          {achievement.description || `Score ${achievement.condition_value} points`}
        </p>

        {/* Completed Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
            <Sparkles size={12} className="fill-current" />
            Completed!
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(achievement.achieved_at).toLocaleDateString('vi-VN')}
          </span>
        </div>
        
        <Progress
          percent={100}
          showInfo={false}
          strokeColor={config.progressColor}
          trailColor="rgba(107, 114, 128, 0.2)"
          size="small"
          className="mt-1"
        />
      </div>
    </motion.div>
  )
}

export function AchievementsTab() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        // Fetch both achievements and games list
        const [achievementsRes, gamesRes] = await Promise.all([
          userApi.getAchievements(user.id),
          gameApi.getActiveGames()
        ])
        
        const achievementsData = achievementsRes.achievements || []
        const gamesData = gamesRes.data || []
        
        // Transform achievements data
        setAchievements(achievementsData.map(a => ({
          ...a,
          rarity: getRarityFromCondition(a.condition_value),
        })))
        
        // Set games for filter
        setGames(gamesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Filter achievements by selected game
  const filteredAchievements = useMemo(() => {
    if (selectedGame === 'all') return achievements
    return achievements.filter(a => a.game_id === selectedGame)
  }, [achievements, selectedGame])

  // Stats based on filtered achievements
  const totalCount = filteredAchievements.length
  const legendaryCount = filteredAchievements.filter(a => a.rarity === 'legendary').length
  const epicCount = filteredAchievements.filter(a => a.rarity === 'epic').length
  const rareCount = filteredAchievements.filter(a => a.rarity === 'rare').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spin size="large" tip="Loading achievements..." />
      </div>
    )
  }

  return (
    <div>
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          Your Achievements
        </h3>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <Select
            value={selectedGame}
            onChange={setSelectedGame}
            className="min-w-[180px]"
            size="middle"
            options={[
              { value: 'all', label: '🎮 All Games' },
              ...games.map(g => ({
                value: g.id,
                label: `${gameIcons[g.code] || '🎮'} ${g.name}`
              }))
            ]}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-amber-500">{legendaryCount}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Legendary</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-purple-500">{epicCount}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Epic</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-blue-500">{rareCount}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Rare</span>
        </div>
      </div>

      {/* Achievement List - Using compact card style from Overview */}
      {filteredAchievements.length > 0 ? (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
          <div className="space-y-4">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-100 dark:border-gray-700">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500 dark:text-gray-400">
                {selectedGame === 'all' 
                  ? 'No achievements unlocked yet. Play some games to earn achievements!'
                  : 'No achievements unlocked for this game yet. Keep playing!'}
              </span>
            }
          />
        </div>
      )}
    </div>
  )
}

export default AchievementsTab
