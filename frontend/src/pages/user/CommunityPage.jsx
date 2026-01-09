import { useState, useMemo } from 'react'
import { Tabs, Select, Input, message, Modal } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Gamepad2, Sparkles, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FriendCard } from '@/components/Community/FriendCard'
import { FriendRequestCard } from '@/components/Community/FriendRequestCard'
import { PlayerCard } from '@/components/Community/PlayerCard'
import { EmptyState } from '@/components/Community/EmptyState'

const mockRequests = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?img=1',
    note: 'Wants to be friends',
    mutualFriends: 4,
    gamesInCommon: ['Chess', 'Catan'],
    tier: 'diamond',
    isNew: true,
  },
  {
    id: 2,
    name: 'David Miller',
    avatar: 'https://i.pravatar.cc/150?img=2',
    note: 'Found via Catan Group',
    mutualFriends: 2,
    gamesInCommon: ['Catan'],
    tier: 'gold',
    isNew: false,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=3',
    note: '4 Mutual Friends',
    mutualFriends: 4,
    gamesInCommon: ['Chess', 'Monopoly', 'Catan'],
    tier: 'platinum',
    isNew: true,
  },
]

const mockFriends = [
  { id: 1, name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=4', status: 'online', activity: 'Playing Chess', playingFor: '15m', lastSeen: 'Online now', tier: 'grandmaster' },
  { id: 2, name: 'Jessica Wu', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online', activity: 'In Lobby', playingFor: null, lastSeen: 'Online 5m ago', tier: 'diamond' },
  { id: 3, name: 'Tom Hiddleston', avatar: 'https://i.pravatar.cc/150?img=6', status: 'offline', activity: null, playingFor: null, lastSeen: 'Last seen 2h ago', tier: 'platinum' },
  { id: 4, name: 'Anna Bell', avatar: 'https://i.pravatar.cc/150?img=7', status: 'offline', activity: null, playingFor: null, lastSeen: 'Last seen 1d ago', tier: 'gold' },
  { id: 5, name: 'Game Master X', avatar: 'https://i.pravatar.cc/150?img=8', status: 'online', activity: 'Playing Monopoly', playingFor: '32m', lastSeen: 'Online now', tier: 'grandmaster' },
  { id: 6, name: 'StrategyQueen', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online', activity: null, playingFor: null, lastSeen: 'Online 15m ago', tier: 'diamond' },
]

const mockAllPlayers = [
  { id: 101, name: 'ChessMaster99', avatar: 'https://i.pravatar.cc/150?img=10', status: 'online', tier: 'grandmaster', lastSeen: 'Online now' },
  { id: 102, name: 'CatanKing', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online', tier: 'diamond', lastSeen: 'Online now' },
  { id: 103, name: 'BoardGameNoob', avatar: 'https://i.pravatar.cc/150?img=12', status: 'offline', tier: 'bronze', lastSeen: 'Last seen 3h ago' },
  { id: 104, name: 'MonopolyMogul', avatar: 'https://i.pravatar.cc/150?img=13', status: 'online', tier: 'platinum', lastSeen: 'Online now' },
  { id: 105, name: 'StrategyGuru', avatar: 'https://i.pravatar.cc/150?img=14', status: 'offline', tier: 'gold', lastSeen: 'Last seen 1d ago' },
  { id: 106, name: 'DiceMaster', avatar: 'https://i.pravatar.cc/150?img=15', status: 'online', tier: 'silver', lastSeen: 'Online now' },
  { id: 107, name: 'CardShark', avatar: 'https://i.pravatar.cc/150?img=16', status: 'offline', tier: 'gold', lastSeen: 'Last seen 5h ago' },
  { id: 108, name: 'TacticalTom', avatar: 'https://i.pravatar.cc/150?img=17', status: 'online', tier: 'diamond', lastSeen: 'Online now' },
  { id: 109, name: 'PuzzlePro', avatar: 'https://i.pravatar.cc/150?img=18', status: 'offline', tier: 'platinum', lastSeen: 'Last seen 2d ago' },
  { id: 110, name: 'GameWizard', avatar: 'https://i.pravatar.cc/150?img=19', status: 'online', tier: 'grandmaster', lastSeen: 'Online now' },
  { id: 111, name: 'RookieRider', avatar: 'https://i.pravatar.cc/150?img=20', status: 'offline', tier: 'bronze', lastSeen: 'Last seen 1w ago' },
  { id: 112, name: 'VictoryViper', avatar: 'https://i.pravatar.cc/150?img=21', status: 'online', tier: 'gold', lastSeen: 'Online now' },
]

export default function CommunityPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(mockRequests)
  const [friends, setFriends] = useState(mockFriends)
  const [allPlayers] = useState(mockAllPlayers)
  const [sortBy, setSortBy] = useState('status')
  const [activeTab, setActiveTab] = useState('friends')
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleAcceptRequest = (id) => {
    const accepted = requests.find((r) => r.id === id)
    if (accepted) {
      setFriends((prev) => [
        ...prev,
        { ...accepted, status: 'online', activity: null, lastSeen: 'Just added', tier: accepted.tier },
      ])
      setRequests((prev) => prev.filter((r) => r.id !== id))
      message.success(`${accepted.name} is now your friend!`)
    }
  }

  const handleDeclineRequest = (id) => {
    const declined = requests.find((r) => r.id === id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
    message.info(`Declined friend request from ${declined?.name}`)
  }

  const handleViewProfile = (friend) => {
    navigate(`/player/${friend.id}`)
  }

  const handleInvite = (friend, type) => {
    if (type === 'spectate') {
      message.info(`Spectating ${friend.name}'s game...`)
    } else {
      message.success(`Game invite sent to ${friend.name}!`)
    }
  }

  const handleRemoveFriend = (id) => {
    const friend = friends.find((f) => f.id === id)
    Modal.confirm({
      title: 'Remove Friend',
      content: `Are you sure you want to remove ${friend?.name} from your friends?`,
      okText: 'Remove',
      okType: 'danger',
      onOk: () => {
        setFriends((prev) => prev.filter((f) => f.id !== id))
        message.success(`${friend?.name} has been removed`)
      },
    })
  }

  const handleAddFriend = (player) => {
    message.success(`Friend request sent to ${player.name}!`)
  }

  const handleFindPlayers = () => {
    setActiveTab('players')
  }

  const tabItems = [
    {
      key: 'friends',
      label: (
        <span className={`flex items-center gap-2 ${activeTab === 'friends' ? '' : 'text-white'}`}>
          Friend List
          <span className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 py-0.5 px-2.5 rounded-full text-xs font-semibold">
            {friends.length}
          </span>
        </span>
      ),
    },
    {
      key: 'requests',
      label: (
        <span className={`flex items-center gap-2 ${activeTab === 'requests' ? '' : 'text-white'}`}>
          Friend Requests
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
        <span className={`flex items-center gap-2 ${activeTab === 'players' ? '' : 'text-white'}`}>
          <Globe size={14} />
          All Players
        </span>
      ),
    },
  ]

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
            Friends & Community
          </h1>
          
          <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full online-status-pulse" />
            <span className="text-xs font-bold text-green-600 dark:text-green-400">{onlineCount} Online</span>
          </div>
        </div>

        
        <div className="flex-1 max-w-md">
          <Input
            placeholder={activeTab === 'players' ? 'Search all players...' : 'Search friends...'}
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
              Pending Requests ({requests.length})
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
                All Friends ({filteredFriends.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-slate-400">
                <span>Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  variant="borderless"
                  className="font-medium"
                  popupClassName="dark:bg-slate-800"
                  options={[
                    { value: 'status', label: 'Online Status' },
                    { value: 'name', label: 'Name (A-Z)' },
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
              All Players ({filteredPlayers.length})
            </h2>
            {filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlayers.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={index}
                    onAddFriend={handleAddFriend}
                  />
                ))}
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
