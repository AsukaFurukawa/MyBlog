import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Float } from '@react-three/drei'
import { Suspense } from 'react'

function FloatingCube() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </Float>
  )
}

function FloatingSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </Float>
  )
}

function FloatingTorus() {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </Float>
  )
}

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Suspense fallback={null}>
          <FloatingCube />
          <FloatingSphere />
          <FloatingTorus />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80" />
    </div>
  )
} 