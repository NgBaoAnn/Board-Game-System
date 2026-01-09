import { useState } from 'react'
import { Table, Avatar, Progress, Button } from 'antd'
import { motion } from 'framer-motion'
import { Swords, CheckCircle, TrendingUp, TrendingDown, Trophy } from 'lucide-react'
import { PodiumCard } from '@/components/Ranking/PodiumCard'
import { LeaderboardFilters } from '@/components/Ranking/LeaderboardFilters'
import { TierBadge } from '@/components/Ranking/TierBadge'
import { SeasonCountdown } from '@/components/Ranking/SeasonCountdown'

// Mock leaderboard data with rank changes
const leaderboardData = [
  { id: 1, rank: 1, name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?img=1', title: 'Grandmaster', rating: 2485, gamesPlayed: 2150, winRate: 72, isChampion: true, rankChange: 0 },
  { id: 2, rank: 2, name: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?img=2', title: 'Grandmaster', rating: 2350, gamesPlayed: 1890, winRate: 68, rankChange: 1 },
  { id: 3, rank: 3, name: 'Michael Jordan', avatar: null, initials: 'MJ', title: 'Diamond', rating: 2310, gamesPlayed: 1654, winRate: 65, rankChange: -1 },
  { id: 4, rank: 4, name: 'Emily Lin', avatar: 'https://i.pravatar.cc/150?img=4', title: 'Diamond', rating: 2298, gamesPlayed: 1402, winRate: 62, verified: true, rankChange: 2 },
  { id: 5, rank: 5, name: 'Marcus Reed', avatar: 'https://i.pravatar.cc/150?img=5', title: 'Platinum', rating: 2150, gamesPlayed: 890, winRate: 58, rankChange: 0 },
  { id: 6, rank: 6, name: 'Sofia Andres', avatar: null, initials: 'SA', title: 'Platinum', rating: 2125, gamesPlayed: 543, winRate: 51, rankChange: -2 },
  { id: 7, rank: 42, name: 'You (Player One)', avatar: null, initials: 'ME', title: 'Gold', rating: 1850, gamesPlayed: 320, winRate: 55, isCurrentUser: true, rankChange: 5 },
]

export default function RankingPage() {
  const [searchText, setSearchText] = useState('')
  const [gameFilter, setGameFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('season')
  const [viewMode, setViewMode] = useState('Global')

  const top3 = leaderboardData.filter(p => p.rank <= 3).sort((a, b) => a.rank - b.rank)
  const restPlayers = leaderboardData.filter(p => p.rank > 3)

  const filteredPlayers = restPlayers.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      align: 'center',
      render: (rank, record) => (
        <div className="flex items-center justify-center gap-2">
          <span className={`font-bold text-lg font-mono ${record.isCurrentUser ? 'text-[#00f0ff]' : 'text-white'}`}>
            #{rank}
          </span>
          {record.rankChange !== 0 && (
            <span className={record.rankChange > 0 ? 'rank-up' : 'rank-down'}>
              {record.rankChange > 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {record.avatar ? (
            <Avatar
              src={record.avatar}
              size={44}
              className={`border-2 ${record.isCurrentUser ? 'border-[#00f0ff]' : 'border-slate-600'}`}
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                record.isCurrentUser
                  ? 'bg-gradient-to-br from-[#00f0ff] to-[#a855f7]'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}
            >
              {record.initials}
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              {name}
              {record.verified && <CheckCircle size={14} className="text-[#00f0ff]" />}
              {record.isCurrentUser && (
                <span className="text-[10px] bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.5 rounded font-medium ml-1">
                  YOU
                </span>
              )}
            </div>
            <div className="mt-1">
              <TierBadge tier={record.title} size="sm" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating (ELO)',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <span className="text-lg font-mono font-bold text-white">{rating.toLocaleString()}</span>
      ),
    },
    {
      title: 'Games Played',
      dataIndex: 'gamesPlayed',
      key: 'gamesPlayed',
      render: (games) => (
        <span className="text-sm text-slate-300 font-medium">{games.toLocaleString()}</span>
      ),
    },
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (winRate) => (
        <div className="flex items-center gap-3">
          <Progress
            percent={winRate}
            showInfo={false}
            strokeColor={{
              '0%': winRate >= 55 ? '#22c55e' : winRate >= 50 ? '#eab308' : '#ef4444',
              '100%': winRate >= 55 ? '#16a34a' : winRate >= 50 ? '#ca8a04' : '#dc2626',
            }}
            trailColor="rgba(148, 163, 184, 0.2)"
            size="small"
            style={{ width: 80 }}
          />
          <span
            className={`text-sm font-bold ${
              winRate >= 55 ? 'text-green-400' : winRate >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {winRate}%
          </span>
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_, record) =>
        record.isCurrentUser ? (
          <span className="text-xs text-slate-500 italic">This is you</span>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="small"
              className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] border-none text-white font-bold text-xs px-3 hover:shadow-lg hover:shadow-[#00f0ff]/20"
              icon={<Swords size={12} />}
            >
              Challenge
            </Button>
          </motion.div>
        ),
    },
  ]

  return (
    <div className="p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-white to-[#a855f7] flex items-center gap-3"
          >
            <Trophy className="text-yellow-400" size={36} />
            Global Leaderboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-2"
          >
            Compete with the best players across all supported board games.
          </motion.p>
        </div>
        <SeasonCountdown daysRemaining={14} hoursRemaining={5} minutesRemaining={22} />
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
        <div className="order-2 md:order-1">
          {top3[1] && <PodiumCard player={top3[1]} position={2} />}
        </div>
        <div className="order-1 md:order-2">
          {top3[0] && <PodiumCard player={top3[0]} position={1} />}
        </div>
        <div className="order-3">
          {top3[2] && <PodiumCard player={top3[2]} position={3} />}
        </div>
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
      >
        <LeaderboardFilters
          searchText={searchText}
          onSearchChange={setSearchText}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          gameFilter={gameFilter}
          onGameFilterChange={setGameFilter}
          periodFilter={periodFilter}
          onPeriodFilterChange={setPeriodFilter}
        />
        <Table
          columns={columns}
          dataSource={filteredPlayers}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowClassName={(record) => (record.isCurrentUser ? 'current-user-row' : '')}
          className="ranking-table"
        />
      </motion.div>
    </div>
  )
}
