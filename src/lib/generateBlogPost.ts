import { GoogleGenerativeAI } from '@google/generative-ai'

export type GeneratedBlogPost = {
  title: string
  excerpt: string
  content: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const generateBlogSlug = (title: string) => {
  const stamp = new Date().toISOString().slice(0, 10)
  return `${slugify(title)}-${stamp}`
}

export const generateBlogPostFromReport = async (data: {
  title: string
  description: string
  locationLabel: string
  category: string
  severity: string
  recommendations: string[]
  summary: string
}): Promise<GeneratedBlogPost> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi.')

  const genAI = new GoogleGenerativeAI(apiKey)

  const recList = data.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')

  const prompt = `Anda adalah jurnalis lingkungan hidup untuk platform berita LautBersih Indonesia.
Berdasarkan laporan pencemaran pesisir berikut, tulis sebuah artikel berita singkat dalam Bahasa Indonesia yang informatif dan jelas.

Data laporan:
- Judul Laporan: ${data.title}
- Lokasi: ${data.locationLabel}
- Kategori Sampah: ${data.category}
- Tingkat Keparahan: ${data.severity}
- Deskripsi: ${data.description}
- Ringkasan Analisis AI: ${data.summary}
- Rekomendasi Tindakan:
${recList}

Kembalikan HANYA JSON dengan skema persis ini (tanpa teks tambahan):
{
  "title": "<judul artikel berita yang menarik, maks 80 karakter>",
  "excerpt": "<ringkasan 1-2 kalimat untuk preview artikel, maks 160 karakter>",
  "content": "<isi artikel dalam format HTML sederhana: gunakan <p>, <h2>, <ul>, <li>, <strong>. Minimal 3 paragraf. Akhiri dengan seksi Rekomendasi Tindakan.>"
}`

  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash']
  let lastError: unknown

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const result = await model.generateContent(prompt)
      const raw = result.response.text().trim()
      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? [''])[0]
      const parsed = JSON.parse(jsonStr) as GeneratedBlogPost

      if (!parsed.title || !parsed.content) throw new Error('Respons AI tidak lengkap.')
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
