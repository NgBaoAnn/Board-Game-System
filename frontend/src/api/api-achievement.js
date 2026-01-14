import axiosInstance from "../configs/axios.config";

const achievementApi = {
    // Admin: Get all achievements
    getAllAchievements: async (params) => {
        const response = await axiosInstance.get('/achievements', { params })
        return response
    },

    // Admin: Create achievement
    createAchievement: async (data) => {
        const response = await axiosInstance.post('/achievement', data)
        return response
    },

    // Admin: Update achievement
    updateAchievement: async (id, data) => {
        const response = await axiosInstance.put(`/achievement/${id}`, data)
        return response
    },

    // Admin: Delete achievement
    deleteAchievement: async (id) => {
        const response = await axiosInstance.delete(`/achievement/${id}`)
        return response
    },

    // Get achievement by ID
    getAchievementById: async (id) => {
        const response = await axiosInstance.get(`/achievement/${id}`)
        return response
    },

    // Get achievements by game ID
    getAchievementsByGameId: async (gameId) => {
        const response = await axiosInstance.get(`/achievements/${gameId}`)
        return response
    },

    // Get user achievements by game ID
    getUserAchievementsByGameId: async (gameId, userId) => {
        const response = await axiosInstance.get(`/achievements/${gameId}/${userId}`)
        return response
    },

    // Get all user achievements
    getAllUserAchievements: async (userId) => {
        const response = await axiosInstance.get(`/achievements/user/${userId}`)
        return response
    }
}

export default achievementApi
