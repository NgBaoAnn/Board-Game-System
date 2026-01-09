import { useState, useCallback, useEffect, useRef } from 'react'
import {
    Grid3x3,
    Circle,
    Joystick,
    Puzzle,
    Brain,
    Target,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Play,
    Pause,
    HelpCircle,
    Undo2,
    Loader2,
    Save,
    LogOut,
    RotateCcw,
} from 'lucide-react'

import BoardGrid from '../../components/Board/BoardGrid.jsx'
import GameTimer from '../../components/Game/GameTimer.jsx'
import GameScore from '../../components/Game/GameScore.jsx'
import TimeSelectionModal from '../../components/Game/TimeSelectionModal.jsx'
import TicTacToeGame from '../../components/Game/TicTacToeGame.jsx'
import Caro4Game from '../../components/Game/Caro4Game.jsx'
import Caro5Game from '../../components/Game/Caro5Game.jsx'
import gameApi from '../../api/api-game.js'
import { message } from 'antd'
import { useGameSession } from '../../context/GameSessionProvider'


const GAME_ICONS = {
    'tic_tac_toe': Grid3x3,
    'caro_4': Target,
    'caro_5': Circle,
    'snake': Joystick,
    'match_3': Puzzle,
    'memory': Brain,
}

export default function BoardGamePage() {
    const { startSession, endSession } = useGameSession()

    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeGame, setActiveGame] = useState(0)
    const [previousGame, setPreviousGame] = useState(0) // Track previous game for BACK function

    const [sessionId, setSessionId] = useState(null)
    const [hasSavedSession, setHasSavedSession] = useState(false)
    const [checkingSession, setCheckingSession] = useState(false)

    const [showTimeModal, setShowTimeModal] = useState(false)

    const [gameStarted, setGameStarted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false) // Separate pause state for controls
    const [score, setScore] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [selectedTime, setSelectedTime] = useState(0)

    const [gameState, setGameState] = useState(null)
    const [savedState, setSavedState] = useState(null)

    const gameStateRef = useRef(gameState)
    useEffect(() => {
        gameStateRef.current = gameState
    }, [gameState])

    const saveCallbackRef = useRef(null)
    const exitCallbackRef = useRef(null)
    const sessionIdRef = useRef(null)
    const scoreRef = useRef(0)
    const selectedTimeRef = useRef(0)
    const timeRemainingRef = useRef(0)

    useEffect(() => {
        sessionIdRef.current = sessionId
    }, [sessionId])

    useEffect(() => {
        scoreRef.current = score
    }, [score])

    useEffect(() => {
        selectedTimeRef.current = selectedTime
    }, [selectedTime])

    useEffect(() => {
        timeRemainingRef.current = timeRemaining
    }, [timeRemaining])

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true)
                const response = await gameApi.getAllGames()
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

    const currentGame = games[activeGame] || null

    useEffect(() => {
        if (!currentGame || gameStarted) return

        const checkSession = async () => {
            try {
                setCheckingSession(true)
                const response = await gameApi.checkSessionExists(currentGame.id)
                setHasSavedSession(response.data?.isSavedExists || false)
            } catch (err) {
                console.error('Failed to check session:', err)
                setHasSavedSession(false)
            } finally {
                setCheckingSession(false)
            }
        }
        checkSession()
    }, [currentGame, gameStarted])

    const selectGame = (idx) => {
        if (gameStarted) return
        if (games.length === 0) return
        const newIdx = (idx + games.length) % games.length
        setPreviousGame(activeGame) // Save previous game for BACK function
        setActiveGame(newIdx)
    }

    const handleLeft = () => selectGame(activeGame - 1)
    const handleRight = () => selectGame(activeGame + 1)

    const handleStartClick = () => {
        setShowTimeModal(true)
    }

    const handleResumeClick = async () => {
        if (!currentGame) return

        try {
            message.loading({ content: 'Đang tải game...', key: 'resume' })
            const response = await gameApi.startSession('resume', currentGame.id)

            setSessionId(response.data?.session?.id)

            const restored = response.data?.save_state || {}
            setSavedState(restored)
            setScore(restored.score || 0)
            setTimeRemaining(restored.time_remain || 0)
            setSelectedTime(restored.time_limit || 0)

            setGameStarted(true)
            setIsPlaying(true)
            setIsPaused(false)

            startSession(
                async () => {
                    const currentSessionId = sessionIdRef.current
                    if (!currentSessionId) return

                    try {
                        message.loading({ content: 'Đang lưu...', key: 'save' })
                        const saveState = {
                            score: scoreRef.current,
                            time_limit: selectedTimeRef.current,
                            time_remain: timeRemainingRef.current,
                            ...gameStateRef.current,
                        }
                        await gameApi.saveSession(currentSessionId, saveState)
                        message.success({ content: 'Đã lưu game!', key: 'save' })
                    } catch (err) {
                        console.error('Save failed:', err)
                        message.error({ content: 'Không thể lưu game', key: 'save' })
                    }
                },
                async () => {
                    const currentSessionId = sessionIdRef.current
                    if (currentSessionId) {
                        try {
                            await gameApi.finishSession(currentSessionId, scoreRef.current)
                            message.info('Game kết thúc! Điểm: ' + scoreRef.current)
                        } catch (err) {
                            console.error('Finish failed:', err)
                        }
                    }
                }
            )

            message.success({ content: 'Đã khôi phục game!', key: 'resume' })
        } catch (err) {
            console.error('Resume failed:', err)
            message.error({ content: 'Không thể khôi phục game', key: 'resume' })
        }
    }

    const handleTimeConfirm = async (timeInSeconds) => {
        if (!currentGame) return

        try {
            message.loading({ content: 'Đang bắt đầu...', key: 'start' })
            const response = await gameApi.startSession('new', currentGame.id)

            setSessionId(response.data?.session?.id)
            setSelectedTime(timeInSeconds)
            setTimeRemaining(timeInSeconds)
            setScore(0)
            setSavedState(null)
            setGameState(null)

            setGameStarted(true)
            setIsPlaying(true)
            setIsPaused(false)

            startSession(
                async () => {
                    const currentSessionId = sessionIdRef.current
                    if (!currentSessionId) return

                    try {
                        message.loading({ content: 'Đang lưu...', key: 'save' })
                        const saveState = {
                            score: scoreRef.current,
                            time_limit: selectedTimeRef.current,
                            time_remain: timeRemainingRef.current,
                            ...gameStateRef.current,
                        }
                        await gameApi.saveSession(currentSessionId, saveState)
                        message.success({ content: 'Đã lưu game!', key: 'save' })
                    } catch (err) {
                        console.error('Save failed:', err)
                        message.error({ content: 'Không thể lưu game', key: 'save' })
                    }
                },
                async () => {
                    const currentSessionId = sessionIdRef.current
                    if (currentSessionId) {
                        try {
                            await gameApi.finishSession(currentSessionId, scoreRef.current)
                            message.info('Game kết thúc! Điểm: ' + scoreRef.current)
                        } catch (err) {
                            console.error('Finish failed:', err)
                        }
                    }
                }
            )

            message.success({ content: 'Bắt Đầu chơi!', key: 'start' })
        } catch (err) {
            console.error('Start failed:', err)
            message.error({ content: 'Không thể bắt đầu game', key: 'start' })
        }
    }

    const handlePauseClick = () => {
        setIsPlaying(false)
        setIsPaused(true)
    }

    const handleResumeGameClick = () => {
        setIsPlaying(true)
        setIsPaused(false)
    }

    const handleSave = async () => {
        if (!sessionId) return

        try {
            message.loading({ content: 'Đang lưu...', key: 'save' })

            const saveState = {
                score,
                time_limit: selectedTime,
                time_remain: timeRemaining,
                ...gameStateRef.current,
            }

            await gameApi.saveSession(sessionId, saveState)

            message.success({ content: 'Đã lưu game!', key: 'save' })

            resetToSelection()
        } catch (err) {
            console.error('Save failed:', err)
            message.error({ content: 'Không thể lưu game', key: 'save' })
        }
    }

    const handleExit = async () => {
        if (sessionId) {
            try {
                await gameApi.finishSession(sessionId, score)
                message.info('Game kết thúc! Điểm: ' + score)
            } catch (err) {
                console.error('Finish failed:', err)
            }
        }
        resetToSelection()
    }

    const handleBack = () => {
        if (!gameStarted) {
            setActiveGame(previousGame)
        }
    }

    const resetToSelection = useCallback(() => {
        setGameStarted(false)
        setIsPlaying(false)
        setIsPaused(false)
        setScore(0)
        setTimeRemaining(0)
        setSelectedTime(0)
        setSessionId(null)
        setSavedState(null)
        setGameState(null)
        endSession()
    }, [endSession])

    const handleTimeUp = useCallback(async () => {
        setIsPlaying(false)

        if (sessionId) {
            try {
                await gameApi.finishSession(sessionId, score)
                message.info('Hết giờ! Điểm của bạn: ' + score)
            } catch (err) {
                console.error('Finish failed:', err)
            }
        }

        setTimeout(() => {
            resetToSelection()
        }, 2000)
    }, [sessionId, score])

    const handleTick = useCallback(() => {
        setTimeRemaining(prev => {
            if (prev <= 1) return 0
            return prev - 1
        })
    }, [])

    const handleScoreChange = useCallback((newScore) => {
        setScore(newScore)
    }, [])

    const handleGameEnd = useCallback(async (result) => {
        if (result === 'lose') {
            setIsPlaying(false)

            if (sessionId) {
                try {
                    await gameApi.finishSession(sessionId, score)
                    message.error('Game Over! Điểm của bạn: ' + score)
                } catch (err) {
                    console.error('Finish failed:', err)
                }
            }

            setTimeout(() => {
                resetToSelection()
            }, 2000)
        }
    }, [sessionId, score])

    const handleStateChange = useCallback((state) => {
        setGameState(state)
    }, [])

    const handleUp = () => console.log('UP')
    const handleDown = () => console.log('DOWN')

    const renderGame = () => {
        if (!currentGame || !gameStarted) return null

        if (currentGame.code === 'tic_tac_toe') {
            return (
                <TicTacToeGame
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                />
            )
        }

        if (currentGame.code === 'caro_4') {
            return (
                <Caro4Game
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                    boardRows={currentGame.board_row || 7}
                    boardCols={currentGame.board_col || 7}
                />
            )
        }

        if (currentGame.code === 'caro_5') {
            return (
                <Caro5Game
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                    boardRows={currentGame.board_row || 10}
                    boardCols={currentGame.board_col || 10}
                />
            )
        }

        return (
            <BoardGrid
                rows={currentGame.board_row}
                cols={currentGame.board_col}
                cellSize={Math.max(24, Math.min(48, 480 / Math.max(currentGame.board_row, currentGame.board_col)))}
                onCellClick={(row, col) => console.log('Cell clicked:', row, col)}
            />
        )
    }

    return (
        <div className="flex flex-col h-full">
            
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

                    
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                            <span className="ml-2 text-slate-500">Đang tải games...</span>
                        </div>
                    )}

                    
                    {error && !loading && (
                        <div className="flex items-center justify-center py-8 text-rose-500">
                            <span>{error}</span>
                        </div>
                    )}

                    
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

                    
                    {!loading && !error && games.length === 0 && (
                        <div className="flex items-center justify-center py-8 text-slate-500">
                            <span>Không có game nào.</span>
                        </div>
                    )}
                </div>
            </section>

            
            <section className="flex-grow relative flex flex-col items-center justify-center p-4 lg:p-6 bg-slate-50 rounded-xl overflow-hidden">
                
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

                
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

                
                <div className="relative z-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100/60 ring-1 ring-slate-100">
                    
                    <div className="absolute top-2 left-4 text-[9px] font-bold text-indigo-300 tracking-widest z-20">
                        {currentGame ? currentGame.name.toUpperCase() : 'LOADING...'}
                    </div>

                    
                    <div className="relative z-10 mt-4">
                        {gameStarted ? (
                            renderGame()
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 px-12">
                                <div className="text-6xl mb-4">
                                    {currentGame && GAME_ICONS[currentGame.code] ? (
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                            {(() => {
                                                const Icon = GAME_ICONS[currentGame.code]
                                                return <Icon size={48} />
                                            })()}
                                        </div>
                                    ) : (
                                        '🎮'
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {currentGame?.name || 'Select a game'}
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
                                    {currentGame?.description || 'Choose a game from the menu above to start playing'}
                                </p>

                                
                                {currentGame && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleStartClick}
                                            disabled={checkingSession}
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                        >
                                            <Play size={20} />
                                            START
                                        </button>

                                        {hasSavedSession && (
                                            <button
                                                onClick={handleResumeClick}
                                                disabled={checkingSession}
                                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                            >
                                                <RotateCcw size={20} />
                                                RESUME
                                            </button>
                                        )}
                                    </div>
                                )}

                                {checkingSession && (
                                    <div className="mt-4 text-slate-400 text-sm flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={16} />
                                        Checking saved game...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            
            <section className="shrink-0 bg-white border-t border-slate-100 p-4 mt-4 rounded-xl shadow-sm">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                    
                    {!gameStarted && (
                        <>
                            
                            <div className="order-2 md:order-1 flex-1 flex justify-center md:justify-start">
                                <button
                                    aria-label="Help"
                                    className="arcade-btn px-4 py-3 rounded-xl bg-slate-100 text-slate-500 shadow-[0_3px_0_#cbd5e1] hover:bg-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
                                >
                                    <HelpCircle size={16} /> HELP
                                </button>
                            </div>

                            
                            <div className="order-1 md:order-2 flex items-center gap-4 sm:gap-6">
                                <button
                                    onClick={handleLeft}
                                    disabled={loading || games.length === 0}
                                    aria-label="Left"
                                    className={`arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] transition-colors flex items-center justify-center ${loading || games.length === 0
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-slate-50 hover:text-indigo-500'
                                        }`}
                                >
                                    <ChevronLeft size={28} />
                                </button>

                                <button
                                    onClick={handleStartClick}
                                    disabled={loading || games.length === 0 || !currentGame}
                                    aria-label="Start"
                                    className={`arcade-btn w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white shadow-[0_6px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 ${loading || games.length === 0 || !currentGame
                                        ? 'bg-slate-400 shadow-[0_6px_0_#94a3b8] border-slate-200 cursor-not-allowed'
                                        : 'bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0_6px_0_#3730a3] border-indigo-100'
                                        }`}
                                >
                                    <span className="text-[9px] mb-0.5 font-bold opacity-90 tracking-wide">START</span>
                                    <Play size={28} />
                                </button>

                                <button
                                    onClick={handleRight}
                                    disabled={loading || games.length === 0}
                                    aria-label="Right"
                                    className={`arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] transition-colors flex items-center justify-center ${loading || games.length === 0
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-slate-50 hover:text-indigo-500'
                                        }`}
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>

                            
                            <div className="order-3 md:order-3 flex-1 flex justify-center md:justify-end">
                                <button
                                    onClick={handleBack}
                                    aria-label="Back"
                                    className="arcade-btn px-4 py-3 rounded-xl bg-rose-500 text-white shadow-[0_3px_0_#be123c] hover:bg-rose-600 text-xs font-bold flex items-center gap-2 transition-colors tracking-wide"
                                >
                                    BACK <Undo2 size={16} />
                                </button>
                            </div>
                        </>
                    )}

                    
                    {gameStarted && isPlaying && !isPaused && (
                        <>
                            
                            <div className="order-2 md:order-1 flex-1 flex justify-center md:justify-start">
                                <button
                                    onClick={handleUp}
                                    aria-label="Up"
                                    className="arcade-btn w-14 h-14 rounded-xl bg-slate-100 text-slate-600 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-200 transition-colors flex items-center justify-center"
                                >
                                    <ChevronUp size={28} />
                                </button>
                            </div>

                            
                            <div className="order-1 md:order-2 flex items-center gap-4 sm:gap-6">
                                <button
                                    onClick={handleLeft}
                                    aria-label="Left"
                                    className="arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-indigo-500 transition-colors flex items-center justify-center"
                                >
                                    <ChevronLeft size={28} />
                                </button>

                                <button
                                    onClick={handlePauseClick}
                                    aria-label="Pause"
                                    className="arcade-btn w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white shadow-[0_6px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 bg-gradient-to-b from-amber-500 to-orange-600 shadow-[0_6px_0_#c2410c] border-amber-100"
                                >
                                    <span className="text-[9px] mb-0.5 font-bold opacity-90 tracking-wide">PAUSE</span>
                                    <Pause size={28} />
                                </button>

                                <button
                                    onClick={handleRight}
                                    aria-label="Right"
                                    className="arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-indigo-500 transition-colors flex items-center justify-center"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>

                            
                            <div className="order-3 md:order-3 flex-1 flex justify-center md:justify-end">
                                <button
                                    onClick={handleDown}
                                    aria-label="Down"
                                    className="arcade-btn w-14 h-14 rounded-xl bg-slate-100 text-slate-600 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-200 transition-colors flex items-center justify-center"
                                >
                                    <ChevronDown size={28} />
                                </button>
                            </div>
                        </>
                    )}

                    
                    {gameStarted && isPaused && (
                        <>
                            
                            <div className="order-2 md:order-1 flex-1 flex justify-center md:justify-start">
                                <button
                                    onClick={handleSave}
                                    aria-label="Save"
                                    className="arcade-btn px-5 py-3 rounded-xl bg-emerald-500 text-white shadow-[0_3px_0_#059669] hover:bg-emerald-600 text-xs font-bold flex items-center gap-2 transition-colors"
                                >
                                    <Save size={16} /> SAVE
                                </button>
                            </div>

                            
                            <div className="order-1 md:order-2 flex items-center justify-center">
                                <button
                                    onClick={handleResumeGameClick}
                                    aria-label="Resume"
                                    className="arcade-btn w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white shadow-[0_6px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_6px_0_#15803d] border-emerald-100"
                                >
                                    <span className="text-[9px] mb-0.5 font-bold opacity-90 tracking-wide">RESUME</span>
                                    <Play size={28} />
                                </button>
                            </div>

                            
                            <div className="order-3 md:order-3 flex-1 flex justify-center md:justify-end">
                                <button
                                    onClick={handleExit}
                                    aria-label="Exit"
                                    className="arcade-btn px-5 py-3 rounded-xl bg-rose-500 text-white shadow-[0_3px_0_#be123c] hover:bg-rose-600 text-xs font-bold flex items-center gap-2 transition-colors"
                                >
                                    EXIT <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            
            <TimeSelectionModal
                open={showTimeModal}
                onClose={() => setShowTimeModal(false)}
                onConfirm={handleTimeConfirm}
                gameName={currentGame?.name || 'Game'}
            />
        </div>
    )
}
