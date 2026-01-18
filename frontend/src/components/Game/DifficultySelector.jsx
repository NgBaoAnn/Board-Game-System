import { memo } from 'react'
import { Zap, Trophy } from 'lucide-react'
import { AI_DIFFICULTY, DIFFICULTY_INFO } from '../../utils/gameAI'

/**
 * DifficultySelector - Reusable component for selecting AI difficulty
 * Used in TicTacToe, Caro4, and Caro5 games
 * Two levels: Easy (random) and Hard (optimal algorithm)
 */
function DifficultySelector({ onSelect, gameTitle = 'Game' }) {
    const difficulties = [
        {
            key: AI_DIFFICULTY.EASY,
            icon: Zap,
            ...DIFFICULTY_INFO.easy
        },
        {
            key: AI_DIFFICULTY.HARD,
            icon: Trophy,
            ...DIFFICULTY_INFO.hard
        }
    ]

    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-50 dark:bg-emerald-900/30',
            border: 'border-emerald-200 dark:border-emerald-700',
            hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
            hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
            text: 'text-emerald-700 dark:text-emerald-300',
            icon: 'text-emerald-600 dark:text-emerald-400'
        },
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-900/30',
            border: 'border-rose-200 dark:border-rose-700',
            hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-900/50',
            hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500',
            text: 'text-rose-700 dark:text-rose-300',
            icon: 'text-rose-600 dark:text-rose-400'
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                    Chọn cấp độ AI
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {gameTitle}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {difficulties.map(({ key, icon: Icon, label, emoji, description, color }) => {
                    const colors = colorClasses[color]
                    return (
                        <button
                            key={key}
                            onClick={() => onSelect(key)}
                            className={`
                                flex flex-col items-center gap-3 p-5 rounded-2xl border-2 
                                transition-all duration-200 group min-w-[140px]
                                ${colors.bg} ${colors.border} ${colors.hoverBg} ${colors.hoverBorder}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{emoji}</span>
                                <Icon
                                    size={28}
                                    className={`${colors.icon} group-hover:scale-110 transition-transform`}
                                />
                            </div>
                            <span className={`font-bold ${colors.text}`}>
                                {label}
                            </span>
                            <span className={`text-xs ${colors.text} opacity-80 text-center`}>
                                {description}
                            </span>
                        </button>
                    )
                })}
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                💡 Mẹo: Hãy thử cấp độ Khó để thử thách bản thân!
            </p>
        </div>
    )
}

export default memo(DifficultySelector)
