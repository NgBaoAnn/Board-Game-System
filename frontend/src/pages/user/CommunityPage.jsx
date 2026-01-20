import { useState, useMemo, useEffect, useCallback } from 'react'
import { Tabs, Select, Input, message, Modal, Spin } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Users, Search, Gamepad2, Sparkles, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FriendCard } from '@/components/Community/FriendCard'
import { FriendRequestCard } from '@/components/Community/FriendRequestCard'
import { PlayerCard } from '@/components/Community/PlayerCard'
import { EmptyState } from '@/components/Community/EmptyState'
import friendApi from '@/api/api-friend'

export default function CommunityPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [requests, setRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [sentRequestIds, setSentRequestIds] = useState(new Set()) // Track sent friend requests
  const [sortBy, setSortBy] = useState('status')
  const [activeTab, setActiveTab] = useState('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [playersLoading, setPlayersLoading] = useState(false)

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    try {
      const response = await friendApi.getFriends(1, 100)
      const friendsData = response.data?.data || response.data || []
      setFriends(friendsData.map(f => ({
        id: f.id,
        name: f.username || f.name,
        avatar: f.avatar_url || f.avatar,
        status: 'offline', // API doesn't provide real-time status yet
        activity: null,
        lastSeen: 'Recently',
        tier: 'gold',
      })))
    } catch (error) {
      console.error('Failed to fetch friends:', error)
    }
  }, [])

  // Fetch received requests
  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true)
    try {
      const response = await friendApi.getReceivedRequests(1, 100)
      const requestsData = response.data?.data || response.data || []
      setRequests(requestsData.map(r => ({
        id: r.id,
        name: r.from_user_username || r.username || 'Unknown',
        avatar: r.from_user_avatar_url || r.avatar || 'https://i.pravatar.cc/150',
        note: r.message || 'Wants to be friends',
        mutualFriends: 0,
        gamesInCommon: [],
        tier: 'gold',
        isNew: true,
        fromUserId: r.from || r.from_user_id,
      })))
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setRequestsLoading(false)
    }
  }, [])

  // Fetch all players (non-friends)
  const fetchAllPlayers = useCallback(async (search = '') => {
    setPlayersLoading(true)
    try {
      const response = await friendApi.getNonFriends(1, 50, search)
      const usersData = response.data?.data || response.data || []
      setAllPlayers(usersData.map(u => ({
        id: u.id,
        name: u.username || u.name,
        avatar: u.avatar_url || u.avatar,
        status: 'offline',
        tier: 'gold',
        lastSeen: 'Recently',
      })))
    } catch (error) {
      console.error('Failed to fetch players:', error)
    } finally {
      setPlayersLoading(false)
    }
  }, [])

  // Fetch sent friend requests to mark them in All Players tab
  const fetchSentRequests = useCallback(async () => {
    try {
      const response = await friendApi.getSentRequests(1, 100)
      const sentData = response.data?.data || response.data || []
      const sentIds = new Set(sentData.map(r => r.to))
      setSentRequestIds(sentIds)
    } catch (error) {
      console.error('Failed to fetch sent requests:', error)
    }
  }, [])

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchFriends(), fetchRequests(), fetchAllPlayers(''), fetchSentRequests()])
      setLoading(false)
    }
    loadData()
  }, [fetchFriends, fetchRequests, fetchAllPlayers, fetchSentRequests])

  // Debounce search input for All Players tab
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch players when debounced search changes (only for players tab)
  useEffect(() => {
    if (activeTab === 'players') {
      fetchAllPlayers(debouncedSearch)
    }
  }, [debouncedSearch, activeTab, fetchAllPlayers])

  const onlineCount = useMemo(() => friends.filter((f) => f.status === 'online').length, [friends])

  const filteredFriends = useMemo(() => {
    let result = [...friends]

    if (searchQuery) {
      result = result.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'status') {
        if (a.status === 'online' && b.status !== 'online') return -1
        if (a.status !== 'online' && b.status === 'online') return 1
        return 0
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

    return result
  }, [friends, searchQuery, sortBy])

  const filteredPlayers = useMemo(() => {
    let result = [...allPlayers]

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    result.sort((a, b) => {
      if (a.status === 'online' && b.status !== 'online') return -1
      if (a.status !== 'online' && b.status === 'online') return 1
      return 0
    })

    return result
  }, [allPlayers, searchQuery])

  const handleAcceptRequest = async (id) => {
    const accepted = requests.find((r) => r.id === id)
    if (!accepted) return
    
    try {
      await friendApi.acceptRequest(id)
      setRequests((prev) => prev.filter((r) => r.id !== id))
      await fetchFriends() // Refresh friends list
      message.success(t('community.friendAccepted', { name: accepted.name }))
    } catch (error) {
      message.error(error.message || t('community.acceptError'))
    }
  }

  const handleDeclineRequest = async (id) => {
    const declined = requests.find((r) => r.id === id)
    
    try {
      await friendApi.declineRequest(id)
      setRequests((prev) => prev.filter((r) => r.id !== id))
      message.info(t('community.requestDeclined', { name: declined?.name }))
    } catch (error) {
      message.error(error.message || t('community.declineError'))
    }
  }

  const handleViewProfile = (friend) => {
    navigate(`/player/${friend.id}`)
  }

  const handleInvite = (friend, type) => {
    if (type === 'spectate') {
      message.info(t('community.spectating', { name: friend.name }))
    } else {
      message.success(t('community.inviteSent', { name: friend.name }))
    }
  }

  const handleRemoveFriend = (id) => {
    const friend = friends.find((f) => f.id === id)
    Modal.confirm({
      title: t('community.removeFriendTitle'),
      content: t('community.removeFriendConfirm', { name: friend?.name }),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await friendApi.removeFriend(id)
          setFriends((prev) => prev.filter((f) => f.id !== id))
          message.success(t('community.friendRemoved', { name: friend?.name }))
        } catch (error) {
          message.error(error.message || t('community.removeError'))
        }
      },
    })
  }

  const handleAddFriend = async (player) => {
    try {
      await friendApi.sendRequest(player.id)
      setSentRequestIds(prev => new Set([...prev, player.id]))
      message.success(t('community.requestSent', { name: player.name }))
    } catch (error) {
      message.error(error.message || t('community.sendRequestError'))
    }
  }

  const handleFindPlayers = () => {
    setActiveTab('players')
  }

  const tabItems = [
    {
      key: 'friends',
      label: (
        <span className={`flex items-center gap-2 ${activeTab === 'friends' ? '' : 'text-black dark:text-white'}`}>
          {t('community.friendList')}
          <span className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 py-0.5 px-2.5 rounded-full text-xs font-semibold">
            {friends.length}
          </span>
        </span>
      ),
    },
    {
      key: 'requests',
      label: (
        <span className={`flex items-center gap-2 ${activeTab === 'requests' ? '' : 'text-black dark:text-white'}`}>
          {t('community.friendRequests')}
          {requests.length > 0 && (
            <span className="bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] text-white py-0.5 px-2.5 rounded-full text-xs font-bold">
              {requests.length}
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'players',
      label: (
        <span className={`flex items-center gap-2 ${activeTab === 'players' ? '' : 'text-black dark:text-white'}`}>
          <Globe size={14} />
          {t('community.allPlayers')}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip={t('common.loading')} />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Users className="text-[#1d7af2] dark:text-[#00f0ff]" size={28} />
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1d7af2] via-gray-900 to-[#6366f1] dark:from-[#00f0ff] dark:via-white dark:to-[#a855f7]">
            {t('community.title')}
          </h1>
          
          <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full online-status-pulse" />
            <span className="text-xs font-bold text-green-600 dark:text-green-400">{onlineCount} {t('community.online')}</span>
          </div>
        </div>

        
        <div className="flex-1 max-w-md">
          <Input
            placeholder={activeTab === 'players' ? t('community.searchAllPlayers') : t('community.searchFriends')}
            prefix={<Search size={16} className="text-gray-400 dark:text-slate-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
            size="large"
          />
        </div>
      </motion.div>

      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="community-tabs"
      />

      
      <AnimatePresence mode="wait">
        
        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} />
              {t('community.pendingRequests')} ({requests.length})
            </h2>
            {requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {requests.map((request, index) => (
                  <FriendRequestCard
                    key={request.id}
                    friend={request}
                    index={index}
                    onAccept={handleAcceptRequest}
                    onDecline={handleDeclineRequest}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="requests" onAction={handleFindPlayers} />
            )}
          </motion.div>
        )}

        
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Gamepad2 size={14} />
                {t('community.allFriends')} ({filteredFriends.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-slate-400">
                <span>{t('community.sortBy')}:</span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  variant="borderless"
                  className="font-medium"
                  popupClassName="dark:bg-slate-800"
                  options={[
                    { value: 'status', label: t('community.onlineStatus') },
                    { value: 'name', label: t('community.nameAZ') },
                  ]}
                />
              </div>
            </div>
            {filteredFriends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredFriends.map((friend, index) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    index={index}
                    onViewProfile={handleViewProfile}
                    onRemove={handleRemoveFriend}
                    onInvite={handleInvite}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="friends" onAction={handleFindPlayers} />
            )}
          </motion.div>
        )}

        
        {activeTab === 'players' && (
          <motion.div
            key="players"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe size={14} />
              {t('community.allPlayers')} ({filteredPlayers.length})
            </h2>
            {filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {playersLoading ? (
                  <div className="col-span-full flex justify-center py-8">
                    <Spin size="large" />
                  </div>
                ) : (
                  filteredPlayers.map((player, index) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      index={index}
                      onAddFriend={handleAddFriend}
                      requestSent={sentRequestIds.has(player.id)}
                    />
                  ))
                )}
              </div>
            ) : (
              <EmptyState type="players" onAction={() => setSearchQuery('')} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
