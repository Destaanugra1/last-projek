'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { RichText, type LexicalRoot } from './RichText'

export type MaintenanceEntry = {
  id: string
  pageRoute: string
  isActive: boolean
  allowAdmins: boolean
  applyOnDev: boolean
  title: string
  content?: LexicalRoot | null
}

type Props = {
  entries: MaintenanceEntry[]
  userRole?: string | null
  /** Pass server-side NODE_ENV so client bundle doesn't expose it */
  isDev: boolean
}

export function MaintenanceBarrier({ entries, userRole, isDev }: Props) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [activeEntry, setActiveEntry] = useState<MaintenanceEntry | null>(null)

  useEffect(() => {
    // Layer 1 + 3 + 4 + 5: Find matching maintenance entry for current route
    const match = entries.find((entry) => {
      // Layer 2: isActive check
      if (!entry.isActive) return false

      // Layer 1: Environment check – skip if dev and applyOnDev is off
      if (isDev && !entry.applyOnDev) return false

      // Layer 4: Admin bypass
      if (userRole === 'admin' && entry.allowAdmins) return false

      // Layer 5 + 3: Route matching (global or prefix)
      if (entry.pageRoute === 'global') return true
      return pathname === entry.pageRoute || pathname.startsWith(entry.pageRoute + '/')
    })

    setActiveEntry(match || null)
    setVisible(!!match)
  }, [pathname, entries, userRole, isDev])

  // Lock body scroll when overlay is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!visible || !activeEntry) return null

  return (
    <div
      id="maintenance-barrier-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Mode Pemeliharaan"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Full-Screen Backdrop ───────────────────────────── */}
      <div className="absolute inset-0 bg-[#030d1a]/95 backdrop-blur-xl" />

      {/* ── Animated Background Elements ──────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Spinning outer ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#1d9e75]/10"
          style={{ animation: 'spin-slow 20s linear infinite' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#1d9e75]/5"
          style={{ animation: 'spin-slow 30s linear infinite reverse' }}
        />

        {/* Glowing radial blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1d9e75]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0b2540]/60 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-[#51c3ff]/5 rounded-full blur-[80px]" />

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(131,245,198,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(131,245,198,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#1d9e75]/40"
            style={{
              top: `${15 + i * 10}%`,
              left: `${10 + i * 11}%`,
              animation: `float-particle ${3 + i * 0.7}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main Card ────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 sm:mx-auto"
        style={{ animation: 'slide-up 0.6s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
          {/* Card gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1e33] via-[#071523] to-[#030d1a]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d9e75]/5 via-transparent to-[#51c3ff]/3" />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1d9e75]/60 to-transparent" />

          <div className="relative p-8 sm:p-10">
            {/* ── Icon Section ─────────────────────────────────── */}
            <div className="flex justify-center mb-7">
              <div className="relative">
                {/* Pulsing rings behind icon */}
                <div
                  className="absolute inset-0 rounded-full bg-[#1d9e75]/10"
                  style={{ animation: 'ping-slow 2.4s ease-out infinite' }}
                />
                <div
                  className="absolute inset-0 rounded-full bg-[#1d9e75]/5"
                  style={{ animation: 'ping-slow 2.4s ease-out infinite', animationDelay: '0.8s' }}
                />

                {/* Central wrench icon — SVG inline */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#0b2540] to-[#030d1a] border border-[#1d9e75]/30 flex items-center justify-center shadow-[0_0_40px_rgba(29,158,117,0.2)]">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1d9e75"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'wiggle 2.5s ease-in-out infinite' }}
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>

                  {/* Rotating dashed ring around icon */}
                  <svg
                    className="absolute inset-0"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    style={{ animation: 'spin-slow 8s linear infinite' }}
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#1d9e75"
                      strokeWidth="1"
                      strokeDasharray="6 4"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* ── Badge / Label ────────────────────────────────── */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1d9e75]/10 border border-[#1d9e75]/25 text-[#83f5c6] text-[0.68rem] font-bold uppercase tracking-widest">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#1d9e75]"
                  style={{ animation: 'blink 1.5s ease-in-out infinite' }}
                />
                Pemeliharaan Sistem
              </span>
            </div>

            {/* ── Title ─────────────────────────────────────────── */}
            <h1 className="text-white text-center text-2xl sm:text-3xl font-serif tracking-tight leading-snug mb-5">
              {activeEntry.title}
            </h1>

            {/* ── Divider ──────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
              <div className="w-1 h-1 rounded-full bg-[#1d9e75]/50" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
            </div>

            {/* ── CMS Rich Text Content ─────────────────────────── */}
            {activeEntry.content && (
              <div className="text-slate-300 text-sm leading-relaxed mb-7 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent [&_.lb-rich-text_p]:text-slate-400 [&_.lb-rich-text_h2]:text-white [&_.lb-rich-text_h2]:text-base [&_.lb-rich-text_a]:text-[#83f5c6] [&_.lb-rich-text_strong]:text-slate-200">
                <RichText content={activeEntry.content} />
              </div>
            )}

            {/* ── Progress Bar (Decorative) ─────────────────────── */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest">
                  Status Sistem
                </span>
                <span className="text-[0.7rem] font-bold text-[#1d9e75] uppercase tracking-widest">
                  Dalam Perbaikan
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1d9e75] to-[#51c3ff]"
                  style={{
                    animation: 'progress-pulse 2s ease-in-out infinite',
                    width: '60%',
                  }}
                />
              </div>
            </div>

            {/* ── CTA Buttons ──────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 font-semibold text-sm transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Ke Beranda
              </Link>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#1d9e75] to-[#128b65] hover:from-[#128b65] hover:to-[#0e6f50] text-white font-bold text-sm transition-all shadow-lg shadow-[#1d9e75]/20 hover:shadow-[#1d9e75]/30"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: 'spin-slow 3s linear infinite' }}
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Muat Ulang
              </button>
            </div>

            {/* ── Bottom Note ───────────────────────────────────── */}
            <p className="text-center text-[0.7rem] text-slate-600 mt-6 font-medium">
              Mohon maaf atas ketidaknyamanan ini.{' '}
              <span className="text-slate-500">Kami sedang bekerja keras untuk Anda.</span>
            </p>
          </div>
        </div>

        {/* Copyright below card */}
        <p className="text-center text-[0.68rem] text-slate-700 mt-4">
          © {new Date().getFullYear()} LautBersih Maritime Authority
        </p>
      </div>

      {/* ── Keyframe Animations via style tag ─────────────── */}
      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg) scale(1); }
          50%       { transform: rotate(4deg) scale(1.05); }
        }
        @keyframes ping-slow {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes float-particle {
          from { transform: translateY(0) scale(1); opacity: 0.4; }
          to   { transform: translateY(-18px) scale(1.4); opacity: 0.8; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes progress-pulse {
          0%   { width: 45%; opacity: 0.8; }
          50%  { width: 72%; opacity: 1; }
          100% { width: 45%; opacity: 0.8; }
        }
        /* These override the absolute+translate for the non-centered spin rings */
        #maintenance-barrier-overlay .absolute[class*="w-\\[600px\\]"],
        #maintenance-barrier-overlay .absolute[class*="w-\\[800px\\]"] {
          animation-name: spin-centered;
        }
        @keyframes spin-centered {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
