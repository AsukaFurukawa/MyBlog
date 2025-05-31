import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface CursorTrail {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
}

export default function CyberCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [trails, setTrails] = useState<CursorTrail[]>([])
  const trailCount = 20
  const trailRef = useRef<number>(0)

  // Spring animation for smoother movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const x = useSpring(position.x, springConfig)
  const y = useSpring(position.y, springConfig)
  const scale = useSpring(isPointer ? 1.5 : 1, springConfig)

  // Transform for color based on movement
  const velocity = useRef({ x: 0, y: 0 })
  const lastPosition = useRef({ x: 0, y: 0 })
  const hue = useTransform(
    [x, y],
    ([latestX, latestY]) => {
      const dx = latestX - lastPosition.current.x
      const dy = latestY - lastPosition.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)
      velocity.current = { x: dx, y: dy }
      lastPosition.current = { x: latestX, y: latestY }
      return Math.min(speed * 10, 360)
    }
  )

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsPointer(window.getComputedStyle(e.target as Element).cursor === 'pointer')
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Update trails
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => {
        const newTrails = [...prev]
        newTrails.push({
          id: trailRef.current++,
          x: position.x,
          y: position.y,
          scale: isPointer ? 1.2 : 0.8,
          opacity: 1
        })
        if (newTrails.length > trailCount) {
          newTrails.shift()
        }
        return newTrails
      })
    }, 16)

    return () => clearInterval(interval)
  }, [position, isPointer])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          x: x,
          y: y,
          scale: scale,
          filter: `hue-rotate(${hue}deg)`
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white" />
      </motion.div>

      {/* Click effect */}
      {isClicking && (
        <motion.div
          className="fixed pointer-events-none z-45"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            x: position.x - 16,
            y: position.y - 16,
          }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500" />
        </motion.div>
      )}

      {/* Trails */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="fixed pointer-events-none z-40"
          initial={{ opacity: 1, scale: trail.scale }}
          animate={{
            x: trail.x - 4,
            y: trail.y - 4,
            opacity: 0,
            scale: 0.5
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <div 
            className="w-2 h-2 rounded-full bg-cyan-500 blur-sm"
            style={{
              filter: `hue-rotate(${index * 10}deg)`
            }}
          />
        </motion.div>
      ))}

      {/* Glitch effect */}
      <motion.div
        className="fixed pointer-events-none z-30"
        style={{
          x: x,
          y: y,
          scale: scale,
          filter: `hue-rotate(${hue}deg)`
        }}
      >
        <div className="w-4 h-4 rounded-full bg-pink-500 blur-md opacity-50" />
      </motion.div>

      {/* Velocity lines */}
      <motion.div
        className="fixed pointer-events-none z-35"
        style={{
          x: x,
          y: y,
          rotate: Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI)
        }}
      >
        <div 
          className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-50"
          style={{
            transformOrigin: 'left center',
            scale: Math.min(Math.sqrt(velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y) * 0.1, 1)
          }}
        />
      </motion.div>
    </>
  )
} 