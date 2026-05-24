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
        <aside className="lb-monitoring__sidebar">
          <div className="lb-monitoring__sidebar-head">
            <h2>Filter Monitoring</h2>
            <p>Visualisasi data laporan real-time</p>
          </div>

          <div className="lb-monitoring__sidebar-body">
            <section>
              <label>Kategori Insiden</label>
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

            <div className="lb-monitoring__map-legend">
              <h4>Legenda Kondisi Laut</h4>
              <div>
                <span className="lb-map-dot lb-map-dot--critical" style={{ display: 'inline-block', height: 12, width: 12 }} />
                <p>Tercemar Kritis</p>
              </div>
              <div>
                <span className="lb-map-dot lb-map-dot--medium" style={{ display: 'inline-block', height: 12, width: 12 }} />
                <p>Tercemar Menengah</p>
              </div>
              <div>
                <span className="lb-map-dot lb-map-dot--low" style={{ display: 'inline-block', height: 12, width: 12 }} />
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
          <LeafletMap
            markers={visibleMarkers}
            onSelect={handleSelect}
            selectedId={selectedMarker?.id ?? null}
          />

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
    </div>
  )
}
