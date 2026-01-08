import { Avatar } from 'antd'
import { MapPin, Calendar, Edit2 } from 'lucide-react'
import StatCard from './StatCard'

// Profile Header Card Component
export function ProfileCard({ profile, onEditAvatar }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 md:p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#1d7af2]/10 to-transparent pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1d7af2 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-[#1d7af2] to-purple-500">
            <Avatar src={profile.avatar} size={120} className="border-4 border-white dark:border-slate-800" />
          </div>
          <button
            onClick={onEditAvatar}
            className="absolute bottom-1 right-1 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600 text-gray-500 hover:text-[#1d7af2] transition-colors"
          >
            <Edit2 size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
            <span className="bg-[#1d7af2]/10 text-[#1d7af2] text-xs font-bold px-3 py-1 rounded-full border border-[#1d7af2]/20 inline-block w-fit mx-auto md:mx-0">
              {profile.title}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">{profile.bio}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 pt-2">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={16} />
              {profile.location}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              Joined {profile.joinedDate}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 md:flex-col lg:flex-row mt-4 md:mt-0">
          <StatCard value={profile.totalScore?.toLocaleString() || '0'} label="Total Score" />
          <StatCard value={`#${profile.globalRank || '-'}`} label="Global Rank" />
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
