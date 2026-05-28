'use server'

import { getPayloadClient } from '@/lib/getPayloadClient'
import { uploadToCloudinary } from '@/lib/cloudinary'

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

    const parsedUserId = Number(userId)
    if (Number.isNaN(parsedUserId)) {
      return { error: 'ID Pengguna tidak valid.' }
    }

    // 1. Upload CV file to Cloudinary
    const buffer = Buffer.from(await fotoCvFile.arrayBuffer())
    const { url: cloudinaryUrl, publicId: cloudinaryPublicId } = await uploadToCloudinary(buffer, {
      folder: 'lautbersih/cv',
    })

    // 2. Create Media record in Payload
    const uploadedMedia = await payload.create({
      collection: 'media',
      data: {
        alt: `Foto CV ${namaLengkap}`,
        cloudinaryUrl,
        cloudinaryPublicId,
      },
      file: {
        data: buffer,
        mimetype: fotoCvFile.type,
        name: fotoCvFile.name,
        size: fotoCvFile.size,
      },
      overrideAccess: true,
    })

    // 3. Create Reporter Application
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
