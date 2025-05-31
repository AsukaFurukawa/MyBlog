import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  )

  const blurAmount = useTransform(
    scrollY,
    [0, 100],
    ['8px', '12px']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        backgroundColor,
        backdropFilter: `blur(${blurAmount})`,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="relative group">
            <motion.span
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-pink-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Your Name
            </motion.span>
            <motion.div
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-pink-500"
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.2 }}
            />
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/blog" isActive={pathname === '/blog'}>Blog</NavLink>
              <NavLink href="/projects" isActive={pathname === '/projects'}>Projects</NavLink>
              <NavLink href="/about" isActive={pathname === '/about'}>About</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Glitch effect overlay */}
      {isScrolled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          style={{
            background: 'linear-gradient(45deg, transparent 45%, rgba(0, 255, 255, 0.1) 50%, transparent 55%)',
            backgroundSize: '200% 200%',
            animation: 'glitch 2s linear infinite',
          }}
        />
      )}
    </motion.nav>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <Link href={href} className="relative group">
      <motion.span
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'text-cyan-500'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
      
      {/* Hover effect */}
      <motion.div
        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-pink-500"
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.2 }}
      />

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-pink-500"
          layoutId="activeIndicator"
        />
      )}

      {/* Glitch effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        whileHover={{ opacity: 0.1 }}
        style={{
          background: 'linear-gradient(45deg, transparent 45%, rgba(0, 255, 255, 0.1) 50%, transparent 55%)',
          backgroundSize: '200% 200%',
          animation: 'glitch 2s linear infinite',
        }}
      />
    </Link>
  )
}

// Add global styles
const styles = `
  @keyframes glitch {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
} 