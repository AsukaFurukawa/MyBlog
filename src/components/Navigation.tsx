"use client";
import Link from 'next/link'
import { useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/drafts', label: 'Drafts' },
  { href: '/blog/new', label: 'New Post' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { isAdmin, logout, setShowLoginModal } = useAdminAuth();

  const handleAdminToggle = () => {
    if (isAdmin) {
      logout();
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-cyan-400 hover:text-pink-400 transition-colors">
              TechBlog
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/' ? 'text-pink-400 bg-pink-400/10' : 'text-cyan-400 hover:text-pink-400'
                }`}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/blog' ? 'text-pink-400 bg-pink-400/10' : 'text-cyan-400 hover:text-pink-400'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/about' ? 'text-pink-400 bg-pink-400/10' : 'text-cyan-400 hover:text-pink-400'
                }`}
              >
                About
              </Link>
              
              {/* Admin-only navigation items */}
              {isAdmin && (
                <>
                  <Link
                    href="/blog/new"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/blog/new' ? 'text-pink-400 bg-pink-400/10' : 'text-cyan-400 hover:text-pink-400'
                    }`}
                  >
                    New Post
                  </Link>
                  <Link
                    href="/drafts"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/drafts' ? 'text-pink-400 bg-pink-400/10' : 'text-cyan-400 hover:text-pink-400'
                    }`}
                  >
                    Drafts
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleAdminToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAdmin 
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30' 
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAdmin ? 'Logout' : 'Admin'}
            </motion.button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </nav>
  )
}

function AdminLoginUI() {
  const { isAdmin, login, logout } = useAdminAuth();
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  return isAdmin ? (
    <div className="flex items-center gap-2">
      <span className="text-green-400 font-orbitron text-sm">Admin</span>
      <button onClick={logout} className="px-2 py-1 text-xs bg-pink-500 text-white rounded font-bold hover:bg-pink-400">Logout</button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {show ? (
        <form onSubmit={e => { e.preventDefault(); login(pw); setPw(''); setShow(false); }} className="flex gap-1">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Admin Password" className="px-2 py-1 rounded bg-gray-800 text-cyan-200 text-xs font-orbitron" />
          <button type="submit" className="px-2 py-1 text-xs bg-cyan-500 text-gray-900 rounded font-bold hover:bg-cyan-400">Login</button>
        </form>
      ) : (
        <button onClick={() => setShow(true)} className="px-2 py-1 text-xs bg-cyan-500 text-gray-900 rounded font-bold hover:bg-cyan-400">Admin Login</button>
      )}
    </div>
  );
} 