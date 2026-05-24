import Link from 'next/link'

import { getBlogPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'

const severityLabel: Record<string, string> = {
  critical: 'Kritis',
  medium: 'Moderat',
  low: 'Rendah',
}

const severityColor: Record<string, string> = {
  critical: '#c70000',
  medium: '#d4521a',
  low: '#00734b',
}

export default async function BeritaPage() {
  const posts = await getBlogPosts(24)

  const hero = posts[0] ?? null
  const secondary = posts.slice(1, 4)
  const rest = posts.slice(4)

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <main className="lb-news-page">
      {/* ── Section header (Guardian-style blue bar) ── */}
      <div className="lb-news-section-bar">
        <span>Berita Lingkungan</span>
        <Link className="lb-news-section-bar__cta" href="/lapor">+ Kirim Laporan</Link>
      </div>

      {posts.length === 0 ? (
        <div className="lb-news-empty">
          <p>Belum ada artikel. Artikel muncul otomatis setelah laporan dikirim.</p>
          <Link className="lb-button" href="/lapor">Kirim Laporan Pertama</Link>
        </div>
      ) : (
        <>
          {/* ── Hero + secondary ── */}
          <div className="lb-news-top">
            {/* Hero */}
            {hero && (
              <Link className="lb-news-hero" href={`/berita/${hero.slug}`}>
                <div className="lb-news-hero__img">
                  {hero.coverUrl
                    ? <img alt={hero.coverAlt} src={hero.coverUrl} />
                    : <div className="lb-news-hero__img-placeholder" />}
                </div>
                <div className="lb-news-hero__body">
                  {hero.category && (
                    <span className="lb-news-kicker" style={{ color: hero.category.color }}>
                      {hero.category.title}
                    </span>
                  )}
                  <h2 className="lb-news-hero__title">{hero.title}</h2>
                  {hero.excerpt && <p className="lb-news-hero__standfirst">{hero.excerpt}</p>}
                  <div className="lb-news-hero__meta">
                    <span style={{ color: severityColor[hero.severity] }}>
                      {severityLabel[hero.severity]}
                    </span>
                    <span>·</span>
                    <span>{hero.locationLabel}</span>
                    <span>·</span>
                    <time>{fmt(hero.publishedAt)}</time>
                  </div>
                </div>
              </Link>
            )}

            {/* Secondary column */}
            {secondary.length > 0 && (
              <div className="lb-news-secondary">
                {secondary.map((post) => (
                  <Link className="lb-news-secondary__item" href={`/berita/${post.slug}`} key={post.id}>
                    <div className="lb-news-secondary__text">
                      {post.category && (
                        <span className="lb-news-kicker" style={{ color: post.category.color }}>
                          {post.category.title}
                        </span>
                      )}
                      <h3>{post.title}</h3>
                      <div className="lb-news-meta">
                        <span style={{ color: severityColor[post.severity] }}>{severityLabel[post.severity]}</span>
                        <span>·</span>
                        <time>{fmt(post.publishedAt)}</time>
                      </div>
                    </div>
                    {post.coverUrl && (
                      <div className="lb-news-secondary__thumb">
                        <img alt={post.coverAlt} src={post.coverUrl} />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          {rest.length > 0 && (
            <>
              <div className="lb-news-rule" />
              <p className="lb-news-more-label">Laporan Terbaru Lainnya</p>
              <div className="lb-news-grid">
                {rest.map((post) => (
                  <Link className="lb-news-card" href={`/berita/${post.slug}`} key={post.id}>
                    {post.coverUrl && (
                      <div className="lb-news-card__img">
                        <img alt={post.coverAlt} src={post.coverUrl} />
                      </div>
                    )}
                    <div className="lb-news-card__body">
                      {post.category && (
                        <span className="lb-news-kicker" style={{ color: post.category.color }}>
                          {post.category.title}
                        </span>
                      )}
                      <h3>{post.title}</h3>
                      <div className="lb-news-meta">
                        <span style={{ color: severityColor[post.severity] }}>{severityLabel[post.severity]}</span>
                        <span>·</span>
                        <time>{fmt(post.publishedAt)}</time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
