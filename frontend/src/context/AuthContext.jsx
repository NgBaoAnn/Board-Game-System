import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(null)

    // Initialize from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
        }

        setLoading(false)
    }, [])

    const persistAuth = (userData, jwtToken) => {
        if (!userData || !jwtToken) {
            throw new Error('Invalid authentication response')
        }

        setUser(userData)
        setToken(jwtToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', jwtToken)
    }

    const login = async (email, password) => {
        setLoading(true)
        try {
            const result = await authApi.login({ email, password })
            persistAuth(result.user, result.token)

            return { success: true, user: result.user }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const register = async (username, email, password) => {
        setLoading(true)
        try {
            const result = await authApi.register({ username, email, password })
            // Don't persist auth after register - user needs to login
            // Backend doesn't return token on register
            return { success: true, user: result.user }
        } catch (error) {
            console.error('Register error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            if (token) {
                await authApi.logout()
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setUser(null)
            setToken(null)
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }

    const updateProfile = async (updates) => {
        try {
            const result = await authApi.updateProfile(updates)
            const updatedUser = result.user || { ...user, ...updates }
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))

            return { success: true, user: updatedUser }
        } catch (error) {
            console.error('Update profile error:', error)
            return { success: false, error: error.message }
        }
    }

    const isAuthenticated = !!user && !!token

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
