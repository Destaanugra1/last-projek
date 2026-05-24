import Link from 'next/link'

import { buildDashboardStats, getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

const severityColor: Record<string, string> = {
  critical: '#e24b4a',
  medium: '#ef9f27',
  low: '#1d9e75',
}

const statusClass: Record<string, string> = {
  validated: 'lb-dash-status__row--validated',
  resolved: 'lb-dash-status__row--resolved',
  pending_review: 'lb-dash-status__row--critical',
}

export default async function DashboardPage() {
  const reports = await getReports(100)
  const stats = buildDashboardStats(reports)
  const maxTimeline = Math.max(...stats.timeline.map((e) => e.total), 1)
  const maxCategory = Math.max(...stats.byCategory.map((e) => e.total), 1)
  const alertReports = reports
    .filter((r) => r.severity === 'critical' || r.severity === 'medium')
    .slice(0, 5)
  const now = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <main className="lb-dash">
      {/* ── Hero ── */}
      <div className="lb-dash-hero">
        <div className="lb-dash-hero__eyebrow">
          <span>🌊</span>
          SDG 14 · Life Below Water
        </div>
        <h1>Dashboard Ringkasan</h1>
        <p>
          Statistik akumulasi laporan pencemaran pesisir, breakdown kategori sampah, dan pemetaan
          wilayah terdampak secara real-time dari seluruh kontributor LautBersih.
        </p>
        <div className="lb-dash-hero__meta">
          <span className="lb-dash-hero__pill">📊 {stats.total} Total Laporan</span>
          <span className="lb-dash-hero__live">
            <i />
            Diperbarui {now}
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="lb-dash-kpis">
        <div className="lb-dash-kpi">
          <div className="lb-dash-kpi__label">Total Laporan</div>
          <span className="lb-dash-kpi__value">{stats.total}</span>
          <div className="lb-dash-kpi__sub">Seluruh laporan masuk</div>
          <span className="lb-dash-kpi__icon">📋</span>
        </div>
        <div className="lb-dash-kpi lb-dash-kpi--critical">
          <div className="lb-dash-kpi__label">Kritis Aktif</div>
          <span className="lb-dash-kpi__value">{stats.criticalCount}</span>
          <div className="lb-dash-kpi__sub">Perlu penanganan segera</div>
          <span className="lb-dash-kpi__icon">🚨</span>
        </div>
        <div className="lb-dash-kpi lb-dash-kpi--warning">
          <div className="lb-dash-kpi__label">Tervalidasi AI</div>
          <span className="lb-dash-kpi__value">{stats.validatedCount}</span>
          <div className="lb-dash-kpi__sub">Sudah diverifikasi admin</div>
          <span className="lb-dash-kpi__icon">✅</span>
        </div>
        <div className="lb-dash-kpi lb-dash-kpi--blue">
          <div className="lb-dash-kpi__label">Selesai Ditangani</div>
          <span className="lb-dash-kpi__value">{stats.resolvedCount}</span>
          <div className="lb-dash-kpi__sub">Laporan tuntas</div>
          <span className="lb-dash-kpi__icon">🏁</span>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="lb-dash-grid">
        {/* Left column */}
        <div className="lb-dash-grid__left">
          {/* Timeline */}
          <div className="lb-dash-panel">
            <div className="lb-dash-panel__head">
              <h2>Tren Laporan Harian</h2>
              <small>7 hari terakhir</small>
            </div>
            {stats.timeline.length > 0 ? (
              <div className="lb-dash-timeline">
                {stats.timeline.map((entry) => (
                  <div className="lb-dash-timeline__col" key={entry.label}>
                    <div
                      className="lb-dash-timeline__bar"
                      style={{ height: `${Math.max((entry.total / maxTimeline) * 100, 6)}%` }}
                    />
                    <span className="lb-dash-timeline__label">{entry.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="lb-dash-empty">Belum ada data tren.</p>
            )}
          </div>

          {/* Category breakdown */}
          <div className="lb-dash-panel">
            <div className="lb-dash-panel__head">
              <h2>Kategori Sampah</h2>
              <small>{stats.byCategory.length} kategori</small>
            </div>
            {stats.byCategory.length > 0 ? (
              <div className="lb-dash-category">
                {stats.byCategory.map((entry, i) => (
                  <div className="lb-dash-category__row" key={entry.label}>
                    <span
                      className="lb-dash-category__row__dot"
                      style={{
                        background: i === 0 ? '#1d9e75' : i === 1 ? '#0b2540' : '#ef9f27',
                      }}
                    />
                    <span className="lb-dash-category__row__label">{entry.label}</span>
                    <div className="lb-dash-category__row__bar-wrap">
                      <div
                        className="lb-dash-category__row__bar"
                        style={{ width: `${(entry.total / maxCategory) * 100}%` }}
                      />
                    </div>
                    <span className="lb-dash-category__row__count">{entry.total}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="lb-dash-empty">Belum ada data kategori.</p>
            )}
          </div>

          {/* Critical alerts */}
          <div className="lb-dash-panel lb-dash-panel--dark">
            <div className="lb-dash-panel__head">
              <h2>Alert Prioritas</h2>
              <small>{alertReports.length} laporan</small>
            </div>
            {alertReports.length > 0 ? (
              <div className="lb-dash-alerts">
                {alertReports.map((r) => (
                  <Link
                    className={`lb-dash-alert${r.severity === 'medium' ? ' lb-dash-alert--medium' : ''}`}
                    href={`/laporan/${r.slug}`}
                    key={r.id}
                  >
                    <strong>{r.title}</strong>
                    <span>
                      📍 {r.locationLabel} · {r.severity.toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="lb-dash-empty" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Tidak ada alert aktif.
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lb-dash-grid__right">
          {/* Status distribution */}
          <div className="lb-dash-panel">
            <div className="lb-dash-panel__head">
              <h2>Status Laporan</h2>
            </div>
            {stats.byStatus.length > 0 ? (
              <div className="lb-dash-status">
                {stats.byStatus.map((entry) => {
                  const key = Object.entries({
                    validated: 'Tervalidasi',
                    resolved: 'Selesai',
                    pending_review: 'Menunggu Review',
                  }).find(([, v]) => v === entry.label)?.[0] ?? ''
                  return (
                    <div
                      className={`lb-dash-status__row ${statusClass[key] ?? ''}`}
                      key={entry.label}
                    >
                      <span>{entry.label}</span>
                      <strong>{entry.total}</strong>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="lb-dash-empty">Belum ada data status.</p>
            )}
          </div>

          {/* Top locations */}
          <div className="lb-dash-panel">
            <div className="lb-dash-panel__head">
              <h2>Wilayah Terdampak</h2>
              <small>Top {stats.topLocations.length}</small>
            </div>
            {stats.topLocations.length > 0 ? (
              <div className="lb-dash-locations">
                {stats.topLocations.map((entry, i) => (
                  <div className="lb-dash-locations__row" key={entry.label}>
                    <span className="lb-dash-locations__row__rank">{i + 1}</span>
                    <span className="lb-dash-locations__row__name">{entry.label}</span>
                    <span className="lb-dash-locations__row__count">{entry.total}×</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="lb-dash-empty">Belum ada data lokasi.</p>
            )}
          </div>

          {/* Severity breakdown */}
          <div className="lb-dash-panel">
            <div className="lb-dash-panel__head">
              <h2>Sebaran Keparahan</h2>
            </div>
            <div className="lb-dash-status">
              {(['critical', 'medium', 'low'] as const).map((sev) => {
                const count = reports.filter((r) => r.severity === sev).length
                const label = { critical: '🔴 Kritis', medium: '🟡 Moderat', low: '🟢 Rendah' }[sev]
                return (
                  <div className="lb-dash-status__row" key={sev}>
                    <span>{label}</span>
                    <strong style={{ background: `${severityColor[sev]}18`, color: severityColor[sev] }}>
                      {count}
                    </strong>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--lb-primary), var(--lb-primary-soft))',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Ikut Berkontribusi
            </p>
            <h2 style={{ color: '#fff', fontSize: '1.3rem' }}>Temukan titik pencemaran?</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Laporkan sekarang dan bantu tim kami menangani polusi pesisir lebih cepat.
            </p>
            <Link
              href="/lapor"
              style={{
                alignItems: 'center',
                background: 'var(--lb-secondary)',
                borderRadius: '12px',
                color: '#fff',
                display: 'inline-flex',
                fontWeight: 700,
                justifyContent: 'center',
                minHeight: '44px',
                padding: '0 24px',
              }}
            >
              Buat Laporan →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
