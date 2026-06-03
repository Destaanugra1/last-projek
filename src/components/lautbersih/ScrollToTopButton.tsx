'use client'

import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const SHOW_AFTER_SCROLL = 320

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      type="button"
      aria-label="Kembali ke atas"
      className={`lb-scroll-top${isVisible ? ' is-visible' : ''}`}
      onClick={handleClick}
    >
      <ChevronUp aria-hidden="true" size={22} />
    </button>
  )
}
