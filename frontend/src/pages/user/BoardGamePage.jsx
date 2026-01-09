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
    CornerDownLeft,
} from 'lucide-react'

import BoardGrid from '../../components/Board/BoardGrid.jsx'
import { GameTimer, GameScore, TimeSelectionModal, TicTacToeGame, Caro4Game, Caro5Game, SnakeGame, Match3Game } from '../../components/Game'
import gameApi from '../../api/api-game.js'
import { message } from 'antd'
import { useGameSession } from '../../context/GameSessionProvider'


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
    // Game session protection
    const { startSession, endSession } = useGameSession()

    // Games loaded from API
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeGame, setActiveGame] = useState(0)
    const [previousGame, setPreviousGame] = useState(0) // Track previous game for BACK function

    // Session state
    const [sessionId, setSessionId] = useState(null)
    const [hasSavedSession, setHasSavedSession] = useState(false)
    const [checkingSession, setCheckingSession] = useState(false)

    // Modal state
    const [showTimeModal, setShowTimeModal] = useState(false)

    // Game state
    const [gameStarted, setGameStarted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false) // Separate pause state for controls
    const [score, setScore] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [selectedTime, setSelectedTime] = useState(0)

    // Game-specific state (for saving)
    const [gameState, setGameState] = useState(null)
    const [savedState, setSavedState] = useState(null)

    // Cursor position for keyboard navigation
    const [cursorRow, setCursorRow] = useState(0)
    const [cursorCol, setCursorCol] = useState(0)

    // Ref to trigger cell click from keyboard
    const cellClickRef = useRef(null)

    // Ref to track current game state for saving
    const gameStateRef = useRef(gameState)
    useEffect(() => {
        gameStateRef.current = gameState
    }, [gameState])

    // Refs for save/exit callbacks (to avoid stale closure)
    const saveCallbackRef = useRef(null)
    const exitCallbackRef = useRef(null)
    const sessionIdRef = useRef(null)
    const scoreRef = useRef(0)
    const selectedTimeRef = useRef(0)
    const timeRemainingRef = useRef(0)

    // Keep refs in sync with state
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

    // Fetch games from API on mount
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

    // Get current game
    const currentGame = games[activeGame] || null

    // Check for saved session when game is selected
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

    // Handle START button click
    const handleStartClick = () => {
        setShowTimeModal(true)
    }

    // Handle RESUME button click (for saved session)
    const handleResumeClick = async () => {
        if (!currentGame) return

        try {
            message.loading({ content: 'Đang tải game...', key: 'resume' })
            const response = await gameApi.startSession('resume', currentGame.id)

            setSessionId(response.data?.session?.id)

            // Restore saved state
            const restored = response.data?.save_state || {}
            setSavedState(restored)
            setScore(restored.score || 0)
            setTimeRemaining(restored.time_remain || 0)
            setSelectedTime(restored.time_limit || 0)

            setGameStarted(true)
            setIsPlaying(true)
            setIsPaused(false)

            // Register session protection (for navigation blocking)
            // Use callback that reads from refs to get latest values
            startSession(
                async () => {
                    // Save callback using refs for latest values
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
                    // Exit callback using refs for latest values
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

    // Handle time selection and start new game
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

            // Register session protection (for navigation blocking)
            // Use callback that reads from refs to get latest values
            startSession(
                async () => {
                    // Save callback using refs for latest values
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
                    // Exit callback using refs for latest values
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

    // Handle PAUSE button click (when playing)
    const handlePauseClick = () => {
        setIsPlaying(false)
        setIsPaused(true)
    }

    // Handle RESUME button click (when paused during game)
    const handleResumeGameClick = () => {
        setIsPlaying(true)
        setIsPaused(false)
    }

    // Handle SAVE button click
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

            // Reset to game selection
            resetToSelection()
        } catch (err) {
            console.error('Save failed:', err)
            message.error({ content: 'Không thể lưu game', key: 'save' })
        }
    }

    // Handle EXIT button - finish game immediately
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

    // Handle BACK button - return to previous game selection (before game starts)
    const handleBack = () => {
        if (!gameStarted) {
            setActiveGame(previousGame)
        }
    }

    // Reset to game selection state
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
        // End session protection
        endSession()
    }, [endSession])

    // Handle time up
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

        // Wait a bit then reset
        setTimeout(() => {
            resetToSelection()
        }, 2000)
    }, [sessionId, score])

    // Handle timer tick
    const handleTick = useCallback(() => {
        setTimeRemaining(prev => {
            if (prev <= 1) return 0
            return prev - 1
        })
    }, [])

    // Handle score change from game
    const handleScoreChange = useCallback((newScore) => {
        setScore(newScore)
    }, [])

    // Handle game end (lose)
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

    // Handle game state change (for saving)
    const handleStateChange = useCallback((state) => {
        setGameState(state)
    }, [])

    // Cursor navigation handlers
    const handleUp = useCallback(() => {
        if (!currentGame) return
        setCursorRow(prev => Math.max(0, prev - 1))
    }, [currentGame])

    const handleDown = useCallback(() => {
        if (!currentGame) return
        const maxRow = (currentGame.board_row || 3) - 1
        setCursorRow(prev => Math.min(maxRow, prev + 1))
    }, [currentGame])

    const handleLeftNav = useCallback(() => {
        if (!currentGame) return
        setCursorCol(prev => Math.max(0, prev - 1))
    }, [currentGame])

    const handleRightNav = useCallback(() => {
        if (!currentGame) return
        const maxCol = (currentGame.board_col || 3) - 1
        setCursorCol(prev => Math.min(maxCol, prev + 1))
    }, [currentGame])

    const handleEnter = useCallback(() => {
        if (cellClickRef.current) {
            cellClickRef.current(cursorRow, cursorCol)
        }
    }, [cursorRow, cursorCol])

    // Keyboard event listener
    useEffect(() => {
        if (!gameStarted || !isPlaying || isPaused) return

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault()
                    handleUp()
                    break
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault()
                    handleDown()
                    break
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault()
                    handleLeftNav()
                    break
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault()
                    handleRightNav()
                    break
                case 'Enter':
                case ' ':
                    e.preventDefault()
                    handleEnter()
                    break
                case 'Escape':
                case 'p':
                case 'P':
                    e.preventDefault()
                    handlePauseClick()
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [gameStarted, isPlaying, isPaused, handleUp, handleDown, handleLeftNav, handleRightNav, handleEnter, handlePauseClick])

    // Reset cursor when game changes or starts
    useEffect(() => {
        setCursorRow(0)
        setCursorCol(0)
    }, [currentGame, gameStarted])

    // Render game component based on current game
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
                    cursorRow={cursorRow}
                    cursorCol={cursorCol}
                    cellClickRef={cellClickRef}
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
                    cursorRow={cursorRow}
                    cursorCol={cursorCol}
                    cellClickRef={cellClickRef}
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
                    cursorRow={cursorRow}
                    cursorCol={cursorCol}
                    cellClickRef={cellClickRef}
                />
            )
        }

        if (currentGame.code === 'snake') {
            return (
                <SnakeGame
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                    boardRows={currentGame.board_row || 20}
                    boardCols={currentGame.board_col || 20}
                />
            )
        }

        if (currentGame.code === 'match_3') {
            return (
                <Match3Game
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                    boardRows={currentGame.board_row || 8}
                    boardCols={currentGame.board_col || 8}
                    cursorRow={cursorRow}
                    cursorCol={cursorCol}
                    cellClickRef={cellClickRef}
                />
            )
        }

        // Default: show BoardGrid for other games
        return (
            <BoardGrid
                rows={currentGame.board_row}
                cols={currentGame.board_col}
                cellSize={Math.max(24, Math.min(48, 480 / Math.max(currentGame.board_row, currentGame.board_col)))}
                onCellClick={(row, col) => console.log('Cell clicked:', row, col)}
                cursorRow={cursorRow}
                cursorCol={cursorCol}
            />
        )
    }

    return (
        <div className="flex flex-col lg:flex-row h-full gap-4">
            {/* LEFT SIDE - Board Display Area */}
            <section className="flex-1 relative flex flex-col items-center justify-center p-4 lg:p-6 bg-slate-50 rounded-xl overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

                {/* Game container */}
                <div className="relative z-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 ring-1 ring-slate-100">
                    {/* Label */}
                    <div className="absolute top-2 left-4 text-[9px] font-bold text-indigo-400 tracking-widest z-20">
                        {currentGame ? currentGame.name.toUpperCase() : 'MATRIX DISPLAY'}
                    </div>

                    {/* Game content */}
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
                                    {currentGame?.description || 'Choose a game from the menu to start playing'}
                                </p>

                                {/* Start/Resume buttons */}
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

            {/* RIGHT SIDE - Game Selector & Controls */}
            <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-3">
                {/* Timer & Score - Compact in sidebar */}
                <section className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <GameTimer
                            timeRemaining={timeRemaining}
                            isPlaying={isPlaying}
                            onTimeUp={handleTimeUp}
                            onTick={handleTick}
                            compact={true}
                        />
                        <GameScore
                            score={score}
                            label="Score"
                            compact={true}
                        />
                    </div>
                </section>

                {/* Game Selector */}
                <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex-1">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Select Cartridge
                    </h2>

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

                    {/* Games list */}
                    {!loading && !error && games.length > 0 && (
                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
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
                                            ? 'bg-indigo-50 border-2 border-indigo-500'
                                            : isDisabled
                                                ? 'border border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                                                : 'border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300'
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors ${isActive
                                                ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-sm'
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
                                                {isActive ? 'Currently Selected' : `${game.board_row}×${game.board_col}`}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <ChevronRight size={18} className="text-indigo-500" />
                                        )}
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
                </section>

                {/* Controls Section */}
                <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">
                        Controller
                    </h2>

                    <div className="flex flex-col items-center gap-4">
                        {/* Before game starts: Navigation controls */}
                        {!gameStarted && (
                            <>
                                {/* Help & Back buttons */}
                                <div className="flex items-center justify-between w-full">
                                    <button
                                        aria-label="Help"
                                        className="arcade-btn px-4 py-2 rounded-xl bg-slate-100 text-slate-500 shadow-[0_3px_0_#cbd5e1] hover:bg-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <HelpCircle size={16} />
                                    </button>
                                    <button
                                        onClick={handleBack}
                                        aria-label="Back"
                                        className="arcade-btn px-4 py-2 rounded-xl bg-rose-500 text-white shadow-[0_3px_0_#be123c] hover:bg-rose-600 text-xs font-bold flex items-center gap-2 transition-colors tracking-wide"
                                    >
                                        BACK
                                    </button>
                                </div>

                                {/* Navigation: LEFT + START + RIGHT */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleLeft}
                                        disabled={loading || games.length === 0}
                                        aria-label="Left"
                                        className={`arcade-btn w-12 h-12 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] transition-colors flex items-center justify-center ${loading || games.length === 0
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-slate-50 hover:text-indigo-500'
                                            }`}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <button
                                        onClick={handleStartClick}
                                        disabled={loading || games.length === 0 || !currentGame}
                                        aria-label="Start"
                                        className={`arcade-btn w-16 h-16 rounded-full text-white shadow-[0_6px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 ${loading || games.length === 0 || !currentGame
                                            ? 'bg-slate-400 shadow-[0_6px_0_#94a3b8] border-slate-200 cursor-not-allowed'
                                            : 'bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0_6px_0_#3730a3] border-indigo-100'
                                            }`}
                                    >
                                        <span className="text-[8px] mb-0.5 font-bold opacity-90 tracking-wide">START</span>
                                        <Play size={22} />
                                    </button>

                                    <button
                                        onClick={handleRight}
                                        disabled={loading || games.length === 0}
                                        aria-label="Right"
                                        className={`arcade-btn w-12 h-12 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] transition-colors flex items-center justify-center ${loading || games.length === 0
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-slate-50 hover:text-indigo-500'
                                            }`}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Game started and PLAYING: Direction buttons + ENTER + PAUSE */}
                        {gameStarted && isPlaying && !isPaused && (
                            <>
                                {/* Top row: PAUSE button */}
                                <div className="flex items-center justify-between w-full mb-2">
                                    <div className="text-[10px] text-slate-400">
                                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">WASD</span> / <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">↑↓←→</span>
                                    </div>
                                    <button
                                        onClick={handlePauseClick}
                                        aria-label="Pause"
                                        className="arcade-btn px-3 py-1.5 rounded-lg bg-amber-500 text-white shadow-[0_2px_0_#c2410c] hover:bg-amber-600 text-[10px] font-bold flex items-center gap-1.5 transition-colors"
                                    >
                                        <Pause size={12} /> ESC
                                    </button>
                                </div>

                                {/* D-pad: UP */}
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={handleUp}
                                        aria-label="Up"
                                        className="arcade-btn w-12 h-12 rounded-xl bg-slate-100 text-slate-600 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-200 transition-colors flex items-center justify-center"
                                    >
                                        <ChevronUp size={24} />
                                    </button>
                                </div>

                                {/* D-pad: LEFT + ENTER + RIGHT */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleLeftNav}
                                        aria-label="Left"
                                        className="arcade-btn w-12 h-12 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-indigo-500 transition-colors flex items-center justify-center"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <button
                                        onClick={handleEnter}
                                        aria-label="Enter"
                                        className="arcade-btn w-14 h-14 rounded-full text-white shadow-[0_5px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_5px_0_#15803d] border-emerald-100"
                                    >
                                        <CornerDownLeft size={20} />
                                    </button>

                                    <button
                                        onClick={handleRightNav}
                                        aria-label="Right"
                                        className="arcade-btn w-12 h-12 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-indigo-500 transition-colors flex items-center justify-center"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                                {/* D-pad: DOWN */}
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={handleDown}
                                        aria-label="Down"
                                        className="arcade-btn w-12 h-12 rounded-xl bg-slate-100 text-slate-600 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-200 transition-colors flex items-center justify-center"
                                    >
                                        <ChevronDown size={24} />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Game started and PAUSED: SAVE + RESUME + EXIT */}
                        {gameStarted && isPaused && (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <button
                                        onClick={handleSave}
                                        aria-label="Save"
                                        className="arcade-btn px-4 py-2 rounded-xl bg-emerald-500 text-white shadow-[0_3px_0_#059669] hover:bg-emerald-600 text-xs font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <Save size={16} /> SAVE
                                    </button>
                                    <button
                                        onClick={handleExit}
                                        aria-label="Exit"
                                        className="arcade-btn px-4 py-2 rounded-xl bg-rose-500 text-white shadow-[0_3px_0_#be123c] hover:bg-rose-600 text-xs font-bold flex items-center gap-2 transition-colors"
                                    >
                                        EXIT <LogOut size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleResumeGameClick}
                                    aria-label="Resume"
                                    className="arcade-btn w-16 h-16 rounded-full text-white shadow-[0_6px_0] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_6px_0_#15803d] border-emerald-100"
                                >
                                    <span className="text-[8px] mb-0.5 font-bold opacity-90 tracking-wide">RESUME</span>
                                    <Play size={22} />
                                </button>
                            </>
                        )}
                    </div>
                </section>
            </aside>

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
