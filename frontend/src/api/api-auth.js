import axiosInstance from "../configs/axios.config";

const authApi = {
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', {email, password});
        return response;
    },
    register: async (email, password, username) => {
        const response = await axiosInstance.post('/auth/register', {email, password, username});
        return response;
    },
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response;
    },
    fetchAccount: async () => {
        const response = await axiosInstance.get('/auth/account');
        return response;
    },
    refreshToken: async () => {
        const response = await axiosInstance.post('/auth/refresh-token');
        return response;
    },
    forgotPassword: async (email) => {
        const response = await axiosInstance.post('/auth/forgot-password', { email });
        return response;
    },
    verifyOtp: async (email, otp) => {
        const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
        return response;
    },
    resetPassword: async (reset_token, new_password) => {
        const response = await axiosInstance.post('/auth/reset-password', { reset_token, new_password });
        return response;
    },
}

export default authApi;