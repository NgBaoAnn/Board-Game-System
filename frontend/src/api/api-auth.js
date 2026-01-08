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
}

export default authApi;