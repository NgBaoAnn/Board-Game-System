import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Divider, Form, Input, Typography, message } from 'antd'
import { Chrome, Facebook, Gamepad2, Lock, Mail, Moon, Sun } from 'lucide-react'
import { useAuth, useTheme } from '@/context'

const heroDots = [
  { x: 40, y: 24, color: '#ef4444' },
  { x: 50, y: 20, color: '#ef4444' },
  { x: 60, y: 24, color: '#ef4444' },
  { x: 70, y: 34, color: '#ef4444' },
  { x: 60, y: 42, color: '#ef4444' },
  { x: 50, y: 48, color: '#ef4444' },
  { x: 40, y: 54, color: '#ef4444' },
  { x: 55, y: 32, color: '#0ea5e9' },
  { x: 65, y: 42, color: '#0ea5e9' },
  { x: 55, y: 52, color: '#0ea5e9' },
  { x: 45, y: 62, color: '#0ea5e9' },
  { x: 52, y: 60, color: '#22c55e' },
  { x: 62, y: 58, color: '#22c55e' },
  { x: 72, y: 56, color: '#22c55e' },
  { x: 32, y: 38, color: '#6366f1' },
  { x: 32, y: 50, color: '#6366f1' },
  { x: 32, y: 62, color: '#6366f1' },
  { x: 26, y: 30, color: '#f97316' },
  { x: 22, y: 44, color: '#f97316' },
]

export default function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { login, loading, isAuthenticated } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  const onFinish = async (values) => {
    const result = await login(values.email, values.password)

    if (result.success) {
      message.success('Login successful!')
      navigate('/')
    } else {
      message.error(result.error || 'Login failed!')
    }
  }

  return (
    <div className={! isDarkMode ? "min-h-screen flex items-center justify-center login-page px-4 py-10 relative overflow-hidden"
      : "min-h-screen flex items-center justify-center bg-[#3d3b3c] px-4 py-10 relative overflow-hidden"}>
      {/* Background Pattern Dots */}
      <div
          className={! isDarkMode ? " absolute inset-0 pointer-events-none opacity-55 bg-[radial-gradient(circle,_#d1d5db_1.5px,_transparent_1.5px)] [background-size:25px_25px]"
             : " absolute inset-0 pointer-events-none opacity-100 bg-[radial-gradient(circle,_#4b5563_1.5px,_transparent_1.5px)] [background-size:25px_25px]"
            }
      />

      <div className={! isDarkMode ? "relative max-w-5xl w-full bg-white/95 shadow-2xl rounded-3xl overflow-hidden border border-neutral-200 glass-card backdrop-blur-sm"
        : "relative max-w-5xl w-full bg-[#b7b4b5] shadow-2xl rounded-3xl overflow-hidden border border-neutral-200 glass-card backdrop-blur-sm"}>

        <div className="relative grid md:grid-cols-2">
          <div className={! isDarkMode ? "bg-white px-8 py-10 md:px-12 md:py-12"
            : "bg-[#70917f] px-8 py-10 md:px-12 md:py-12"}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                <Gamepad2 size={22} />
              </div>
              <Typography.Title level={4} className="!mb-0">
                GameGrid
              </Typography.Title>
            </div>

            <Typography.Title level={2} className="!mb-1">
              Welcome back!
            </Typography.Title>
            <Typography.Text className="text-gray-500">
              Enter your credentials to access your games.
            </Typography.Text>

            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              className="mt-8 space-y-3"
              requiredMark={false}
            >
              <Form.Item
                label={
                  <div className='text-sm font-medium text-gray-700'>
                    Email
                  </div>
                }
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  prefix={<Mail size={16} className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={null}
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Password
                  </span>

                  <button
                    type="button"
                    className="text-red-500 text-xs font-semibold hover:underline"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </button>
                </div>

                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  prefix={<Lock size={16} className="text-gray-400" />}
                />
              </Form.Item>


              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="bg-red-500 hover:!bg-red-600 border-none h-11 text-sm font-semibold"
              >
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-red-500 font-semibold">
                  Create an account
                </Link>
              </div>
            </Form>

            <Divider plain className="!text-xs !text-gray-400">
              Or continue with
            </Divider>

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="large"
                className="!h-11 flex items-center justify-center gap-2 border border-gray-200 text-gray-700"
                icon={<img src="/google.png" alt="Google" className="w-5 h-5" />}
              >
                Google
              </Button>
              <Button
                size="large"
                className="!h-11 flex items-center justify-center gap-2 border border-gray-200 text-gray-700"
                icon={<img src="/facebook.png" alt="Facebook" className="w-5 h-5" />}
              >
                Facebook
              </Button>
            </div>
          </div>

          <div className="relative hero-grid bg-gradient-to-br from-purple-50/50 to-blue-50/50 md:bg-gradient-to-br md:from-purple-50/30 md:to-blue-50/30 flex flex-col items-center justify-center px-6 py-12 md:px-10">
            <div className="absolute top-4 right-4">
              <Button
                shape="circle"
                type="text"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                className="shadow-sm"
              />
            </div>

            <div className="relative w-56 h-64 mb-8">
              {heroDots.map((dot, idx) => (
                <span
                  key={`${dot.x}-${dot.y}-${idx}`}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    top: `${dot.y}%`,
                    left: `${dot.x}%`,
                    backgroundColor: dot.color,
                    boxShadow: `0 6px 14px ${dot.color}33`,
                  }}
                />
              ))}
            </div>

            <div className="text-center max-w-sm">
              <Typography.Title level={4} className="!mb-2">
                Ready for your next move?
              </Typography.Title>
              <Typography.Text className="text-gray-600">
                Join thousands of players in epic strategy battles. Connect the dots and claim victory.
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
