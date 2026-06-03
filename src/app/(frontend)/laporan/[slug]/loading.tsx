import { AppShell } from '@/components/lautbersih/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <AppShell activePath="/laporan">
      {/* Header Detail */}
      <div className="lb-detail-header-new">
        <div className="lb-detail-header-new__left">
          <div className="lb-back-link opacity-50">
            ← Kembali
          </div>
          <div className="lb-detail-header-new__title-group">
            <span className="lb-detail-header-new__eyebrow">DETAIL LAPORAN</span>
            <h1 className="lb-detail-header-new__subtitle">Informasi lengkap & analisis AI</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="lb-detail-hero-new">
        <div className="lb-detail-hero-new__content space-y-3">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-9 w-3/4 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          <div className="lb-detail-hero-new__meta-row">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
        <div className="lb-detail-hero-new__action">
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </section>

      <div className="lb-detail-grid-container">
        {/* Kolom Kiri: Foto + Peta */}
        <div className="lb-detail-column-left">
          <div className="lb-detail-media-container">
            <div className="lb-detail-section-header">
              <span className="lb-section-icon">📷</span> Bukti Visual
            </div>
            <div className="lb-detail-photo-wrapper">
              <Skeleton className="lb-detail-main-photo-container h-[450px] w-full rounded-2xl" />
            </div>
          </div>

          <div className="lb-detail-map-container">
            <div className="lb-detail-section-header">
              <span className="lb-section-icon">🗺</span> Lokasi Kejadian
            </div>
            <Skeleton className="lb-detail-map-wrapper h-[260px] w-full rounded-2xl" />
            <div className="lb-detail-map-coordinates mt-2">
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Analisis AI + Status Penanganan + Informasi Laporan */}
        <div className="lb-detail-column-right">
          {/* Analisis AI */}
          <div className="lb-ai-analysis-card-new space-y-4">
            <div className="lb-ai-analysis-card-new__header">
              <div className="lb-ai-analysis-card-new__title-group space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-5 w-44" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>

            <div className="lb-ai-analysis-card-new__meta-grid">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          </div>

          {/* Status Penanganan */}
          <div className="lb-status-panel-new space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex items-center justify-between px-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-4.5 w-4.5 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Informasi Laporan */}
          <div className="lb-info-grid-new">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="lb-info-card-new space-y-2" key={i}>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
            <div className="lb-info-card-new space-y-2" style={{ gridColumn: 'span 2' }}>
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
