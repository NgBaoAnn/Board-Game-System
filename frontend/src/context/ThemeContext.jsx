import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

const THEME_STORAGE_KEY = 'app_theme'

export const ThemeProvider = ({ children }) => {
    const getInitialTheme = () => {
        if (typeof window === 'undefined') return false
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (storedTheme) {
            return storedTheme === 'dark'
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)

    const applyTheme = useCallback((dark) => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', dark)
            document.body?.classList.toggle('dark', dark)
        }
    }, [])

    useEffect(() => {
        applyTheme(isDarkMode)
    }, [])

    useEffect(() => {
        applyTheme(isDarkMode)
        localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light') // compatibility
    }, [isDarkMode, applyTheme])

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
