import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getBlogPostBySlug } from '@/lib/blog'

export const dynamic = 'force-dynamic'

const severityLabel: Record<string, string> = {
  critical: 'Kritis',
  medium: 'Moderat',
  low: 'Rendah',
}

const severityColor: Record<string, string> = {
  critical: '#e24b4a',
  medium: '#ef9f27',
  low: '#1d9e75',
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="lb-news-page">
      <div className="lb-berita-detail-nav">
        <Link className="lb-button lb-button--ghost lb-button--sm" href="/berita">
          ← Semua Berita
        </Link>
        {post.sourceReportSlug && (
          <Link
            className="lb-button lb-button--ghost lb-button--sm"
            href={`/laporan/${post.sourceReportSlug}`}
          >
            Lihat Laporan Asli →
          </Link>
        )}
      </div>

      <article className="lb-berita-detail">
        {/* Meta */}
        <div className="lb-berita-detail__meta">
          {post.category && (
            <span
              className="lb-berita-card__cat"
              style={{
                background: `${post.category.color}18`,
                border: `1px solid ${post.category.color}30`,
                color: post.category.color,
              }}
            >
              {post.category.title}
            </span>
          )}
          <span
            className="lb-berita-detail__sev"
            style={{ color: severityColor[post.severity] }}
          >
            ● {severityLabel[post.severity]}
          </span>
          {post.isAiGenerated && (
            <span className="lb-berita-detail__ai-badge">✦ Ditulis AI</span>
          )}
        </div>

        {/* Title */}
        <h1 className="lb-berita-detail__title">{post.title}</h1>

        {/* Byline */}
        <div className="lb-berita-detail__byline">
          <span>📍 {post.locationLabel}</span>
          <span>·</span>
          <time>{publishedDate}</time>
        </div>

        {/* Cover image */}
        {post.coverUrl && (
          <div className="lb-berita-detail__cover">
            <img alt={post.coverAlt} src={post.coverUrl} />
          </div>
        )}

        {/* Content */}
        <div
          className="lb-berita-detail__content"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />

        {/* Footer */}
        <div className="lb-berita-detail__footer">
          {post.sourceReportSlug && (
            <Link className="lb-button" href={`/laporan/${post.sourceReportSlug}`}>
              Lihat Laporan Lengkap →
            </Link>
          )}
          <Link className="lb-button lb-button--ghost" href="/berita">
            ← Kembali ke Berita
          </Link>
        </div>
      </article>
    </main>
  )
}
