import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/**
 * NewArrivalCard component - Displays a new arrival game card with animated NEW badge
 * @param {Object} game - Game object with id, title, category, image
 */
export default function NewArrivalCard({ game }) {
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="min-w-[280px] group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-lg transition-all hover:shadow-xl border border-transparent hover:border-[#00f0ff]/30"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${game.image}")` }}
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Animated NEW badge */}
        <motion.span 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="tag-new absolute left-2 top-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold uppercase shadow-lg"
        >
          <Sparkles size={12} className="animate-pulse" />
          NEW
        </motion.span>
      </div>
      
      <div className="flex flex-col gap-1 px-1">
        <h4 className="text-base font-bold text-slate-800 dark:text-white">{game.title}</h4>
        <p className="text-xs text-slate-500 dark:text-gray-400">{game.category}</p>
      </div>
    </motion.div>
  )
}
