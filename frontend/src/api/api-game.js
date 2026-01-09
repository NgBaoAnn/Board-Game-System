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
};

export default gameApi;
