'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary'
import { getPayloadClient } from '@/lib/getPayloadClient'

export type ProfileState = { error: string | null; success?: boolean }

const getAuthenticatedUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null

  const payload = await getPayloadClient()
  try {
    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` }),
    })
    return user ?? null
  } catch {
    return null
  }
}

export const updateProfileAction = async (
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> => {
  const user = await getAuthenticatedUser()
  if (!user) return { error: 'Sesi tidak valid. Silakan masuk kembali.' }

  const fullName = String(formData.get('fullName') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const organization = String(formData.get('organization') ?? '').trim()
  const avatarFile = formData.get('avatar')

  if (!fullName) return { error: 'Nama lengkap tidak boleh kosong.' }

  const updateData: Record<string, unknown> = { fullName, phone, organization }

  if (avatarFile instanceof File && avatarFile.size > 0) {
    try {
      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      const existingPublicId = (user as { avatarPublicId?: string }).avatarPublicId
      if (existingPublicId) {
        await deleteFromCloudinary(existingPublicId).catch(() => {})
      }
      const { url, publicId } = await uploadToCloudinary(buffer, {
        folder: 'lautbersih/avatars',
      })
      updateData.avatarUrl = url
      updateData.avatarPublicId = publicId
    } catch {
      return { error: 'Gagal mengunggah foto. Silakan coba lagi.' }
    }
  }

  const payload = await getPayloadClient()
  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData as Parameters<typeof payload.update>[0]['data'],
      overrideAccess: true,
    })
  } catch {
    return { error: 'Gagal menyimpan perubahan. Silakan coba lagi.' }
  }

  revalidatePath('/profil')
  return { error: null, success: true }
}
