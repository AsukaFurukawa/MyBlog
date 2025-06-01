"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import { useAdminAuth } from '@/components/AdminAuthContext';
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function PacManAccent() {
  const ref = useRef<any>()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 1.5
    }
  })

  return (
    <mesh ref={ref} scale={[0.4, 0.4, 0.4]} position={[2, 0, -1]} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 1.5]} />
      <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
    </mesh>
  )
}

export default function NewBlogPage() {
  const { isAdmin, setShowLoginModal } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      setShowLoginModal(true);
      router.push('/');
    }
  }, [isAdmin, setShowLoginModal, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Access Denied</h1>
          <p className="text-cyan-300">You need admin access to create new blog posts.</p>
        </div>
      </div>
    );
  }

  const handleSave = async (draft: BlogDraft) => {
    try {
      console.log('Saving post:', draft);
      
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });

      console.log('Save response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        throw new Error('Failed to save draft');
      }

      const savedDraft = await response.json();
      console.log('Post saved successfully:', savedDraft);
      
      router.push(draft.isDraft ? '/drafts' : '/blog');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Neon Pac-Man accent in the background */}
      <div className="fixed bottom-0 left-0 w-48 h-48 z-0 pointer-events-none opacity-70">
        <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
          <ambientLight intensity={0.7} />
          <Suspense fallback={null}>
            <PacManAccent />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <BlogEditor onSave={handleSave} />
    </div>
  );
} 