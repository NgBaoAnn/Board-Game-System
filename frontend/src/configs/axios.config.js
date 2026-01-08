import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Mutex for refresh token
let refreshPromise = null

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor with refresh token
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config

        // 401 + not retry yet + not auth endpoints → try refresh
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/')
        ) {
            originalRequest._retry = true

            // Use mutex to prevent multiple refresh calls
            if (!refreshPromise) {
                refreshPromise = axios
                    .post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true })
                    .then((res) => res.data?.data?.access_token)
                    .catch(() => null)
                    .finally(() => { refreshPromise = null })
            }

            try {
                const newToken = await refreshPromise
                if (newToken) {
                    localStorage.setItem('access_token', newToken)
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return axiosInstance(originalRequest)
                }
            } catch {
                // Refresh failed - just clear token, no redirect
                localStorage.removeItem('access_token')
            }
        }

        // For 401 on auth endpoints, just clear token (no redirect)
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token')
        }

        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
        return Promise.reject(new Error(errorMessage))
    }
)

export default axiosInstance
