import { useState, useEffect, useCallback } from 'react'
import { Table, Select, Input, Empty, Tag, Spin } from 'antd'
import { Search, Calendar } from 'lucide-react'
import gameApi from '@/api/api-game'

const { Option } = Select

const gameImages = {
  'Settlers of Catan': '🏝️',
  'Chess': '♟️',
  'Monopoly': '🎩',
  'Ticket to Ride': '🚂',
  'Catan: Seafarers': '⛵',
  'Pandemic': '🦠',
  'Risk': '⚔️',
  'Minesweeper': '💣',
  'Snake': '🐍',
  'Tetris': '🧱',
}

export function GameHistoryTab({ userId }) {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [gameHistoryData, setGameHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  const fetchGameHistory = useCallback(async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const response = await gameApi.getGameHistory(userId, pagination.page, pagination.limit)
      const data = response.data?.data || response.data || []
      const paginationData = response.data?.pagination || {}
      
      setGameHistoryData(data.map(item => ({
        id: item.id,
        game: item.game_name || 'Unknown Game',
        game_code: item.game_code,
        status: item.status,
        score: item.final_score || 0,
        date: item.created_at,
        duration: item.duration || 'N/A',
      })))
      setPagination(prev => ({ ...prev, total: paginationData.total || 0 }))
    } catch (error) {
      console.error('Failed to fetch game history:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, pagination.page, pagination.limit])

  useEffect(() => {
    fetchGameHistory()
  }, [fetchGameHistory])

  const filteredData = gameHistoryData.filter((item) => {
    const matchesSearch = item.game.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{gameImages[text] || '🎮'}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{text}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          FINISHED: { color: 'success', text: 'Completed' },
          ABANDONED: { color: 'error', text: 'Abandoned' },
          PLAYING: { color: 'processing', text: 'Playing' },
          PAUSED: { color: 'warning', text: 'Paused' },
        }
        const statusConfig = config[status] || { color: 'default', text: status }
        return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
      },
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span className={`font-bold ${score > 0 ? 'text-green-500' : 'text-gray-500'}`}>
          {score} PTS
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
          {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
        </div>
      ),
    },
  ]

  const totalGames = gameHistoryData.length
  const completed = gameHistoryData.filter(g => g.status === 'FINISHED').length
  const abandoned = gameHistoryData.filter(g => g.status === 'ABANDONED').length
  const totalScore = gameHistoryData.reduce((sum, g) => sum + (g.score || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spin size="large" tip="Loading game history..." />
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-gray-900 dark:text-white">{totalGames}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Games</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-green-500">{completed}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-red-500">{abandoned}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Abandoned</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-[#1d7af2]">{totalScore}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Score</span>
        </div>
      </div>

      {/* Table */}
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
            value={statusFilter}
            onChange={setStatusFilter}
            className="min-w-[150px]"
            size="large"
          >
            <Option value="all">All Status</Option>
            <Option value="FINISHED">Completed</Option>
            <Option value="ABANDONED">Abandoned</Option>
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
