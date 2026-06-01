import { DM_Sans, Playfair_Display, Inter } from 'next/font/google'
import React from 'react'
import './tw.css'
import './styles/styles.scss'

import { Footer } from '@/components/lautbersih/Footer'
import { Navbar } from '@/components/lautbersih/Navbar'
import { OceanCleanupPreloader } from '@/components/lautbersih/OceanCleanupPreloader'
import { MaintenanceBarrier, type MaintenanceEntry } from '@/components/lautbersih/MaintenanceBarrier'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { getCurrentUser } from '@/lib/auth'

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

async function getMaintenanceEntries(): Promise<MaintenanceEntry[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'maintenance-pages',
      where: { isActive: { equals: true } },
      limit: 50,
      depth: 0,
    })
    return result.docs.map((doc) => ({
      id: String(doc.id),
      pageRoute: doc.pageRoute as string,
      isActive: Boolean(doc.isActive),
      allowAdmins: Boolean(doc.allowAdmins),
      applyOnDev: Boolean(doc.applyOnDev),
      title: String(doc.title ?? 'Halaman Sedang Dalam Pemeliharaan'),
      content: (doc.content ?? null) as MaintenanceEntry['content'],
    }))
  } catch {
    return []
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const [maintenanceEntries, user] = await Promise.all([
    getMaintenanceEntries(),
    getCurrentUser(),
  ])

  const isDev = process.env.NODE_ENV !== 'production'

  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
        <OceanCleanupPreloader />
        <MaintenanceBarrier
          entries={maintenanceEntries}
          userRole={user?.role ?? null}
          isDev={isDev}
        />
        <Navbar />
        <div className="main-content">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}

