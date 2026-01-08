import { useState } from 'react'
import { Table, Avatar, Progress, Button } from 'antd'
import { Swords, CheckCircle } from 'lucide-react'
import { PodiumCard } from '@/components/Ranking/PodiumCard'
import { LeaderboardFilters } from '@/components/Ranking/LeaderboardFilters'

// Mock leaderboard data
const leaderboardData = [
  { id: 1, rank: 1, name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?img=1', title: 'Grandmaster', rating: 2485, gamesPlayed: 2150, winRate: 72, isChampion: true },
  { id: 2, rank: 2, name: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?img=2', title: 'Master Strategist', rating: 2350, gamesPlayed: 1890, winRate: 68 },
  { id: 3, rank: 3, name: 'Michael Jordan', avatar: null, initials: 'MJ', title: 'Elite Player', rating: 2310, gamesPlayed: 1654, winRate: 65 },
  { id: 4, rank: 4, name: 'Emily Lin', avatar: 'https://i.pravatar.cc/150?img=4', title: 'Diamond League', rating: 2298, gamesPlayed: 1402, winRate: 62, verified: true },
  { id: 5, rank: 5, name: 'Marcus Reed', avatar: 'https://i.pravatar.cc/150?img=5', title: 'Platinum League', rating: 2150, gamesPlayed: 890, winRate: 58 },
  { id: 6, rank: 6, name: 'Sofia Andres', avatar: null, initials: 'SA', title: 'Platinum League', rating: 2125, gamesPlayed: 543, winRate: 51 },
  { id: 7, rank: 42, name: 'You (Player One)', avatar: null, initials: 'ME', title: 'Gold League', rating: 1850, gamesPlayed: 320, winRate: 55, isCurrentUser: true },
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
      width: 80,
      align: 'center',
      render: (rank, record) => (
        <span className={`font-bold text-lg ${record.isCurrentUser ? 'text-[#1d7af2]' : 'text-gray-900 dark:text-white'}`}>
          {rank}
        </span>
      ),
    },
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {record.avatar ? (
            <Avatar src={record.avatar} size={40} />
          ) : (
            <div className={`w-10 h-10 rounded-full ${record.isCurrentUser ? 'bg-[#1d7af2]' : 'bg-gradient-to-tr from-green-400 to-blue-500'} flex items-center justify-center text-white font-bold text-sm`}>
              {record.initials}
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {name}
              {record.verified && <CheckCircle size={14} className="text-blue-500" />}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{record.title}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating (ELO)',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{rating.toLocaleString()}</span>,
    },
    {
      title: 'Games Played',
      dataIndex: 'gamesPlayed',
      key: 'gamesPlayed',
      render: (games) => <span className="text-sm text-gray-700 dark:text-gray-300">{games.toLocaleString()}</span>,
    },
    {
      title: 'Win Rate',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (winRate) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={winRate}
            showInfo={false}
            strokeColor={winRate >= 55 ? '#22c55e' : winRate >= 50 ? '#eab308' : '#ef4444'}
            trailColor="rgba(107, 114, 128, 0.2)"
            size="small"
            style={{ width: 64 }}
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{winRate}%</span>
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_, record) =>
        record.isCurrentUser ? (
          <span className="text-xs text-gray-400 italic">This is you</span>
        ) : (
          <Button size="small" className="text-xs font-medium" icon={<Swords size={12} />}>
            Challenge
          </Button>
        ),
    },
  ]

  return (
    <div className="p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Global Leaderboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Compete with the best players across all supported board games.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Season ends in:</span>
          <div className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-mono font-medium text-gray-900 dark:text-white">
            14d 05h 22m
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end">
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
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
          rowClassName={(record) => record.isCurrentUser ? 'bg-[#1d7af2]/5 border-l-4 border-l-[#1d7af2]' : ''}
          className="ranking-table"
        />
      </div>
    </div>
  )
}
