import Link from 'next/link'

import { AppShell } from '@/components/lautbersih/AppShell'
import { buildDashboardStats, getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

const severityLabel: Record<string, string> = {
  critical: 'Kritis',
  medium: 'Moderat',
  low: 'Rendah',
}

const severityDot: Record<string, string> = {
  critical: '#e24b4a',
  medium: '#ef9f27',
  low: '#1d9e75',
}

// ── Badge tier computed from report count ─────────────────────────────────────
// Admin can override this in the future via a User.badge field
function getBadgeTier(count: number): { label: string; cls: string } {
  if (count >= 20) return { label: 'Elite', cls: 'elite' }
  if (count >= 10) return { label: 'Inti', cls: 'inti' }
  if (count >= 3)  return { label: 'Aktif', cls: 'aktif' }
  return { label: 'Baru', cls: 'baru' }
}

const rankCls = ['is-gold', 'is-silver', 'is-bronze']

export default async function KomunitasPage() {
  const reports = await getReports(100)
  const stats = buildDashboardStats(reports)

  const reporterMap = new Map<string, number>()
  reports.forEach((r) => {
    reporterMap.set(r.reporterName, (reporterMap.get(r.reporterName) || 0) + 1)
  })
  const topContributors = Array.from(reporterMap.entries())
    .map(([name, count]) => ({ count, name }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Map reporter name → tier for activity feed attribution
  const reporterTierMap = new Map(
    topContributors.map((c) => [c.name, getBadgeTier(c.count)]),
  )

  const recentReports = reports.slice(0, 8)
  const resolvedPct =
    stats.total > 0 ? Math.round((stats.resolvedCount / stats.total) * 100) : 0
  const maxCat = stats.byCategory[0]?.total || 1
  const maxCount = topContributors[0]?.count || 1

  return (
    <AppShell activePath="/komunitas">

      {/* ── Hero header ── */}
      <div className="lb-kom-header">
        <div className="lb-kom-header__left">
          <p className="lb-eyebrow">Komunitas Relawan</p>
          <h1>Bersama Menjaga Pesisir</h1>
          <p className="lb-kom-header__sub">
            Pantau kontribusi relawan, laporan terbaru, dan distribusi isu lingkungan pesisir Indonesia.
          </p>
        </div>
        <div className="lb-kom-header__stats">
          <div className="lb-kom-stat">
            <span>{stats.total || 0}</span>
            <p>Laporan masuk</p>
          </div>
          <div className="lb-kom-stat lb-kom-stat--accent">
            <span>{topContributors.length}</span>
            <p>Kontributor aktif</p>
          </div>
          <div className="lb-kom-stat">
            <span>{resolvedPct}%</span>
            <p>Berhasil ditangani</p>
          </div>
        </div>
      </div>

      <div className="lb-kom-divider" />

      {/* ── Two-column body ── */}
      <div className="lb-kom-body">

        {/* ── Left: Leaderboard ── */}
        <div className="lb-kom-col">
          <div className="lb-kom-col__head">
            <h2>Kontributor Teratas</h2>
            <span>by laporan</span>
          </div>

          {topContributors.length > 0 ? (
            <ol className="lb-kom-board">
              {topContributors.map((c, i) => {
                const tier = getBadgeTier(c.count)
                const pct = Math.round((c.count / maxCount) * 100)
                return (
                  <li
                    className={`lb-kom-board__row${i < 3 ? ' is-featured' : ''}`}
                    key={c.name}
                  >
                    <span className={`lb-kom-board__num${rankCls[i] ? ` ${rankCls[i]}` : ''}`}>
                      {i + 1}
                    </span>
                    <div className="lb-kom-board__avatar">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="lb-kom-board__info">
                      <div className="lb-kom-board__name-row">
                        <strong>{c.name}</strong>
                        <span className={`lb-kom-badge lb-kom-badge--${tier.cls}`}>
                          {tier.label}
                        </span>
                      </div>
                      <div className="lb-kom-board__bar">
                        <div
                          className="lb-kom-board__bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="lb-kom-board__score">
                      {c.count}
                      <small>lap</small>
                    </span>
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="lb-kom-empty">Belum ada data kontributor.</p>
          )}

        </div>

        {/* ── Right: Activity + Categories ── */}
        <div className="lb-kom-col">
          <div className="lb-kom-col__head">
            <h2>Aktivitas Terbaru</h2>
            <Link className="lb-text-link" href="/laporan">Lihat semua</Link>
          </div>

          <ul className="lb-kom-feed">
            {recentReports.map((r) => {
              const tier = reporterTierMap.get(r.reporterName)
              return (
                <li key={r.id}>
                  <Link className="lb-kom-feed__row" href={`/laporan/${r.slug}`}>
                    <span
                      className="lb-kom-feed__dot"
                      style={{ background: severityDot[r.severity] }}
                    />
                    <div className="lb-kom-feed__content">
                      <strong>{r.title}</strong>
                      <div className="lb-kom-feed__by">
                        <span className="lb-kom-feed__avatar">
                          {r.reporterName.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="lb-kom-feed__reporter">{r.reporterName}</span>
                        {tier && (
                          <span className={`lb-kom-badge lb-kom-badge--${tier.cls}`}>
                            {tier.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="lb-kom-feed__meta">
                      <span
                        className="lb-kom-feed__sev"
                        style={{ color: severityDot[r.severity] }}
                      >
                        {severityLabel[r.severity]}
                      </span>
                      <time>
                        {new Date(r.submittedAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </time>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="lb-kom-divider" style={{ margin: '24px 0' }} />

          <div className="lb-kom-col__head">
            <h2>Kategori Isu</h2>
          </div>

          <div className="lb-kom-cats">
            {stats.byCategory.slice(0, 5).map((cat) => (
              <div className="lb-kom-cat" key={cat.label}>
                <div className="lb-kom-cat__top">
                  <span>{cat.label}</span>
                  <span>{cat.total}</span>
                </div>
                <div className="lb-kom-cat__track">
                  <div
                    className="lb-kom-cat__fill"
                    style={{ width: `${(cat.total / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.byCategory.length === 0 && (
              <p className="lb-kom-empty">Belum ada data.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="lb-kom-divider" style={{ margin: '32px 0 28px' }} />
      <div className="lb-kom-cta">
        <div>
          <h3>Temukan titik pencemaran?</h3>
          <p>Laporan kamu membantu tim kami merespons lebih cepat.</p>
        </div>
        <Link className="lb-button" href="/lapor">
          Kirim Laporan
        </Link>
      </div>
    </AppShell>
  )
}
