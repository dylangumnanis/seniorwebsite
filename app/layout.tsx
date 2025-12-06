import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '../components/Navbar'
import { Box } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roots and Wings - Wisdom Grounded, Futures Taking Flight',
  description: 'Roots and Wings connects senior citizens, the roots, with youth volunteers, the wings, for compassionate technology and financial literacy support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <Box pt="64px">
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  )
} 