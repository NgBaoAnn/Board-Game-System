import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import NeonParticles from '@/components/common/NeonParticles'

/**
 * AuthLayout component - Reusable split-screen layout for authentication pages
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content
 * @param {React.ReactNode} props.rightContent - Right side content/image
 * @param {string} props.backTo - Optional path for back button (defaults to '/')
 * @param {'default' | 'large'} props.size - Card size: 'default' for login, 'large' for register
 */
export default function AuthLayout({ children, rightContent, backTo = '/' }) {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans antialiased min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Neon Particles Background */}
      <NeonParticles isDarkMode={isDarkMode} />

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 animate-gradient opacity-30 z-0" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-5 z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Back Button - Fixed top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to={backTo}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-slate-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Quay lại</span>
        </Link>
      </motion.div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl h-auto md:min-h-[750px] bg-white dark:bg-card-dark rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700"
      >
        {/* Left Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative"
        >
          {children}
        </motion.div>

        {/* Right Side - Image/Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:block w-1/2 relative bg-gray-900 overflow-hidden"
        >
          {rightContent}
        </motion.div>
      </motion.div>

      {/* Theme Toggle Button - Fixed bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg text-slate-800 dark:text-white border border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </motion.button>
      </motion.div>
    </div>
  )
}
