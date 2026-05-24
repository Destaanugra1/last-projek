import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AppShell } from '@/components/lautbersih/AppShell'
import { SeverityBadge, StatusBadge } from '@/components/lautbersih/Badges'
import { ProgressStepper } from '@/components/lautbersih/ProgressStepper'
import { volumeLabels } from '@/lib/lautbersih'
import { getReportBySlug } from '@/lib/reports'
import { ReportMapView } from './ReportMapView'

export const dynamic = 'force-dynamic'

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

  const submittedAt = new Date(report.submittedAt).toLocaleString('id-ID', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const incidentCode = `INC-${String(report.id).slice(-4).padStart(4, '0')}`
  const sev = severityMeta[report.severity] ?? severityMeta.medium

  return (
    <AppShell activePath="/laporan">
      <section className="lb-detail-hero">
        <div className="lb-detail-hero__meta">
          <Link className="lb-button lb-button--ghost lb-button--sm" href="/">
            ← Kembali
          </Link>
          <SeverityBadge severity={report.severity} />
          <span className="lb-chip">#{incidentCode}</span>
          <StatusBadge status={report.status} />
        </div>
        <div className="lb-detail-hero__head">
          <div>
            <p className="lb-eyebrow">Laporan Insiden Maritim</p>
            <h1>{report.title}</h1>
            <p>{report.description}</p>
          </div>
          <div className="lb-hero__actions">
            <Link className="lb-button" href="/lapor">
              Buat Laporan Baru
            </Link>
          </div>
        </div>
      </section>

      <div className="lb-detail-shell">
        {/* Left: gallery + map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="lb-detail-gallery">
            {report.photoUrls.length > 0 ? (
              report.photoUrls.map((photo, index) => (
                <img alt={`${report.title} ${index + 1}`} key={photo} src={photo} />
              ))
            ) : (
              <div className="lb-empty-media">Belum ada dokumentasi foto.</div>
            )}
          </div>

          <section className="lb-panel lb-detail-panel">
            <p className="lb-eyebrow">Lokasi di Peta</p>
            <h2>{report.locationLabel}</h2>
            <div style={{ borderRadius: '16px', height: '280px', overflow: 'hidden', marginTop: '12px' }}>
              <ReportMapView latitude={report.latitude} longitude={report.longitude} />
            </div>
            <p style={{ color: 'var(--lb-text-soft)', fontSize: '0.82rem', marginTop: '8px' }}>
              📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </p>
          </section>
        </div>

        {/* Right: info + AI analysis + status */}
        <section className="lb-detail-main">
          <dl className="lb-detail-grid">
            <div>
              <dt>Lokasi</dt>
              <dd>{report.locationLabel}</dd>
            </div>
            <div>
              <dt>Tanggal Laporan</dt>
              <dd>{submittedAt}</dd>
            </div>
            <div>
              <dt>Pelapor</dt>
              <dd>{report.reporterName}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>{report.category?.title || 'Tanpa Kategori'}</dd>
            </div>
            <div>
              <dt>Estimasi Volume</dt>
              <dd>
                {report.estimatedVolume
                  ? volumeLabels[report.estimatedVolume as keyof typeof volumeLabels]
                  : 'Belum diisi'}
              </dd>
            </div>
          </dl>

          <section className="lb-analysis-card lb-detail-ai">
            <p className="lb-eyebrow">Analisis AI · Maritime Intelligence</p>
            <h2>Hasil Analisis</h2>
            <p className="lb-detail-summary">{report.summary}</p>

            <div className={`lb-detail-severity lb-detail-severity--${sev.tone}`}>
              <span>Tingkat Keparahan</span>
              <strong>{sev.label}</strong>
            </div>

            {report.recommendations.length > 0 && (
              <div className="lb-detail-recommendations">
                <p className="lb-eyebrow" style={{ marginBottom: '10px' }}>Rekomendasi Tindakan</p>
                <ul>
                  {report.recommendations.map((item) => (
                    <li key={item}>
                      <span>●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="lb-panel lb-detail-panel">
            <p className="lb-eyebrow">Status Penanganan</p>
            <h2>Progress laporan</h2>
            <ProgressStepper status={report.status} />
          </section>
        </section>
      </div>
    </AppShell>
  )
}
