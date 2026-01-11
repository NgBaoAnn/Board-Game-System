import { useState, useEffect, useCallback } from 'react'
import { X, Circle, RotateCcw } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'

/**
 * TicTacToeGame - Tic Tac Toe game component with AI opponent
 * Uses BoardGrid for the game board
 */
export default function TicTacToeGame({
    isPlaying = false,
    score = 0,
    onScoreChange,
    savedState = null,
    onStateChange,
    cursorRow = 0,
    cursorCol = 0,
    cellClickRef = null,
}) {
    // Board state: 3x3 array, null = empty, 'X' = player, 'O' = AI
    const [board, setBoard] = useState(
        savedState?.board || [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]
    )
    const [currentPlayer, setCurrentPlayer] = useState(savedState?.current_player || 'X')
    const [winner, setWinner] = useState(null)
    const [isAiThinking, setIsAiThinking] = useState(false)
    const [gamesWon, setGamesWon] = useState(savedState?.games_won || 0)
    const [gamesLost, setGamesLost] = useState(savedState?.games_lost || 0)
    const [gamesPlayed, setGamesPlayed] = useState(savedState?.games_played || 0)
    const [winningLine, setWinningLine] = useState(null)
    const [showResultMessage, setShowResultMessage] = useState(null) // 'win' | 'lose' | 'draw' | null

    // Check for winner
    const checkWinner = useCallback((boardState) => {
        const lines = [
            // Rows
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // Columns
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // Diagonals
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ]

        for (const line of lines) {
            const [a, b, c] = line
            const valA = boardState[a[0]][a[1]]
            const valB = boardState[b[0]][b[1]]
            const valC = boardState[c[0]][c[1]]

            if (valA && valA === valB && valB === valC) {
                return { winner: valA, line }
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
        setBoard([
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ])
        setCurrentPlayer('X')
        setWinner(null)
        setWinningLine(null)
        setIsAiThinking(false)
        setShowResultMessage(null)
    }, [])

    // AI makes a random move
    const makeAiMove = useCallback((currentBoard) => {
        if (!isPlaying) return

        setIsAiThinking(true)

        // Find all empty cells
        const emptyCells = []
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (currentBoard[row][col] === null) {
                    emptyCells.push({ row, col })
                }
            }
        }

        if (emptyCells.length === 0) {
            setIsAiThinking(false)
            return
        }

        // Random delay 1-2 seconds
        const delay = 1000 + Math.random() * 1000

        setTimeout(() => {
            if (!isPlaying) {
                setIsAiThinking(false)
                return
            }

            // Pick random empty cell
            const randomIndex = Math.floor(Math.random() * emptyCells.length)
            const { row, col } = emptyCells[randomIndex]

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
                        // AI wins - show message and auto restart (continue playing)
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
    }, [isPlaying, checkWinner, resetBoard])

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
                // Player wins! +40 points
                setGamesWon(w => w + 1)
                onScoreChange?.(score + 40)
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
            setBoard(savedState.board || [[null, null, null], [null, null, null], [null, null, null]])
            setCurrentPlayer(savedState.current_player || 'X')
            setGamesWon(savedState.games_won || 0)
            setGamesLost(savedState.games_lost || 0)
            setGamesPlayed(savedState.games_played || 0)
        }
    }, [savedState])

    // Hook cellClickRef for keyboard navigation
    useEffect(() => {
        if (cellClickRef) {
            cellClickRef.current = handleCellClick
        }
    }, [cellClickRef, handleCellClick])

    // Check if cell is part of winning line
    const isWinningCell = (row, col) => {
        if (!winningLine) return false
        return winningLine.some(([r, c]) => r === row && c === col)
    }

    // Render cell content for BoardGrid
    const renderCellContent = (row, col) => {
        const value = board[row][col]
        const isWinning = isWinningCell(row, col)
        const isCursor = row === cursorRow && col === cursorCol && isPlaying && !winner

        if (value === 'X') {
            return (
                <X
                    size={32}
                    className={`${isWinning ? 'text-yellow-400 drop-shadow-lg' : 'text-indigo-600'} stroke-[3]`}
                />
            )
        }
        if (value === 'O') {
            return (
                <Circle
                    size={28}
                    className={`${isWinning ? 'text-yellow-400 drop-shadow-lg' : 'text-rose-500'} stroke-[3]`}
                />
            )
        }
        // Show cursor indicator on empty cells
        if (isCursor) {
            return (
                <div className="w-4 h-4 rounded-full bg-indigo-400/50 animate-pulse" />
            )
        }
        return null
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Game info */}
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                    <X size={16} className="text-indigo-600" />
                    <span className="font-semibold text-indigo-700">Bạn</span>
                </div>
                <span className="text-slate-400">vs</span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg">
                    <Circle size={16} className="text-rose-500" />
                    <span className="font-semibold text-rose-600">Máy</span>
                </div>
            </div>

            {/* Status message */}
            <div className="h-8 flex items-center justify-center">
                {showResultMessage === 'win' && (
                    <div className="text-emerald-600 font-bold animate-bounce text-lg">
                        🎉 Chiến thắng! +40 điểm
                    </div>
                )}
                {showResultMessage === 'lose' && (
                    <div className="text-rose-600 font-bold animate-pulse text-lg">
                        😢 Thua rồi! Chơi lại...
                    </div>
                )}
                {showResultMessage === 'draw' && (
                    <div className="text-amber-600 font-bold text-lg">
                        🤝 Hòa! Chơi lại...
                    </div>
                )}
                {!showResultMessage && isAiThinking && (
                    <div className="text-slate-500 flex items-center gap-2">
                        <RotateCcw size={16} className="animate-spin" />
                        Máy đang suy nghĩ...
                    </div>
                )}
                {!showResultMessage && !isAiThinking && currentPlayer === 'X' && isPlaying && (
                    <div className="text-indigo-600 font-medium">
                        Đến lượt bạn!
                    </div>
                )}
            </div>

            {/* Board using BoardGrid */}
            <BoardGrid
                rows={3}
                cols={3}
                cellSize={80}
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
