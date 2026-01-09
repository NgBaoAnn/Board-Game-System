import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * TypewriterText - Animated typewriter effect for text content
 * @param {Object} props
 * @param {string} props.text - Text to animate
 * @param {number} props.delay - Delay before starting (seconds)
 * @param {number} props.speed - Characters per second (default: 30)
 * @param {boolean} props.showCursor - Show blinking cursor (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onComplete - Callback when animation completes
 */
export default function TypewriterText({
  text,
  delay = 0,
  speed = 30,
  showCursor = true,
  className = '',
  onComplete,
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout
    let charIndex = 0

    const startTyping = () => {
      const interval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1))
          charIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, 1000 / speed)

      return interval
    }

    timeout = setTimeout(() => {
      const interval = startTyping()
      return () => clearInterval(interval)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [text, delay, speed, onComplete])

  return (
    <span className={`inline ${className}`}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        {displayedText}
      </motion.span>
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle"
          animate={{ opacity: isComplete ? [1, 0] : 1 }}
          transition={
            isComplete
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }
              : {}
          }
        />
      )}
    </span>
  )
}
