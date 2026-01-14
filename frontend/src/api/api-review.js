import axiosInstance from "../configs/axios.config";

/**
 * API for game reviews
 */
const reviewApi = {
    /**
     * Get average rating for a game
     * @param {number} gameId - Game ID
     */
    getAverageRating: async (gameId) => {
        const response = await axiosInstance.get(`/games/${gameId}/reviews/average`);
        return response;
    },

    /**
     * Get review summary (average, total, distribution)
     * @param {number} gameId - Game ID
     */
    getReviewSummary: async (gameId) => {
        const response = await axiosInstance.get(`/games/${gameId}/reviews/summary`);
        return response;
    },

    /**
     * Get paginated reviews for a game
     * @param {number} gameId - Game ID
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getGameReviews: async (gameId, page = 1, limit = 10) => {
        const response = await axiosInstance.get(`/games/${gameId}/reviews`, {
            params: { page, limit }
        });
        return response;
    },

    /**
     * Submit a review for a game
     * @param {number} gameId - Game ID
     * @param {number} rating - Rating (1-5)
     * @param {string} comment - Review comment
     */
    submitReview: async (gameId, rating, comment) => {
        const response = await axiosInstance.post(`/games/${gameId}/reviews`, {
            rating,
            comment
        });
        return response;
    },

    /**
     * Delete a review
     * @param {number} gameId - Game ID
     * @param {number} reviewId - Review ID
     */
    deleteReview: async (gameId, reviewId) => {
        const response = await axiosInstance.delete(`/games/${gameId}/reviews/${reviewId}`);
        return response;
    },
};

export default reviewApi;
