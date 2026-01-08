import { useState } from 'react'
import { Tabs, Select, Avatar, Badge, message, Modal } from 'antd'
import { MoreVertical, UserCheck, UserX } from 'lucide-react'

// Mock data
const mockRequests = [
  { id: 1, name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=1', note: 'Wants to be friends' },
  { id: 2, name: 'David Miller', avatar: 'https://i.pravatar.cc/150?img=2', note: 'Found via Catan Group' },
  { id: 3, name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?img=3', note: '4 Mutual Friends' },
]

const mockFriends = [
  { id: 1, name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=4', status: 'online', activity: 'Playing Chess', lastSeen: 'Online now' },
  { id: 2, name: 'Jessica Wu', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online', activity: 'In Lobby', lastSeen: 'Online 5m ago' },
  { id: 3, name: 'Tom Hiddleston', avatar: 'https://i.pravatar.cc/150?img=6', status: 'offline', activity: null, lastSeen: 'Last seen 2h ago' },
  { id: 4, name: 'Anna Bell', avatar: 'https://i.pravatar.cc/150?img=7', status: 'offline', activity: null, lastSeen: 'Last seen 1d ago' },
  { id: 5, name: 'Game Master X', avatar: 'https://i.pravatar.cc/150?img=8', status: 'online', activity: 'Playing Monopoly', lastSeen: 'Online now' },
  { id: 6, name: 'StrategyQueen', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online', activity: null, lastSeen: 'Online 15m ago' },
]

// Friend Request Card Component
function FriendRequestCard({ friend, onAccept, onDecline }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col items-center text-center transition-all hover:shadow-md">
      <div className="relative mb-3">
        <Avatar src={friend.avatar} size={80} className="border-4 border-white dark:border-gray-700 shadow-sm" />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{friend.name}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{friend.note}</p>
      <div className="flex space-x-2 w-full mt-auto">
        <button
          onClick={() => onAccept(friend.id)}
          className="flex-1 bg-[#1d7af2] hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <UserCheck size={16} />
          Accept
        </button>
        <button
          onClick={() => onDecline(friend.id)}
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <UserX size={16} />
          Decline
        </button>
      </div>
    </div>
  )
}

// Friend Card Component
function FriendCard({ friend, onViewProfile, onRemove }) {
  const isOnline = friend.status === 'online'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col items-center relative group">
      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
        <MoreVertical size={18} />
      </button>
      <div className="relative mb-3">
        <Avatar
          src={friend.avatar}
          size={80}
          className={`border-4 border-white dark:border-gray-700 shadow-sm ${!isOnline ? 'grayscale opacity-90' : ''}`}
        />
        <Badge
          status={isOnline ? 'success' : 'default'}
          className="absolute bottom-1 right-1"
          dot
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: '2px solid white',
          }}
        />
        <span
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate w-full text-center">
        {friend.name}
      </h3>
      {friend.activity ? (
        <p className="text-xs text-[#1d7af2] font-medium mb-1">{friend.activity}</p>
      ) : (
        <p className="text-xs text-gray-500 font-medium mb-1">{isOnline ? 'Online' : friend.lastSeen}</p>
      )}
      <p className="text-[11px] text-gray-400 mb-4">{friend.activity ? friend.lastSeen : '\u00A0'}</p>
      <div className="grid grid-cols-2 gap-2 w-full mt-auto">
        <button
          onClick={() => onViewProfile(friend)}
          className="flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs font-semibold rounded-lg transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => onRemove(friend.id)}
          className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 dark:text-gray-400 text-xs font-semibold rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const [requests, setRequests] = useState(mockRequests)
  const [friends, setFriends] = useState(mockFriends)
  const [sortBy, setSortBy] = useState('status')
  const [activeTab, setActiveTab] = useState('friends')

  const handleAcceptRequest = (id) => {
    const accepted = requests.find((r) => r.id === id)
    if (accepted) {
      setFriends((prev) => [
        ...prev,
        { ...accepted, status: 'online', activity: null, lastSeen: 'Just added' },
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
    message.info(`Viewing ${friend.name}'s profile`)
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

  const sortedFriends = [...friends].sort((a, b) => {
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

  const tabItems = [
    {
      key: 'friends',
      label: (
        <span className="flex items-center gap-2">
          Friend List
          <span className="bg-blue-100 dark:bg-blue-900/30 text-[#1d7af2] py-0.5 px-2.5 rounded-full text-xs font-semibold">
            {friends.length}
          </span>
        </span>
      ),
    },
    {
      key: 'requests',
      label: (
        <span className="flex items-center gap-2">
          Friend Requests
          {requests.length > 0 && (
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-semibold">
              {requests.length}
            </span>
          )}
        </span>
      ),
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Friends</h1>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="community-tabs"
        />
      </div>

      {/* Friend Requests Section */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Pending Requests ({requests.length})
          </h2>
          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {requests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  friend={request}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No pending friend requests
            </div>
          )}
        </div>
      )}

      {/* All Friends Section */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              All Friends
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Sort by:</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                variant="borderless"
                className="font-medium"
                options={[
                  { value: 'status', label: 'Online Status' },
                  { value: 'name', label: 'Name (A-Z)' },
                ]}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onViewProfile={handleViewProfile}
                onRemove={handleRemoveFriend}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
