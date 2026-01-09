import { useState } from 'react'
import { Table, Select, Tag, Input, Empty } from 'antd'
import { Search, Calendar } from 'lucide-react'

const { Option } = Select

const gameHistoryData = [
  { id: 1, game: 'Settlers of Catan', result: 'win', score: '+25', players: ['AlexM', 'SarahJ', 'BoardMaster99'], date: '2024-01-08', duration: '45 min' },
  { id: 2, game: 'Chess', result: 'win', score: '+18', players: ['GrandMaster42'], date: '2024-01-07', duration: '12 min' },
  { id: 3, game: 'Monopoly', result: 'loss', score: '-10', players: ['MoneyMaker', 'RichKid', 'Banker101'], date: '2024-01-07', duration: '2h 15min' },
  { id: 4, game: 'Ticket to Ride', result: 'win', score: '+22', players: ['TrainLover', 'Railways99'], date: '2024-01-06', duration: '55 min' },
  { id: 5, game: 'Catan: Seafarers', result: 'draw', score: '+5', players: ['PirateKing', 'IslandHopper', 'NavyBlue'], date: '2024-01-05', duration: '1h 10min' },
  { id: 6, game: 'Chess', result: 'loss', score: '-15', players: ['ChessBot9000'], date: '2024-01-04', duration: '8 min' },
  { id: 7, game: 'Pandemic', result: 'win', score: '+30', players: ['DrCure', 'Scientist', 'Medic42'], date: '2024-01-03', duration: '50 min' },
  { id: 8, game: 'Risk', result: 'win', score: '+28', players: ['Conqueror', 'General', 'Commander', 'Soldier'], date: '2024-01-02', duration: '3h 20min' },
]

const gameImages = {
  'Settlers of Catan': '🏝️',
  'Chess': '♟️',
  'Monopoly': '🎩',
  'Ticket to Ride': '🚂',
  'Catan: Seafarers': '⛵',
  'Pandemic': '🦠',
  'Risk': '⚔️',
}

export function GameHistoryTab() {
  const [searchText, setSearchText] = useState('')
  const [resultFilter, setResultFilter] = useState('all')

  const filteredData = gameHistoryData.filter((item) => {
    const matchesSearch = item.game.toLowerCase().includes(searchText.toLowerCase())
    const matchesResult = resultFilter === 'all' || item.result === resultFilter
    return matchesSearch && matchesResult
  })

  const columns = [
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
      render: (text) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{gameImages[text] || '🎮'}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{text}</span>
        </div>
      ),
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: (result) => {
        const config = {
          win: { color: 'success', text: 'Victory' },
          loss: { color: 'error', text: 'Defeat' },
          draw: { color: 'warning', text: 'Draw' },
        }
        return <Tag color={config[result].color}>{config[result].text}</Tag>
      },
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span className={`font-bold ${score.startsWith('+') ? 'text-green-500' : score.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
          {score} PTS
        </span>
      ),
    },
    {
      title: 'Players',
      dataIndex: 'players',
      key: 'players',
      render: (players) => (
        <span className="text-gray-600 dark:text-gray-400">
          vs. {players.slice(0, 2).join(', ')}{players.length > 2 ? ` +${players.length - 2} more` : ''}
        </span>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <span className="text-gray-500 dark:text-gray-400">{duration}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Calendar size={14} />
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      ),
    },
  ]

  const totalGames = gameHistoryData.length
  const wins = gameHistoryData.filter(g => g.result === 'win').length
  const losses = gameHistoryData.filter(g => g.result === 'loss').length

  return (
    <div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-gray-900 dark:text-white">{totalGames}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Games</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-green-500">{wins}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Victories</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-red-500">{losses}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Defeats</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-[#1d7af2]">{((wins / totalGames) * 100).toFixed(0)}%</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search games..."
            prefix={<Search className="text-gray-400" size={18} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-xs rounded-lg"
            size="large"
          />
          <Select
            value={resultFilter}
            onChange={setResultFilter}
            className="min-w-[150px]"
            size="large"
          >
            <Option value="all">All Results</Option>
            <Option value="win">Victories</Option>
            <Option value="loss">Defeats</Option>
            <Option value="draw">Draws</Option>
          </Select>
        </div>

        
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No games found"
              />
            ),
          }}
          className="game-history-table"
        />
      </div>
    </div>
  )
}

export default GameHistoryTab
