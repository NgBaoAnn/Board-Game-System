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
     * Get user achievements (all games)
     * @param {string} userId - User ID
     * @returns {Promise<Array>} List of achievements
     */
    getAchievements: async (userId) => {
        const response = await axiosInstance.get(`/achievements/user/${userId}`)
        return {
            success: response.success || true,
            achievements: response.data,
        }
    },

    /**
     * Get all users with pagination
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {string} search - Search query
     * @param {string} role - Role filter
     * @param {string} active - Active filter
     * @returns {Promise<Object>} Users list with pagination
     */
    getAllUsers: async (page = 1, limit = 10, search = '', role = 'all', active = 'all') => {
        const params = { page, limit };
        if (search) params.search = search;
        if (role && role !== 'all') params.role = role;
        if (active && active !== 'all') params.active = active;

        const response = await axiosInstance.get('/users', { params });
        return {
            success: response.success || true,
            data: response.data,
        }
    },

    /**
     * Update user
     * @param {string} userId - User ID
     * @param {Object} data - User data to update
     * @returns {Promise<Object>} Updated user
     */
    updateUser: async (userId, data) => {
        const response = await axiosInstance.put(`/users/${userId}`, data)
        return {
            success: response.success || true,
            user: response.data,
        }
    },

    /**
     * Get user counts
     * @returns {Promise<Object>} User counts statistics
     */
    getUserCounts: async () => {
        const response = await axiosInstance.get('/users/counts')
        return {
            success: response.success || true,
            data: response.data,
        }
    },

    /**
     * Get user registration stats
     * @returns {Promise<Object>} Registration stats
     */
    getRegistrationStats: async () => {
        const response = await axiosInstance.get('/users/stats/registrations')
        return {
            success: response.success || true,
            data: response.data,
        }
    },
}
