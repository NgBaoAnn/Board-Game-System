import { useState } from 'react'
import { Input, Select, Avatar, Empty } from 'antd'
import { Search, UserX, Eye, MoreVertical } from 'lucide-react'

const { Option } = Select

const friendsData = [
  { id: 1, name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online', activity: 'Playing Chess', mutualGames: 15 },
  { id: 2, name: 'Jessica Wu', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online', activity: 'In Lobby', mutualGames: 23 },
  { id: 3, name: 'Tom Hiddleston', avatar: 'https://i.pravatar.cc/150?img=6', status: 'offline', lastSeen: '2h ago', mutualGames: 8 },
  { id: 4, name: 'Anna Bell', avatar: 'https://i.pravatar.cc/150?img=7', status: 'offline', lastSeen: '1d ago', mutualGames: 12 },
  { id: 5, name: 'Game Master X', avatar: 'https://i.pravatar.cc/150?img=8', status: 'online', activity: 'Playing Monopoly', mutualGames: 45 },
  { id: 6, name: 'StrategyQueen', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online', activity: null, mutualGames: 31 },
  { id: 7, name: 'BoardKing', avatar: 'https://i.pravatar.cc/150?img=12', status: 'offline', lastSeen: '3h ago', mutualGames: 19 },
  { id: 8, name: 'DiceRoller', avatar: 'https://i.pravatar.cc/150?img=13', status: 'online', activity: 'Playing Catan', mutualGames: 27 },
]

function FriendCard({ friend, onViewProfile, onRemove }) {
  const isOnline = friend.status === 'online'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex flex-col items-center relative group hover:shadow-md transition-all">
      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
        <MoreVertical size={18} />
      </button>

      
      <div className="relative mb-3">
        <Avatar
          src={friend.avatar}
          size={80}
          className={`border-4 border-white dark:border-gray-700 shadow-sm ${!isOnline ? 'grayscale opacity-80' : ''}`}
        />
        <span
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      
      <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate w-full text-center">
        {friend.name}
      </h4>
      
      {friend.activity ? (
        <p className="text-xs text-[#1d7af2] font-medium mt-1">{friend.activity}</p>
      ) : isOnline ? (
        <p className="text-xs text-green-500 font-medium mt-1">Online</p>
      ) : (
        <p className="text-xs text-gray-500 mt-1">Last seen {friend.lastSeen}</p>
      )}

      <p className="text-[11px] text-gray-400 mt-2">{friend.mutualGames} games played together</p>

      
      <div className="grid grid-cols-2 gap-2 w-full mt-4">
        <button
          onClick={() => onViewProfile?.(friend)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Eye size={14} />
          Profile
        </button>
        <button
          onClick={() => onRemove?.(friend)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 dark:text-gray-400 text-xs font-semibold rounded-lg transition-colors"
        >
          <UserX size={14} />
          Remove
        </button>
      </div>
    </div>
  )
}

export function FriendsTab() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredFriends = friendsData.filter((friend) => {
    const matchesSearch = friend.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || friend.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const onlineCount = friendsData.filter(f => f.status === 'online').length
  const offlineCount = friendsData.filter(f => f.status === 'offline').length

  return (
    <div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-gray-900 dark:text-white">{friendsData.length}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Friends</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-green-500">{onlineCount}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Online Now</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <span className="block text-2xl font-bold text-gray-400">{offlineCount}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Offline</span>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search friends..."
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
          <Option value="all">All Friends</Option>
          <Option value="online">Online</Option>
          <Option value="offline">Offline</Option>
        </Select>
      </div>

      
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onViewProfile={(f) => console.log('View profile:', f.name)}
              onRemove={(f) => console.log('Remove:', f.name)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-100 dark:border-gray-700">
          <Empty description="No friends found" />
        </div>
      )}
    </div>
  )
}

export default FriendsTab
