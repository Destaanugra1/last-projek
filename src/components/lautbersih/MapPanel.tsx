import Link from 'next/link'

import { SeverityBadge } from '@/components/lautbersih/Badges'
import type { FrontendCategory, FrontendReport } from '@/lib/reports'

export const MapPanel = ({
  categories,
  reports,
}: {
  categories: FrontendCategory[]
  reports: FrontendReport[]
}) => {
  const focusReport = reports.find((report) => report.severity === 'critical') || reports[0]
  const severityCounts = {
    critical: reports.filter((report) => report.severity === 'critical').length,
    low: reports.filter((report) => report.severity === 'low').length,
    medium: reports.filter((report) => report.severity === 'medium').length,
  }

  return (
    <section className="lb-map-stage">
      <article className="lb-map-stage__sidebar lb-map-card">
        <div className="lb-map-card__head">
          <div>
            <p className="lb-eyebrow">Filter Monitoring</p>
            <h2>Konfigurasi visualisasi data real-time</h2>
          </div>
        </div>

        <div className="lb-monitor-group">
          <span className="lb-monitor-group__label">Kategori Insiden</span>
          <div className="lb-monitor-list">
            {categories.slice(0, 4).map((category) => {
              const total = reports.filter((report) => report.category?.id === category.id).length

              return (
                <div className="lb-monitor-row" key={category.id}>
                  <div>
                    <strong>{category.title}</strong>
                    <small>{category.slug}</small>
                  </div>
                  <span>{String(total).padStart(2, '0')}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="lb-monitor-group">
          <span className="lb-monitor-group__label">Tingkat Keparahan</span>
          <div className="lb-chip-row">
            <span className="lb-chip lb-chip--critical">Kritis</span>
            <span className="lb-chip lb-chip--medium">Menengah</span>
            <span className="lb-chip lb-chip--low">Rendah</span>
          </div>
          <div className="lb-monitor-stats">
            <div>
              <span>Kritis</span>
              <strong>{severityCounts.critical}</strong>
            </div>
            <div>
              <span>Menengah</span>
              <strong>{severityCounts.medium}</strong>
            </div>
            <div>
              <span>Rendah</span>
              <strong>{severityCounts.low}</strong>
            </div>
          </div>
        </div>

        <div className="lb-monitor-group">
          <span className="lb-monitor-group__label">Wilayah Perairan</span>
          <div className="lb-chip-row">
            <span className="lb-chip">Seluruh Indonesia</span>
            <span className="lb-chip">Laut Jawa</span>
            <span className="lb-chip">Selat Makassar</span>
            <span className="lb-chip">Laut Natuna</span>
          </div>
        </div>

        <div className="lb-sdg-card">
          <span>SDG 14</span>
          <strong>Life Below Water</strong>
        </div>
      </article>

      <article className="lb-map-stage__canvas lb-map-card">
        <div className="lb-map-card__head">
          <div>
            <p className="lb-eyebrow">Peta Monitoring</p>
            <h2>Peta wilayah laporan aktif</h2>
          </div>
          <Link className="lb-button lb-button--ghost" href="/lapor">
            Laporkan kejadian
          </Link>
        </div>

        <div className="lb-map-surface" aria-label="Representasi peta laporan">
          <div className="lb-map-grid" />
          <div className="lb-map-toolbar">
            <button type="button">+</button>
            <button type="button">-</button>
            <button type="button">Locate</button>
            <button type="button">Layers</button>
          </div>
          {reports.slice(0, 8).map((report, index) => {
            const left = `${14 + ((index * 11) % 68)}%`
            const top = `${18 + ((index * 16) % 56)}%`

            return (
              <div
                key={report.id}
                className={`lb-map-marker lb-map-marker--${report.severity}`}
                style={{ left, top }}
              >
                <span />
              </div>
            )
          })}

          {focusReport ? (
            <div className="lb-map-popup">
              <div className="lb-map-popup__thumb">
                {focusReport.photoUrls[0] ? (
                  <img alt={focusReport.title} src={focusReport.photoUrls[0]} />
                ) : (
                  <div className="lb-report-card__placeholder">No photo</div>
                )}
              </div>
              <div className="lb-map-popup__body">
                <strong>{focusReport.title}</strong>
                <p>{focusReport.locationLabel}</p>
                <SeverityBadge severity={focusReport.severity} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="lb-map-footer">
          <div>
            <span>Live data feed</span>
            <strong>
              LAT: -1.269160 | LNG: 116.825264 | STATUS: MONITORING ACTIVE | LAST UPDATE:
              14:24 WIB
            </strong>
          </div>
          <Link className="lb-mini-link" href="/lapor">
            Buat laporan
          </Link>
        </div>
      </article>

      <article className="lb-map-stage__insight lb-panel lb-panel--dark">
        <p className="lb-eyebrow lb-eyebrow--light">AI Satellite Insight</p>
        <h2>Detail analisis laporan</h2>
        {focusReport ? (
          <>
            <div className="lb-insight-grid">
              <div>
                <span>Kategori</span>
                <strong>{focusReport.category?.title || 'Tanpa Kategori'}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{focusReport.status.replaceAll('_', ' ')}</strong>
              </div>
              <div>
                <span>Severity</span>
                <strong>{focusReport.severity.toUpperCase()}</strong>
              </div>
              <div>
                <span>Pelapor</span>
                <strong>{focusReport.reporterName}</strong>
              </div>
            </div>

            <p className="lb-insight-summary">{focusReport.summary}</p>

            <div className="lb-insight-recommendations">
              <span>Rekomendasi AI</span>
              <ul>
                {focusReport.recommendations.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="lb-insight-actions">
              <Link className="lb-button" href={`/laporan/${focusReport.slug}`}>
                Validasi laporan
              </Link>
              <Link className="lb-button lb-button--ghost" href="/dashboard">
                Buka dashboard
              </Link>
            </div>
          </>
        ) : (
          <p>Belum ada data laporan untuk dianalisis.</p>
        )}
      </article>
    </section>
  )
}
