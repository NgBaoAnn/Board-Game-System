import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
import { Sparkles, Zap, Star, Move } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'
import CountdownOverlay from './CountdownOverlay.jsx'

/**
 * Match3Game - Classic Match-3 puzzle game (like Candy Crush)
 * 
 * Controls:
 * - Arrow keys / WASD: Move cursor
 * - Enter: Select cell → Move to adjacent → Swap OR Deselect
 * 
 * Rules:
 * - Match 3+ same icons in a row/column to score
 * - Icons fall down after matches
 * - New icons spawn from top
 * - Chain combos for bonus points
 */

// Icon types for the game - using emojis for variety
const ICONS = ['🍎', '🍊', '🍋', '🍇', '🍓', '💎']
const ICON_COLORS = {
    '🍎': '#ef4444', // red
    '🍊': '#f97316', // orange
    '🍋': '#eab308', // yellow
    '🍇': '#8b5cf6', // purple
    '🍓': '#ec4899', // pink
    '💎': '#06b6d4', // cyan
}

function Match3Game({
    isPlaying = false,
    score = 0,
    onScoreChange,
    savedState = null,
    onStateChange,
    boardRows = 8,
    boardCols = 8,
    cursorRow = 0,
    cursorCol = 0,
    cellClickRef,
}) {
    // Initialize board
    const createInitialBoard = useCallback(() => {
        const board = []
        for (let row = 0; row < boardRows; row++) {
            const rowArr = []
            for (let col = 0; col < boardCols; col++) {
                // Avoid initial matches when generating
                let icon
                do {
                    icon = ICONS[Math.floor(Math.random() * ICONS.length)]
                } while (
                    // Check horizontal match
                    (col >= 2 && rowArr[col - 1] === icon && rowArr[col - 2] === icon) ||
                    // Check vertical match
                    (row >= 2 && board[row - 1]?.[col] === icon && board[row - 2]?.[col] === icon)
                )
                rowArr.push(icon)
            }
            board.push(rowArr)
        }
        return board
    }, [boardRows, boardCols])

    // Game state
    const [board, setBoard] = useState(() => savedState?.board || createInitialBoard())
    const [selectedCell, setSelectedCell] = useState(null) // {row, col} or null
    const [isAnimating, setIsAnimating] = useState(false)
    const [matchedCells, setMatchedCells] = useState([]) // Cells being removed
    const [comboCount, setComboCount] = useState(0)
    const [lastScore, setLastScore] = useState(0) // Score added in last move
    const [movesCount, setMovesCount] = useState(savedState?.moves || 0)
    const [totalMatches, setTotalMatches] = useState(savedState?.totalMatches || 0)
    const [showCountdown, setShowCountdown] = useState(false)
    const [isCountdownComplete, setIsCountdownComplete] = useState(savedState?.countdown_complete ?? !!savedState)

    // Refs
    const boardRef = useRef(board)
    const isAnimatingRef = useRef(false)

    useEffect(() => {
        boardRef.current = board
    }, [board])

    // Start countdown when game starts
    useEffect(() => {
        if (isPlaying && !savedState && !isCountdownComplete && !showCountdown) {
            const timer = setTimeout(() => setShowCountdown(true), 0)
            return () => clearTimeout(timer)
        }
    }, [isPlaying, savedState, isCountdownComplete, showCountdown])

    // Handle countdown complete
    const handleCountdownComplete = useCallback(() => {
        setShowCountdown(false)
        setIsCountdownComplete(true)
    }, [])

    // Calculate cell size
    const cellSize = useMemo(() => {
        return Math.max(32, Math.min(48, 420 / Math.max(boardRows, boardCols)))
    }, [boardRows, boardCols])

    // Check if two cells are adjacent
    const isAdjacent = useCallback((cell1, cell2) => {
        if (!cell1 || !cell2) return false
        const rowDiff = Math.abs(cell1.row - cell2.row)
        const colDiff = Math.abs(cell1.col - cell2.col)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
    }, [])

    // Find all matches on the board
    const findMatches = useCallback((currentBoard) => {
        const matches = new Set()

        // Check horizontal matches
        for (let row = 0; row < boardRows; row++) {
            for (let col = 0; col < boardCols - 2; col++) {
                const icon = currentBoard[row][col]
                if (icon && icon === currentBoard[row][col + 1] && icon === currentBoard[row][col + 2]) {
                    // Found match of 3, check for longer
                    let matchLength = 3
                    while (col + matchLength < boardCols && currentBoard[row][col + matchLength] === icon) {
                        matchLength++
                    }
                    for (let i = 0; i < matchLength; i++) {
                        matches.add(`${row}-${col + i}`)
                    }
                }
            }
        }

        // Check vertical matches
        for (let col = 0; col < boardCols; col++) {
            for (let row = 0; row < boardRows - 2; row++) {
                const icon = currentBoard[row][col]
                if (icon && icon === currentBoard[row + 1][col] && icon === currentBoard[row + 2][col]) {
                    // Found match of 3, check for longer
                    let matchLength = 3
                    while (row + matchLength < boardRows && currentBoard[row + matchLength][col] === icon) {
                        matchLength++
                    }
                    for (let i = 0; i < matchLength; i++) {
                        matches.add(`${row + i}-${col}`)
                    }
                }
            }
        }

        return Array.from(matches).map(key => {
            const [r, c] = key.split('-').map(Number)
            return { row: r, col: c }
        })
    }, [boardRows, boardCols])

    // Check if swap would create a match
    const wouldCreateMatch = useCallback((currentBoard, cell1, cell2) => {
        // Create a copy and swap
        const newBoard = currentBoard.map(row => [...row])
        const temp = newBoard[cell1.row][cell1.col]
        newBoard[cell1.row][cell1.col] = newBoard[cell2.row][cell2.col]
        newBoard[cell2.row][cell2.col] = temp

        const matches = findMatches(newBoard)
        return matches.length > 0
    }, [findMatches])

    // Apply gravity - icons fall down
    const applyGravity = useCallback((currentBoard) => {
        const newBoard = currentBoard.map(row => [...row])

        for (let col = 0; col < boardCols; col++) {
            // Collect non-null icons from bottom to top
            const icons = []
            for (let row = boardRows - 1; row >= 0; row--) {
                if (newBoard[row][col] !== null) {
                    icons.push(newBoard[row][col])
                }
            }

            // Fill column from bottom
            for (let row = boardRows - 1; row >= 0; row--) {
                const idx = boardRows - 1 - row
                if (idx < icons.length) {
                    newBoard[row][col] = icons[idx]
                } else {
                    // Fill with new random icon
                    newBoard[row][col] = ICONS[Math.floor(Math.random() * ICONS.length)]
                }
            }
        }

        return newBoard
    }, [boardRows, boardCols])

    // Remove matches from board (set to null)
    const removeMatches = useCallback((currentBoard, matches) => {
        const newBoard = currentBoard.map(row => [...row])
        matches.forEach(({ row, col }) => {
            newBoard[row][col] = null
        })
        return newBoard
    }, [])

    // Process matches with animation
    const processMatches = useCallback(async (initialBoard) => {
        let currentBoard = initialBoard
        let combo = 0
        let hasMatches = true

        while (hasMatches) {
            const matches = findMatches(currentBoard)

            if (matches.length === 0) {
                hasMatches = false
                setIsAnimating(false)
                isAnimatingRef.current = false
                setComboCount(0)
                break
            }

            // Show matched cells
            setMatchedCells(matches)
            setComboCount(combo + 1)
            setTotalMatches(prev => prev + matches.length)

            // Calculate score (more points for combos and longer matches)
            const baseScore = matches.length * 10
            const comboBonus = combo * 20
            const addedScore = baseScore + comboBonus
            setLastScore(addedScore)
            onScoreChange?.(score + addedScore)

            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 300))

            // Remove matches
            let newBoard = removeMatches(currentBoard, matches)
            setMatchedCells([])

            // Wait briefly
            await new Promise(resolve => setTimeout(resolve, 150))

            // Apply gravity
            newBoard = applyGravity(newBoard)
            setBoard(newBoard)
            boardRef.current = newBoard

            // Wait for gravity animation
            await new Promise(resolve => setTimeout(resolve, 250))

            // Update for next iteration
            currentBoard = newBoard
            combo++
        }

        return currentBoard
    }, [findMatches, removeMatches, applyGravity, score, onScoreChange])

    // Handle swap between two cells
    const handleSwap = useCallback(async (cell1, cell2) => {
        if (isAnimatingRef.current) return
        if (!isAdjacent(cell1, cell2)) return

        const currentBoard = boardRef.current

        // Check if swap creates a match
        if (!wouldCreateMatch(currentBoard, cell1, cell2)) {
            // Invalid swap - shake animation could be added here
            setSelectedCell(null)
            return
        }

        setIsAnimating(true)
        isAnimatingRef.current = true
        setMovesCount(prev => prev + 1)

        // Perform swap
        const newBoard = currentBoard.map(row => [...row])
        const temp = newBoard[cell1.row][cell1.col]
        newBoard[cell1.row][cell1.col] = newBoard[cell2.row][cell2.col]
        newBoard[cell2.row][cell2.col] = temp

        setBoard(newBoard)
        boardRef.current = newBoard
        setSelectedCell(null)

        // Wait for swap animation
        await new Promise(resolve => setTimeout(resolve, 200))

        // Process matches
        await processMatches(newBoard)
    }, [isAdjacent, wouldCreateMatch, processMatches])

    // Handle cell click/enter
    const handleCellClick = useCallback((row, col) => {
        if (!isPlaying || isAnimatingRef.current || !isCountdownComplete) return

        const clickedCell = { row, col }

        if (!selectedCell) {
            // No cell selected - select this one
            setSelectedCell(clickedCell)
        } else if (selectedCell.row === row && selectedCell.col === col) {
            // Clicking same cell - deselect
            setSelectedCell(null)
        } else if (isAdjacent(selectedCell, clickedCell)) {
            // Adjacent cell - try to swap
            handleSwap(selectedCell, clickedCell)
        } else {
            // Non-adjacent cell - select new cell
            setSelectedCell(clickedCell)
        }
    }, [isPlaying, selectedCell, isAdjacent, handleSwap, isCountdownComplete])

    // Expose cell click through ref for keyboard controls from BoardGamePage
    useEffect(() => {
        if (cellClickRef) {
            cellClickRef.current = handleCellClick
        }
    }, [cellClickRef, handleCellClick])

    // Notify parent of state changes
    useEffect(() => {
        onStateChange?.({
            board,
            moves: movesCount,
            totalMatches,
            countdown_complete: isCountdownComplete,
        })
    }, [board, movesCount, totalMatches, isCountdownComplete, onStateChange])

    // Check if cell is matched (for animation)
    const isMatched = useCallback((row, col) => {
        return matchedCells.some(cell => cell.row === row && cell.col === col)
    }, [matchedCells])

    // Render cell content
    const renderCellContent = useCallback((row, col) => {
        const icon = board[row]?.[col]
        const isSelected = selectedCell?.row === row && selectedCell?.col === col
        const isCursor = cursorRow === row && cursorCol === col
        const matched = isMatched(row, col)

        if (!icon) return null

        return (
            <div
                className={`
                    w-full h-full flex items-center justify-center text-2xl
                    transition-all duration-200
                    ${matched ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}
                    ${isSelected ? 'ring-4 ring-yellow-400 ring-inset rounded-lg bg-yellow-100/50' : ''}
                `}
                style={{
                    position: 'absolute',
                    inset: 0,
                    fontSize: cellSize * 0.65,
                }}
            >
                {/* Cursor indicator */}
                {isCursor && !isSelected && (
                    <div
                        className="absolute inset-1 rounded-lg border-2 border-dashed border-indigo-400 animate-pulse pointer-events-none"
                    />
                )}

                {/* Selected indicator */}
                {isSelected && (
                    <div
                        className="absolute inset-0 bg-yellow-300/30 rounded-lg animate-pulse pointer-events-none"
                    />
                )}

                {/* Icon */}
                <span
                    className={`
                        drop-shadow-md transition-transform duration-150
                        ${isSelected ? 'scale-110 animate-bounce' : ''}
                        ${matched ? 'animate-ping' : ''}
                    `}
                >
                    {icon}
                </span>
            </div>
        )
    }, [board, selectedCell, cursorRow, cursorCol, isMatched, cellSize])

    return (
        <div className="flex flex-col items-center gap-3">
            <CountdownOverlay isActive={showCountdown} onComplete={handleCountdownComplete} />

            {/* Game info */}
            <div className="flex items-center gap-4 text-sm flex-wrap justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                    <Move size={14} className="text-indigo-500" />
                    <span className="font-semibold text-indigo-700">Nước đi: {movesCount}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
                    <Star size={14} className="text-amber-500" />
                    <span className="font-semibold text-amber-700">Match: {totalMatches}</span>
                </div>
                {comboCount > 1 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg animate-pulse">
                        <Zap size={14} className="text-rose-500" />
                        <span className="font-bold text-rose-600">Combo x{comboCount}!</span>
                    </div>
                )}
            </div>

            {/* Status message */}
            <div className="h-6 flex items-center justify-center">
                {lastScore > 0 && !isAnimating && (
                    <div className="text-emerald-600 font-bold animate-bounce text-sm flex items-center gap-1">
                        <Sparkles size={14} /> +{lastScore} điểm!
                    </div>
                )}
                {isAnimating && (
                    <div className="text-indigo-500 text-sm animate-pulse">
                        Đang xử lý...
                    </div>
                )}
                {!isAnimating && !lastScore && selectedCell && (
                    <div className="text-slate-500 text-xs">
                        Chọn ô kề bên để đổi chỗ, hoặc nhấn Enter để bỏ chọn
                    </div>
                )}
                {!isAnimating && !selectedCell && isPlaying && (
                    <div className="text-slate-400 text-xs">
                        Di chuyển bằng <span className="font-mono bg-slate-100 px-1 rounded">↑↓←→</span> • Nhấn <span className="font-mono bg-slate-100 px-1 rounded">Enter</span> để chọn
                    </div>
                )}
            </div>

            {/* Game board */}
            <BoardGrid
                rows={boardRows}
                cols={boardCols}
                cellSize={cellSize}
                onCellClick={handleCellClick}
                renderContent={renderCellContent}
            />

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-2 text-xs">
                {ICONS.map((icon, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded"
                    >
                        <span>{icon}</span>
                    </div>
                ))}
            </div>

            {/* Instructions */}
            <div className="text-xs text-slate-400 text-center max-w-xs">
                Ghép 3+ icon giống nhau theo hàng/cột để ghi điểm. Combo sẽ được cộng thêm điểm!
            </div>
        </div>
    )
}

export default memo(Match3Game)
