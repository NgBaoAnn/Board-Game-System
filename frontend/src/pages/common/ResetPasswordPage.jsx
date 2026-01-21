import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, message } from 'antd'
import { Gamepad2, Lock, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Joi from 'joi'
import AuthLayout from '@/components/layout/AuthLayout'
import PasswordStrength from '@/components/common/PasswordStrength'
import FloatingGamePieces from '@/components/common/FloatingGamePieces'
import AnimatedHeroBackground from '@/components/common/AnimatedHeroBackground'
import { joiValidator, commonSchemas } from '@/utils/validation'
import authApi from '@/api/api-auth'

const resetPasswordSchema = Joi.object({
  newPassword: commonSchemas.password,
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Please confirm your password',
    }),
})

const formVariants = {
  idle: { scale: 1 },
  loading: { opacity: 0.7 },
  error: { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } },
  success: { scale: 1 },
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

export default function ResetPasswordPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [formState, setFormState] = useState('idle')
  const [password, setPassword] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const email = sessionStorage.getItem('reset_email') || ''
  const token = sessionStorage.getItem('reset_token') || ''
  const loading = formState === 'loading'

  useEffect(() => {
    if (!token || !email) {
      navigate('/forgot-password')
    }
  }, [token, email, navigate])

  // Auto redirect to login after successful password reset
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login')
      }, 2000) // Redirect after 2 seconds
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  const onFinish = async (values) => {
    setFormState('loading')
    try {
      await authApi.resetPassword(token, values.newPassword)
      
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_token')
      
      message.success('Password reset successfully!')
      navigate('/login') // Redirect immediately
    } catch (error) {
      setFormState('error')
      message.error(error.message || 'Failed to reset password')
      setTimeout(() => setFormState('idle'), 400)
    }
  }

  const rightContent = (
    <AnimatedHeroBackground>
      <FloatingGamePieces count={20} />
      <div className="relative h-full flex flex-col justify-center items-center p-12 text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#22c55e]/20 to-[#00f0ff]/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-[#22c55e]/30 animate-neon-glow">
            <ShieldCheck size={40} className="text-[#22c55e]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-[#22c55e] bg-clip-text text-transparent">Create New Password</h2>
          <p className="text-gray-300 text-lg">
            Your new password must be different from your previous passwords.
          </p>
        </motion.div>
      </div>
    </AnimatedHeroBackground>
  )

  return (
    <AuthLayout rightContent={rightContent}>
      <motion.div variants={formVariants} animate={formState} className="space-y-0">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-br from-[#00f0ff] to-[#a855f7] w-14 h-14 rounded-xl flex items-center justify-center animate-neon-glow">
            <Gamepad2 className="text-white" size={28} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              
              <div className="mb-6 text-center">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Reset Password
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Create a new password for your account
                </p>
              </div>

              
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                className="space-y-2"
              >
                <Form.Item
                  name="newPassword"
                  label={
                    <span className="block text-sm font-semibold text-slate-900 dark:text-gray-200">
                      New Password
                    </span>
                  }
                  rules={[joiValidator(resetPasswordSchema.extract('newPassword'))]}
                >
                  <Input.Password
                    size="large"
                    prefix={<Lock className="text-gray-400" size={18} />}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </Form.Item>

                <PasswordStrength password={password} />

                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="block text-sm font-semibold text-slate-900 dark:text-gray-200 mt-4">
                      Confirm Password
                    </span>
                  }
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Passwords do not match'))
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<Lock className="text-gray-400" size={18} />}
                    placeholder="••••••••"
                    className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </Form.Item>

                <Form.Item className="mb-0 pt-4">
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
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Resetting...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Reset Password
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Form.Item>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Password Reset!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Your password has been successfully reset. You can now login with your new password.
              </p>
              <motion.button
                onClick={() => navigate('/login')}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] border-none cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
              >
                Continue to Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        
        {!isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center pt-6"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#1d7af2] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </AuthLayout>
  )
}
