import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * SubtleGridBackground - Lightweight animated background for main app layout
 * Features subtle grid pattern, floating gradient orbs, and smooth transitions
 * Optimized for performance (fewer animations, CSS-based effects)
 * 
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Theme mode
 * @param {React.ReactNode} props.children - Content to overlay
 */
export default function SubtleGridBackground({ isDarkMode = true, children }) {
  const orbs = useMemo(() => [
    {
      id: 1,
      size: 300,
      color: isDarkMode ? 'rgba(0, 240, 255, 0.08)' : 'rgba(99, 102, 241, 0.06)',
      position: { top: '10%', right: '20%' },
      animation: { x: [0, 20, 0], y: [0, -15, 0] },
      duration: 20,
    },
    {
      id: 2,
      size: 250,
      color: isDarkMode ? 'rgba(168, 85, 247, 0.06)' : 'rgba(236, 72, 153, 0.05)',
      position: { bottom: '20%', left: '10%' },
      animation: { x: [0, -15, 0], y: [0, 20, 0] },
      duration: 25,
    },
    {
      id: 3,
      size: 200,
      color: isDarkMode ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.04)',
      position: { top: '50%', left: '60%' },
      animation: { x: [0, 10, -10, 0], y: [0, -10, 5, 0] },
      duration: 30,
    },
  ], [isDarkMode])

  return (
    <div className="relative w-full h-full overflow-hidden">
      
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDarkMode
            ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)',
        }}
      />

      
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isDarkMode ? 0.4 : 0.3,
          backgroundImage: `radial-gradient(${isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full pointer-events-none will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            ...orb.position,
          }}
          animate={orb.animation}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
