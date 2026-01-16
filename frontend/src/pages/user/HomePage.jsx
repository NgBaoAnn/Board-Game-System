import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
// Direct imports for better bundle size
import Gamepad2 from 'lucide-react/dist/esm/icons/gamepad-2'
import Trophy from 'lucide-react/dist/esm/icons/trophy'
import Users from 'lucide-react/dist/esm/icons/users'
import Zap from 'lucide-react/dist/esm/icons/zap'
import Target from 'lucide-react/dist/esm/icons/target'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import Star from 'lucide-react/dist/esm/icons/star'

// Hero background image
const HERO_BG = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop'

// Feature data
const FEATURES = [
  {
    icon: Gamepad2,
    title: 'Classic Games',
    description: 'Enjoy timeless board games like Tic-Tac-Toe, Caro, Memory Match and more.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Unlock achievements, earn badges and showcase your gaming skills.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with friends, challenge players and climb the leaderboards.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Target,
    title: 'Track Progress',
    description: 'Save your game progress and continue anytime, anywhere.',
    gradient: 'from-green-500 to-emerald-500',
  },
]

// Stats data
const STATS = [
  { value: '7+', label: 'Games Available' },
  { value: '1000+', label: 'Active Players' },
  { value: '50K+', label: 'Games Played' },
  { value: '99%', label: 'Uptime' },
]

// Game showcase
const GAME_SHOWCASE = [
  { name: 'Tic-Tac-Toe', image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=300&h=200&fit=crop' },
  { name: 'Caro 5x5', image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4739e?w=300&h=200&fit=crop' },
  { name: 'Memory Match', image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=300&h=200&fit=crop' },
  { name: 'Snake Game', image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&h=200&fit=crop' },
]

export default function HomePage() {
  const navigate = useNavigate()

  const handlePlayNow = useCallback(() => {
    navigate('/boardgame')
  }, [navigate])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Gaming background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F23]/80 via-[#0F0F23]/60 to-[#0F0F23]" />
        </div>

        {/* Animated glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white/90">Welcome to Game Arcade</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-white">Play Classic Games</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#7C3AED] to-[#F43F5E]">
                Anytime, Anywhere
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover a collection of timeless board games. Challenge yourself, track your progress, and compete with friends.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={handlePlayNow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                Start Playing Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <button
                onClick={() => navigate('/ranking')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                View Leaderboard
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#7C3AED]">Game Arcade</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for the ultimate gaming experience
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Showcase Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F43F5E] to-[#F97316]">Games</span>
            </h2>
            <p className="text-xl text-gray-400">Choose from our collection of classic games</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GAME_SHOWCASE.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={handlePlayNow}
                className="group relative aspect-[3/2] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold">{game.name}</span>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500/40 backdrop-blur-sm">
                  <span className="px-4 py-2 bg-white text-black font-bold rounded-lg">Play Now</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#7C3AED] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Stars decoration */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Playing?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of players who are already enjoying our classic board games. No downloads required!
          </p>
          
          <motion.button
            onClick={handlePlayNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] text-white font-bold text-xl rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Play Now — It's Free!
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}