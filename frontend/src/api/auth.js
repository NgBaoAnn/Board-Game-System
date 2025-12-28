import axiosInstance from './http'

export const authApi = {
    /**
     * Register new user
     * @param {Object} data - User registration data
     * @param {string} data.email - User email
     * @param {string} data.username - Username
     * @param {string} data.password - Password
     * @returns {Promise<Object>} Response with user data
     */
    register: async (data) => {
        const response = await axiosInstance.post('/auth/register', {
            email: data.email,
            username: data.username,
            password: data.password,
        })
        return {
            success: response.success || true,
            user: response.data,
            message: response.message || 'Registration successful',
        }
    },

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - Password
     * @returns {Promise<Object>} Response with user data and token
     */
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        })
        return {
            success: response.success || true,
            user: response.data?.user,
            token: response.data?.access_token,
            message: response.message || 'Login successful',
        }
    },

    /**
     * Logout user
     * @returns {Promise<Object>} Logout response
     */
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout')
        return {
            success: response.success || true,
            message: response.message || 'Logout successful',
        }
    },

    /**
     * Update user profile
     * @param {Object} updates - Profile updates
     * @returns {Promise<Object>} Updated user data
     */
    updateProfile: async (updates) => {
        const response = await axiosInstance.put('/auth/profile', updates)
        return {
            success: response.success || true,
            user: response.data,
            message: response.message || 'Profile updated',
        }
    },
}
