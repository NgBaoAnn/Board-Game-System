import { useState, useEffect, useCallback } from 'react'
import { X, Circle, RotateCcw } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'

/**
 * Caro4Game - Caro game with 4-in-a-row win condition
 * Uses BoardGrid for the game board (typically 7x7 or larger)
 * Player wins by getting 4 pieces in a row (horizontal, vertical, or diagonal)
 */
export default function Caro4Game({
    isPlaying = false,
    score = 0,
    onScoreChange,
    onGameEnd,
    savedState = null,
    onStateChange,
    boardRows = 7,
    boardCols = 7,
}) {
    const createEmptyBoard = () => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }

    const [board, setBoard] = useState(savedState?.board || createEmptyBoard())
    const [currentPlayer, setCurrentPlayer] = useState(savedState?.current_player || 'X')
    const [winner, setWinner] = useState(null)
    const [isAiThinking, setIsAiThinking] = useState(false)
    const [gamesWon, setGamesWon] = useState(savedState?.games_won || 0)
    const [gamesLost, setGamesLost] = useState(savedState?.games_lost || 0)
    const [gamesPlayed, setGamesPlayed] = useState(savedState?.games_played || 0)
    const [winningLine, setWinningLine] = useState(null)
    const [showResultMessage, setShowResultMessage] = useState(null) // 'win' | 'lose' | 'draw' | null

    const checkWinner = useCallback((boardState) => {
        const rows = boardState.length
        const cols = boardState[0].length
        const winLength = 4

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

        const isDraw = boardState.every(row => row.every(cell => cell !== null))
        if (isDraw) {
            return { winner: 'draw', line: null }
        }

        return null
    }, [])

    const resetBoard = useCallback(() => {
        setBoard(createEmptyBoard())
        setCurrentPlayer('X')
        setWinner(null)
        setWinningLine(null)
        setIsAiThinking(false)
        setShowResultMessage(null)
    }, [boardRows, boardCols])

    const makeAiMove = useCallback((currentBoard) => {
        if (!isPlaying) return

        setIsAiThinking(true)

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

        const delay = 500 + Math.random() * 1000

        setTimeout(() => {
            if (!isPlaying) {
                setIsAiThinking(false)
                return
            }

            let selectedMove
            const centerRow = Math.floor(boardRows / 2)
            const centerCol = Math.floor(boardCols / 2)

            const sortedCells = [...emptyCells].sort((a, b) => {
                const distA = Math.abs(a.row - centerRow) + Math.abs(a.col - centerCol)
                const distB = Math.abs(b.row - centerRow) + Math.abs(b.col - centerCol)
                return distA - distB
            })

            if (Math.random() < 0.7 && sortedCells.length > 3) {
                const topCells = sortedCells.slice(0, Math.ceil(sortedCells.length * 0.3))
                selectedMove = topCells[Math.floor(Math.random() * topCells.length)]
            } else {
                selectedMove = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            }

            const { row, col } = selectedMove

            setBoard(prev => {
                const newBoard = prev.map(r => [...r])
                newBoard[row][col] = 'O'

                const result = checkWinner(newBoard)
                if (result) {
                    setWinner(result.winner)
                    setWinningLine(result.line)
                    setGamesPlayed(p => p + 1)

                    if (result.winner === 'O') {
                        setGamesLost(l => l + 1)
                        setShowResultMessage('lose')
                        setTimeout(() => {
                            resetBoard()
                        }, 2000)
                    } else if (result.winner === 'draw') {
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
    }, [isPlaying, checkWinner, resetBoard, boardRows, boardCols])

    const handleCellClick = useCallback((row, col) => {
        if (!isPlaying || winner || isAiThinking || currentPlayer !== 'X') return
        if (board[row][col] !== null) return

        const newBoard = board.map(r => [...r])
        newBoard[row][col] = 'X'
        setBoard(newBoard)

        const result = checkWinner(newBoard)
        if (result) {
            setWinner(result.winner)
            setWinningLine(result.line)
            setGamesPlayed(p => p + 1)

            if (result.winner === 'X') {
                setGamesWon(w => w + 1)
                onScoreChange?.(score + 50)
                setShowResultMessage('win')

                setTimeout(() => {
                    resetBoard()
                }, 2000)
            } else if (result.winner === 'draw') {
                setShowResultMessage('draw')
                setTimeout(() => {
                    resetBoard()
                }, 1500)
            }
        } else {
            setCurrentPlayer('O')
        }
    }, [isPlaying, winner, isAiThinking, currentPlayer, board, checkWinner, resetBoard, onScoreChange, score])

    useEffect(() => {
        if (currentPlayer === 'O' && isPlaying && !winner && !isAiThinking) {
            makeAiMove(board)
        }
    }, [currentPlayer, isPlaying, winner, isAiThinking, board, makeAiMove])

    useEffect(() => {
        onStateChange?.({
            board,
            current_player: currentPlayer,
            games_won: gamesWon,
            games_lost: gamesLost,
            games_played: gamesPlayed,
        })
    }, [board, currentPlayer, gamesWon, gamesLost, gamesPlayed, onStateChange])

    useEffect(() => {
        if (savedState) {
            setBoard(savedState.board || createEmptyBoard())
            setCurrentPlayer(savedState.current_player || 'X')
            setGamesWon(savedState.games_won || 0)
            setGamesLost(savedState.games_lost || 0)
            setGamesPlayed(savedState.games_played || 0)
        }
    }, [savedState])

    const isWinningCell = (row, col) => {
        if (!winningLine) return false
        return winningLine.some(([r, c]) => r === row && c === col)
    }

    const cellSize = Math.max(28, Math.min(48, 400 / Math.max(boardRows, boardCols)))

    const renderCellContent = (row, col) => {
        const value = board[row][col]
        const isWinning = isWinningCell(row, col)
        const iconSize = Math.max(16, cellSize * 0.5)

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
        <div className="flex flex-col items-center gap-4">
            
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
                <div className="ml-4 px-3 py-1.5 bg-amber-50 rounded-lg">
                    <span className="font-semibold text-amber-700">4 để thắng</span>
                </div>
            </div>

            
            <div className="h-8 flex items-center justify-center">
                {showResultMessage === 'win' && (
                    <div className="text-emerald-600 font-bold animate-bounce text-lg">
                        🎉 Chiến thắng! +50 điểm
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

            
            <BoardGrid
                rows={boardRows}
                cols={boardCols}
                cellSize={cellSize}
                onCellClick={handleCellClick}
                renderContent={renderCellContent}
            />

            
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
