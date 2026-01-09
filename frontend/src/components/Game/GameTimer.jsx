import { useEffect, useRef } from 'react'
import { Timer, AlertTriangle } from 'lucide-react'

/**
 * GameTimer - Component hiển thị đồng hồ đếm ngược
 * @param {number} timeRemaining - Thời gian còn lại (giây), sẽ được load từ database
 * @param {boolean} isPlaying - Game đang chạy hay không
 * @param {function} onTimeUp - Callback khi hết giờ
 * @param {function} onTick - Callback mỗi giây (để update parent state)
 */
export default function GameTimer({
    timeRemaining = 0,
    isPlaying = false,
    onTimeUp,
    onTick
}) {
    const intervalRef = useRef(null)

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        if (isPlaying && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                onTick?.()
            }, 1000)
        } else {
            clearInterval(intervalRef.current)
        }

        if (timeRemaining === 0 && isPlaying) {
            onTimeUp?.()
        }

        return () => clearInterval(intervalRef.current)
    }, [isPlaying, timeRemaining, onTick, onTimeUp])

    const isWarning = timeRemaining > 0 && timeRemaining <= 30
    const isCritical = timeRemaining > 0 && timeRemaining <= 10

    return (
        <div className={`
            relative flex items-center gap-3 px-5 py-3 rounded-2xl
            transition-all duration-300 shadow-lg
            ${isCritical
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse'
                : isWarning
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
            }
        `}>
            
            <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${isCritical
                    ? 'bg-red-400/30'
                    : isWarning
                        ? 'bg-amber-300/30'
                        : 'bg-white/20'
                }
            `}>
                {isWarning ? (
                    <AlertTriangle size={20} className="animate-bounce" />
                ) : (
                    <Timer size={20} />
                )}
            </div>

            
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    Time Left
                </span>
                <span className="text-2xl font-black tracking-wide font-mono">
                    {formatTime(timeRemaining)}
                </span>
            </div>

            
            <div className={`
                absolute -right-1 -top-1 w-3 h-3 rounded-full
                ${isCritical
                    ? 'bg-red-300 animate-ping'
                    : isWarning
                        ? 'bg-amber-200'
                        : 'bg-indigo-300'
                }
            `} />
        </div>
    )
}
