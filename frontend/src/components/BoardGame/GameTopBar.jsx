import { ChevronLeft, ChevronRight, Pause, Play, Save, HelpCircle, Gamepad2 } from 'lucide-react'
import { GameTimer, GameScore } from '../Game'
import { motion } from 'framer-motion'

export default function GameTopBar({
    currentGame,
    timeRemaining,
    score,
    isPlaying,
    isPaused,
    symbolSelected,
    onExit,
    onPause,
    onResume,
    onSave,
    onHelp,
    onPrevGame,
    onNextGame,
    canGoPrev = true,
    canGoNext = true
}) {
    // Liquid Glass Button Component
    const GlassButton = ({ onClick, disabled, children, variant = 'default', className = '', title }) => {
        const variants = {
            default: 'bg-white/20 hover:bg-white/30 border-white/30 text-slate-700 dark:text-white',
            exit: 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-300/40 text-rose-700 dark:text-rose-300',
            nav: 'bg-violet-500/15 hover:bg-violet-500/25 border-violet-300/30 text-violet-700 dark:text-violet-300',
            pause: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-300/40 text-amber-700 dark:text-amber-200',
            resume: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-300/40 text-emerald-700 dark:text-emerald-200',
            save: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-300/40 text-blue-700 dark:text-blue-200',
            help: 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-300/30 text-cyan-700 dark:text-cyan-300'
        }

        return (
            <motion.button
                whileHover={!disabled ? { scale: 1.03, y: -1 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                onClick={onClick}
                disabled={disabled}
                title={title}
                className={`
                    relative overflow-hidden
                    backdrop-blur-xl
                    ${variants[variant]}
                    border
                    shadow-lg shadow-black/5
                    transition-all duration-300 ease-out
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${className}
                `}
            >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50" />
                
                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </motion.button>
        )
    }

    return (
        <div className="relative mb-4">
            {/* Main glass container */}
            <div className="relative backdrop-blur-2xl bg-white/30 dark:bg-slate-900/30 rounded-3xl p-3 sm:p-4 border border-white/40 dark:border-white/20 shadow-2xl shadow-black/10">
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between gap-2">
                    {/* Left Section: Exit + Game Switcher */}
                    <div className="flex items-center gap-2">
                        {/* Exit Button */}
                        <GlassButton
                            onClick={onExit}
                            variant="exit"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center"
                            title="Exit to Gallery"
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </GlassButton>

                        {/* Prev Game */}
                        <GlassButton
                            onClick={onPrevGame}
                            disabled={!canGoPrev}
                            variant="nav"
                            className="w-10 h-10 rounded-2xl flex items-center justify-center"
                            title="Previous Game"
                        >
                            <ChevronLeft size={18} strokeWidth={2.5} />
                        </GlassButton>

                        {/* Game Info Badge - Glass morphic */}
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 backdrop-blur-xl bg-white/25 dark:bg-slate-800/25 rounded-2xl border border-white/30 dark:border-white/20 shadow-lg">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED]/80 to-[#F43F5E]/80 backdrop-blur-sm flex items-center justify-center shadow-md">
                                <Gamepad2 size={16} className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[120px]">
                                    {currentGame?.name || 'Game'}
                                </h2>
                                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                                    {currentGame?.board_row}×{currentGame?.board_col} Board
                                </p>
                            </div>
                        </div>

                        {/* Next Game */}
                        <GlassButton
                            onClick={onNextGame}
                            disabled={!canGoNext}
                            variant="nav"
                            className="w-10 h-10 rounded-2xl flex items-center justify-center"
                            title="Next Game"
                        >
                            <ChevronRight size={18} strokeWidth={2.5} />
                        </GlassButton>
                    </div>

                    {/* Center: Timer & Score - Glass container */}
                    {currentGame?.code !== 'free_draw' && (
                        <div className="hidden md:flex items-center gap-4 px-5 py-2 backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 rounded-2xl border border-white/30 dark:border-white/15 shadow-lg">
                            <GameTimer
                                timeRemaining={timeRemaining}
                                isPlaying={isPlaying && (symbolSelected || !['tic_tac_toe', 'caro_4', 'caro_5'].includes(currentGame?.code))}
                                onTimeUp={() => {}}
                                onTick={() => {}}
                                compact={false}
                            />
                            <div className="h-6 w-px bg-white/30 dark:bg-white/20" />
                            <GameScore
                                score={score}
                                label="Score"
                                compact={false}
                            />
                        </div>
                    )}

                    {/* Right Section: Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Playing State: Pause */}
                        {isPlaying && !isPaused && (
                            <GlassButton
                                onClick={onPause}
                                variant="pause"
                                className="px-4 py-2.5 rounded-2xl flex items-center gap-2 font-semibold text-sm"
                            >
                                <Pause size={16} strokeWidth={2.5} />
                                <span className="hidden sm:inline">Pause</span>
                            </GlassButton>
                        )}
                        
                        {/* Paused State: Resume & Save */}
                        {isPaused && (
                            <>
                                <GlassButton
                                    onClick={onResume}
                                    variant="resume"
                                    className="px-4 py-2.5 rounded-2xl flex items-center gap-2 font-semibold text-sm"
                                >
                                    <Play size={16} strokeWidth={2.5} />
                                    <span className="hidden sm:inline">Resume</span>
                                </GlassButton>
                                <GlassButton
                                    onClick={onSave}
                                    variant="save"
                                    className="px-4 py-2.5 rounded-2xl flex items-center gap-2 font-semibold text-sm"
                                >
                                    <Save size={16} strokeWidth={2.5} />
                                    <span className="hidden sm:inline">Save</span>
                                </GlassButton>
                            </>
                        )}

                        {/* Help Button */}
                        <GlassButton
                            onClick={onHelp}
                            variant="help"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center"
                            title="Help & Controls"
                        >
                            <HelpCircle size={20} />
                        </GlassButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
