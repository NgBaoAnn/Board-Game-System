import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
import { Skull, Apple, Pause } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'
import CountdownOverlay from './CountdownOverlay.jsx'

/**
 * SnakeGame - Classic snake game using BoardGrid
 * - Uses BoardGrid component like other games (TicTacToe, Caro)
 * - Border cells are walls (snake dies on collision)
 * - Food spawns randomly on empty cells
 * - Snake grows when eating food
 * - Game over on wall collision or self collision
 * - Uses arrow keys/WASD to control direction
 */
function SnakeGame({
    isPlaying = false,
    score = 0,
    onScoreChange,
    onGameEnd,
    savedState = null,
    onStateChange,
    boardRows = 20,
    boardCols = 20,
}) {
    // Cell types for rendering
    const WALL = 'wall'
    const SNAKE = 'snake'
    const SNAKE_HEAD = 'head'
    const FOOD = 'food'
    const EMPTY = null

    // Initial snake position (center of playable area)
    // Playable area is from row 1 to boardRows-2, col 1 to boardCols-2
    const getInitialSnake = useCallback(() => {
        const centerRow = Math.floor(boardRows / 2)
        const centerCol = Math.floor(boardCols / 2)
        return [
            { row: centerRow, col: centerCol },
            { row: centerRow, col: centerCol - 1 },
            { row: centerRow, col: centerCol - 2 },
        ]
    }, [boardRows, boardCols])

    // Calculate initial values only once
    const initialValues = useMemo(() => {
        const snakeVal = savedState?.snake || getInitialSnake()

        // Generate initial food if not in saved state
        let foodVal = savedState?.food || null
        if (!foodVal) {
            // Generate food avoiding snake positions and walls
            const emptyCells = []
            for (let row = 1; row < boardRows - 1; row++) {
                for (let col = 1; col < boardCols - 1; col++) {
                    const occupied = snakeVal.some(seg => seg.row === row && seg.col === col)
                    if (!occupied) {
                        emptyCells.push({ row, col })
                    }
                }
            }
            if (emptyCells.length > 0) {
                foodVal = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            }
        }

        return { snake: snakeVal, food: foodVal }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Only compute once on mount

    // Game state
    const [snake, setSnake] = useState(initialValues.snake)
    const [direction, setDirection] = useState(savedState?.direction || 'right')
    const [food, setFood] = useState(initialValues.food)
    const [gameOver, setGameOver] = useState(false)
    const [gamesPlayed, setGamesPlayed] = useState(savedState?.games_played || 0)
    const [highScore, setHighScore] = useState(savedState?.high_score || 0)
    const [currentScore, setCurrentScore] = useState(savedState?.current_score || 0)
    const [speed, setSpeed] = useState(150) // ms between moves
    const [showMessage, setShowMessage] = useState(null)
    const [showCountdown, setShowCountdown] = useState(false)
    const [isCountdownComplete, setIsCountdownComplete] = useState(false)

    // Start countdown when game starts (new or resume)
    useEffect(() => {
        if (isPlaying && !isCountdownComplete && !showCountdown) {
            setShowCountdown(true)
        }
    }, [isPlaying, isCountdownComplete, showCountdown])

    // Refs for game loop
    const directionRef = useRef(direction)
    const gameLoopRef = useRef(null)
    const lastMoveRef = useRef(0)
    const snakeRef = useRef(snake)
    const foodRef = useRef(food)

    // Update refs when state changes
    useEffect(() => {
        directionRef.current = direction
    }, [direction])

    useEffect(() => {
        snakeRef.current = snake
    }, [snake])

    useEffect(() => {
        foodRef.current = food
    }, [food])

    // Check if position is a wall (border)
    const isWall = useCallback((row, col) => {
        return row === 0 || row === boardRows - 1 || col === 0 || col === boardCols - 1
    }, [boardRows, boardCols])

    // Check if position is occupied by snake
    const isSnakeCell = useCallback((row, col, snakeBody) => {
        return snakeBody.some(segment => segment.row === row && segment.col === col)
    }, [])

    // Get all empty cells (not wall, not snake)
    const getEmptyCells = useCallback((snakeBody) => {
        const emptyCells = []
        for (let row = 1; row < boardRows - 1; row++) {
            for (let col = 1; col < boardCols - 1; col++) {
                if (!isSnakeCell(row, col, snakeBody)) {
                    emptyCells.push({ row, col })
                }
            }
        }
        return emptyCells
    }, [boardRows, boardCols, isSnakeCell])

    // Spawn food at random empty position
    const spawnFood = useCallback((snakeBody) => {
        const emptyCells = getEmptyCells(snakeBody)
        if (emptyCells.length === 0) return null
        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        return emptyCells[randomIndex]
    }, [getEmptyCells])

    // Reset game
    const resetGame = useCallback(() => {
        const newSnake = getInitialSnake()
        const newFood = spawnFood(newSnake)

        setSnake(newSnake)
        snakeRef.current = newSnake
        setDirection('right')
        directionRef.current = 'right'
        setFood(newFood)
        foodRef.current = newFood
        setGameOver(false)
        setShowMessage(null)
        setCurrentScore(0)
        setSpeed(150)

        // Reset countdown if needed
        if (isPlaying) {
            setShowCountdown(true)
            setIsCountdownComplete(false)
        }
    }, [getInitialSnake, spawnFood, isPlaying])

    // Change direction function
    const changeDirection = useCallback((newDir) => {
        if (gameOver || !isCountdownComplete) return

        // Prevent 180-degree turns
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        }

        if (opposites[newDir] !== directionRef.current) {
            setDirection(newDir)
            directionRef.current = newDir
        }
    }, [gameOver, isCountdownComplete])

    // Move snake - the main game logic
    const moveSnake = useCallback(() => {
        const currentSnake = snakeRef.current
        const currentFood = foodRef.current
        const head = currentSnake[0]
        let newHead

        // Calculate new head position based on direction
        switch (directionRef.current) {
            case 'up':
                newHead = { row: head.row - 1, col: head.col }
                break
            case 'down':
                newHead = { row: head.row + 1, col: head.col }
                break
            case 'left':
                newHead = { row: head.row, col: head.col - 1 }
                break
            case 'right':
                newHead = { row: head.row, col: head.col + 1 }
                break
            default:
                return
        }

        // Check wall collision
        if (isWall(newHead.row, newHead.col)) {
            setGameOver(true)
            setShowMessage('wall')
            setGamesPlayed(g => g + 1)

            if (currentScore > highScore) {
                setHighScore(currentScore)
            }

            // Notify parent of game end
            onGameEnd?.('lose')

            // Auto restart after delay
            setTimeout(() => {
                resetGame()
            }, 2000)

            return
        }

        // Check self collision (excluding tail since it will move)
        const bodyWithoutTail = currentSnake.slice(0, -1)
        if (isSnakeCell(newHead.row, newHead.col, bodyWithoutTail)) {
            setGameOver(true)
            setShowMessage('self')
            setGamesPlayed(g => g + 1)

            if (currentScore > highScore) {
                setHighScore(currentScore)
            }

            onGameEnd?.('lose')

            setTimeout(() => {
                resetGame()
            }, 2000)

            return
        }

        // Check if eating food
        let newSnake
        if (currentFood && newHead.row === currentFood.row && newHead.col === currentFood.col) {
            // Grow snake (don't remove tail)
            newSnake = [newHead, ...currentSnake]

            // Add score (+10 per food)
            const newScore = currentScore + 10
            setCurrentScore(newScore)
            onScoreChange?.(score + 10)

            // Spawn new food
            const newFood = spawnFood(newSnake)
            setFood(newFood)
            foodRef.current = newFood

            // Increase speed slightly (min 60ms)
            setSpeed(prev => Math.max(60, prev - 2))
        } else {
            // Normal move (add head, remove tail)
            newSnake = [newHead, ...currentSnake.slice(0, -1)]
        }

        setSnake(newSnake)
        snakeRef.current = newSnake
    }, [isWall, isSnakeCell, currentScore, highScore, score, spawnFood, onScoreChange, onGameEnd, resetGame])

    // Start countdown when game starts
    useEffect(() => {
        if (isPlaying && !savedState && !isCountdownComplete && !showCountdown && !gameOver) {
            setShowCountdown(true)
        }
    }, [isPlaying, savedState, isCountdownComplete, showCountdown, gameOver])

    // Handle countdown complete
    const handleCountdownComplete = useCallback(() => {
        setShowCountdown(false)
        setIsCountdownComplete(true)
    }, [])

    // Game loop with requestAnimationFrame
    useEffect(() => {
        if (!isPlaying || gameOver || !isCountdownComplete) {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current)
                gameLoopRef.current = null
            }
            return
        }

        const gameLoop = (timestamp) => {
            if (!lastMoveRef.current) {
                lastMoveRef.current = timestamp
            }

            const elapsed = timestamp - lastMoveRef.current

            if (elapsed >= speed) {
                moveSnake()
                lastMoveRef.current = timestamp
            }

            gameLoopRef.current = requestAnimationFrame(gameLoop)
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop)

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current)
                gameLoopRef.current = null
            }
        }
    }, [isPlaying, gameOver, speed, moveSnake, isCountdownComplete])

    // Keyboard controls for Snake - use capture phase to handle before BoardGamePage
    useEffect(() => {
        if (!isPlaying || gameOver || !isCountdownComplete) return

        const handleSnakeKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault()
                    e.stopPropagation()
                    changeDirection('up')
                    break
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault()
                    e.stopPropagation()
                    changeDirection('down')
                    break
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault()
                    e.stopPropagation()
                    changeDirection('left')
                    break
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault()
                    e.stopPropagation()
                    changeDirection('right')
                    break
                default:
                    break
            }
        }

        // Use capture phase to handle before BoardGamePage
        window.addEventListener('keydown', handleSnakeKeyDown, true)
        return () => window.removeEventListener('keydown', handleSnakeKeyDown, true)
    }, [isPlaying, gameOver, changeDirection, isCountdownComplete])

    // Notify parent of state changes for saving
    useEffect(() => {
        onStateChange?.({
            snake,
            direction,
            food,
            games_played: gamesPlayed,
            high_score: highScore,
            current_score: currentScore,
        })
    }, [snake, direction, food, gamesPlayed, highScore, currentScore, onStateChange])

    // Calculate cell size based on board dimensions
    const cellSize = Math.max(16, Math.min(28, 480 / Math.max(boardRows, boardCols)))

    // Get cell type for a position
    const getCellType = useCallback((row, col) => {
        if (isWall(row, col)) return WALL
        if (snake[0]?.row === row && snake[0]?.col === col) return SNAKE_HEAD
        if (isSnakeCell(row, col, snake)) return SNAKE
        if (food?.row === row && food?.col === col) return FOOD
        return EMPTY
    }, [isWall, snake, isSnakeCell, food, WALL, SNAKE_HEAD, SNAKE, FOOD, EMPTY])

    // Get snake segment index for gradient coloring
    const getSnakeSegmentIndex = useCallback((row, col) => {
        return snake.findIndex(seg => seg.row === row && seg.col === col)
    }, [snake])

    // Render cell content for BoardGrid
    const renderCellContent = useCallback((row, col) => {
        const cellType = getCellType(row, col)
        const segmentIndex = getSnakeSegmentIndex(row, col)

        // Wall cells - dark gray
        if (cellType === WALL) {
            return (
                <div
                    className="w-full h-full bg-slate-700"
                    style={{
                        position: 'absolute',
                        inset: 0,
                    }}
                />
            )
        }

        // Snake head - brown/tan color with eyes
        if (cellType === SNAKE_HEAD) {
            return (
                <div
                    className="w-full h-full rounded-md flex items-center justify-center"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#8B4513', // Saddle brown
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Eyes */}
                    <div className="relative w-full h-full">
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: 4,
                                height: 4,
                                top: direction === 'down' ? '55%' : direction === 'up' ? '25%' : '35%',
                                left: direction === 'right' ? '55%' : direction === 'left' ? '15%' : '20%',
                            }}
                        />
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                width: 4,
                                height: 4,
                                top: direction === 'down' ? '55%' : direction === 'up' ? '25%' : '35%',
                                right: direction === 'left' ? '55%' : direction === 'right' ? '15%' : '20%',
                            }}
                        />
                    </div>
                </div>
            )
        }

        // Snake body - gradient brown (darker towards tail)
        if (cellType === SNAKE) {
            const opacity = Math.max(0.5, 1 - (segmentIndex / snake.length) * 0.4)
            return (
                <div
                    className="w-full h-full rounded-sm"
                    style={{
                        position: 'absolute',
                        inset: 1,
                        backgroundColor: `rgba(160, 82, 45, ${opacity})`, // Sienna brown with opacity
                        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)',
                    }}
                />
            )
        }

        // Food - red apple
        if (cellType === FOOD) {
            return (
                <div
                    className="rounded-full animate-pulse"
                    style={{
                        width: cellSize * 0.6,
                        height: cellSize * 0.6,
                        backgroundColor: '#ef4444',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                />
            )
        }

        return null
    }, [getCellType, getSnakeSegmentIndex, direction, snake.length, cellSize, WALL, SNAKE_HEAD, SNAKE, FOOD])

    // Notify parent of state changes
    useEffect(() => {
        onStateChange?.({
            snake,
            food,
            direction,
            current_score: currentScore,
            high_score: highScore,
            games_played: gamesPlayed,
            countdown_complete: isCountdownComplete,
        })
    }, [snake, food, direction, currentScore, highScore, gamesPlayed, isCountdownComplete, onStateChange])

    return (
        <div className="flex flex-col items-center gap-3">
            <CountdownOverlay isActive={showCountdown} isPaused={!isPlaying} onComplete={handleCountdownComplete} />

            {/* Game info */}
            <div className="flex items-center gap-4 text-sm flex-wrap justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
                    <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: '#8B4513' }}
                    />
                    <span className="font-semibold text-amber-800">Rắn: {snake.length}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg">
                    <Apple size={14} className="text-rose-500" />
                    <span className="font-semibold text-rose-600">+10 điểm</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                    <span className="font-semibold text-emerald-700">Best: {highScore}</span>
                </div>
            </div>

            {/* Status message */}
            <div className="h-8 flex items-center justify-center">
                {showMessage === 'wall' && (
                    <div className="text-rose-600 font-bold animate-pulse text-base flex items-center gap-2">
                        <Skull size={18} /> Đâm tường! Chơi lại...
                    </div>
                )}
                {showMessage === 'self' && (
                    <div className="text-rose-600 font-bold animate-pulse text-base flex items-center gap-2">
                        <Skull size={18} /> Tự cắn! Chơi lại...
                    </div>
                )}
                {!showMessage && isPlaying && !gameOver && (
                    <div className="text-slate-500 text-sm">
                        Dùng <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">WASD</span> hoặc <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">↑↓←→</span> để điều khiển
                    </div>
                )}
                {!isPlaying && !gameOver && (
                    <div className="text-amber-600 font-semibold text-sm flex items-center gap-2">
                        <Pause size={16} /> Game đang tạm dừng
                    </div>
                )}
            </div>

            {/* Game board using BoardGrid */}
            <BoardGrid
                rows={boardRows}
                cols={boardCols}
                cellSize={cellSize}
                onCellClick={() => { }} // Snake doesn't use click
                renderContent={renderCellContent}
            />

            {/* Stats */}
            <div className="flex gap-6 text-xs text-slate-500">
                <div>
                    Điểm: <span className="font-bold text-amber-700">{currentScore}</span>
                </div>
                <div>
                    Đã chơi: <span className="font-bold text-slate-700">{gamesPlayed}</span>
                </div>
                <div>
                    Tốc độ: <span className="font-bold text-indigo-600">{Math.round(1000 / speed * 10) / 10}/s</span>
                </div>
            </div>
        </div>
    )
}

export default memo(SnakeGame)
