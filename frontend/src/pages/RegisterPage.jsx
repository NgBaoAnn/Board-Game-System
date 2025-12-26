import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { Grid3x3, Mail, Moon, Sun, User, Lock } from 'lucide-react'

const heroDots = [
    { x: 40, y: 18, color: '#ec4899', size: 12 },
    { x: 46, y: 24, color: '#ec4899', size: 12 },
    { x: 52, y: 18, color: '#ec4899', size: 12 },
    { x: 34, y: 30, color: '#ec4899', size: 10 },
    { x: 40, y: 36, color: '#f97316', size: 12 },
    { x: 46, y: 42, color: '#facc15', size: 12 },
    { x: 52, y: 48, color: '#facc15', size: 12 },
    { x: 58, y: 42, color: '#3b82f6', size: 12 },
    { x: 64, y: 36, color: '#a855f7', size: 12 },
    { x: 70, y: 30, color: '#ec4899', size: 10 },
    { x: 34, y: 48, color: '#ec4899', size: 10 },
    { x: 40, y: 54, color: '#10b981', size: 12 },
    { x: 46, y: 60, color: '#06b6d4', size: 12 },
    { x: 52, y: 66, color: '#06b6d4', size: 12 },
    { x: 58, y: 60, color: '#3b82f6', size: 12 },
    { x: 64, y: 54, color: '#ec4899', size: 10 },
    { x: 40, y: 72, color: '#d1d5db', size: 8 },
    { x: 46, y: 78, color: '#ec4899', size: 12 },
    { x: 52, y: 84, color: '#a855f7', size: 12 },
    { x: 58, y: 78, color: '#ec4899', size: 12 },
    { x: 64, y: 72, color: '#d1d5db', size: 8 },
    { x: 52, y: 90, color: '#ec4899', size: 12 },
    { x: 30, y: 66, color: '#d1d5db', size: 8 },
    { x: 70, y: 48, color: '#d1d5db', size: 8 },
    { x: 74, y: 66, color: '#d1d5db', size: 8 },
]

export default function RegisterPage() {
    const [form] = Form.useForm()
    const [darkMode, setDarkMode] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
        document.body.classList.toggle('dark', darkMode)
    }, [darkMode])

    const toggleTheme = () => setDarkMode((prev) => !prev)

    const onFinish = (values) => {
        console.log('Register values:', values)
        // Handle registration logic here
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center login-page px-4 py-10 relative overflow-hidden">
            {/* Background Pattern Dots */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.4,
                }}
            />

            {/* Background Decorative Colored Dots */}
            <div className="absolute top-8 left-8 w-12 h-12 bg-pink-500 rounded-full blur-md opacity-60" />
            <div className="absolute top-1/4 right-12 w-16 h-16 bg-orange-500 rounded-full blur-md opacity-60" />
            <div className="absolute bottom-1/4 left-16 w-14 h-14 bg-green-500 rounded-full blur-md opacity-60" />
            <div className="absolute bottom-12 right-1/4 w-20 h-20 bg-blue-500 rounded-full blur-lg opacity-60" />

            <div className="relative max-w-5xl w-full bg-white/95 shadow-2xl rounded-3xl overflow-hidden border border-neutral-200 glass-card backdrop-blur-sm">
                <div className="relative grid md:grid-cols-2">
                    {/* Left Side - Hero with Dots */}
                    <div className="relative hero-grid bg-gradient-to-br from-purple-50/30 to-blue-50/30 flex flex-col items-center justify-center px-6 py-12 md:px-10">
                        <div className="relative w-64 h-80 mb-8">
                            {heroDots.map((dot, idx) => (
                                <span
                                    key={`${dot.x}-${dot.y}-${idx}`}
                                    className="absolute rounded-full"
                                    style={{
                                        top: `${dot.y}%`,
                                        left: `${dot.x}%`,
                                        width: `${dot.size}px`,
                                        height: `${dot.size}px`,
                                        backgroundColor: dot.color,
                                        boxShadow: `0 4px 12px ${dot.color}40`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="text-center max-w-sm">
                            <Typography.Title level={3} className="!mb-2">
                                Join the Game
                            </Typography.Title>
                            <Typography.Text className="text-gray-600">
                                Connect with friends and master your strategy.
                            </Typography.Text>
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
                    <div className="bg-white px-8 py-10 md:px-12 md:py-12 relative">
                        {/* Dark Mode Toggle */}
                        <div className="absolute top-6 right-6">
                            <Button
                                shape="circle"
                                type="text"
                                aria-label="Toggle theme"
                                onClick={toggleTheme}
                                icon={darkMode ? <Sun size={18} /> : <Moon size={18} />}
                                className="shadow-sm"
                            />
                        </div>

                        {/* Logo Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-lg">
                                <Grid3x3 size={28} />
                            </div>
                        </div>

                        <Typography.Title level={2} className="!mb-1 text-center">
                            Create Account
                        </Typography.Title>
                        <Typography.Text className="text-gray-500 block text-center mb-8">
                            Join our community of board game enthusiasts.
                        </Typography.Text>

                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            className="space-y-2"
                            requiredMark={false}
                        >
                            {/* Username */}
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    { required: true, message: 'Please input your username!' },
                                    { min: 3, message: 'Username must be at least 3 characters!' },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="johndoe123"
                                    prefix={<User size={16} className="text-gray-400" />}
                                />
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                label="Email address"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="you@example.com"
                                    prefix={<Mail size={16} className="text-gray-400" />}
                                />
                            </Form.Item>

                            {/* Password */}
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: 'Please input your password!' },
                                    { min: 6, message: 'Password must be at least 6 characters!' },
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="••••••••"
                                    prefix={<Lock size={16} className="text-gray-400" />}
                                />
                            </Form.Item>

                            {/* Confirm Password */}
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(new Error('Passwords do not match!'))
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="••••••••"
                                    prefix={<Lock size={16} className="text-gray-400" />}
                                />
                            </Form.Item>

                            {/* Terms Checkbox */}
                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('You must agree to the terms')),
                                    },
                                ]}
                            >
                                <Checkbox className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-pink-500 hover:text-pink-600 font-medium">
                                        Terms
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-pink-500 hover:text-pink-600 font-medium">
                                        Privacy Policy
                                    </Link>
                                </Checkbox>
                            </Form.Item>

                            {/* Create Account Button */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:!from-pink-600 hover:!to-pink-700 border-none h-12 text-base font-semibold mt-2"
                                >
                                    Create Account
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* Login Link */}
                        <div className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-pink-500 hover:text-pink-600 font-semibold">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
