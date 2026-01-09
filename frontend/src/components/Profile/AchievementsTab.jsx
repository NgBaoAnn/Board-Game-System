import { Progress } from 'antd'
import { Trophy, Brain, Users, Target, Zap, Star, Crown, Shield, Sword, Gem } from 'lucide-react'

const allAchievements = [
  { id: 1, name: 'Strategist Master', description: 'Win 50 strategy games', progress: 90, current: 45, total: 50, color: 'yellow', icon: Trophy, rarity: 'legendary', unlocked: true },
  { id: 2, name: 'Puzzle Solver', description: 'Complete 20 puzzle challenges', progress: 60, current: 12, total: 20, color: 'blue', icon: Brain, rarity: 'rare', unlocked: true },
  { id: 3, name: 'Community Pillar', description: 'Help 100 new players', progress: 100, current: 100, total: 100, color: 'purple', icon: Users, rarity: 'epic', unlocked: true },
  { id: 4, name: 'Sharpshooter', description: 'Win 10 games in a row', progress: 30, current: 3, total: 10, color: 'green', icon: Target, rarity: 'rare', unlocked: true },
  { id: 5, name: 'Speed Demon', description: 'Win a game in under 5 minutes', progress: 100, current: 1, total: 1, color: 'orange', icon: Zap, rarity: 'common', unlocked: true },
  { id: 6, name: 'Rising Star', description: 'Reach Level 10', progress: 100, current: 10, total: 10, color: 'yellow', icon: Star, rarity: 'common', unlocked: true },
  { id: 7, name: 'Champion', description: 'Win a tournament', progress: 0, current: 0, total: 1, color: 'gold', icon: Crown, rarity: 'legendary', unlocked: false },
  { id: 8, name: 'Defender', description: 'Block 100 attacks', progress: 45, current: 45, total: 100, color: 'blue', icon: Shield, rarity: 'rare', unlocked: true },
  { id: 9, name: 'Warrior', description: 'Play 500 games', progress: 80, current: 400, total: 500, color: 'red', icon: Sword, rarity: 'epic', unlocked: true },
  { id: 10, name: 'Collector', description: 'Own all game pieces', progress: 0, current: 0, total: 50, color: 'purple', icon: Gem, rarity: 'legendary', unlocked: false },
]

const colorClasses = {
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  gold: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
}

const progressColors = {
  yellow: '#eab308',
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f97316',
  red: '#ef4444',
  gold: '#f59e0b',
}

const rarityConfig = {
  common: { label: 'Common', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' },
  rare: { label: 'Rare', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  epic: { label: 'Epic', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  legendary: { label: 'Legendary', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
}

function AchievementCard({ achievement }) {
  const Icon = achievement.icon
  const rarity = rarityConfig[achievement.rarity]
  const isCompleted = achievement.progress === 100
  const isLocked = !achievement.unlocked

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md ${
        isLocked ? 'opacity-60 grayscale' : ''
      }`}
    >
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[achievement.color] || colorClasses.blue}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rarity.bg} ${rarity.text}`}>
          {rarity.label}
        </span>
      </div>

      
      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{achievement.description}</p>

      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'In Progress'}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {achievement.current}/{achievement.total}
          </span>
        </div>
        <Progress
          percent={achievement.progress}
          showInfo={false}
          strokeColor={isLocked ? '#9ca3af' : progressColors[achievement.color]}
          trailColor="rgba(107, 114, 128, 0.2)"
          size="small"
        />
      </div>

      
      {isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Achievement Unlocked
          </span>
        </div>
      )}
    </div>
  )
}

export function AchievementsTab() {
  const unlockedCount = allAchievements.filter(a => a.unlocked).length
  const completedCount = allAchievements.filter(a => a.progress === 100).length

  return (
    <div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-3xl font-bold text-gray-900 dark:text-white">{allAchievements.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Achievements</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-3xl font-bold text-green-500">{completedCount}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-3xl font-bold text-[#1d7af2]">{unlockedCount}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Unlocked</span>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}

export default AchievementsTab
