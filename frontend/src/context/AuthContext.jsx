import { createContext, useContext, useState, useEffect } from 'react'

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

    const login = async (username, password) => {
        setLoading(true)
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ username, password }),
            // })
            // const data = await response.json()

            // Mock response - remove when backend is ready
            const mockUser = {
                id: '1',
                username,
                email: `${username}@example.com`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                createdAt: new Date().toISOString(),
            }
            const mockToken = 'mock-jwt-token-' + Date.now()

            setUser(mockUser)
            setToken(mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))
            localStorage.setItem('token', mockToken)

            return { success: true, user: mockUser }
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
            // TODO: Replace with actual API call
            // const response = await fetch('/api/auth/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ username, email, password }),
            // })
            // const data = await response.json()

            // Mock response - remove when backend is ready
            const mockUser = {
                id: Date.now().toString(),
                username,
                email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                createdAt: new Date().toISOString(),
            }
            const mockToken = 'mock-jwt-token-' + Date.now()

            setUser(mockUser)
            setToken(mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))
            localStorage.setItem('token', mockToken)

            return { success: true, user: mockUser }
        } catch (error) {
            console.error('Register error:', error)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    const updateProfile = async (updates) => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/auth/profile', {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${token}`,
            //   },
            //   body: JSON.stringify(updates),
            // })
            // const data = await response.json()

            const updatedUser = { ...user, ...updates }
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
