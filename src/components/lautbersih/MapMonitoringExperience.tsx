'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { FrontendCategory, FrontendReport } from '@/lib/reports'
import type { MapMarker } from './LeafletMap'

const LeafletMap = dynamic(() => import('./LeafletMap').then((m) => ({ default: m.LeafletMap })), {
  loading: () => <div className="lb-monitoring__map-loading">Memuat peta...</div>,
  ssr: false,
})

const SEVERITY_LABEL: Record<string, string> = {
  critical: 'KRITIS',
  low: 'RENDAH',
  medium: 'MENENGAH',
}

const SEVERITY_TONE_CLASS: Record<string, string> = {
  critical: 'is-critical',
  low: 'is-low',
  medium: 'is-medium',
}

const formatClock = () =>
  new Date().toLocaleTimeString('id-ID', { hour12: false }) + ' WIB'

export const MapMonitoringExperience = ({
  categories,
  reports,
}: {
  categories: FrontendCategory[]
  reports: FrontendReport[]
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [clock, setClock] = useState(formatClock())
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string | null>(null)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setClock(formatClock()), 1000)
    return () => clearInterval(interval)
  }, [])

  const allMarkers: MapMarker[] = useMemo(
    () =>
      reports
        .filter((r) => r.latitude && r.longitude)
        .map((r) => ({
          category: r.category?.title ?? 'Tidak diketahui',
          id: r.id,
          latitude: r.latitude,
          longitude: r.longitude,
          recommendations: r.recommendations,
          severity: r.severity,
          status: r.status,
          summary: r.summary,
          title: r.title,
        })),
    [reports],
  )

  const visibleMarkers = useMemo(
    () =>
      activeSeverityFilter
        ? allMarkers.filter((m) => m.severity === activeSeverityFilter)
        : allMarkers,
    [allMarkers, activeSeverityFilter],
  )

  const severityCounts = useMemo(
    () => ({
      critical: reports.filter((r) => r.severity === 'critical').length,
      low: reports.filter((r) => r.severity === 'low').length,
      medium: reports.filter((r) => r.severity === 'medium').length,
    }),
    [reports],
  )

  const categoryCounts = useMemo(
    () =>
      categories.slice(0, 4).map((cat, i) => ({
        count: reports.filter((r) => r.category?.id === cat.id).length,
        icon: ['◉', '◌', '△', '◆'][i] ?? '●',
        title: cat.title,
      })),
    [categories, reports],
  )

  const handleSelect = useCallback((marker: MapMarker | null) => {
    setSelectedMarker(marker)
  }, [])

  useEffect(() => {
    if (selectedMarker) {
      setIsMobileFiltersOpen(false)
    }
  }, [selectedMarker])

  const activeReport = selectedMarker
    ? reports.find((r) => r.id === selectedMarker.id)
    : null

  const severityTone = activeReport?.severity ?? 'low'
  const tickerText = reports
    .slice(0, 5)
    .map((r) => `${r.title} · ${SEVERITY_LABEL[r.severity]} · ${r.locationLabel}`)
    .join(' • ')

  return (
    <div className="lb-monitoring">
      <main className="lb-monitoring__main">
        <aside
          className={`lb-monitoring__sidebar${isMobileFiltersOpen ? ' is-mobile-open' : ''}`}
        >
          <div className="lb-monitoring__sidebar-head">
            <div>
              <h2>Filter Monitoring</h2>
              <p>Visualisasi data laporan real-time</p>
            </div>
            <button
              aria-expanded={isMobileFiltersOpen}
              className="lb-monitoring__mobile-filter-toggle"
              onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
              type="button"
            >
              {isMobileFiltersOpen ? 'Tutup' : 'Filter'}
            </button>
          </div>

          <div className="lb-monitoring__sidebar-body">
            <section>
              <div className="lb-monitoring__category-list">
                {categoryCounts.map((cat) => (
                  <label className="lb-monitoring__category-row" key={cat.title}>
                    <div>
                      <span className="lb-monitoring__row-icon">{cat.icon}</span>
                      <span>{cat.title}</span>
                    </div>
                    <div>
                      <b>{String(cat.count).padStart(2, '0')}</b>
                      <input defaultChecked type="checkbox" />
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <label>Tingkat Keparahan</label>
              <div className="lb-monitoring__severity-toggle">
                {(['critical', 'medium', 'low'] as const).map((sev) => (
                  <button
                    className={activeSeverityFilter === sev ? 'is-active' : ''}
                    key={sev}
                    onClick={() =>
                      setActiveSeverityFilter((prev) => (prev === sev ? null : sev))
                    }
                    type="button"
                  >
                    {SEVERITY_LABEL[sev]}
                  </button>
                ))}
              </div>

              <div className="lb-monitoring__severity-stats">
                <div>
                  <p>Kritis</p>
                  <strong className="is-critical-text">{severityCounts.critical}</strong>
                </div>
                <div>
                  <p>Menengah</p>
                  <strong className="is-medium-text">{severityCounts.medium}</strong>
                </div>
                <div>
                  <p>Rendah</p>
                  <strong className="is-low-text">{severityCounts.low}</strong>
                </div>
              </div>
            </section>

            {/*<section>
              <label>Wilayah Perairan</label>
              <select defaultValue="Seluruh Indonesia">
                <option>Seluruh Indonesia</option>
                <option>Laut Jawa</option>
                <option>Selat Makassar</option>
                <option>Laut Natuna</option>
                <option>Perairan Raja Ampat</option>
              </select>
            </section>*/}

            <div className="lb-monitoring__map-legend">
              <h4>Legenda Kondisi Laut</h4>
              <div className={SEVERITY_TONE_CLASS.critical}>
                <span
                  className="lb-map-dot lb-map-dot--critical"
                  style={{ display: 'inline-block', height: 12, width: 12 }}
                />
                <p>Tercemar Kritis</p>
              </div>
              <div className={SEVERITY_TONE_CLASS.medium}>
                <span
                  className="lb-map-dot lb-map-dot--medium"
                  style={{ display: 'inline-block', height: 12, width: 12 }}
                />
                <p>Tercemar Menengah</p>
              </div>
              <div className={SEVERITY_TONE_CLASS.low}>
                <span
                  className="lb-map-dot lb-map-dot--low"
                  style={{ display: 'inline-block', height: 12, width: 12 }}
                />
                <p>Kondisi Aman / Bersih</p>
              </div>
            </div>
          </div>

          <div className="lb-monitoring__sdg">
            <span />
            <p>SDG 14 · Life Below Water</p>
          </div>
        </aside>

        <section className="lb-monitoring__canvas-wrap">
          <div className="lb-monitoring__mobile-map-status">
            <div>
              <strong>{visibleMarkers.length}</strong>
              <span>Titik terpantau</span>
            </div>
            <div>
              <strong>
                {activeSeverityFilter ? SEVERITY_LABEL[activeSeverityFilter] : 'SEMUA'}
              </strong>
              <span>Filter aktif</span>
            </div>
          </div>

          <div className="lb-monitoring__map-shell">
            <LeafletMap
              markers={visibleMarkers}
              onSelect={handleSelect}
              selectedId={selectedMarker?.id ?? null}
            />
          </div>

          <aside className={`lb-monitoring__analysis${selectedMarker ? ' is-open' : ''}`}>
            {selectedMarker && (
              <div className="lb-monitoring__analysis-inner">
                <div className="lb-monitoring__analysis-head">
                  <div>
                    <span>AI Satellite Insight</span>
                    <h3>{selectedMarker.title}</h3>
                  </div>
                  <button onClick={() => setSelectedMarker(null)} type="button">
                    ×
                  </button>
                </div>

                {activeReport?.photoUrls?.[0] && (
                  <div className="lb-monitoring__analysis-media">
                    <img alt={selectedMarker.title} src={activeReport.photoUrls[0]} />
                  </div>
                )}

                <div
                  className={`lb-monitoring__analysis-card${
                    severityTone === 'critical'
                      ? ' is-critical'
                      : severityTone === 'medium'
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
                      <strong>{selectedMarker.category}</strong>
                    </div>
                    <div>
                      <small>Status</small>
                      <strong>{SEVERITY_LABEL[severityTone]}</strong>
                    </div>
                    <div>
                      <small>Kondisi</small>
                      <strong>
                        {severityTone === 'low' ? '🟢 Bersih' : severityTone === 'medium' ? '🟠 Waspada' : '🔴 Kotor'}
                      </strong>
                    </div>
                  </div>

                  {selectedMarker.summary && (
                    <div className="lb-monitoring__analysis-recommendation">
                      <small>Ringkasan AI</small>
                      <p>{selectedMarker.summary}</p>
                    </div>
                  )}

                  {selectedMarker.recommendations.length > 0 && (
                    <div className="lb-monitoring__analysis-recommendation">
                      <small>Rekomendasi Tindakan</small>
                      <p>{selectedMarker.recommendations[0]}</p>
                    </div>
                  )}
                </div>

                <div className="lb-monitoring__analysis-actions">
                  <Link href="/lapor">Tambah Laporan</Link>
                  <Link href={`/laporan/${activeReport?.slug ?? ''}`}>↗ Detail</Link>
                </div>
              </div>
            )}
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
            {tickerText ||
              'MONITORING AKTIF · SELURUH PERAIRAN INDONESIA · SISTEM ONLINE'}
          </p>
        </div>
        <div className="lb-monitoring__ticker-status">
          <span>{clock}</span>
          <span>Online · {allMarkers.length} Titik</span>
        </div>
      </footer>

      <Link className="lb-monitoring__fab" href="/lapor">
        +
      </Link>

      <style jsx>{`
        .lb-monitoring {
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
        }

        .lb-monitoring__main {
          display: grid;
          gap: 1rem;
          grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
          align-items: stretch;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }

        .lb-monitoring__sidebar {
          display: flex;
          flex-direction: column;
          min-height: 0;
          min-width: 0;
        }

        .lb-monitoring__sidebar-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .lb-monitoring__mobile-filter-toggle {
          display: none;
        }

        .lb-monitoring__canvas-wrap {
          position: relative;
          min-height: clamp(460px, 72vh, 860px);
          overflow: hidden;
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }

        .lb-monitoring__map-shell {
          height: 100%;
          min-height: inherit;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 22px 70px rgba(7, 24, 41, 0.18);
        }

        .lb-monitoring__mobile-map-status {
          display: none;
        }

        .lb-monitoring__map-legend {
          display: grid;
          gap: 0.75rem;
        }

        .lb-monitoring__map-legend > div {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .lb-monitoring__map-legend p {
          margin: 0;
          font-weight: 700;
        }

        .lb-monitoring__map-legend .${SEVERITY_TONE_CLASS.critical} p {
          color: #cf3c3c;
        }

        .lb-monitoring__map-legend .${SEVERITY_TONE_CLASS.medium} p {
          color: #d48a16;
        }

        .lb-monitoring__map-legend .${SEVERITY_TONE_CLASS.low} p {
          color: #17775e;
        }

        .lb-monitoring__analysis {
          position: absolute;
          top: 1rem;
          right: 1rem;
          bottom: 1rem;
          width: min(380px, calc(100% - 2rem));
          pointer-events: none;
        }

        .lb-monitoring__analysis.is-open {
          pointer-events: auto;
        }

        .lb-monitoring__analysis-inner {
          max-height: 100%;
          overflow: auto;
          max-width: 100%;
        }

        .lb-monitoring__ticker {
          display: grid;
          gap: 1rem;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
        }

        .lb-monitoring__ticker-marquee {
          min-width: 0;
          overflow: hidden;
        }

        .lb-monitoring__ticker-marquee p {
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .lb-monitoring__ticker-status {
          min-width: 0;
        }

        @media (max-width: 980px) {
          .lb-monitoring__main {
            grid-template-columns: minmax(0, 1fr);
          }

          .lb-monitoring__canvas-wrap {
            order: -1;
            min-height: clamp(500px, 68vh, 760px);
          }

          .lb-monitoring__sidebar {
            margin-top: 0.5rem;
          }
        }

        @media (max-width: 720px) {
          .lb-monitoring {
            gap: 0.9rem;
            overflow-x: hidden;
          }

          .lb-monitoring__canvas-wrap {
            min-height: 72vh;
            border-radius: 24px;
          }

          .lb-monitoring__map-shell {
            border-radius: 24px;
          }

          .lb-monitoring__mobile-map-status {
            position: absolute;
            top: 0.875rem;
            left: 0.875rem;
            right: 0.875rem;
            z-index: 500;
            display: grid;
            gap: 0.75rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .lb-monitoring__mobile-map-status > div {
            display: flex;
            flex-direction: column;
            padding: 0.85rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 16px;
            background: rgba(6, 21, 35, 0.74);
            backdrop-filter: blur(16px);
            color: #eff8ff;
          }

          .lb-monitoring__mobile-map-status strong {
            font-size: 1rem;
            line-height: 1.1;
          }

          .lb-monitoring__mobile-map-status span {
            margin-top: 0.2rem;
            font-size: 0.72rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: rgba(239, 248, 255, 0.74);
          }

          .lb-monitoring__analysis {
            top: auto;
            right: 0.75rem;
            bottom: 0.75rem;
            left: 0.75rem;
            width: auto;
          }

          .lb-monitoring__analysis-inner {
            max-height: min(56vh, 520px);
            border-radius: 24px;
          }

          .lb-monitoring__sidebar {
            padding: 0;
            overflow: hidden;
            border: 1px solid rgba(16, 48, 70, 0.08);
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(246, 250, 253, 0.98), #edf4f9);
            box-shadow: 0 18px 50px rgba(7, 24, 41, 0.08);
          }

          .lb-monitoring__sidebar-head {
            align-items: center;
            padding: 1rem 1.1rem;
          }

          .lb-monitoring__sidebar-head h2 {
            margin-bottom: 0.2rem;
            font-size: 1.75rem;
            line-height: 0.95;
          }

          .lb-monitoring__sidebar-head p {
            font-size: 0.74rem;
            letter-spacing: 0.12em;
          }

          .lb-monitoring__mobile-filter-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            min-width: 84px;
            padding: 0.72rem 0.95rem;
            border: 1px solid rgba(16, 55, 79, 0.12);
            border-radius: 999px;
            background: #fff;
            color: #10374f;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .lb-monitoring__sidebar-body,
          .lb-monitoring__sdg {
            display: none;
          }

          .lb-monitoring__sidebar.is-mobile-open .lb-monitoring__sidebar-body,
          .lb-monitoring__sidebar.is-mobile-open .lb-monitoring__sdg {
            display: grid;
          }

          .lb-monitoring__sidebar.is-mobile-open .lb-monitoring__sidebar-body {
            gap: 1.1rem;
            padding: 0 1.1rem 1.1rem;
          }

          .lb-monitoring__sidebar.is-mobile-open .lb-monitoring__sdg {
            display: flex;
            margin: 0 1.1rem 1.1rem;
          }

          .lb-monitoring__sidebar-head p,
          .lb-monitoring__sdg p {
            max-width: none;
          }

          .lb-monitoring__severity-toggle {
            display: grid;
            gap: 0.5rem;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .lb-monitoring__severity-toggle button {
            min-height: 44px;
            border-radius: 14px;
          }

          .lb-monitoring__severity-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .lb-monitoring__severity-stats > div,
          .lb-monitoring__category-row,
          .lb-monitoring__map-legend > div {
            border-radius: 16px;
          }

          .lb-monitoring__category-row {
            padding: 0.9rem 1rem;
          }

          .lb-monitoring__map-legend {
            gap: 0.6rem;
          }

          .lb-monitoring__map-legend > div {
            padding: 0.75rem 0.9rem;
            background: rgba(255, 255, 255, 0.78);
          }

          .lb-monitoring__ticker {
            grid-template-columns: minmax(0, 1fr);
          }

          .lb-monitoring__ticker-status {
            display: flex;
            gap: 0.75rem;
            min-width: 0;
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .lb-monitoring__fab {
            right: 1rem;
            bottom: 1rem;
          }
        }

        @media (max-width: 520px) {
          .lb-monitoring__canvas-wrap {
            min-height: 78vh;
          }

          .lb-monitoring__analysis {
            left: 0.5rem;
            right: 0.5rem;
            bottom: 0.5rem;
          }

          .lb-monitoring__mobile-map-status {
            grid-template-columns: minmax(0, 1fr);
          }

          .lb-monitoring__severity-stats {
            grid-template-columns: 1fr;
          }

          .lb-monitoring__category-row {
            gap: 0.75rem;
          }

          .lb-monitoring__sidebar-head {
            padding: 0.95rem 1rem;
          }

          .lb-monitoring__sidebar-head h2 {
            font-size: 1.55rem;
          }

          .lb-monitoring__mobile-filter-toggle {
            min-width: 74px;
            padding-inline: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}
