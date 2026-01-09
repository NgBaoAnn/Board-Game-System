import { motion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * Game piece icons - emoji or SVG based
 */
const gamePieces = [
  { emoji: '🎲', name: 'dice' },
  { emoji: '♟️', name: 'chess' },
  { emoji: '🃏', name: 'card' },
  { emoji: '🎯', name: 'target' },
  { emoji: '⭐', name: 'star' },
  { emoji: '🏆', name: 'trophy' },
  { emoji: '🎮', name: 'controller' },
  { emoji: '🧩', name: 'puzzle' },
  { emoji: '🛡️', name: 'shield' },
  { emoji: '⚔️', name: 'swords' },
  { emoji: '👑', name: 'crown' },
  { emoji: '🕹️', name: 'joystick' },
  { emoji: '👾', name: 'invader' },
  { emoji: '💎', name: 'gem' },
  { emoji: '🗝️', name: 'key' },
  { emoji: '🏰', name: 'castle' },
  { emoji: '🪄', name: 'wand' },
  { emoji: '📜', name: 'scroll' },
  { emoji: '🐉', name: 'dragon' },
  { emoji: '🏹', name: 'bow' },
  { emoji: '❤️', name: 'heart' },
  { emoji: '🧪', name: 'potion' },
]

/**
 * Generate random position and animation properties for each piece
 */
const generatePieceConfig = (index, total) => {
  const angle = (index / total) * 360
  const radius = 30 + Math.random() * 40 // 30-70% from center
  
  return {
    x: `${50 + radius * Math.cos(angle * Math.PI / 180)}%`,
    y: `${50 + radius * Math.sin(angle * Math.PI / 180)}%`,
    delay: index * 0.5,
    duration: 3 + Math.random() * 2, // 3-5s
    rotation: Math.random() * 20 - 10, // -10 to 10 degrees
    scale: 0.8 + Math.random() * 0.4, // 0.8-1.2
  }
}

/**
 * FloatingGamePieces - Animated floating game elements for hero backgrounds
 * @param {Object} props
 * @param {number} props.count - Number of pieces to show (default: 5)
 * @param {string} props.className - Additional CSS classes
 */
export default function FloatingGamePieces({ count = 5, className = '' }) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const piece = gamePieces[index % gamePieces.length]
      const config = generatePieceConfig(index, count)
      return { ...piece, ...config, id: index }
    })
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute text-3xl md:text-4xl"
          style={{
            left: piece.x,
            top: piece.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: -piece.rotation 
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [piece.scale * 0.9, piece.scale, piece.scale * 0.9],
            rotate: [-piece.rotation, piece.rotation, -piece.rotation],
            y: ['0%', '-15%', '0%'],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span 
            className="drop-shadow-lg filter"
            style={{
              textShadow: '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
            }}
          >
            {piece.emoji}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
