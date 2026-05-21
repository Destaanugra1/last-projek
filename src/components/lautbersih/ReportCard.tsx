import Link from 'next/link'

import { SeverityBadge, StatusBadge } from '@/components/lautbersih/Badges'
import type { FrontendReport } from '@/lib/reports'

export const ReportCard = ({
  compact = false,
  report,
}: {
  compact?: boolean
  report: FrontendReport
}) => {
  const submittedAt = new Date(report.submittedAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className={`lb-report-card${compact ? ' lb-report-card--compact' : ''}`}>
      <div className="lb-report-card__media">
        {report.photoUrls[0] ? (
          <img alt={report.title} src={report.photoUrls[0]} />
        ) : (
          <div className="lb-report-card__placeholder">Belum ada foto</div>
        )}
      </div>
      <div className="lb-report-card__body">
        <div className="lb-report-card__meta">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
          {report.category?.title ? <span className="lb-chip">{report.category.title}</span> : null}
        </div>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
        <dl>
          <div>
            <dt>Lokasi</dt>
            <dd>{report.locationLabel}</dd>
          </div>
          <div>
            <dt>Tanggal</dt>
            <dd>{submittedAt}</dd>
          </div>
          <div>
            <dt>Kategori</dt>
            <dd>{report.category?.title || 'Belum diklasifikasikan'}</dd>
          </div>
        </dl>
        <Link className="lb-text-link" href={`/laporan/${report.slug}`}>
          Lihat detail
        </Link>
      </div>
    </article>
  )
}
