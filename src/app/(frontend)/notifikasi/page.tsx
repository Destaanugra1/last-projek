import { AppShell } from '@/components/lautbersih/AppShell'
import { StatusBadge } from '@/components/lautbersih/Badges'
import { statusMeta } from '@/lib/lautbersih'
import { getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

const notificationCopy = {
  in_progress: 'Tim lapangan mulai menangani lokasi ini.',
  pending_review: 'Laporan baru menunggu review admin.',
  rejected: 'Laporan perlu diperiksa ulang karena data belum cukup.',
  resolved: 'Penanganan selesai. Silakan cek hasil akhir.',
  validated: 'Laporan berhasil diverifikasi dan siap ditindaklanjuti.',
} as const

export default async function NotificationsPage() {
  const reports = await getReports(8)

  return (
    <AppShell activePath="/notifikasi">
      <section className="lb-page-hero lb-page-hero--compact">
        <p className="lb-eyebrow">Notifikasi</p>
        <h1>Update terbaru dari laporan yang masuk.</h1>
        <p>Semua perubahan status penting ditampilkan di sini agar tindak lanjut tetap cepat.</p>
      </section>

      <section className="lb-notification-list">
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <article
              className={`lb-notification-card${index < 3 ? ' lb-notification-card--unread' : ''}`}
              key={report.id}
            >
              <div className="lb-notification-card__icon">{index < 3 ? '!' : 'i'}</div>
              <div className="lb-notification-card__body">
                <div className="lb-notification-card__head">
                  <strong>{statusMeta[report.status].label}</strong>
                  <StatusBadge status={report.status} />
                </div>
                <p>{report.title}</p>
                <small>{notificationCopy[report.status]}</small>
              </div>
            </article>
          ))
        ) : (
          <div className="lb-empty-state">
            <h2>Belum ada notifikasi</h2>
            <p>Notifikasi akan muncul otomatis setelah laporan pertama dikirim.</p>
          </div>
        )}
      </section>
    </AppShell>
  )
}
