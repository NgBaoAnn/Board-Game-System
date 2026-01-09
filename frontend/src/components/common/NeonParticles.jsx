import { useEffect, useState, useMemo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

/**
 * NeonParticles - Cyber-style neon particle background
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Adjusts particle colors for dark/light mode
 */
export default function NeonParticles({ isDarkMode = false }) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
            },
          },
          push: {
            quantity: 3,
          },
        },
      },
      particles: {
        color: {
          // Cosmic Arcade neon colors
          value: isDarkMode
            ? ['#00f0ff', '#a855f7', '#ec4899', '#22c55e']
            : ['#4f46e5', '#7c3aed', '#db2777', '#0891b2'], // Brighter saturated colors for light mode
        },
        links: {
          color: isDarkMode ? '#00f0ff' : '#4f46e5',
          distance: 150,
          enable: true,
          opacity: isDarkMode ? 0.4 : 0.5, // Higher opacity for light mode
          width: isDarkMode ? 1 : 1.5, // Thicker lines
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: true,
          speed: 1.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            height: 800,
            width: 800,
          },
          value: 80,
        },
        opacity: {
          value: isDarkMode ? { min: 0.3, max: 0.8 } : { min: 0.6, max: 1 }, // Higher opacity for light mode
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: isDarkMode ? { min: 1, max: 4 } : { min: 2, max: 5 }, // Larger particles for light mode
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    [isDarkMode]
  )

  if (!init) {
    return null
  }

  return (
    <Particles
      id="neon-particles"
      options={options}
      className="absolute inset-0 z-0 pointer-events-auto"
    />
  )
}
