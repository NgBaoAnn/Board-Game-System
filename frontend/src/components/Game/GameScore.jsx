import { useEffect, useState } from 'react'
import { Trophy, Zap } from 'lucide-react'

/**
 * GameScore - Component hiển thị điểm số
 * @param {number} score - Điểm số hiện tại
 * @param {string} label - Label hiển thị (mặc định: "Score")
 * @param {boolean} compact - Compact mode cho sidebar
 */
export default function GameScore({ score = 0, label = "Score", compact = false }) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [prevScore, setPrevScore] = useState(score)

    // Animation khi score thay đổi
    useEffect(() => {
        if (score !== prevScore) {
            setIsAnimating(true)
            setPrevScore(score)

            const timer = setTimeout(() => {
                setIsAnimating(false)
            }, 300)

            return () => clearTimeout(timer)
        }
    }, [score, prevScore])

    // Format score với comma
    const formatScore = (num) => {
        return num.toLocaleString()
    }

    if (compact) {
        return (
            <div className={`
                flex items-center gap-2 px-3 py-2 rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                transition-transform duration-200
                ${isAnimating ? 'scale-105' : 'scale-100'}
            `}>
                <Trophy size={14} />
                <span className="text-base font-bold font-mono">
                    {formatScore(score)}
                </span>
                {isAnimating && (
                    <Zap size={12} className="text-yellow-300 fill-current animate-ping" />
                )}
            </div>
        )
    }

    return (
        <div className={`
            relative flex items-center gap-3 px-5 py-3 rounded-2xl
            bg-gradient-to-r from-emerald-500 to-teal-600 text-white
            shadow-lg transition-transform duration-200
            ${isAnimating ? 'scale-110' : 'scale-100'}
        `}>
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Trophy size={20} />
            </div>

            {/* Score display */}
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {label}
                </span>
                <span className="text-2xl font-black tracking-wide font-mono">
                    {formatScore(score)}
                </span>
            </div>

            {/* Points popup animation */}
            {isAnimating && (
                <div className="absolute -top-2 right-2 flex items-center gap-1 text-yellow-300 animate-bounce">
                    <Zap size={14} className="fill-current" />
                    <span className="text-xs font-bold">+10</span>
                </div>
            )}

            {/* Decorative ring */}
            <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-300" />
        </div>
    )
}

