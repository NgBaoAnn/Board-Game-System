import { useState, useEffect } from 'react'
import { Tabs, Spin } from 'antd'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import { ProfileCard } from '@/components/Profile/ProfileCard'
import { EditProfileTab } from '@/components/Profile/EditProfileTab'
import { AchievementsTab } from '@/components/Profile/AchievementsTab'
import { GameHistoryTab } from '@/components/Profile/GameHistoryTab'
import { userApi } from '@/api/user'

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('achievements')
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        // Fetch profile and stats in parallel
        const [profileResponse, statsResponse] = await Promise.all([
          userApi.getProfile(user.id),
          userApi.getStats(user.id).catch(() => ({ stats: {} })) // Fallback if stats fail
        ])
        
        const userData = profileResponse.user || profileResponse.data || profileResponse
        const stats = statsResponse.stats || {}
        
        setProfileData({
          id: userData.id,
          name: userData.username || userData.name || user?.username,
          email: userData.email || user?.email,
          avatar: userData.avatar_url || userData.avatar || user?.avatar,
          level: userData.level || 1,
          currentXP: userData.currentXP || 0,
          xpToNextLevel: userData.xpToNextLevel || 1000,
          tier: userData.tier || 'bronze',
          title: userData.title || 'Player',
          isOnline: true,
          phone: userData.phone || '',
          bio: userData.bio || '',
          location: userData.location || '',
          joinedDate: userData.created_at 
            ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
            : '',
          totalScore: stats.totalScore || 0,
          globalRank: stats.globalRank || 0,
          gamesPlayed: stats.gamesPlayed || 0,
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        // Fallback to user from auth if API fails
        setProfileData({
          id: user?.id,
          name: user?.username || 'User',
          email: user?.email || '',
          avatar: user?.avatar || 'https://i.pravatar.cc/150',
          level: 1,
          currentXP: 0,
          xpToNextLevel: 1000,
          tier: 'bronze',
          title: 'Player',
          isOnline: true,
          phone: '',
          bio: '',
          location: '',
          joinedDate: '',
          totalScore: 0,
          globalRank: 0,
          gamesPlayed: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSaveProfile = async (data) => {
    try {
      await userApi.updateUser(user?.id, data)
      // Refresh profile after save
      const response = await userApi.getProfile(user.id)
      const userData = response.user || response.data || response
      setProfileData(prev => ({
        ...prev,
        name: userData.username || userData.name,
        email: userData.email,
        avatar: userData.avatar_url || userData.avatar,
        phone: userData.phone || '',
        bio: userData.bio || '',
        location: userData.location || '',
      }))
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  const tabItems = [
    { key: 'achievements', label: 'Achievements' },
    { key: 'history', label: 'Game History' },
    { key: 'edit', label: 'Edit Profile' },
  ]

  if (loading || !profileData) {
    return (
      <div className="p-4 md:p-8 lg:p-10 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 min-h-screen">
      
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1d7af2] via-gray-900 to-[#6366f1] dark:from-[#00f0ff] dark:via-white dark:to-[#a855f7] flex items-center gap-3">
          <Crown className="text-yellow-400" size={28} />
          My Profile
        </h2>
      </motion.header>

      <ProfileCard profile={profileData} onEditAvatar={() => setActiveTab('edit')} />

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="profile-tabs mb-8" />

      {/* Achievements Tab */}
      {activeTab === 'achievements' && <AchievementsTab />}

      {/* Game History Tab */}
      {activeTab === 'history' && <GameHistoryTab userId={user?.id} />}

      {/* Edit Profile Tab */}
      {activeTab === 'edit' && (
        <EditProfileTab profile={profileData} onSave={handleSaveProfile} />
      )}
    </div>
  )
}
