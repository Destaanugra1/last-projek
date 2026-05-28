'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

// import { LogoutButton } from './LogoutButton'

type UserProp = {
  id: string | number
  email: string
  role?: string
  fullName?: string | null
  avatarUrl?: string | null
} | null

interface NavbarClientProps {
  user: UserProp
  initials: string | null
  avatarUrl: string | null
}

export const NavbarClient = ({ user, initials, avatarUrl }: NavbarClientProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const closeMenu = () => setIsMobileMenuOpen(false)

  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // Only transparent if on home page, not scrolled, and mobile menu is closed
  const isSolid = !isHomePage || isScrolled || isMobileMenuOpen

  // Transition classes for smooth bg/border changes.
  // Add absolute position when on home page so it overlays the hero image without pushing it down.
  const headerClasses = `lb-global-nav transition-all duration-500 ease-in-out ${isHomePage ? '!fixed w-full' : ''}`

  // Override the BEM background and border completely so we can use a custom fading layer for butter-smooth transitions
  const headerStyle = {
    background: 'transparent',
    borderColor: 'transparent',
    boxShadow: 'none',
    backdropFilter: 'none',
  }

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Peta Wilayah', href: '/petawilayah' },
    { label: 'Berita', href: '/berita' },
  ]

  // Only show Dashboard if user is authenticated
  if (user) {
    // Insert dashboard after Peta Wilayah (index 2)
    navLinks.splice(2, 0, { label: 'Dashboard', href: '/dashboard' })
    
    // Add reporter/admin specific routes
    if (user.role !== 'user') {
      navLinks.push({ label: 'Lapor', href: '/lapor' })
      navLinks.push({ label: 'Laporan', href: '/laporan' })
    }
  }

  return (
    <>
      <header className={headerClasses} style={headerStyle}>
        {/* Smooth fading background layer */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(11, 37, 64, 0.98), rgba(8, 27, 46, 0.97))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 24px rgba(11, 37, 64, 0.18)',
            backdropFilter: 'blur(16px)',
            opacity: isSolid ? 1 : 0,
          }}
        />

        <div className="lb-global-nav__inner relative z-10">
          <Link className="lb-global-nav__brand" href="/" onClick={closeMenu}>
            <span className="lb-global-nav__mark">L</span>
            <span className="lb-global-nav__brand-name">LautBersih</span>
          </Link>

          {/* Desktop Nav - BEM CSS already hides this on mobile via .lb-global-nav__links { display: none } on max-width 768px */}
          <nav className="lb-global-nav__links">
            {navLinks.map((link) => (
              <Link key={link.href} className="lb-global-nav__link" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - We'll add hidden md:flex here because by default they were visible on mobile */}
          <div className="lb-global-nav__actions lb-global-nav__actions--desktop">
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
                {/*<LogoutButton />*/}
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

          {/* Mobile Menu Button - visible only on mobile/tablet */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-colors z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-[#081b2e]/60 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Drawer Sidebar */}
      <div
        className={`lb-global-nav__drawer fixed top-0 right-0 h-full w-[80vw] max-w-[320px] bg-[#0b2540] border-l border-white/10 shadow-2xl z-[55] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-start h-16 px-6 border-b border-white/5 shrink-0">
          <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Navigasi</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/10 focus:outline-none rounded-xl font-medium transition-colors"
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-8 mb-4 border-t border-white/5" />

          {/* Mobile User/Auth Actions */}
          <div className="flex flex-col gap-3 px-2">
            {user ? (
              <>
                <Link
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-colors"
                  href="/profil"
                  onClick={closeMenu}
                >
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1d9e75] text-white text-sm font-extrabold overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <Image
                        alt="avatar"
                        fill
                        sizes="40px"
                        src={avatarUrl}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white text-sm font-semibold truncate">
                      {(user.fullName ?? user.email ?? '') as string}
                    </span>
                    <span className="text-white/50 text-xs truncate">{user.email}</span>
                  </div>
                </Link>
                <div
                  onClick={closeMenu}
                  className="mt-2 flex w-full [&>button]:w-full [&>button]:py-3 [&>button]:text-sm"
                >
                  {/*<LogoutButton />*/}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  className="flex items-center justify-center w-full py-3 text-white bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:outline-none border border-white/10 rounded-xl text-sm font-semibold transition-colors"
                  href="/login"
                  onClick={closeMenu}
                >
                  Masuk
                </Link>
                <Link
                  className="flex items-center justify-center w-full py-3 bg-[#1d9e75] text-white rounded-xl text-sm font-bold hover:bg-[#128b65] focus:bg-[#128b65] focus:outline-none transition-colors"
                  href="/register"
                  onClick={closeMenu}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .lb-global-nav {
          z-index: 1200;
        }

        .lb-global-nav__inner {
          gap: 0.75rem;
          min-width: 0;
        }

        .lb-global-nav__brand {
          min-width: 0;
          flex-shrink: 1;
        }

        .lb-global-nav__brand-name {
          min-width: 0;
        }

        .lb-global-nav__actions--desktop {
          display: flex;
          min-width: 0;
          margin-left: auto;
        }

        .lb-global-nav__user {
          min-width: 0;
        }

        .lb-global-nav__user-chip {
          min-width: 0;
          max-width: min(40vw, 220px);
        }

        .lb-global-nav__user-chip span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .lb-global-nav {
            z-index: 1400;
          }

          .lb-global-nav__actions--desktop {
            display: none;
          }

          .lb-global-nav__inner {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }

          .lb-global-nav__brand,
          .lb-global-nav__brand-name {
            color: #fff;
          }

          .lb-global-nav__brand-name {
            font-size: 1.05rem;
          }

          .lb-global-nav__drawer :global(a) {
            color: #fff;
          }

          .lb-global-nav__drawer :global(span) {
            color: inherit;
          }
        }

        @media (max-width: 420px) {
          .lb-global-nav__inner {
            gap: 0.55rem;
          }

          .lb-global-nav__brand-name {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  )
}
