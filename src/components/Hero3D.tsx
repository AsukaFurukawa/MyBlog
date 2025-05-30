import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

function Model() {
  const { scene } = useGLTF('/abstract_shape.glb')
  return <primitive object={scene} scale={2} />
}

export default function Hero3D() {
  return (
    <div className="h-screen w-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="absolute inset-0"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center text-center"
      >
        <div className="text-white z-10">
          <h1 className="text-6xl font-bold mb-4">Welcome to My World</h1>
          <p className="text-xl">Exploring ideas, art, and technology</p>
        </div>
      </motion.div>
    </div>
  )
} 