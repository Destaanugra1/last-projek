/**
 * Test Gemini API key & model availability
 * Run: node scripts/test-gemini.mjs
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env manually
const envPath = join(__dirname, '../.env')
try {
  const envFile = readFileSync(envPath, 'utf-8')
  for (const line of envFile.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {
  console.error('❌ File .env tidak ditemukan')
  process.exit(1)
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY tidak ada di .env')
  process.exit(1)
}

console.log(`🔑 API Key: ${GEMINI_API_KEY.slice(0, 8)}...${GEMINI_API_KEY.slice(-4)}\n`)

const MODELS_TO_TEST = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
]

const PROMPT = JSON.stringify({ test: true })
const BODY = {
  contents: [{ parts: [{ text: 'Reply with: {"ok":true}' }], role: 'user' }],
  generationConfig: { maxOutputTokens: 16, responseMimeType: 'application/json' },
}

async function testModel(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(BODY),
    })
    const ms = Date.now() - start
    const json = await res.json()

    if (res.ok) {
      console.log(`✅ ${model.padEnd(30)} OK  (${ms}ms)`)
      return true
    }

    const code = json?.error?.code ?? res.status
    const msg = json?.error?.message ?? 'Unknown error'

    if (res.status === 429) {
      console.log(`🚫 ${model.padEnd(30)} 429 RATE LIMITED — ${msg.slice(0, 80)}`)
    } else if (res.status === 404) {
      console.log(`❓ ${model.padEnd(30)} 404 NOT FOUND`)
    } else {
      console.log(`❌ ${model.padEnd(30)} ${code} — ${msg.slice(0, 80)}`)
    }
  } catch (err) {
    console.log(`💥 ${model.padEnd(30)} NETWORK ERROR — ${err.message}`)
  }
  return false
}

console.log('Testing models...\n')

const results = []
for (const model of MODELS_TO_TEST) {
  const ok = await testModel(model)
  results.push({ model, ok })
  // small delay between requests to avoid triggering rate limits
  await new Promise((r) => setTimeout(r, 500))
}

const working = results.filter((r) => r.ok).map((r) => r.model)

console.log('\n─────────────────────────────────────')
if (working.length) {
  console.log(`✅ Model yang bisa dipakai:\n${working.map((m) => `   → ${m}`).join('\n')}`)
} else {
  console.log('❌ Tidak ada model yang berhasil. Cek API key atau billing.')
}
