'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type FormCategory = {
  id: string
  title: string
}

const fallbackCategories: FormCategory[] = [
  { id: '', title: 'Oil Spill' },
  { id: '', title: 'Marine Debris/Waste' },
  { id: '', title: 'Ecosystem Damage' },
  { id: '', title: 'Illegal Activity' },
  { id: '', title: 'Lainnya' },
]

const analysisProfiles = {
  default: {
    confidence: '85.1%',
    items: [
      'Lakukan observasi berkelanjutan',
      'Dokumentasikan perubahan visual',
      'Siapkan tim investigasi darat',
    ],
    severity: 'WASPADA (LEVEL 1)',
    severityTone: 'safe',
  },
  ecosystem: {
    confidence: '85.1%',
    items: [
      'Lakukan observasi berkelanjutan',
      'Dokumentasikan perubahan visual',
      'Siapkan tim investigasi darat',
    ],
    severity: 'WASPADA (LEVEL 1)',
    severityTone: 'safe',
  },
  oil: {
    confidence: '97.2%',
    items: [
      'Kirim armada penahan (oil boom) segera',
      'Evakuasi satwa di radius 2km',
      'Aktifkan protokol pembersihan pesisir',
    ],
    severity: 'KRITIS (LEVEL 4)',
    severityTone: 'critical',
  },
  waste: {
    confidence: '92.5%',
    items: [
      'Jadwalkan kapal pengumpul sampah',
      'Monitor arah arus laut lokal',
      'Lapor ke dinas kebersihan terdekat',
    ],
    severity: 'MODERAT (LEVEL 2)',
    severityTone: 'moderate',
  },
} as const

const pickAnalysisKey = (label: string) => {
  const normalized = label.toLowerCase()

  if (normalized.includes('oil')) {
    return 'oil'
  }

  if (normalized.includes('waste') || normalized.includes('debris') || normalized.includes('sampah')) {
    return 'waste'
  }

  if (normalized.includes('ecosystem') || normalized.includes('karang')) {
    return 'ecosystem'
  }

  return 'default'
}

const parseCoordinates = (value: string) => {
  const parts = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const latitude = Number(parts[0])
  const longitude = Number(parts[1])

  return {
    latitude: Number.isFinite(latitude) ? latitude : -6.1751,
    longitude: Number.isFinite(longitude) ? longitude : 106.8272,
  }
}

export const ReportFormExperience = ({
  categories,
  submitAction,
}: {
  categories: FormCategory[]
  submitAction: (formData: FormData) => void | Promise<void>
}) => {
  const chips = categories.length > 0 ? categories.slice(0, 5) : fallbackCategories
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<FormCategory | null>(null)
  const [title, setTitle] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [description, setDescription] = useState('')
  const [analysisState, setAnalysisState] = useState<{
    categoryLabel: string
    confidence: string
    items: string[]
    phase: 'idle' | 'loading' | 'ready'
    severity: string
    severityTone: 'critical' | 'moderate' | 'safe'
  }>({
    categoryLabel: '-',
    confidence: '0%',
    items: [],
    phase: 'idle',
    severity: 'MENGANALISIS...',
    severityTone: 'safe',
  })

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const startAnalysis = (label: string) => {
    const profile = analysisProfiles[pickAnalysisKey(label)]

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setAnalysisState({
      categoryLabel: label,
      confidence: '0%',
      items: [],
      phase: 'loading',
      severity: 'MENGANALISIS...',
      severityTone: 'safe',
    })

    timerRef.current = setTimeout(() => {
      setAnalysisState({
        categoryLabel: label,
        confidence: profile.confidence,
        items: [...profile.items],
        phase: 'ready',
        severity: profile.severity,
        severityTone: profile.severityTone,
      })
    }, 1500)
  }

  const onCategoryClick = (category: FormCategory) => {
    setSelectedCategory(category)
    startAnalysis(category.title)
  }

  const onDescriptionChange = (value: string) => {
    setDescription(value)

    if (value.length >= 25 && !selectedCategory && analysisState.phase === 'idle') {
      startAnalysis('Ecosystem Damage')
    }
  }

  const parsedCoordinates = parseCoordinates(coordinates)
  const locationLabel = coordinates ? `Koordinat ${coordinates}` : title || 'Titik Laporan LautBersih'
  const confidenceWidth = analysisState.phase === 'ready' ? analysisState.confidence : '0%'

  return (
    <div className="lb-reporting-page">
      <nav className="lb-reporting-nav">
        <div className="lb-reporting-nav__inner">
          <div className="lb-reporting-nav__brand-group">
            <Link className="lb-reporting-nav__brand" href="/">
              LautBersih
            </Link>
            <div className="lb-reporting-nav__links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profil">Armada</Link>
              <Link href="/petawilayah">Peta Wilayah</Link>
              <Link href="/lapor">Dokumen</Link>
            </div>
          </div>
          <Link className="lb-reporting-nav__cta" href="/lapor">
            Buat Laporan
          </Link>
        </div>
      </nav>

      <header className="lb-reporting-hero">
        <div className="lb-reporting-hero__inner">
          <div className="lb-reporting-sdg">SDG 14 · Life Below Water</div>
          <h1>Buat Laporan Baru</h1>
          <p>
            Sistem Pelaporan Maritim Terpadu. Masukkan detail temuan untuk analisis AI real-time
            dan respon operasional cepat demi keberlangsungan ekosistem laut Indonesia.
          </p>
        </div>
      </header>

      <main className="lb-reporting-main">
        <div className="lb-reporting-grid">
          <section className="lb-reporting-form-card">
            <form action={submitAction} className="lb-reporting-form">
              <input name="category" type="hidden" value={selectedCategory?.id || ''} />
              <input name="latitude" type="hidden" value={String(parsedCoordinates.latitude)} />
              <input name="longitude" type="hidden" value={String(parsedCoordinates.longitude)} />
              <input name="locationLabel" type="hidden" value={locationLabel} />
              <input name="reporterName" type="hidden" value="Pelapor LautBersih" />
              <input name="reporterEmail" type="hidden" value="" />

              <div className="lb-reporting-field">
                <label htmlFor="report-title">Judul Laporan</label>
                <input
                  id="report-title"
                  name="title"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Tumpahan Minyak di Teluk Jakarta"
                  required
                  type="text"
                  value={title}
                />
              </div>

              <div className="lb-reporting-field">
                <label>Kategori Laporan</label>
                <div className="lb-reporting-chips">
                  {chips.map((category) => {
                    const isActive = selectedCategory?.title === category.title

                    return (
                      <button
                        className={`lb-reporting-chip${isActive ? ' is-active' : ''}`}
                        key={`${category.id}-${category.title}`}
                        onClick={() => onCategoryClick(category)}
                        type="button"
                      >
                        {category.title}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="lb-reporting-location-grid">
                <div className="lb-reporting-field">
                  <label htmlFor="report-coordinates">Koordinat Geografis</label>
                  <div className="lb-reporting-input-icon">
                    <span className="lb-reporting-symbol">◎</span>
                    <input
                      id="report-coordinates"
                      onChange={(event) => setCoordinates(event.target.value)}
                      placeholder="-6.1751, 106.8272"
                      type="text"
                      value={coordinates}
                    />
                  </div>
                </div>

                <div className="lb-reporting-field">
                  <label>Pilih dari Peta</label>
                  <button className="lb-reporting-map-button" type="button">
                    <span className="lb-reporting-symbol">◫</span>
                    Buka Peta Wilayah
                  </button>
                </div>
              </div>

              <div className="lb-reporting-map-preview">
                <img
                  alt="Map View"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1BX1GlBdP3QXOuvyBkheuthy4CPwRrx-1Nx35IkqH4jVHaxfO87MDsIroLlzNsOWAn-FfMpgIdoUp-VL-bQGzK901qQ8EGxwSq1tTk6nrClng_gMHZNjQikY-r4lAmleY9pmjSgCkz2at9EuP62BFtd2P8AHadoLmRGIEAvI5BEETs-G7lNYbUzJcJQb60bxXMTS3Ig0ANvPFjHfhsi-sTjWff60PIEBzo_28jLCeDzzKcY2AHkeHX600y92H3LtAyvtPbWQFcA"
                />
                <div className="lb-reporting-map-preview__overlay">
                  <span className="lb-reporting-map-preview__pill">
                    <i />
                    Preview Peta Aktif
                  </span>
                </div>
              </div>

              <div className="lb-reporting-field">
                <label htmlFor="report-description">Deskripsi Detail</label>
                <textarea
                  id="report-description"
                  name="description"
                  onChange={(event) => onDescriptionChange(event.target.value)}
                  placeholder="Berikan detail pengamatan, perkiraan luas area terdampak, dan kondisi cuaca saat ini..."
                  required
                  rows={5}
                  value={description}
                />
              </div>

              <div className="lb-reporting-field">
                <label htmlFor="report-photos">Foto Bukti</label>
                <input
                  accept="image/png,image/jpeg,image/webp"
                  id="report-photos"
                  multiple
                  name="photos"
                  type="file"
                />
              </div>

              <button className="lb-reporting-submit" type="submit">
                Kirim Laporan
              </button>
            </form>
          </section>

          <aside className="lb-reporting-sidebar">
            <div className="lb-reporting-ai-card">
              <div className="lb-reporting-ai-card__scanline" />
              <div className="lb-reporting-ai-card__head">
                <div className="lb-reporting-ai-card__icon">AI</div>
                <div>
                  <h2>Analisis AI</h2>
                  <span>Maritime Intelligence</span>
                </div>
              </div>

              {analysisState.phase !== 'ready' ? (
                <div className="lb-reporting-ai-card__status">
                  {analysisState.phase === 'loading' ? (
                    <>
                      <div className="lb-reporting-spinner" />
                      <div className="lb-reporting-spinner-copy">
                        <p>Scanning Intelligence...</p>
                        <small>Cross-referencing satellite data</small>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="lb-reporting-ai-skeleton">
                        <div className="lb-reporting-ai-skeleton__line" />
                        <div className="lb-reporting-ai-skeleton__grid">
                          <div />
                          <div />
                          <div />
                        </div>
                        <div className="lb-reporting-ai-skeleton__panel" />
                      </div>
                      <p className="lb-reporting-ai-card__idle">
                        Menunggu input data untuk memulai pemindaian sistem...
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="lb-reporting-ai-card__results">
                  <div className="lb-reporting-ai-card__meta-grid">
                    <div>
                      <p>Kategori</p>
                      <strong>{analysisState.categoryLabel}</strong>
                    </div>
                    <div>
                      <p>Status</p>
                      <strong>Terverifikasi AI</strong>
                    </div>
                  </div>

                  <div
                    className={`lb-reporting-ai-card__severity lb-reporting-ai-card__severity--${analysisState.severityTone}`}
                  >
                    <p>Tingkat Keparahan</p>
                    <strong>{analysisState.severity}</strong>
                  </div>

                  <div className="lb-reporting-ai-card__recommendations">
                    <p>Rekomendasi Tindakan</p>
                    <ul>
                      {analysisState.items.map((item) => (
                        <li key={item}>
                          <span className="lb-reporting-symbol">●</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lb-reporting-ai-card__confidence">
                    <div>
                      <span>Confidence Score</span>
                      <strong>{analysisState.confidence}</strong>
                    </div>
                    <div className="lb-reporting-ai-card__confidence-bar">
                      <div style={{ width: confidenceWidth }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lb-reporting-guidelines">
              <h3>
                <span className="lb-reporting-symbol">§</span>
                PANDUAN PELAPORAN
              </h3>
              <ul>
                <li>
                  <span className="lb-reporting-symbol">●</span>
                  <span>Pastikan koordinat GPS diambil secara real-time di lokasi kejadian.</span>
                </li>
                <li>
                  <span className="lb-reporting-symbol">●</span>
                  <span>Gunakan deskripsi yang objektif tanpa spekulasi berlebih.</span>
                </li>
                <li>
                  <span className="lb-reporting-symbol">!</span>
                  <span className="is-warning">
                    Penyampaian informasi palsu dapat ditindak secara hukum maritim.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <footer className="lb-reporting-footer">
        <div className="lb-reporting-footer__inner">
          <div className="lb-reporting-footer__top">
            <div className="lb-reporting-footer__brand-col">
              <span className="lb-reporting-footer__brand">LautBersih</span>
              <p>
                Otoritas Maritim LautBersih berkomitmen untuk menjaga kedaulatan dan kebersihan
                perairan Indonesia melalui teknologi monitoring terpadu.
              </p>
            </div>

            <div className="lb-reporting-footer__links-grid">
              <div>
                <p>Informasi</p>
                <Link href="/profil">Tentang Kami</Link>
                <Link href="/profil">Visi & Misi</Link>
              </div>
              <div>
                <p>Layanan</p>
                <Link href="/dashboard">Akses Armada</Link>
                <Link href="/dashboard">Open Data</Link>
              </div>
              <div>
                <p>Kontak</p>
                <Link href="/notifikasi">Pusat Bantuan</Link>
                <Link href="/notifikasi">Media Center</Link>
              </div>
            </div>
          </div>

          <div className="lb-reporting-footer__bottom">
            <p>© 2024 LautBersih Maritime Authority. All Rights Reserved.</p>
            <div>
              <Link href="/profil">Kebijakan Privasi</Link>
              <Link href="/profil">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
