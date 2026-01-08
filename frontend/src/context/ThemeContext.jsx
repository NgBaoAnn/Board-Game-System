import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Initialize from localStorage or system preference
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || localStorage.getItem('app_theme')
        const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

        if (storedTheme) {
            setIsDarkMode(storedTheme === 'dark')
        } else {
            setIsDarkMode(!!prefersDark)
        }
    }, [])

    // Update DOM and localStorage when theme changes
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', isDarkMode)
            document.body?.classList.toggle('dark', isDarkMode)
        }
        const value = isDarkMode ? 'dark' : 'light'
        localStorage.setItem('theme', value)
        localStorage.setItem('app_theme', value) // keep compatibility
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev)
    }

    const setTheme = (theme) => {
        setIsDarkMode(theme === 'dark')
    }

    const antdTheme = {
        token: {
            colorPrimary: '#ff4757',
            colorBgBase: isDarkMode ? '#1f2937' : '#ffffff',
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
