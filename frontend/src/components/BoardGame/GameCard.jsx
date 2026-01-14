import { memo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, RotateCcw, Grid3x3, HelpCircle, Star } from 'lucide-react'
import reviewApi from '@/api/api-review'

const GAME_ICONS = {
    'tic_tac_toe': Grid3x3,
    'caro_4': Grid3x3,
    'caro_5': Grid3x3,
    'snake': Grid3x3,
    'match_3': Grid3x3,
    'memory': Grid3x3,
    'free_draw': Grid3x3,
}

const GAME_LOGOS = {
    'tic_tac_toe': '/tic-tac-toe.png',
    'caro_4': '/caro-4.png',
    'caro_5': '/caro-5.png',
    'snake': '/snake-game.png',
    'match_3': '/match-3.png',
    'memory': '/memory.png',
    'free_draw': '/draw free.png',
}

function GameCard({ game, isSelected, hasSavedSession, onSelect, onPlay, onResume, onHelpClick }) {
    const navigate = useNavigate()
    const IconComponent = GAME_ICONS[game.code] || Grid3x3
    
    // Rating state
    const [rating, setRating] = useState({ average: 0, total: 0 })

    // Fetch rating on mount
    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await reviewApi.getAverageRating(game.code)
                setRating(response.data)
            } catch (error) {
                console.error('Failed to fetch rating:', error)
            }
        }
        fetchRating()
    }, [game.code])

    // Handle rating badge click
    const handleRatingClick = (e) => {
        e.stopPropagation()
        navigate(`/game/${game.id}/reviews?code=${game.code}&name=${encodeURIComponent(game.name)}`)
    }

    return (
        <div
            onClick={() => onSelect(game)}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected
                    ? 'ring-2 ring-[#00f0ff] shadow-xl shadow-[#00f0ff]/20 scale-[1.02]'
                    : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-[#7C3AED]/10 dark:hover:shadow-[#00f0ff]/10'
                }`}
        >
            {/* Card Background */}
            <div className={`absolute inset-0 transition-all duration-300 ${isSelected
                    ? 'bg-gradient-to-br from-[#7C3AED]/20 to-[#F43F5E]/20 dark:from-[#7C3AED]/30 dark:to-[#F43F5E]/30'
                    : 'bg-white dark:bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-slate-50 group-hover:to-white dark:group-hover:from-slate-800/90 dark:group-hover:to-slate-700/50'
                }`} />

            {/* Gradient Border Effect for Selected */}
            {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#7C3AED] to-[#F43F5E] opacity-20 animate-pulse" />
            )}

            <div className="relative p-6 border border-slate-200 dark:border-slate-700/50 rounded-2xl h-full group-hover:border-[#7C3AED]/30 dark:group-hover:border-[#00f0ff]/30 transition-colors">
                {/* Help Button - Top Left */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onHelpClick?.(game)
                    }}
                    className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group/help hover:scale-110"
                    title="Hướng dẫn chơi"
                >
                    <HelpCircle
                        size={16}
                        className="text-slate-500 dark:text-slate-400 group-hover/help:text-indigo-600 dark:group-hover/help:text-indigo-400 transition-colors"
                    />
                </button>

                {/* Rating Badge - Top Right */}
                <button
                    onClick={handleRatingClick}
                    className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 shadow-md hover:shadow-lg hover:shadow-yellow-400/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 group/rating"
                    title="Xem đánh giá"
                >
                    <Star
                        size={14}
                        className="text-white fill-white drop-shadow-sm"
                    />
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                        {rating.average > 0 ? rating.average.toFixed(1) : '—'}
                    </span>
                </button>

                {/* Game Icon/Image */}
                <div className="flex justify-center mb-5">
                    {GAME_LOGOS[game.code] ? (
                        <div className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${isSelected 
                            ? 'ring-4 ring-[#00f0ff]/50' 
                            : 'group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#7C3AED]/20 dark:group-hover:shadow-[#00f0ff]/20'
                            }`}>
                            <img
                                src={GAME_LOGOS[game.code]}
                                alt={game.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected
                                ? 'bg-gradient-to-br from-[#00f0ff] to-[#7C3AED] shadow-lg shadow-[#00f0ff]/30'
                                : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 group-hover:from-[#7C3AED] group-hover:to-[#F43F5E] group-hover:shadow-xl'
                            } text-white`}>
                            <IconComponent size={40} className={isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors'} />
                        </div>
                    )}
                </div>

                {/* Game Info */}
                <div className="text-center">
                    <h3 className={`font-bold text-lg mb-1 transition-colors ${isSelected ? 'text-[#7C3AED] dark:text-[#00f0ff]' : 'text-slate-800 dark:text-white group-hover:text-[#7C3AED] dark:group-hover:text-[#00f0ff]'
                        }`}>
                        {game.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                        {game.description || `${game.board_row}×${game.board_col} grid`}
                    </p>

                    {/* Board Size Badge */}
                    <div className="flex justify-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                            {game.board_row}×{game.board_col}
                        </span>
                    </div>
                </div>

                {/* Play Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onPlay(game)
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${isSelected
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] text-white shadow-lg hover:shadow-xl hover:brightness-110'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#F43F5E] hover:text-white hover:shadow-lg'
                        }`}
                >
                    <Play size={18} />
                    {isSelected ? 'START GAME' : 'Play'}
                </button>

                {/* Resume Button (if saved) */}
                {hasSavedSession && isSelected && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onResume(game)
                        }}
                        className="w-full mt-2 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                        <RotateCcw size={16} />
                        Resume Saved
                    </button>
                )}
            </div>
        </div>
    )
}

export default memo(GameCard)
