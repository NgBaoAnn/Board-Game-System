import { motion } from 'framer-motion'
import { Star, Users, Zap } from 'lucide-react'
import AnimatedHeroBackground from '@/components/common/AnimatedHeroBackground'
import FloatingGamePieces from '@/components/common/FloatingGamePieces'

/**
 * HeroSection component - Gaming-themed hero banner with animated background
 * @param {Object} props
 * @param {string} props.title - Hero title
 * @param {string} props.description - Hero description
 * @param {string} props.image - Background image URL
 * @param {number} props.rating - Game rating
 * @param {string} props.tag - Featured tag text (e.g., "Featured Game")
 * @param {number} props.onlineCount - Number of players online
 * @param {Function} props.onPlayNow - Callback when Play Now is clicked
 * @param {Function} props.onWatchTutorial - Callback when Watch Tutorial is clicked
 */
export default function HeroSection({
  title = 'Strategy Awaits: Master Catan Today',
  description = 'Join over 10,000 players in the ultimate classic strategy game. Build settlements, trade resources, and pave your way to victory.',
  image,
  rating = 4.9,
  tag = 'Featured Game',
  onlineCount = 10234,
  onPlayNow,
  onWatchTutorial,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      <AnimatedHeroBackground className="absolute inset-0">
        <FloatingGamePieces count={12} />
      </AnimatedHeroBackground>

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a2e]/95 via-[#0d1b3e]/85 to-transparent" />

      <div className="relative z-10 grid grid-cols-1 gap-0 md:grid-cols-2 min-h-[400px]">
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              <Zap size={12} className="fill-current" />
              {tag}
            </span>
            
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium border border-white/20">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {rating}
            </span>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium border border-[#00f0ff]/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <Users size={12} />
              {onlineCount.toLocaleString()}+ Online
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-white via-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-base font-normal leading-relaxed text-gray-300 max-w-lg">
              {description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98, y: 2 }}
              onClick={onPlayNow}
              className="h-12 px-8 font-bold rounded-xl text-white bg-gradient-to-r from-[#00f0ff] to-[#a855f7] shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_rgba(0,0,0,0.3),0_0_30px_rgba(0,240,255,0.4)] transition-shadow"
            >
              🎮 Play Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onWatchTutorial}
              className="h-12 px-6 font-bold rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-[#00f0ff]/50 transition-all"
            >
              📺 Watch Tutorial
            </motion.button>
          </motion.div>
        </div>

        <div className="relative hidden md:block" />
      </div>
    </div>
  )
}
