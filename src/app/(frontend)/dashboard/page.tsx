import { AppShell } from '@/components/lautbersih/AppShell'
import { getReports, buildDashboardStats } from '@/lib/reports'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const reports = await getReports(64)
  const stats = buildDashboardStats(reports)
  const maxTimeline = Math.max(...stats.timeline.map((entry) => entry.total), 1)
  const alertReports = reports
    .filter((report) => report.severity === 'critical' || report.status === 'pending_review')
    .slice(0, 3)

  return (
    <AppShell activePath="/dashboard">
      <section className="lb-page-hero lb-page-hero--compact">
        <p className="lb-eyebrow">Dashboard Overview</p>
        <h1>Kontrol situasi laporan dan respons LautBersih dalam satu command view.</h1>
        <p>Statistik ini dihitung langsung dari dokumen laporan Payload CMS yang tersedia publik.</p>
      </section>

      <section className="lb-stats-grid">
        <article className="lb-stat-card">
          <span>Active incidents</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="lb-stat-card">
          <span>Critical alerts</span>
          <strong>{stats.criticalCount}</strong>
        </article>
        <article className="lb-stat-card">
          <span>AI validated</span>
          <strong>{stats.validatedCount}</strong>
        </article>
        <article className="lb-stat-card">
          <span>Resolved</span>
          <strong>{stats.resolvedCount}</strong>
        </article>
      </section>

      <section className="lb-dashboard-grid">
        <article className="lb-panel">
          <h2>Distribusi kategori</h2>
          <div className="lb-list-metric">
            {stats.byCategory.length > 0 ? (
              stats.byCategory.map((entry) => (
                <div key={entry.label}>
                  <span>{entry.label}</span>
                  <strong>{entry.total}</strong>
                </div>
              ))
            ) : (
              <p>Belum ada data kategori.</p>
            )}
          </div>
        </article>
        <article className="lb-panel">
          <h2>Status laporan</h2>
          <div className="lb-list-metric">
            {stats.byStatus.length > 0 ? (
              stats.byStatus.map((entry) => (
                <div key={entry.label}>
                  <span>{entry.label}</span>
                  <strong>{entry.total}</strong>
                </div>
              ))
            ) : (
              <p>Belum ada data status.</p>
            )}
          </div>
        </article>
        <article className="lb-panel lb-panel--wide">
          <h2>Incident trends</h2>
          <div className="lb-chart">
            {stats.timeline.length > 0 ? (
              stats.timeline.map((entry) => (
                <div key={entry.label} className="lb-chart__bar">
                  <span style={{ height: `${(entry.total / maxTimeline) * 100}%` }} />
                  <small>{entry.label}</small>
                </div>
              ))
            ) : (
              <p>Belum ada data tren.</p>
            )}
          </div>
        </article>
        <article className="lb-panel">
          <h2>Wilayah terdampak</h2>
          <div className="lb-list-metric">
            {stats.topLocations.length > 0 ? (
              stats.topLocations.map((entry) => (
                <div key={entry.label}>
                  <span>{entry.label}</span>
                  <strong>{entry.total}</strong>
                </div>
              ))
            ) : (
              <p>Belum ada lokasi dominan.</p>
            )}
          </div>
        </article>

        <article className="lb-panel lb-panel--dark">
          <p className="lb-eyebrow lb-eyebrow--light">Critical Alerts</p>
          <h2>Prioritas tinggi</h2>
          <div className="lb-alert-list">
            {alertReports.length > 0 ? (
              alertReports.map((report) => (
                <div className="lb-alert-card" key={report.id}>
                  <span>{report.severity.toUpperCase()}</span>
                  <strong>{report.title}</strong>
                  <p>{report.locationLabel}</p>
                </div>
              ))
            ) : (
              <p>Belum ada alert prioritas tinggi.</p>
            )}
          </div>
        </article>
      </section>
    </AppShell>
  )
}
