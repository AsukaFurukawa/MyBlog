"use client";

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GlitchEffectProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export default function GlitchEffect({ children, className = '', intensity = 0.5 }: GlitchEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Original content */}
      <div className="relative z-10">{children}</div>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, -2, 2, -1, 1, 0],
              y: [0, 1, -1, 2, -2, 0],
            }}
            transition={{ duration: 0.2 }}
            style={{
              color: '#ff00ff',
              textShadow: '2px 0 #00ffff',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
            }}
          >
            {children}
          </motion.div>

          <motion.div
            className="absolute inset-0 z-0"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, 2, -2, 1, -1, 0],
              y: [0, -1, 1, -2, 2, 0],
            }}
            transition={{ duration: 0.2 }}
            style={{
              color: '#00ffff',
              textShadow: '-2px 0 #ff00ff',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
            }}
          >
            {children}
          </motion.div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent 50%, rgba(0, 255, 255, 0.025) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        </>
      )}
    </div>
  )
} 