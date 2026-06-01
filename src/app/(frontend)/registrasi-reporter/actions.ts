'use server'

import { getPayloadClient } from '@/lib/getPayloadClient'

export async function submitReporterApplication(formData: FormData, userId: string | number) {
  try {
    const payload = await getPayloadClient()

    const namaLengkap = String(formData.get('nama_lengkap') || '').trim()
    const alamat = String(formData.get('alamat') || '').trim()
    const noHp = String(formData.get('no_hp') || '').trim()
    const fotoCvFile = formData.get('foto_cv') as File | null

    if (!namaLengkap || !alamat || !noHp || !fotoCvFile || fotoCvFile.size === 0) {
      return { error: 'Lengkapi semua data dengan benar sebelum mengirim pengajuan.' }
    }

    if (fotoCvFile.type !== 'application/pdf') {
      return { error: 'CV wajib diunggah dalam format PDF.' }
    }

    const maxSize = 3 * 1024 * 1024
    if (fotoCvFile.size > maxSize) {
      return { error: 'Ukuran file CV maksimal 3 MB.' }
    }

    const parsedUserId = Number(userId)
    if (Number.isNaN(parsedUserId)) {
      return { error: 'ID Pengguna tidak valid.' }
    }

    const buffer = Buffer.from(await fotoCvFile.arrayBuffer())

    const uploadedMedia = await payload.create({
      collection: 'media',
      data: {
        alt: `CV ${namaLengkap}`,
      },
      file: {
        data: buffer,
        mimetype: fotoCvFile.type,
        name: fotoCvFile.name,
        size: fotoCvFile.size,
      },
      overrideAccess: true,
    })

    await payload.create({
      collection: 'reporter-applications',
      data: {
        user: parsedUserId,
        nama_lengkap: namaLengkap,
        alamat: alamat,
        no_hp: noHp,
        foto_cv: uploadedMedia.id,
        status: 'pending',
      },
      overrideAccess: true,
    })

    return { success: true }
  } catch (err: unknown) {
    console.error('Reporter application submit failed:', err)
    return { error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem.' }
  }
}
