import { Avatar } from 'antd'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Edit2, UserPlus, Swords, BarChart3 } from 'lucide-react'
import LevelBadge from './LevelBadge'

/**
 * ProfileCard - Gaming-style profile header with banner, XP ring, and stats
 */
export function ProfileCard({ profile, onEditAvatar, isOwnProfile = true }) {
  const tierGlowClass = {
    grandmaster: 'avatar-glow-grandmaster',
    diamond: 'avatar-glow-diamond',
    platinum: 'avatar-glow-platinum',
    gold: 'avatar-glow-gold',
  }

  const tierBorderClass = {
    grandmaster: 'from-purple-500 to-violet-600',
    diamond: 'from-cyan-400 to-teal-500',
    platinum: 'from-slate-400 to-gray-500',
    gold: 'from-amber-400 to-yellow-500',
  }

  const tier = profile.tier?.toLowerCase() || 'gold'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden mb-8"
    >
      {/* Banner Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 profile-banner" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with XP Ring */}
          <div className="relative">
            <div className="relative">
              {/* Avatar container with tier glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`relative rounded-full p-1 bg-gradient-to-br ${tierBorderClass[tier] || tierBorderClass.gold} ${tierGlowClass[tier] || ''}`}
              >
                <Avatar
                  src={profile.avatar}
                  size={100}
                  className="border-4 border-slate-900"
                />
                {/* Online indicator */}
                {profile.isOnline && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-slate-900 online-status-pulse" />
                )}
              </motion.div>

              {/* Edit button */}
              {isOwnProfile && onEditAvatar && (
                <button
                  onClick={onEditAvatar}
                  className="absolute -bottom-1 -right-1 bg-slate-800 hover:bg-slate-700 p-2 rounded-full shadow-lg border border-slate-600 text-slate-400 hover:text-white transition-colors z-10"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>

            {/* Level Badge - positioned below avatar */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <LevelBadge
                level={profile.level}
                currentXP={profile.currentXP || 2450}
                xpToNextLevel={profile.xpToNextLevel || 3000}
                tier={tier}
                size={70}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left mt-8 md:mt-0 md:ml-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-black text-white"
              >
                {profile.name}
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-gradient-to-r ${tierBorderClass[tier] || tierBorderClass.gold} text-white shadow-lg`}
              >
                {profile.title}
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 max-w-lg text-sm mb-4"
            >
              {profile.bio}
            </motion.p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                {profile.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                Joined {profile.joinedDate}
              </div>
            </div>

            {/* Social Actions for other users */}
            {!isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start"
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold text-sm hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-shadow">
                  <UserPlus size={16} />
                  Add Friend
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 font-medium text-sm hover:bg-slate-600/50 transition-colors">
                  <Swords size={16} />
                  Challenge
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 font-medium text-sm hover:bg-slate-600/50 transition-colors">
                  <BarChart3 size={16} />
                  Compare
                </button>
              </motion.div>
            )}
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 md:flex-col lg:flex-row"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <p className="text-2xl font-black text-white">{profile.totalScore?.toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Score</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <p className="text-2xl font-black text-[#00f0ff]">#{profile.globalRank}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Rank</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileCard
