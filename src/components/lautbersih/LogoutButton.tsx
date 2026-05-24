'use client'

import { useTransition } from 'react'

import { logoutAction } from '@/app/(frontend)/auth/actions'

export const LogoutButton = ({ variant = 'topbar' }: { variant?: 'topbar' | 'security' }) => {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  if (variant === 'security') {
    return (
      <button
        className="lb-profile-security-row__logout"
        disabled={isPending}
        onClick={handleLogout}
        type="button"
      >
        {isPending ? 'Memproses...' : 'Terminate Session'}
      </button>
    )
  }

  return (
    <button
      className="lb-topbar__logout"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      {isPending ? '...' : 'Keluar'}
    </button>
  )
}
