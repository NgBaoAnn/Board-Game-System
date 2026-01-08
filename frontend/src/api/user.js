import axiosInstance from '../configs/axios.config'

export const userApi = {
    /**
     * Get user profile
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User profile
     */
    getProfile: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}`)
        return {
            success: response.success || true,
            user: response.data,
        }
    },

    /**
     * Get user statistics
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User stats
     */
    getStats: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}/stats`)
        return {
            success: response.success || true,
            stats: response.data,
        }
    },

    /**
     * Get user friends
     * @param {string} userId - User ID
     * @returns {Promise<Array>} List of friends
     */
    getFriends: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}/friends`)
        return {
            success: response.success || true,
            friends: response.data,
        }
    },

    /**
     * Add friend
     * @param {string} userId - User ID
     * @param {string} friendId - Friend ID to add
     * @returns {Promise<Object>} Friend data
     */
    addFriend: async (userId, friendId) => {
        const response = await axiosInstance.post(`/users/${userId}/friends`, { friendId })
        return {
            success: response.success || true,
            friend: response.data,
        }
    },

    /**
     * Get user achievements
     * @param {string} userId - User ID
     * @returns {Promise<Array>} List of achievements
     */
    getAchievements: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}/achievements`)
        return {
            success: response.success || true,
            achievements: response.data,
        }
    },
}
