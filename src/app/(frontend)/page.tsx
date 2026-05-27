import Link from 'next/link'
import { Suspense } from 'react'

import LogoLoop from '@/components/LogoLoop'
import { HomeHero } from '@/components/lautbersih/HomeHero'
import { LautBersihGlobe } from '@/components/lautbersih/LautBersihGlobe'
import {
  LatestReportsSection,
  LatestReportsSectionSkeleton,
} from '@/components/lautbersih/LatestReportsSection'
import type { FrontendReport } from '@/lib/reports'
import { buildDashboardStats, getReports, getSiteSettings } from '@/lib/reports'
import { getPayloadClient } from '@/lib/getPayloadClient'

import { getCurrentUser } from '@/lib/auth'
import ReporterRegistrationCta from './ReporterRegistrationCta'
import type { ReporterRegistrationStep } from './registrasi-reporter/RegistrasiReporterClient'

export const dynamic = 'force-dynamic'

const fallbackReports: FrontendReport[] = [
  {
    category: { color: '#52B788', id: 'fallback-1', slug: 'polusi-kimia', title: 'Polusi Kimia' },
    description:
      'Terdeteksi tumpahan minyak skala menengah di dekat jalur pelayaran padat. Perlu containment awal dan verifikasi lapangan.',
    estimatedVolume: 'large',
    id: 'fallback-1',
    latitude: -5.9,
    locationLabel: 'Kepulauan Seribu',
    longitude: 106.75,
    photoUrls: [],
    recommendations: ['Mobilisasi oil boom dalam 60 menit.', 'Lakukan inspeksi kapal terdekat.'],
    reporterName: 'Sistem LautBersih',
    severity: 'critical',
    slug: 'fallback-1',
    status: 'pending_review',
    submittedAt: new Date().toISOString(),
    summary: 'Sinyal termal dan visual menunjukkan kemungkinan tumpahan minyak aktif.',
    title: 'Tumpahan Minyak Lepas Pantai',
  },
  {
    category: { color: '#52B788', id: 'fallback-2', slug: 'konservasi', title: 'Konservasi' },
    description:
      'Verifikasi keberhasilan transplantasi karang menunjukkan pertumbuhan stabil dan dampak positif terhadap habitat lokal.',
    estimatedVolume: 'small',
    id: 'fallback-2',
    latitude: -5.84,
    locationLabel: 'Karimunjawa',
    longitude: 110.43,
    photoUrls: [],
    recommendations: ['Lanjutkan pemantauan periodik.', 'Gunakan data sebagai benchmark nasional.'],
    reporterName: 'Tim Monitoring',
    severity: 'low',
    slug: 'fallback-2',
    status: 'validated',
    submittedAt: new Date().toISOString(),
    summary: 'Tidak ada anomali, area menunjukkan pemulihan yang stabil.',
    title: 'Restorasi Terumbu Karang',
  },
]

async function getPartners() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'partners',
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: 'order',
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [settings, rawReports, partners, user] = await Promise.all([
    getSiteSettings(),
    getReports(12),
    getPartners(),
    getCurrentUser(),
  ])
  const reports = rawReports.length > 0 ? rawReports : fallbackReports
  const stats = buildDashboardStats(reports)
  const userRole = user?.role

  let registrationSteps: ReporterRegistrationStep[] = []
  let hasPendingApp = false
  if (userRole === 'user' && user) {
    const payload = await getPayloadClient()
    const [registrationData, existingApp] = await Promise.all([
      payload.findGlobal({
        slug: 'reporter-registration',
      }),
      payload.find({
        collection: 'reporter-applications',
        where: {
          user: { equals: user.id },
          status: { equals: 'pending' },
        },
        limit: 1,
      }),
    ])
    registrationSteps = registrationData?.steps || []
    hasPendingApp = existingApp.totalDocs > 0
  }

  return (
    <div className="lb-home">
      <header className="lb-home__nav-wrap">
        <nav className="lb-home__nav">
          <div className="lb-home__brand-group">
            <Link className="lb-home__brand" href="/">
              LautBersih
            </Link>
            <div className="lb-home__links">
              <Link className="is-active" href="/dashboard">
                Dashboard
              </Link>
              <Link href="/profil">Armada</Link>
              <Link href="/petawilayah">Peta Wilayah</Link>
              {(userRole === 'admin' || userRole === 'reporter') && (
                <Link href="/lapor">Dokumen</Link>
              )}
            </div>
          </div>
          {(userRole === 'admin' || userRole === 'reporter') && (
            <Link className="lb-home__cta" href="/lapor">
              Buat Laporan
            </Link>
          )}
        </nav>
      </header>

      <HomeHero
        badge={settings.heroBadge}
        banners={settings.heroBanners}
        description={settings.heroDescription}
        primaryAction={settings.heroPrimaryAction}
        secondaryAction={settings.heroSecondaryAction}
        title={settings.heroTitle}
      />

      {userRole === 'user' && user && (
        <ReporterRegistrationCta
          hasPendingApp={hasPendingApp}
          steps={registrationSteps}
          userId={user.id}
        />
      )}

      {partners.length > 0 && (
        <section className="lb-home__partners">
          <div className="lb-home__partners-head">
            <div className="lb-home__partners-label">Dipercayai oleh</div>
            <h2 className="lb-home__partners-title">Mitra Strategis Pelindung Maritim Indonesia</h2>
          </div>
          <div className="lb-home__partners-loop">
            <LogoLoop
              logos={partners
                .map((partner) => {
                  const logo = partner.logo as { cloudinaryUrl?: string; url?: string } | undefined
                  const src = logo?.cloudinaryUrl || logo?.url || ''
                  return {
                    src,
                    alt: partner.name,
                    href: partner.website || undefined,
                    title: partner.name,
                  }
                })
                .filter((item) => item.src)}
              speed={60}
              direction="left"
              logoHeight={80}
              gap={96}
              hoverSpeed={0}
              fadeOut
              fadeOutColor="#0b2540"
              scaleOnHover
              ariaLabel="Partner dan institusi yang dipercayai"
            />
          </div>
        </section>
      )}

      <section className="lb-home__stats-wrap">
        <div className="lb-home__stats-grid">
          <div className="lb-home__stat-card">
            <strong>{stats.total || 1284}</strong>
            <span>Total Laporan</span>
            <small>Updated 2 mins ago</small>
          </div>
          <div className="lb-home__stat-card">
            <strong className="is-danger">{stats.criticalCount || 42}</strong>
            <span>Laporan Critical</span>
            <small>Real-time sync</small>
          </div>
          <div className="lb-home__stat-card">
            <strong className="is-success">98%</strong>
            <span>Sudah Ditindak</span>
            <small>Target KPI: 95%</small>
          </div>
        </div>
      </section>

      <Suspense fallback={<LatestReportsSectionSkeleton />}>
        <LatestReportsSection />
      </Suspense>

      <section className="lb-home__map-section">
        <div className="lb-home__map-copy">
          <h2>Peta Monitoring Interaktif</h2>
          <p>
            Visualisasi data spasial dari seluruh perairan Indonesia. Hubungkan data laporan dengan
            visualisasi situasional yang lebih hidup dan futuristik.
          </p>
          <ul>
            <li>Pelacakan Kapal Real-time</li>
            <li>Heatmap Polusi & Sampah</li>
            <li>Batas Area Konservasi</li>
          </ul>
          <Link className="lb-home__hero-primary" href="/petawilayah">
            Buka Peta Wilayah
          </Link>
        </div>

        <LautBersihGlobe reports={reports} />
      </section>

      <footer className="lb-home__footer">
        <div className="lb-home__footer-grid">
          <div>
            <span className="lb-home__footer-brand">LautBersih</span>
            <p>
              Melindungi warisan maritim Indonesia melalui teknologi analisis real-time dan sistem
              otoritas yang terintegrasi penuh.
            </p>
            <small>© 2024 LautBersih Maritime Authority.</small>
          </div>

          <div className="lb-home__footer-links">
            <div>
              <span>Internal</span>
              <Link href="/dashboard">Dashboard Armada</Link>
              <Link href="/petawilayah">Pusat Data Peta</Link>
              {(userRole === 'admin' || userRole === 'reporter') && (
                <Link href="/lapor">Protokol Respon</Link>
              )}
            </div>
            <div>
              <span>Legalitas</span>
              <Link href="/profil">Kebijakan Privasi</Link>
              <Link href="/profil">Syarat & Ketentuan</Link>
              <Link href="/dashboard">Laporan Tahunan</Link>
            </div>
          </div>
        </div>
      </footer>

      {(userRole === 'admin' || userRole === 'reporter') && (
        <Link className="lb-home__fab" href="/lapor">
          +
        </Link>
      )}
    </div>
  )
}
