import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { Gamepad2, Mail, Lock, User, KeyRound, Star, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Joi from 'joi'
import AuthLayout from '@/components/layout/AuthLayout'
import SocialLoginButtons from '@/components/common/SocialLoginButtons'
import PasswordStrength from '@/components/common/PasswordStrength'
import FloatingGamePieces from '@/components/common/FloatingGamePieces'
import AnimatedHeroBackground from '@/components/common/AnimatedHeroBackground'
import TypewriterText from '@/components/common/TypewriterText'
import { joiValidator, commonSchemas } from '@/utils/validation'
import authApi from '@/api/api-auth'

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

export default function RegisterPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formState, setFormState] = useState('idle');
  const [password, setPassword] = useState('');
  const loading = formState === 'loading';

  const onFinish = async (values) => {
    setFormState('loading')
    try {
      const result = await authApi.register(values.email, values.password, values.username)
      if (result.success) {
        navigate('/login');
        message.success(t('auth.register.success'))
      } else {
        setFormState('error')
        message.error(result.error || t('auth.register.error'))
      }
    } catch (error) {
      setFormState('error')
      message.error(error.message || t('auth.register.error'))
    }
  }

  const rightContent = (
    <AnimatedHeroBackground>
      <FloatingGamePieces count={20} />
      <div className="absolute inset-0 flex flex-col justify-between p-12 lg:p-16 text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <div className="bg-white/10 backdrop-blur-md border border-[#00f0ff]/30 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg shadow-[#00f0ff]/10">
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
          <span className="inline-block py-1 px-3 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-bold mb-4 uppercase tracking-wider border border-[#00f0ff]/30">
            🎮 Featured Game
          </span>
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-white via-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
            Strategy Awaits
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            <TypewriterText
              text="Build settlements, trade resources, and pave your way to victory. Join the ultimate community for board game enthusiasts."
              delay={0.8}
              speed={50}
            />
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-[#00f0ff]/30 rounded-lg px-4 py-2">
              <Star size={16} className="text-yellow-400" />
              <span className="text-white text-sm font-medium">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-[#a855f7]/30 rounded-lg px-4 py-2">
              <Trophy size={16} className="text-[#a855f7]" />
              <span className="text-white text-sm font-medium">Daily Tournaments</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedHeroBackground>
  )

  return (
    <AuthLayout rightContent={rightContent}>
      <motion.div variants={formVariants} animate={formState} className="space-y-0">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="bg-gradient-to-br from-[#00f0ff] to-[#a855f7] w-14 h-14 rounded-xl flex items-center justify-center text-white animate-neon-glow"
          >
            <Gamepad2 size={28} />
          </motion.div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t('brand.name')}
            </span>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-widest">
              {t('brand.tagline')}
            </p>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t('auth.register.title')}
          </h1>
        </motion.div>


        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}

        >
          <Form.Item
            name="username"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.register.username')}</span>
            }
            rules={[joiValidator(registerSchema.extract('username'))]}
          >
            <Input
              size="large"
              prefix={<User className="text-gray-400" size={18} />}
              placeholder={t('auth.register.usernamePlaceholder')}
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.email')}
              </span>
            }
            rules={[joiValidator(registerSchema.extract('email'))]}
          >
            <Input
              size="large"
              prefix={<Mail className="text-gray-400" size={18} />}
              placeholder={t('auth.register.emailPlaceholder')}
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.register.password')}</span>
            }
            rules={[joiValidator(registerSchema.extract('password'))]}
          >
            <Input.Password
              size="large"
              prefix={<Lock className="text-gray-400" size={18} />}
              placeholder={t('auth.register.passwordPlaceholder')}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>
          <PasswordStrength password={password} />

          <Form.Item
            name="confirmPassword"
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.confirmPassword')}
              </span>
            }
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('validation.password.mismatch')))
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<KeyRound className="text-gray-400" size={18} />}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white input-focus-glow"
            />
          </Form.Item>



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
                    {t('auth.register.submit')}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Form.Item>
        </Form>






      </motion.div>
    </AuthLayout>
  )
}
