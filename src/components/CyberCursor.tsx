import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CyberCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsPointer(window.getComputedStyle(e.target as Element).cursor === 'pointer')
    }

    window.addEventListener('mousemove', updatePosition)
    return () => window.removeEventListener('mousemove', updatePosition)
  }, [])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        <div className="w-8 h-8 rounded-full bg-white" />
      </motion.div>

      {/* Trailing effect */}
      <motion.div
        className="fixed pointer-events-none z-40"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.2 }}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-500 blur-sm" />
      </motion.div>

      {/* Glitch effect */}
      <motion.div
        className="fixed pointer-events-none z-30"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 10, mass: 0.3 }}
      >
        <div className="w-4 h-4 rounded-full bg-pink-500 blur-md opacity-50" />
      </motion.div>
    </>
  )
} 