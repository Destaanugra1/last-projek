import { DM_Sans, Playfair_Display, Inter } from 'next/font/google'
import React from 'react'
import './tw.css'
import './styles/styles.scss'

import { Footer } from '@/components/lautbersih/Footer'
import { Navbar } from '@/components/lautbersih/Navbar'
import { OceanCleanupPreloader } from '@/components/lautbersih/OceanCleanupPreloader'

const dmSans = DM_Sans({
  preload: false,
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  preload: false,
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const inter = Inter({
  preload: false,
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-inter',
})

export const metadata = {
  description: 'Platform pelaporan sampah pesisir berbasis komunitas dengan Payload CMS.',
  title: {
    default: 'LautBersih',
    template: '%s | LautBersih',
  },
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
        <OceanCleanupPreloader />
        <div className="main-content">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
