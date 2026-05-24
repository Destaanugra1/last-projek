'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/getPayloadClient'

export type AuthState = { error: string | null }

const AUTH_COOKIE = 'payload-token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export const loginAction = async (_prev: AuthState, formData: FormData): Promise<AuthState> => {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
    await setAuthCookie(result.token)
  } catch {
    return { error: 'Email atau kata sandi salah. Silakan coba lagi.' }
  }

  redirect('/profil')
}

export const registerAction = async (_prev: AuthState, formData: FormData): Promise<AuthState> => {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('fullName') ?? '').trim()
  const role = String(formData.get('role') ?? 'reporter')

  if (!email || !password || !fullName) {
    return { error: 'Nama lengkap, email, dan kata sandi wajib diisi.' }
  }

  if (password.length < 8) {
    return { error: 'Kata sandi minimal 8 karakter.' }
  }

  const safeRole = role === 'reporter' ? 'reporter' : 'reporter'

  try {
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'users',
      data: { email, fullName, password, role: safeRole },
    })

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    await setAuthCookie(result.token)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : ''
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
      return { error: 'Email sudah terdaftar. Gunakan email lain atau masuk.' }
    }
    return { error: 'Pendaftaran gagal. Silakan coba lagi.' }
  }

  redirect('/profil')
}

export const logoutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  redirect('/login')
}
