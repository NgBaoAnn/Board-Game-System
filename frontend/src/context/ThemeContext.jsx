import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Initialize from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (storedTheme) {
            setIsDarkMode(storedTheme === 'dark')
        } else {
            setIsDarkMode(prefersDark)
        }
    }, [])

    // Update DOM and localStorage when theme changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
            document.body.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            document.body.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev)
    }

    const setTheme = (theme) => {
        setIsDarkMode(theme === 'dark')
    }

    const antdTheme = {
        algorithm: isDarkMode ? undefined : undefined, // Ant Design theme algorithm
        token: {
            colorPrimary: isDarkMode ? '#ff4757' : '#ff4757',
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
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
