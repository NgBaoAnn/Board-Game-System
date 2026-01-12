import axiosInstance from "../configs/axios.config";

const conversationApi = {
    /**
     * Get user's conversations (paginated)
     * @param {number} page - Page number (default 1)
     * @param {number} limit - Items per page (default 10)
     */
    getConversations: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get('/conversations', { 
            params: { page, limit } 
        });
        return response;
    },

    /**
     * Get or create a conversation with target user
     * @param {string} targetUserId - Target user ID
     */
    getOrCreateConversation: async (targetUserId) => {
        const response = await axiosInstance.post('/conversations', { targetUserId });
        return response;
    },

    /**
     * Get conversation detail
     * @param {string} conversationId - Conversation ID
     */
    getConversationDetail: async (conversationId) => {
        const response = await axiosInstance.get(`/conversations/${conversationId}`);
        return response;
    },

    /**
     * Get messages for a conversation (paginated)
     * @param {string} conversationId - Conversation ID
     * @param {number} page - Page number (default 1)
     * @param {number} limit - Items per page (default 50)
     */
    getMessages: async (conversationId, page = 1, limit = 50) => {
        const response = await axiosInstance.get(`/conversations/${conversationId}/messages`, {
            params: { page, limit }
        });
        return response;
    },

    /**
     * Send a message to a conversation (with optional file)
     * @param {string} conversationId - Conversation ID
     * @param {string} content - Message content
     * @param {File} file - Optional file attachment
     */
    sendMessage: async (conversationId, content, file = null) => {
        if (file) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('content', content || '');
            formData.append('file', file);
            
            const response = await axiosInstance.post(
                `/conversations/${conversationId}/messages`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response;
        } else {
            // Regular JSON request
            const response = await axiosInstance.post(`/conversations/${conversationId}/messages`, {
                content
            });
            return response;
        }
    },

    /**
     * React to a message with an emoji
     * @param {string} messageId - Message ID
     * @param {string|null} reaction - Emoji reaction (null to remove)
     */
    reactToMessage: async (messageId, reaction) => {
        const response = await axiosInstance.patch(`/messages/${messageId}/reaction`, {
            reaction
        });
        return response;
    },

    /**
     * Mark all messages in a conversation as read
     * @param {string} conversationId - Conversation ID
     */
    markAsRead: async (conversationId) => {
        const response = await axiosInstance.post(`/conversations/${conversationId}/read`);
        return response;
    },

    /**
     * Get total unread message count for current user
     */
    getUnreadCount: async () => {
        const response = await axiosInstance.get('/conversations/unread-count');
        return response;
    },
};

export default conversationApi;
