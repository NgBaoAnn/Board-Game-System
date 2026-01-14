import { memo } from 'react'
import { Modal } from 'antd'
import { Trophy, RotateCcw, LogOut, Clock, Gamepad2, Star } from 'lucide-react'
import { motion } from 'framer-motion'

// Minimal Modal Wrapper (consistent with GameModals.jsx)
function ContentModal({ open, onClose, children, width = 420 }) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={width}
            closeIcon={null}
            destroyOnHidden
            modalRender={(modal) => (
                <div onMouseDown={(e) => e.stopPropagation()} className="pointer-events-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        />
    )
}

// Minimal Action Button
function ActionButton({ onClick, children, variant = 'primary', icon: Icon, className = '' }) {
    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25',
        ghost: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }
    
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                w-full py-4 font-bold rounded-2xl
                transition-all duration-200
                flex items-center justify-center gap-2
                ${variants[variant]} ${className}
            `}
        >
            {Icon && <Icon size={20} />}
            {children}
        </motion.button>
    )
}

// Animated Score Counter
function AnimatedScore({ score }) {
    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
                type: 'spring', 
                damping: 12, 
                stiffness: 100,
                delay: 0.2
            }}
            className="relative"
        >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full scale-150" />
            
            {/* Stars decoration */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                >
                    <Star size={24} className="text-amber-400 fill-amber-400" />
                </motion.div>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                >
                    <Star size={24} className="text-amber-400 fill-amber-400" />
                </motion.div>
            </div>
            
            {/* Score number */}
            <div className="relative text-6xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent px-8">
                {score.toLocaleString()}
            </div>
        </motion.div>
    )
}

// Format time display
function formatTime(seconds) {
    if (!seconds || seconds <= 0) return 'No limit'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    if (secs === 0) return `${mins} min`
    return `${mins}m ${secs}s`
}

function ScoreResultModal({
    open,
    onClose,
    score = 0,
    gameName = 'Game',
    timeLimit = 0,
    timeSpent = 0,
    reason = 'time_up', // 'time_up' | 'game_over' | 'win'
    onNewGame,
    onExit
}) {
    // Determine title based on reason
    const getTitle = () => {
        switch (reason) {
            case 'time_up':
                return "Time's Up!"
            case 'game_over':
                return 'Game Over'
            case 'win':
                return 'Victory!'
            default:
                return 'Game Complete'
        }
    }

    // Determine subtitle based on reason
    const getSubtitle = () => {
        switch (reason) {
            case 'time_up':
                return 'Great effort! Try again to beat your score'
            case 'game_over':
                return 'Better luck next time!'
            case 'win':
                return 'Congratulations on your victory!'
            default:
                return 'Thanks for playing'
        }
    }

    // Determine gradient based on reason
    const getGradient = () => {
        switch (reason) {
            case 'win':
                return 'from-emerald-500 via-teal-500 to-cyan-500'
            case 'game_over':
                return 'from-rose-500 via-pink-500 to-purple-500'
            default:
                return 'from-violet-600 via-purple-600 to-indigo-600'
        }
    }

    return (
        <ContentModal open={open} onClose={onClose} width={400}>
            <div className="relative">
                {/* Decorative header background */}
                <div className={`absolute inset-x-0 top-0 h-48 bg-gradient-to-b ${getGradient()} opacity-10 dark:opacity-20`} />
                
                {/* Header */}
                <div className="relative pt-10 pb-4 text-center">
                    {/* Trophy Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                        className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-xl`}
                    >
                        <Trophy size={40} className="text-white" />
                    </motion.div>
                    
                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-black text-slate-900 dark:text-white mb-1"
                    >
                        {getTitle()}
                    </motion.h2>
                    
                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-slate-500 dark:text-slate-400"
                    >
                        {getSubtitle()}
                    </motion.p>
                </div>
                
                {/* Score Section */}
                <div className="px-6 py-6 text-center">
                    <AnimatedScore score={score} />
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400"
                    >
                        Your Score
                    </motion.p>
                </div>
                
                {/* Game Info */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mx-6 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Gamepad2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{gameName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Clock size={16} />
                            <span className="text-sm font-medium">{formatTime(timeLimit)}</span>
                        </div>
                    </div>
                </motion.div>
                
                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ActionButton onClick={onNewGame} variant="primary" icon={RotateCcw}>
                            New Game
                        </ActionButton>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <ActionButton onClick={onExit} variant="ghost" icon={LogOut}>
                            Exit to Games
                        </ActionButton>
                    </motion.div>
                </div>
            </div>
        </ContentModal>
    )
}

export default memo(ScoreResultModal)
