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

// Helper to call GitHub Models API (Primary: gpt-4o-mini, Secondary: gpt-4o)
const callGitHubModelsWithFallback = async (
  messages: Array<{ role: string; content: any }>,
  jsonMode: boolean = true,
): Promise<any> => {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN belum dikonfigurasi di .env.')

  const models = ['gpt-4o-mini', 'gpt-4o']
  let lastError: unknown

  for (const modelName of models) {
    try {
      console.log(`[GitHub Models - Berita] Menghubungi model: ${modelName}...`)
      const body: any = {
        model: modelName,
        messages,
      }

      if (jsonMode) {
        body.response_format = { type: 'json_object' }
      }

      const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`)
      }

      const result = await response.json()
      const raw = result.choices?.[0]?.message?.content?.trim()
      if (!raw) throw new Error('Respons kosong dari model.')

      console.log(`[GitHub Models - Berita] Sukses menggunakan model: ${modelName}`)
      return jsonMode ? JSON.parse(raw) : raw
    } catch (err: any) {
      console.warn(`[GitHub Models - Berita] Gagal menggunakan model ${modelName}:`, err.message)
      lastError = err
    }
  }

  throw lastError
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
  const recList = data.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')

  const prompt = `Anda adalah jurnalis lingkungan hidup senior untuk platform berita LautBersih Indonesia.
Berdasarkan laporan pencemaran pesisir berikut, tulis sebuah artikel berita mendalam dan komprehensif dalam Bahasa Indonesia yang informatif, menarik, dan terstruktur dengan baik.

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
  "title": "<judul artikel berita yang menarik, bombastis tetapi edukatif, maks 80 karakter>",
  "excerpt": "<ringkasan 1-2 kalimat untuk preview artikel, maks 160 karakter>",
  "content": "<isi artikel lengkap dan mendalam dalam format HTML sederhana (gunakan <p>, <h2>, <ul>, <li>, <strong>). Artikel harus panjang dan detail, minimal 4 paragraf. Buat pembahasan terperinci mengenai dampak lingkungan di paragraf-paragraf tersebut. Wajib menggunakan poin-poin (<ul> dan <li>) untuk menjabarkan detail kejadian atau dampak spesifik di lapangan. Akhiri dengan seksi Rekomendasi Tindakan yang juga dijabarkan secara detail menggunakan list.>"
}`

  // 1. Try GitHub Models First (gpt-4o-mini -> gpt-4o)
  if (process.env.GITHUB_TOKEN) {
    try {
      const messages = [
        {
          role: 'user',
          content: [{ type: 'text', text: prompt }],
        },
      ]
      const parsed = (await callGitHubModelsWithFallback(messages, true)) as GeneratedBlogPost
      if (parsed.title && parsed.content) {
        return parsed
      }
    } catch (err: any) {
      console.warn('[Fallback - Berita] GitHub Models gagal sepenuhnya, berpindah ke Gemini API (Raja Terakhir)...')
    }
  }

  // 2. Fallback to Gemini API Key (Raja Terakhir)
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi.')

  const genAI = new GoogleGenerativeAI(apiKey)
  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash']
  let lastError: unknown

  for (const modelName of MODELS) {
    try {
      console.log(`[Gemini API - Berita] Menghubungi model: ${modelName}...`)
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      })

      const result = await model.generateContent(prompt)
      const raw = result.response.text().trim()
      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? [''])[0]
      const parsed = JSON.parse(jsonStr) as GeneratedBlogPost

      if (!parsed.title || !parsed.content) throw new Error('Respons AI tidak lengkap.')
      console.log(`[Gemini API - Berita] Sukses menggunakan model: ${modelName}`)
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
