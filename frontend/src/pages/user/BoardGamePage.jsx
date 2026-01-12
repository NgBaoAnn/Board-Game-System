import { useState, useCallback, useEffect, useRef } from 'react'
import {
    Grid3x3,
    Joystick,
    Loader2,
    Save,
    HelpCircle,
    Pencil,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

import BoardGrid from '../../components/Board/BoardGrid.jsx'
import { TimeSelectionModal, TicTacToeGame, Caro4Game, Caro5Game, SnakeGame, Match3Game, MemoryGame, FreeDrawGame } from '../../components/Game'
import GameCard from '../../components/BoardGame/GameCard.jsx'
import GameTopBar from '../../components/BoardGame/GameTopBar.jsx'
import GamePlayArea from '../../components/BoardGame/GamePlayArea.jsx'
import MobileDPad from '../../components/BoardGame/MobileDPad.jsx'
import GameModals from '../../components/BoardGame/GameModals.jsx'
import gameApi from '../../api/api-game.js'
import { message, Modal } from 'antd'
import { useGameSession } from '../../context/GameSessionProvider'


// Icon mapping for game codes from database (GameCard has its own icons)
const GAME_ICONS = {
    'tic_tac_toe': Grid3x3,
    'caro_4': Grid3x3,
    'caro_5': Grid3x3,
    'snake': Joystick,
    'match_3': Grid3x3,
    'memory': Grid3x3,
    'free_draw': Pencil,
}

// Logo mapping for game images from public folder
const GAME_LOGOS = {
    'tic_tac_toe': '/tic-tac-toe.png',
    'caro_4': '/caro-4.png',
    'caro_5': '/caro-5.png',
    'snake': '/snake-game.png',
    'match_3': '/match-3.png',
    'memory': '/memory.png',
    'free_draw': '/draw free.png',
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
    const [selectedTime, setSelectedTime] = useState(0) // Duration in seconds
    const [symbolSelected, setSymbolSelected] = useState(false) // Track if player has selected X/O
    const [showExitConfirm, setShowExitConfirm] = useState(false) // Exit confirmation modal
    
    // Switch Game State
    const [showSwitchConfirm, setShowSwitchConfirm] = useState(false)
    const [pendingSwitchDirection, setPendingSwitchDirection] = useState(null) // 'prev' or 'next'

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

    // Handle Game Switch Request (from GameTopBar)
    const handleSwitchRequest = (direction) => {
        if (!gameStarted) {
            // Should not happen if buttons are only shown during game, but safe guard
            if (direction === 'prev') handleLeft()
            else handleRight()
            return
        }

        // Pause game if playing
        if (isPlaying) {
            handlePauseClick()
        }

        setPendingSwitchDirection(direction)
        setShowSwitchConfirm(true)
    }

    // Handle Switch Confirm
    const handleSwitchConfirm = async (shouldSave) => {
        setShowSwitchConfirm(false)
        
        if (shouldSave && sessionId) {
            await handleSave()
        } else if (sessionId) {
            // If not saving, we should probably finish the session to clean up? 
            // Or just leave it abandoned? Let's finish it as abandoned/incomplete if API supports, 
            // or just rely on resetToSelection causing endSession()
            // endSession() is called in resetToSelection
        }

        resetToSelection()
        
        // After reset, select the next game
        // We need to use setTimeout to allow state to clear before selecting new game?
        // Actually resetToSelection sets gameStarted=false synchronously.
        // So we can select immediately.
        
        if (pendingSwitchDirection === 'prev') {
            selectGame(activeGame - 1)
        } else if (pendingSwitchDirection === 'next') {
            selectGame(activeGame + 1)
        }
        
        setPendingSwitchDirection(null)
    }

    const handleSwitchCancel = () => {
        setShowSwitchConfirm(false)
        setPendingSwitchDirection(null)
    }

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

    // ==================== RENDER ====================
    
    // PHASE 1: Game Selection (Gallery View)
    if (!gameStarted) {
        return (
            <div className="min-h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F43F5E] flex items-center justify-center text-white shadow-lg">
                                <Joystick size={24} />
                            </div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d7af2] via-gray-900 to-[#6366f1] dark:from-[#00f0ff] dark:via-white dark:to-[#a855f7]">
                                Game Arcade
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Choose your game and start playing
                        </p>
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="flex items-center gap-3">
                        {games.filter(g => g.hasSaved).length > 0 && (
                            <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold flex items-center gap-2">
                                <Save size={16} />
                                {games.filter(g => g.hasSaved).length} Saved
                            </div>
                        )}
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-semibold">
                            {games.length} Games
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-[#7C3AED] mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">Loading games...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                            <HelpCircle size={40} className="text-rose-500" />
                        </div>
                        <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                    </div>
                )}

                {/* Game Grid */}
                {!loading && !error && games.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {games.map((game, idx) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                isSelected={idx === activeGame}
                                hasSavedSession={hasSavedSession && idx === activeGame}
                                onSelect={() => selectGame(idx)}
                                onPlay={() => {
                                    selectGame(idx)
                                    handleStartClick()
                                }}
                                onResume={handleResumeClick}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && games.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <Joystick size={40} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">No games available</p>
                    </div>
                )}

                {/* Time Selection Modal */}
                <TimeSelectionModal
                    open={showTimeModal}
                    onClose={() => setShowTimeModal(false)}
                    onConfirm={handleTimeConfirm}
                    gameCode={currentGame?.code}
                />

                {/* Help Modal */}
                <Modal
                    open={showHelpModal}
                    onCancel={() => setShowHelpModal(false)}
                    footer={null}
                    centered
                    width={400}
                    styles={{
                        content: { borderRadius: 20, padding: 0, overflow: 'hidden' }
                    }}
                >
                    <div className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] text-white p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <HelpCircle size={24} />
                            How to Play
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ChevronLeft size={20} className="text-slate-600" />
                                <ChevronRight size={20} className="text-slate-600" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Arrow keys or WASD to move</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                ENTER
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Confirm selection</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                ESC
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">Pause game</span>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

    // PHASE 2: Game Playing (Immersive Mode)
    return (
        <div className="min-h-full flex flex-col">
            {/* Top Bar */}
            <GameTopBar
                currentGame={currentGame}
                timeRemaining={timeRemaining}
                score={score}
                isPlaying={isPlaying}
                isPaused={isPaused}
                symbolSelected={symbolSelected}
                onExit={handleExitClick}
                onPause={handlePauseClick}
                onResume={handleResumeGameClick}
                onSave={handleSave}
                onHelp={() => setShowHelpModal(true)}
                onPrevGame={() => handleSwitchRequest('prev')}
                onNextGame={() => handleSwitchRequest('next')}
                canGoPrev={games.length > 1}
                canGoNext={games.length > 1}
            />


            {/* Game Area */}
            <GamePlayArea
                currentGame={currentGame}
                isPaused={isPaused}
                isPlaying={isPlaying}
            >
                {renderGame()}
            </GamePlayArea>

            {/* Free Draw Mode Indicator */}
            {currentGame?.code === 'free_draw' && (
                <div className="mt-6 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-medium">
                        <Pencil size={16} />
                        Free Draw Mode - No Time Limit
                    </span>
                </div>
            )}

            {/* Mobile D-Pad */}
            <MobileDPad
                onUp={handleUp}
                onDown={handleDown}
                onLeft={handleLeftNav}
                onRight={handleRightNav}
                onEnter={handleEnter}
            />

            {/* Modals */}
            <GameModals
                showHelp={showHelpModal}
                showAchievement={showAchievementModal}
                showExitConfirm={showExitConfirm}
                achievements={newAchievements}
                onCloseHelp={() => setShowHelpModal(false)}
                onCloseAchievement={() => setShowAchievementModal(false)}
                onExitConfirm={handleExitConfirm}
                onExitCancel={handleExitCancel}
                
                showSwitchConfirm={showSwitchConfirm}
                onSwitchConfirm={handleSwitchConfirm}
                onSwitchCancel={handleSwitchCancel}
            />
        </div>
    )
}
