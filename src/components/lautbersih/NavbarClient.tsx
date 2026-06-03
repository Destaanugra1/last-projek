'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { gsap } from 'gsap'

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
  const headerRef = useRef<HTMLElement>(null)
  const bgLayerRef = useRef<HTMLDivElement>(null)
  const mobileWrapRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // ── Desktop: transparent → solid bg on scroll ──────────────────────
  useEffect(() => {
    const bgLayer = bgLayerRef.current
    if (!bgLayer) return

    // Start: non-homepage always solid; homepage starts transparent
    gsap.set(bgLayer, { opacity: isHomePage ? 0 : 1 })

    if (!isHomePage) return // non-homepage: always solid, no listener needed

    const onScroll = () => {
      const target = window.scrollY > 40 ? 1 : 0
      gsap.to(bgLayer, {
        opacity: target,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHomePage])

  // ── Mobile: hide on scroll-down / show on scroll-up (GSAP fixed) ───
  useEffect(() => {
    const mobileEl = mobileWrapRef.current
    if (!mobileEl) return

    let lastY = window.scrollY
    let hidden = false
    let raf: number | null = null

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const currentY = window.scrollY
        const delta = currentY - lastY
        lastY = currentY

        if (currentY < 80) {
          // near top → always show
          if (hidden) {
            gsap.to(mobileEl, { y: 0, duration: 0.35, ease: 'power3.out' })
            hidden = false
          }
        } else if (delta > 4 && !hidden) {
          // scrolling DOWN → hide
          gsap.to(mobileEl, { y: '-110%', duration: 0.4, ease: 'power3.inOut' })
          hidden = true
        } else if (delta < -4 && hidden) {
          // scrolling UP → show
          gsap.to(mobileEl, { y: 0, duration: 0.38, ease: 'power3.out' })
          hidden = false
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // ── Mobile menu: lock scroll & force bg solid ──────────────────────
  useEffect(() => {
    const bgLayer = bgLayerRef.current
    const mobileEl = mobileWrapRef.current

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Force navbar visible and solid when drawer is open
      if (mobileEl) gsap.to(mobileEl, { y: 0, duration: 0.2 })
      if (bgLayer) gsap.to(bgLayer, { opacity: 1, duration: 0.2 })
    } else {
      document.body.style.overflow = ''
      // Restore transparent if at top of homepage
      if (bgLayer && isHomePage && window.scrollY <= 40) {
        gsap.to(bgLayer, { opacity: 0, duration: 0.3 })
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen, isHomePage])

  const closeMenu = () => setIsMobileMenuOpen(false)

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Peta Wilayah', href: '/petawilayah' },
    { label: 'Berita', href: '/berita' },
  ]
  if (user) {
    navLinks.splice(2, 0, { label: 'Dashboard', href: '/dashboard' })
    if (user.role !== 'user') {
      navLinks.push({ label: 'Lapor', href: '/lapor' })
      navLinks.push({ label: 'Laporan', href: '/laporan' })
    }
  }

  // Shared nav background layer (rendered once, used by both desktop + mobile)
  const bgLayer = (
    <div
      ref={bgLayerRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(180deg, rgba(11,37,64,0.97) 0%, rgba(8,27,46,0.96) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 32px rgba(11,37,64,0.22)',
        opacity: 0,  // GSAP controls this
      }}
    />
  )

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP HEADER — position sticky (no transform needed)
      ═══════════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="lb-global-nav hidden md:block fixed top-0 left-0 right-0 z-[1200]"
      >
        {bgLayer}

        <div className="lb-global-nav__inner relative z-10">
          <Link className="lb-global-nav__brand" href="/">
            <span className="lb-global-nav__mark">L</span>
            <span className="lb-global-nav__brand-name">LautBersih</span>
          </Link>

          <nav className="lb-global-nav__links">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  className={`lb-global-nav__link${isActive ? ' is-active' : ''}`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="lb-global-nav__actions">
            {user ? (
              <div className="lb-global-nav__user">
                <Link className="lb-global-nav__user-chip" href="/profil">
                  <div className="lb-global-nav__avatar">
                    {avatarUrl ? (
                      <Image alt="avatar" fill sizes="32px" src={avatarUrl}
                        style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    ) : initials}
                  </div>
                  <span>{(user.fullName ?? user.email ?? '') as string}</span>
                </Link>
              </div>
            ) : (
              <div className="lb-global-nav__auth">
                <Link className="lb-global-nav__login" href="/login">Masuk</Link>
                <Link className="lb-global-nav__register" href="/register">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE HEADER WRAPPER — position fixed, GSAP controls y
      ═══════════════════════════════════════════════════════════ */}
      <div
        ref={mobileWrapRef}
        className="lb-mobile-nav-wrap md:hidden fixed top-0 left-0 right-0 z-[1400]"
        style={{ willChange: 'transform' }}
      >
        {/* Mobile background layer — separate from desktop bgLayerRef */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(11,37,64,0.97) 0%, rgba(8,27,46,0.96) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 4px 32px rgba(11,37,64,0.22)',
          }}
        />

        <div className="relative z-10 flex items-center justify-between h-16 px-4">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 text-white">
            <span className="lb-global-nav__mark">L</span>
            <span className="lb-global-nav__brand-name text-white">LautBersih</span>
          </Link>

          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind fixed desktop nav on non-home pages */}
      {!isHomePage && <div className="hidden md:block h-16" />}

      {/* Spacer so content isn't hidden behind fixed mobile nav */}
      <div className="lb-mobile-nav-spacer md:hidden h-16" />

      {/* ── Mobile Overlay ─────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#081b2e]/70 backdrop-blur-sm z-[1350] md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      <div
        className="fixed top-0 right-0 h-full w-[80vw] max-w-[320px] bg-[#0b2540] border-l border-white/10 shadow-2xl z-[1450] flex flex-col md:hidden transition-transform duration-300 ease-in-out"
        style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5 shrink-0">
          <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Navigasi</span>
          <button
            onClick={closeMenu}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-5 px-4 flex flex-col gap-1.5">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{ color: '#fff' }}
                className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#1d9e75]/15 border-l-2 border-[#1d9e75]'
                    : 'text-white/80 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="mt-6 mb-4 border-t border-white/5" />

          {user ? (
            <Link
              href="/profil"
              onClick={closeMenu}
              className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1d9e75] text-white text-sm font-extrabold overflow-hidden shrink-0">
                {avatarUrl ? (
                  <Image alt="avatar" fill sizes="40px" src={avatarUrl}
                    style={{ borderRadius: '50%', objectFit: 'cover' }} />
                ) : initials}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-white text-sm font-semibold truncate">
                  {(user.fullName ?? user.email ?? '') as string}
                </span>
                <span className="text-white/50 text-xs truncate">{user.email}</span>
              </div>
            </Link>
          ) : (
            <div className="flex flex-col gap-3 px-2">
              <Link href="/login" onClick={closeMenu}
                style={{ color: '#fff' }}
                className="flex items-center justify-center w-full py-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-colors">
                Masuk
              </Link>
              <Link href="/register" onClick={closeMenu}
                style={{ color: '#fff' }}
                className="flex items-center justify-center w-full py-3 bg-[#1d9e75] text-white rounded-xl text-sm font-bold hover:bg-[#128b65] transition-colors">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
