import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FaLock } from "react-icons/fa";
import { AppShell } from '@/components/lautbersih/AppShell'
import { ReportFormExperience } from '@/components/lautbersih/ReportFormExperience'
import { getCurrentUser } from '@/lib/auth'
import { getWasteCategories } from '@/lib/reports'

import { submitReport } from './actions'

export const dynamic = 'force-dynamic'

type LaporUser = { phone?: string | null; organization?: string | null; role?: string }

export default async function ReportFormPage() {
  const user = (await getCurrentUser()) as LaporUser | null

  if (!user) {
    redirect('/api/auth/logout')
  }

  if (user.role === 'user') {
    redirect('/?error=unauthorized')
  }

  const isProfileComplete = !!(user?.phone && user?.organization)

  if (!isProfileComplete) {
    return (
      <AppShell activePath="/lapor">
        <section className="lb-page-hero lb-page-hero--compact">
          <p className="lb-eyebrow">New Incident Report</p>
          <h1>Form pelaporan maritim terpadu</h1>
        </section>
        <div className="lb-lapor-gate">
          <div className="lb-lapor-gate__icon"><FaLock /></div>
          <h2>Profil Belum Lengkap</h2>
          <p>
            Untuk dapat membuat laporan, Anda perlu melengkapi informasi akun terlebih dahulu.
            Pastikan <strong>Nomor Telepon</strong> dan <strong>Organisasi / Departemen</strong>{' '}
            sudah terisi di halaman profil.
          </p>
          <div className="lb-lapor-gate__checklist">
            <div className={`lb-lapor-gate__check${user?.phone ? ' is-done' : ''}`}>
              <span>{user?.phone ? '✓' : '○'}</span>
              <span>Nomor Telepon</span>
            </div>
            <div className={`lb-lapor-gate__check${user?.organization ? ' is-done' : ''}`}>
              <span>{user?.organization ? '✓' : '○'}</span>
              <span>Organisasi / Departemen</span>
            </div>
          </div>
          <Link className="lb-profile-btn lb-profile-btn--primary" href="/profil">
            Lengkapi Profil Sekarang →
          </Link>
        </div>
      </AppShell>
    )
  }

  const categories = await getWasteCategories()
  return <ReportFormExperience categories={categories} submitAction={submitReport} />
}
