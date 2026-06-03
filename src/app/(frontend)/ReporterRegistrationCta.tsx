'use client'

import type { CSSProperties, MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Clock3, X } from 'lucide-react'

import RegistrasiReporterClient, {
  type ReporterRegistrationStep,
} from './registrasi-reporter/RegistrasiReporterClient'

type ReporterRegistrationCtaProps = {
  hasPendingApp: boolean
  steps: ReporterRegistrationStep[]
  userId: number | string
}

const PANEL_GAP = 12

export default function ReporterRegistrationCta({
  hasPendingApp,
  steps,
  userId,
}: ReporterRegistrationCtaProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const getPopupStyle = useCallback(
    (button: HTMLButtonElement | null) => {
      if (!button || typeof window === 'undefined') return {}

      const rect = button.getBoundingClientRect()
      const panelHeight = panelRef.current?.offsetHeight
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const edgePadding = viewportWidth <= 640 ? 12 : 20
      const panelWidth = Math.min(hasPendingApp ? 420 : 680, viewportWidth - edgePadding * 2)
      const estimatedPanelHeight = Math.min(
        panelHeight ?? (viewportWidth <= 640 ? 320 : 420),
        viewportHeight - edgePadding * 2,
      )
      const left = Math.min(
        Math.max(rect.left + rect.width / 2 - panelWidth / 2, edgePadding),
        viewportWidth - panelWidth - edgePadding,
      )
      const topAbove = rect.top - estimatedPanelHeight - PANEL_GAP
      const topBelow = rect.bottom + PANEL_GAP
      const maxTop = Math.max(edgePadding, viewportHeight - estimatedPanelHeight - edgePadding)
      const preferredTop = topAbove >= edgePadding ? topAbove : topBelow
      const top = Math.min(Math.max(preferredTop, edgePadding), maxTop)
      const maxHeight = Math.max(180, viewportHeight - top - edgePadding)

      return {
        '--popup-left': `${left}px`,
        '--popup-top': `${top}px`,
        '--popup-width': `${panelWidth}px`,
        '--popup-max-height': `${maxHeight}px`,
      } as CSSProperties
    },
    [hasPendingApp],
  )

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const updatePosition = () => {
      setPopupStyle(getPopupStyle(triggerRef.current))
    }

    updatePosition()
    panelRef.current?.scrollTo({ top: 0 })

    const syncViewportToPopup = () => {
      const panel = panelRef.current
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const edgePadding = window.innerWidth <= 640 ? 12 : 20

      if (rect.top < edgePadding) {
        window.scrollBy({
          top: rect.top - edgePadding,
          behavior: 'smooth',
        })
        return
      }

      if (rect.bottom > viewportHeight - edgePadding) {
        window.scrollBy({
          top: rect.bottom - viewportHeight + edgePadding,
          behavior: 'smooth',
        })
      }
    }

    const raf = requestAnimationFrame(syncViewportToPopup)

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.visualViewport?.addEventListener('resize', updatePosition)
    window.visualViewport?.addEventListener('scroll', updatePosition)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      window.visualViewport?.removeEventListener('resize', updatePosition)
      window.visualViewport?.removeEventListener('scroll', updatePosition)
    }
  }, [getPopupStyle, isOpen])

  const handleOpen = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    triggerRef.current = button
    setPopupStyle(getPopupStyle(button))
    setIsOpen(true)
  }, [getPopupStyle])

  return (
    <>
      <section className="lb-home__reporter-cta">
        <div className="lb-home__reporter-cta-inner">
          <div className="lb-home__reporter-icon" aria-hidden="true">
            <Camera size={26} />
          </div>
          <h2>Ingin Menjadi Reporter?</h2>
          <p>
            Bergabung sebagai reporter pesisir untuk mengirim laporan lapangan yang terverifikasi
            dan membantu menjaga laut tetap bersih.
          </p>
          <button
            ref={triggerRef}
            type="button"
            className="lb-home__reporter-button"
            onClick={handleOpen}
          >
            <Camera size={18} />
            Daftar Sekarang
          </button>
        </div>
      </section>

      {isOpen && (
        <div className="lb-register-modal">
          <div className="lb-register-modal__backdrop" aria-hidden="true" />
          <div
            ref={panelRef}
            className="lb-register-modal__panel"
            style={popupStyle}
            role="dialog"
            aria-modal="true"
            aria-label="Pendaftaran reporter"
          >
            {hasPendingApp ? (
              <div className="lb-register-modal__pending">
                <button
                  type="button"
                  className="lb-register-modal__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup popup pendaftaran"
                >
                  <X size={18} />
                </button>
                <div className="lb-register-modal__pending-icon" aria-hidden="true">
                  <Clock3 size={22} />
                </div>
                <h3>Pengajuan Sedang Diproses</h3>
                <p>
                  Anda sudah memiliki pengajuan pendaftaran reporter yang sedang menunggu
                  persetujuan admin. Kami akan menghubungi Anda segera.
                </p>
                <button
                  type="button"
                  className="lb-register-modal__primary"
                  onClick={() => setIsOpen(false)}
                >
                  Mengerti
                </button>
              </div>
            ) : (
              <div className="lb-register-modal__content lb-register-modal__content--form">
                <RegistrasiReporterClient
                  steps={steps}
                  userId={userId}
                  onClose={() => setIsOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
