import { useEffect, useState, useMemo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

/**
 * GamingParticles - Dynamic particle background for main app layout
 * Features: Stars/polygons, constellation links, repulse on hover, gaming colors
 * Different from NeonParticles (used in Auth) - more dynamic and "breakthrough"
 * 
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Theme mode
 */
export default function GamingParticles({ isDarkMode = true }) {
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
          value: isDarkMode ? '#0f172a' : '#f8fafc',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse', // Particles repel from cursor - more dynamic!
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 120,
            duration: 0.4,
            speed: 1,
          },
          push: {
            quantity: 4,
          },
        },
      },
      particles: {
        color: {
          value: isDarkMode
            ? ['#00f0ff', '#a855f7', '#22c55e', '#f59e0b', '#ec4899']
            : ['#4f46e5', '#7c3aed', '#0891b2', '#059669', '#e11d48'], // Brighter saturated colors for light mode
        },
        links: {
          color: {
            value: isDarkMode ? '#00f0ff' : '#0891b2', // Cyan for dark, Dark Cyan for light
          },
          distance: 180,
          enable: true,
          opacity: isDarkMode ? 0.25 : 0.35, // Higher opacity for light mode
          width: isDarkMode ? 1 : 1.5, // Thicker lines for light mode
          triangles: {
            enable: true,
            opacity: isDarkMode ? 0.04 : 0.06, // More visible triangles
          },
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out',
          },
          random: true,
          speed: { min: 0.5, max: 2 },
          straight: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
        number: {
          density: {
            enable: true,
            area: 900,
          },
          value: 60,
        },
        opacity: {
          value: isDarkMode ? { min: 0.2, max: 0.7 } : { min: 0.5, max: 1 }, // Higher opacity for light mode
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: isDarkMode ? 0.1 : 0.3,
            sync: false,
          },
        },
        shape: {
          type: ['circle', 'triangle', 'polygon'], // Mixed shapes - more gaming!
          options: {
            polygon: {
              sides: 6, // Hexagons
            },
          },
        },
        size: {
          value: isDarkMode ? { min: 1, max: 5 } : { min: 2, max: 6 }, // Larger particles for light mode
          animation: {
            enable: true,
            speed: 3,
            minimumValue: isDarkMode ? 1 : 2,
            sync: false,
          },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.03,
            opacity: 1,
            color: {
              value: isDarkMode ? '#ffffff' : '#6366f1',
            },
          },
        },
      },
      detectRetina: true,
    }),
    [isDarkMode]
  )

  if (!init) {
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
