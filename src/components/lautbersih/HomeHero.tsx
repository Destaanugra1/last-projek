'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { SiteHeroAction, SiteHeroBanner } from '@/lib/reports'

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

  const hasBanners = banners.length > 0
  const isCarousel = banners.length > 1
  const primaryBanner = banners[0] ?? null
  const activeBanner = (isCarousel ? banners[activeIndex] : primaryBanner) ?? null
  const activeBannerReady =
    !activeBanner || loadedBannerIds[activeBanner.id] || failedBannerIds[activeBanner.id]
  const detailEyebrow = activeBanner?.eyebrow || null
  const detailTitle = activeBanner?.title || null
  const detailDescription = activeBanner?.description || description

  const markBannerFailed = (bannerId: string) => {
    setFailedBannerIds((current) => (current[bannerId] ? current : { ...current, [bannerId]: true }))
  }

  const markBannerLoaded = (bannerId: string) => {
    setLoadedBannerIds((current) => (current[bannerId] ? current : { ...current, [bannerId]: true }))
  }

  useEffect(() => {
    if (!isCarousel) {
      setActiveIndex(0)
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length)
    }, AUTO_ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [banners.length, isCarousel])

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
    <section className="lb-home__hero">
      <div className="lb-home__hero-media" aria-hidden="true">
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
