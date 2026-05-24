import Link from 'next/link'
import type { ReactNode } from 'react'

import { getCurrentUser } from '@/lib/auth'

import { LogoutButton } from './LogoutButton'

export const AppShell = async ({
  activePath,
  children,
}: {
  activePath: '/petawilayah' | '/lapor' | '/laporan' | '/komunitas' | '/berita' | '/notifikasi' | '/profil'
  children: ReactNode
}) => {
  const user = await getCurrentUser()
  const navItems = [
    { href: '/petawilayah', label: 'Peta Wilayah', meta: 'Monitoring Interaktif' },
    { href: '/lapor', label: 'Pelaporan', meta: 'Kirim Laporan Baru' },
    { href: '/komunitas', label: 'Komunitas', meta: 'Kontributor & Aktivitas' },
    { href: '/berita', label: 'Berita', meta: 'Liputan Pencemaran' },
    { href: '/profil', label: 'Profil Saya', meta: 'Akun & Statistik' },
  ] as const

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
      <aside className="lb-sidebar">
        <Link className="lb-brand" href="/">
          <span className="lb-brand__mark">L</span>
          <span>
            <strong>LautBersih</strong>
            <small>Pesisir Indonesia</small>
          </span>
        </Link>

        <nav className="lb-side-nav" aria-label="Navigasi utama desktop">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={item.href === navActiveHref ? 'is-active' : undefined}
              href={item.href}
            >
              <span>{item.label}</span>
              <small>{item.meta}</small>
            </Link>
          ))}
        </nav>

        <Link className="lb-sidebar__cta" href="/lapor">
          Buat Laporan Baru
        </Link>

        <div className="lb-sidebar__meta">
          <span>SDG 14</span>
          <strong>Life Below Water</strong>
          <small>Monitoring dan pelaporan pencemaran pesisir Indonesia.</small>
        </div>
      </aside>

      <div className="lb-workspace">
        <header className="lb-topbar">
          <div className="lb-topbar__intro">
            <p className="lb-eyebrow">{activeMeta.eyebrow}</p>
            <strong>{activeMeta.title}</strong>
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
                      {user.role === 'admin' ? 'Admin' : 'Reporter'}
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

      {/* <nav className="lb-bottom-nav" aria-label="Navigasi utama">
        {[
          { href: '/petawilayah', label: 'Peta' },
          { href: '/lapor', label: 'Laporkan' },
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/profil', label: 'Profil' },
        ].map((item) => (
          <Link
            key={item.href}
            className={`${item.href === activePath ? 'is-active' : ''}${
              item.href === '/lapor' ? ' lb-bottom-nav__cta' : ''
            }`.trim()}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav> */}
    </div>
  )
}
