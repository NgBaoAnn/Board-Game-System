import { useState, useEffect, useCallback } from 'react'
import { X, Circle, RotateCcw } from 'lucide-react'
import BoardGrid from '../Board/BoardGrid.jsx'

/**
 * Caro4Game - Caro game with 4-in-a-row win condition
 * Player can choose X or O before starting
 */
export default function Caro4Game({
    isPlaying = false,
    score = 0,
    onScoreChange,
    savedState = null,
    onStateChange,
    boardRows = 7,
    boardCols = 7,
    cursorRow = 0,
    cursorCol = 0,
    cellClickRef = null,
}) {
    // Player symbol selection state
    const [playerSymbol, setPlayerSymbol] = useState(savedState?.player_symbol || null)
    const [hasSelectedSymbol, setHasSelectedSymbol] = useState(savedState?.has_selected || false)

    // Derived AI symbol
    const aiSymbol = playerSymbol === 'X' ? 'O' : 'X'

    // Initialize empty board
    const createEmptyBoard = () => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }

    // Board state
    const [board, setBoard] = useState(savedState?.board || createEmptyBoard())
    const [currentPlayer, setCurrentPlayer] = useState(savedState?.current_player || 'X')
    const [winner, setWinner] = useState(null)
    const [isAiThinking, setIsAiThinking] = useState(false)
    const [gamesWon, setGamesWon] = useState(savedState?.games_won || 0)
    const [gamesLost, setGamesLost] = useState(savedState?.games_lost || 0)
    const [gamesDraw, setGamesDraw] = useState(savedState?.games_draw || 0)
    const [gamesPlayed, setGamesPlayed] = useState(savedState?.games_played || 0)
    const [winningLine, setWinningLine] = useState(null)
    const [showResultMessage, setShowResultMessage] = useState(null)
    const [lastAiMove, setLastAiMove] = useState(null) // Track AI's last move for red highlight

    // Handle symbol selection
    const handleSelectSymbol = (symbol) => {
        setPlayerSymbol(symbol)
        setHasSelectedSymbol(true)
        setCurrentPlayer('X')
    }

    // Check for winner - 4 in a row
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
        setLastAiMove(null)
    }, [boardRows, boardCols])

    // AI makes a smart move
    const makeAiMove = useCallback((currentBoard) => {
        if (!isPlaying || !hasSelectedSymbol) return

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

        const delay = 500 + Math.random() * 1000

        setTimeout(() => {
            if (!isPlaying) {
                setIsAiThinking(false)
                return
            }

            // Smart AI: prefer center area
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
                newBoard[row][col] = aiSymbol

                // Track AI's last move for red highlight
                setLastAiMove({ row, col })

                const result = checkWinner(newBoard)
                if (result) {
                    setWinner(result.winner)
                    setWinningLine(result.line)
                    setGamesPlayed(p => p + 1)

                    if (result.winner === aiSymbol) {
                        setGamesLost(l => l + 1)
                        setShowResultMessage('lose')
                        setTimeout(() => resetBoard(), 2000)
                    } else if (result.winner === 'draw') {
                        setGamesDraw(d => d + 1)
                        setShowResultMessage('draw')
                        setTimeout(() => resetBoard(), 1500)
                    }
                } else {
                    setCurrentPlayer(playerSymbol)
                }

                return newBoard
            })

            setIsAiThinking(false)
        }, delay)
    }, [isPlaying, hasSelectedSymbol, aiSymbol, playerSymbol, checkWinner, resetBoard, boardRows, boardCols])

    // Player makes a move
    const handleCellClick = useCallback((row, col) => {
        if (!isPlaying || !hasSelectedSymbol || winner || isAiThinking || currentPlayer !== playerSymbol) return
        if (board[row][col] !== null) return

        const newBoard = board.map(r => [...r])
        newBoard[row][col] = playerSymbol
        setBoard(newBoard)

        const result = checkWinner(newBoard)
        if (result) {
            setWinner(result.winner)
            setWinningLine(result.line)
            setGamesPlayed(p => p + 1)

            if (result.winner === playerSymbol) {
                setGamesWon(w => w + 1)
                onScoreChange?.(score + 50)
                setShowResultMessage('win')
                setTimeout(() => resetBoard(), 2000)
            } else if (result.winner === 'draw') {
                setGamesDraw(d => d + 1)
                setShowResultMessage('draw')
                setTimeout(() => resetBoard(), 1500)
            }
        } else {
            setCurrentPlayer(aiSymbol)
        }
    }, [isPlaying, hasSelectedSymbol, winner, isAiThinking, currentPlayer, playerSymbol, aiSymbol, board, checkWinner, resetBoard, onScoreChange, score])

    // AI move when it's AI's turn
    useEffect(() => {
        if (currentPlayer === aiSymbol && isPlaying && hasSelectedSymbol && !winner && !isAiThinking) {
            makeAiMove(board)
        }
    }, [currentPlayer, aiSymbol, isPlaying, hasSelectedSymbol, winner, isAiThinking, board, makeAiMove])

    // Notify parent of state changes for saving
    useEffect(() => {
        onStateChange?.({
            board,
            current_player: currentPlayer,
            player_symbol: playerSymbol,
            has_selected: hasSelectedSymbol,
            games_won: gamesWon,
            games_lost: gamesLost,
            games_draw: gamesDraw,
            games_played: gamesPlayed,
        })
    }, [board, currentPlayer, playerSymbol, hasSelectedSymbol, gamesWon, gamesLost, gamesDraw, gamesPlayed, onStateChange])

    // Restore saved state
    useEffect(() => {
        if (savedState) {
            setBoard(savedState.board || createEmptyBoard())
            setCurrentPlayer(savedState.current_player || 'X')
            setPlayerSymbol(savedState.player_symbol || null)
            setHasSelectedSymbol(savedState.has_selected || false)
            setGamesWon(savedState.games_won || 0)
            setGamesLost(savedState.games_lost || 0)
            setGamesDraw(savedState.games_draw || 0)
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

    // Calculate cell size
    const cellSize = Math.max(28, Math.min(48, 400 / Math.max(boardRows, boardCols)))

    // Render cell content
    const renderCellContent = (row, col) => {
        const value = board[row][col]
        const isWinning = isWinningCell(row, col)
        const iconSize = Math.max(16, cellSize * 0.5)
        const isCursor = row === cursorRow && col === cursorCol && isPlaying && !winner && hasSelectedSymbol

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
        if (isCursor) {
            return <div className="w-3 h-3 rounded-full bg-indigo-400/50 animate-pulse" />
        }
        return null
    }

    // Symbol selection screen
    if (!hasSelectedSymbol) {
        return (
            <div className="flex flex-col items-center gap-6 p-6">
                <h2 className="text-xl font-bold text-slate-700">Chọn quân cờ của bạn</h2>
                <p className="text-sm text-slate-500">X luôn đi trước • 4 để thắng</p>

                <div className="flex gap-6">
                    <button
                        onClick={() => handleSelectSymbol('X')}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all group"
                    >
                        <X size={48} className="text-indigo-600 stroke-[3] group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-indigo-700">Đi X</span>
                        <span className="text-xs text-indigo-500">Bạn đi trước</span>
                    </button>

                    <button
                        onClick={() => handleSelectSymbol('O')}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-400 transition-all group"
                    >
                        <Circle size={44} className="text-rose-500 stroke-[3] group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-rose-600">Đi O</span>
                        <span className="text-xs text-rose-400">Máy đi trước</span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Game info */}
            <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${playerSymbol === 'X' ? 'bg-indigo-50' : 'bg-rose-50'}`}>
                    {playerSymbol === 'X' ? <X size={16} className="text-indigo-600" /> : <Circle size={16} className="text-rose-500" />}
                    <span className={`font-semibold ${playerSymbol === 'X' ? 'text-indigo-700' : 'text-rose-600'}`}>Bạn</span>
                </div>
                <span className="text-slate-400">vs</span>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${aiSymbol === 'X' ? 'bg-indigo-50' : 'bg-rose-50'}`}>
                    {aiSymbol === 'X' ? <X size={16} className="text-indigo-600" /> : <Circle size={16} className="text-rose-500" />}
                    <span className={`font-semibold ${aiSymbol === 'X' ? 'text-indigo-700' : 'text-rose-600'}`}>Máy</span>
                </div>
                <div className="ml-4 px-3 py-1.5 bg-amber-50 rounded-lg">
                    <span className="font-semibold text-amber-700">4 để thắng</span>
                </div>
            </div>

            {/* Status message */}
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
                {!showResultMessage && !isAiThinking && currentPlayer === playerSymbol && isPlaying && (
                    <div className="text-indigo-600 font-medium">
                        Đến lượt bạn!
                    </div>
                )}
            </div>

            {/* Board */}
            <BoardGrid
                rows={boardRows}
                cols={boardCols}
                cellSize={cellSize}
                onCellClick={handleCellClick}
                renderContent={renderCellContent}
                getCellClassName={(row, col) =>
                    lastAiMove && lastAiMove.row === row && lastAiMove.col === col && !winner
                        ? 'ring-2 ring-rose-500 ring-inset z-10'
                        : ''
                }
            />

            {/* Stats */}
            <div className="flex gap-4 text-xs text-slate-500">
                <div>
                    Thắng: <span className="font-bold text-emerald-600">{gamesWon}</span>
                </div>
                <div>
                    Hòa: <span className="font-bold text-amber-600">{gamesDraw}</span>
                </div>
                <div>
                    Thua: <span className="font-bold text-rose-600">{gamesLost}</span>
                </div>
                <div>
                    Tổng: <span className="font-bold text-slate-700">{gamesPlayed}</span>
                </div>
            </div>
        </div>
    )
}
