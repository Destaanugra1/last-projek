import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AppShell } from '@/components/lautbersih/AppShell'
import { SeverityBadge, StatusBadge } from '@/components/lautbersih/Badges'
import { ProgressStepper } from '@/components/lautbersih/ProgressStepper'
import { volumeLabels } from '@/lib/lautbersih'
import { getReportBySlug } from '@/lib/reports'

export const dynamic = 'force-dynamic'

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
  const markerLeft = `${Math.min(78, Math.max(22, 50 + (report.longitude - 110) * 1.4))}%`
  const markerTop = `${Math.min(74, Math.max(24, 52 - (report.latitude + 6.5) * 6))}%`
  const incidentCode = `INC-${String(report.id).slice(-4).padStart(4, '0')}`

  return (
    <AppShell activePath="/lapor">
      <section className="lb-detail-hero">
        <div className="lb-detail-hero__meta">
          <SeverityBadge severity={report.severity} />
          <span className="lb-chip">#{incidentCode}</span>
          <StatusBadge status={report.status} />
        </div>
        <div className="lb-detail-hero__head">
          <div>
            <p className="lb-eyebrow">Incident Detail</p>
            <h1>{report.title}</h1>
            <p>{report.description}</p>
          </div>
          <div className="lb-hero__actions">
            <Link className="lb-button" href="/dashboard">
              Dispatch Review
            </Link>
            <Link className="lb-button lb-button--ghost" href="/lapor">
              Kembali
            </Link>
          </div>
        </div>
      </section>

      <div className="lb-detail-shell">
        <div className="lb-detail-gallery">
          {report.photoUrls.length > 0 ? (
            report.photoUrls.map((photo, index) => (
              <img alt={`${report.title} ${index + 1}`} key={photo} src={photo} />
            ))
          ) : (
            <div className="lb-empty-media">Belum ada dokumentasi foto.</div>
          )}
        </div>

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
              <dt>Estimasi Volume</dt>
              <dd>
                {report.estimatedVolume
                  ? volumeLabels[report.estimatedVolume as keyof typeof volumeLabels]
                  : 'Belum diisi'}
              </dd>
            </div>
          </dl>

          <section className="lb-analysis-card">
            <p className="lb-eyebrow">Analisis AI</p>
            <h2>Insight profile</h2>
            <p>{report.summary}</p>
            <ul>
              {report.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="lb-panel lb-detail-panel">
            <p className="lb-eyebrow">Status Laporan</p>
            <h2>Progress penanganan</h2>
            <ProgressStepper status={report.status} />
          </section>

          <section className="lb-panel lb-detail-panel">
            <p className="lb-eyebrow">Lokasi di Peta</p>
            <h2>{report.locationLabel}</h2>
            <div className="lb-mini-map" aria-label="Mini map lokasi laporan">
              <div className="lb-map-grid" />
              <div className="lb-mini-map__marker" style={{ left: markerLeft, top: markerTop }} />
            </div>
          </section>
        </section>
      </div>
    </AppShell>
  )
}
