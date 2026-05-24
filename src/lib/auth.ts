import { headers } from 'next/headers'

import type { User } from '@/payload-types'

import { getPayloadClient } from './getPayloadClient'

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const headersList = await headers()
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: headersList })
    return (user as User) ?? null
  } catch {
    return null
  }
}
