import { useState } from 'react'
import { Tabs, Select } from 'antd'
import { motion } from 'framer-motion'
import { Trophy, Brain, Users, Crown, Gamepad2 } from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import { ProfileCard } from '@/components/Profile/ProfileCard'
import { AchievementItem } from '@/components/Profile/AchievementItem'
import { WinRateChart } from '@/components/Profile/WinRateChart'
import { ActivityCard } from '@/components/Profile/ActivityCard'
import { FavoriteGameCard } from '@/components/Profile/FavoriteGameCard'
import { EditProfileTab } from '@/components/Profile/EditProfileTab'
import { AchievementsTab } from '@/components/Profile/AchievementsTab'
import { GameHistoryTab } from '@/components/Profile/GameHistoryTab'
import { FriendsTab } from '@/components/Profile/FriendsTab'

// Mock data for Overview tab with rarity
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rYUZTmwMe11ZhJQSf5l8BZPDiLW22TF5V0RoiJKOPguv2CPq2CZuiFd5FkZIbJABPMNg_3zT6q0FBIWmd62l_IveebetIvauJc1NpZP0NPFPJLSVHOQDBtrvbPLullL4pkM-rv1EyEG2IUD4lCxbST_a9gmJTWvx7g_6YX1ZnJ1YgY2Xw85cseQTHAycvAkumrzXL85T_h9Mfg14HVoo-3JUxcqJXstXiu3XWg8joz9UVRyzw0EVp17rNS5_Uwli3n4RDew5jVE',
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
  { id: 1, name: 'Settlers of Catan', matches: 425, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rYUZTmwMe11ZhJQSf5l8BZPDiLW22TF5V0RoiJKOPguv2CPq2CZuiFd5FkZIbJABPMNg_3zT6q0FBIWmd62l_IveebetIvauJc1NpZP0NPFPJLSVHOQDBtrvbPLullL4pkM-rv1EyEG2IUD4lCxbST_a9gmJTWvx7g_6YX1ZnJ1YgY2Xw85cseQTHAycvAkumrzXL85T_h9Mfg14HVoo-3JUxcqJXstXiu3XWg8joz9UVRyzw0EVp17rNS5_Uwli3n4RDew5jVE' },
  { id: 2, name: 'Monopoly Classic', matches: 89 },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [activityFilter, setActivityFilter] = useState('all')

  const profileData = {
    name: user?.username || 'Marcus Chen',
    email: user?.email || 'marcus@example.com',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=11',
    level: 42,
    currentXP: 2450,
    xpToNextLevel: 3000,
    tier: 'grandmaster',
    title: 'Grandmaster',
    isOnline: true,
    bio: 'Strategy enthusiast. Catan veteran. Always up for a game of Chess or Terraforming Mars. Let\'s roll the dice!',
    location: 'San Francisco, CA',
    joinedDate: 'March 2021',
    totalScore: 2450,
    globalRank: 12,
    wins: 342,
    losses: 158,
    winRate: 68,
  }

  const handleClaimReward = (achievement) => {
    console.log('Claiming reward for:', achievement.name)
    // TODO: Implement reward claim API
  }

  const tabItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'edit', label: 'Edit Profile' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'history', label: 'Game History' },
    { key: 'friends', label: 'Friends' },
  ]

  return (
    <div className="p-4 md:p-8 lg:p-10 min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-white to-[#a855f7] flex items-center gap-3">
          <Crown className="text-yellow-400" size={28} />
          My Profile
        </h2>
      </motion.header>

      <ProfileCard profile={profileData} onEditAvatar={() => setActiveTab('edit')} />

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="profile-tabs mb-8" />

      {/* Overview Tab */}
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
                <button onClick={() => setActiveTab('achievements')} className="text-sm text-[#00f0ff] hover:underline font-medium">
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
                    <AchievementItem
                      achievement={achievement}
                      onClaim={achievement.progress >= 100 ? handleClaimReward : undefined}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <WinRateChart winRate={profileData.winRate} wins={profileData.wins} losses={profileData.losses} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Gamepad2 size={20} className="text-[#00f0ff]" />
                Recent Activity
              </h3>
              <Select
                value={activityFilter}
                onChange={setActivityFilter}
                variant="borderless"
                className="text-sm font-medium"
                options={[
                  { value: 'all', label: 'All Activities' },
                  { value: 'games', label: 'Games Played' },
                  { value: 'tournaments', label: 'Tournaments' },
                ]}
              />
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

      {/* Edit Profile Tab */}
      {activeTab === 'edit' && (
        <EditProfileTab profile={profileData} onSave={(data) => console.log('Saved:', data)} />
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && <AchievementsTab />}

      {/* Game History Tab */}
      {activeTab === 'history' && <GameHistoryTab />}

      {/* Friends Tab */}
      {activeTab === 'friends' && <FriendsTab />}
    </div>
  )
}
