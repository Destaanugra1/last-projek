import Image from 'next/image'
import Link from 'next/link'

import { AppShell } from '@/components/lautbersih/AppShell'
import { LogoutButton } from '@/components/lautbersih/LogoutButton'
import { ProfileEditModal } from '@/components/lautbersih/ProfileEditModal'
import { getCurrentUser } from '@/lib/auth'
import { buildDashboardStats, getReports } from '@/lib/reports'

export const dynamic = 'force-dynamic'

type ProfileUser = {
  id: number | string
  fullName?: string | null
  email: string
  role?: 'admin' | 'reporter' | null
  verifiedVolunteer?: boolean | null
  points?: number | null
  phone?: string | null
  organization?: string | null
  avatarUrl?: string | null
  avatarPublicId?: string | null
}

export default async function ProfilPage() {
  const user = (await getCurrentUser()) as ProfileUser | null
  const reports = await getReports(64)
  const stats = buildDashboardStats(reports)

  const myReports = reports.slice(0, 5)
  const myReportCount = reports.length
  const myValidatedCount = stats.validatedCount
  const myResolvedCount = stats.resolvedCount
  const myCriticalCount = stats.criticalCount
  const topCategories = stats.byCategory.slice(0, 3)

  const displayName = user?.fullName ?? user?.email ?? 'Pengguna'
  const initials = displayName.slice(0, 2).toUpperCase()
  const isProfileComplete = !!(user?.phone && user?.organization)

  return (
    <AppShell activePath="/profil">
      <section className="lb-profile-header">
        <div className="lb-profile-header__avatar-wrap">
          <div className="lb-profile-header__avatar">
            {user?.avatarUrl ? (
              <Image
                alt={displayName}
                fill
                sizes="80px"
                src={user.avatarUrl}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="lb-profile-header__status">
            {user?.role === 'admin' ? 'Administrator' : 'Reporter'}
          </div>
        </div>
        <div className="lb-profile-header__identity">
          <p className="lb-eyebrow">
            {user?.role === 'admin' ? 'System Administrator' : 'Reporter Lapangan'}
          </p>
          <h1>{displayName}</h1>
          <div className="lb-profile-header__meta-row">
            <span className="lb-profile-sdg-chip">
              <span>●</span> SDG 14 · Life Below Water
            </span>
            {user?.organization && (
              <>
                <span className="lb-profile-header__divider" />
                <span className="lb-profile-header__dept">{user.organization}</span>
              </>
            )}
          </div>
        </div>
        <div className="lb-profile-header__actions">
          <ProfileEditModal
            user={{
              email: user?.email ?? '',
              fullName: user?.fullName,
              organization: user?.organization,
              avatarUrl: user?.avatarUrl,
              phone: user?.phone,
            }}
          />
        </div>
      </section>

      {!isProfileComplete && (
        <div className="lb-profile-incomplete-notice">
          <div className="lb-profile-incomplete-notice__icon">⚠️</div>
          <div>
            <strong>Profil belum lengkap</strong>
            <p>
              Lengkapi <strong>Nomor Telepon</strong> dan <strong>Organisasi</strong> untuk bisa
              membuat laporan. Klik <em>Edit Profil</em> di atas.
            </p>
          </div>
        </div>
      )}

      <div className="lb-profile-layout">
        <div className="lb-profile-main">
          <div className="lb-panel lb-profile-info-card">
            <div className="lb-profile-section-head">
              <span className="lb-profile-section-icon">👤</span>
              <h2>Informasi Akun</h2>
            </div>
            <div className="lb-profile-info-grid">
              <div className="lb-profile-info-item">
                <label>Email Address</label>
                <p>{user?.email ?? '—'}</p>
              </div>
              <div className="lb-profile-info-item">
                <label>Nomor Telepon</label>
                {user?.phone ? (
                  <p>{user.phone}</p>
                ) : (
                  <p className="lb-profile-info-empty">Belum diisi</p>
                )}
              </div>
              <div className="lb-profile-info-item lb-profile-info-item--full">
                <label>Organisasi / Departemen</label>
                {user?.organization ? (
                  <p>{user.organization}</p>
                ) : (
                  <p className="lb-profile-info-empty">Belum diisi</p>
                )}
              </div>
              <div className="lb-profile-info-item">
                <label>Role</label>
                <span className="lb-profile-role-badge">
                  {user?.role === 'admin' ? 'Admin' : 'Reporter'}
                </span>
              </div>
              <div className="lb-profile-info-item">
                <label>Status Relawan</label>
                {user?.verifiedVolunteer ? (
                  <span className="lb-profile-verified-badge">✓ Terverifikasi</span>
                ) : (
                  <span className="lb-profile-info-empty">Belum terverifikasi</span>
                )}
              </div>
            </div>
          </div>

          <div className="lb-panel lb-profile-reports-card">
            <div className="lb-profile-section-head">
              <span className="lb-profile-section-icon">📋</span>
              <h2>Laporan Terbaru</h2>
              <Link className="lb-text-link lb-profile-section-head__link" href="/laporan">
                Lihat Semua →
              </Link>
            </div>
            {myReports.length > 0 ? (
              <div className="lb-profile-report-list">
                {myReports.map((report) => (
                  <Link
                    className="lb-profile-report-row"
                    href={`/laporan/${report.slug}`}
                    key={report.id}
                  >
                    <div
                      className={`lb-profile-report-row__rail lb-profile-report-row__rail--${report.severity}`}
                    />
                    <div className="lb-profile-report-row__body">
                      <div className="lb-profile-report-row__top">
                        <strong>{report.title}</strong>
                        <span
                          className={`lb-profile-report-status lb-profile-report-status--${report.status}`}
                        >
                          {report.status === 'pending_review' && 'Menunggu Review'}
                          {report.status === 'validated' && 'Tervalidasi'}
                          {report.status === 'in_progress' && 'Dalam Penanganan'}
                          {report.status === 'resolved' && 'Selesai'}
                          {report.status === 'rejected' && 'Ditolak'}
                        </span>
                      </div>
                      <p>{report.locationLabel}</p>
                    </div>
                    <small className="lb-profile-report-row__date">
                      {new Date(report.submittedAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </small>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="lb-profile-empty">Belum ada laporan yang dikirimkan.</p>
            )}
          </div>
        </div>

        <div className="lb-profile-sidebar">
          <div className="lb-panel lb-profile-stats-card">
            <h3 className="lb-eyebrow">Statistik Kontribusi</h3>
            <div className="lb-profile-stats-list">
              <div className="lb-profile-stat-row">
                <div>
                  <span>Total Laporan</span>
                  <strong>{myReportCount}</strong>
                </div>
                <span className="lb-profile-stat-row__icon">📝</span>
              </div>
              <div className="lb-profile-stat-row">
                <div>
                  <span>Tervalidasi</span>
                  <strong>{myValidatedCount}</strong>
                </div>
                <span className="lb-profile-stat-row__icon">✅</span>
              </div>
              <div className="lb-profile-stat-row">
                <div>
                  <span>Diselesaikan</span>
                  <strong>{myResolvedCount}</strong>
                </div>
                <span className="lb-profile-stat-row__icon">🏁</span>
              </div>
              <div className="lb-profile-stat-row lb-profile-stat-row--alert">
                <div>
                  <span>Critical</span>
                  <strong>{myCriticalCount}</strong>
                </div>
                <span className="lb-profile-stat-row__icon">🚨</span>
              </div>
            </div>
          </div>

          <div className="lb-panel lb-profile-badge-card">
            <h3 className="lb-eyebrow">Badge Status</h3>
            <div className="lb-profile-badge-hero">
              <div className="lb-profile-badge-hero__icon">🛡</div>
              <div>
                <strong>Senior Guardian</strong>
                <small>Diberikan untuk 500+ jam pengabdian</small>
              </div>
            </div>
            <div className="lb-profile-badge-grid">
              <div className={`lb-profile-mini-badge${myReportCount >= 10 ? '' : ' is-locked'}`}>
                <span>{myReportCount >= 10 ? '📣' : '🔒'}</span>
                <p>Pelapor Aktif</p>
                <small>10+ Laporan</small>
              </div>
              <div className={`lb-profile-mini-badge${user?.verifiedVolunteer ? '' : ' is-locked'}`}>
                <span>{user?.verifiedVolunteer ? '♥' : '🔒'}</span>
                <p>Relawan Pesisir</p>
                <small>Hadir 3 Agenda</small>
              </div>
              <div className="lb-profile-mini-badge is-locked">
                <span>🔒</span>
                <p>Mata Elang</p>
                <small>50+ Verifikasi</small>
              </div>
              <div className="lb-profile-mini-badge is-locked">
                <span>🔒</span>
                <p>Penjaga Karang</p>
                <small>Khusus Wilayah</small>
              </div>
            </div>
          </div>

          <div className="lb-panel lb-profile-category-card">
            <h3 className="lb-eyebrow">Kategori Dominan</h3>
            <div className="lb-profile-category-list">
              {topCategories.length > 0 ? (
                topCategories.map((cat, index) => (
                  <div className="lb-profile-category-row" key={cat.label}>
                    <div className="lb-profile-category-row__label">
                      <span className="lb-profile-category-row__rank">{index + 1}</span>
                      <span>{cat.label}</span>
                    </div>
                    <strong>{cat.total}</strong>
                  </div>
                ))
              ) : (
                <p className="lb-profile-empty">Belum ada data kategori.</p>
              )}
            </div>
          </div>

          <div className="lb-panel lb-profile-security-card">
            <h3 className="lb-eyebrow">Pengaturan Keamanan</h3>
            <div className="lb-profile-security-list">
              <div className="lb-profile-security-divider" />
              <div className="lb-profile-security-row lb-profile-security-row--danger">
                <span className="lb-profile-security-row__icon">↩</span>
                <LogoutButton variant="security" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
