"use client";

import BlogList from '@/components/BlogList'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useRef } from 'react'

function DroneAccent() {
  // const { scene } = useGLTF('/dron.glb')
  const ref = useRef<any>()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  return (
    // <mesh ref={ref} scale={[0.03, 0.03, 0.03]} position={[3, 1, -2]} rotation={[0, 0, 0.2]}>
    //   <primitive object={scene} />
    // </mesh>
    <mesh ref={ref} scale={[0.5, 0.5, 0.5]} position={[3, 1, -2]} rotation={[0, 0, 0.2]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function BlogPage() {
  return (
    <div className="relative">
      {/* 3D floating drone background */}
      <div className="fixed top-0 right-0 w-96 h-96 z-0 pointer-events-none opacity-60">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.7} />
          <Suspense fallback={null}>
            <DroneAccent />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <BlogList />
      <Link href="/blog/new">
        <button className="fixed bottom-8 right-8 z-50 bg-pink-500 hover:bg-pink-400 text-white text-4xl rounded-full w-16 h-16 shadow-lg flex items-center justify-center transition-all border-4 border-cyan-400">
          +
        </button>
      </Link>
    </div>
  )
} 