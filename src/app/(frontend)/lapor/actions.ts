'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { uploadToCloudinary } from '@/lib/cloudinary'
import { generateBlogPostFromReport, generateBlogSlug } from '@/lib/generateBlogPost'
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

  // AI vision analysis result (from frontend Generate Deskripsi)
  const aiSeverityTone = String(formData.get('aiSeverityTone') || '').trim()
  const aiSeverityLabel = String(formData.get('aiSeverityLabel') || '').trim()
  const aiCategoryLabel = String(formData.get('aiCategoryLabel') || '').trim()
  const aiConfidence = String(formData.get('aiConfidence') || '').trim()
  const aiSummary = String(formData.get('aiSummary') || '').trim()
  const aiRecommendationsRaw = String(formData.get('aiRecommendations') || '').trim()

  // Map AI tone (safe|moderate|critical) → schema severity (low|medium|critical)
  const toneToSeverity: Record<string, 'low' | 'medium' | 'critical'> = {
    safe: 'low',
    moderate: 'medium',
    critical: 'critical',
  }
  const aiSeverity = toneToSeverity[aiSeverityTone] ?? null

  let aiRecommendationsList: string[] = []
  try {
    if (aiRecommendationsRaw) {
      const parsed = JSON.parse(aiRecommendationsRaw)
      if (Array.isArray(parsed)) aiRecommendationsList = parsed.filter((x) => typeof x === 'string')
    }
  } catch {
    /* ignore malformed AI recommendations */
  }
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
    const buffer = Buffer.from(await file.arrayBuffer())

    const { url: cloudinaryUrl, publicId: cloudinaryPublicId } = await uploadToCloudinary(buffer, {
      folder: 'lautbersih/reports',
    })

    const uploaded = await payload.create({
      collection: 'media',
      data: {
        alt: `${locationLabel} - foto ${index + 1}`,
        cloudinaryUrl,
        cloudinaryPublicId,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    })

    uploadedMediaIds.push(Number(uploaded.id))
  }

  const aiAnalysis = aiSeverity
    ? {
        recommendations: (aiRecommendationsList.length > 0
          ? aiRecommendationsList
          : [
              'Verifikasi cepat oleh admin lapangan.',
              'Pantau perkembangan kondisi secara berkala.',
            ]
        ).map((item) => ({ item })),
        summary:
          aiSummary ||
          `Analisis AI Vision: ${aiCategoryLabel || 'kondisi pesisir'} (${aiSeverityLabel || 'level tidak ditentukan'}, ${aiConfidence || 'n/a'}).`,
      }
    : {
        recommendations: [
          { item: 'Verifikasi cepat oleh admin lapangan.' },
          { item: 'Prioritaskan pemisahan sampah plastik dan B3 bila ditemukan.' },
          { item: 'Jadwalkan tindak lanjut kebersihan dalam 24 jam.' },
        ],
        summary:
          'Analisis awal dibuat otomatis saat laporan dikirim. Admin dapat memperbarui hasil ini setelah verifikasi.',
      }

  const reportData = {
    aiAnalysis,
    category: Number.isFinite(category) && category > 0 ? category : undefined,
    description,
    estimatedVolume: normalizedVolume,
    latitude,
    locationLabel,
    longitude,
    photos: uploadedMediaIds,
    reporterEmail: reporterEmail || undefined,
    reporterName,
    severity: aiSeverity ?? 'medium',
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
  revalidatePath('/berita')

  /* ── Auto-generate blog post from this report ── */
  try {
    const categoryName = await (async () => {
      if (!reportData.category) return 'Umum'
      const catDoc = await payload.findByID({
        collection: 'waste-categories',
        id: reportData.category,
        overrideAccess: true,
      })
      return (catDoc as { title?: string }).title ?? 'Umum'
    })()

    const severityLabel: Record<string, string> = {
      low: 'Aman / Waspada',
      medium: 'Moderat',
      critical: 'Kritis',
    }

    const generated = await generateBlogPostFromReport({
      title: reportData.title as string,
      description: reportData.description,
      locationLabel: reportData.locationLabel,
      category: categoryName,
      severity: severityLabel[reportData.severity as string] ?? 'Moderat',
      recommendations: reportData.aiAnalysis.recommendations.map((r) => r.item),
      summary: reportData.aiAnalysis.summary,
    })

    const blogSlug = generateBlogSlug(generated.title)
    const coverMediaId = uploadedMediaIds[0]

    await payload.create({
      collection: 'blog-posts',
      data: {
        title: generated.title,
        slug: blogSlug,
        excerpt: generated.excerpt,
        content: generated.content as any,
        coverImage: coverMediaId ?? undefined,
        category: reportData.category ?? undefined,
        sourceReport: (created as { id?: number | string }).id as any,
        locationLabel: reportData.locationLabel,
        severity: (reportData.severity as string) ?? 'medium',
        publishedAt: new Date().toISOString(),
        isAiGenerated: true,
      } as any,
      overrideAccess: true,
    })

    revalidatePath('/berita')
  } catch (_err) {
    /* Blog generation is non-blocking — report is already saved */
    console.error('[blog-gen] Gagal generate artikel:', _err)
  }

  if (created.slug) {
    revalidatePath(`/laporan/${created.slug}`)
    redirect(`/laporan/${created.slug}`)
  }

  redirect('/lapor')
}
