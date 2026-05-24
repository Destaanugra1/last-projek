'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useTransition } from 'react'

import { analyzePhotoComplete, analyzeWithGemini } from '@/app/(frontend)/lapor/analyze'

const LeafletMapPicker = dynamic(
  () => import('./LeafletMapPicker').then((m) => ({ default: m.LeafletMapPicker })),
  { ssr: false },
)

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

const compressImageToBase64 = (file: File, maxDim: number, quality: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const ratio = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.round(img.width * ratio)
        const h = Math.round(img.height * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas tidak didukung.'))
        ctx.drawImage(img, 0, 0, w, h)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl.split(',')[1] ?? '')
      }
      img.onerror = () => reject(new Error('Foto tidak dapat dibaca.'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Gagal membaca foto.'))
    reader.readAsDataURL(file)
  })

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
  const STORAGE_KEY = 'lb_report_draft'

  const [selectedCategory, setSelectedCategory] = useState<FormCategory | null>(null)
  const [title, setTitle] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [genDescError, setGenDescError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isAiPending, startAiTransition] = useTransition()
  const [isGenPending, startGenTransition] = useTransition()

  // Restore draft from sessionStorage on first mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as {
        title?: string
        coordinates?: string
        description?: string
        selectedCategory?: FormCategory | null
      }
      if (draft.title) setTitle(draft.title)
      if (draft.coordinates) setCoordinates(draft.coordinates)
      if (draft.description) setDescription(draft.description)
      if (draft.selectedCategory) setSelectedCategory(draft.selectedCategory)
    } catch {
      // ignore malformed storage
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Save draft to sessionStorage whenever form values change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ title, coordinates, description, selectedCategory }),
      )
    } catch {
      // ignore storage errors (e.g. private mode full)
    }
  }, [title, coordinates, description, selectedCategory])

  const [analysisState, setAnalysisState] = useState<{
    categoryLabel: string
    confidence: string
    error: string | null
    items: string[]
    phase: 'idle' | 'loading' | 'ready' | 'error'
    severity: string
    severityTone: 'critical' | 'moderate' | 'safe'
    summary: string | null
  }>({
    categoryLabel: '-',
    confidence: '0%',
    error: null,
    items: [],
    phase: 'idle',
    severity: 'MENGANALISIS...',
    severityTone: 'safe',
    summary: null,
  })

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const startAnalysis = (categoryLabel: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    setAnalysisState((prev) => ({
      ...prev,
      categoryLabel,
      confidence: '0%',
      error: null,
      items: [],
      phase: 'loading',
      severity: 'MENGANALISIS...',
      severityTone: 'safe',
      summary: null,
    }))

    startAiTransition(async () => {
      try {
        const result = await analyzeWithGemini({
          title,
          category: categoryLabel,
          description,
          coordinates,
        })
        setAnalysisState({
          categoryLabel: result.categoryLabel,
          confidence: result.confidence,
          error: null,
          items: result.recommendations,
          phase: 'ready',
          severity: result.severity,
          severityTone: result.severityTone,
          summary: result.summary,
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal terhubung ke AI.'
        setAnalysisState((prev) => ({
          ...prev,
          error: msg,
          phase: 'error',
        }))
      }
    })
  }

  const onCategoryClick = (category: FormCategory) => {
    setSelectedCategory(category)
    startAnalysis(category.title)
  }

  const onDescriptionChange = (value: string) => {
    setDescription(value)
  }

  const onPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setPhotos(files)
  }

  const onGenerateDescription = () => {
    const file = photos[0]
    if (!file) return
    setGenDescError(null)

    startGenTransition(async () => {
      try {
        // Downscale & re-encode to JPEG (max 1024px) to shrink payload ~10x
        const base64 = await compressImageToBase64(file, 1024, 0.82)

        // Set sidebar to loading immediately
        setAnalysisState((prev) => ({
          ...prev,
          confidence: '0%',
          error: null,
          items: [],
          phase: 'loading',
          severity: 'MENGANALISIS...',
          severityTone: 'safe',
          summary: null,
        }))

        // Single combined Gemini Vision call (description + analysis in one shot)
        const result = await analyzePhotoComplete({
          photoBase64: base64,
          mimeType: 'image/jpeg',
          title,
          coordinates,
        })

        setDescription(result.description)

        // Auto-match AI category to one of the available chips
        const aiCatNorm = result.categoryLabel.toLowerCase()
        const matchedChip = chips.find((c) => {
          const t = c.title.toLowerCase()
          if (aiCatNorm.includes('plastik') || aiCatNorm.includes('sampah') || aiCatNorm.includes('debris') || aiCatNorm.includes('waste'))
            return t.includes('plastik') || t.includes('sampah') || t.includes('debris') || t.includes('waste')
          if (aiCatNorm.includes('minyak') || aiCatNorm.includes('oil'))
            return t.includes('minyak') || t.includes('oil')
          if (aiCatNorm.includes('industri') || aiCatNorm.includes('limbah'))
            return t.includes('industri') || t.includes('limbah')
          if (aiCatNorm.includes('ekosistem') || aiCatNorm.includes('karang') || aiCatNorm.includes('ecosystem'))
            return t.includes('ekosistem') || t.includes('karang') || t.includes('ecosystem')
          if (aiCatNorm.includes('ilegal') || aiCatNorm.includes('illegal'))
            return t.includes('ilegal') || t.includes('illegal')
          return false
        })
        if (matchedChip) setSelectedCategory(matchedChip)

        setAnalysisState({
          categoryLabel: result.categoryLabel,
          confidence: result.confidence,
          error: null,
          items: result.recommendations,
          phase: 'ready',
          severity: result.severity,
          severityTone: result.severityTone,
          summary: result.summary,
        })
      } catch (err) {
        setGenDescError(err instanceof Error ? err.message : 'Gagal analisis foto.')
        setAnalysisState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Gagal analisis foto.',
          phase: 'error',
        }))
      }
    })
  }

  const onManualScan = () => {
    const label = selectedCategory?.title ?? (description.length > 0 ? 'Insiden Maritim' : '')
    if (!label && !title && !description) return
    startAnalysis(label || title || 'Insiden Maritim')
  }

  const parsedCoordinates = parseCoordinates(coordinates)

  const pickerCoords = (() => {
    const parts = coordinates.split(',').map((s) => Number(s.trim()))
    if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      return { latitude: parts[0], longitude: parts[1] }
    }
    return null
  })()

  const locationLabel = coordinates ? `Koordinat ${coordinates}` : title || 'Titik Laporan LautBersih'
  const confidenceWidth = analysisState.phase === 'ready' ? analysisState.confidence : '0%'

  return (
    <div className="lb-reporting-page">
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
            <form
              action={async (fd) => {
                setSubmitError(null)

                // Validation: koordinat wajib diatur (bukan default)
                if (!coordinates.trim()) {
                  setSubmitError(
                    'Lokasi pada peta belum diatur. Silakan klik peta untuk memilih titik lokasi atau isi koordinat secara manual.',
                  )
                  return
                }
                const parts = coordinates.split(',').map((s) => Number(s.trim()))
                if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
                  setSubmitError('Format koordinat tidak valid. Contoh: -6.1751, 106.8272')
                  return
                }

                sessionStorage.removeItem(STORAGE_KEY)
                await submitAction(fd)
              }}
              className="lb-reporting-form"
            >
              <input name="category" type="hidden" value={selectedCategory?.id || ''} />
              <input name="latitude" type="hidden" value={String(parsedCoordinates.latitude)} />
              <input name="longitude" type="hidden" value={String(parsedCoordinates.longitude)} />
              <input name="locationLabel" type="hidden" value={locationLabel} />
              <input name="reporterName" type="hidden" value="Pelapor LautBersih" />
              <input name="reporterEmail" type="hidden" value="" />
              {/* AI analysis result — sent to server only when ready */}
              <input name="aiSeverityTone" type="hidden" value={analysisState.phase === 'ready' ? analysisState.severityTone : ''} />
              <input name="aiSeverityLabel" type="hidden" value={analysisState.phase === 'ready' ? analysisState.severity : ''} />
              <input name="aiCategoryLabel" type="hidden" value={analysisState.phase === 'ready' ? analysisState.categoryLabel : ''} />
              <input name="aiConfidence" type="hidden" value={analysisState.phase === 'ready' ? analysisState.confidence : ''} />
              <input name="aiSummary" type="hidden" value={analysisState.phase === 'ready' ? (analysisState.summary ?? '') : ''} />
              <input name="aiRecommendations" type="hidden" value={analysisState.phase === 'ready' ? JSON.stringify(analysisState.items) : ''} />

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

              <div className="lb-reporting-map-preview lb-reporting-map-preview--interactive">
                <LeafletMapPicker
                  latitude={pickerCoords?.latitude}
                  longitude={pickerCoords?.longitude}
                  onChange={(lat, lng) => setCoordinates(`${lat}, ${lng}`)}
                />
                <div className="lb-reporting-map-preview__hint">
                  <i />
                  Klik peta untuk pilih koordinat
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
                  onChange={onPhotosChange}
                  type="file"
                />
                <button
                  className={`lb-reporting-gen-btn${isGenPending ? ' is-loading' : ''}`}
                  disabled={photos.length === 0 || isGenPending}
                  onClick={onGenerateDescription}
                  type="button"
                >
                  {isGenPending ? (
                    <><span className="lb-reporting-gen-btn__spinner" /> Menganalisis foto...</>
                  ) : (
                    <>✦ Generate Deskripsi dari Foto</>
                  )}
                </button>
                {genDescError && (
                  <p className="lb-reporting-gen-btn__error">{genDescError}</p>
                )}
              </div>

              {submitError && (
                <div className="lb-reporting-submit-error" role="alert">
                  <span className="lb-reporting-submit-error__icon">⚠</span>
                  <span>{submitError}</span>
                </div>
              )}

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

              {analysisState.phase === 'idle' && (
                <div className="lb-reporting-ai-card__status">
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
                    Pilih kategori atau klik Scan AI untuk memulai pemindaian...
                  </p>
                  <button
                    className="lb-reporting-ai-scan-btn"
                    disabled={isAiPending || (!title && !description)}
                    onClick={onManualScan}
                    type="button"
                  >
                    <span>⚡</span> Scan AI Sekarang
                  </button>
                </div>
              )}

              {(analysisState.phase === 'loading' || isAiPending) && (
                <div className="lb-reporting-ai-card__status">
                  <div className="lb-reporting-spinner" />
                  <div className="lb-reporting-spinner-copy">
                    <p>Scanning Intelligence...</p>
                    <small>Menganalisis dengan Gemini AI...</small>
                  </div>
                </div>
              )}

              {analysisState.phase === 'error' && (
                <div className="lb-reporting-ai-card__status">
                  <p className="lb-reporting-ai-card__error">{analysisState.error}</p>
                  <button
                    className="lb-reporting-ai-scan-btn"
                    onClick={onManualScan}
                    type="button"
                  >
                    <span>↺</span> Coba Lagi
                  </button>
                </div>
              )}

              {analysisState.phase === 'ready' && !isAiPending && (
                <div className="lb-reporting-ai-card__results">
                  {analysisState.summary && (
                    <div className="lb-reporting-ai-card__summary">
                      <p>{analysisState.summary}</p>
                    </div>
                  )}

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

                  <button
                    className="lb-reporting-ai-scan-btn lb-reporting-ai-scan-btn--rescan"
                    disabled={isAiPending}
                    onClick={onManualScan}
                    type="button"
                  >
                    <span>↺</span> Re-scan
                  </button>
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

    </div>
  )
}
