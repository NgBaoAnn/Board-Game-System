import { createContext, useContext, useEffect, useState } from "react";

const KEY = "app_theme";

const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";

    return localStorage.getItem(KEY) || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
};

const applyTheme = (theme) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
};

// Set theme + lưu localStorage
const setThemeUtil = (theme) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(KEY, theme);
    }

    applyTheme(theme);
    return theme;
};

const isDark = () => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
};

// Toggle theme
const toggleThemeUtil = () => {
    return setThemeUtil(isDark() ? "light" : "dark");
};


const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => getInitialTheme());

    // Sync theme state -> DOM + localStorage
    useEffect(() => {
        setThemeUtil(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                isDarkTheme: () => theme === "dark",
                toggleTheme: () => {
                    const nextTheme = toggleThemeUtil();
                    setTheme(nextTheme);
                    return nextTheme;
                },
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;
