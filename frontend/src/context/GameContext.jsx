import { createContext, useContext, useState } from 'react'

const GameContext = createContext()

export const GameProvider = ({ children }) => {
    const [currentGame, setCurrentGame] = useState(null)
    const [gameState, setGameState] = useState(null)
    const [gameHistory, setGameHistory] = useState([])
    const [isGameActive, setIsGameActive] = useState(false)

    const games = [
        {
            id: 'tic-tac-toe',
            name: 'Tic Tac Toe',
            description: '3x3 classic game',
            icon: '⭕',
            minPlayers: 2,
            maxPlayers: 2,
            gridSize: 3,
        },
        {
            id: 'caro-4',
            name: 'Caro 4',
            description: 'Connect 4 in a row to win',
            icon: '🔴',
            minPlayers: 2,
            maxPlayers: 2,
            gridSize: 6,
            winCondition: 4,
        },
        {
            id: 'caro-5',
            name: 'Caro 5',
            description: 'Connect 5 in a row to win',
            icon: '🔵',
            minPlayers: 2,
            maxPlayers: 2,
            gridSize: 20,
            winCondition: 5,
        },
    ]

    const startGame = (gameId) => {
        const game = games.find((g) => g.id === gameId)
        if (!game) return false

        setCurrentGame(game)
        initializeGameState(game)
        setIsGameActive(true)

        return true
    }

    const initializeGameState = (game) => {
        // TODO: Initialize game state based on game type
        const initialState = {
            gameId: game.id,
            gridSize: game.gridSize || 3,
            board: Array(game.gridSize * game.gridSize).fill(null),
            currentPlayer: 1,
            winner: null,
            moves: [],
            startTime: new Date().toISOString(),
        }

        setGameState(initialState)
    }

    const makeMove = (position, player) => {
        if (!gameState || gameState.board[position] !== null) {
            return false
        }

        const newBoard = [...gameState.board]
        newBoard[position] = player

        const newState = {
            ...gameState,
            board: newBoard,
            currentPlayer: player === 1 ? 2 : 1,
            moves: [...gameState.moves, { position, player, timestamp: new Date().toISOString() }],
        }

        setGameState(newState)
        return true
    }

    const checkWinner = () => {
        if (!gameState || !currentGame) return null

        // TODO: Implement game-specific win condition checking
        // This should call different logic based on game type

        return null
    }

    const endGame = (winner) => {
        if (!gameState) return

        const gameRecord = {
            ...gameState,
            winner,
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(gameState.startTime).getTime(),
        }

        setGameHistory([...gameHistory, gameRecord])
        setIsGameActive(false)

        return gameRecord
    }

    const resetGame = () => {
        if (currentGame) {
            initializeGameState(currentGame)
        }
    }

    const quitGame = () => {
        setCurrentGame(null)
        setGameState(null)
        setIsGameActive(false)
    }

    const getGameStats = () => {
        if (gameHistory.length === 0) {
            return {
                totalGames: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                winRate: 0,
            }
        }

        const wins = gameHistory.filter((g) => g.winner === 1).length
        const losses = gameHistory.filter((g) => g.winner === 2).length
        const draws = gameHistory.filter((g) => g.winner === null).length

        return {
            totalGames: gameHistory.length,
            wins,
            losses,
            draws,
            winRate: ((wins / gameHistory.length) * 100).toFixed(2),
        }
    }

    return (
        <GameContext.Provider
            value={{
                games,
                currentGame,
                gameState,
                gameHistory,
                isGameActive,
                startGame,
                makeMove,
                checkWinner,
                endGame,
                resetGame,
                quitGame,
                getGameStats,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => {
    const context = useContext(GameContext)
    if (!context) {
        throw new Error('useGame must be used within GameProvider')
    }
    return context
}
