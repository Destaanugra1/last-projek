import Link from 'next/link'
import type { ReactNode } from 'react'

export const AppShell = ({
  activePath,
  children,
}: {
  activePath: '/dashboard' | '/petawilayah' | '/lapor' | '/notifikasi' | '/profil'
  children: ReactNode
}) => {
  const navItems = [
    { href: '/dashboard', label: 'Overview', meta: 'Dashboard Ringkasan' },
    { href: '/petawilayah', label: 'Peta Wilayah', meta: 'Monitoring Interaktif' },
    { href: '/lapor', label: 'Pelaporan', meta: 'Form Laporan Baru' },
    { href: '/profil', label: 'Komunitas', meta: 'Profil Kontributor' },
  ] as const

  const activeMeta =
    {
      '/petawilayah': {
        eyebrow: 'Live Monitoring',
        title: 'Peta pesisir real-time',
      },
      '/dashboard': {
        eyebrow: 'Maritime Control',
        title: 'Ikhtisar operasional LautBersih',
      },
      '/lapor': {
        eyebrow: 'New Incident Report',
        title: 'Form pelaporan maritim terpadu',
      },
      '/notifikasi': {
        eyebrow: 'Signal Feed',
        title: 'Pembaruan notifikasi laporan',
      },
      '/profil': {
        eyebrow: 'Community Hub',
        title: 'Ringkasan akun dan kontribusi',
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
            <small>Maritime Authority</small>
          </span>
        </Link>

        <nav className="lb-side-nav" aria-label="Navigasi utama desktop">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={item.href === activePath ? 'is-active' : undefined}
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
            <Link className="lb-mini-link" href="/mulai">
              Onboarding
            </Link>
            <Link className="lb-mini-link" href="/notifikasi">
              Signal Feed
            </Link>
            <Link className="lb-mini-link" href="/profil">
              Community
            </Link>
          </div>
        </header>
        <main className="lb-main">{children}</main>
      </div>

      <nav className="lb-bottom-nav" aria-label="Navigasi utama">
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
      </nav>
    </div>
  )
}
