import axios from 'axios'

// Create axios instance with base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error)
        const errorMessage =
            error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong'

        // Handle 401 Unauthorized - logout user
        if (error.response?.status === 401) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
            }
        }

        return Promise.reject(new Error(errorMessage))
    }
)

export default axiosInstance
