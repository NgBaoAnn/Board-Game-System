/**
 * Game AI Utility Module
 * Provides AI algorithms for TicTacToe, Caro4, and Caro5 games
 * with two difficulty levels (Easy, Hard)
 */

// AI Difficulty Constants
export const AI_DIFFICULTY = {
    EASY: 'easy',
    HARD: 'hard'
}

// Difficulty display info
export const DIFFICULTY_INFO = {
    easy: {
        label: 'Dễ',
        emoji: '🟢',
        description: 'AI đi ngẫu nhiên',
        color: 'emerald'
    },
    hard: {
        label: 'Khó',
        emoji: '🔴',
        description: 'AI tối ưu, rất khó thắng',
        color: 'rose'
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all empty cells on the board
 */
export function getEmptyCells(board, rows, cols) {
    const emptyCells = []
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === null) {
                emptyCells.push({ row, col })
            }
        }
    }
    return emptyCells
}

/**
 * Check if board is full
 */
export function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== null))
}

/**
 * Clone board for simulation
 */
export function cloneBoard(board) {
    return board.map(row => [...row])
}

// ============================================
// TIC TAC TOE AI (3x3 board)
// ============================================

/**
 * Check winner for TicTacToe
 */
function checkTicTacToeWinner(board) {
    const lines = [
        [[0, 0], [0, 1], [0, 2]], // rows
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], // cols
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], // diagonals
        [[0, 2], [1, 1], [2, 0]],
    ]

    for (const line of lines) {
        const [a, b, c] = line
        const valA = board[a[0]][a[1]]
        const valB = board[b[0]][b[1]]
        const valC = board[c[0]][c[1]]
        if (valA && valA === valB && valB === valC) {
            return valA
        }
    }
    return null
}

/**
 * Minimax algorithm for TicTacToe with Alpha-Beta pruning
 */
function minimax(board, depth, isMaximizing, aiSymbol, playerSymbol, alpha, beta) {
    const winner = checkTicTacToeWinner(board)

    // Terminal states
    if (winner === aiSymbol) return 10 - depth
    if (winner === playerSymbol) return depth - 10
    if (isBoardFull(board)) return 0

    const emptyCells = getEmptyCells(board, 3, 3)

    if (isMaximizing) {
        let best = -Infinity
        for (const { row, col } of emptyCells) {
            board[row][col] = aiSymbol
            const score = minimax(board, depth + 1, false, aiSymbol, playerSymbol, alpha, beta)
            board[row][col] = null
            best = Math.max(best, score)
            alpha = Math.max(alpha, score)
            if (beta <= alpha) break
        }
        return best
    } else {
        let best = Infinity
        for (const { row, col } of emptyCells) {
            board[row][col] = playerSymbol
            const score = minimax(board, depth + 1, true, aiSymbol, playerSymbol, alpha, beta)
            board[row][col] = null
            best = Math.min(best, score)
            beta = Math.min(beta, score)
            if (beta <= alpha) break
        }
        return best
    }
}

/**
 * Find best move for TicTacToe AI
 */
function findBestMoveTicTacToe(board, aiSymbol, playerSymbol) {
    let bestScore = -Infinity
    let bestMove = null
    const emptyCells = getEmptyCells(board, 3, 3)

    for (const { row, col } of emptyCells) {
        board[row][col] = aiSymbol
        const score = minimax(board, 0, false, aiSymbol, playerSymbol, -Infinity, Infinity)
        board[row][col] = null

        if (score > bestScore) {
            bestScore = score
            bestMove = { row, col }
        }
    }

    return bestMove
}

/**
 * Get TicTacToe AI move based on difficulty
 */
export function getTicTacToeAIMove(board, aiSymbol, playerSymbol, difficulty) {
    const emptyCells = getEmptyCells(board, 3, 3)
    if (emptyCells.length === 0) return null

    const boardCopy = cloneBoard(board)

    switch (difficulty) {
        case AI_DIFFICULTY.EASY:
            // Random move
            return emptyCells[Math.floor(Math.random() * emptyCells.length)]

        case AI_DIFFICULTY.HARD:
            // Minimax - unbeatable
            return findBestMoveTicTacToe(boardCopy, aiSymbol, playerSymbol)

        default:
            return emptyCells[Math.floor(Math.random() * emptyCells.length)]
    }
}

// ============================================
// CARO AI (for Caro4 and Caro5)
// ============================================

/**
 * Evaluate a position for Caro games
 * Returns score for placing a piece at (row, col)
 */
function evaluateCaroPosition(board, row, col, player, winLength, rows, cols) {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]
    let score = 0

    for (const [dr, dc] of directions) {
        let count = 1
        let openEnds = 0

        // Check forward direction
        for (let i = 1; i < winLength; i++) {
            const nr = row + dr * i
            const nc = col + dc * i
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (board[nr][nc] === player) count++
                else if (board[nr][nc] === null) { openEnds++; break }
                else break
            } else {
                break
            }
        }

        // Check backward direction
        for (let i = 1; i < winLength; i++) {
            const nr = row - dr * i
            const nc = col - dc * i
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (board[nr][nc] === player) count++
                else if (board[nr][nc] === null) { openEnds++; break }
                else break
            } else {
                break
            }
        }

        // Score based on pattern
        if (count >= winLength) score += 100000 // Winning move
        else if (count === winLength - 1 && openEnds >= 1) score += 10000 // One away from win
        else if (count === winLength - 2 && openEnds === 2) score += 1000 // Two away, open both ends
        else if (count === winLength - 2 && openEnds === 1) score += 500 // Two away, open one end
        else if (count === winLength - 3 && openEnds === 2) score += 100 // Three away, open both
        else if (count >= 2 && openEnds >= 1) score += count * 10 // Some progress
    }

    // Bonus for center positions
    const centerRow = Math.floor(rows / 2)
    const centerCol = Math.floor(cols / 2)
    const distFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol)
    score += Math.max(0, 10 - distFromCenter)

    return score
}

/**
 * Find cells adjacent to existing pieces (for smarter move selection)
 */
function getAdjacentEmptyCells(board, rows, cols) {
    const adjacent = new Set()

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] !== null) {
                // Check all 8 directions
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue
                        const nr = row + dr
                        const nc = col + dc
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === null) {
                            adjacent.add(`${nr},${nc}`)
                        }
                    }
                }
            }
        }
    }

    return Array.from(adjacent).map(key => {
        const [row, col] = key.split(',').map(Number)
        return { row, col }
    })
}

/**
 * Get Caro AI move based on difficulty
 */
export function getCaroAIMove(board, aiSymbol, playerSymbol, difficulty, winLength, rows, cols) {
    const emptyCells = getEmptyCells(board, rows, cols)
    if (emptyCells.length === 0) return null

    const centerRow = Math.floor(rows / 2)
    const centerCol = Math.floor(cols / 2)

    // First move - take center
    if (emptyCells.length === rows * cols && board[centerRow][centerCol] === null) {
        return { row: centerRow, col: centerCol }
    }

    switch (difficulty) {
        case AI_DIFFICULTY.EASY: {
            // Random move, slightly prefer center area
            if (Math.random() < 0.3) {
                // Sort by distance to center and pick from top 30%
                const sorted = [...emptyCells].sort((a, b) => {
                    const distA = Math.abs(a.row - centerRow) + Math.abs(a.col - centerCol)
                    const distB = Math.abs(b.row - centerRow) + Math.abs(b.col - centerCol)
                    return distA - distB
                })
                const topCells = sorted.slice(0, Math.max(3, Math.ceil(sorted.length * 0.3)))
                return topCells[Math.floor(Math.random() * topCells.length)]
            }
            return emptyCells[Math.floor(Math.random() * emptyCells.length)]
        }

        case AI_DIFFICULTY.HARD: {
            // Full heuristic evaluation with minimal randomness
            let bestMove = null
            let bestScore = -Infinity

            // Consider all adjacent cells
            let candidates = getAdjacentEmptyCells(board, rows, cols)
            if (candidates.length === 0) {
                candidates = emptyCells
            }

            for (const { row, col } of candidates) {
                // Strong attack evaluation
                const attackScore = evaluateCaroPosition(board, row, col, aiSymbol, winLength, rows, cols)
                // Strong block evaluation (slightly higher priority)
                const blockScore = evaluateCaroPosition(board, row, col, playerSymbol, winLength, rows, cols) * 1.2
                const totalScore = attackScore + blockScore + Math.random() * 5 // Minimal randomness

                if (totalScore > bestScore) {
                    bestScore = totalScore
                    bestMove = { row, col }
                }
            }

            return bestMove || emptyCells[Math.floor(Math.random() * emptyCells.length)]
        }

        default:
            return emptyCells[Math.floor(Math.random() * emptyCells.length)]
    }
}
