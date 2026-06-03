import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AppShell } from '@/components/lautbersih/AppShell'
import { SeverityBadge, StatusBadge } from '@/components/lautbersih/Badges'
import { ProgressStepper } from '@/components/lautbersih/ProgressStepper'
import { volumeLabels } from '@/lib/lautbersih'
import { getReportBySlug } from '@/lib/reports'
import { ReportMapView } from './ReportMapView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const report = await getReportBySlug(slug)
  if (!report) return { title: 'Laporan Tidak Ditemukan' }
  return { title: report.title }
}

const severityMeta: Record<string, { label: string; tone: string }> = {
  critical: { label: 'KRITIS (LEVEL 4)', tone: 'critical' },
  medium:   { label: 'MODERAT (LEVEL 2)', tone: 'moderate' },
  low:      { label: 'WASPADA (LEVEL 1)', tone: 'safe' },
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const report = await getReportBySlug(slug)

  if (!report) {
    notFound()
  }

  const submittedAtShort = new Date(report.submittedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const incidentCode = `INC-${String(report.id).slice(-4).padStart(4, '0')}`

  const confidenceScore = (() => {
    const num = parseInt(report.id.replace(/\D/g, '')) || 42
    return 85 + (num % 14)
  })()

  const statusLabelsMap: Record<string, string> = {
    pending_review: 'Review',
    validated: 'Terverifikasi',
    in_progress: 'Penanganan',
    resolved: 'Selesai',
    rejected: 'Ditolak',
  }

  const statusLabelText = statusLabelsMap[report.status] || report.status
  const steps = ['pending_review', 'validated', 'in_progress', 'resolved']
  const currentStepIndex = steps.indexOf(report.status === 'rejected' ? 'pending_review' : report.status)

  return (
    <AppShell activePath="/laporan">
      <div className="lb-detail-header-new">
        <div className="lb-detail-header-new__left">
          <Link className="lb-back-link" href="/">
            ← Kembali
          </Link>
          <div className="lb-detail-header-new__title-group">
            <span className="lb-detail-header-new__eyebrow">DETAIL LAPORAN</span>
            <h1 className="lb-detail-header-new__subtitle">Informasi lengkap & analisis AI</h1>
          </div>
        </div>
      </div>

      <section className="lb-detail-hero-new">
        <div className="lb-detail-hero-new__content">
          <span className="lb-hero-badge-tag">Laporan Insiden Maritim</span>
          <h2 className="lb-detail-hero-new__title">{report.title}</h2>
          <p className="lb-detail-hero-new__desc">{report.description}</p>
          
          <div className="lb-detail-hero-new__meta-row">
            <span className={`lb-meta-badge lb-meta-badge--severity-${report.severity}`}>
              {report.severity === 'critical' ? '🔴 Kritis' : report.severity === 'medium' ? '🟡 Medium' : '🟢 Rendah'}
            </span>
            <span className="lb-meta-badge lb-meta-badge--code">
              #{incidentCode}
            </span>
            <span className={`lb-meta-badge lb-meta-badge--status-${report.status}`}>
              {report.status === 'resolved' ? '✅ Selesai' : 
               report.status === 'in_progress' ? '⚡ Penanganan' : 
               report.status === 'validated' ? '✅ Terverifikasi' : 
               report.status === 'rejected' ? '❌ Ditolak' : '⏳ Review'}
            </span>
            <span className="lb-meta-badge lb-meta-badge--date">
              📅 {submittedAtShort}
            </span>
          </div>
        </div>
        <div className="lb-detail-hero-new__action">
          <Link className="lb-button-new-report" href="/lapor">
            <span className="plus-icon">+</span> Buat Laporan Baru
          </Link>
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
              {report.photoUrls.length > 0 ? (
                <>
                  <div className="lb-detail-main-photo-container">
                    <img 
                      alt={report.title} 
                      src={report.photoUrls[0]} 
                      className="lb-detail-main-photo" 
                    />
                  </div>
                  {report.photoUrls.length > 1 && (
                    <div className="lb-detail-thumbnails">
                      {report.photoUrls.map((photo, index) => (
                        <img 
                          key={photo} 
                          alt={`${report.title} ${index + 1}`} 
                          src={photo} 
                          className="lb-detail-thumbnail" 
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="lb-detail-photo-empty">
                  <span>Belum ada dokumentasi foto.</span>
                </div>
              )}
            </div>
          </div>

          <div className="lb-detail-map-container">
            <div className="lb-detail-section-header">
              <span className="lb-section-icon">🗺</span> Lokasi Kejadian
            </div>
            <div className="lb-detail-map-wrapper">
              <ReportMapView latitude={report.latitude} longitude={report.longitude} />
            </div>
            <div className="lb-detail-map-coordinates">
              📍 Koordinat {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Analisis AI + Status Penanganan + Informasi Laporan */}
        <div className="lb-detail-column-right">
          {/* Analisis AI */}
          <div className="lb-ai-analysis-card-new">
            <div className="lb-ai-analysis-card-new__header">
              <div className="lb-ai-analysis-card-new__title-group">
                <span className="lb-ai-analysis-card-new__eyebrow">🤖 Analisis AI</span>
                <h3 className="lb-ai-analysis-card-new__title">Maritime Intelligence</h3>
              </div>
            </div>

            <div>
              <h4 className="lb-ai-analysis-card-new__section-title">Ringkasan</h4>
              <p className="lb-ai-analysis-card-new__summary-text">{report.summary}</p>
            </div>

            <div className="lb-ai-analysis-card-new__meta-grid">
              <div className="lb-ai-analysis-card-new__severity-box">
                <span className="lb-ai-analysis-card-new__section-title" style={{ margin: 0 }}>Tingkat Keparahan</span>
                <div className={`severity-badge-inline severity-badge-inline--${report.severity}`}>
                  {report.severity === 'critical' ? '🔴 Kritis' : report.severity === 'medium' ? '🟡 Sedang' : '🟢 Rendah'}
                </div>
                <span className="severity-level">
                  {report.severity === 'critical' ? 'Level 3' : report.severity === 'medium' ? 'Level 2' : 'Level 1'}
                </span>
              </div>

              <div className="lb-ai-analysis-card-new__confidence-box">
                <div className="lb-ai-analysis-card-new__confidence-header">
                  <span className="lb-ai-analysis-card-new__section-title" style={{ margin: 0 }}>Confidence AI</span>
                  <span>{confidenceScore}%</span>
                </div>
                <div className="lb-ai-analysis-card-new__confidence-bar">
                  <div className="bar-fill" style={{ width: `${confidenceScore}%` }} />
                </div>
              </div>
            </div>

            {report.recommendations.length > 0 && (
              <div className="lb-ai-analysis-card-new__recommendations-box">
                <h4 className="lb-ai-analysis-card-new__section-title">Rekomendasi</h4>
                <ul className="lb-ai-analysis-card-new__recommendations-list">
                  {report.recommendations.map((item) => (
                    <li key={item} className="lb-ai-analysis-card-new__recommendation-item">
                      <span className="check-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Status Penanganan */}
          <div className="lb-status-panel-new">
            <div className="lb-detail-section-header" style={{ marginBottom: 0 }}>
              Status Penanganan
            </div>

            <div className="lb-status-panel-new__badge-row">
              <span className="lb-status-panel-new__badge-label">Status Saat Ini:</span>
              <span className={`lb-status-panel-new__badge-value lb-status-panel-new__badge-value--${report.status}`}>
                {statusLabelText}
              </span>
            </div>

            <div className="lb-stepper-new">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex
                const isActive = idx === currentStepIndex
                const stateClass = isCompleted ? 'lb-step-new--completed' : isActive ? 'lb-step-new--active' : ''
                
                return (
                  <div key={step} className={`lb-step-new ${stateClass}`}>
                    <div className="lb-step-new__dot" />
                    <span className="lb-step-new__label">{statusLabelsMap[step]}</span>
                  </div>
                )
              })}
            </div>

            {report.status === 'rejected' && (
              <div className="lb-stepper-note-new">
                Laporan ditolak setelah tahap review. Admin dapat membuka ulang laporan jika ada bukti tambahan.
              </div>
            )}
          </div>

          {/* Informasi Laporan */}
          <div className="lb-info-grid-new">
            <div className="lb-info-card-new">
              <div className="lb-info-card-new__header">
                <span className="lb-info-card-new__icon">📍</span>
                <span className="lb-info-card-new__label">Lokasi</span>
              </div>
              <div className="lb-info-card-new__value">
                {report.locationLabel}
              </div>
            </div>

            <div className="lb-info-card-new">
              <div className="lb-info-card-new__header">
                <span className="lb-info-card-new__icon">👤</span>
                <span className="lb-info-card-new__label">Pelapor</span>
              </div>
              <div className="lb-info-card-new__value">
                {report.reporterName || 'Anonim'}
              </div>
            </div>

            <div className="lb-info-card-new">
              <div className="lb-info-card-new__header">
                <span className="lb-info-card-new__icon">📅</span>
                <span className="lb-info-card-new__label">Tanggal</span>
              </div>
              <div className="lb-info-card-new__value">
                {submittedAtShort}
              </div>
            </div>

            <div className="lb-info-card-new">
              <div className="lb-info-card-new__header">
                <span className="lb-info-card-new__icon">🏷</span>
                <span className="lb-info-card-new__label">Kategori</span>
              </div>
              <div className="lb-info-card-new__value">
                {report.category?.title || 'Tanpa Kategori'}
              </div>
            </div>

            <div className="lb-info-card-new" style={{ gridColumn: 'span 2' }}>
              <div className="lb-info-card-new__header">
                <span className="lb-info-card-new__icon">🗑</span>
                <span className="lb-info-card-new__label">Estimasi Volume</span>
              </div>
              <div className="lb-info-card-new__value">
                {report.estimatedVolume
                  ? volumeLabels[report.estimatedVolume as keyof typeof volumeLabels]
                  : 'Belum diisi'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
