import Image from 'next/image'
import Link from 'next/link'

import type { FrontendReport } from '@/lib/reports'
import { getReports } from '@/lib/reports'

const severityCopy: Record<FrontendReport['severity'], { label: string; tone: string }> = {
  critical: { label: 'Critical', tone: 'critical' },
  low: { label: 'Routine', tone: 'routine' },
  medium: { label: 'Elevated', tone: 'elevated' },
}

const statusCopy: Record<FrontendReport['status'], string> = {
  in_progress: 'Diproses',
  pending_review: 'Review',
  rejected: 'Ditolak',
  resolved: 'Selesai',
  validated: 'Tervalidasi',
}

const formatReportDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const getAnalysisSummary = (report: FrontendReport) =>
  report.summary || report.recommendations[0] || 'Analisis AI akan ditampilkan setelah proses validasi.'

type ReportCardProps = {
  report: FrontendReport
}

function ReportThumb({ report }: ReportCardProps) {
  if (!report.photoUrls[0]) {
    return <div className="lb-home__report-thumb-fallback">LB</div>
  }

  return (
    <div className="lb-home__report-thumb">
      <Image alt={report.title} fill sizes="84px" src={report.photoUrls[0]} />
    </div>
  )
}

function CompactReportCard({ report }: ReportCardProps) {
  const severity = severityCopy[report.severity]

  return (
    <Link className="lb-home__report-card lb-home__report-card--compact" href={`/laporan/${report.slug}`}>
      <div className="lb-home__report-card-head">
        <ReportThumb report={report} />

        <div className="lb-home__report-copy">
          <div className="lb-home__report-meta-row">
            <time dateTime={report.submittedAt}>{formatReportDate(report.submittedAt)}</time>
            <div className="lb-home__report-badges">
              <span className={`lb-home__severity lb-home__severity--${severity.tone}`}>
                {severity.label}
              </span>
              <span className="lb-home__report-status">{statusCopy[report.status]}</span>
            </div>
          </div>

          <h3>{report.title}</h3>
        </div>
      </div>

      <p className="lb-home__report-description">{report.description}</p>

      <div className="lb-home__report-summary">
        <span>AI analysis</span>
        <p>{getAnalysisSummary(report)}</p>
      </div>
    </Link>
  )
}

function FeaturedReportCard({ report }: ReportCardProps) {
  const severity = severityCopy[report.severity]

  return (
    <Link className="lb-home__report-card lb-home__report-card--featured" href={`/laporan/${report.slug}`}>
      <div className="lb-home__report-featured-media" aria-hidden="true">
        {report.photoUrls[0] ? (
          <Image alt={report.title} fill priority={false} sizes="(max-width: 980px) 100vw, 46vw" src={report.photoUrls[0]} />
        ) : (
          <div className="lb-home__report-featured-fallback" />
        )}
      </div>

      <div className="lb-home__report-featured-overlay" />

      <div className="lb-home__report-featured-content">
        <div className="lb-home__report-meta-row lb-home__report-meta-row--featured">
          <time dateTime={report.submittedAt}>{formatReportDate(report.submittedAt)}</time>
          <div className="lb-home__report-badges">
            <span className={`lb-home__severity lb-home__severity--${severity.tone}`}>
              {severity.label}
            </span>
            <span className="lb-home__report-status lb-home__report-status--inverse">
              {statusCopy[report.status]}
            </span>
          </div>
        </div>

        <div className="lb-home__report-featured-body">
          <h3>{report.title}</h3>
          <p className="lb-home__report-description">{report.description}</p>
          <p className="lb-home__report-summary-text">{getAnalysisSummary(report)}</p>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="lb-home__reports-empty">
      <span>Laporan Terkini</span>
      <h3>Belum ada laporan yang tersedia</h3>
      <p>Laporan baru dari Payload CMS akan muncul di sini secara otomatis setelah data diterbitkan.</p>
    </div>
  )
}

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`lb-home__report-card lb-home__report-card--skeleton${featured ? ' is-featured' : ''}`}>
      <div className="lb-home__report-skeleton-block lb-home__report-skeleton-block--sm" />
      <div className="lb-home__report-skeleton-block lb-home__report-skeleton-block--md" />
      <div className="lb-home__report-skeleton-block lb-home__report-skeleton-block--lg" />
      <div className="lb-home__report-skeleton-block lb-home__report-skeleton-block--lg" />
      <div className="lb-home__report-skeleton-block lb-home__report-skeleton-block--md" />
    </div>
  )
}

export function LatestReportsSectionSkeleton() {
  return (
    <section className="lb-home__section">
      <div className="lb-home__section-head">
        <div>
          <h2>Daftar Laporan Terkini</h2>
          <p>
            Monitor aktivitas maritim secara real-time. Setiap laporan telah dianalisis untuk
            mendukung akurasi operasional.
          </p>
        </div>
        <div className="lb-home__section-actions">
          <span className="lb-home__toolbar-btn">Filter</span>
          <span className="lb-home__toolbar-btn">Ekspor Data</span>
        </div>
      </div>

      <div className="lb-home__reports-layout">
        <div className="lb-home__reports-stack">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard featured />
      </div>
    </section>
  )
}

export async function LatestReportsSection() {
  const reports = await getReports(3, '-createdAt')

  if (reports.length === 0) {
    return (
      <section className="lb-home__section">
        <div className="lb-home__section-head">
          <div>
            <h2>Daftar Laporan Terkini</h2>
            <p>
              Monitor aktivitas maritim secara real-time. Setiap laporan telah dianalisis untuk
              mendukung akurasi operasional.
            </p>
          </div>
          <div className="lb-home__section-actions">
            <Link className="lb-home__toolbar-btn" href="/petawilayah">
              Filter
            </Link>
            <Link className="lb-home__toolbar-btn" href="/dashboard">
              Ekspor Data
            </Link>
          </div>
        </div>

        <EmptyState />
      </section>
    )
  }

  const compactReports = reports.slice(0, Math.min(reports.length, 2))
  const featuredReport = reports.length >= 3 ? reports[2] : null

  return (
    <section className="lb-home__section">
      <div className="lb-home__section-head">
        <div>
          <h2>Daftar Laporan Terkini</h2>
          <p>
            Monitor aktivitas maritim secara real-time. Setiap laporan telah dianalisis untuk
            mendukung akurasi operasional.
          </p>
        </div>
        <div className="lb-home__section-actions">
          <Link className="lb-home__toolbar-btn" href="/petawilayah">
            Filter
          </Link>
          <Link className="lb-home__toolbar-btn" href="/dashboard">
            Ekspor Data
          </Link>
        </div>
      </div>

      <div className={`lb-home__reports-layout${featuredReport ? '' : ' is-compact-only'}`}>
        <div className="lb-home__reports-stack">
          {compactReports.map((report) => (
            <CompactReportCard key={report.id} report={report} />
          ))}
        </div>

        {featuredReport && <FeaturedReportCard report={featuredReport} />}
      </div>
    </section>
  )
}
