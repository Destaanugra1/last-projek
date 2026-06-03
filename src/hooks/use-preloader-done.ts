'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true once the `lb:preloader-complete` CustomEvent has fired.
 * On pages that don't have a preloader (or if the event already fired
 * before this hook mounts), it defaults to `false` until the event arrives.
 *
 * The preloader fires the event via:
 *   window.dispatchEvent(new CustomEvent('lb:preloader-complete'))
 */
declare global {
  interface Window {
    __preloaderDone?: boolean
  }
}

export function usePreloaderDone(): boolean {
  const [done, setDone] = useState(() => {
    if (typeof window !== 'undefined' && window.__preloaderDone) {
      return true
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.__preloaderDone) {
      setDone(true)
      return
    }

    const handler = () => {
      window.__preloaderDone = true
      setDone(true)
    }
    window.addEventListener('lb:preloader-complete', handler)
    return () => window.removeEventListener('lb:preloader-complete', handler)
  }, [])

  return done
}
