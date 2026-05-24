import { getPayloadClient } from '@/lib/getPayloadClient'

type MediaDoc = {
  id?: number | string
  cloudinaryUrl?: string | null
  url?: string | null
  filename?: string | null
  alt?: string | null
}

type CategoryDoc = {
  id?: number | string
  title?: string | null
  color?: string | null
}

type ReportDoc = {
  id?: number | string
  slug?: string | null
}

type RawBlogPost = {
  id?: number | string
  slug?: string | null
  title?: string | null
  excerpt?: string | null
  content?: string | null
  coverImage?: MediaDoc | number | string | null
  category?: CategoryDoc | number | string | null
  sourceReport?: ReportDoc | number | string | null
  locationLabel?: string | null
  severity?: 'low' | 'medium' | 'critical' | null
  publishedAt?: string | null
  isAiGenerated?: boolean | null
}

export type FrontendBlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverUrl: string | null
  coverAlt: string
  category: { id: string; title: string; color: string } | null
  sourceReportSlug: string | null
  locationLabel: string
  severity: 'low' | 'medium' | 'critical'
  publishedAt: string
  isAiGenerated: boolean
}

const resolveMediaUrl = (doc: MediaDoc): string | null => {
  if (doc.cloudinaryUrl) return doc.cloudinaryUrl
  if (doc.url) return doc.url
  if (doc.filename) return `/api/media/file/${doc.filename}`
  return null
}

const normalizeBlogPost = (raw: RawBlogPost): FrontendBlogPost => {
  const cover =
    raw.coverImage && typeof raw.coverImage === 'object' ? (raw.coverImage as MediaDoc) : null

  const cat =
    raw.category && typeof raw.category === 'object'
      ? (raw.category as CategoryDoc)
      : null

  const srcReport =
    raw.sourceReport && typeof raw.sourceReport === 'object'
      ? (raw.sourceReport as ReportDoc)
      : null

  return {
    id: String(raw.id ?? ''),
    slug: raw.slug ?? '',
    title: raw.title ?? 'Tanpa Judul',
    excerpt: raw.excerpt ?? '',
    content: raw.content ?? '',
    coverUrl: cover ? resolveMediaUrl(cover) : null,
    coverAlt: cover?.alt ?? raw.title ?? 'Foto laporan',
    category: cat
      ? { id: String(cat.id ?? ''), title: cat.title ?? '', color: cat.color ?? '#0b2540' }
      : null,
    sourceReportSlug: srcReport?.slug ?? null,
    locationLabel: raw.locationLabel ?? '—',
    severity: (raw.severity as 'low' | 'medium' | 'critical') ?? 'medium',
    publishedAt: raw.publishedAt ?? raw.publishedAt ?? new Date().toISOString(),
    isAiGenerated: raw.isAiGenerated ?? true,
  }
}

export const getBlogPosts = async (limit = 24): Promise<FrontendBlogPost[]> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'blog-posts' as any,
      limit,
      sort: '-publishedAt',
      depth: 2,
      overrideAccess: true,
    })
    return (result.docs as RawBlogPost[]).map(normalizeBlogPost)
  } catch {
    return []
  }
}

export const getBlogPostBySlug = async (slug: string): Promise<FrontendBlogPost | null> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'blog-posts' as any,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })
    const doc = (result.docs as RawBlogPost[])[0]
    return doc ? normalizeBlogPost(doc) : null
  } catch {
    return null
  }
}
