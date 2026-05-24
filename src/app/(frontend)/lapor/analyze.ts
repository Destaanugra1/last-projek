'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

export type GeneratedDescription = {
  description: string
  categoryHint: string
}

export type PhotoFullAnalysis = {
  description: string
  categoryLabel: string
  confidence: string
  recommendations: string[]
  severity: string
  severityTone: 'critical' | 'moderate' | 'safe'
  summary: string
}

export const analyzePhotoComplete = async (data: {
  photoBase64: string
  mimeType: string
  title?: string
  coordinates?: string
}): Promise<PhotoFullAnalysis> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi.')

  const genAI = new GoogleGenerativeAI(apiKey)
  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash']

  const ctx = [
    data.title ? `- Judul: ${data.title}` : null,
    data.coordinates ? `- Koordinat: ${data.coordinates}` : null,
  ].filter(Boolean).join('\n')

  const prompt = `Anda adalah sistem AI LautBersih Indonesia. Analisis foto pesisir/laut ini.

PEDOMAN KLASIFIKASI (WAJIB):
- Pantai/laut BERSIH (air jernih, tidak ada sampah) → severity "WASPADA (LEVEL 1)", tone "safe"
- Sedikit sampah terserak → "MODERAT (LEVEL 2)", tone "moderate"
- Sampah banyak menumpuk → "SERIUS (LEVEL 3)", tone "critical"
- Tumpahan minyak/limbah/ikan mati → "KRITIS (LEVEL 4)", tone "critical"
${ctx ? `\nKonteks:\n${ctx}\n` : ''}
Kembalikan HANYA JSON:
{
  "description": "<2-4 kalimat Bahasa Indonesia deskripsi visual foto>",
  "categoryLabel": "<Sampah Plastik | Tumpahan Minyak | Limbah Industri | Sampah Organik | Kondisi Pantai Bersih | Kerusakan Ekosistem>",
  "confidence": "<persentase, contoh 91.3%>",
  "severity": "<WASPADA (LEVEL 1) | MODERAT (LEVEL 2) | SERIUS (LEVEL 3) | KRITIS (LEVEL 4)>",
  "severityTone": "<safe | moderate | critical>",
  "summary": "<ringkasan 1-2 kalimat>",
  "recommendations": ["<tindakan 1>", "<tindakan 2>", "<tindakan 3>"]
}`

  let lastError: unknown
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      })
      const result = await model.generateContent([
        { inlineData: { data: data.photoBase64, mimeType: data.mimeType } },
        prompt,
      ])
      const raw = result.response.text().trim()
      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? [''])[0]
      const parsed = JSON.parse(jsonStr) as PhotoFullAnalysis
      if (!parsed.description || !parsed.severity) throw new Error('Respons AI tidak lengkap.')
      return parsed
    } catch (err) {
      lastError = err
      const msg = String(err)
      const isRetryable = msg.includes('503') || msg.includes('overloaded') || msg.includes('Service Unavailable')
      if (!isRetryable) throw err
    }
  }
  throw lastError
}

export const generateDescriptionFromPhoto = async (data: {
  photoBase64: string
  mimeType: string
}): Promise<GeneratedDescription> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi.')

  const genAI = new GoogleGenerativeAI(apiKey)
  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash']

  const prompt = `Anda adalah sistem AI analisis pencemaran pesisir untuk platform LautBersih Indonesia.
Perhatikan foto ini dengan seksama dan berikan deskripsi kondisi pencemaran atau insiden lingkungan yang terlihat.

Berikan respons HANYA sebagai JSON tanpa teks tambahan:
{
  "description": "<deskripsi kondisi yang terlihat di foto, 2-4 kalimat dalam Bahasa Indonesia. Sebutkan jenis sampah/polutan yang terlihat, perkiraan luasan, dan kondisi lingkungan sekitarnya>",
  "categoryHint": "<satu kata kategori: Sampah Plastik | Tumpahan Minyak | Limbah Industri | Sampah Organik | Insiden Maritim | Kondisi Pantai>"
}`

  let lastError: unknown
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: 'application/json' } })
      const result = await model.generateContent([
        { inlineData: { data: data.photoBase64, mimeType: data.mimeType } },
        prompt,
      ])
      const raw = result.response.text().trim()
      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? [''])[0]
      const parsed = JSON.parse(jsonStr) as GeneratedDescription
      if (!parsed.description) throw new Error('Respons AI tidak lengkap.')
      return parsed
    } catch (err) {
      lastError = err
      const msg = String(err)
      const isRetryable = msg.includes('503') || msg.includes('overloaded') || msg.includes('Service Unavailable')
      if (!isRetryable) throw err
    }
  }
  throw lastError
}

export type GeminiAnalysis = {
  categoryLabel: string
  confidence: string
  recommendations: string[]
  severity: string
  severityTone: 'critical' | 'moderate' | 'safe'
  summary: string
}

export const analyzeWithGeminiVision = async (data: {
  photoBase64: string
  mimeType: string
  title?: string
  coordinates?: string
}): Promise<GeminiAnalysis> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi.')

  const genAI = new GoogleGenerativeAI(apiKey)
  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash']

  const contextLines = [
    data.title ? `- Judul: ${data.title}` : null,
    data.coordinates ? `- Koordinat GPS: ${data.coordinates}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const prompt = `Anda adalah sistem AI analisis kondisi pesisir untuk platform LautBersih Indonesia.
Perhatikan foto ini dengan SANGAT seksama. Anda WAJIB membedakan pantai/laut yang bersih dengan yang tercemar.

PEDOMAN KLASIFIKASI (WAJIB diikuti, JANGAN default ke MODERAT):
- Jika foto menunjukkan pantai/laut BERSIH (air jernih, pasir bersih, tidak ada sampah/polutan terlihat):
    categoryLabel = "Kondisi Pantai Bersih"
    severity = "WASPADA (LEVEL 1)"
    severityTone = "safe"
    confidence tinggi (>85%)
- Jika tampak SEDIKIT sampah terserak (beberapa item plastik, ranting):
    categoryLabel sesuai jenis (mis. "Sampah Plastik")
    severity = "MODERAT (LEVEL 2)"
    severityTone = "moderate"
- Jika sampah BANYAK menumpuk / mendominasi pemandangan:
    severity = "SERIUS (LEVEL 3)"
    severityTone = "critical"
- Jika ada tumpahan minyak, limbah industri, ikan mati, atau bahaya nyata:
    severity = "KRITIS (LEVEL 4)"
    severityTone = "critical"

JANGAN gunakan WASPADA untuk kondisi tercemar. JANGAN gunakan KRITIS untuk kondisi bersih.
${contextLines ? `\nKonteks tambahan:\n${contextLines}\n` : ''}
Kembalikan HANYA JSON tanpa teks tambahan:
{
  "categoryLabel": "<kategori dalam Bahasa Indonesia, mis. Sampah Plastik | Tumpahan Minyak | Limbah Industri | Sampah Organik | Kondisi Pantai Bersih | Kerusakan Ekosistem>",
  "confidence": "<persentase keyakinan, contoh: 91.3%>",
  "severity": "<WASPADA (LEVEL 1) | MODERAT (LEVEL 2) | SERIUS (LEVEL 3) | KRITIS (LEVEL 4)>",
  "severityTone": "<safe | moderate | critical>",
  "summary": "<ringkasan kondisi visual 1-2 kalimat>",
  "recommendations": ["<tindakan 1>", "<tindakan 2>", "<tindakan 3>"]
}`

  let lastError: unknown
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      })
      const result = await model.generateContent([
        { inlineData: { data: data.photoBase64, mimeType: data.mimeType } },
        prompt,
      ])
      const raw = result.response.text().trim()
      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? [''])[0]
      const parsed = JSON.parse(jsonStr) as GeminiAnalysis
      if (!parsed.severity || !Array.isArray(parsed.recommendations)) {
        throw new Error('Struktur respons AI tidak valid.')
      }
      return parsed
    } catch (err) {
      lastError = err
      const msg = String(err)
      const isRetryable =
        msg.includes('503') || msg.includes('overloaded') || msg.includes('Service Unavailable')
      if (!isRetryable) throw err
    }
  }
  throw lastError
}

export const analyzeWithGemini = async (data: {
  category: string
  coordinates: string
  description: string
  title: string
}): Promise<GeminiAnalysis> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi.')

  const genAI = new GoogleGenerativeAI(apiKey)

  const FALLBACK_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash']

  const prompt = `Anda adalah sistem AI analisis insiden maritim untuk platform LautBersih Indonesia.
Analisis laporan insiden maritim berikut dan berikan respons HANYA sebagai JSON tanpa teks tambahan.

Data laporan:
- Judul: ${data.title || 'Tidak ada'}
- Kategori: ${data.category || 'Tidak diketahui'}
- Koordinat GPS: ${data.coordinates || 'Tidak diketahui'}
- Deskripsi: ${data.description || 'Tidak ada'}

Kembalikan JSON dengan skema persis ini:
{
  "categoryLabel": "<kategori insiden dalam Bahasa Indonesia>",
  "confidence": "<persentase keyakinan AI, contoh: 87.4%>",
  "severity": "<salah satu: WASPADA (LEVEL 1) | MODERAT (LEVEL 2) | SERIUS (LEVEL 3) | KRITIS (LEVEL 4)>",
  "severityTone": "<salah satu: safe | moderate | critical>",
  "summary": "<ringkasan analisis 1-2 kalimat dalam Bahasa Indonesia>",
  "recommendations": ["<tindakan 1>", "<tindakan 2>", "<tindakan 3>"]
}`

  let lastError: unknown
  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const result = await model.generateContent(prompt)
      const raw = result.response.text().trim()

      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? [''])[0]
      const parsed = JSON.parse(jsonStr) as GeminiAnalysis

      if (!parsed.severity || !Array.isArray(parsed.recommendations)) {
        throw new Error('Struktur respons AI tidak valid.')
      }

      return parsed
    } catch (err) {
      lastError = err
      const msg = String(err)
      const isRetryable =
        msg.includes('503') || msg.includes('overloaded') || msg.includes('Service Unavailable')
      if (!isRetryable) throw err
    }
  }

  throw lastError
}
