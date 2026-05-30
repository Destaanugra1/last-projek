import { fallbackRecommendations } from '@/lib/lautbersih'
import { getPayloadClient } from '@/lib/getPayloadClient'

type RelationDoc = {
  id?: number | string
  alt?: string | null
  cloudinaryUrl?: string | null
  cloudinaryPublicId?: string | null
  color?: string | null
  filename?: string | null
  title?: string | null
  slug?: string | null
  url?: string | null
}

type RawReport = {
  aiAnalysis?: {
    recommendations?: Array<{ item?: string | null }> | null
    summary?: string | null
  } | null
  category?: RelationDoc | number | string | null
  createdAt?: string
  description?: string | null
  estimatedVolume?: string | null
  id?: number | string
  latitude?: number | null
  locationLabel?: string | null
  longitude?: number | null
  photos?: Array<RelationDoc | number | string> | null
  reportedBy?: {
    avatarUrl?: string | null
    fullName?: string | null
    id?: number | string
  } | null
  reporterName?: string | null
  severity?: 'low' | 'medium' | 'critical' | null
  slug?: string | null
  status?:
    | 'in_progress'
    | 'pending_review'
    | 'rejected'
    | 'resolved'
    | 'validated'
    | null
  submittedAt?: string | null
  title?: string | null
}

export type FrontendCategory = {
  color: string
  id: string
  slug: string
  title: string
}

export type FrontendReport = {
  category: FrontendCategory | null
  description: string
  estimatedVolume: string | null
  id: string
  latitude: number
  locationLabel: string
  longitude: number
  photoUrls: string[]
  recommendations: string[]
  reportedBy: {
    avatarUrl: string | null
    fullName: string | null
    id: string
  } | null
  reporterName: string
  severity: 'critical' | 'low' | 'medium'
  slug: string
  status: 'in_progress' | 'pending_review' | 'rejected' | 'resolved' | 'validated'
  submittedAt: string
  summary: string
  title: string
}

export type DashboardStats = {
  byCategory: Array<{ label: string; total: number }>
  byStatus: Array<{ label: string; total: number }>
  criticalCount: number
  resolvedCount: number
  timeline: Array<{ label: string; total: number }>
  topLocations: Array<{ label: string; total: number }>
  total: number
  validatedCount: number
}

export type SiteHeroAction = {
  href: string
  label: string
}

export type SiteSettingsData = {
  heroBadge: string
  heroBanners: SiteHeroBanner[]
  heroDescription: string
  heroPrimaryAction: SiteHeroAction
  heroSecondaryAction: SiteHeroAction
  heroTitle: string
  siteName: string
  statsNotice: string
  tagline: string
}

type RawHeroAction = {
  href?: string | null
  label?: string | null
}

type RawHeroBanner = {
  description?: string | null
  eyebrow?: string | null
  image?: RelationDoc | number | string | null
  title?: string | null
}

export type SiteHeroBanner = {
  alt: string
  description: string | null
  eyebrow: string | null
  id: string
  src: string
  title: string | null
}

const defaultSiteSettings: SiteSettingsData = {
  heroBadge: 'SDG 14 · Life Below Water',
  heroBanners: [],
  heroDescription:
    'Memantau, menganalisis, dan menindaklanjuti ancaman maritim secara real-time untuk melindungi kekayaan hayati nusantara.',
  heroPrimaryAction: {
    href: '/petawilayah',
    label: 'Mulai Monitoring',
  },
  heroSecondaryAction: {
    href: '/mulai',
    label: 'Pelajari Protokol',
  },
  heroTitle: 'Otoritas Maritim untuk Ekosistem Laut Indonesia yang Berkelanjutan',
  siteName: 'LautBersih',
  statsNotice: 'Data dashboard diperbarui dari laporan yang masuk ke Payload CMS.',
  tagline: 'Platform pelaporan sampah pesisir berbasis komunitas',
}

const statusLabels: Record<FrontendReport['status'], string> = {
  in_progress: 'Dalam Penanganan',
  pending_review: 'Menunggu Review',
  rejected: 'Ditolak',
  resolved: 'Selesai',
  validated: 'Tervalidasi',
}

const normalizeMediaURL = (relation: RelationDoc | number | string): string | null => {
  if (!relation || typeof relation === 'number' || typeof relation === 'string') {
    return null
  }

  if (relation.cloudinaryUrl) {
    return relation.cloudinaryUrl
  }

  if (relation.url) {
    return relation.url
  }

  if (relation.filename) {
    return `/api/media/file/${relation.filename}`
  }

  return null
}

const normalizeCategory = (value: RawReport['category']): FrontendCategory | null => {
  if (!value || typeof value === 'number' || typeof value === 'string') {
    return null
  }

  return {
    color: value.color || '#52B788',
    id: String(value.id || value.slug || 'uncategorized'),
    slug: value.slug || 'uncategorized',
    title: value.title || 'Tanpa Kategori',
  }
}

const normalizeHeroBanner = (banner: RawHeroBanner, index: number): SiteHeroBanner | null => {
  if (!banner.image || typeof banner.image === 'number' || typeof banner.image === 'string') {
    return null
  }

  const src = normalizeMediaURL(banner.image)

  if (!src) {
    return null
  }

  return {
    alt: banner.image.alt || banner.title || `Banner hero ${index + 1}`,
    description: banner.description?.trim() || null,
    eyebrow: banner.eyebrow?.trim() || null,
    id: String(banner.image.id || `hero-banner-${index + 1}`),
    src,
    title: banner.title?.trim() || null,
  }
}

const normalizeHeroAction = (
  action: RawHeroAction | null | undefined,
  fallback: SiteHeroAction,
): SiteHeroAction => ({
  href: action?.href?.trim() || fallback.href,
  label: action?.label?.trim() || fallback.label,
})

const normalizeReport = (doc: RawReport): FrontendReport => {
  const recommendations =
    doc.aiAnalysis?.recommendations
      ?.map((entry) => entry.item?.trim())
      .filter((entry): entry is string => Boolean(entry)) || fallbackRecommendations

  const reportedByUser = doc.reportedBy
    ? {
        avatarUrl: doc.reportedBy.avatarUrl || null,
        fullName: doc.reportedBy.fullName || null,
        id: String(doc.reportedBy.id || ''),
      }
    : null

  return {
    category: normalizeCategory(doc.category),
    description: doc.description || 'Belum ada deskripsi laporan.',
    estimatedVolume: doc.estimatedVolume || null,
    id: String(doc.id || ''),
    latitude: typeof doc.latitude === 'number' ? doc.latitude : -6.2,
    locationLabel: doc.locationLabel || 'Lokasi belum ditentukan',
    longitude: typeof doc.longitude === 'number' ? doc.longitude : 106.8,
    photoUrls: (doc.photos || [])
      .map((photo) => normalizeMediaURL(photo))
      .filter((photo): photo is string => Boolean(photo)),
    recommendations,
    reportedBy: reportedByUser,
    reporterName: doc.reporterName || 'Anonim',
    severity: doc.severity || 'medium',
    slug: doc.slug || String(doc.id || ''),
    status: doc.status || 'pending_review',
    submittedAt: doc.submittedAt || doc.createdAt || new Date().toISOString(),
    summary:
      doc.aiAnalysis?.summary ||
      'Sistem akan menampilkan ringkasan AI setelah laporan divalidasi dan diproses.',
    title: doc.title || 'Laporan Baru',
  }
}

export const getSiteSettings = async (): Promise<SiteSettingsData> => {
  const payload = await getPayloadClient()

  try {
    const data = (await payload.findGlobal({
      depth: 2,
      slug: 'site-settings',
    })) as Partial<SiteSettingsData> & {
      heroBanners?: RawHeroBanner[]
      heroPrimaryAction?: RawHeroAction
      heroSecondaryAction?: RawHeroAction
    }

    return {
      heroBadge: data.heroBadge || defaultSiteSettings.heroBadge,
      heroBanners:
        data.heroBanners
          ?.map((banner, index) => normalizeHeroBanner(banner, index))
          .filter((banner): banner is SiteHeroBanner => Boolean(banner)) ||
        defaultSiteSettings.heroBanners,
      heroDescription: data.heroDescription || defaultSiteSettings.heroDescription,
      heroPrimaryAction: normalizeHeroAction(
        data.heroPrimaryAction,
        defaultSiteSettings.heroPrimaryAction,
      ),
      heroSecondaryAction: normalizeHeroAction(
        data.heroSecondaryAction,
        defaultSiteSettings.heroSecondaryAction,
      ),
      heroTitle: data.heroTitle || defaultSiteSettings.heroTitle,
      siteName: data.siteName || defaultSiteSettings.siteName,
      statsNotice: data.statsNotice || defaultSiteSettings.statsNotice,
      tagline: data.tagline || defaultSiteSettings.tagline,
    }
  } catch {
    return defaultSiteSettings
  }
}

export const getWasteCategories = async (): Promise<FrontendCategory[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'waste-categories',
    limit: 24,
    overrideAccess: false,
    sort: 'title',
  })

  return result.docs.map((doc: any) => ({
    color: doc.color || '#52B788',
    id: String(doc.id || doc.slug || 'uncategorized'),
    slug: doc.slug || 'uncategorized',
    title: doc.title || 'Tanpa Kategori',
  }))
}

type ReportsWhere = {
  reportedBy?: { equals: number | string }
}

export const getReports = async (
  limit = 12,
  sort: '-createdAt' | '-submittedAt' | '-updatedAt' = '-submittedAt',
  where?: ReportsWhere,
): Promise<FrontendReport[]> => {
  const payload = await getPayloadClient()

  const findOptions: Parameters<typeof payload.find>[0] = {
    collection: 'reports',
    depth: 2,
    limit,
    overrideAccess: false,
    sort,
  }
  if (where) {
    findOptions.where = where as any
  }

  const result = await payload.find(findOptions)

  return result.docs.map((doc) => normalizeReport(doc as RawReport))
}

export const getReportBySlug = async (slug: string): Promise<FrontendReport | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'reports',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const doc = result.docs[0] as RawReport | undefined
  return doc ? normalizeReport(doc) : null
}

export const buildDashboardStats = (reports: FrontendReport[]): DashboardStats => {
  const categoryCounts = new Map<string, number>()
  const statusCounts = new Map<string, number>()
  const locationCounts = new Map<string, number>()
  const timelineCounts = new Map<string, number>()

  reports.forEach((report) => {
    const categoryLabel = report.category?.title || 'Tanpa Kategori'
    categoryCounts.set(categoryLabel, (categoryCounts.get(categoryLabel) || 0) + 1)

    const statusLabel = statusLabels[report.status]
    statusCounts.set(statusLabel, (statusCounts.get(statusLabel) || 0) + 1)

    locationCounts.set(report.locationLabel, (locationCounts.get(report.locationLabel) || 0) + 1)

    const date = new Date(report.submittedAt)
    const timelineLabel = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    })
    timelineCounts.set(timelineLabel, (timelineCounts.get(timelineLabel) || 0) + 1)
  })

  return {
    byCategory: Array.from(categoryCounts.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((left, right) => right.total - left.total),
    byStatus: Array.from(statusCounts.entries()).map(([label, total]) => ({ label, total })),
    criticalCount: reports.filter((report) => report.severity === 'critical').length,
    resolvedCount: reports.filter((report) => report.status === 'resolved').length,
    timeline: Array.from(timelineCounts.entries())
      .map(([label, total]) => ({ label, total }))
      .slice(0, 7)
      .reverse(),
    topLocations: Array.from(locationCounts.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((left, right) => right.total - left.total)
      .slice(0, 5),
    total: reports.length,
    validatedCount: reports.filter((report) => report.status === 'validated').length,
  }
}
