'use client'

import { useEffect, useState } from 'react'
import { Camera, Clock3, X } from 'lucide-react'

import RegistrasiReporterClient, {
  type ReporterRegistrationStep,
} from './registrasi-reporter/RegistrasiReporterClient'

type ReporterRegistrationCtaProps = {
  hasPendingApp: boolean
  steps: ReporterRegistrationStep[]
  userId: number | string
}

export default function ReporterRegistrationCta({
  hasPendingApp,
  steps,
  userId,
}: ReporterRegistrationCtaProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

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
            type="button"
            className="lb-home__reporter-button"
            onClick={() => setIsOpen(true)}
          >
            <Camera size={18} />
            Daftar Sekarang
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          className="lb-register-modal"
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
                Anda sudah memiliki pengajuan pendaftaran reporter yang sedang menunggu persetujuan
                admin. Kami akan menghubungi Anda segera.
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
      )}
    </>
  )
}
