import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
    const { toggleTheme } = useTheme();

    const handleClick = () => {
        toggleTheme();
    };

    return (
        <div className={className}>
            <div className="fixed bottom-3 right-3 z-50">
                <button
                    className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
                    onClick={handleClick}
                >
                    <span className="block dark:hidden group-hover:rotate-45 transition-transform duration-500">
                        <Moon />
                    </span>
                    <span className="hidden dark:block group-hover:rotate-180 transition-transform duration-500">
                        <Sun />
                    </span>
                </button>
            </div>
        </div>
    );
}
