import { useEffect, useState } from 'react'
import { Trophy, Zap, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * GameScore - Liquid Glass Score Component
 * @param {number} score - Current score
 * @param {string} label - Label to display (default: "Score")
 * @param {boolean} compact - Compact mode for sidebar
 */
export default function GameScore({ score = 0, label = "Score", compact = false }) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [prevScore, setPrevScore] = useState(score)
    const [scoreIncrease, setScoreIncrease] = useState(0)

    useEffect(() => {
        if (score !== prevScore) {
            setIsAnimating(true)
            setScoreIncrease(score - prevScore)
            setPrevScore(score)

            const timer = setTimeout(() => {
                setIsAnimating(false)
            }, 600)

            return () => clearTimeout(timer)
        }
    }, [score, prevScore])

    const formatScore = (num) => {
        return num.toLocaleString()
    }

    if (compact) {
        return (
            <motion.div
                animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="
                    relative overflow-hidden
                    flex items-center gap-2 px-3 py-2 rounded-xl
                    backdrop-blur-xl bg-emerald-500/20 dark:bg-emerald-400/20
                    border border-emerald-300/40 dark:border-emerald-400/30
                    text-emerald-700 dark:text-emerald-300
                    shadow-lg
                    transition-all duration-300
                "
            >
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                
                <div className="relative z-10 flex items-center gap-2">
                    <Trophy size={14} strokeWidth={2.5} />
                    <span className="text-sm font-bold font-mono">
                        {formatScore(score)}
                    </span>
                    
                    <AnimatePresence>
                        {isAnimating && scoreIncrease > 0 && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="text-yellow-400"
                            >
                                <Sparkles size={12} className="fill-current" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
            transition={{ type: 'spring', damping: 15 }}
            className="
                relative overflow-hidden
                flex items-center gap-3 px-4 py-2.5 rounded-2xl
                backdrop-blur-xl bg-emerald-500/20 dark:bg-emerald-400/20
                border border-emerald-300/40 dark:border-emerald-400/30
                text-emerald-700 dark:text-emerald-300
                shadow-lg
                transition-all duration-300
            "
        >
            {/* Glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-3">
                {/* Icon container with glass effect */}
                <div className="
                    w-9 h-9 rounded-xl bg-emerald-500/20
                    backdrop-blur-sm border border-white/30
                    flex items-center justify-center
                    shadow-md
                ">
                    <Trophy size={18} strokeWidth={2.5} />
                </div>

                {/* Score display */}
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                        {label}
                    </span>
                    <span className="text-xl font-black tracking-wide font-mono leading-tight">
                        {formatScore(score)}
                    </span>
                </div>
            </div>

            {/* Score increase animation */}
            <AnimatePresence>
                {isAnimating && scoreIncrease > 0 && (
                    <motion.div
                        initial={{ y: 0, opacity: 1, scale: 0.8 }}
                        animate={{ y: -20, opacity: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute -top-1 right-2 flex items-center gap-1 text-yellow-400 font-bold text-sm"
                    >
                        <Zap size={14} className="fill-current" strokeWidth={2.5} />
                        <span>+{scoreIncrease}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sparkle effect on score increase */}
            <AnimatePresence>
                {isAnimating && (
                    <>
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: [0, 1.5, 0], rotate: 180 }}
                            transition={{ duration: 0.6 }}
                            className="absolute top-1 right-1 text-yellow-300"
                        >
                            <Sparkles size={12} className="fill-current" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: [0, 1.2, 0], rotate: -180 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="absolute bottom-1 left-1 text-yellow-300"
                        >
                            <Sparkles size={10} className="fill-current" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Status indicator dot */}
            <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg" />
        </motion.div>
    )
}
