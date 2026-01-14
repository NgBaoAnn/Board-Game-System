import { memo } from 'react'
import { Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function GamePlayArea({ currentGame, isPaused, isPlaying, children }) {
    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative">
                {/* Game Board Container with Liquid Glass */}
                <div className={`
                    relative overflow-hidden
                    backdrop-blur-2xl bg-white/40 dark:bg-slate-900/40
                    p-6 sm:p-8 rounded-[2rem]
                    border-2 shadow-2xl
                    transition-all duration-300
                    ${isPlaying ? 'border-[#00f0ff]/40' : 'border-amber-400/60'}
                `}>
                    {/* Glass reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
                    
                    {/* Pause Overlay with Glass Effect */}
                    <AnimatePresence>
                        {isPaused && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 backdrop-blur-md bg-black/40 rounded-[2rem] flex items-center justify-center z-20"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.8, y: 20 }}
                                    className="text-center backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Pause size={56} className="mx-auto mb-4 text-white drop-shadow-lg" strokeWidth={2} />
                                    </motion.div>
                                    <h3 className="text-3xl font-black mb-2 text-white drop-shadow-lg">PAUSED</h3>
                                    <p className="text-white/80 text-sm font-medium">Click Resume to continue</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Render Game */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                {/* Animated Glow Effect */}
                <motion.div
                    animate={{
                        opacity: [0.15, 0.25, 0.15],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`
                        absolute -inset-6 rounded-[2.5rem] pointer-events-none blur-3xl
                        ${isPlaying 
                            ? 'bg-gradient-to-r from-[#00f0ff] via-[#7C3AED] to-[#F43F5E]' 
                            : 'bg-gradient-to-r from-amber-400 to-orange-500'
                        }
                    `}
                />
            </div>
        </div>
    )
}

export default memo(GamePlayArea)
