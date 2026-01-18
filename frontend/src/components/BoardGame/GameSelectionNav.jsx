import { ChevronLeft, ChevronRight, Undo2, HelpCircle, Play } from 'lucide-react'
import { motion } from 'framer-motion'

// Liquid Glass Button Component (defined outside to avoid re-creation on render)
const GlassButton = ({ onClick, disabled, children, variant = 'default', className = '', title }) => {
    const variantStyles = {
        default: 'bg-white/60 hover:bg-white/80 border-white/50 text-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 dark:text-white',
        nav: 'bg-violet-500/15 hover:bg-violet-500/30 border-violet-300/40 text-violet-700 dark:text-violet-300',
        back: 'bg-slate-500/15 hover:bg-slate-500/25 border-slate-300/40 text-slate-700 dark:text-slate-300',
        hint: 'bg-cyan-500/15 hover:bg-cyan-500/30 border-cyan-300/40 text-cyan-700 dark:text-cyan-300',
        play: 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-400/50 text-white shadow-lg shadow-emerald-500/30',
        resume: 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-amber-400/50 text-white shadow-lg shadow-amber-500/30'
    }

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                relative overflow-hidden backdrop-blur-xl
                ${variantStyles[variant]}
                border shadow-lg shadow-black/10
                transition-all duration-300 ease-out
                disabled:opacity-40 disabled:cursor-not-allowed
                ${className}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center gap-2">{children}</div>
        </motion.button>
    )
}

/**
 * GameSelectionNav - Navigation bar for game selection screen
 * Provides mouse-clickable buttons for game navigation
 */
export default function GameSelectionNav({
    currentGame,
    onPrevGame,
    onNextGame,
    onBack,
    onHint,
    onPlay,
    canGoPrev = true,
    canGoNext = true,
    canGoBack = false,
    hasSavedSession = false
}) {
    return (
        <div className="flex flex-col items-center gap-4 mb-6">
            {/* Navigation Row */}
            <div className="flex items-center gap-3 p-2 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/50 dark:border-white/20 shadow-xl">
                {/* Prev Arrow */}
                <GlassButton
                    onClick={onPrevGame}
                    disabled={!canGoPrev}
                    variant="nav"
                    className="w-12 h-12 rounded-xl"
                    title="Game trước (←)"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </GlassButton>

                {/* Back to Previous Selection */}
                <GlassButton
                    onClick={onBack}
                    disabled={!canGoBack}
                    variant="back"
                    className="w-12 h-12 rounded-xl"
                    title="Quay lại game trước đó (Esc)"
                >
                    <Undo2 size={20} strokeWidth={2} />
                </GlassButton>

                {/* Game Info Badge */}
                <div className="flex items-center gap-3 px-5 py-3 backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-violet-300/30 dark:border-violet-500/30 shadow-inner min-w-[180px] justify-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F43F5E] flex items-center justify-center shadow-md">
                        {currentGame?.logo ? (
                            <img src={currentGame.logo} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                            <span className="text-white font-bold text-sm">
                                {currentGame?.name?.charAt(0) || '?'}
                            </span>
                        )}
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate max-w-[120px]">
                            {currentGame?.name || 'Game'}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {currentGame?.board_row}×{currentGame?.board_col} Board
                        </p>
                    </div>
                </div>

                {/* Next Arrow */}
                <GlassButton
                    onClick={onNextGame}
                    disabled={!canGoNext}
                    variant="nav"
                    className="w-12 h-12 rounded-xl"
                    title="Game sau (→)"
                >
                    <ChevronRight size={24} strokeWidth={2.5} />
                </GlassButton>

                {/* Hint Button */}
                <GlassButton
                    onClick={onHint}
                    variant="hint"
                    className="w-12 h-12 rounded-xl"
                    title="Hướng dẫn chơi (?)"
                >
                    <HelpCircle size={22} />
                </GlassButton>

                {/* Play/Resume Button */}
                <GlassButton
                    onClick={onPlay}
                    variant={hasSavedSession ? 'resume' : 'play'}
                    className="px-6 h-12 rounded-xl font-bold text-sm"
                    title={hasSavedSession ? 'Tiếp tục chơi (Enter)' : 'Bắt đầu chơi (Enter)'}
                >
                    <Play size={18} strokeWidth={2.5} />
                    <span>{hasSavedSession ? 'Tiếp tục' : 'Chơi'}</span>
                </GlassButton>
            </div>

            {/* Keyboard hint */}
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">→</kbd> chọn game</span>
                <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Enter</kbd> bắt đầu</span>
                <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Esc</kbd> quay lại</span>
            </div>
        </div>
    )
}
