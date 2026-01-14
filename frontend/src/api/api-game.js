import axiosInstance from "../configs/axios.config";

const gameApi = {
    /**
     * Get all games (for board game selector)
     * @returns {Promise} List of all games with board_row, board_col
     */
    getAllGames: async () => {
        const response = await axiosInstance.get('/games');
        return response;
    },

    /**
     * Get all active games
     * @returns {Promise} List of active games with board_row, board_col
     */
    getActiveGames: async () => {
        const response = await axiosInstance.get('/games/active');
        return response;
    },

    /**
     * Get game by ID
     * @param {number} id - Game ID
     */
    getGameById: async (id) => {
        const response = await axiosInstance.get(`/games/${id}`);
        return response;
    },

    /**
     * Start a game session
     * @param {string} mode - 'new' or 'resume'
     * @param {number} gameId - Game ID
     */
    startSession: async (mode, gameId) => {
        const response = await axiosInstance.post('/games/sessions', { mode, game_id: gameId });
        return response;
    },

    /**
     * Save game session
     * @param {string} sessionId - Session ID
     * @param {object} saveState - Game state to save
     */
    saveSession: async (sessionId, saveState) => {
        const response = await axiosInstance.put(`/games/sessions/${sessionId}/save`, { save_state: saveState });
        return response;
    },

    /**
     * Finish game session
     * @param {string} sessionId - Session ID
     * @param {number} score - Final score
     */
    finishSession: async (sessionId, score) => {
        const response = await axiosInstance.put(`/games/sessions/${sessionId}/finish`, { score });
        return response;
    },

    /**
     * Check if user has a saved/paused session for a game
     * @param {number} gameId - Game ID
     * @returns {Promise<{isSavedExists: boolean, message: string}>}
     */
    checkSessionExists: async (gameId) => {
        const response = await axiosInstance.get(`/games/sessions/exists/${gameId}`);
        return response;
    },

    /**
     * Get game history for a user
     * @param {string} userId - User ID
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getGameHistory: async (userId, page = 1, limit = 10) => {
        const response = await axiosInstance.get(`/games/sessions/history/${userId}`, {
            params: { page, limit }
        });
        return response;
    },

    /**
     * Get unique player count for a game
     * @param {number} gameId - Game ID
     * @returns {Promise<Object>} Object containing count
     */
    getUniquePlayerCount: async (gameId) => {
        const response = await axiosInstance.get(`/games/${gameId}/players/count`);
        return response;
    },
};

export default gameApi;
