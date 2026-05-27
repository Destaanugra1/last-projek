import Link from 'next/link'
import type { ReactNode } from 'react'

import { getCurrentUser } from '@/lib/auth'
import { AppSidebar } from '@/components/app-sidebar'

import { LogoutButton } from './LogoutButton'

export const AppShell = async ({
  activePath,
  children,
}: {
  activePath: '/petawilayah' | '/lapor' | '/laporan' | '/komunitas' | '/berita' | '/notifikasi' | '/profil'
  children: ReactNode
}) => {
  const user = await getCurrentUser()

  const navActiveHref =
    activePath === '/laporan' ? '/lapor' : activePath === '/berita' ? '/berita' : activePath

  const activeMeta =
    {
      '/petawilayah': {
        eyebrow: 'Live Monitoring',
        title: 'Peta pesisir real-time',
      },
      '/lapor': {
        eyebrow: 'Form Pelaporan Baru',
        title: 'Laporkan titik pencemaran pesisir',
      },
      '/laporan': {
        eyebrow: 'Detail Laporan',
        title: 'Informasi lengkap & analisis AI',
      },
      '/komunitas': {
        eyebrow: 'Komunitas LautBersih',
        title: 'Kontributor & aktivitas pelaporan',
      },
      '/berita': {
        eyebrow: 'Berita Lingkungan',
        title: 'Liputan pencemaran pesisir Indonesia',
      },
      '/notifikasi': {
        eyebrow: 'Signal Feed',
        title: 'Pembaruan notifikasi laporan',
      },
      '/profil': {
        eyebrow: 'Profil Kontributor',
        title: 'Akun, badge, dan riwayat kontribusi',
      },
    }[activePath] || {
      eyebrow: 'LautBersih',
      title: 'Platform pelaporan sampah pesisir',
    }

  return (
    <div className="lb-app-shell">
      <AppSidebar activeHref={navActiveHref} user={user} />

      <div className="lb-workspace">
        <header className="lb-topbar">
          <div className="lb-topbar__intro">
            <div>
              <p className="lb-eyebrow">{activeMeta.eyebrow}</p>
              <strong>{activeMeta.title}</strong>
            </div>
          </div>
            <div className="lb-topbar__actions">
              <Link className="lb-mini-link" href="/notifikasi">
                Notifikasi
              </Link>
              {user ? (
                <div className="lb-topbar__user">
                  <Link className="lb-topbar__user-info" href="/profil">
                    <div className="lb-topbar__avatar">
                      {(user.fullName ?? user.email ?? 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="lb-topbar__user-meta">
                      <strong>{user.fullName ?? user.email}</strong>
                      <span className={`lb-topbar__role lb-topbar__role--${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'reporter' ? 'Reporter' : 'User'}
                      </span>
                    </div>
                  </Link>
                  <LogoutButton />
                </div>
              ) : (
                <Link className="lb-mini-link" href="/login">
                  Masuk
                </Link>
              )}
            </div>
          </header>
          <main className="lb-main">{children}</main>
      </div>
    </div>
  )
}
