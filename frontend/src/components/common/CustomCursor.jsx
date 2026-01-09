import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [ripples, setRipples] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  
  const positionRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const updatePosition = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`
      }
      positionRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', updatePosition, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      
      setIsHovering(isInteractive)
    }

    document.addEventListener('mouseover', handleMouseOver)
    return () => document.removeEventListener('mouseover', handleMouseOver)
  }, [])

  const handleClick = useCallback((e) => {
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
    setIsClicking(true)
    
    requestAnimationFrame(() => {
      setTimeout(() => setIsClicking(false), 150)
    })
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  useEffect(() => {
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [handleClick])

  const [isTouchDevice, setIsTouchDevice] = useState(false)
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (isTouchDevice) return null

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference top-0 left-0 will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: 'translate3d(-100px, -100px, 0)',
          transition: isClicking || isHovering ? 'transform 0s' : 'none',
        }}
      >
        <div
          className="transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${isClicking ? 0.8 : isHovering ? 1.5 : 1})`,
          }}
        >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-cursor-pulse"
        >
          <line
            x1="2"
            y1="12"
            x2="8"
            y2="12"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="12"
            x2="22"
            y2="12"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="8"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="16"
            x2="12"
            y2="22"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="12"
            r="1.5"
            fill="#00f0ff"
            className="animate-cursor-dot-pulse"
          />
        </svg>

        <div
          className="absolute inset-0 rounded-full border border-[#a855f7] transition-all duration-300 ease-out"
          style={{
            transform: `scale(${isHovering ? 1.2 : 0.5}) rotate(${isHovering ? 90 : 0}deg)`,
            opacity: isHovering ? 0.8 : 0,
          }}
        />
        </div>
      </div>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-[9998] rounded-full border border-[#00f0ff]"
            initial={{
              x: ripple.x - 10,
              y: ripple.y - 10,
              width: 20,
              height: 20,
              opacity: 0.8,
              scale: 0.5
            }}
            animate={{
              x: ripple.x - 40,
              y: ripple.y - 40,
              width: 80,
              height: 80,
              opacity: 0,
              scale: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
