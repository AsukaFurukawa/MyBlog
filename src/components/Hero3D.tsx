import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

// Morphing 3D model: torus, sphere, box
function MorphingShape({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  // 0: torus, 1: sphere, 2: box
  let shape = 0
  if (mouse.x > 0.33) shape = 1
  if (mouse.x < -0.33) shape = 2

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = mouse.x * 1.2
      meshRef.current.rotation.x = -mouse.y * 0.8
      meshRef.current.scale.set(2.2, 2.2, 2.2)
    }
  })

  let geometry
  if (shape === 0) {
    geometry = <torusKnotGeometry args={[0.9, 0.3, 128, 32]} />
  } else if (shape === 1) {
    geometry = <sphereGeometry args={[1.1, 64, 64]} />
  } else {
    geometry = <boxGeometry args={[1.7, 1.7, 1.7]} />
  }

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {geometry}
      <meshPhysicalMaterial
        color="#aafcff"
        metalness={0.8}
        roughness={0.05}
        transparent
        opacity={0.5}
        transmission={0.8}
        thickness={1.5}
        ior={1.4}
        reflectivity={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#0fffc3"
        emissiveIntensity={0.35}
        envMapIntensity={2}
      />
    </mesh>
  )
}

export default function Hero3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setMouse({ x, y })
  }

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0a23] select-none"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Model, floating behind text */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <MorphingShape mouse={mouse} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
      {/* Text Content, floating and bold */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[clamp(3rem,10vw,7rem)] font-extrabold text-white font-orbitron mb-6 text-center tracking-widest drop-shadow-[0_0_40px_cyan]"
          style={{
            textShadow: '0 0 32px #0fffc3, 0 0 8px #000, 0 2px 8px #000',
            letterSpacing: '0.08em',
          }}
        >
          Prachi Sinha
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[clamp(1.5rem,4vw,3rem)] text-cyan-200 font-bold text-center max-w-3xl drop-shadow-[0_0_20px_black]"
          style={{
            textShadow: '0 0 12px #000, 0 2px 8px #000',
          }}
        >
          Exploring ideas, art, and technology
        </motion.p>
      </div>
      {/* Optional: subtle overlay for readability */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/10 via-black/5 to-transparent" />
    </div>
  )
} 