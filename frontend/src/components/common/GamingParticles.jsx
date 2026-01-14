import { useEffect, useState, useMemo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

/**
 * Hook to detect prefers-reduced-motion preference
 */
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e) => setReducedMotion(e.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}

/**
 * GamingParticles - Optimized particle background for main app layout
 * - Reduced particle count (25 instead of 60)
 * - Lower FPS (30 instead of 60)
 * - Disabled triangle links (heavy GPU)
 * - Respects prefers-reduced-motion
 */
export default function GamingParticles({ isDarkMode = true }) {
  const [init, setInit] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    // Skip initialization if user prefers reduced motion
    if (reducedMotion) return

    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [reducedMotion])

  const options = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: isDarkMode ? '#0f172a' : '#f8fafc',
        },
      },
      fpsLimit: 30, // Optimized: reduced from 60
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
            speed: 0.8,
          },
          push: {
            quantity: 2, // Reduced from 4
          },
        },
      },
      particles: {
        color: {
          value: isDarkMode
            ? ['#00f0ff', '#a855f7', '#22c55e', '#f59e0b', '#ec4899']
            : ['#4f46e5', '#7c3aed', '#0891b2', '#059669', '#e11d48'],
        },
        links: {
          color: {
            value: isDarkMode ? '#00f0ff' : '#0891b2',
          },
          distance: 150,
          enable: true,
          opacity: isDarkMode ? 0.2 : 0.3,
          width: isDarkMode ? 1 : 1.2,
          triangles: {
            enable: false, // Optimized: disabled triangles (heavy GPU)
          },
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out',
          },
          random: true,
          speed: { min: 0.3, max: 1.2 }, // Slower movement
          straight: false,
          attract: {
            enable: false, // Optimized: disabled attract (CPU heavy)
          },
        },
        number: {
          density: {
            enable: true,
            area: 1200, // Increased area = fewer particles
          },
          value: 25, // Optimized: reduced from 60
        },
        opacity: {
          value: isDarkMode ? { min: 0.2, max: 0.6 } : { min: 0.4, max: 0.9 },
          animation: {
            enable: false, // Optimized: disabled animation
          },
        },
        shape: {
          type: 'circle', // Optimized: only circles (simpler rendering)
        },
        size: {
          value: isDarkMode ? { min: 1, max: 4 } : { min: 2, max: 5 },
          animation: {
            enable: false, // Optimized: disabled animation
          },
        },
        twinkle: {
          particles: {
            enable: false, // Optimized: disabled twinkle
          },
        },
      },
      detectRetina: true,
    }),
    [isDarkMode]
  )

  // If reduced motion or not initialized, show static gradient background
  if (reducedMotion || !init) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
        }}
      />
    )
  }

  return (
    <Particles
      id="gaming-particles"
      options={options}
      className="absolute inset-0 z-0"
    />
  )
}
