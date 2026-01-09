import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Button, message } from 'antd'
import { motion } from 'framer-motion'
import { Trophy, Brain, Users, User, UserPlus, Swords, ArrowLeft, Gamepad2 } from 'lucide-react'
import { ProfileCard } from '@/components/Profile/ProfileCard'
import { AchievementItem } from '@/components/Profile/AchievementItem'
import { WinRateChart } from '@/components/Profile/WinRateChart'
import { ActivityCard } from '@/components/Profile/ActivityCard'
import { FavoriteGameCard } from '@/components/Profile/FavoriteGameCard'
import { AchievementsTab } from '@/components/Profile/AchievementsTab'
import { GameHistoryTab } from '@/components/Profile/GameHistoryTab'

const mockPlayers = {
  1: {
    id: 1,
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    level: 38,
    currentXP: 1850,
    xpToNextLevel: 2500,
    tier: 'diamond',
    title: 'Diamond',
    isOnline: true,
    isFriend: false,
    bio: 'Catan enthusiast and Chess lover. Always looking for a good challenge!',
    location: 'New York, NY',
    joinedDate: 'June 2022',
    totalScore: 1850,
    globalRank: 45,
    wins: 215,
    losses: 98,
    winRate: 69,
  },
  2: {
    id: 2,
    name: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/150?img=4',
    level: 42,
    currentXP: 2450,
    xpToNextLevel: 3000,
    tier: 'grandmaster',
    title: 'Grandmaster',
    isOnline: true,
    isFriend: true,
    bio: 'Strategy enthusiast. Catan veteran.',
    location: 'San Francisco, CA',
    joinedDate: 'March 2021',
    totalScore: 2450,
    globalRank: 12,
    wins: 342,
    losses: 158,
    winRate: 68,
  },
}

const achievements = [
  { id: 1, name: 'Strategist Master', progress: 90, current: 45, total: 50, rarity: 'legendary', icon: Trophy },
  { id: 2, name: 'Puzzle Solver', progress: 60, current: 12, total: 20, rarity: 'rare', icon: Brain },
  { id: 3, name: 'Community Pillar', progress: 100, current: null, total: null, rarity: 'epic', icon: Users },
]

const recentActivities = [
  {
    id: 1,
    title: 'Victory in Catan Championship',
    subtitle: 'Ranked Match • 4 Players',
    time: '2h ago',
    badge: '+25 PTS',
    badgeType: 'success',
    detail: 'vs. AlexM, SarahJ, & BoardMaster99',
  },
  {
    id: 2,
    title: 'Checkmate! New Personal Best',
    subtitle: 'Chess Arena • Speed Chess',
    time: 'Yesterday',
    badge: 'Achievement Unlocked',
    badgeType: 'info',
    detail: 'Won in under 5 minutes',
    icon: '♟️',
  },
]

const favoriteGames = [
  { id: 1, name: 'Settlers of Catan', matches: 425 },
  { id: 2, name: 'Chess', matches: 189 },
]

/**
 * FriendProfilePage - Public profile view for other players
 * Shows limited information compared to own ProfilePage
 * Supports dark/light mode
 */
export default function FriendProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const playerData = mockPlayers[id] || mockPlayers[1]
      setPlayer(playerData)
      setLoading(false)
    }, 300)
  }, [id])

  const handleAddFriend = () => {
    message.success(`Friend request sent to ${player.name}!`)
  }

  const handleChallenge = () => {
    message.info(`Sending game challenge to ${player.name}...`)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (loading || !player) {
    return (
      <div className="p-4 md:p-8 lg:p-10 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-slate-400">Loading profile...</div>
      </div>
    )
  }

  const tabItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'history', label: 'Game History' },
  ]

  return (
    <div className="p-4 md:p-8 lg:p-10 min-h-screen">
      
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1d7af2] via-gray-900 to-[#6366f1] dark:from-[#00f0ff] dark:via-white dark:to-[#a855f7] flex items-center gap-3">
            <User className="text-[#1d7af2] dark:text-[#00f0ff]" size={28} />
            Player Profile
          </h2>
        </div>

        
        <div className="flex items-center gap-3">
          {!player.isFriend && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddFriend}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1d7af2] to-[#6366f1] dark:from-[#00f0ff] dark:to-[#a855f7] text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-[#1d7af2]/20 dark:hover:shadow-[#00f0ff]/20 transition-shadow"
            >
              <UserPlus size={16} />
              Add Friend
            </motion.button>
          )}
          {player.isOnline && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChallenge}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-sm font-bold rounded-lg transition-colors"
            >
              <Swords size={16} />
              Challenge
            </motion.button>
          )}
        </div>
      </motion.header>

      
      <ProfileCard profile={player} isReadOnly />

      
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="profile-tabs mb-8" />

      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-500" />
                  Recent Achievements
                </h3>
                <button onClick={() => setActiveTab('achievements')} className="text-sm text-[#1d7af2] dark:text-[#00f0ff] hover:underline font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <AchievementItem achievement={achievement} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <WinRateChart winRate={player.winRate} wins={player.wins} losses={player.losses} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Gamepad2 size={20} className="text-[#1d7af2] dark:text-[#00f0ff]" />
                Recent Activity
              </h3>
            </div>
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
            <div className="mt-8">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Favorite Games</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteGames.map((game) => (
                  <FavoriteGameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activeTab === 'achievements' && <AchievementsTab />}

      
      {activeTab === 'history' && <GameHistoryTab />}
    </div>
  )
}
