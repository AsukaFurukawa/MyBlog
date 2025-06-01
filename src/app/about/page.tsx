"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import Link from 'next/link';
import { FaUserAstronaut, FaGraduationCap, FaLightbulb, FaEnvelope } from 'react-icons/fa';

function About3DModel() {
  const { scene } = useGLTF('/dron.glb');
  const ref = useRef<any>();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += 0.08 * delta;
  });
  return <primitive ref={ref} object={scene} scale={2.5} position={[0, 0.5, 0]} />;
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full font-orbitron overflow-x-hidden">
      {/* Full-bleed 3D skybox */}
      <div className="fixed inset-0 z-0 flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={1.2} />
          <Suspense fallback={null}>
            <About3DModel />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      {/* Overlayed Info */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-12">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-10 shadow-2xl border-none flex flex-col items-center gap-4 max-w-2xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-2 text-pink-400 text-center">Prachi Sinha</h1>
          <p className="text-2xl text-cyan-200 text-center font-semibold mb-2">Exploring ideas, art, and technology</p>
          <p className="text-lg text-cyan-300 text-center max-w-xl">
            Hi! I'm Prachi, a full-stack tech nerd, code enthusiast, and AI explorer. I love building things that blend creativity and logic—whether it's neural networks, generative art, or wild hackathon projects. If it's got code, data, or a glowing terminal, I'm in!<br/>
            Currently obsessed with deep learning, computer vision, and making the web more immersive (with a dash of anime and cyberpunk flair).
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-24 w-full px-4 mt-8">
          {/* Bio */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-xl border-none flex flex-col gap-4 items-center animate-fade-in">
            <FaUserAstronaut className="text-3xl text-cyan-300 mb-2" />
            <h2 className="text-2xl font-bold text-cyan-200 mb-2">Bio</h2>
            <p className="text-cyan-300 text-center">
              I geek out over new tech, love late-night debugging, and can talk for hours about the latest in AI, 3D graphics, or why TypeScript is awesome. Always up for a challenge, a hackathon, or a deep dive into a new framework!
            </p>
          </div>
          {/* Education */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-xl border-none flex flex-col gap-4 items-center animate-fade-in delay-100">
            <FaGraduationCap className="text-3xl text-pink-400 mb-2" />
            <h2 className="text-2xl font-bold text-pink-300 mb-2">Education</h2>
            <ul className="list-disc ml-6 text-cyan-200">
              <li>RV College of Engineering, Bengaluru<br/><span className="text-sm">B.E. in Computer Science - Data Science, 2022–2026</span></li>
              <li>Shiv Nadar School, Noida<br/><span className="text-sm">12th grade – 90%</span></li>
              <li>PSBB Learning Leadership Academy, Bengaluru<br/><span className="text-sm">10th grade – 94%</span></li>
            </ul>
          </div>
          {/* Interests */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-xl border-none flex flex-col gap-4 items-center animate-fade-in delay-200">
            <FaLightbulb className="text-3xl text-yellow-300 mb-2" />
            <h2 className="text-2xl font-bold text-yellow-200 mb-2">Interests</h2>
            <ul className="list-disc ml-6 text-cyan-200">
              <li>Artificial Intelligence & Machine Learning</li>
              <li>Deep Learning & Computer Vision</li>
              <li>Creative Coding & 3D Graphics</li>
              <li>Hackathons & Research</li>
              <li>Anime, Art, and Abstract Design</li>
            </ul>
          </div>
          {/* Contact */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-xl border-none flex flex-col gap-4 items-center animate-fade-in delay-300">
            <FaEnvelope className="text-3xl text-cyan-400 mb-2" />
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Contact</h2>
            <p className="text-cyan-200 text-center">Email: <span className="underline">sinharaprachi447@gmail.com</span></p>
            <p className="text-cyan-200 text-center">GitHub: <a href="https://github.com/AsukaFurukawa" className="underline text-pink-400 hover:text-cyan-300" target="_blank">AsukaFurukawa</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
// @ts-ignore
useGLTF.preload('/dron.glb'); 