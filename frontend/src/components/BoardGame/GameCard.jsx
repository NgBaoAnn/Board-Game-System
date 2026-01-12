import { memo } from 'react'
import { Play, RotateCcw, Grid3x3 } from 'lucide-react'

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

function GameCard({ game, isSelected, hasSavedSession, onSelect, onPlay, onResume }) {
    const IconComponent = GAME_ICONS[game.code] || Grid3x3

    return (
        <div
            onClick={() => onSelect(game)}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected 
                    ? 'ring-2 ring-[#00f0ff] shadow-xl shadow-[#00f0ff]/20 scale-[1.02]' 
                    : 'hover:scale-[1.02] hover:shadow-xl'
            }`}
        >
            {/* Card Background */}
            <div className={`absolute inset-0 ${
                isSelected
                    ? 'bg-gradient-to-br from-[#7C3AED]/20 to-[#F43F5E]/20 dark:from-[#7C3AED]/30 dark:to-[#F43F5E]/30'
                    : 'bg-white dark:bg-slate-800/80'
            }`} />
            
            {/* Gradient Border Effect for Selected */}
            {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#7C3AED] to-[#F43F5E] opacity-20 animate-pulse" />
            )}

            <div className="relative p-6 border border-slate-200 dark:border-slate-700/50 rounded-2xl h-full">
                {/* Game Icon/Image */}
                <div className="flex justify-center mb-5">
                    {GAME_LOGOS[game.code] ? (
                        <div className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ${
                            isSelected ? 'ring-4 ring-[#00f0ff]/50' : 'group-hover:scale-110'
                        }`}>
                            <img
                                src={GAME_LOGOS[game.code]}
                                alt={game.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isSelected 
                                ? 'bg-gradient-to-br from-[#00f0ff] to-[#7C3AED] shadow-lg shadow-[#00f0ff]/30' 
                                : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 group-hover:from-[#7C3AED] group-hover:to-[#F43F5E]'
                        } text-white`}>
                            <IconComponent size={40} className={isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-white'} />
                        </div>
                    )}
                </div>

                {/* Game Info */}
                <div className="text-center">
                    <h3 className={`font-bold text-lg mb-1 transition-colors ${
                        isSelected ? 'text-[#7C3AED] dark:text-[#00f0ff]' : 'text-slate-800 dark:text-white group-hover:text-[#7C3AED]'
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
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        isSelected
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] text-white shadow-lg hover:shadow-xl hover:brightness-110'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#7C3AED] hover:text-white'
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

                {/* Selected Indicator */}
                {isSelected && (
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#00f0ff] animate-pulse" />
                )}
            </div>
        </div>
    )
}

export default memo(GameCard)
