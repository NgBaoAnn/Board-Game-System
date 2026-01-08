import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, message } from 'antd'
import { Gamepad2, Mail, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Joi from 'joi'
import AuthLayout from '@/components/layout/AuthLayout'
import { joiValidator, commonSchemas } from '@/utils/validation'

// Validation schema
const forgotPasswordSchema = Joi.object({
  email: commonSchemas.email,
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

export default function ForgotPasswordPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [formState, setFormState] = useState('idle')
  const loading = formState === 'loading'

  const onFinish = async (values) => {
    setFormState('loading')
    try {
      // TODO: Implement send OTP API
      // await authApi.sendOTP(values.email)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Store email for verify page
      sessionStorage.setItem('reset_email', values.email)
      
      setFormState('success')
      message.success('OTP code sent to your email!')
      
      // Navigate to verify OTP page
      setTimeout(() => navigate('/verify-otp'), 500)
    } catch (error) {
      setFormState('error')
      message.error(error.message || 'Failed to send OTP')
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
            <Mail size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Password Recovery</h2>
          <p className="text-blue-100 text-lg">
            Enter your email and we'll send you a 6-digit verification code.
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            No worries, we'll send you a verification code.
          </p>
        </motion.div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="email"
            label={
              <span className="block text-sm font-semibold text-slate-900 dark:text-gray-200">
                Email Address
              </span>
            }
            rules={[joiValidator(forgotPasswordSchema.extract('email'))]}
          >
            <Input
              size="large"
              prefix={<Mail className="text-gray-400" size={18} />}
              placeholder="you@example.com"
              className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </Form.Item>

          <Form.Item className="mb-0">
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
                    Sending OTP...
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send OTP Code
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
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
      </motion.div>
    </AuthLayout>
  )
}
