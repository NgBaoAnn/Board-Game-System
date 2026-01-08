import { useState } from 'react'
import { Input } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * AnimatedInput - Input with micro-interaction animations
 * @param {Object} props
 * @param {boolean} props.hasError - Shows error state with shake animation
 * @param {boolean} props.isPassword - Uses Input.Password
 * @param {React.ReactNode} props.prefix - Input prefix icon
 * @param {string} props.label - Label text
 * @param {string} props.errorMessage - Error message to display
 */
export default function AnimatedInput({
  hasError = false,
  isPassword = false,
  prefix,
  label,
  errorMessage,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const InputComponent = isPassword ? Input.Password : Input

  const handleChange = (e) => {
    setHasValue(!!e.target.value)
    rest.onChange?.(e)
  }

  return (
    <motion.div
      className="relative"
      animate={hasError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Floating Label */}
      {label && (
        <motion.label
          className={`block text-sm font-semibold mb-2 transition-colors ${
            isFocused ? 'text-primary' : 'text-slate-900 dark:text-gray-200'
          }`}
          animate={{
            color: hasError ? '#ef4444' : isFocused ? '#1d7af2' : undefined,
          }}
        >
          {label}
        </motion.label>
      )}

      {/* Input with focus glow */}
      <motion.div
        className={`rounded-lg transition-shadow ${
          isFocused ? 'input-focus-glow' : ''
        } ${hasError ? 'ring-2 ring-red-500/50' : ''}`}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 3px rgba(29, 122, 242, 0.15)'
            : hasError
            ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
            : 'none',
        }}
        transition={{ duration: 0.2 }}
      >
        <InputComponent
          size="large"
          prefix={
            <motion.span
              animate={{
                scale: isFocused ? 1.1 : 1,
                color: isFocused ? '#1d7af2' : '#9ca3af',
              }}
              transition={{ duration: 0.2 }}
            >
              {prefix}
            </motion.span>
          }
          className="rounded-lg py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          status={hasError ? 'error' : undefined}
          {...rest}
        />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-500 text-xs mt-1"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
