import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { Gamepad2, ArrowLeft, KeyRound, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthLayout from '@/components/layout/AuthLayout'
import FloatingGamePieces from '@/components/common/FloatingGamePieces'
import AnimatedHeroBackground from '@/components/common/AnimatedHeroBackground'

// Animation variants
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

export default function VerifyOTPPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [formState, setFormState] = useState('idle')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const email = sessionStorage.getItem('reset_email') || ''
  const loading = formState === 'loading'

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
      setOtp(newOtp)
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleSubmit = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      message.error('Please enter all 6 digits')
      return
    }

    setFormState('loading')
    try {
      // TODO: Implement verify OTP API
      // await authApi.verifyOTP(email, otpCode)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Store verified token for reset password page
      sessionStorage.setItem('reset_token', otpCode)
      
      setFormState('success')
      message.success('OTP verified successfully!')
      
      // Navigate to reset password page
      setTimeout(() => navigate('/reset-password'), 500)
    } catch (error) {
      setFormState('error')
      message.error(error.message || 'Invalid OTP code')
      setTimeout(() => setFormState('idle'), 400)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    try {
      // TODO: Implement resend OTP API
      // await authApi.sendOTP(email)
      
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      message.success('New OTP sent!')
      setCountdown(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
    } catch (error) {
      message.error('Failed to resend OTP')
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
          <div className="w-20 h-20 bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00f0ff]/30 animate-neon-glow">
            <KeyRound size={40} className="text-[#00f0ff]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-[#a855f7] bg-clip-text text-transparent">Verify Your Email</h2>
          <p className="text-gray-300 text-lg">
            We've sent a 6-digit code to your email. Enter it below to continue.
          </p>
        </motion.div>
      </div>
    </AnimatedHeroBackground>
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
          <div className="bg-gradient-to-br from-[#00f0ff] to-[#a855f7] w-14 h-14 rounded-xl flex items-center justify-center animate-neon-glow">
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
            Enter OTP Code
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            We sent a code to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
          </p>
        </motion.div>

        {/* OTP Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/20 outline-none transition-all"
            />
          ))}
        </motion.div>

        {/* Verify Button */}
        <motion.button
          onClick={handleSubmit}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          disabled={loading || otp.join('').length !== 6}
          className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] border-none cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] mb-4"
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
                Verifying...
              </motion.div>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Verify OTP
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Resend OTP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Didn't receive the code?
          </p>
          {canResend ? (
            <button
              onClick={handleResend}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1d7af2] hover:text-blue-700 transition-colors"
            >
              <RotateCcw size={14} />
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-gray-400">
              Resend in <span className="font-medium text-gray-600 dark:text-gray-300">{countdown}s</span>
            </p>
          )}
        </motion.div>

        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
