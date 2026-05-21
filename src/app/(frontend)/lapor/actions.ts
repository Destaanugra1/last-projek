'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/getPayloadClient'

const toNumber = (value: FormDataEntryValue | null, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

export const submitReport = async (formData: FormData) => {
  const payload = await getPayloadClient()

  const title = String(formData.get('title') || '').trim()
  const reporterName = String(formData.get('reporterName') || '').trim()
  const reporterEmail = String(formData.get('reporterEmail') || '').trim()
  const locationLabel = String(formData.get('locationLabel') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const category = Number(formData.get('category'))
  const estimatedVolume = String(formData.get('estimatedVolume') || '').trim()
  const latitude = toNumber(formData.get('latitude'), -6.2088)
  const longitude = toNumber(formData.get('longitude'), 106.8456)
  const normalizedVolume =
    estimatedVolume === 'small' ||
    estimatedVolume === 'medium' ||
    estimatedVolume === 'large' ||
    estimatedVolume === 'very_large'
      ? estimatedVolume
      : undefined

  if (!reporterName || !locationLabel || !description) {
    throw new Error('Nama pelapor, lokasi, dan deskripsi wajib diisi.')
  }

  const uploadedMediaIds: number[] = []
  const files = formData
    .getAll('photos')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  for (const [index, file] of files.entries()) {
    const uploaded = await payload.create({
      collection: 'media',
      data: {
        alt: `${locationLabel} - foto ${index + 1}`,
      },
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    })

    uploadedMediaIds.push(Number(uploaded.id))
  }

  const reportData = {
    aiAnalysis: {
      recommendations: [
        { item: 'Verifikasi cepat oleh admin lapangan.' },
        { item: 'Prioritaskan pemisahan sampah plastik dan B3 bila ditemukan.' },
        { item: 'Jadwalkan tindak lanjut kebersihan dalam 24 jam.' },
      ],
      summary:
        'Analisis awal dibuat otomatis saat laporan dikirim. Admin dapat memperbarui hasil ini setelah verifikasi.',
    },
    category: Number.isFinite(category) && category > 0 ? category : undefined,
    description,
    estimatedVolume: normalizedVolume,
    latitude,
    locationLabel,
    longitude,
    photos: uploadedMediaIds,
    reporterEmail: reporterEmail || undefined,
    reporterName,
    severity: 'medium',
    status: 'pending_review',
    title: title || `Laporan ${locationLabel}`,
  }

  const created = (await payload.create({
    collection: 'reports',
    data: reportData as any,
    overrideAccess: true,
  } as any)) as { slug?: string }

  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath('/lapor')
  if (created.slug) {
    revalidatePath(`/laporan/${created.slug}`)
    redirect(`/laporan/${created.slug}`)
  }

  redirect('/lapor')
}
