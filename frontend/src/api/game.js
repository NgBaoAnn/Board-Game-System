import axiosInstance from './http'

export const gameApi = {
    /**
     * Get all available games
     * @returns {Promise<Array>} List of games
     */
    getGames: async () => {
        const response = await axiosInstance.get('/games')
        return {
            success: response.success || true,
            games: response.data || response,
        }
    },

    /**
     * Start a new game
     * @param {string} gameId - Game ID
     * @returns {Promise<Object>} Game state
     */
    startGame: async (gameId) => {
        const response = await axiosInstance.post(`/games/${gameId}/start`)
        return {
            success: response.success || true,
            game: response.data,
        }
    },

    /**
     * Make a move in game
     * @param {string} gameId - Game ID
     * @param {Object} move - Move data
     * @returns {Promise<Object>} Updated game state
     */
    makeMove: async (gameId, move) => {
        const response = await axiosInstance.put(`/games/${gameId}/move`, move)
        return {
            success: response.success || true,
            game: response.data,
        }
    },

    /**
     * End game
     * @param {string} gameId - Game ID
     * @param {Object} result - Game result
     * @returns {Promise<Object>} Game result
     */
    endGame: async (gameId, result) => {
        const response = await axiosInstance.post(`/games/${gameId}/end`, result)
        return {
            success: response.success || true,
            result: response.data,
        }
    },
}
