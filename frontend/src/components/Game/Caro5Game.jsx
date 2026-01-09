import { useState, useEffect, useCallback } from 'react'
import { X, Circle, RotateCcw } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'

/**
 * Caro5Game - Caro game with 5-in-a-row win condition (Gomoku)
 * Uses BoardGrid for the game board (typically 10x10 or larger)
 * Player wins by getting 5 pieces in a row (horizontal, vertical, or diagonal)
 */
export default function Caro5Game({
    isPlaying = false,
    score = 0,
    onScoreChange,
    onGameEnd,
    savedState = null,
    onStateChange,
    boardRows = 10,
    boardCols = 10,
}) {
    // Initialize empty board
    const createEmptyBoard = () => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }

    // Board state: boardRows x boardCols array, null = empty, 'X' = player, 'O' = AI
    const [board, setBoard] = useState(savedState?.board || createEmptyBoard())
    const [currentPlayer, setCurrentPlayer] = useState(savedState?.current_player || 'X')
    const [winner, setWinner] = useState(null)
    const [isAiThinking, setIsAiThinking] = useState(false)
    const [gamesWon, setGamesWon] = useState(savedState?.games_won || 0)
    const [gamesLost, setGamesLost] = useState(savedState?.games_lost || 0)
    const [gamesPlayed, setGamesPlayed] = useState(savedState?.games_played || 0)
    const [winningLine, setWinningLine] = useState(null)
    const [showResultMessage, setShowResultMessage] = useState(null) // 'win' | 'lose' | 'draw' | null

    // Check for winner - 5 in a row
    const checkWinner = useCallback((boardState) => {
        const rows = boardState.length
        const cols = boardState[0].length
        const winLength = 5

        // Check all directions from each cell
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down-right
            [1, -1],  // diagonal down-left
        ]

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = boardState[row][col]
                if (!cell) continue

                for (const [dr, dc] of directions) {
                    const line = [[row, col]]
                    let count = 1

                    // Check in positive direction
                    for (let i = 1; i < winLength; i++) {
                        const nr = row + dr * i
                        const nc = col + dc * i
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && boardState[nr][nc] === cell) {
                            count++
                            line.push([nr, nc])
                        } else {
                            break
                        }
                    }

                    if (count >= winLength) {
                        return { winner: cell, line }
                    }
                }
            }
        }

        // Check for draw
        const isDraw = boardState.every(row => row.every(cell => cell !== null))
        if (isDraw) {
            return { winner: 'draw', line: null }
        }

        return null
    }, [])

    // Reset board for new round
    const resetBoard = useCallback(() => {
        setBoard(createEmptyBoard())
        setCurrentPlayer('X')
        setWinner(null)
        setWinningLine(null)
        setIsAiThinking(false)
        setShowResultMessage(null)
    }, [boardRows, boardCols])

    // Evaluate position score for AI
    const evaluatePosition = useCallback((boardState, row, col, player) => {
        const rows = boardState.length
        const cols = boardState[0].length
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]
        let score = 0

        for (const [dr, dc] of directions) {
            let count = 1
            let openEnds = 0

            // Check positive direction
            for (let i = 1; i <= 4; i++) {
                const nr = row + dr * i
                const nc = col + dc * i
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (boardState[nr][nc] === player) count++
                    else if (boardState[nr][nc] === null) { openEnds++; break }
                    else break
                }
            }

            // Check negative direction
            for (let i = 1; i <= 4; i++) {
                const nr = row - dr * i
                const nc = col - dc * i
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (boardState[nr][nc] === player) count++
                    else if (boardState[nr][nc] === null) { openEnds++; break }
                    else break
                }
            }

            // Score based on count and open ends
            if (count >= 5) score += 10000
            else if (count === 4 && openEnds >= 1) score += 1000
            else if (count === 3 && openEnds === 2) score += 100
            else if (count === 3 && openEnds === 1) score += 50
            else if (count === 2 && openEnds === 2) score += 10
        }

        return score
    }, [])

    // AI makes a smart move
    const makeAiMove = useCallback((currentBoard) => {
        if (!isPlaying) return

        setIsAiThinking(true)

        // Find all empty cells
        const emptyCells = []
        for (let row = 0; row < boardRows; row++) {
            for (let col = 0; col < boardCols; col++) {
                if (currentBoard[row][col] === null) {
                    emptyCells.push({ row, col })
                }
            }
        }

        if (emptyCells.length === 0) {
            setIsAiThinking(false)
            return
        }

        // Random delay 0.5-1.5 seconds
        const delay = 500 + Math.random() * 1000

        setTimeout(() => {
            if (!isPlaying) {
                setIsAiThinking(false)
                return
            }

            // Evaluate each possible move
            let bestMove = null
            let bestScore = -Infinity

            for (const { row, col } of emptyCells) {
                // Check AI attack score
                const attackScore = evaluatePosition(currentBoard, row, col, 'O')
                // Check block player score (more important)
                const blockScore = evaluatePosition(currentBoard, row, col, 'X') * 1.2
                const totalScore = attackScore + blockScore

                // Add some randomness for variety
                const randomBonus = Math.random() * 5

                if (totalScore + randomBonus > bestScore) {
                    bestScore = totalScore + randomBonus
                    bestMove = { row, col }
                }
            }

            // If no good move found, pick center-ish
            if (!bestMove || bestScore < 10) {
                const centerRow = Math.floor(boardRows / 2)
                const centerCol = Math.floor(boardCols / 2)
                const sortedCells = [...emptyCells].sort((a, b) => {
                    const distA = Math.abs(a.row - centerRow) + Math.abs(a.col - centerCol)
                    const distB = Math.abs(b.row - centerRow) + Math.abs(b.col - centerCol)
                    return distA - distB
                })
                bestMove = sortedCells[0]
            }

            const { row, col } = bestMove

            setBoard(prev => {
                const newBoard = prev.map(r => [...r])
                newBoard[row][col] = 'O'

                // Check if AI wins
                const result = checkWinner(newBoard)
                if (result) {
                    setWinner(result.winner)
                    setWinningLine(result.line)
                    setGamesPlayed(p => p + 1)

                    if (result.winner === 'O') {
                        // AI wins - show message and auto restart
                        setGamesLost(l => l + 1)
                        setShowResultMessage('lose')
                        setTimeout(() => {
                            resetBoard()
                        }, 2000)
                    } else if (result.winner === 'draw') {
                        // Draw - auto restart after delay
                        setShowResultMessage('draw')
                        setTimeout(() => {
                            resetBoard()
                        }, 1500)
                    }
                } else {
                    setCurrentPlayer('X')
                }

                return newBoard
            })

            setIsAiThinking(false)
        }, delay)
    }, [isPlaying, checkWinner, resetBoard, boardRows, boardCols, evaluatePosition])

    // Player makes a move
    const handleCellClick = useCallback((row, col) => {
        if (!isPlaying || winner || isAiThinking || currentPlayer !== 'X') return
        if (board[row][col] !== null) return

        const newBoard = board.map(r => [...r])
        newBoard[row][col] = 'X'
        setBoard(newBoard)

        // Check if player wins
        const result = checkWinner(newBoard)
        if (result) {
            setWinner(result.winner)
            setWinningLine(result.line)
            setGamesPlayed(p => p + 1)

            if (result.winner === 'X') {
                // Player wins! +60 points (more than caro-4)
                setGamesWon(w => w + 1)
                onScoreChange?.(score + 60)
                setShowResultMessage('win')

                // Auto reset board after showing win message
                setTimeout(() => {
                    resetBoard()
                }, 2000)
            } else if (result.winner === 'draw') {
                // Draw - auto reset after delay
                setShowResultMessage('draw')
                setTimeout(() => {
                    resetBoard()
                }, 1500)
            }
        } else {
            // Switch to AI
            setCurrentPlayer('O')
        }
    }, [isPlaying, winner, isAiThinking, currentPlayer, board, checkWinner, resetBoard, onScoreChange, score])

    // AI move after player
    useEffect(() => {
        if (currentPlayer === 'O' && isPlaying && !winner && !isAiThinking) {
            makeAiMove(board)
        }
    }, [currentPlayer, isPlaying, winner, isAiThinking, board, makeAiMove])

    // Notify parent of state changes for saving
    useEffect(() => {
        onStateChange?.({
            board,
            current_player: currentPlayer,
            games_won: gamesWon,
            games_lost: gamesLost,
            games_played: gamesPlayed,
        })
    }, [board, currentPlayer, gamesWon, gamesLost, gamesPlayed, onStateChange])

    // Restore saved state
    useEffect(() => {
        if (savedState) {
            setBoard(savedState.board || createEmptyBoard())
            setCurrentPlayer(savedState.current_player || 'X')
            setGamesWon(savedState.games_won || 0)
            setGamesLost(savedState.games_lost || 0)
            setGamesPlayed(savedState.games_played || 0)
        }
    }, [savedState])

    // Check if cell is part of winning line
    const isWinningCell = (row, col) => {
        if (!winningLine) return false
        return winningLine.some(([r, c]) => r === row && c === col)
    }

    // Calculate cell size based on board dimensions
    const cellSize = Math.max(24, Math.min(40, 420 / Math.max(boardRows, boardCols)))

    // Render cell content for BoardGrid
    const renderCellContent = (row, col) => {
        const value = board[row][col]
        const isWinning = isWinningCell(row, col)
        const iconSize = Math.max(14, cellSize * 0.5)

        if (value === 'X') {
            return (
                <X
                    size={iconSize}
                    className={`${isWinning ? 'text-yellow-400 drop-shadow-lg' : 'text-indigo-600'} stroke-[3]`}
                />
            )
        }
        if (value === 'O') {
            return (
                <Circle
                    size={iconSize * 0.85}
                    className={`${isWinning ? 'text-yellow-400 drop-shadow-lg' : 'text-rose-500'} stroke-[3]`}
                />
            )
        }
        return null
    }

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Game info */}
            <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                    <X size={14} className="text-indigo-600" />
                    <span className="font-semibold text-indigo-700">Bạn</span>
                </div>
                <span className="text-slate-400">vs</span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg">
                    <Circle size={14} className="text-rose-500" />
                    <span className="font-semibold text-rose-600">Máy</span>
                </div>
                <div className="ml-3 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <span className="font-semibold text-purple-700">5 để thắng</span>
                </div>
            </div>

            {/* Status message */}
            <div className="h-7 flex items-center justify-center">
                {showResultMessage === 'win' && (
                    <div className="text-emerald-600 font-bold animate-bounce text-base">
                        🎉 Chiến thắng! +60 điểm
                    </div>
                )}
                {showResultMessage === 'lose' && (
                    <div className="text-rose-600 font-bold animate-pulse text-base">
                        😢 Thua rồi! Chơi lại...
                    </div>
                )}
                {showResultMessage === 'draw' && (
                    <div className="text-amber-600 font-bold text-base">
                        🤝 Hòa! Chơi lại...
                    </div>
                )}
                {!showResultMessage && isAiThinking && (
                    <div className="text-slate-500 flex items-center gap-2 text-sm">
                        <RotateCcw size={14} className="animate-spin" />
                        Máy đang suy nghĩ...
                    </div>
                )}
                {!showResultMessage && !isAiThinking && currentPlayer === 'X' && isPlaying && (
                    <div className="text-indigo-600 font-medium text-sm">
                        Đến lượt bạn!
                    </div>
                )}
            </div>

            {/* Board using BoardGrid */}
            <BoardGrid
                rows={boardRows}
                cols={boardCols}
                cellSize={cellSize}
                onCellClick={handleCellClick}
                renderContent={renderCellContent}
            />

            {/* Stats */}
            <div className="flex gap-6 text-xs text-slate-500">
                <div>
                    Thắng: <span className="font-bold text-emerald-600">{gamesWon}</span>
                </div>
                <div>
                    Thua: <span className="font-bold text-rose-600">{gamesLost}</span>
                </div>
                <div>
                    Đã chơi: <span className="font-bold text-slate-700">{gamesPlayed}</span>
                </div>
            </div>
        </div>
    )
}
