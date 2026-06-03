'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { SiteHeroAction, SiteHeroBanner } from '@/lib/reports'

gsap.registerPlugin(ScrollTrigger)

type HomeHeroProps = {
  badge: string
  banners: SiteHeroBanner[]
  description: string
  primaryAction: SiteHeroAction
  secondaryAction: SiteHeroAction
  title: string
}

const AUTO_ROTATE_MS = 5500

export function HomeHero({
  badge,
  banners,
  description,
  primaryAction,
  secondaryAction,
  title,
}: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedBannerIds, setFailedBannerIds] = useState<Record<string, boolean>>({})
  const [loadedBannerIds, setLoadedBannerIds] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLElement>(null)
  const hasRevealedRef = useRef(false)

  const hasBanners = banners.length > 0
  const isCarousel = banners.length > 1
  const primaryBanner = banners[0] ?? null
  const activeBanner = (isCarousel ? banners[activeIndex] : primaryBanner) ?? null
  const activeBannerReady =
    !activeBanner || loadedBannerIds[activeBanner.id] || failedBannerIds[activeBanner.id]
  const detailEyebrow = activeBanner?.eyebrow || null
  const detailDescription = activeBanner?.description || description

  const markBannerFailed = (bannerId: string) => {
    setFailedBannerIds((current) => (current[bannerId] ? current : { ...current, [bannerId]: true }))
  }

  const markBannerLoaded = (bannerId: string) => {
    setLoadedBannerIds((current) => (current[bannerId] ? current : { ...current, [bannerId]: true }))
  }

  useEffect(() => {
    if (!isCarousel) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length)
    }, AUTO_ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [banners.length, isCarousel])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const section = sectionRef.current

    if (!section) {
      return
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1,
        animation: gsap.timeline()
          .to('.lb-home__hero-image', { yPercent: 11, scale: 1.08, ease: 'none' }, 0)
          .to('.lb-home__hero-overlay', { yPercent: 8, opacity: 0.9, ease: 'none' }, 0)
          .to('.lb-home__hero-vignette', { yPercent: -8, opacity: 1, ease: 'none' }, 0)
          .to('.lb-home__hero-glass-left', { yPercent: -10, ease: 'none' }, 0)
          .to('.lb-home__hero-glass-right', { yPercent: -14, ease: 'none' }, 0)
          .to('.lb-home__wave', { yPercent: -22, ease: 'none' }, 0),
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const section = sectionRef.current

    if (!section) {
      return
    }

    const runReveal = () => {
      if (hasRevealedRef.current) {
        return
      }

      hasRevealedRef.current = true

      gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(
          '.lb-home__hero-base-fill',
          { scale: 1.08, opacity: 0.72 },
          { scale: 1, opacity: 1, duration: 1.1 },
        )
          .fromTo(
            '.lb-home__hero-image',
            { scale: 1.1, opacity: 0.22 },
            { scale: 1, opacity: 1, duration: 1.15 },
            0,
          )
          .fromTo(
            '.lb-home__hero-overlay, .lb-home__hero-vignette',
            { opacity: 0 },
            { opacity: 1, duration: 0.9 },
            0.08,
          )
          .fromTo(
            '.lb-home__hero-glass-left',
            { autoAlpha: 0, x: -44, y: 20 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.7 },
            0.16,
          )
          .fromTo(
            '.lb-home__hero-glass-right',
            { autoAlpha: 0, x: 54, y: 24 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.76 },
            0.24,
          )
          .fromTo(
            '.lb-home__hero-actions > *',
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.08 },
            0.42,
          )
          .fromTo(
            '.lb-home__hero-indicators button, .lb-home__wave',
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.56, stagger: 0.06 },
            0.5,
          )
      }, section)
    }

    const preloaderEl = document.querySelector('.preloader')
    const preloaderVisible =
      preloaderEl instanceof HTMLElement &&
      preloaderEl.style.display !== 'none' &&
      preloaderEl.style.opacity !== '0'
    const fallbackTimer = window.setTimeout(runReveal, preloaderVisible ? 1300 : 140)
    window.addEventListener('lb:preloader-complete', runReveal)

    return () => {
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('lb:preloader-complete', runReveal)
    }
  }, [])

  const renderBannerImage = (banner: SiteHeroBanner, priority = false) => {
    if (failedBannerIds[banner.id]) {
      return <div className="lb-home__hero-fallback-media" />
    }

    return (
      <Image
        alt={banner.alt}
        className="lb-home__hero-image"
        fill
        onError={() => markBannerFailed(banner.id)}
        onLoad={() => markBannerLoaded(banner.id)}
        priority={priority}
        quality={82}
        sizes="100vw"
        src={banner.src}
      />
    )
  }

  return (
    <section ref={sectionRef} className="lb-home__hero">
      <div className="lb-home__hero-media" aria-hidden="true">
        <div className="lb-home__hero-base-fill" />
        {isCarousel ? (
          <div aria-label="Banner hero LautBersih" aria-roledescription="carousel" className="lb-home__hero-carousel">
            {banners.map((banner, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  aria-hidden={!isActive}
                  className={`lb-home__hero-slide${isActive ? ' is-active' : ''}`}
                  key={banner.id}
                >
                  {renderBannerImage(banner, index === 0)}
                </div>
              )
            })}
          </div>
        ) : hasBanners && primaryBanner ? (
          <div className="lb-home__hero-static">{renderBannerImage(primaryBanner, true)}</div>
        ) : (
          <div className="lb-home__hero-fallback-media" />
        )}

        <div className="lb-home__hero-overlay" />
        <div className="lb-home__hero-vignette" />

        {hasBanners && !activeBannerReady && (
          <div className="lb-home__hero-loading">
            <span>Memuat banner...</span>
          </div>
        )}
      </div>

      <div className="lb-home__hero-shell">
        <div className="lb-home__hero-content">
          <div className="lb-home__hero-glass-card">
            <div className="lb-home__hero-glass-left">
              {badge && <div className="lb-home__sdg">{badge}</div>}
              <h1>{activeBanner?.title || title}</h1>
            </div>

            <div className="lb-home__hero-glass-right">
              {detailEyebrow && (
                <span className="lb-home__hero-glass-kicker">{detailEyebrow}</span>
              )}
              <p>{detailDescription}</p>

              <div className="lb-home__hero-actions">
                <Link className="lb-home__hero-primary" href={primaryAction.href}>
                  {primaryAction.label}
                </Link>
                <Link className="lb-home__hero-secondary" href={secondaryAction.href}>
                  {secondaryAction.label}
                </Link>
              </div>
            </div>
          </div>

          {isCarousel && (
            <div className="lb-home__hero-indicators">
              {banners.map((banner, index) => (
                <button
                  aria-label={`Tampilkan banner ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  className={index === activeIndex ? 'is-active' : ''}
                  key={`${banner.id}-indicator`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lb-home__wave" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,53.8,17.5,81,25.82,158.2,49.52,241,63.15,321.39,56.44Z"
            fill="#0b2540"
          />
        </svg>
      </div>
    </section>
  )
}
