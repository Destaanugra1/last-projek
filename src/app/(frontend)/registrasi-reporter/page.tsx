import { getPayloadClient } from '@/lib/getPayloadClient'
import RegistrasiReporterClient from './RegistrasiReporterClient'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function RegistrasiReporterPage() {
  const payload = await getPayloadClient()

  // 1. Fetch Stepper CMS content
  const registrationData = await payload.findGlobal({
    slug: 'reporter-registration',
  })

  // 2. Determine auth & role
  const currentUser = await getCurrentUser()

  // 3. Guards
  if (!currentUser) {
    redirect('/login?redirect=/registrasi-reporter')
  }

  if (currentUser.role === 'reporter' || currentUser.role === 'admin') {
    redirect('/profil')
  }

  // Check if they already have a pending application
  const existingApp = await payload.find({
    collection: 'reporter-applications',
    where: {
      user: {
        equals: currentUser.id,
      },
      status: {
        equals: 'pending',
      },
    },
    limit: 1,
  })

  if (existingApp.totalDocs > 0) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="bg-[#120F17] rounded-[2rem] shadow-2xl p-8 max-w-xl w-full text-center border border-[#222]">
          <h1 className="text-3xl font-bold mb-4 text-white">Pengajuan Sedang Diproses</h1>
          <p className="text-gray-400 mb-8">
            Anda sudah memiliki pengajuan pendaftaran reporter yang sedang menunggu persetujuan
            admin. Kami akan menghubungi Anda segera.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#5227FF] hover:bg-[#431ce0] text-white font-medium py-2 px-6 rounded-full transition active:scale-95"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-y-auto">
      <div className="relative w-full max-w-2xl my-12">
        <RegistrasiReporterClient steps={registrationData?.steps || []} userId={currentUser.id} />

        {/* Close button to go back */}
        <Link
          href="/"
          className="absolute -top-12 right-0 text-gray-500 hover:text-white transition flex items-center gap-2 text-sm font-medium"
          aria-label="Kembali ke Beranda"
        >
          <span>Kembali ke Beranda</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
      </div>
    </main>
  )
}
