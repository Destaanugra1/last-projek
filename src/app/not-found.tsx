import Link from 'next/link'

export default function RootNotFound() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,200&display=swap"
        rel="stylesheet"
      />
      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="mb-8 relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center rounded-full bg-surface-container-low border border-outline-variant/20 shadow-sm">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-primary-container text-8xl md:text-9xl opacity-20 absolute"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
            >
              explore
            </span>
            <div className="text-primary-container font-display-lg text-display-lg font-bold tracking-tight">
              404
            </div>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary-container mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
            Sepertinya koordinat yang Anda tuju tidak tersedia di radar kami.
          </p>
          <Link
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-container text-on-primary font-label-md text-label-md rounded shadow-sm hover:bg-primary-container/90 transition-colors duration-200"
            href="/"
          >
            Kembali ke Halaman Sebelumnya
          </Link>
        </div>
      </main>
    </>
  )
}
