'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,200&display=swap"
        rel="stylesheet"
      />
      <main className="flex-grow flex items-center justify-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-32">
        <div className="flex flex-col items-center text-center max-w-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-[4px] bg-error rounded-full opacity-80" />

          <div className="mb-8 relative flex items-center justify-center w-32 h-32 rounded-full bg-surface-variant/50 border border-primary-container/10">
            <span
              className="material-symbols-outlined text-[80px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              tsunami
            </span>
            <span
              className="material-symbols-outlined absolute -bottom-2 -right-2 text-[40px] text-error bg-background rounded-full p-1 shadow-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
          </div>

          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary mb-6">
            500 — Gangguan Sistem Internal
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-lg mx-auto">
            Terjadi badai pada server kami. Koordinat data sedang tidak dapat diakses.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded font-label-md text-label-md hover:bg-primary-container transition-colors focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background group"
            >
              <span
                className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                refresh
              </span>
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded font-label-md text-label-md hover:bg-primary-container transition-colors focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background group"
            >
              <span
                className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                arrow_back
              </span>
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
