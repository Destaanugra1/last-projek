import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/getPayloadClient'
import { RichText } from '@/components/lautbersih/RichText'
import { ShieldCheck, Calendar, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan Privasi LautBersih Otoritas Maritim Nasional. Pelajari bagaimana kami melestarikan data dan privasi Anda dalam menjaga perairan Nusantara.',
}

const fallbackContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Selamat datang di LautBersih. Kami berkomitmen untuk melindungi informasi pribadi Anda dan hak privasi Anda sesuai dengan peraturan perundang-undangan perlindungan data yang berlaku di Republik Indonesia.',
          },
        ],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '1. Informasi yang Kami Kumpulkan', format: 1 }],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Kami mengumpulkan informasi identitas diri resmi ketika Anda mendaftar sebagai kontributor atau personel di platform LautBersih. Data ini mencakup nama lengkap, alamat email dinas, kata sandi terenkripsi, serta log aktivitas teknis untuk keperluan kepatuhan hukum maritim.',
          },
        ],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '2. Tujuan Pengolahan Data', format: 1 }],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Semua data pelaporan pencemaran pesisir, validasi AI, dan informasi profil digunakan secara eksklusif untuk kepentingan pelestarian ekosistem laut (SDG 14), koordinasi penanggulangan sampah siber maritim, dan transparansi laporan masyarakat kepada Otoritas Maritim Nasional.',
          },
        ],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '3. Enkripsi dan Keamanan Siber', format: 1 }],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Platform ini dilengkapi enkripsi berlapis SSL/TLS, database PostgreSQL Neon terenkripsi, serta sistem otentikasi ketat. Kami memastikan tidak ada data pribadi yang disebarluaskan kepada pihak ketiga yang tidak berkepentingan tanpa persetujuan eksplisit Anda.',
          },
        ],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '4. Hak-Hak Pengguna', format: 1 }],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Sebagai kontributor resmi, Anda berhak melihat, memperbarui, atau mengajukan permohonan penghapusan akun Anda secara permanen dengan menghubungi saluran komunikasi resmi Otoritas Keamanan Siber Maritim.',
          },
        ],
      },
    ],
    version: 1,
  },
}

export default async function PrivacyPolicyPage() {
  let title = 'Kebijakan Privasi'
  let content: any = null
  let updatedAtString = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  try {
    const payload = await getPayloadClient()
    const privacyData = await payload.findGlobal({
      slug: 'privacy-policy',
    })

    if (privacyData) {
      if (privacyData.title) {
        title = privacyData.title
      }
      if (privacyData.content) {
        content = privacyData.content
      }
      if (privacyData.updatedAt) {
        updatedAtString = new Date(privacyData.updatedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data kebijakan privasi dari CMS:', error)
  }

  // Use fallback if CMS content is empty
  const activeContent = content || fallbackContent

  return (
    <main className="min-h-screen bg-[#f3f7fc] text-slate-800" id="privacy-policy-view">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0b2540]/10 via-[#1d9e75]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#1d9e75]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1d9e75] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Daftar
          </Link>
        </div>

        {/* Premium Title Card */}
        <header className="bg-gradient-to-br from-[#0b2540] to-[#081b2e] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-[#0b2540]/10 relative overflow-hidden mb-12">
          {/* Subtle green pattern inside */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#1d9e75]/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#83f5c6]/30 bg-[#83f5c6]/10 text-[#83f5c6] text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} className="inline mr-1" />
              Sistem Keamanan Informasi
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight font-medium mb-6">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#1d9e75]" />
                <span>Pembaruan Terakhir: {updatedAtString}</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div>Otoritas Maritim Nasional Republik Indonesia</div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Panel */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm leading-relaxed mb-8">
          <RichText content={activeContent} />
        </article>

        {/* Quick Contact & Footer Notice */}
        <div className="bg-[#0b2540]/5 border border-[#0b2540]/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-[#0b2540] mb-1">Pertanyaan Mengenai Privasi Data?</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Hubungi tim keamanan siber maritim kami melalui saluran pengaduan resmi.
            </p>
          </div>
          <Link
            href="mailto:cybersec@lautbersih.go.id"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0b2540] to-[#183b63] hover:from-[#183b63] hover:to-[#0b2540] text-white font-bold text-sm transition-all shadow-md"
          >
            Hubungi Tim Keamanan
          </Link>
        </div>

      </div>
    </main>
  )
}
