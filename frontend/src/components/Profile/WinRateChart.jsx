import { Progress } from 'antd'

// Win Rate Circle Chart Component
export function WinRateChart({ winRate, wins, losses }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6">Win Rate</h3>
      <div className="flex items-center justify-center mb-6">
        <Progress
          type="circle"
          percent={winRate}
          strokeColor="#1d7af2"
          trailColor="rgba(107, 114, 128, 0.2)"
          strokeWidth={10}
          size={140}
          format={(percent) => (
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-900 dark:text-white">{percent}%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Overall</span>
            </div>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <span className="block text-lg font-bold text-green-500">{wins}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Wins</span>
        </div>
        <div>
          <span className="block text-lg font-bold text-red-500">{losses}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Losses</span>
        </div>
      </div>
    </div>
  )
}

export default WinRateChart
