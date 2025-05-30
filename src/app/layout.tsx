import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CyberCursor from '@/components/CyberCursor'
import CyberBackground from '@/components/CyberBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Name - Personal Blog',
  description: 'A space for ideas, projects, and creative exploration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-cyan-400 cursor-none`}>
        <CyberBackground />
        <CyberCursor />
        {children}
      </body>
    </html>
  )
} 