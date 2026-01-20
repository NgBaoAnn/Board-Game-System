import axiosInstance from "../configs/axios.config";

const rankingApi = {
    /**
     * Get my ranking history for a specific game
     * @param {number} gameId - Game ID
     */
    getMyRanking: async (gameId) => {
        const response = await axiosInstance.get(`/ranking/myself/${gameId}`);
        return response;
    },

    /**
     * Get friends leaderboard for a specific game
     * @param {number} gameId - Game ID
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Items per page (default: 100)
     */
    getFriendsRanking: async (gameId, page = 1, limit = 100) => {
        const response = await axiosInstance.get(`/ranking/friend/${gameId}?page=${page}&limit=${limit}`);
        return response;
    },

    /**
     * Get system-wide leaderboard for a specific game
     * @param {number} gameId - Game ID
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Items per page (default: 100)
     */
    getSystemRanking: async (gameId, page = 1, limit = 100) => {
        const response = await axiosInstance.get(`/ranking/system/${gameId}?page=${page}&limit=${limit}`);
        return response;
    },
};

export default rankingApi;
