import Image from 'next/image'
import Link from 'next/link'

import { getCurrentUser } from '@/lib/auth'

import { LogoutButton } from './LogoutButton'

export const Navbar = async () => {
  const user = await getCurrentUser()
  const initials = user
    ? ((user.fullName ?? user.email ?? 'U') as string).slice(0, 2).toUpperCase()
    : null
  const avatarUrl = (user as { avatarUrl?: string | null } | null)?.avatarUrl ?? null

  return (
    <header className="lb-global-nav">
      <div className="lb-global-nav__inner">
        <Link className="lb-global-nav__brand" href="/">
          <span className="lb-global-nav__mark">L</span>
          <span className="lb-global-nav__brand-name">LautBersih</span>
        </Link>

        <nav className="lb-global-nav__links">
          <Link className="lb-global-nav__link" href="/">
            Beranda
          </Link>
          <Link className="lb-global-nav__link" href="/petawilayah">
            Peta Wilayah
          </Link>
          <Link className="lb-global-nav__link" href="/dashboard">
            Dashboard
          </Link>
          <Link className="lb-global-nav__link" href="/berita">
            Berita
          </Link>
          {user && user.role !== 'user' && (
            <>
              <Link className="lb-global-nav__link" href="/lapor">
                Lapor
              </Link>
              <Link className="lb-global-nav__link" href="/laporan">
                Laporan
              </Link>
            </>
          )}
        </nav>

        <div className="lb-global-nav__actions">
          {user ? (
            <div className="lb-global-nav__user">
              <Link className="lb-global-nav__user-chip" href="/profil">
                <div className="lb-global-nav__avatar">
                  {avatarUrl ? (
                    <Image
                      alt="avatar"
                      fill
                      sizes="32px"
                      src={avatarUrl}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <span>{(user.fullName ?? user.email ?? '') as string}</span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="lb-global-nav__auth">
              <Link className="lb-global-nav__login" href="/login">
                Masuk
              </Link>
              <Link className="lb-global-nav__register" href="/register">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
