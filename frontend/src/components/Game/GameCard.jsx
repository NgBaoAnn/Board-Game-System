import { useState } from 'react'
import { Heart, Users, Clock, Star } from 'lucide-react'

/**
 * GameCard component - Displays a game card with image, title, rating, players and duration
 * @param {Object} game - Game object with id, title, image, rating, players, duration
 * @param {Function} onFavorite - Optional callback when favorite button is clicked
 */
export default function GameCard({ game, onFavorite }) {
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    onFavorite?.(game.id, !liked)
  }

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${game.image}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <button
          onClick={handleLike}
          className={`absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white ${
            liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-1 pb-2">
        <div className="flex items-start justify-between">
          <h4 className="text-base font-bold text-slate-800">{game.title}</h4>
          <div className="flex items-center gap-1 rounded bg-yellow-100 px-1.5 py-0.5">
            <Star size={12} className="text-yellow-600 fill-yellow-500" />
            <span className="text-xs font-bold text-yellow-700">{game.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <Users size={14} /> {game.players}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {game.duration}
          </span>
        </div>
      </div>
    </div>
  )
}
