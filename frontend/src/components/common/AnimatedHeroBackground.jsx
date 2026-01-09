import { motion } from 'framer-motion'

/**
 * AnimatedHeroBackground - Animated gradient mesh background for hero sections
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to overlay on background
 * @param {string} props.className - Additional CSS classes
 */
export default function AnimatedHeroBackground({ children, className = '' }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Base gradient - deep purple to midnight blue */}
      <div 
        className="absolute inset-0 animate-ambient"
        style={{
          background: `linear-gradient(
            135deg, 
            #1a0a2e 0%, 
            #12121f 25%, 
            #0d1b3e 50%, 
            #12121f 75%, 
            #1a0a2e 100%
          )`,
          backgroundSize: '400% 400%',
        }}
      />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
          top: '20%',
          left: '10%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          bottom: '10%',
          right: '15%',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-20 blur-2xl"
        style={{
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          top: '60%',
          left: '50%',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
          scale: [0.8, 1, 0.9, 0.8],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Mesh grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 18, 0.6) 100%)',
        }}
      />

      {/* Content container */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
