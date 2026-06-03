'use client'

import type { ReactNode } from 'react'

import { useAcetSidebar } from '@/components/ui/aceternity-sidebar'
import { usePreloaderDone } from '@/hooks/use-preloader-done'

export function WorkspaceWrapper({ children }: { children: ReactNode }) {
  const { open } = useAcetSidebar()
  const preloaderDone = usePreloaderDone()

  return (
    <div
      className={`lb-workspace ml-0 transition-all duration-300 ease-in-out ${
        open ? 'md:ml-64' : 'md:ml-20'
      }`}
      // Sembunyikan konten utama (opacity 0) sampai preloader selesai,
      // setelah itu fade in secara halus.
      // Tidak menggunakan display:none agar layout tidak bergeser tiba-tiba.
      style={{
        opacity: preloaderDone ? 1 : 0,
        transition: 'opacity 0.4s ease, margin-left 0.3s ease',
      }}
    >
      {children}
    </div>
  )
}
