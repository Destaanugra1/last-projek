import { FileText, MapPin, Newspaper, Send, User, Users } from 'lucide-react'

import {
  AcetSidebar,
  AcetSidebarBody,
  AcetSidebarLink,
  AcetSidebarText,
} from '@/components/ui/aceternity-sidebar'

const navItems = [
  { href: '/petawilayah', label: 'Peta Wilayah', icon: <MapPin size={20} /> },
  { href: '/lapor', label: 'Pelaporan', icon: <FileText size={20} /> },
  { href: '/komunitas', label: 'Komunitas', icon: <Users size={20} /> },
  { href: '/berita', label: 'Berita', icon: <Newspaper size={20} /> },
  { href: '/profil', label: 'Profil Saya', icon: <User size={20} /> },
]

type Props = {
  activeHref: string
  user?: { fullName?: string | null; email?: string | null; role?: string | null } | null
}

export function AppSidebar({ activeHref, user }: Props) {
  const initials = (user?.fullName ?? user?.email ?? 'L').slice(0, 2).toUpperCase()
  const displayName = user?.fullName ?? user?.email ?? 'LautBersih'
  const displayRole = user?.role === 'admin' ? 'Admin' : user?.role === 'reporter' ? 'Reporter' : 'User'
  const canReport = user?.role === 'admin' || user?.role === 'reporter'

  const visibleNavItems = navItems.filter(item => {
    if (item.href === '/lapor' || item.href === '/laporan') {
      return canReport
    }
    return true
  })

  return (
    <AcetSidebar>
      <AcetSidebarBody className="lb-sidebar">
        {/* Brand */}
        <div className="lb-acet-brand">
          <span className="lb-brand__mark">L</span>
          <AcetSidebarText>
            <div className="lb-sidebar__brand-text">
              <strong>LautBersih</strong>
              <small>Pesisir Indonesia</small>
            </div>
          </AcetSidebarText>
        </div>

        {/* Nav */}
        <nav className="lb-acet-nav" aria-label="Navigasi utama">
          {visibleNavItems.map((item) => (
            <AcetSidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={item.href === activeHref}
            />
          ))}
        </nav>

        {/* CTA */}
        {canReport && (
          <AcetSidebarLink
            href="/lapor"
            icon={<Send size={18} />}
            label="Buat Laporan Baru"
            className="lb-acet-nav-link--cta"
          />
        )}

        {/* User footer */}
        <div className="lb-sidebar__footer">
          <div className="lb-acet-user-row">
            <div className="lb-sidebar__avatar">{initials}</div>
            <AcetSidebarText>
              <div className="lb-sidebar__user-text">
                <strong>{displayName}</strong>
                <small>{displayRole}</small>
              </div>
            </AcetSidebarText>
          </div>
          <AcetSidebarText className="lb-sidebar__meta">
            <span>SDG 14</span>
            <strong>Life Below Water</strong>
            <small>Monitoring pencemaran pesisir Indonesia.</small>
          </AcetSidebarText>
        </div>
      </AcetSidebarBody>
    </AcetSidebar>
  )
}