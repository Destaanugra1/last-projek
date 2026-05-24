import Link from 'next/link'

import LogoLoop from '@/components/LogoLoop'
import { LautBersihGlobe } from '@/components/lautbersih/LautBersihGlobe'
import type { FrontendReport } from '@/lib/reports'
import { buildDashboardStats, getReports, getSiteSettings } from '@/lib/reports'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/getPayloadClient'

export const dynamic = 'force-dynamic'

const severityCopy: Record<FrontendReport['severity'], { label: string; tone: string }> = {
  critical: { label: 'Critical', tone: 'critical' },
  low: { label: 'Routine', tone: 'routine' },
  medium: { label: 'Elevated', tone: 'elevated' },
}

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

const formatReportId = (report: FrontendReport, index: number) =>
  `LB-2024-${String(index + 891).padStart(4, '0')}`

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
  const [settings, rawReports, partners] = await Promise.all([
    getSiteSettings(),
    getReports(12),
    getPartners(),
  ])
  const reports = rawReports.length > 0 ? rawReports : fallbackReports
  const stats = buildDashboardStats(reports)
  const featuredReports = reports.slice(0, 2)

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
              <Link href="/lapor">Dokumen</Link>
            </div>
          </div>
          <Link className="lb-home__cta" href="/lapor">
            Buat Laporan
          </Link>
        </nav>
      </header>

      <section className="lb-home__hero">
        <div className="lb-home__hero-content">
          <div className="lb-home__sdg">SDG 14 · Life Below Water</div>
          <h1>Otoritas Maritim untuk Ekosistem Laut Indonesia yang Berkelanjutan</h1>
          <p>
            {settings.heroDescription} Memantau, menganalisis, dan menindaklanjuti ancaman maritim
            secara real-time untuk melindungi kekayaan hayati nusantara.
          </p>
          <div className="lb-home__hero-actions">
            <Link className="lb-home__hero-primary" href="/petawilayah">
              Mulai Monitoring
            </Link>
            <Link className="lb-home__hero-secondary" href="/mulai">
              Pelajari Protokol
            </Link>
          </div>
        </div>
        <div className="lb-home__wave" aria-hidden="true">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,52.43,56.97,28.73,114.91,59.24,176.6,61.24,88.15,2.83,167-34,240.2-76.29,48.16-27.77,103.15-47.58,158.3-43.07V0Z"
              fill="#f7f9ff"
              opacity="0.1"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5V0Z"
              fill="#f7f9ff"
              opacity="0.2"
            />
            <path
              d="M37.5,95.44C48.33,90.33,72,82.6,113.5,82.6c52.75,0,80,21.5,135,21.5,56.25,0,82-21.5,134.5-21.5,52.5,0,80,21.5,135,21.5s82-21.5,134.5-21.5,80,21.5,135,21.5,82-21.5,134.5-21.5c52.5,0,76,8.67,113.5,12.83V120H0V95.44Z"
              fill="#f7f9ff"
              opacity="0.4"
            />
            <path
              d="M0,120V0c150,55,314.1,71.32,475.8,42.57,43-7.64,84.2-20.12,127.6-26.46,59-8.63,112.5,12.24,165.6,35.4,89.5,38.71,147.6,56.73,212.8,51.49,86.5-7,172.5-45.71,248.8-84.81V120H0Z"
              fill="#f7f9ff"
            />
          </svg>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="lb-home__partners">
          <div className="lb-home__partners-head">
            <div className="lb-home__partners-label">Dipercayai oleh</div>
            <h2 className="lb-home__partners-title">
              Mitra Strategis Pelindung Maritim Indonesia
            </h2>
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

      <section className="lb-home__section">
        <div className="lb-home__section-head">
          <div>
            <h2>Daftar Laporan Terkini</h2>
            <p>
              Monitor aktivitas maritim secara real-time. Setiap laporan telah dianalisis untuk
              mendukung akurasi operasional.
            </p>
          </div>
          <div className="lb-home__section-actions">
            <Link className="lb-home__toolbar-btn" href="/petawilayah">
              Filter
            </Link>
            <Link className="lb-home__toolbar-btn" href="/dashboard">
              Ekspor Data
            </Link>
          </div>
        </div>

        <div className="lb-home__reports-grid">
          {featuredReports.map((report, index) => {
            const severity = severityCopy[report.severity]

            return (
              <Link className="lb-home__report-card" href={`/laporan/${report.slug}`} key={report.id}>
                <div className={`lb-home__report-rail lb-home__report-rail--${severity.tone}`} />
                <div className="lb-home__report-head">
                  <div className="lb-home__report-title-row">
                    <div className="lb-home__report-thumb">
                      {report.photoUrls[0] ? (
                        <Image alt={report.title} src={report.photoUrls[0]} fill sizes="64px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="lb-home__report-thumb-fallback">LB</div>
                      )}
                    </div>
                    <div>
                      <h3>{report.title}</h3>
                      <p>
                        ID: {formatReportId(report, index)} •{' '}
                        {new Date(report.submittedAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`lb-home__severity lb-home__severity--${severity.tone}`}>
                    {severity.label}
                  </span>
                </div>

                <p className="lb-home__report-description">{report.description}</p>

                <div className="lb-home__analysis-card">
                  <div className="lb-home__analysis-head">AI Analysis Result</div>
                  <div className="lb-home__analysis-grid">
                    <div>
                      <span>Kategori</span>
                      <strong>{report.category?.title || 'Tanpa Kategori'}</strong>
                    </div>
                    <div>
                      <span>Severity</span>
                      <strong>{report.severity === 'critical' ? 'High Alert' : 'Low Impact'}</strong>
                    </div>
                  </div>
                  <div className="lb-home__analysis-note">
                    <p>
                      Rekomendasi: {report.recommendations[0] || 'Lanjutkan pemantauan periodik.'}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

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
              <Link href="/lapor">Protokol Respon</Link>
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

      <Link className="lb-home__fab" href="/lapor">
        +
      </Link>
    </div>
  )
}
