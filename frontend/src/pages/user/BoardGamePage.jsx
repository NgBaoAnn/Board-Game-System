import { useState, useCallback, useEffect } from 'react'
import {
    Grid3x3,
    Circle,
    Joystick,
    Puzzle,
    Brain,
    Target,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    HelpCircle,
    Undo2,
    Loader2,
} from 'lucide-react'

import BoardGrid from '../../components/Board/BoardGrid.jsx'
import { GameTimer, GameScore, TimeSelectionModal } from '../../components/Game'
import gameApi from '../../api/api-game.js'

// Icon mapping for game codes from database
const GAME_ICONS = {
    'tic_tac_toe': Grid3x3,
    'caro_4': Target,
    'caro_5': Circle,
    'snake': Joystick,
    'match_3': Puzzle,
    'memory': Brain,
}

export default function BoardGamePage() {
    // Games loaded from API
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeGame, setActiveGame] = useState(0)

    // Modal state
    const [showTimeModal, setShowTimeModal] = useState(false)

    // Game state
    const [gameStarted, setGameStarted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [selectedTime, setSelectedTime] = useState(0)

    // Fetch games from API on mount
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true)
                const response = await gameApi.getAllGames()
                // API returns { success, status, message, data: [...] }
                const gamesData = response.data || []
                setGames(gamesData)
                setError(null)
            } catch (err) {
                console.error('Failed to fetch games:', err)
                setError('Không thể tải danh sách game. Vui lòng kiểm tra kết nối.')
            } finally {
                setLoading(false)
            }
        }
        fetchGames()
    }, [])

    // Get current game
    const currentGame = games[activeGame] || null

    const selectGame = (idx) => {
        if (gameStarted) return
        if (games.length === 0) return
        const newIdx = (idx + games.length) % games.length
        setActiveGame(newIdx)
    }

    const handleLeft = () => selectGame(activeGame - 1)
    const handleRight = () => selectGame(activeGame + 1)

    const handleStartPauseClick = () => {
        if (!gameStarted) {
            setShowTimeModal(true)
        } else if (isPlaying) {
            setIsPlaying(false)
        } else {
            setIsPlaying(true)
        }
    }

    const handleTimeConfirm = (timeInSeconds) => {
        setSelectedTime(timeInSeconds)
        setTimeRemaining(timeInSeconds)
        setScore(0)
        setGameStarted(true)
        setIsPlaying(true)
    }

    const handleBack = () => {
        setGameStarted(false)
        setIsPlaying(false)
        setScore(0)
        setTimeRemaining(0)
        setSelectedTime(0)
    }

    const handleTimeUp = useCallback(() => {
        setIsPlaying(false)
    }, [])

    const handleTick = useCallback(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1))
    }, [])

    const handleCellClick = useCallback((row, col) => {
        if (isPlaying) {
            setScore(prev => prev + 10)
        }
    }, [isPlaying])

    return (
        <div className="flex flex-col h-full">
            {/* Game Selector */}
            <section className="shrink-0 bg-white border-b border-slate-100 p-4 rounded-xl mb-4 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Select Cartridge
                        </h2>
                        <div className="hidden md:flex text-[10px] font-bold text-slate-400 gap-4">
                            <span className="flex items-center gap-1">
                                <span className="text-indigo-500">●</span> ACTIVE
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-slate-300">●</span> AVAILABLE
                            </span>
                        </div>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                            <span className="ml-2 text-slate-500">Đang tải games...</span>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="flex items-center justify-center py-8 text-rose-500">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Games grid */}
                    {!loading && !error && games.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {games.map((game, idx) => {
                                const isActive = idx === activeGame
                                const IconComponent = GAME_ICONS[game.code] || Grid3x3
                                const isDisabled = gameStarted && !isActive
                                return (
                                    <button
                                        key={game.id}
                                        onClick={() => selectGame(idx)}
                                        disabled={isDisabled}
                                        className={`group flex items-center gap-3 p-3 rounded-xl text-left transition-all relative overflow-hidden ${isActive
                                            ? 'bg-white border-2 border-indigo-500 shadow-sm'
                                            : isDisabled
                                                ? 'border border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                                : 'border border-slate-100 bg-white hover:bg-slate-50 hover:border-indigo-200 hover:shadow-sm'
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors ${isActive
                                                ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-sm ring-2 ring-rose-100'
                                                : 'bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-500'
                                                }`}
                                        >
                                            <IconComponent size={18} />
                                        </div>
                                        <div className="z-10 flex-1 min-w-0">
                                            <h3
                                                className={`font-bold text-sm leading-tight truncate ${isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
                                                    }`}
                                            >
                                                {game.name}
                                            </h3>
                                            <p
                                                className={`text-[10px] font-semibold ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'
                                                    }`}
                                            >
                                                {isActive ? 'Selected' : `${game.board_row}×${game.board_col}`}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && games.length === 0 && (
                        <div className="flex items-center justify-center py-8 text-slate-500">
                            <span>Không có game nào.</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Board Display Area */}
            <section className="flex-grow relative flex flex-col items-center justify-center p-4 lg:p-6 bg-slate-50 rounded-xl overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

                {/* Game Stats Bar - Timer & Score */}
                <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 mb-4">
                    <GameTimer
                        timeRemaining={timeRemaining}
                        isPlaying={isPlaying}
                        onTimeUp={handleTimeUp}
                        onTick={handleTick}
                    />
                    <GameScore
                        score={score}
                        label="Score"
                    />
                </div>

                {/* Board container */}
                <div className="relative z-10 bg-white p-2 sm:p-3 rounded-2xl shadow-lg border border-slate-100/60 ring-1 ring-slate-100 max-h-full flex items-center justify-center">
                    <div className="bg-indigo-50/50 rounded-xl p-4 sm:p-6 border border-indigo-100/50 relative overflow-hidden">
                        {/* Label */}
                        <div className="absolute top-2 left-4 text-[9px] font-bold text-indigo-300 tracking-widest z-20">
                            {currentGame ? `${currentGame.name.toUpperCase()} - ${currentGame.board_row}×${currentGame.board_col}` : 'LOADING...'}
                        </div>

                        {/* Grid background */}
                        <div className="absolute inset-0 grid-bg pointer-events-none"></div>

                        {/* Board Grid */}
                        <div className="relative z-10 mt-4">
                            {currentGame && (
                                <BoardGrid
                                    rows={currentGame.board_row}
                                    cols={currentGame.board_col}
                                    cellSize={Math.max(24, Math.min(48, 480 / Math.max(currentGame.board_row, currentGame.board_col)))}
                                    onCellClick={handleCellClick}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Controls Section */}
            <section className="shrink-0 bg-white border-t border-slate-100 p-4 mt-4 rounded-xl shadow-sm">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Help button */}
                    <div className="order-2 md:order-1 flex-1 flex justify-center md:justify-start">
                        <button
                            aria-label="Help"
                            className="arcade-btn px-4 py-3 rounded-xl bg-slate-100 text-slate-500 shadow-[0_3px_0_#cbd5e1] hover:bg-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
                        >
                            <HelpCircle size={16} /> HELP
                        </button>
                    </div>

                    {/* Navigation controls */}
                    <div className="order-1 md:order-2 flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={handleLeft}
                            disabled={gameStarted || loading || games.length === 0}
                            aria-label="Left"
                            className={`arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] transition-colors flex items-center justify-center ${gameStarted || loading || games.length === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-slate-50 hover:text-indigo-500'
                                }`}
                        >
                            <ChevronLeft size={28} />
                        </button>

                        <button
                            onClick={handleStartPauseClick}
                            disabled={loading || games.length === 0}
                            aria-label={isPlaying ? "Pause" : "Start"}
                            className={`arcade-btn w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white shadow-[0_6px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 ${loading || games.length === 0
                                ? 'bg-slate-400 shadow-[0_6px_0_#94a3b8] border-slate-200 cursor-not-allowed'
                                : isPlaying
                                    ? 'bg-gradient-to-b from-amber-500 to-orange-600 shadow-[0_6px_0_#c2410c] border-amber-100'
                                    : gameStarted
                                        ? 'bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_6px_0_#15803d] border-emerald-100'
                                        : 'bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0_6px_0_#3730a3] border-indigo-100'
                                }`}
                        >
                            <span className="text-[9px] mb-0.5 font-bold opacity-90 tracking-wide">
                                {isPlaying ? 'PAUSE' : gameStarted ? 'RESUME' : 'START'}
                            </span>
                            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                        </button>

                        <button
                            onClick={handleRight}
                            disabled={gameStarted || loading || games.length === 0}
                            aria-label="Right"
                            className={`arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] transition-colors flex items-center justify-center ${gameStarted || loading || games.length === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-slate-50 hover:text-indigo-500'
                                }`}
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* Back button */}
                    <div className="order-3 md:order-3 flex-1 flex justify-center md:justify-end">
                        <button
                            onClick={handleBack}
                            aria-label="Back"
                            className="arcade-btn px-4 py-3 rounded-xl bg-rose-500 text-white shadow-[0_3px_0_#be123c] hover:bg-rose-600 text-xs font-bold flex items-center gap-2 transition-colors tracking-wide"
                        >
                            BACK <Undo2 size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Time Selection Modal */}
            <TimeSelectionModal
                open={showTimeModal}
                onClose={() => setShowTimeModal(false)}
                onConfirm={handleTimeConfirm}
                gameName={currentGame?.name || 'Game'}
            />
        </div>
    )
}
