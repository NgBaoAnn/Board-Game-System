import { useState, useEffect, useCallback } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Avatar, message, Input, Tooltip } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2,
  Home,
  Users,
  Trophy,
  Settings,
  MessageSquare,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Star,
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import { useTheme } from '@/context/ThemeContext'
import authApi from '@/api/api-auth'
import conversationApi from '@/api/api-conversation'
import GamingParticles from '@/components/common/GamingParticles'


const menuItems = [
  { key: '/', icon: Home, label: 'Home' },
  { key: '/boardgame', icon: Gamepad2, label: 'Board Game' },
  { key: '/reviews', icon: Star, label: 'Reviews' },
  { key: '/community', icon: Users, label: 'Community' },
  { key: '/rankings', icon: Trophy, label: 'Rankings' },
  { key: '/settings', icon: Settings, label: 'Settings' },
]


export default function ClientLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, authenticated, setUser, setAuthenticated } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    if (!authenticated) return
    try {
      const response = await conversationApi.getUnreadCount()
      setUnreadCount(response.data?.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }, [authenticated])

  // Fetch unread count on mount and when location changes (coming back from messages)
  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount, location.pathname])

  // Refresh unread count periodically (every 30 seconds)
  useEffect(() => {
    if (!authenticated) return
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [authenticated, fetchUnreadCount])



  const handleLogout = async () => {
    try {
      await authApi.logout()
      message.success('Logged out successfully')
    } catch (e) {
      // Ignore error during logout (e.g. 401 if already expired)
      console.error('Logout error:', e)
    } finally {
      // Always cleanup state and redirect
      setUser(null)
      setAuthenticated(false)
      localStorage.removeItem('access_token')
      navigate('/')
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <User size={16} />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7f8] dark:bg-slate-900 flex">

      
      {/* <CustomCursor /> */}
      
      <aside
        className={`hidden lg:flex w-64 flex-shrink-0 flex-col fixed h-full z-40 transition-all duration-300 overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-b from-[#1a0a2e] via-[#12121f] to-[#0d1b3e]'
            : 'bg-white border-r border-gray-200'
        }`}
      >
          {/* Removed FloatingGamePieces for performance */}


        <div className="flex h-full flex-col justify-between p-4 relative z-10">
          <div className="flex flex-col gap-4">

            <Link to="/" className="flex items-center gap-3 px-2 py-3 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#a855f7] text-white shadow-lg shadow-[#00f0ff]/30"
              >
                <Gamepad2 size={26} />
              </motion.div>
              <div className="flex flex-col">
                <h1
                  className={`text-lg font-bold leading-tight tracking-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}
                >
                  BoardGameHub
                </h1>
                <p className="text-xs font-medium text-[#00f0ff]">Strategy Awaits</p>
              </div>
            </Link>


            <nav className="flex flex-col gap-1.5 mt-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.key
                const IconComponent = item.icon
                return (
                  <Link key={item.key} to={item.key}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                        ? isDarkMode
                          ? 'bg-white/10 text-white'
                          : 'bg-slate-100 text-slate-900'
                        : isDarkMode
                          ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >

                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#00f0ff] to-[#a855f7] shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                        />
                      )}
                      <motion.div whileHover={{ scale: 1.15, rotate: 5 }}>
                        <IconComponent size={22} className={isActive ? 'text-[#00f0ff]' : ''} />
                      </motion.div>
                      <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>
          </div>


          <div className="flex flex-col gap-4">


            {authenticated && (
              <Tooltip title="Logout" placement="right">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/30"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </aside>


      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed left-0 top-0 w-64 h-full z-50 lg:hidden overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-b from-[#1a0a2e] via-[#12121f] to-[#0d1b3e]'
                  : 'bg-white'
              }`}
            >
              {/* Removed FloatingGamePieces for performance */}

              <div className="p-4 relative z-10 h-full flex flex-col">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col gap-4 mt-12">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.key
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.key}
                        to={item.key}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive
                          ? isDarkMode
                            ? 'bg-white/10 text-white'
                            : 'bg-slate-100 text-slate-900'
                          : isDarkMode
                            ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <IconComponent size={22} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>


      <main className="relative flex flex-1 flex-col min-w-0 lg:ml-64 transition-colors overflow-y-auto h-screen">

        <div className="fixed inset-0 lg:left-64 z-0 pointer-events-none">
          <GamingParticles isDarkMode={isDarkMode} />
        </div>


        <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-gray-200/10 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 sm:px-6">

          <div className="flex items-center gap-4 lg:hidden mr-auto">
            <button onClick={() => setMobileMenuOpen(true)} className="text-slate-700 dark:text-white">
              <Menu size={24} />
            </button>
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              {menuItems.find((m) => m.key === location.pathname)?.label || 'Home'}
            </span>
          </div>


          <div className="flex items-center gap-3">
            {authenticated ? (
              <>


                <div className="flex items-center gap-1">
                  <Tooltip title="Messages">
                    <Link
                      to="/messages"
                      className="relative flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <MessageSquare size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                          <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-[#00f0ff] text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                </div>


                <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    onClick={toggleTheme}
                    className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <AnimatePresence mode="wait">
                      {isDarkMode ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sun size={20} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Tooltip>

                <div className="h-8 w-px bg-gray-200 dark:bg-slate-600" />


                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                    <Avatar
                      size={36}
                      src={user?.avatar_url}
                      className="ring-2 ring-white dark:ring-slate-700"
                      style={!user?.avatar_url ? { background: 'linear-gradient(135deg, #00f0ff, #a855f7)' } : {}}
                    >
                      {!user?.avatar_url && (user?.username?.[0]?.toUpperCase() || 'U')}
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Level 12</p>
                    </div>
                    <ChevronDown size={16} className="hidden sm:block text-gray-500" />
                  </button>
                </Dropdown>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button type="default" className="h-9 rounded-lg font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    type="primary"
                    className="h-9 rounded-lg font-medium"
                    style={{ background: 'linear-gradient(135deg, #00f0ff, #a855f7)', border: 'none' }}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>


        <div className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
