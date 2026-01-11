import axiosInstance from "../configs/axios.config";

const friendApi = {
    /**
     * Send a friend request to another user
     * @param {string} to - Target user ID
     * @param {string} message - Optional message
     */
    sendRequest: async (to, message = '') => {
        const response = await axiosInstance.post('/friends/request', { to, message });
        return response;
    },

    /**
     * Get received friend requests (paginated)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getReceivedRequests: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get('/friends/requests/received', { params: { page, limit } });
        return response;
    },

    /**
     * Get sent friend requests (paginated)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getSentRequests: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get('/friends/requests/sent', { params: { page, limit } });
        return response;
    },

    /**
     * Accept a friend request
     * @param {string} requestId - Friend request ID
     */
    acceptRequest: async (requestId) => {
        const response = await axiosInstance.patch(`/friends/requests/${requestId}/accept`);
        return response;
    },

    /**
     * Decline a friend request
     * @param {string} requestId - Friend request ID
     */
    declineRequest: async (requestId) => {
        const response = await axiosInstance.patch(`/friends/requests/${requestId}/decline`);
        return response;
    },

    /**
     * Get friends list (paginated)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getFriends: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get('/friends', { params: { page, limit } });
        return response;
    },

    /**
     * Remove a friend
     * @param {string} friendId - Friend user ID
     */
    removeFriend: async (friendId) => {
        const response = await axiosInstance.delete(`/friends/${friendId}`);
        return response;
    },

    /**
     * Get all players who are not friends (paginated)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {string} search - Search query
     */
    getNonFriends: async (page = 1, limit = 10, search = '') => {
        const response = await axiosInstance.get('/friends/non-friends', { 
            params: { page, limit, search } 
        });
        return response;
    },
};

export default friendApi;
