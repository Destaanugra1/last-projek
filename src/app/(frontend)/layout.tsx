import { DM_Sans, Playfair_Display, Inter } from 'next/font/google'
import React from 'react'
import './tw.css'
import './styles/styles.scss'

import { Footer } from '@/components/lautbersih/Footer'
import { Navbar } from '@/components/lautbersih/Navbar'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-inter',
})

export const metadata = {
  description: 'Platform pelaporan sampah pesisir berbasis komunitas dengan Payload CMS.',
  title: 'LautBersih',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${playfair.variable} ${inter.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
