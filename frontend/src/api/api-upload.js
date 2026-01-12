import axiosInstance from "../configs/axios.config";

const uploadApi = {
    /**
     * Upload user avatar
     * @param {File} file - Image file to upload
     */
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('image', file);  // Backend expects 'image' field
        
        const response = await axiosInstance.post('/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    /**
     * Upload game image (Admin only)
     * @param {File} file - Image file to upload
     */
    uploadGameImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);  // Backend expects 'image' field
        
        const response = await axiosInstance.post('/upload/game-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },
};

export default uploadApi;
