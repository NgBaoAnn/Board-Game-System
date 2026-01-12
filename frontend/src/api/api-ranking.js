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
     */
    getFriendsRanking: async (gameId) => {
        const response = await axiosInstance.get(`/ranking/friend/${gameId}`);
        return response;
    },

    /**
     * Get system-wide leaderboard for a specific game
     * @param {number} gameId - Game ID
     */
    getSystemRanking: async (gameId) => {
        const response = await axiosInstance.get(`/ranking/system/${gameId}`);
        return response;
    },
};

export default rankingApi;
