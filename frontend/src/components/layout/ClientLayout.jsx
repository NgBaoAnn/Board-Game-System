import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Avatar, message, Input } from 'antd'
import {
  Gamepad2,
  Home,
  Users,
  Trophy,
  Settings,
  Bell,
  MessageSquare,
  LogOut,
  User,
  ChevronDown,
  Search,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/store/useAuth'
import authApi from '@/api/api-auth'
import { GameSessionProvider, useGameSession } from '@/context/GameSessionProvider'

const menuItems = [
  { key: '/', icon: Home, label: 'Home' },
  { key: '/boardgame', icon: Gamepad2, label: 'Board Game' },
  { key: '/community', icon: Users, label: 'Community' },
  { key: '/rankings', icon: Trophy, label: 'Rankings' },
  { key: '/settings', icon: Settings, label: 'Settings' },
]

// Protected Link component that checks game session before navigating
function ProtectedNavLink({ to, children, className }) {
  const { requestNavigation } = useGameSession()
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    const allowed = requestNavigation(to, () => navigate(to))
    if (allowed) {
      navigate(to)
    }
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

function ClientLayoutContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, authenticated, setUser, setAuthenticated } = useAuth();
  const { requestNavigation } = useGameSession();


  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem("access_token");
      message.success('Logged out successfully')
      navigate('/')
    } catch (e) {
      message.error(e.message || 'Logout failed')
    }
  }

  // Protected navigation handler
  const handleProtectedNavigate = (path) => {
    const allowed = requestNavigation(path, () => navigate(path))
    if (allowed) {
      navigate(path)
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <User size={16} />,
      onClick: () => handleProtectedNavigate('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      onClick: () => handleProtectedNavigate('/settings'),
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
    <div className="min-h-screen bg-[#f5f7f8] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-[#f0f2f5] bg-white fixed h-full z-40">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 px-2 py-2">
              <div className="flex items-center justify-center size-10 rounded-xl bg-[#0d7ff2] text-white">
                <Gamepad2 size={24} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold leading-tight tracking-tight text-[#111418]">BoardGameHub</h1>
                <p className="text-xs font-normal text-[#60758a]">Strategy Awaits</p>
              </div>
            </Link>

            {/* Navigation - Using ProtectedNavLink */}
            <nav className="flex flex-col gap-2 mt-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.key
                const IconComponent = item.icon
                return (
                  <ProtectedNavLink
                    key={item.key}
                    to={item.key}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? 'bg-[#eff6ff] text-[#0d7ff2]'
                      : 'text-[#60758a] hover:bg-gray-100 hover:text-[#111418]'
                      }`}
                  >
                    <IconComponent size={24} />
                    <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
                  </ProtectedNavLink>
                )
              })}
            </nav>
          </div>

          {/* Logout Button */}
          {authenticated && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] hover:bg-red-600"
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex flex-1 flex-col min-w-0 lg:ml-64 bg-[#f5f7f8] transition-colors">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#f0f2f5] bg-white/90 px-6 backdrop-blur-md">
          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-[#111418]">
              <Menu size={24} />
            </button>
            <span className="text-lg font-bold text-[#111418]">Home</span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden flex-1 max-w-md lg:block">
            <Input
              prefix={<Search size={18} className="text-[#60758a]" />}
              placeholder="Search games, players..."
              className="h-10 rounded-lg border-none bg-[#f0f2f5] text-sm"
              style={{ backgroundColor: '#f0f2f5' }}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {authenticated ? (
              <>
                {/* Notification icons */}
                <div className="flex items-center gap-2">
                  <button className="flex size-10 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111418] hover:bg-gray-200 transition-colors">
                    <Bell size={20} />
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111418] hover:bg-gray-200 transition-colors">
                    <MessageSquare size={20} />
                  </button>
                </div>

                <div className="h-8 w-px bg-[#f0f2f5]" />

                {/* User dropdown */}
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <button className="flex items-center gap-3 rounded-full pl-1 pr-2 hover:bg-gray-50 cursor-pointer">
                    <Avatar
                      size={36}
                      className="ring-2 ring-white"
                      style={{ backgroundColor: '#0d7ff2' }}
                    >
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-bold text-[#111418] leading-tight">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs text-[#60758a]">Level 12</p>
                    </div>
                    <ChevronDown size={16} className="hidden sm:block text-[#60758a]" />
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
                  <Button type="primary" className="h-9 rounded-lg font-medium" style={{ backgroundColor: '#0d7ff2' }}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

// Wrap with GameSessionProvider
export default function ClientLayout() {
  return (
    <GameSessionProvider>
      <ClientLayoutContent />
    </GameSessionProvider>
  )
}
