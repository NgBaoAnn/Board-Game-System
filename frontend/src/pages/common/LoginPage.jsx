import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, message } from 'antd'
import { Gamepad2, Mail, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Joi from 'joi'
import AuthLayout from '@/components/layout/AuthLayout'
import SocialLoginButtons from '@/components/common/SocialLoginButtons'
import FloatingGamePieces from '@/components/common/FloatingGamePieces'
import AnimatedHeroBackground from '@/components/common/AnimatedHeroBackground'
import TypewriterText from '@/components/common/TypewriterText'
import { joiValidator, commonSchemas } from '@/utils/validation'
import authApi from '@/api/api-auth'
import { useAuth } from '@/store/useAuth'

const loginSchema = Joi.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
})

const formVariants = {
  idle: { scale: 1 },
  loading: { opacity: 0.7 },
  error: { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } },
  success: { scale: 1.02, opacity: 0 },
}

const buttonVariants = {
  idle: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -2,
    boxShadow: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)' 
  },
  tap: { 
    scale: 0.98, 
    y: 2,
    boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' 
  },
}

export default function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { setUser, setAuthenticated, setAppLoading } = useAuth()
  const [formState, setFormState] = useState('idle') // idle | loading | error | success
  const loading = formState === 'loading'

  const onFinish = async (values) => {
    setFormState('loading')
    try {
      const result = await authApi.login(values.email, values.password)
      if (result.status === 200) {
        localStorage.setItem('access_token', result.data.access_token)
        setUser(result.data.user)
        setAuthenticated(true)
        setAppLoading(false)
        setFormState('success')
        message.success('Login successful!')
        setTimeout(() => navigate('/boardgame'), 300)
      } else {
        setAppLoading(false)
        setFormState('error')
        message.error(result.error || 'Login failed!')
        setTimeout(() => setFormState('idle'), 400)
      }
    } catch (error) {
      setFormState('error')
      message.error(error.message || 'Login failed!')
      setTimeout(() => setFormState('idle'), 400)
    }
  }

  const rightContent = (
    <AnimatedHeroBackground>
      
      <FloatingGamePieces count={20} />

      
      <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
        
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-xs font-medium border border-[#00f0ff]/30 shadow-lg shadow-[#00f0ff]/10"
          >
            <span className="text-[#00f0ff] mr-1">⚡</span> Top Rated Strategy Platform
          </motion.div>
        </div>

        
        <div className="space-y-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <img
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-[#00f0ff]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADRY_n1xchUMFKp_tm-tC82w-0cRvV-mSE_Hmi62A4x38PwBnfr6AaRaqfdNyGvRpDFOPnTm4Qxj2XZePwBEXhcXdzCAikpEe8nwvQwlu9tMjx6qRPC1YwLRm3HrfJqdESMRarUWVsD9SYPUrPcqHNGSQRfn2N_lTIPX0jMX40MdTHtuFB7TayIRC0BKcascq0gdyEoLvbHsmCdQsvA4aGgQ4GS3bBv1HlkQL7tPvSDHN162njVDZUgV1H83HdGwHrw1znwd60np4"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a0a2e]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Marcus Chen</h3>
                <p className="text-xs text-[#00f0ff]">Chess Grandmaster</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm italic leading-relaxed">
              &quot;<TypewriterText 
                text="BoardGameHub has completely transformed how I practice. The matchmaking is instant and the community is incredibly welcoming."
                delay={1}
                speed={40}
              />&quot;
            </p>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
              Join the Community
            </h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Connect with over <span className="text-[#00f0ff] font-semibold">10,000+</span> players worldwide. 
              Challenge friends, join tournaments, and master your favorite games.
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedHeroBackground>
  )

  return (
    <AuthLayout rightContent={rightContent}>
      <motion.div
        variants={formVariants}
        animate={formState}
        className="space-y-0"
      >
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-4 mb-10"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="bg-gradient-to-br from-[#00f0ff] to-[#a855f7] w-14 h-14 rounded-xl flex items-center justify-center text-white animate-neon-glow"
          >
            <Gamepad2 size={28} />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              BoardGameHub
            </h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-widest">
              Strategy Awaits
            </p>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Please enter your details to sign in.
          </p>
        </motion.div>

        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-2"
        >
          <Form.Item
            name="email"
            label={
              <span className="block text-sm font-semibold text-slate-900 dark:text-gray-200">
                Email Address
              </span>
            }
            rules={[joiValidator(loginSchema.extract('email'))]}
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
              <span className="block text-sm font-semibold text-slate-900 dark:text-gray-200">
                Password
              </span>
            }
            rules={[joiValidator(loginSchema.extract('password'))]}
          >
            <Input.Password
              size="large"
              prefix={<Lock className="text-gray-400" size={18} />}
              placeholder="••••••••"
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>

          <div className="flex items-center justify-between text-sm mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-slate-500 dark:text-gray-400">Remember me</Checkbox>
            </Form.Item>
            <Link
              to="/forgot-password"
              className="font-medium text-[#1d7af2] hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] border-none cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
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
                    Sign in
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Form.Item>
        </Form>

        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-[#1e293b] text-slate-500 dark:text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        
        <SocialLoginButtons
          onGoogleClick={() => message.info('Google login clicked')}
          onFacebookClick={() => message.info('Facebook login clicked')}
        />

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-slate-500 dark:text-gray-400"
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#1d7af2] hover:text-blue-700 transition-colors"
          >
            Create free account
          </Link>
        </motion.div>
      </motion.div>
    </AuthLayout>
  )
}
