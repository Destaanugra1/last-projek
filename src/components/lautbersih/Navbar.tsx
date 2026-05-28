import { getCurrentUser } from '@/lib/auth'

import { NavbarClient } from './NavbarClient'

export const Navbar = async () => {
  const user = await getCurrentUser()
  const initials = user
    ? ((user.fullName ?? user.email ?? 'U') as string).slice(0, 2).toUpperCase()
    : null
  const avatarUrl = (user as { avatarUrl?: string | null } | null)?.avatarUrl ?? null

  return <NavbarClient avatarUrl={avatarUrl} initials={initials} user={user} />
}
