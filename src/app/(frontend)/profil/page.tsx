import Link from 'next/link'

import { buildDashboardStats, getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

const formatAgendaDate = (offset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function CommunityPage() {
  const reports = await getReports(24)
  const stats = buildDashboardStats(reports)

  const contributors = Array.from(
    reports.reduce((map, report) => {
      const key = report.reporterName || 'Anonim'
      map.set(key, (map.get(key) || 0) + 1)
      return map
    }, new Map<string, number>()),
  )
    .map(([name, count]) => ({ count, name }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 3)

  const heroShareReport = reports[0]
  const agendaReports = [
    reports.find((report) => report.severity === 'critical') || reports[0],
    reports.find((report) => report.severity === 'low') || reports[1] || reports[0],
  ].filter(Boolean)

  return (
    <div className="lb-community-page">
      <header className="lb-community-topbar">
        <div className="lb-community-topbar__inner">
          <div className="lb-community-topbar__brand">LautBersih</div>
          <nav className="lb-community-topbar__nav">
            <Link className="is-active" href="/dashboard">
              Dashboard
            </Link>
            <Link href="/profil">Armada</Link>
            <Link href="/petawilayah">Peta Wilayah</Link>
            <Link href="/lapor">Dokumen</Link>
          </nav>
          <Link className="lb-community-topbar__cta" href="/lapor">
            Buat Laporan
          </Link>
        </div>
      </header>

      <main className="lb-community-main">
        <section className="lb-community-hero">
          <h1>Community Hub: Bersama Jaga Laut Kita</h1>
          <p>
            Platform kolaborasi publik untuk pelaporan, aksi nyata, dan pemantauan kebersihan
            wilayah pesisir dan laut Indonesia. Setiap kontribusi Anda berarti.
          </p>
        </section>

        <div className="lb-community-grid">
          <section className="lb-community-card lb-community-card--leaderboard">
            <div className="lb-community-card__head lb-community-card__head--bordered">
              <h2>Top Kontributor</h2>
              <span className="lb-community-card__emoji">🏆</span>
            </div>

            <div className="lb-community-leaderboard">
              {contributors.length > 0 ? (
                contributors.map((contributor, index) => (
                  <div
                    className={`lb-community-leaderboard__row${index === 0 ? ' is-top' : ''}`}
                    key={contributor.name}
                  >
                    <div className="lb-community-leaderboard__rank">{index + 1}</div>
                    <div className="lb-community-leaderboard__avatar">
                      {contributor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="lb-community-leaderboard__meta">
                      <p>{contributor.name}</p>
                      <small>{contributor.count} Laporan</small>
                    </div>
                    {index === 0 ? <span className="lb-community-leaderboard__verified">✓</span> : null}
                  </div>
                ))
              ) : (
                <div className="lb-community-empty">Belum ada data kontributor.</div>
              )}
            </div>

            <button className="lb-community-outline-btn" type="button">
              Lihat Semua
            </button>
          </section>

          <div className="lb-community-summary">
            <div className="lb-community-summary__stats">
              <div className="lb-community-stat-card lb-community-stat-card--dark">
                <p>Total Laporan Bulan Ini</p>
                <strong>{stats.total || 1204}</strong>
              </div>
              <div className="lb-community-stat-card">
                <div className="lb-community-sdg-chip">
                  <span>●</span>
                  <p>SDG 14 · Life Below Water</p>
                </div>
                <small>
                  Mendukung pencapaian target konservasi dan pemanfaatan berkelanjutan sumber daya
                  laut.
                </small>
              </div>
            </div>

            <section className="lb-community-card">
              <div className="lb-community-card__head">
                <div>
                  <h2>Badge Kontributor</h2>
                  <p>Kumpulkan lencana melalui partisipasi aktif.</p>
                </div>
              </div>

              <div className="lb-community-badges">
                <div className="lb-community-badge">
                  <div className="lb-community-badge__icon is-green">📣</div>
                  <p>Pelapor Aktif</p>
                  <small>10+ Laporan</small>
                </div>
                <div className="lb-community-badge">
                  <div className="lb-community-badge__icon is-blue">♥</div>
                  <p>Relawan Pesisir</p>
                  <small>Hadir 3 Agenda</small>
                </div>
                <div className="lb-community-badge is-locked">
                  <div className="lb-community-badge__icon is-muted">🔒</div>
                  <p>Mata Elang</p>
                  <small>50+ Verifikasi</small>
                </div>
                <div className="lb-community-badge is-locked">
                  <div className="lb-community-badge__icon is-muted">🔒</div>
                  <p>Penjaga Karang</p>
                  <small>Khusus Wilayah</small>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="lb-community-bottom-grid">
          <section className="lb-community-agenda">
            <div className="lb-community-card__head lb-community-card__head--bordered">
              <h2>Agenda Cleanup Komunitas</h2>
              <Link href="/petawilayah">Lihat Peta</Link>
            </div>

            <div className="lb-community-agenda__list">
              {agendaReports.map((report, index) => (
                <article className="lb-community-agenda__item" key={`${report.id}-${index}`}>
                  <div className={`lb-community-agenda__rail${index === 0 ? ' is-critical' : ''}`} />
                  <div className="lb-community-agenda__image">
                    {report.photoUrls[0] ? (
                      <img alt={report.title} src={report.photoUrls[0]} />
                    ) : (
                      <div className="lb-community-agenda__image-fallback">LB</div>
                    )}
                  </div>
                  <div className="lb-community-agenda__content">
                    <div>
                      <div className="lb-community-agenda__head">
                        <h3>
                          {index === 0
                            ? `Pembersihan Massal: ${report.locationLabel}`
                            : `Aksi Komunitas: ${report.locationLabel}`}
                        </h3>
                        <span className={index === 0 ? 'is-high' : 'is-normal'}>
                          {index === 0 ? 'Tinggi' : 'Normal'}
                        </span>
                      </div>
                      <p>{report.description}</p>
                    </div>

                    <div className="lb-community-agenda__footer">
                      <div>
                        <span>📅</span>
                        <small>{formatAgendaDate(index === 0 ? 7 : 14)}</small>
                      </div>
                      <button className={index === 0 ? 'is-primary' : 'is-outline'} type="button">
                        {index === 0 ? 'Daftar Relawan' : 'Detail'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="lb-community-share-card">
            <h2>Sebarkan Dampak Anda</h2>
            <p>
              Bagikan laporan atau status kontributor Anda ke media sosial untuk menginspirasi lebih
              banyak orang.
            </p>

            <div className="lb-community-share-card__preview">
              <div className="lb-community-share-card__glow" />
              <div className="lb-community-share-card__preview-head">
                <span>✓</span>
                <p>Laporan Tervalidasi</p>
              </div>
              <strong>
                &quot;Saya baru saja melaporkan {heroShareReport?.title?.toLowerCase() || 'kondisi'} di{' '}
                {heroShareReport?.locationLabel || 'wilayah pesisir Indonesia'}&quot;
              </strong>
              <div className="lb-community-share-card__preview-footer">
                <div className="lb-community-share-card__author">
                  <div>{(contributors[0]?.name || 'LB').slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p>{contributors[0]?.name || 'Kontributor LautBersih'}</p>
                    <small>Pelapor Aktif</small>
                  </div>
                </div>
                <span>LB</span>
              </div>
            </div>

            <div className="lb-community-share-card__actions">
              <button className="is-download" type="button">
                Unduh Card
              </button>
              <button className="is-share" type="button">
                ↗
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="lb-community-footer">
        <div className="lb-community-footer__inner">
          <div className="lb-community-footer__brand">LautBersih</div>
          <nav>
            <Link href="/profil">Kebijakan Privasi</Link>
            <Link href="/profil">Syarat & Ketentuan</Link>
            <Link href="/notifikasi">Hubungi Kami</Link>
            <Link href="/dashboard">Laporan Tahunan</Link>
          </nav>
          <div>© 2024 LautBersih Maritime Authority. Protecting Indonesian Waters.</div>
        </div>
      </footer>
    </div>
  )
}
