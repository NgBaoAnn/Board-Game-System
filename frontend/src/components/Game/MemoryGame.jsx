import { useState, useEffect, useCallback, useMemo } from 'react'
import { Brain, Eye, EyeOff, Sparkles, RotateCcw } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'

/**
 * MemoryGame - Classic Memory Card Matching Game
 * 
 * Rules:
 * - Cards are placed face-down on a grid
 * - Player flips 2 cards at a time
 * - If they match, they disappear and player scores
 * - If they don't match, they flip back face-down
 * - Game ends when all pairs are found
 * 
 * Controls:
 * - Arrow keys / WASD: Move cursor
 * - Enter: Flip card
 */

// Card icons - pairs of emojis
const CARD_ICONS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🦁', '🐯', '🐨', '🐸', '🐵', '🦄', '🐝', '🦋',
    '🌸', '🌺', '🌻', '🌹', '⭐', '🌙', '☀️', '🔥',
    '💎', '❤️', '💜', '💙', '🎃', '🎄', '🎁', '🎈',
]

export default function MemoryGame({
    isPlaying = false,
    score = 0,
    onScoreChange,
    savedState = null,
    onStateChange,
    boardRows = 4,
    boardCols = 4,
    cursorRow = 0,
    cursorCol = 0,
    cellClickRef,
}) {
    // Calculate total cards and pairs needed
    const totalCells = boardRows * boardCols
    const totalPairs = Math.floor(totalCells / 2)

    // Initialize cards - create pairs and shuffle
    const createInitialCards = useCallback(() => {
        // Select random icons for pairs
        const shuffledIcons = [...CARD_ICONS].sort(() => Math.random() - 0.5)
        const selectedIcons = shuffledIcons.slice(0, totalPairs)

        // Create pairs
        let cards = []
        selectedIcons.forEach((icon, idx) => {
            cards.push({ id: idx * 2, icon, isFlipped: false, isMatched: false })
            cards.push({ id: idx * 2 + 1, icon, isFlipped: false, isMatched: false })
        })

        // If odd number of cells, add one extra card that auto-matches
        if (totalCells % 2 !== 0) {
            cards.push({ id: totalCells - 1, icon: '🎯', isFlipped: true, isMatched: true })
        }

        // Shuffle cards
        cards = cards.sort(() => Math.random() - 0.5)

        // Assign positions
        return cards.map((card, index) => ({
            ...card,
            row: Math.floor(index / boardCols),
            col: index % boardCols,
        }))
    }, [totalPairs, totalCells, boardCols])

    // Game state
    const [cards, setCards] = useState(() => savedState?.cards || createInitialCards())
    const [flippedCards, setFlippedCards] = useState([]) // Currently flipped (max 2)
    const [isChecking, setIsChecking] = useState(false) // Waiting for match check
    const [matchedPairs, setMatchedPairs] = useState(savedState?.matchedPairs || 0)
    const [attempts, setAttempts] = useState(savedState?.attempts || 0)
    const [lastMatch, setLastMatch] = useState(false) // For animation
    const [showAll, setShowAll] = useState(false) // Peek mode at start

    // Calculate cell size
    const cellSize = useMemo(() => {
        return Math.max(48, Math.min(80, 400 / Math.max(boardRows, boardCols)))
    }, [boardRows, boardCols])

    // Reset game function
    const resetGame = useCallback(() => {
        const newCards = createInitialCards()
        setCards(newCards)
        setFlippedCards([])
        setIsChecking(false)
        setMatchedPairs(0)
        setAttempts(0)
        setLastMatch(false)
        // Show cards briefly for new round
        setShowAll(true)
        setTimeout(() => setShowAll(false), 2000)
    }, [createInitialCards])

    // Show all cards briefly at start
    useEffect(() => {
        if (!savedState && isPlaying) {
            setShowAll(true)
            const timer = setTimeout(() => {
                setShowAll(false)
            }, 2000) // Show for 2 seconds
            return () => clearTimeout(timer)
        }
    }, [isPlaying, savedState])

    // Get card at position
    const getCardAt = useCallback((row, col) => {
        return cards.find(card => card.row === row && card.col === col)
    }, [cards])

    // Handle card flip
    const handleFlip = useCallback((row, col) => {
        if (!isPlaying || isChecking || showAll) return

        const card = getCardAt(row, col)
        if (!card || card.isFlipped || card.isMatched) return

        // Can only flip 2 cards at a time
        if (flippedCards.length >= 2) return

        // Flip the card
        setCards(prev => prev.map(c =>
            c.id === card.id ? { ...c, isFlipped: true } : c
        ))

        const newFlipped = [...flippedCards, card]
        setFlippedCards(newFlipped)

        // If 2 cards flipped, check for match
        if (newFlipped.length === 2) {
            setIsChecking(true)
            setAttempts(prev => prev + 1)

            const [first, second] = newFlipped

            if (first.icon === second.icon) {
                // Match found!
                setLastMatch(true)
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === first.id || c.id === second.id
                            ? { ...c, isMatched: true }
                            : c
                    ))
                    setFlippedCards([])
                    setIsChecking(false)
                    setMatchedPairs(prev => prev + 1)

                    // Add score (+50 per match)
                    onScoreChange?.(score + 50)

                    setTimeout(() => setLastMatch(false), 500)

                    // Check if game complete
                    const newMatchedPairs = matchedPairs + 1
                    if (newMatchedPairs >= totalPairs) {
                        // Calculate bonus based on accuracy
                        const accuracy = (totalPairs / (attempts + 1)) * 100
                        const bonus = Math.floor(accuracy * 2)
                        onScoreChange?.(score + 50 + bonus)

                        // Auto-reset for next round after 2 seconds
                        setTimeout(() => {
                            resetGame()
                        }, 2000)
                    }
                }, 500)
            } else {
                // No match - flip back
                setLastMatch(false)
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === first.id || c.id === second.id
                            ? { ...c, isFlipped: false }
                            : c
                    ))
                    setFlippedCards([])
                    setIsChecking(false)
                }, 1000)
            }
        }
    }, [isPlaying, isChecking, showAll, getCardAt, flippedCards, score, onScoreChange, matchedPairs, totalPairs, attempts, resetGame])

    // Handle cell click
    const handleCellClick = useCallback((row, col) => {
        handleFlip(row, col)
    }, [handleFlip])

    // Expose cell click through ref for keyboard controls
    useEffect(() => {
        if (cellClickRef) {
            cellClickRef.current = handleCellClick
        }
    }, [cellClickRef, handleCellClick])

    // Notify parent of state changes
    useEffect(() => {
        onStateChange?.({
            cards,
            matchedPairs,
            attempts,
        })
    }, [cards, matchedPairs, attempts, onStateChange])

    // Calculate accuracy
    const accuracy = attempts > 0 ? Math.round((matchedPairs / attempts) * 100) : 0

    // Render cell content
    const renderCellContent = useCallback((row, col) => {
        const card = getCardAt(row, col)
        const isCursor = cursorRow === row && cursorCol === col

        if (!card) return null

        const shouldShowIcon = card.isFlipped || card.isMatched || showAll

        return (
            <div
                className={`
                    w-full h-full flex items-center justify-center
                    transition-all duration-300 transform
                    ${card.isMatched ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                `}
                style={{
                    position: 'absolute',
                    inset: 0,
                    perspective: '1000px',
                }}
            >
                {/* Cursor indicator */}
                {isCursor && !card.isMatched && (
                    <div
                        className="absolute inset-0 rounded-xl pointer-events-none z-20"
                        style={{
                            borderWidth: 4,
                            borderStyle: 'solid',
                            borderColor: '#ef4444',
                            boxShadow: '0 0 12px 2px rgba(239, 68, 68, 0.6), inset 0 0 8px rgba(239, 68, 68, 0.3)',
                        }}
                    />
                )}

                {/* Card */}
                <div
                    className={`
                        w-full h-full rounded-xl shadow-lg
                        transition-all duration-300 transform-gpu
                        ${shouldShowIcon ? 'rotate-y-0' : 'rotate-y-180'}
                        ${card.isFlipped && !card.isMatched ? 'ring-2 ring-amber-400' : ''}
                    `}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: shouldShowIcon ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    }}
                >
                    {/* Front face (icon) */}
                    <div
                        className={`
                            absolute inset-0 flex items-center justify-center
                            rounded-xl bg-gradient-to-br from-white to-slate-100
                            border-2 border-slate-200
                            backface-hidden
                        `}
                        style={{
                            backfaceVisibility: 'hidden',
                            fontSize: cellSize * 0.5,
                        }}
                    >
                        <span className="drop-shadow-sm">{card.icon}</span>
                    </div>

                    {/* Back face (hidden) */}
                    <div
                        className={`
                            absolute inset-0 flex items-center justify-center
                            rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
                            border-2 border-indigo-400
                            backface-hidden
                        `}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="text-white/30">
                            <Brain size={cellSize * 0.4} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [getCardAt, cursorRow, cursorCol, showAll, cellSize])

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Game info */}
            <div className="flex items-center gap-4 text-sm flex-wrap justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                    <Brain size={14} className="text-indigo-500" />
                    <span className="font-semibold text-indigo-700">
                        Cặp: {matchedPairs}/{totalPairs}
                    </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
                    <Eye size={14} className="text-amber-500" />
                    <span className="font-semibold text-amber-700">Lật: {attempts}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                    <Sparkles size={14} className="text-emerald-500" />
                    <span className="font-semibold text-emerald-700">Chính xác: {accuracy}%</span>
                </div>
            </div>

            {/* Status message */}
            <div className="h-6 flex items-center justify-center">
                {showAll && (
                    <div className="text-indigo-600 font-semibold animate-pulse text-sm flex items-center gap-2">
                        <Eye size={16} /> Ghi nhớ vị trí các thẻ...
                    </div>
                )}
                {lastMatch && !showAll && (
                    <div className="text-emerald-600 font-bold animate-bounce text-sm flex items-center gap-1">
                        <Sparkles size={14} /> Tìm thấy cặp! +50 điểm
                    </div>
                )}
                {isChecking && !lastMatch && (
                    <div className="text-rose-500 text-sm animate-pulse">
                        Không khớp...
                    </div>
                )}
                {!showAll && !isChecking && !lastMatch && matchedPairs >= totalPairs && (
                    <div className="text-emerald-600 font-bold text-base flex items-center gap-2">
                        🎉 Hoàn thành! Bonus: +{Math.floor((totalPairs / attempts) * 200)} điểm
                    </div>
                )}
                {!showAll && !isChecking && !lastMatch && matchedPairs < totalPairs && isPlaying && (
                    <div className="text-slate-400 text-xs">
                        Di chuyển bằng <span className="font-mono bg-slate-100 px-1 rounded">↑↓←→</span> • Nhấn <span className="font-mono bg-slate-100 px-1 rounded">Enter</span> để lật thẻ
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

            {/* Progress bar */}
            <div className="w-full max-w-xs">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
                    />
                </div>
                <div className="text-xs text-slate-400 text-center mt-1">
                    Tiến độ: {Math.round((matchedPairs / totalPairs) * 100)}%
                </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-slate-400 text-center max-w-xs">
                Lật 2 thẻ để tìm cặp giống nhau. Cố gắng ghi nhớ vị trí các thẻ!
            </div>
        </div>
    )
}
