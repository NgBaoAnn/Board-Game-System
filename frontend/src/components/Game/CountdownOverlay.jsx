import { memo, useEffect, useState, useRef } from 'react'

/**
 * CountdownOverlay - Shows a 3-2-1 countdown before game starts
 * Displays an animated countdown overlay that disappears after completion
 * @param {boolean} isActive - Whether countdown should be active
 * @param {boolean} isPaused - Whether countdown should be paused (e.g., during tutorial)
 * @param {function} onComplete - Callback when countdown finishes
 */
function CountdownOverlay({ isActive, isPaused = false, onComplete }) {
    const [count, setCount] = useState(3)
    const [isVisible, setIsVisible] = useState(false)
    const intervalRef = useRef(null)
    const completionTimeoutRef = useRef(null)

    useEffect(() => {
        if (!isActive) {
            // Clear any running timers
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current)

            const timer = setTimeout(() => {
                setCount(3)
                setIsVisible(false)
            }, 0)
            return () => clearTimeout(timer)
        }

        const timer = setTimeout(() => {
            setIsVisible(true)
            setCount(3)
        }, 0)

        return () => {
            clearTimeout(timer)
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current)
        }
    }, [isActive])

    // Separate effect for countdown that respects isPaused
    useEffect(() => {
        if (!isActive || !isVisible) return

        // If paused, don't start/continue the interval
        if (isPaused) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        // Start countdown interval
        intervalRef.current = setInterval(() => {
            setCount(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                    completionTimeoutRef.current = setTimeout(() => {
                        setIsVisible(false)
                        onComplete?.()
                    }, 500)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isActive, isVisible, isPaused, onComplete])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative">
                {/* Animated circles background */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 animate-ping"
                        style={{ animationDuration: '1s' }}
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="w-36 h-36 rounded-full bg-gradient-to-br from-pink-500/40 to-orange-500/40 animate-ping"
                        style={{ animationDuration: '1s', animationDelay: '0.2s' }}
                    />
                </div>

                {/* Main countdown number */}
                <div className="relative flex items-center justify-center w-40 h-40">
                    {count > 0 ? (
                        <span
                            key={count}
                            className="text-8xl font-black text-white drop-shadow-2xl animate-bounce"
                            style={{
                                textShadow: '0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(168, 85, 247, 0.6)',
                                animation: 'pulse 0.5s ease-out, scale-up 0.3s ease-out'
                            }}
                        >
                            {count}
                        </span>
                    ) : (
                        <span
                            className="text-3xl font-black text-emerald-400 drop-shadow-2xl text-center leading-tight"
                            style={{
                                textShadow: '0 0 30px rgba(52, 211, 153, 0.8), 0 0 60px rgba(16, 185, 129, 0.6)',
                                animation: 'pulse 0.5s ease-out'
                            }}
                        >
                            BẮT ĐẦU!
                        </span>
                    )}
                </div>

                {/* Progress ring */}
                <svg className="absolute inset-0 w-40 h-40 -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="6"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * (3 - count) / 3)}
                        className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="50%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Ready text */}
            <div className="absolute bottom-1/4 text-center">
                <p className="text-xl font-semibold text-white/80">
                    {count > 0 ? 'Chuẩn bị sẵn sàng...' : ''}
                </p>
            </div>

            <style>{`
                @keyframes scale-up {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    )
}

export default memo(CountdownOverlay)
