import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import React from 'react'
import './styles/styles.scss'

import { Footer } from '@/components/lautbersih/Footer'
import { Navbar } from '@/components/lautbersih/Navbar'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-dm-serif',
  weight: '400',
})

export const metadata = {
  description: 'Platform pelaporan sampah pesisir berbasis komunitas dengan Payload CMS.',
  title: 'LautBersih',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${dmSerif.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
