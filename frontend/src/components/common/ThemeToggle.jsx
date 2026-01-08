import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
    const { isDarkMode, toggleTheme } = useTheme();

    const handleClick = () => {
        toggleTheme();
    };

    return (
        <div className={className}>
            <div className="fixed bottom-1 right-1 z-50">
                <button
                    type="button"
                    className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
                    onClick={handleClick}
                >
                    <span className="block dark:hidden group-hover:rotate-45 transition-transform duration-500">
                        <Moon className="size-5" />
                    </span>
                    <span className="hidden dark:block group-hover:rotate-180 transition-transform duration-500">
                        <Sun className="size-5" />
                    </span>
                </button>
            </div>
        </div>
    );
}
