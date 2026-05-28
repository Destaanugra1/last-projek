import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

import { SeverityBadge, StatusBadge } from '@/components/lautbersih/Badges'
import { getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

export default async function ReportsListPage() {
  const user = (await getCurrentUser()) as { role?: string } | null

  if (!user) {
    redirect('/api/auth/logout')
  }

  if (user.role === 'user') {
    redirect('/?error=unauthorized')
  }

  const reports = await getReports(64)
  const criticalCount = reports.filter((r) => r.severity === 'critical').length
  const pendingCount = reports.filter((r) => r.status === 'pending_review').length

  return (
    <main style={{ margin: '0 auto', maxWidth: '1200px', padding: '40px 24px 80px' }}>
      {/* Hero */}
      <div style={{ marginBottom: '40px' }}>
        <p className="lb-eyebrow">Semua Laporan · LautBersih</p>
        <h1
          style={{
            color: 'var(--lb-primary)',
            fontSize: 'clamp(1.8rem,3vw,2.6rem)',
            margin: '8px 0 12px',
          }}
        >
          Daftar Laporan Pencemaran
        </h1>
        <p
          style={{
            color: 'var(--lb-text-soft)',
            fontSize: '1rem',
            lineHeight: 1.7,
            maxWidth: '560px',
          }}
        >
          Seluruh laporan pencemaran pesisir yang dikirimkan oleh komunitas. Klik laporan untuk
          melihat detail analisis AI, lokasi, dan status penanganan.
        </p>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '20px',
          }}
        >
          <span
            style={{
              background: 'rgba(226,75,74,0.08)',
              border: '1px solid rgba(226,75,74,0.2)',
              borderRadius: '999px',
              color: '#e24b4a',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '6px 14px',
            }}
          >
            🚨 {criticalCount} Kritis
          </span>
          <span
            style={{
              background: 'rgba(239,159,39,0.08)',
              border: '1px solid rgba(239,159,39,0.2)',
              borderRadius: '999px',
              color: '#ef9f27',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '6px 14px',
            }}
          >
            ⏳ {pendingCount} Menunggu Review
          </span>
          <span style={{ color: 'var(--lb-text-soft)', fontSize: '0.82rem' }}>
            {reports.length} laporan ditemukan
          </span>
        </div>
      </div>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          }}
        >
          {reports.map((report) => (
            <Link
              href={`/laporan/${report.slug}`}
              key={report.id}
              style={{ textDecoration: 'none' }}
            >
              <article className="lb-report-list-card">
                {/* Badges */}
                <div
                  style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                >
                  <SeverityBadge severity={report.severity} />
                  <StatusBadge status={report.status} />
                  {report.category && (
                    <span
                      style={{
                        background: `${report.category.color}18`,
                        border: `1px solid ${report.category.color}30`,
                        borderRadius: '999px',
                        color: report.category.color,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                      }}
                    >
                      {report.category.title}
                    </span>
                  )}
                </div>

                {/* Title + Description */}
                <div>
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>
                </div>

                {/* Footer */}
                <div className="lb-report-list-card__footer">
                  <span>📍 {report.locationLabel}</span>
                  <span>
                    {new Date(report.submittedAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            border: '1px solid rgba(11,37,64,0.08)',
            borderRadius: '20px',
            color: 'var(--lb-text-soft)',
            fontSize: '1rem',
            padding: '60px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🌊</p>
          <p>Belum ada laporan yang masuk.</p>
          <Link
            className="lb-button"
            href="/lapor"
            style={{ display: 'inline-flex', marginTop: '20px' }}
          >
            Buat Laporan Pertama
          </Link>
        </div>
      )}
    </main>
  )
}
