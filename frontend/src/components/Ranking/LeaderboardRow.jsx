import { Avatar, Progress, Button } from 'antd'
import { Swords, CheckCircle } from 'lucide-react'

export function LeaderboardRow({ player, onChallenge }) {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${player.isCurrentUser ? 'bg-[#1d7af2]/5 border-l-4 border-l-[#1d7af2]' : ''}`}>
      <td className="py-4 px-6 text-center">
        <span className={`font-bold text-lg ${player.isCurrentUser ? 'text-[#1d7af2]' : 'text-gray-900 dark:text-white'}`}>
          {player.rank}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          {player.avatar ? (
            <Avatar src={player.avatar} size={40} />
          ) : (
            <div className={`w-10 h-10 rounded-full ${player.isCurrentUser ? 'bg-[#1d7af2]' : 'bg-gradient-to-tr from-green-400 to-blue-500'} flex items-center justify-center text-white font-bold text-sm`}>
              {player.initials}
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {player.name}
              {player.verified && <CheckCircle size={14} className="text-blue-500" />}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{player.title}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{player.rating?.toLocaleString()}</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm text-gray-700 dark:text-gray-300">{player.gamesPlayed?.toLocaleString()}</span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Progress
            percent={player.winRate}
            showInfo={false}
            strokeColor={player.winRate >= 55 ? '#22c55e' : player.winRate >= 50 ? '#eab308' : '#ef4444'}
            trailColor="rgba(107, 114, 128, 0.2)"
            size="small"
            style={{ width: 64 }}
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{player.winRate}%</span>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        {player.isCurrentUser ? (
          <span className="text-xs text-gray-400 italic">This is you</span>
        ) : (
          <Button
            size="small"
            onClick={() => onChallenge?.(player)}
            className="text-xs font-medium border-gray-200 dark:border-gray-600 hover:border-[#1d7af2] hover:text-[#1d7af2]"
            icon={<Swords size={12} />}
          >
            Challenge
          </Button>
        )}
      </td>
    </tr>
  )
}

export default LeaderboardRow
