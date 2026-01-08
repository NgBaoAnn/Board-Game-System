import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, message } from 'antd'
import { Gamepad2, Mail, Lock, User, KeyRound, Star, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Joi from 'joi'
import { useAuth } from '@/context'
import AuthLayout from '@/components/layout/AuthLayout'
import SocialLoginButtons from '@/components/common/SocialLoginButtons'
import PasswordStrength from '@/components/common/PasswordStrength'
import { joiValidator, commonSchemas } from '@/utils/validation'

// Validation schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 30 characters',
    'string.empty': 'Username is required',
  }),
  email: commonSchemas.email,
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Please confirm your password',
  }),
  terms: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the terms',
  }),
})

// Animation variants
const formVariants = {
  idle: { scale: 1 },
  loading: { opacity: 0.7 },
  error: { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } },
  success: { scale: 1.02, opacity: 0 },
}

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03, boxShadow: '0 10px 40px -10px rgba(29, 122, 242, 0.5)' },
  tap: { scale: 0.97 },
}

export default function RegisterPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [formState, setFormState] = useState('idle')
  const [password, setPassword] = useState('')

  const onFinish = async (values) => {
    setFormState('loading')
    try {
      const result = await register(values.username, values.email, values.password)
      if (result.success) {
        setFormState('success')
        message.success('Registration successful!')
        setTimeout(() => navigate('/login'), 300)
      } else {
        setFormState('error')
        message.error(result.error || 'Registration failed!')
        setTimeout(() => setFormState('idle'), 400)
      }
    } catch (error) {
      setFormState('error')
      message.error(error.message || 'Registration failed!')
      setTimeout(() => setFormState('idle'), 400)
    }
  }

  const rightContent = (
    <>
      <img
        alt="Board game pieces"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHqOVuVYlEVvxqIDVfnl5eCvP5HXQ7u_vhXhXk8AQ0GisbKjyCEHk1KD4rWcZYGWHxhVFCC-QbFmyoYpHQgS3RSyboVb64jMedM8rCJ26JAm86COyUgQU6yzXcp7zRqfFhJ6lrm91sPoKiGLjeCH4UAOeyd_hTsQjkCx7jTeQ1GB478Vzp_rtUN1zd7HJC5wy29ahZXkCW_dV5Vu1ekjfGLKIZSMA3xy8XlK-sM9Sdj4SlulfUMU134_tCETxrA7ecxyYEkQ5HyGs"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-transparent to-black/60" />
      <div className="absolute inset-0 flex flex-col justify-between p-12 lg:p-16 text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium tracking-wide">12,403 Players Online</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-lg"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-4 uppercase tracking-wider">
            Featured Game
          </span>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            Strategy Awaits: <br />
            Master Catan Today
          </h2>
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            Build settlements, trade resources, and pave your way to victory. Join the ultimate
            community for board game enthusiasts.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
              <Star size={16} className="text-yellow-400" />
              <span className="text-white text-sm font-medium">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
              <Trophy size={16} className="text-blue-400" />
              <span className="text-white text-sm font-medium">Daily Tournaments</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )

  return (
    <AuthLayout rightContent={rightContent}>
      <motion.div variants={formVariants} animate={formState} className="space-y-0">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            className="bg-[#1d7af2] w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 text-white"
          >
            <Gamepad2 size={24} />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            BoardGameHub
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Create your account
          </h1>
        </motion.div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          
        >
          <Form.Item
            name="username"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</span>
            }
            rules={[joiValidator(registerSchema.extract('username'))]}
          >
            <Input
              size="large"
              prefix={<User className="text-gray-400" size={18} />}
              placeholder="StrategyMaster99"
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </span>
            }
            rules={[joiValidator(registerSchema.extract('email'))]}
          >
            <Input
              size="large"
              prefix={<Mail className="text-gray-400" size={18} />}
              placeholder="you@example.com"
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
            }
            rules={[joiValidator(registerSchema.extract('password'))]}
          >
            <Input.Password
              size="large"
              prefix={<Lock className="text-gray-400" size={18} />}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>
          <PasswordStrength password={password} />

          <Form.Item
            name="confirmPassword"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </span>
            }
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match'))
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<KeyRound className="text-gray-400" size={18} />}
              placeholder="••••••••"
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>

          <Form.Item
            name="terms"
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
            <Checkbox className="text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-[#1d7af2] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#1d7af2] hover:underline">
                Privacy Policy
              </a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-bold bg-[#1d7af2] text-white shadow-lg shadow-blue-500/30 border-none cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 360 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ rotate: { repeat: Infinity, duration: 1, ease: 'linear' } }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Create Account
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <SocialLoginButtons
          onGoogleClick={() => message.info('Google signup clicked')}
          onFacebookClick={() => message.info('Facebook signup clicked')}
        />

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#1d7af2] hover:text-blue-600 transition-colors"
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  )
}
