import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Avatar, message } from 'antd'
import {
  Gamepad2,
  Home,
  Compass,
  Users,
  Trophy,
  Settings,
  Plus,
  Bell,
  MessageSquare,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/context'

const menuItems = [
  { key: '/', icon: Home, label: 'Home' },
  { key: '/boardgame', icon: Gamepad2, label: 'Board Game' },
  { key: '/browse', icon: Compass, label: 'Browse Games' },
  { key: '/community', icon: Users, label: 'Community' },
  { key: '/rankings', icon: Trophy, label: 'Rankings' },
  { key: '/settings', icon: Settings, label: 'Settings' },
]

export default function ClientLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      message.success('Logged out successfully')
      navigate('/')
    } catch (e) {
      message.error(e.message || 'Logout failed')
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
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-100 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <Gamepad2 size={22} />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-slate-800 text-base">BoardGameHub</h1>
              <p className="text-xs text-slate-400">Strategy Awaits</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.key
              const IconComponent = item.icon
              return (
                <li key={item.key}>
                  <Link
                    to={item.key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <IconComponent size={20} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>


      </aside>

      {/* Main container */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-end gap-4 sticky top-0 z-30">
          {isAuthenticated ? (
            <>
              {/* Notification icons */}
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                <Bell size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                <MessageSquare size={20} />
              </button>

              {/* User dropdown */}
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                <button className="flex items-center gap-2 pl-4 border-l border-slate-100 cursor-pointer">
                  <Avatar
                    size={36}
                    className="bg-gradient-to-tr from-blue-500 to-indigo-500"
                  >
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-slate-400">Level 12</p>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
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
                <Button type="primary" className="h-9 rounded-lg font-medium" style={{ backgroundColor: '#3b82f6' }}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
