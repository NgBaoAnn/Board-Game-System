import { useEffect, useRef } from 'react'
import { Timer, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * GameTimer - Liquid Glass Timer Component
 * @param {number} timeRemaining - Time remaining in seconds
 * @param {boolean} isPlaying - Is game playing
 * @param {function} onTimeUp - Callback when time is up
 * @param {function} onTick - Callback every second
 * @param {boolean} compact - Compact mode for sidebar
 */
export default function GameTimer({
    timeRemaining = 0,
    isPlaying = false,
    onTimeUp,
    onTick,
    compact = false
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

    // Glass color variants
    const glassVariants = {
        normal: {
            bg: 'bg-indigo-500/20 dark:bg-indigo-400/20',
            border: 'border-indigo-300/40 dark:border-indigo-400/30',
            text: 'text-indigo-700 dark:text-indigo-300',
            icon: 'bg-indigo-500/20'
        },
        warning: {
            bg: 'bg-amber-500/25 dark:bg-amber-400/25',
            border: 'border-amber-300/50 dark:border-amber-400/40',
            text: 'text-amber-700 dark:text-amber-300',
            icon: 'bg-amber-500/25'
        },
        critical: {
            bg: 'bg-rose-500/30 dark:bg-rose-400/30',
            border: 'border-rose-300/50 dark:border-rose-400/40',
            text: 'text-rose-700 dark:text-rose-300',
            icon: 'bg-rose-500/30'
        }
    }

    const variant = isCritical ? glassVariants.critical : isWarning ? glassVariants.warning : glassVariants.normal

    if (compact) {
        return (
            <motion.div
                animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
                className={`
                    relative overflow-hidden
                    flex items-center gap-2 px-3 py-2 rounded-xl
                    backdrop-blur-xl ${variant.bg} ${variant.text}
                    border ${variant.border}
                    shadow-lg
                    transition-all duration-300
                `}
            >
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                
                <div className="relative z-10 flex items-center gap-2">
                    {isWarning ? (
                        <AlertTriangle size={14} className={isCritical ? 'animate-bounce' : ''} strokeWidth={2.5} />
                    ) : (
                        <Timer size={14} strokeWidth={2.5} />
                    )}
                    <span className="text-sm font-bold font-mono">
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            animate={isCritical ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.8, repeat: isCritical ? Infinity : 0 }}
            className={`
                relative overflow-hidden
                flex items-center gap-3 px-4 py-2.5 rounded-2xl
                backdrop-blur-xl ${variant.bg} ${variant.text}
                border ${variant.border}
                shadow-lg
                transition-all duration-300
            `}
        >
            {/* Glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-3">
                {/* Icon container with glass effect */}
                <div className={`
                    w-9 h-9 rounded-xl ${variant.icon}
                    backdrop-blur-sm border border-white/30
                    flex items-center justify-center
                    shadow-md
                `}>
                    {isWarning ? (
                        <AlertTriangle size={18} className={isCritical ? 'animate-bounce' : ''} strokeWidth={2.5} />
                    ) : (
                        <Timer size={18} strokeWidth={2.5} />
                    )}
                </div>

                {/* Time display */}
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                        Time Left
                    </span>
                    <span className="text-xl font-black tracking-wide font-mono leading-tight">
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </div>

            {/* Status indicator dot */}
            <motion.div
                animate={isCritical ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1, repeat: isCritical ? Infinity : 0 }}
                className={`
                    absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full
                    ${isCritical ? 'bg-rose-400' : isWarning ? 'bg-amber-400' : 'bg-indigo-400'}
                    shadow-lg
                `}
            />
        </motion.div>
    )
}
