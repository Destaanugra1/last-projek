/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params

  if (resolvedParams.segments?.[0] === 'unauthorized') {
    return (
      <main className="lb-admin-unauth">
        <section className="lb-admin-unauth__card">
          <div className="lb-admin-unauth__icon">!</div>
          <p className="lb-eyebrow">Akses Ditolak</p>
          <h1>Halaman admin hanya untuk Admin</h1>
          <p>
            Akun Anda terdaftar sebagai Reporter. Silakan masuk dengan akun Admin untuk mengelola
            data, laporan, berita, dan pengaturan situs.
          </p>
          <div className="lb-admin-unauth__actions">
            <a href="/admin" className="lb-admin-unauth__primary">
              Login Admin
            </a>
            <a href="/profil" className="lb-admin-unauth__secondary">
              Kembali ke Profil
            </a>
          </div>
        </section>
      </main>
    )
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user?.id) {
    return RootPage({ config, params, searchParams, importMap })
  }

  const freshUser = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 0,
    overrideAccess: true,
  })

  if ((freshUser as { role?: string })?.role !== 'admin') {
    redirect('/admin/unauthorized')
  }

  return RootPage({ config, params, searchParams, importMap })
}

export default Page
