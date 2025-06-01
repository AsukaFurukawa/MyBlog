"use client";

import { useEffect, useState } from 'react';
import { BlogPost, BlogCategory } from '@/types/blog';
import { motion } from 'framer-motion';
import GlitchEffect from '@/components/GlitchEffect';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { HiOutlineNewspaper } from 'react-icons/hi';
import Link from 'next/link';

const categories: BlogCategory[] = [
  'tech',
  'idea',
  'abstract',
  'art',
  'finance',
  'project',
  'other',
];

function PendantAccent() {
  const { scene } = useGLTF('/viking_book.glb');
  const ref = useRef<any>();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += 0.15 * delta;
  });
  return <primitive ref={ref} object={scene} scale={0.005} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Refresh posts when navigating back to the page
  useEffect(() => {
    const handleFocus = () => {
      fetchPosts();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog?isDraft=false');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a003f] via-[#1a1a6e] via-60% to-[#0a0026] relative text-cyan-400 font-orbitron overflow-x-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a003f]/40 via-[#1a1a6e]/30 to-black/80 animate-gradient-move" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto pt-16 pb-12 px-4">
        <div className="flex-1 flex flex-col items-start justify-center gap-4">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border-none flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-3 mb-2">
              <HiOutlineNewspaper className="text-3xl text-pink-400" />
              <span className="text-2xl font-bold text-white tracking-widest font-orbitron drop-shadow-[0_0_24px_#8f5cff]">Welcome to the Blog</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-cyan-200 mb-2 leading-tight font-orbitron drop-shadow-[0_0_32px_#0fffc3]">Ideas, Projects, and Inspiration</h2>
            <p className="text-lg text-cyan-300 font-orbitron drop-shadow-[0_0_16px_#0fffc3]">Dive into tech, art, and abstract thoughts. Explore, learn, and get inspired!</p>
          </div>
        </div>
        {/* Floating 3D accent */}
        <div className="flex-1 flex items-center justify-center min-w-[300px] min-h-[300px]">
          <div className="w-96 h-96 md:w-[28rem] md:h-[28rem] opacity-60 drop-shadow-[0_0_40px_#0ff8] animate-float-slow">
            <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
              <ambientLight intensity={1.6} />
              <directionalLight position={[2, 4, 5]} intensity={1.2} color={'#fff8e7'} castShadow />
              <Suspense fallback={null}>
                <PendantAccent />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </div>
      </div>
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-lg text-cyan-300 font-semibold shadow-md border-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            >
              {category}
            </motion.button>
          ))}
        </div>
        {/* Blog Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <GlitchEffect>
              <h2 className="text-3xl font-bold text-pink-400 mb-4">Loading...</h2>
            </GlitchEffect>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <GlitchEffect>
              <h2 className="text-3xl font-bold text-pink-400 mb-4">No posts yet!</h2>
            </GlitchEffect>
            <p className="text-cyan-300 mb-2">Start by creating your first cyberpunk blog post.</p>
            <span className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 animate-pulse rounded-full" />
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-16">
            {posts.map((post, idx) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 40px 0 #0ff8, 0 0 80px 16px #f0f8' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`relative bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border-none flex flex-col gap-4 mb-8 break-inside-avoid p-8 group transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/30 hover:z-20 cursor-pointer`}
                >
                  {/* Cover Image */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4 -mx-8 -mt-8">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-2xl"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-400 font-semibold">
                      {post.category}
                    </span>
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-sm bg-pink-500/20 text-pink-400 font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <GlitchEffect>
                    <h2 className="text-3xl font-extrabold mb-2 text-white leading-tight group-hover:text-pink-400 transition-colors duration-200 font-orbitron drop-shadow-[0_0_24px_#8f5cff]">
                      {post.title}
                    </h2>
                  </GlitchEffect>
                  <p className="text-gray-200 mb-2 text-lg">
                    {post.excerpt || post.content.slice(0, 100) + '...'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-cyan-300">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                    <span className="text-pink-400 hover:text-pink-300 transition-colors font-bold group-hover:underline group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_pink]">
                      Read More →
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
}
// @ts-ignore
useGLTF.preload('/viking_book.glb');

// Add to global CSS:
// .animate-float-slow { animation: floatSlow 8s ease-in-out infinite alternate; }
// @keyframes floatSlow { 0% { transform: translateY(0); } 100% { transform: translateY(-24px); } }
// .animate-gradient-move { animation: gradientMove 12s ease-in-out infinite alternate; }
// @keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } } 