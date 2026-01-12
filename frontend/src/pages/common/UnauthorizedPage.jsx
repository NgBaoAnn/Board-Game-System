import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [countdown, setCountdown] = useState(10);
    const [isPaused, setIsPaused] = useState(false);

    // Countdown auto-redirect
    useEffect(() => {
        if (isPaused || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, isPaused, navigate]);

    const pauseCountdown = useCallback(() => {
        setIsPaused(true);
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-gaming-dark relative overflow-hidden flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-deep-purple dark:via-midnight-blue dark:to-gaming-dark animate-ambient opacity-80 transition-colors duration-300" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 dark:bg-neon-cyan/30 rounded-full animate-particle-rise"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${8 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 grid-bg opacity-10 dark:opacity-30" />

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="fixed top-6 right-6 p-3 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
                {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            {/* Main Content */}
            <div className="relative z-10 max-w-lg w-full">
                {/* Glass Card */}
                <div className="glass-card-light dark:glass-card p-8 sm:p-12 text-center space-y-8 transition-all duration-300">
                    {/* Animated Lock Icon */}
                    <div className="relative w-32 h-32 mx-auto">
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-neon-cyan/20 dark:to-electric-purple/20 animate-neon-glow" />

                        {/* Lock SVG */}
                        <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full relative z-10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Lock body */}
                            <rect
                                x="25" y="45"
                                width="50" height="40"
                                rx="8"
                                className="fill-white dark:fill-bg-card stroke-blue-500 dark:stroke-neon-cyan transition-colors"
                                strokeWidth="2"
                                style={{ filter: isDarkMode ? "drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))" : "none" }}
                            />

                            {/* Lock shackle */}
                            <path
                                d="M35 45 V35 C35 22 50 15 65 35 V45"
                                className="stroke-blue-500 dark:stroke-neon-cyan transition-colors"
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                                style={{ filter: isDarkMode ? "drop-shadow(0 0 6px rgba(0, 240, 255, 0.5))" : "none" }}
                            />

                            {/* Keyhole */}
                            <circle
                                cx="50" cy="60" r="6"
                                className="fill-blue-500 dark:fill-neon-cyan animate-pulse transition-colors"
                                style={{ filter: isDarkMode ? "drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))" : "none" }}
                            />
                            <rect
                                x="47" y="62"
                                width="6" height="12"
                                rx="2"
                                className="fill-blue-500 dark:fill-neon-cyan transition-colors"
                                style={{ filter: isDarkMode ? "drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))" : "none" }}
                            />
                        </svg>

                        {/* Floating particles around lock */}
                        <div className="absolute -top-2 -right-2 w-2 h-2 bg-purple-500 dark:bg-electric-purple rounded-full animate-float-piece" style={{ animationDelay: "0s" }} />
                        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-500 dark:bg-neon-cyan rounded-full animate-float-piece" style={{ animationDelay: "1s" }} />
                        <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-pink-500 dark:bg-neon-pink rounded-full animate-float-piece" style={{ animationDelay: "2s" }} />
                    </div>

                    {/* Error Code */}
                    <h1
                        className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-neon-cyan dark:via-electric-purple dark:to-neon-pink bg-clip-text text-transparent font-display tracking-wider transition-all"
                        style={{
                            textShadow: isDarkMode ? "0 0 40px rgba(0, 240, 255, 0.3)" : "none",
                            WebkitTextStroke: isDarkMode ? "1px rgba(0, 240, 255, 0.1)" : "none"
                        }}
                    >
                        401
                    </h1>

                    {/* Message */}
                    <div className="space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-body transition-colors">
                            Oops! Bạn cần đăng nhập
                        </h2>
                        <p className="text-slate-600 dark:text-muted-dark text-sm sm:text-base leading-relaxed max-w-sm mx-auto transition-colors">
                            Trang này yêu cầu xác thực. Vui lòng đăng nhập để tiếp tục trải nghiệm.
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    {!isPaused && countdown > 0 && (
                        <div
                            className="flex items-center justify-center gap-2 text-slate-500 dark:text-muted-dark text-sm cursor-pointer hover:text-blue-600 dark:hover:text-neon-cyan transition-colors"
                            onClick={pauseCountdown}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && pauseCountdown()}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                            </svg>
                            <span>Tự động về trang chủ sau <span className="text-blue-600 dark:text-neon-cyan font-mono font-bold">{countdown}s</span></span>
                            <span className="text-xs">(nhấn để dừng)</span>
                        </div>
                    )}

                    {isPaused && (
                        <div className="text-slate-500 dark:text-muted-dark text-sm">
                            <span className="text-blue-600 dark:text-neon-cyan">✓</span> Đã dừng tự động chuyển hướng
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                            style={{
                                background: isDarkMode ? "linear-gradient(135deg, #00f0ff, #a855f7)" : "linear-gradient(135deg, #2563eb, #7c3aed)",
                                boxShadow: isDarkMode ? "0 4px 0 rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 240, 255, 0.3)" : "0 4px 6px -1px rgba(37, 99, 235, 0.3)",
                            }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                            </svg>
                            Đăng nhập
                        </Link>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            Quay lại
                        </button>
                    </div>

                    {/* Home Link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 dark:text-muted-dark hover:text-blue-600 dark:hover:text-neon-cyan transition-colors text-sm group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                        Về trang chủ
                    </Link>
                </div>

                {/* Fun Message */}
                <p className="text-center text-slate-400 dark:text-muted-dark/60 text-xs mt-6 font-mono">
                    Error Code: AUTHENTICATION_REQUIRED • Board Game System
                </p>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-400/20 dark:border-neon-cyan/20 rounded-tl-3xl transition-colors" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/20 dark:border-electric-purple/20 rounded-br-3xl transition-colors" />
        </div>
    );
}
