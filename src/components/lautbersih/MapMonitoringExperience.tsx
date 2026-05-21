'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import type { FrontendCategory, FrontendReport } from '@/lib/reports'

type MarkerKey = 'coral' | 'fishing' | 'oil-spill'

const imageByKey: Record<MarkerKey, string> = {
  coral:
    'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1974&auto=format&fit=crop',
  fishing:
    'https://images.unsplash.com/photo-1534433100236-8e5033722e06?q=80&w=2070&auto=format&fit=crop',
  'oil-spill':
    'https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1974&auto=format&fit=crop',
}

const recommendationBySeverity: Record<FrontendReport['severity'], string> = {
  critical:
    'Segera kerahkan unit pembersih dan batasi lalu lintas kapal di radius terdampak untuk mencegah eskalasi pencemaran.',
  low: 'Lanjutkan monitoring rutin dan dokumentasikan perubahan visual untuk evaluasi berkala.',
  medium:
    'Luncurkan inspeksi lapangan dan koordinasikan drone pengintai untuk konfirmasi visual tambahan.',
}

const fallbackAnalysis = {
  coral: {
    category: 'Coral Restoration Zone',
    recommendation:
      'Laporan rutin mingguan: pertumbuhan polip karang menunjukkan tren positif dan area tetap aman dari aktivitas destruktif.',
    severity: 'RENDAH',
    title: 'Restorasi Karang Wakatobi',
  },
  fishing: {
    category: 'Illegal Fishing Suspected',
    recommendation:
      'Kapal tanpa identitas AIS terdeteksi melakukan manuver mencurigakan. Luncurkan drone pengintai untuk konfirmasi visual.',
    severity: 'MENENGAH',
    title: 'Kapal Asing Selat Makassar',
  },
  'oil-spill': {
    category: 'Oil Spill Detection',
    recommendation:
      'Segera kerahkan unit pembersih dari pos terdekat dan koordinasikan pembatasan jalur pelayaran di sektor terdampak.',
    severity: 'KRITIS',
    title: 'Tumpahan Minyak Balikpapan',
  },
} as const

const formatClock = () =>
  `${new Date().toLocaleTimeString('id-ID', {
    hour12: false,
  })} WIB`

const buildMarkerAnalysis = (reports: FrontendReport[]) => {
  const critical = reports.find((report) => report.severity === 'critical')
  const medium = reports.find((report) => report.severity === 'medium')
  const low = reports.find((report) => report.severity === 'low')

  return {
    coral: low
      ? {
          category: low.category?.title || fallbackAnalysis.coral.category,
          recommendation: low.recommendations[0] || recommendationBySeverity.low,
          severity: 'RENDAH',
          title: low.title,
        }
      : fallbackAnalysis.coral,
    fishing: medium
      ? {
          category: medium.category?.title || fallbackAnalysis.fishing.category,
          recommendation: medium.recommendations[0] || recommendationBySeverity.medium,
          severity: 'MENENGAH',
          title: medium.title,
        }
      : fallbackAnalysis.fishing,
    'oil-spill': critical
      ? {
          category: critical.category?.title || fallbackAnalysis['oil-spill'].category,
          recommendation: critical.recommendations[0] || recommendationBySeverity.critical,
          severity: 'KRITIS',
          title: critical.title,
        }
      : fallbackAnalysis['oil-spill'],
  }
}

export const MapMonitoringExperience = ({
  categories,
  reports,
}: {
  categories: FrontendCategory[]
  reports: FrontendReport[]
}) => {
  const [activeMarker, setActiveMarker] = useState<MarkerKey | null>(null)
  const [clock, setClock] = useState(formatClock())

  const analysis = useMemo(() => buildMarkerAnalysis(reports), [reports])

  const categoryCounts = useMemo(
    () =>
      categories.slice(0, 3).map((category, index) => ({
        count: reports.filter((report) => report.category?.id === category.id).length,
        icon: index === 0 ? '◉' : index === 1 ? '◌' : '△',
        title: category.title,
      })),
    [categories, reports],
  )

  const severityCounts = useMemo(
    () => ({
      critical: reports.filter((report) => report.severity === 'critical').length,
      low: reports.filter((report) => report.severity === 'low').length,
      medium: reports.filter((report) => report.severity === 'medium').length,
    }),
    [reports],
  )

  useEffect(() => {
    const interval = setInterval(() => setClock(formatClock()), 1000)
    return () => clearInterval(interval)
  }, [])

  const activeData = activeMarker ? analysis[activeMarker] : null

  return (
    <div className="lb-monitoring">
      <header className="lb-monitoring__nav-wrap">
        <nav className="lb-monitoring__nav">
          <div className="lb-monitoring__brand-group">
            <Link className="lb-monitoring__brand" href="/">
              LautBersih
            </Link>
            <div className="lb-monitoring__links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profil">Armada</Link>
              <Link className="is-active" href="/petawilayah">
                Peta Wilayah
              </Link>
              <Link href="/lapor">Dokumen</Link>
            </div>
          </div>
          <Link className="lb-monitoring__cta" href="/lapor">
            Buat Laporan
          </Link>
        </nav>
      </header>

      <main className="lb-monitoring__main">
        <aside className="lb-monitoring__sidebar">
          <div className="lb-monitoring__sidebar-head">
            <h2>Filter Monitoring</h2>
            <p>Konfigurasi visualisasi data real-time</p>
          </div>

          <div className="lb-monitoring__sidebar-body">
            <section>
              <label>Kategori Insiden</label>
              <div className="lb-monitoring__category-list">
                {categoryCounts.map((category, index) => (
                  <label className="lb-monitoring__category-row" key={`${category.title}-${index}`}>
                    <div>
                      <span className="lb-monitoring__row-icon">{category.icon}</span>
                      <span>{category.title}</span>
                    </div>
                    <div>
                      <b>{String(category.count).padStart(2, '0')}</b>
                      <input defaultChecked type="checkbox" />
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <label>Tingkat Keparahan</label>
              <div className="lb-monitoring__severity-toggle">
                <button className="is-active" type="button">
                  Kritis
                </button>
                <button type="button">Menengah</button>
                <button type="button">Rendah</button>
              </div>

              <div className="lb-monitoring__severity-stats">
                <div>
                  <p>Kritis</p>
                  <strong>{severityCounts.critical}</strong>
                </div>
                <div>
                  <p>Menengah</p>
                  <strong>{severityCounts.medium}</strong>
                </div>
                <div>
                  <p>Rendah</p>
                  <strong>{severityCounts.low}</strong>
                </div>
              </div>
            </section>

            <section>
              <label>Wilayah Perairan</label>
              <select defaultValue="Seluruh Indonesia">
                <option>Seluruh Indonesia</option>
                <option>Laut Jawa</option>
                <option>Selat Makassar</option>
                <option>Laut Natuna</option>
                <option>Perairan Raja Ampat</option>
              </select>
            </section>
          </div>

          <div className="lb-monitoring__sdg">
            <span />
            <p>SDG 14 · Life Below Water</p>
          </div>
        </aside>

        <section className="lb-monitoring__canvas-wrap">
          <div className="lb-monitoring__map-bg" />
          <div className="lb-monitoring__map-grid" />

          <div className="lb-monitoring__controls">
            <div className="lb-monitoring__zoom-stack">
              <button type="button">+</button>
              <button type="button">-</button>
            </div>
            <button type="button">◎</button>
            <button type="button">▦</button>
          </div>

          <div className="lb-monitoring__legend">
            <h4>Legenda Monitoring</h4>
            <div>
              <span className="is-critical" />
              <p>Kritis (Mendesak)</p>
            </div>
            <div>
              <span className="is-medium" />
              <p>Menengah (Waspada)</p>
            </div>
            <div>
              <span className="is-low" />
              <p>Rendah (Aman)</p>
            </div>
          </div>

          <button
            className="lb-monitoring__marker lb-monitoring__marker--critical"
            onClick={() => setActiveMarker((current) => (current === 'oil-spill' ? null : 'oil-spill'))}
            style={{ left: '50%', top: '33%' }}
            type="button"
          >
            <span />
          </button>
          <button
            className="lb-monitoring__marker lb-monitoring__marker--medium"
            onClick={() => setActiveMarker((current) => (current === 'fishing' ? null : 'fishing'))}
            style={{ left: '33%', top: '50%' }}
            type="button"
          >
            <span />
          </button>
          <button
            className="lb-monitoring__marker lb-monitoring__marker--low"
            onClick={() => setActiveMarker((current) => (current === 'coral' ? null : 'coral'))}
            style={{ left: '75%', top: '72%' }}
            type="button"
          >
            <span />
          </button>

          <aside className={`lb-monitoring__analysis${activeMarker ? ' is-open' : ''}`}>
            <div className="lb-monitoring__analysis-inner">
              <div className="lb-monitoring__analysis-head">
                <div>
                  <span>AI Satellite Insight</span>
                  <h3>{activeData?.title || 'Detail Analisis'}</h3>
                </div>
                <button onClick={() => setActiveMarker(null)} type="button">
                  ×
                </button>
              </div>

              <div className="lb-monitoring__analysis-media">
                {activeData ? <img alt={activeData.title} src={imageByKey[activeMarker as MarkerKey]} /> : null}
              </div>

              <div
                className={`lb-monitoring__analysis-card${
                  activeData?.severity === 'KRITIS'
                    ? ' is-critical'
                    : activeData?.severity === 'MENENGAH'
                      ? ' is-medium'
                      : ' is-low'
                }`}
              >
                <div className="lb-monitoring__analysis-card-head">
                  <span>AI</span>
                  <p>Analisis Sistem LautBersih</p>
                </div>

                <div className="lb-monitoring__analysis-meta">
                  <div>
                    <small>Kategori</small>
                    <strong>{activeData?.category || 'Oil Spill Detection'}</strong>
                  </div>
                  <div>
                    <small>Status</small>
                    <strong>{activeData?.severity || 'KRITIS'}</strong>
                  </div>
                  <div>
                    <small>Confidence</small>
                    <strong>98.4%</strong>
                  </div>
                </div>

                <div className="lb-monitoring__analysis-recommendation">
                  <small>Rekomendasi AI</small>
                  <p>
                    {activeData?.recommendation ||
                      'Segera kerahkan unit pembersih dan koordinasikan pembatasan area terdampak.'}
                  </p>
                </div>
              </div>

              <div className="lb-monitoring__analysis-actions">
                <Link href="/lapor">Validasi Laporan</Link>
                <button type="button">↗</button>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer className="lb-monitoring__ticker">
        <div className="lb-monitoring__ticker-live">
          <span />
          <strong>LIVE DATA FEED</strong>
        </div>
        <div className="lb-monitoring__ticker-marquee">
          <p>
            LAT: -1.269160 | LNG: 116.825264 • SCAN COMPLETE: 98.4% CONFIDENCE • SATELLITE:
            LB-SAT-04 • LAST UPDATE: 14:24:05 UTC+7 • REGION: SELAT MAKASSAR • STATUS:
            MONITORING ACTIVE
          </p>
        </div>
        <div className="lb-monitoring__ticker-status">
          <span>{clock}</span>
          <span>Online</span>
        </div>
      </footer>

      <Link className="lb-monitoring__fab" href="/lapor">
        +
      </Link>
    </div>
  )
}
