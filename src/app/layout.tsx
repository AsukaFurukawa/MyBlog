import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CyberCursor from '@/components/CyberCursor'
import CyberBackground from '@/components/CyberBackground'
import Navigation from '@/components/Navigation'
import { AdminAuthProvider, AdminLoginModal } from '@/components/AdminAuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prachi Sinha - Personal Blog',
  description: 'A space for ideas, projects, and creative exploration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-cyan-400 cursor-none`}>
        <AdminAuthProvider>
          <CyberBackground />
          <CyberCursor />
          <Navigation />
          {children}
          <AdminLoginModal />
        </AdminAuthProvider>
      </body>
    </html>
  )
} 