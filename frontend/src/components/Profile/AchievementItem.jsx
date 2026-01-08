import { Progress } from 'antd'

// Achievement Item Component
export function AchievementItem({ achievement }) {
  const Icon = achievement.icon
  const colorClasses = {
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  }
  const progressColors = {
    yellow: '#eab308',
    blue: '#3b82f6',
    purple: '#a855f7',
    green: '#22c55e',
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[achievement.color] || colorClasses.blue}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{achievement.name}</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {achievement.total ? `${achievement.current}/${achievement.total}` : 'Completed'}
          </span>
        </div>
        <Progress
          percent={achievement.progress}
          showInfo={false}
          strokeColor={progressColors[achievement.color] || progressColors.blue}
          trailColor="rgba(107, 114, 128, 0.2)"
          size="small"
        />
      </div>
    </div>
  )
}

export default AchievementItem
