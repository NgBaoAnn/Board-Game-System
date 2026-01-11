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
    Pencil,
    Trophy,
} from 'lucide-react'

import BoardGrid from '../../components/Board/BoardGrid.jsx'
import { GameTimer, GameScore, TimeSelectionModal, TicTacToeGame, Caro4Game, Caro5Game, SnakeGame, Match3Game, MemoryGame, FreeDrawGame } from '../../components/Game'
import gameApi from '../../api/api-game.js'
import { message, Modal } from 'antd'
import { useGameSession } from '../../context/GameSessionProvider'
import { ExclamationCircleFilled } from '@ant-design/icons'


// Icon mapping for game codes from database
const GAME_ICONS = {
    'tic_tac_toe': Grid3x3,
    'caro_4': Target,
    'caro_5': Circle,
    'snake': Joystick,
    'match_3': Puzzle,
    'memory': Brain,
    'free_draw': Pencil,
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
    const [showHelpModal, setShowHelpModal] = useState(false)
    const [showAchievementModal, setShowAchievementModal] = useState(false)
    const [newAchievements, setNewAchievements] = useState([])

    // Game state
    const [gameStarted, setGameStarted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false) // Separate pause state for controls
    const [score, setScore] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [selectedTime, setSelectedTime] = useState(0)
    const [symbolSelected, setSymbolSelected] = useState(false) // Track if player has selected X/O
    const [showExitConfirm, setShowExitConfirm] = useState(false) // Exit confirmation modal

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
        // Free Draw: start directly with unlimited time (no time selection)
        if (currentGame?.code === 'free_draw') {
            handleTimeConfirm(0) // 0 = unlimited
            return
        }
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

    // Handle EXIT button - show confirmation first
    const handleExitClick = () => {
        setShowExitConfirm(true)
    }

    // Confirm exit - finish game
    const handleExitConfirm = async () => {
        setShowExitConfirm(false)
        if (sessionId) {
            try {
                const response = await gameApi.finishSession(sessionId, score)
                message.info('Game kết thúc! Điểm: ' + score)

                // Check for new achievements
                if (response?.data?.newAchievements?.length > 0) {
                    setNewAchievements(response.data.newAchievements)
                    setShowAchievementModal(true)
                }
            } catch (err) {
                console.error('Finish failed:', err)
            }
        }
        resetToSelection()
    }

    // Cancel exit
    const handleExitCancel = () => {
        setShowExitConfirm(false)
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
                const response = await gameApi.finishSession(sessionId, score)
                message.info('Hết giờ! Điểm của bạn: ' + score)

                // Check for new achievements
                if (response?.data?.newAchievements?.length > 0) {
                    setNewAchievements(response.data.newAchievements)
                    setShowAchievementModal(true)
                }
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
                    const response = await gameApi.finishSession(sessionId, score)
                    message.error('Game Over! Điểm của bạn: ' + score)

                    // Check for new achievements
                    if (response?.data?.newAchievements?.length > 0) {
                        setNewAchievements(response.data.newAchievements)
                        setShowAchievementModal(true)
                    }
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
        // Track symbol selection for timer
        if (state?.has_selected !== undefined) {
            setSymbolSelected(state.has_selected)
        }
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
        // Game selection screen keyboard controls
        if (!gameStarted) {
            const handleSelectionKeyDown = (e) => {
                switch (e.key) {
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        e.preventDefault()
                        handleLeft()
                        break
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        e.preventDefault()
                        handleRight()
                        break
                    case 'Enter':
                    case ' ':
                        e.preventDefault()
                        if (currentGame) handleStartClick()
                        break
                    case 'Escape':
                        e.preventDefault()
                        handleBack()
                        break
                    default:
                        break
                }
            }
            window.addEventListener('keydown', handleSelectionKeyDown)
            return () => window.removeEventListener('keydown', handleSelectionKeyDown)
        }

        // In-game keyboard controls
        if (!isPlaying || isPaused) return

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
    }, [gameStarted, isPlaying, isPaused, handleUp, handleDown, handleLeftNav, handleRightNav, handleEnter, handlePauseClick, handleLeft, handleRight, handleStartClick, handleBack, currentGame])

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

        if (currentGame.code === 'memory') {
            return (
                <MemoryGame
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                    boardRows={currentGame.board_row || 4}
                    boardCols={currentGame.board_col || 4}
                    cursorRow={cursorRow}
                    cursorCol={cursorCol}
                    cellClickRef={cellClickRef}
                />
            )
        }

        if (currentGame.code === 'free_draw') {
            return (
                <FreeDrawGame
                    isPlaying={isPlaying}
                    score={score}
                    onScoreChange={handleScoreChange}
                    onGameEnd={handleGameEnd}
                    savedState={savedState}
                    onStateChange={handleStateChange}
                    boardRows={currentGame.board_row || 20}
                    boardCols={currentGame.board_col || 20}
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
                {/* Timer & Score - Compact in sidebar (hidden for Free Draw) */}
                {currentGame?.code !== 'free_draw' && (
                    <section className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <GameTimer
                                timeRemaining={timeRemaining}
                                isPlaying={isPlaying && (symbolSelected || !['tic_tac_toe', 'caro_4', 'caro_5'].includes(currentGame?.code))}
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
                )}

                {/* Free Draw mode indicator */}
                {currentGame?.code === 'free_draw' && gameStarted && (
                    <section className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-xl shadow-sm">
                        <div className="flex items-center justify-center gap-2">
                            <Pencil size={18} />
                            <span className="font-bold">Chế độ vẽ tự do - Không giới hạn thời gian</span>
                        </div>
                    </section>
                )}

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
                                        onClick={() => setShowHelpModal(true)}
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
                                        onClick={handleExitClick}
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

            {/* Help Modal - Game Instructions */}
            {showHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <HelpCircle size={20} />
                                Hướng Dẫn Chơi Game
                            </h2>
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                            {/* Controls */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    🎮 Điều Khiển Chung
                                </h3>
                                <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                                    <p><span className="font-mono bg-slate-200 px-1.5 rounded">↑↓←→</span> hoặc <span className="font-mono bg-slate-200 px-1.5 rounded">WASD</span>: Di chuyển</p>
                                    <p><span className="font-mono bg-slate-200 px-1.5 rounded">Enter</span> hoặc <span className="font-mono bg-slate-200 px-1.5 rounded">Space</span>: Chọn/Xác nhận</p>
                                    <p><span className="font-mono bg-slate-200 px-1.5 rounded">ESC</span>: Tạm dừng / Quay lại</p>
                                </div>
                            </div>

                            {/* Tic Tac Toe */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Grid3x3 size={18} className="text-indigo-500" /> Tic Tac Toe
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Đánh 3 quân liên tiếp theo hàng, cột hoặc đường chéo để thắng.
                                    Bạn là X, máy là O. Di chuyển con trỏ và nhấn Enter để đặt quân.
                                </p>
                            </div>

                            {/* Caro 4 */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Target size={18} className="text-emerald-500" /> Caro 4
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Tương tự Tic Tac Toe nhưng cần 4 quân liên tiếp trên bàn 10x10.
                                    Chiến thuật quan trọng hơn!
                                </p>
                            </div>

                            {/* Caro 5 */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Circle size={18} className="text-blue-500" /> Caro 5 (Gomoku)
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Cần 5 quân liên tiếp để thắng trên bàn 15x15.
                                    Game cờ caro cổ điển, đòi hỏi tư duy chiến thuật cao.
                                </p>
                            </div>

                            {/* Snake */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Joystick size={18} className="text-amber-500" /> Snake
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Điều khiển rắn ăn mồi để dài ra. Tránh đâm vào tường và thân mình.
                                    Dùng phím mũi tên hoặc WASD để điều khiển hướng đi.
                                </p>
                            </div>

                            {/* Match 3 */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Puzzle size={18} className="text-pink-500" /> Match 3
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Ghép 3+ icon giống nhau theo hàng/cột để ghi điểm.
                                    Nhấn Enter để chọn ô, di chuyển đến ô kề bên và nhấn Enter để đổi chỗ.
                                    Nhấn Enter lần nữa vào ô đã chọn để bỏ chọn. Combo sẽ được cộng thêm điểm!
                                </p>
                            </div>

                            {/* Memory */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Brain size={18} className="text-purple-500" /> Memory
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Lật 2 thẻ để tìm cặp giống nhau. Ghi nhớ vị trí các thẻ đã lật!
                                    Đầu game sẽ hiện tất cả thẻ trong 2 giây. Tìm hết các cặp để hoàn thành.
                                </p>
                            </div>

                            {/* Free Draw */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Pencil size={18} className="text-cyan-500" /> Free Draw
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Vẽ pixel art trên canvas trắng. Chọn màu từ bảng màu, click hoặc nhấn Enter để vẽ.
                                    Phím <span className="font-mono bg-slate-200 px-1 rounded">E</span>: Bật/tắt tẩy •
                                    <span className="font-mono bg-slate-200 px-1 rounded">C</span>: Xóa canvas •
                                    <span className="font-mono bg-slate-200 px-1 rounded">P</span> hoặc click phải: Lấy màu từ ô.
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                <h3 className="font-bold text-amber-800 mb-2">💡 Mẹo</h3>
                                <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                                    <li>Bạn có thể lưu game và tiếp tục sau</li>
                                    <li>Điểm cao sẽ được lưu vào bảng xếp hạng</li>
                                    <li>Chọn thời gian chơi phù hợp với bạn</li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t">
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:brightness-110 transition-all"
                            >
                                Đã hiểu, bắt đầu chơi!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievement Notification Modal */}
            <Modal
                open={showAchievementModal}
                onCancel={() => setShowAchievementModal(false)}
                footer={null}
                centered
                width={400}
                styles={{
                    content: {
                        borderRadius: 20,
                        padding: 0,
                        overflow: 'hidden',
                    },
                }}
            >
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-bounce">
                        <Trophy size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">🎉 Thành Tựu Mới!</h2>
                    <p className="text-white/90 text-sm">
                        Chúc mừng bạn đã mở khóa thành tựu mới!
                    </p>
                </div>

                <div className="p-6 bg-white">
                    <div className="space-y-3">
                        {newAchievements.map((achievement, index) => (
                            <div
                                key={achievement.id || index}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200"
                            >
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Trophy size={20} className="text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-amber-800">
                                        {achievement.name || 'Thành tựu mới'}
                                    </div>
                                    {achievement.description && (
                                        <div className="text-xs text-amber-600">
                                            {achievement.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowAchievementModal(false)}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg"
                    >
                        Tuyệt vời! 🎮
                    </button>
                </div>
            </Modal>

            {/* Exit Confirmation Modal */}
            <Modal
                open={showExitConfirm}
                onCancel={handleExitCancel}
                footer={null}
                centered
                width={380}
                styles={{
                    content: {
                        borderRadius: 20,
                        padding: 0,
                        overflow: 'hidden',
                    },
                }}
            >
                <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <ExclamationCircleFilled className="text-3xl" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Thoát Game?</h2>
                    <p className="text-white/90 text-sm">
                        Bạn có chắc muốn thoát? Tiến trình chưa lưu sẽ mất.
                    </p>
                </div>

                <div className="p-5 bg-white space-y-3">
                    <button
                        onClick={handleExitConfirm}
                        className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg"
                    >
                        Xác nhận thoát
                    </button>
                    <button
                        onClick={handleExitCancel}
                        className="w-full py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                    >
                        Tiếp tục chơi
                    </button>
                </div>
            </Modal>
        </div>
    )
}
