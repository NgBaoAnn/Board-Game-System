import { createContext, useContext, useState } from 'react'

const BoardContext = createContext()

export const BoardProvider = ({ children }) => {
    const [board, setBoard] = useState(null)
    const [selectedCell, setSelectedCell] = useState(null)
    const [boardSize, setBoardSize] = useState({ rows: 3, cols: 3 })
    const [cellHistory, setCellHistory] = useState([])

    const initializeBoard = (rows, cols, initialValue = null) => {
        const newBoard = Array(rows)
            .fill(null)
            .map(() => Array(cols).fill(initialValue))

        setBoard(newBoard)
        setBoardSize({ rows, cols })
        setCellHistory([])
        setSelectedCell(null)

        return newBoard
    }

    const setCellValue = (row, col, value) => {
        if (!board || row < 0 || row >= boardSize.rows || col < 0 || col >= boardSize.cols) {
            return false
        }

        if (board[row][col] !== null) {
            return false
        }

        const newBoard = board.map((r) => [...r])
        newBoard[row][col] = value

        setBoard(newBoard)
        setCellHistory([
            ...cellHistory,
            {
                row,
                col,
                value,
                timestamp: new Date().toISOString(),
            },
        ])

        return true
    }

    const getCellValue = (row, col) => {
        if (!board || row < 0 || row >= boardSize.rows || col < 0 || col >= boardSize.cols) {
            return null
        }
        return board[row][col]
    }

    const selectCell = (row, col) => {
        if (!board || row < 0 || row >= boardSize.rows || col < 0 || col >= boardSize.cols) {
            return false
        }

        setSelectedCell({ row, col })
        return true
    }

    const moveSelection = (direction) => {
        if (!selectedCell) {
            setSelectedCell({ row: 0, col: 0 })
            return true
        }

        const { row, col } = selectedCell
        let newRow = row
        let newCol = col

        switch (direction) {
            case 'up':
                newRow = Math.max(0, row - 1)
                break
            case 'down':
                newRow = Math.min(boardSize.rows - 1, row + 1)
                break
            case 'left':
                newCol = Math.max(0, col - 1)
                break
            case 'right':
                newCol = Math.min(boardSize.cols - 1, col + 1)
                break
            default:
                return false
        }

        setSelectedCell({ row: newRow, col: newCol })
        return true
    }

    const getSelectedCellValue = () => {
        if (!selectedCell) return null
        return getCellValue(selectedCell.row, selectedCell.col)
    }

    const clearBoard = () => {
        if (!board) return false

        const clearedBoard = board.map((row) => row.map(() => null))
        setBoard(clearedBoard)
        setCellHistory([])
        setSelectedCell(null)

        return true
    }

    const undoLastMove = () => {
        if (cellHistory.length === 0) return false

        const newHistory = [...cellHistory]
        const lastMove = newHistory.pop()

        const newBoard = board.map((r) => [...r])
        newBoard[lastMove.row][lastMove.col] = null

        setBoard(newBoard)
        setCellHistory(newHistory)

        return true
    }

    const getBoardState = () => {
        return {
            board,
            size: boardSize,
            selectedCell,
            history: cellHistory,
            totalMoves: cellHistory.length,
        }
    }

    const isValidMove = (row, col) => {
        if (!board || row < 0 || row >= boardSize.rows || col < 0 || col >= boardSize.cols) {
            return false
        }
        return board[row][col] === null
    }

    return (
        <BoardContext.Provider
            value={{
                board,
                selectedCell,
                boardSize,
                cellHistory,
                initializeBoard,
                setCellValue,
                getCellValue,
                selectCell,
                moveSelection,
                getSelectedCellValue,
                clearBoard,
                undoLastMove,
                getBoardState,
                isValidMove,
            }}
        >
            {children}
        </BoardContext.Provider>
    )
}

export const useBoard = () => {
    const context = useContext(BoardContext)
    if (!context) {
        throw new Error('useBoard must be used within BoardProvider')
    }
    return context
}
