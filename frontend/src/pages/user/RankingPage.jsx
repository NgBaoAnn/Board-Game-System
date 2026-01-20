import { useState, useEffect, useCallback } from 'react'
import { Table, Avatar, Spin, Select as AntSelect } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Trophy } from 'lucide-react'
import { PodiumCard } from '@/components/Ranking/PodiumCard'
import { LeaderboardFilters } from '@/components/Ranking/LeaderboardFilters'
import { useAuth } from '@/store/useAuth'
import rankingApi from '@/api/api-ranking'
import gameApi from '@/api/api-game'

export default function RankingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [gameFilter, setGameFilter] = useState(null)
  const [viewMode, setViewMode] = useState('Global')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState([])
  const [myRankData, setMyRankData] = useState(null) // Current user's rank data

  // Fetch available games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gameApi.getActiveGames()
        const gamesData = response.data || []
        setGames(gamesData)
        // Set first game as default if available
        if (gamesData.length > 0 && !gameFilter) {
          setGameFilter(gamesData[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch games:', error)
      }
    }
    fetchGames()
  }, [])

  // Fetch leaderboard based on viewMode and gameFilter
  const fetchLeaderboard = useCallback(async () => {
    if (!gameFilter) return
    
    setLoading(true)
    try {
      let response
      if (viewMode === 'Global') {
        response = await rankingApi.getSystemRanking(gameFilter)
      } else {
        response = await rankingApi.getFriendsRanking(gameFilter)
      }
      
      // Debug log to see response structure
      console.log('Ranking API response:', response)
      
      // Axios interceptor returns response.data, so we receive { success, status, data: { data: [], pagination: {} } }
      // Backend ResponseHandler wraps: { success, status, data: serviceResponse }
      // Service returns: { data: [...], pagination: {...} }
      let data = response?.data?.data || []
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.warn('Leaderboard data is not an array:', data)
        data = []
      }
      
      // Map data to expected format with rank
      const mappedData = data.map((item, index) => ({
        id: item.user_id || item.id,
        rank: index + 1,
        name: item.username || 'Unknown',
        avatar: item.avatar_url || null,
        initials: (item.username || 'U').substring(0, 2).toUpperCase(),
        rating: item.best_score || item.final_score || 0,
        isCurrentUser: (item.user_id || item.id) === user?.id,
        achievedAt: item.achieved_at || item.ended_at || item.created_at,
      }))
      
      setLeaderboardData(mappedData)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      setLeaderboardData([])
    } finally {
      setLoading(false)
    }
  }, [gameFilter, viewMode, user?.id])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  // Fetch current user's rank separately
  useEffect(() => {
    if (!gameFilter || !user?.id) {
      setMyRankData(null)
      return
    }

    const fetchMyRank = async () => {
      try {
        const response = await rankingApi.getMyRanking(gameFilter)
        console.log('My ranking response:', response)
        
        // Get best score from response
        const data = response?.data
        if (data && (data.best_score !== undefined || data.rank !== undefined)) {
          setMyRankData({
            rank: data.rank || null,
            bestScore: data.best_score || 0,
            totalPlayers: data.total_players || leaderboardData.length,
            username: user.username,
            avatar: user.avatar_url,
            initials: (user.username || 'U').substring(0, 2).toUpperCase(),
          })
        } else {
          // User hasn't played this game yet
          setMyRankData(null)
        }
      } catch (error) {
        console.error('Failed to fetch my ranking:', error)
        setMyRankData(null)
      }
    }

    fetchMyRank()
  }, [gameFilter, user?.id, user?.username, user?.avatar_url, leaderboardData.length])

  const top3 = leaderboardData.filter(p => p.rank <= 3).sort((a, b) => a.rank - b.rank)

  // Show ALL players in the table (not just rank > 3)
  const filteredPlayers = leaderboardData.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: t('ranking.rank'),
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      align: 'center',
      render: (rank, record) => (
        <div className="flex items-center justify-center">
          <span className={`font-bold text-lg font-mono ${record.isCurrentUser ? 'text-[#1d7af2] dark:text-[#00f0ff]' : 'text-gray-900 dark:text-white'}`}>
            #{rank}
          </span>
        </div>
      ),
    },
    {
      title: t('ranking.player'),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {record.avatar ? (
            <Avatar
              src={record.avatar}
              size={44}
              className={`border-2 cursor-pointer ${record.isCurrentUser ? 'border-[#1d7af2] dark:border-[#00f0ff]' : 'border-gray-200 dark:border-slate-600'}`}
              onClick={() => navigate(`/player/${record.id}`)}
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer ${
                record.isCurrentUser
                  ? 'bg-gradient-to-br from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7]'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}
              onClick={() => navigate(`/player/${record.id}`)}
            >
              {record.initials}
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              {name}
              {record.isCurrentUser && (
                <span className="text-[10px] bg-blue-50 dark:bg-[#00f0ff]/20 text-[#1d7af2] dark:text-[#00f0ff] px-1.5 py-0.5 rounded font-medium ml-1">
                  YOU
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('ranking.score'),
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{rating.toLocaleString()}</span>
      ),
    },
    {
      title: 'Achieved At',
      dataIndex: 'achievedAt',
      key: 'achievedAt',
      render: (achievedAt) => (
        <span className="text-sm text-gray-500 dark:text-slate-300">
          {achievedAt ? new Date(achievedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </span>
      ),
    },
  ]

  if (loading && leaderboardData.length === 0) {
    return (
      <div className="p-4 md:p-8 min-h-[400px] flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1d7af2] via-gray-900 to-[#6366f1] dark:from-[#00f0ff] dark:via-white dark:to-[#a855f7] flex items-center gap-3"
          >
            <Trophy className="text-yellow-400" size={36} />
            {viewMode === 'Global' ? t('ranking.globalLeaderboard') : t('ranking.friendsLeaderboard')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-slate-400 mt-2"
          >
            {viewMode === 'Global' 
              ? t('ranking.globalDesc')
              : t('ranking.friendsDesc')
            }
          </motion.p>
        </div>
        <div className="flex items-center gap-4">
          <AntSelect
            value={gameFilter}
            onChange={setGameFilter}
            placeholder="Select Game"
            className="min-w-[180px]"
            size="large"
          >
            {games.map(game => (
              <AntSelect.Option key={game.id} value={game.id}>
                {game.name}
              </AntSelect.Option>
            ))}
          </AntSelect>
        </div>
      </div>

      {/* Podium - Top 3 */}
      {top3.length > 0 && (
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
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700/50 overflow-hidden"
      >
        <LeaderboardFilters
          searchText={searchText}
          onSearchChange={setSearchText}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <Table
          columns={columns}
          dataSource={filteredPlayers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          rowClassName={(record) => (record.isCurrentUser ? 'current-user-row bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30')}
          className="ranking-table"
          locale={{ emptyText: t('ranking.noRankings') }}
        />
      </motion.div>

      {/* Current User Rank Card - Always show if user has played */}
      {user && (myRankData || leaderboardData.find(p => p.isCurrentUser)) && (() => {
        const currentUserInList = leaderboardData.find(p => p.isCurrentUser)
        const displayData = currentUserInList || (myRankData ? {
          rank: myRankData.rank,
          rating: myRankData.bestScore,
          avatar: myRankData.avatar,
          initials: myRankData.initials,
          name: myRankData.username,
        } : null)
        
        if (!displayData) return null
        
        const totalPlayers = myRankData?.totalPlayers || leaderboardData.length
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-r from-[#1d7af2]/10 to-[#6366f1]/10 dark:from-[#00f0ff]/10 dark:to-[#a855f7]/10 backdrop-blur-sm rounded-2xl border border-[#1d7af2]/30 dark:border-[#00f0ff]/30 p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {displayData.avatar ? (
                  <Avatar src={displayData.avatar} size={56} className="border-2 border-[#1d7af2] dark:border-[#00f0ff]" />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7]">
                    {displayData.initials}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{t('ranking.yourRank')}</p>
                  <p className="text-2xl font-black text-[#1d7af2] dark:text-[#00f0ff]">
                    {displayData.rank ? (
                      <>#{displayData.rank} <span className="text-gray-900 dark:text-white font-bold text-base">{t('ranking.of')} {totalPlayers}</span></>
                    ) : (
                      <span className="text-gray-500 dark:text-slate-400 text-lg">{t('ranking.notRankedYet')}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{(displayData.rating || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">{t('ranking.score')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })()}
    </div>
  )
}
