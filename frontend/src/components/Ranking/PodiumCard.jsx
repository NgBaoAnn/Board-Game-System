import { Avatar } from 'antd'
import { Crown, Award } from 'lucide-react'

// Podium Card Component for Top 3
export function PodiumCard({ player, position }) {
  const configs = {
    1: { borderColor: 'border-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/10', iconBg: 'bg-yellow-400', scale: 'scale-105', ringColor: 'ring-yellow-400/20', avatarBorder: 'border-yellow-100 dark:border-yellow-900/30' },
    2: { borderColor: 'border-gray-400', bgColor: '', iconBg: 'bg-gray-400', scale: '', ringColor: '', avatarBorder: 'border-gray-100 dark:border-gray-700' },
    3: { borderColor: 'border-orange-400', bgColor: '', iconBg: 'bg-orange-400', scale: '', ringColor: '', avatarBorder: 'border-gray-100 dark:border-gray-700' },
  }

  const config = configs[position]
  const avatarSize = position === 1 ? 96 : 80
  const iconSize = position === 1 ? 48 : 40

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md border-t-4 ${config.borderColor} p-6 flex flex-col items-center relative transform hover:-translate-y-1 transition-transform ${config.scale} ${position === 1 ? 'z-10 shadow-lg' : ''}`}>
      {/* Rank Badge */}
      <div className={`absolute -top-5 ${config.iconBg} rounded-full flex items-center justify-center text-white font-bold shadow-md z-10`} style={{ width: iconSize, height: iconSize }}>
        {position === 1 ? <Crown size={24} /> : position}
      </div>

      {/* Avatar */}
      <div className="relative mb-3 mt-2">
        {player.avatar ? (
          <Avatar
            src={player.avatar}
            size={avatarSize}
            className={`border-4 ${config.avatarBorder} ${position === 1 ? `ring-4 ${config.ringColor}` : ''}`}
          />
        ) : (
          <div
            className={`rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold border-4 ${config.avatarBorder}`}
            style={{ width: avatarSize, height: avatarSize, fontSize: avatarSize / 3 }}
          >
            {player.initials}
          </div>
        )}
        {position === 1 && (
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
            CHAMPION
          </div>
        )}
        {position !== 1 && (
          <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm">
            <Award size={14} className={position === 2 ? 'text-gray-400' : 'text-orange-400'} />
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className={`font-bold ${position === 1 ? 'text-xl' : 'text-lg'} text-gray-900 dark:text-white`}>{player.name}</h3>
      <p className="text-[#1d7af2] text-sm font-medium mb-4">{player.title}</p>

      {/* Stats */}
      <div className={`flex items-center ${position === 1 ? 'space-x-6' : 'space-x-4'} w-full justify-center ${config.bgColor || 'bg-gray-50 dark:bg-gray-800/50'} ${position === 1 ? 'p-3' : 'p-2'} rounded-lg ${position === 1 ? 'border border-yellow-100 dark:border-yellow-900/20' : ''}`}>
        <div className="text-center">
          <p className={`text-[10px] ${position === 1 ? 'text-yellow-700 dark:text-yellow-500 font-bold' : 'text-gray-500'} uppercase tracking-wide`}>Rating</p>
          <p className={`${position === 1 ? 'text-lg' : ''} font-bold text-gray-900 dark:text-white`}>{player.rating?.toLocaleString()}</p>
        </div>
        <div className={`w-px ${position === 1 ? 'h-8' : 'h-6'} ${position === 1 ? 'bg-yellow-200 dark:bg-yellow-800' : 'bg-gray-200 dark:bg-gray-700'}`} />
        <div className="text-center">
          <p className={`text-[10px] ${position === 1 ? 'text-yellow-700 dark:text-yellow-500 font-bold' : 'text-gray-500'} uppercase tracking-wide`}>Win Rate</p>
          <p className={`${position === 1 ? 'text-lg' : ''} font-bold text-green-500`}>{player.winRate}%</p>
        </div>
      </div>
    </div>
  )
}

export default PodiumCard
