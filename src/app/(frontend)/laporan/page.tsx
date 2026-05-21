import Link from 'next/link'

import { buildDashboardStats, getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

export default async function ReportsHistoryPage() {
  const reports = await getReports(64)
  const stats = buildDashboardStats(reports)
  const activeIncidents = reports.filter((report) => report.status !== 'resolved').length
  const criticalAlerts = reports.filter((report) => report.severity === 'critical').slice(0, 3)
  const trendBars = stats.timeline.length > 0 ? stats.timeline : []

  return (
    <div className="lb-history-page">
      <aside className="lb-history-sidebar">
        <div className="lb-history-sidebar__brand">
          <h1>LautBersih</h1>
          <p>Maritime Authority</p>
        </div>

        <nav className="lb-history-sidebar__nav">
          <Link className="is-active" href="/laporan">
            <span>dashboard</span>
            <span>Overview</span>
          </Link>
          <Link href="/lapor">
            <span>assessment</span>
            <span>Reports</span>
          </Link>
          <Link href="/petawilayah">
            <span>directions_boat</span>
            <span>Vessels</span>
          </Link>
          <Link href="/profil">
            <span>group</span>
            <span>Users</span>
          </Link>
          <Link href="/notifikasi">
            <span>settings</span>
            <span>Settings</span>
          </Link>
        </nav>

        <div className="lb-history-sidebar__footer">
          <Link className="lb-history-sidebar__cta" href="/lapor">
            <span>add_circle</span>
            <span>New Incident Report</span>
          </Link>

          <div className="lb-history-sidebar__links">
            <Link href="/notifikasi">
              <span>help</span>
              <span>Help Center</span>
            </Link>
            <Link href="/login">
              <span>logout</span>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className="lb-history-workspace">
        <header className="lb-history-topbar">
          <div className="lb-history-search">
            <span>search</span>
            <input placeholder="Search Maritime Control..." type="text" />
          </div>

          <div className="lb-history-topbar__right">
            <button type="button">
              <span>notifications</span>
              <i />
            </button>
            <button type="button">
              <span>history</span>
            </button>
            <div className="lb-history-profile">
              <div>
                <p>Cmdr. Aris Raharjo</p>
                <small>Administrator</small>
              </div>
              <div className="lb-history-profile__avatar">A</div>
            </div>
          </div>
        </header>

        <main className="lb-history-main">
          <div className="lb-history-header">
            <div>
              <h2>Dashboard Overview</h2>
              <div className="lb-history-header__meta">
                <span>SDG 14 · Life Below Water</span>
                <small>schedule</small>
                <p>
                  Last updated:{' '}
                  {new Date().toLocaleString('id-ID', {
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  WIB
                </p>
              </div>
            </div>

            <div className="lb-history-header__actions">
              <div className="lb-history-date-pill">
                <span>calendar_today</span>
                <span>Last 30 Days</span>
                <span>expand_more</span>
              </div>
              <button type="button">
                <span>file_download</span>
                <span>Export Data</span>
              </button>
            </div>
          </div>

          <section className="lb-history-kpis">
            <article className="is-critical">
              <p>Active Incidents</p>
              <div>
                <strong>{activeIncidents}</strong>
                <span className="is-danger">
                  <small>trending_up</small>
                  12%
                </span>
              </div>
            </article>
            <article>
              <p>Vessels on Patrol</p>
              <div>
                <strong>{Math.max(18, Math.ceil(activeIncidents / 2))}</strong>
                <span className="is-success">
                  <small>check_circle</small>
                  Optimal
                </span>
              </div>
            </article>
            <article>
              <p>AI Validated Reports</p>
              <div>
                <strong>{stats.validatedCount}</strong>
                <span>
                  <small>sync</small>
                  94% Accuracy
                </span>
              </div>
            </article>
            <article>
              <p>Avg. Response Time</p>
              <div>
                <strong>14.2m</strong>
                <span className="is-success">
                  <small>trending_down</small>
                  4.1m
                </span>
              </div>
            </article>
          </section>

          <div className="lb-history-content-grid">
            <div className="lb-history-content-grid__left">
              <section className="lb-history-panel">
                <div className="lb-history-panel__head">
                  <h4>Incident Trends</h4>
                  <div className="lb-history-legend">
                    <div>
                      <i className="is-primary" />
                      <span>Pollution</span>
                    </div>
                    <div>
                      <i className="is-secondary" />
                      <span>Illegal Entry</span>
                    </div>
                  </div>
                </div>

                <div className="lb-history-chart">
                  <div className="lb-history-chart__bars">
                    {(trendBars.length > 0 ? trendBars : new Array(14).fill(null)).map((entry, index) => {
                      const total = entry?.total || ((index % 5) + 2)
                      return (
                        <div className="lb-history-chart__stack" key={`${entry?.label || 'bar'}-${index}`}>
                          <div
                            className={`lb-history-chart__bar${index % 2 === 0 ? ' is-primary' : ' is-secondary'}`}
                            style={{ height: `${Math.min(100, total * 16)}%` }}
                          />
                        </div>
                      )
                    })}
                  </div>

                  <svg preserveAspectRatio="none" viewBox="0 0 1000 400">
                    <path d="M0,350 Q100,320 200,340 T400,280 T600,300 T800,200 T1000,150" />
                    <path d="M0,380 Q100,340 200,360 T400,220 T600,280 T800,240 T1000,180" />
                  </svg>

                  <div className="lb-history-chart__labels">
                    {(trendBars.length > 0 ? trendBars : ['Oct 01', 'Oct 10', 'Oct 20', 'Oct 30']).map(
                      (entry, index) => (
                        <span key={`${typeof entry === 'string' ? entry : entry.label}-${index}`}>
                          {typeof entry === 'string' ? entry : entry.label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </section>

              <div className="lb-history-mini-grid">
                <section className="lb-history-mini-card">
                  <h5>
                    <small>verified</small>
                    Patrol Efficiency
                  </h5>
                  <div>
                    <div className="lb-history-ring">78%</div>
                    <p>Fuel optimization is within target range for Q4.</p>
                  </div>
                </section>

                <section className="lb-history-mini-card is-soft">
                  <h5>
                    <small>waves</small>
                    Ocean Health Index
                  </h5>
                  <div>
                    <div className="lb-history-ring is-dark">42%</div>
                    <p>Biodiversity alerts detected near Malacca Strait.</p>
                  </div>
                </section>
              </div>
            </div>

            <aside className="lb-history-content-grid__right">
              <div className="lb-history-alerts-head">
                <h4>Critical Alerts</h4>
                <span>{Math.max(3, criticalAlerts.length)} High Priority</span>
              </div>

              <div className="lb-history-alerts-list">
                {(criticalAlerts.length > 0 ? criticalAlerts : reports.slice(0, 3)).map((report, index) => (
                  <article className={`lb-history-alert-card${index === 0 ? ' is-critical' : index === 1 ? ' is-alert' : ' is-info'}`} key={report.id}>
                    <div className="lb-history-alert-card__meta">
                      <div>
                        <small>smart_toy</small>
                        <span>
                          AI ANALYSIS: {index === 0 ? 'CRITICAL' : index === 1 ? 'ALERT' : 'INFO'}
                        </span>
                      </div>
                      <small>{index === 0 ? '2m ago' : index === 1 ? '14m ago' : '1h ago'}</small>
                    </div>
                    <h5>{report.title}</h5>
                    <p>{report.summary}</p>
                    <div className="lb-history-alert-card__actions">
                      <Link href={`/laporan/${report.slug}`}>
                        {index === 0 ? 'Dispatch Patrol' : index === 1 ? 'Investigate' : 'Research Data'}
                      </Link>
                      <Link href={`/laporan/${report.slug}`}>View Details</Link>
                    </div>
                  </article>
                ))}

                <div className="lb-history-status-card">
                  <div>
                    <p>System Status</p>
                    <strong>All nodes operational</strong>
                  </div>
                  <div className="lb-history-status-card__bars">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
