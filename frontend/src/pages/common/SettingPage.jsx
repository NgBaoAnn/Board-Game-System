import { useState } from 'react'
import { Form, Input, Switch, Select, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Palette,
  Gamepad2,
  Volume2,
  Grid3X3,
  Shield,
  Lock,
  LogOut,
} from 'lucide-react'
import Joi from 'joi'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/store/useAuth'
import authApi from '@/api/api-auth'
import { joiValidator, commonSchemas } from '@/utils/validation'

// Validation schema
const passwordSchema = Joi.object({
  newPassword: commonSchemas.password,
})

// Reusable Section Component
function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <Icon className="mr-2 text-[#1d7af2]" size={20} />
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

// Theme Card Component
function ThemeCard({ mode, isSelected, onClick, icon: Icon, title, subtitle }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-lg border-2 p-4 flex items-center space-x-3 transition-all ${
        isSelected
          ? 'border-[#1d7af2] bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
      }`}
    >
      <div
        className={`p-2 rounded-full shadow-sm ${
          isSelected
            ? 'bg-white dark:bg-gray-800 text-yellow-500'
            : 'bg-gray-100 dark:bg-gray-700 text-blue-400'
        }`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <div
        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
          isSelected
            ? 'border-[#1d7af2] bg-[#1d7af2]'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {isSelected && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

// Setting Row Component
function SettingRow({ icon: Icon, iconBg, iconColor, title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className={`h-10 w-10 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function SettingPage() {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const { setUser, setAuthenticated } = useAuth()
  const [form] = Form.useForm()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [boardSize, setBoardSize] = useState('8x8')
  const [loading, setLoading] = useState(false)

  const handlePasswordUpdate = async (values) => {
    setLoading(true)
    try {
      // TODO: Implement password update API
      message.success('Password updated successfully!')
      form.resetFields()
    } catch (error) {
      message.error(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      setAuthenticated(false)
      localStorage.removeItem('access_token')
      message.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      message.error('Logout failed')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Manage your account preferences and game configurations.
        </p>
      </div>

      {/* Theme Section */}
      <SettingsSection
        icon={Palette}
        title="Theme"
        description="Customize the look and feel of the dashboard."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ThemeCard
            mode="light"
            isSelected={!isDarkMode}
            onClick={() => isDarkMode && toggleTheme()}
            icon={Sun}
            title="Light Mode"
            subtitle="Default theme"
          />
          <ThemeCard
            mode="dark"
            isSelected={isDarkMode}
            onClick={() => !isDarkMode && toggleTheme()}
            icon={Moon}
            title="Dark Mode"
            subtitle="Easy on the eyes"
          />
        </div>
      </SettingsSection>

      {/* Game Settings Section */}
      <SettingsSection
        icon={Gamepad2}
        title="Game Settings"
        description="Adjust your gameplay experience."
      >
        <div className="space-y-6">
          <SettingRow
            icon={Volume2}
            iconBg="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-[#1d7af2]"
            title="Sound Effects"
            description="Play sounds during game actions and notifications"
          >
            <Switch
              checked={soundEnabled}
              onChange={setSoundEnabled}
              className={soundEnabled ? 'bg-[#1d7af2]' : ''}
            />
          </SettingRow>

          <div className="h-px bg-gray-100 dark:bg-gray-700" />

          <SettingRow
            icon={Grid3X3}
            iconBg="bg-purple-50 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
            title="Default Board Size"
            description="Preferred grid dimensions for new games"
          >
            <Select
              value={boardSize}
              onChange={setBoardSize}
              className="min-w-[180px]"
              options={[
                { value: '5x5', label: 'Small (5x5)' },
                { value: '8x8', label: 'Standard (8x8)' },
                { value: '15x15', label: 'Large (15x15)' },
                { value: '19x19', label: 'Extra Large (19x19)' },
              ]}
            />
          </SettingRow>
        </div>
      </SettingsSection>

      {/* Account & Security Section */}
      <SettingsSection
        icon={Shield}
        title="Account & Security"
        description="Manage your login details."
      >
        <div className="space-y-6">
          <Form form={form} layout="vertical" onFinish={handlePasswordUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label={<span className="font-semibold text-gray-900 dark:text-white">Current Password</span>}>
                <Input.Password
                  disabled
                  value="••••••••••••"
                  prefix={<Lock className="text-gray-400" size={16} />}
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label={<span className="font-semibold text-gray-900 dark:text-white">New Password</span>}
                rules={[joiValidator(passwordSchema.extract('newPassword'))]}
              >
                <div className="flex space-x-2">
                  <Input.Password
                    placeholder="••••••••"
                    className="flex-1"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1d7af2] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70"
                  >
                    Update
                  </button>
                </div>
              </Form.Item>
            </div>
          </Form>

          <div className="h-px bg-gray-100 dark:bg-gray-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Sign out</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                End your current session securely
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-5 py-2.5 bg-white dark:bg-transparent text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Footer */}
      <footer className="pt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2024 BoardGameHub. Strategy Awaits.</p>
      </footer>
    </div>
  )
}
