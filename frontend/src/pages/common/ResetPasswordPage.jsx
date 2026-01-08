import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, message } from 'antd'
import { Gamepad2, Lock, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Joi from 'joi'
import AuthLayout from '@/components/layout/AuthLayout'
import PasswordStrength from '@/components/common/PasswordStrength'
import { joiValidator, commonSchemas } from '@/utils/validation'

// Validation schema
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

// Animation variants
const formVariants = {
  idle: { scale: 1 },
  loading: { opacity: 0.7 },
  error: { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } },
  success: { scale: 1 },
}

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03, boxShadow: '0 10px 40px -10px rgba(29, 122, 242, 0.5)' },
  tap: { scale: 0.97 },
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

  // Redirect if no token
  useEffect(() => {
    if (!token || !email) {
      navigate('/forgot-password')
    }
  }, [token, email, navigate])

  const onFinish = async (values) => {
    setFormState('loading')
    try {
      // TODO: Implement reset password API
      // await authApi.resetPassword(email, token, values.newPassword)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Clear session storage
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_token')
      
      setFormState('success')
      setIsSuccess(true)
      message.success('Password reset successfully!')
    } catch (error) {
      setFormState('error')
      message.error(error.message || 'Failed to reset password')
      setTimeout(() => setFormState('idle'), 400)
    }
  }

  const rightContent = (
    <>
      <img
        alt="Board game pieces"
        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0rYUZTmwMe11ZhJQSf5l8BZPDiLW22TF5V0RoiJKOPguv2CPq2CZuiFd5FkZIbJABPMNg_3zT6q0FBIWmd62l_IveebetIvauJc1NpZP0NPFPJLSVHOQDBtrvbPLullL4pkM-rv1EyEG2IUD4lCxbST_a9gmJTWvx7g_6YX1ZnJ1YgY2Xw85cseQTHAycvAkumrzXL85T_h9Mfg14HVoo-3JUxcqJXstXiu3XWg8joz9UVRyzw0EVp17rNS5_Uwli3n4RDew5jVE"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90 mix-blend-multiply" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative h-full flex flex-col justify-center items-center p-12 text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Create New Password</h2>
          <p className="text-blue-100 text-lg">
            Your new password must be different from your previous passwords.
          </p>
        </motion.div>
      </div>
    </>
  )

  return (
    <AuthLayout rightContent={rightContent}>
      <motion.div variants={formVariants} animate={formState} className="space-y-0">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-[#1d7af2] w-14 h-14 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
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
              {/* Title */}
              <div className="mb-6 text-center">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Reset Password
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Create a new password for your account
                </p>
              </div>

              {/* Form */}
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
                    className="w-full h-12 rounded-xl text-base font-bold bg-[#1d7af2] text-white shadow-lg shadow-blue-500/30 border-none cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
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
                className="w-full h-12 rounded-xl text-base font-bold bg-[#1d7af2] text-white shadow-lg shadow-blue-500/30 border-none cursor-pointer flex items-center justify-center gap-2"
              >
                Continue to Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Login */}
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
