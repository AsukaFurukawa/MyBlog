"use client";

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, SpotLight, RectAreaLight } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Suspense, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function GlowingTorus() {
  const meshRef = useRef<THREE.Mesh>(null)
  // Animate rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
    }
  })
  return (
    <mesh ref={meshRef} scale={1.7} castShadow receiveShadow>
      <torusKnotGeometry args={[0.8, 0.28, 128, 32]} />
      <meshPhysicalMaterial
        color="#3b1fa7"
        metalness={0.9}
        roughness={0.12}
        transparent
        opacity={0.97}
        transmission={0.8}
        thickness={2}
        ior={1.6}
        reflectivity={0.98}
        clearcoat={1}
        clearcoatRoughness={0.04}
        emissive="#5f1fff"
        emissiveIntensity={1.1}
        envMapIntensity={2.5}
        sheen={1}
        sheenColor="#7c3aed"
        sheenRoughness={0.18}
      />
    </mesh>
  )
}

function AnimatedLights() {
  // Animate light colors and positions
  const group = useRef()
  useFrame((state) => {
    if (group.current) {
      group.current.children[0].position.x = Math.sin(state.clock.getElapsedTime()) * 3
      group.current.children[1].position.z = Math.cos(state.clock.getElapsedTime() * 0.7) * 3
      group.current.children[2].intensity = 1.2 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.5
    }
  })
  return (
    <group ref={group}>
      {/* Electric blue point light */}
      <pointLight position={[3, 2, 2]} intensity={2.2} color="#00eaff" distance={10} castShadow />
      {/* Purple point light */}
      <pointLight position={[-3, 2, -2]} intensity={1.7} color="#8f5cff" distance={10} castShadow />
      {/* White spot light */}
      <spotLight position={[0, 5, 5]} angle={0.7} penumbra={0.8} intensity={1.5} color="#ffffff" castShadow />
      {/* Hemisphere light for soft fill */}
      <hemisphereLight skyColor="#a78bfa" groundColor="#1a0036" intensity={0.85} />
    </group>
  )
}

export default function Hero3D() {
  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2a003f] via-[#1a1a6e] via-60% to-[#0a0026] animate-gradient-move select-none"
      style={{
        background: 'linear-gradient(120deg, #2a003f 0%, #4b006e 40%, #1a1a6e 60%, #0a0026 100%)',
        animation: 'gradientMove 12s ease-in-out infinite alternate',
      }}
    >
      {/* 3D Glowing Torus with advanced lighting */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }} shadows>
          <ambientLight intensity={0.7} />
          <AnimatedLights />
          <Suspense fallback={null}>
            <GlowingTorus />
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
          className="text-[clamp(3.5rem,11vw,8rem)] font-extrabold text-white font-orbitron mb-6 text-center tracking-widest drop-shadow-[0_0_60px_#0fffc3]"
          style={{
            textShadow: '0 0 48px #0fffc3, 0 0 16px #8f5cff, 0 2px 8px #000',
            letterSpacing: '0.12em',
          }}
        >
          Prachi Sinha
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[clamp(2rem,5vw,3.5rem)] text-cyan-200 font-bold text-center max-w-3xl drop-shadow-[0_0_40px_#0fffc3]"
          style={{
            textShadow: '0 0 24px #0fffc3, 0 2px 8px #000',
          }}
        >
          Exploring ideas, art, and technology
        </motion.p>
      </div>
      {/* Optional: subtle overlay for readability */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#2a003f]/60 via-[#1a1a6e]/30 to-black/80" />
      {/* Orbitron font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}

// Custom neon border utility (add to global CSS):
// .border-neon-gradient {
//   border-image: linear-gradient(90deg, #0ff 0%, #f0f 100%);
//   border-image-slice: 1;
// }
// .font-orbitron { font-family: 'Orbitron', sans-serif; }
// .animate-gradient-move { animation: gradientMove 12s ease-in-out infinite alternate; }
// @keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } } 