import Link from 'next/link'

import { getSiteSettings } from '@/lib/reports'

export default async function OnboardingPage() {
  const settings = await getSiteSettings()

  const slides = [
    {
      body: 'Lihat sebaran laporan sampah di pesisir secara real-time lewat peta interaktif.',
      title: 'Temukan Titik Pencemaran',
    },
    {
      body: 'Foto lokasi, isi deskripsi, lalu kirim laporan dengan alur yang cepat dan jelas.',
      title: 'Laporkan dengan Mudah',
    },
    {
      body: 'Setiap laporan membantu relawan dan admin bergerak menjaga ekosistem laut.',
      title: 'Bersama Jaga Laut Kita',
    },
  ]

  return (
    <div className="lb-onboarding-shell">
      <div className="lb-onboarding-bg" />
      <section className="lb-splash-card">
        <div className="lb-splash-card__head">
          <p className="lb-eyebrow">Welcome Aboard</p>
          <Link className="lb-mini-link" href="/petawilayah">
            Lewati
          </Link>
        </div>
        <div className="lb-splash-mark">
          <div className="lb-splash-orb" />
          <span className="lb-brand__mark">L</span>
        </div>
        <h1>{settings.siteName}</h1>
        <p>{settings.tagline}</p>
        <div className="lb-dot-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="lb-onboarding-panel">
        <div className="lb-onboarding-panel__copy">
          <p className="lb-eyebrow">Onboarding</p>
          <h2>Mulai dari alur yang ringan, cepat, dan siap dipakai di lapangan.</h2>
        </div>
        <div className="lb-onboarding-grid">
          {slides.map((slide, index) => (
            <article className="lb-onboarding-card" key={slide.title}>
              <span className="lb-slide-badge">0{index + 1}</span>
              <h3>{slide.title}</h3>
              <p>{slide.body}</p>
            </article>
          ))}
        </div>
        <div className="lb-onboarding-actions">
          <div className="lb-onboarding-dots" aria-label="Indikator slide">
            <span className="is-active" />
            <span />
            <span />
          </div>
          <div className="lb-hero__actions">
            <Link className="lb-button" href="/lapor">
              Mulai Sekarang
            </Link>
            <Link className="lb-button lb-button--ghost" href="/petawilayah">
              Buka Peta
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
