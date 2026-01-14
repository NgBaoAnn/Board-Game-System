import axiosInstance from "../configs/axios.config";

export const dashboardApi = {
    /**
     * Get dashboard stats with filter
     * @param {string} filter - '7d', '30d', '6m'
     * @returns {Promise<Object>} Stats data
     */
    async getStats(filter = "7d") {
        const response = await axiosInstance.get(`/dashboard/stats?filter=${filter}`);
        return {
            success: response.success || true,
            data: response.data,
        }
    },

    async getActivityChart(filter = "7d") {
        const response = await axiosInstance.get(`/dashboard/activity-chart?filter=${filter}`);
        return {
            success: response.success || true,
            data: response.data,
        }
    },

    async getRegistrationChart(filter = "7d") {
        const response = await axiosInstance.get(`/dashboard/registration-chart?filter=${filter}`);
        return {
            success: response.success || true,
            data: response.data,
        }
    }
};
