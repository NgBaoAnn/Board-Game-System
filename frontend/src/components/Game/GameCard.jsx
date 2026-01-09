import { useState } from 'react'
import { Heart, Users, Clock, Star, Flame, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Rarity border glow classes
 */
const rarityClasses = {
  common: 'rarity-common',
  rare: 'rarity-rare',
  epic: 'rarity-epic',
  legendary: 'rarity-legendary',
}

/**
 * Rarity badge colors
 */
const rarityBadgeColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-gradient-to-r from-amber-500 to-orange-500',
}

/**
 * GameCard component - Gaming-themed card with rarity glow and animated badges
 * @param {Object} game - Game object with id, title, image, rating, players, duration, rarity, onlinePlayers, isHot, isNew
 * @param {Function} onFavorite - Optional callback when favorite button is clicked
 */
export default function GameCard({ game, onFavorite }) {
  const [liked, setLiked] = useState(false)
  const rarity = game.rarity || 'common'

  const handleLike = () => {
    setLiked(!liked)
    onFavorite?.(game.id, !liked)
  }

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-lg transition-all ${rarityClasses[rarity]}`}
    >
      
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${game.image}")` }}
        />
        
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          
          {game.isHot && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="tag-hot inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase shadow-lg"
            >
              <Flame size={10} className="fill-current" />
              Hot
            </motion.span>
          )}
          
          
          {game.isNew && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="tag-new inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase shadow-lg"
            >
              <Sparkles size={10} />
              New
            </motion.span>
          )}
        </div>

        
        <button
          onClick={handleLike}
          className={`absolute right-2 top-2 rounded-full bg-white/90 dark:bg-slate-700/90 p-1.5 shadow-sm backdrop-blur-sm transition-all hover:scale-110 ${
            liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>

        
        {game.onlinePlayers > 0 && (
          <div className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {game.onlinePlayers} playing
          </div>
        )}

        
        <div className="absolute bottom-2 right-2">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${rarityBadgeColors[rarity]}`}>
            {rarity}
          </span>
        </div>
      </div>

      
      <div className="flex flex-col gap-1.5 px-1 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1">{game.title}</h4>
          <div className="flex items-center gap-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 shrink-0">
            <Star size={12} className="text-yellow-600 fill-yellow-500" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{game.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users size={14} /> {game.players}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {game.duration}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
