import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

const THEME_STORAGE_KEY = 'app_theme'

export const ThemeProvider = ({ children }) => {
    // Initialize from localStorage immediately (sync read)
    const getInitialTheme = () => {
        if (typeof window === 'undefined') return false
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (storedTheme) {
            return storedTheme === 'dark'
        }
        // Fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)

    // Apply theme to DOM
    const applyTheme = useCallback((dark) => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', dark)
            document.body?.classList.toggle('dark', dark)
        }
    }, [])

    // Initial DOM apply
    useEffect(() => {
        applyTheme(isDarkMode)
    }, [])

    // Update DOM and localStorage when theme changes
    useEffect(() => {
        applyTheme(isDarkMode)
        localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light') // compatibility
    }, [isDarkMode, applyTheme])

    // Listen for storage changes (sync across tabs)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === THEME_STORAGE_KEY && e.newValue) {
                setIsDarkMode(e.newValue === 'dark')
            }
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const toggleTheme = useCallback(() => {
        setIsDarkMode((prev) => !prev)
    }, [])

    const setTheme = useCallback((theme) => {
        setIsDarkMode(theme === 'dark')
    }, [])

    const antdTheme = {
        token: {
            colorPrimary: '#00f0ff',
            colorBgBase: isDarkMode ? '#1e293b' : '#ffffff',
            colorTextBase: isDarkMode ? '#f3f4f6' : '#1f2937',
            borderRadius: 8,
        },
    }

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                toggleTheme,
                setTheme,
                antdTheme,
                // compatibility surface
                theme: isDarkMode ? 'dark' : 'light',
                isDarkTheme: () => isDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider
