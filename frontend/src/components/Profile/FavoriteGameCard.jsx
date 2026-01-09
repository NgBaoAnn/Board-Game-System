import { Play, Dice5 } from 'lucide-react'

// Favorite Game Card
export function FavoriteGameCard({ game, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 flex items-center gap-3 hover:border-[#1d7af2]/50 transition-colors cursor-pointer"
    >
      <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
        {game.image ? (
          <img src={game.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <Dice5 className="text-gray-400" size={24} />
        )}
      </div>
      <div className="flex-1">
        <h5 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-[#1d7af2] transition-colors">
          {game.name}
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400">{game.matches} Matches Played</p>
      </div>
      <Play className="text-gray-300 group-hover:text-[#1d7af2]" size={20} />
    </div>
  )
}

export default FavoriteGameCard
