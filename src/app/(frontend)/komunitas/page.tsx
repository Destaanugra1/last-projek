import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Download,
  Lock,
  MapPin,
  Megaphone,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Waves,
} from 'lucide-react'

import { buildDashboardStats, getReports, getSiteSettings } from '@/lib/reports'

export const metadata = {
  title: 'Komunitas',
}

export const dynamic = 'force-dynamic'

const severityLabel = {
  critical: 'Tinggi',
  low: 'Rendah',
  medium: 'Sedang',
} as const

const severityAccent = {
  critical: {
    badge: 'bg-red-50 text-red-700 ring-red-200',
    rail: 'bg-red-500',
  },
  low: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    rail: 'bg-emerald-500',
  },
  medium: {
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    rail: 'bg-amber-500',
  },
} as const

type ContributorEntry = {
  avatarUrl: string | null
  count: number
  criticalCount: number
  displayName: string
  id: string
  initials: string
  latestReportTitle: string
  validatedCount: number
}

const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

const formatDayMonth = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase()

const getBadgeTier = (count: number) => {
  if (count >= 20) {
    return {
      className: 'bg-[#0b2540] text-white',
      label: 'Elite',
    }
  }

  if (count >= 10) {
    return {
      className: 'bg-[#83f5c6] text-[#00513a]',
      label: 'Inti',
    }
  }

  if (count >= 3) {
    return {
      className: 'bg-[#d3e4ff] text-[#314865]',
      label: 'Aktif',
    }
  }

  return {
    className: 'bg-[#e7e2da] text-[#494741]',
    label: 'Baru',
  }
}

export default async function KomunitasPage() {
  const [reports, siteSettings] = await Promise.all([getReports(100), getSiteSettings()])
  const stats = buildDashboardStats(reports)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const contributorMap = new Map<string, ContributorEntry>()

  reports.forEach((report) => {
    const id = report.reportedBy?.id || `anon:${report.reporterName}`
    const displayName = report.reportedBy?.fullName || report.reporterName
    const existing = contributorMap.get(id)

    if (existing) {
      existing.count += 1
      existing.criticalCount += report.severity === 'critical' ? 1 : 0
      existing.validatedCount += report.status === 'validated' ? 1 : 0
    } else {
      contributorMap.set(id, {
        avatarUrl: report.reportedBy?.avatarUrl || null,
        count: 1,
        criticalCount: report.severity === 'critical' ? 1 : 0,
        displayName,
        id,
        initials: getInitials(displayName),
        latestReportTitle: report.title,
        validatedCount: report.status === 'validated' ? 1 : 0,
      })
    }
  })

  const topContributors = Array.from(contributorMap.values())
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count
      if (right.validatedCount !== left.validatedCount)
        return right.validatedCount - left.validatedCount
      return right.criticalCount - left.criticalCount
    })
    .slice(0, 5)

  const reportsThisMonth = reports.filter((report) => {
    const submittedAt = new Date(report.submittedAt)
    return submittedAt.getMonth() === currentMonth && submittedAt.getFullYear() === currentYear
  }).length

  const agendaReports = reports
    .filter((report) => report.status !== 'resolved' && report.status !== 'rejected')
    .sort((left, right) => {
      const severityOrder = { critical: 3, medium: 2, low: 1 }
      const leftScore = severityOrder[left.severity]
      const rightScore = severityOrder[right.severity]
      if (rightScore !== leftScore) return rightScore - leftScore
      return new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
    })
    .slice(0, 2)

  const featuredShareReport =
    reports.find((report) => report.status === 'validated') || reports[0] || null
  const shareAuthor = featuredShareReport
    ? featuredShareReport.reportedBy?.fullName || featuredShareReport.reporterName
    : 'Komunitas LautBersih'
  const shareAuthorInitials = getInitials(shareAuthor)

  const badgeHighlights = [
    {
      description: `${Array.from(contributorMap.values()).filter((entry) => entry.count >= 10).length} anggota`,
      icon: <Megaphone className="h-7 w-7" />,
      title: 'Pelapor Aktif',
      unlocked: true,
    },
    {
      description: `${Array.from(contributorMap.values()).filter((entry) => entry.count >= 3).length} anggota`,
      icon: <ShieldCheck className="h-7 w-7" />,
      title: 'Relawan Pesisir',
      unlocked: true,
    },
    {
      description: `${Array.from(contributorMap.values()).filter((entry) => entry.validatedCount >= 5).length} anggota`,
      icon: <Sparkles className="h-7 w-7" />,
      title: 'Mata Elang',
      unlocked: Array.from(contributorMap.values()).some((entry) => entry.validatedCount >= 5),
    },
    {
      description: `${stats.topLocations[0]?.label || 'Belum ada basis wilayah'}`,
      icon: <Waves className="h-7 w-7" />,
      title: 'Penjaga Pesisir',
      unlocked: stats.topLocations.length > 0,
    },
  ]

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9ff_0%,#edf4ff_100%)] text-[#101d29]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#006c4e]/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#006c4e] shadow-sm">
            <Waves className="h-4 w-4" />
            Community Hub
          </div>
          <div className="space-y-4">
            <h1 className="font-serif text-4xl leading-tight text-[#000f22] sm:text-5xl">
              Bersama Jaga Laut Kita
            </h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              {siteSettings.tagline}. Pantau kontribusi warga, prioritas penanganan, dan dampak
              laporan yang masuk langsung dari database Payload CMS.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#006c4e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00513a]"
              href="/lapor"
            >
              Buat Laporan
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0b2540]/15 bg-white px-5 py-3 text-sm font-semibold text-[#0b2540] transition hover:border-[#0b2540]/30 hover:bg-[#f7f9ff]"
              href="/laporan"
            >
              Lihat Semua Laporan
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <section className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm md:col-span-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-serif text-2xl text-[#000f22]">Top Kontributor</h2>
                <p className="mt-1 text-sm text-slate-500">Diurutkan dari jumlah laporan masuk</p>
              </div>
              <Trophy className="h-6 w-6 text-[#006c4e]" />
            </div>

            <div className="mt-5 space-y-4">
              {topContributors.length > 0 ? (
                topContributors.map((contributor, index) => {
                  const tier = getBadgeTier(contributor.count)

                  return (
                    <div
                      className={`flex items-center gap-4 rounded-lg border p-3 ${
                        index === 0
                          ? 'border-[#006c4e]/20 bg-[#edf4ff]'
                          : 'border-transparent bg-[#f7f9ff]'
                      }`}
                      key={contributor.id}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-[#006c4e] text-white' : 'bg-[#d7e4f5] text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b2540] text-sm font-semibold text-white">
                        {contributor.avatarUrl ? (
                          <Image
                            alt={contributor.displayName}
                            fill
                            sizes="44px"
                            src={contributor.avatarUrl}
                            className="object-cover"
                          />
                        ) : (
                          contributor.initials
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {contributor.displayName}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tier.className}`}
                          >
                            {tier.label}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {contributor.latestReportTitle}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{contributor.count}</p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                          laporan
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="rounded-lg bg-[#f7f9ff] px-4 py-6 text-sm text-slate-500">
                  Belum ada data kontributor.
                </p>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-6 md:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-lg bg-[#000f22] p-6 text-white shadow-sm">
                <div className="absolute -right-5 -bottom-6 text-white/10">
                  <Waves className="h-28 w-28" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                  Total Laporan Bulan Ini
                </p>
                <p className="mt-3 font-serif text-5xl leading-none">
                  {reportsThisMonth.toLocaleString('id-ID')}
                </p>
                <p className="mt-4 text-sm text-white/70">
                  Dihitung dari tanggal pengiriman laporan yang tersimpan di Payload.
                </p>
              </div>

              <div className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#006c4e]/15 bg-[#006c4e]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#006c4e]">
                  <ShieldCheck className="h-4 w-4" />
                  SDG 14 · Life Below Water
                </div>
                <h2 className="mt-5 font-serif text-2xl text-[#000f22]">
                  {stats.validatedCount} laporan sudah tervalidasi
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Statistik ini diperbarui dari alur verifikasi laporan publik dan membantu
                  menentukan prioritas tindak lanjut komunitas.
                </p>
              </div>
            </div>

            <section className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-[#000f22]">Badge Kontributor</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lencana komunitas dihitung dari aktivitas kontribusi yang tersimpan di database.
                  </p>
                </div>
                <div className="text-sm text-slate-500">{contributorMap.size} anggota aktif</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {badgeHighlights.map((badge) => (
                  <div
                    className={`rounded-lg border p-4 text-center transition ${
                      badge.unlocked
                        ? 'border-[#0b2540]/10 bg-[#f7f9ff] hover:bg-[#edf4ff]'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-500'
                    }`}
                    key={badge.title}
                  >
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                        badge.unlocked
                          ? 'bg-[#d3e4ff] text-[#314865]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {badge.unlocked ? badge.icon : <Lock className="h-7 w-7" />}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900">{badge.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="flex flex-col gap-5 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="font-serif text-2xl text-[#000f22]">Agenda Cleanup Komunitas</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Prioritas lapangan ini diturunkan dari laporan aktif berisiko tertinggi.
                </p>
              </div>
              <Link
                className="text-sm font-semibold text-[#006c4e] hover:underline"
                href="/petawilayah"
              >
                Lihat Peta
              </Link>
            </div>

            {agendaReports.length > 0 ? (
              agendaReports.map((report) => {
                const accent = severityAccent[report.severity]
                const imageSrc = report.photoUrls[0] || null

                return (
                  <article
                    className="relative overflow-hidden rounded-lg border border-[#0b2540]/10 bg-white shadow-sm"
                    key={report.id}
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 ${accent.rail}`} />
                    <div className="grid gap-5 p-5 sm:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="relative h-40 overflow-hidden rounded-md bg-[#d7e4f5] sm:h-full">
                        {imageSrc ? (
                          <Image
                            alt={report.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 220px"
                            src={imageSrc}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#0b2540,#314865)] text-white">
                            <Waves className="h-10 w-10" />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col justify-between gap-5">
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="max-w-xl font-serif text-2xl leading-tight text-[#000f22]">
                              {report.title}
                            </h3>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${accent.badge}`}
                            >
                              {severityLabel[report.severity]}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{report.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-medium text-[#314865]">
                              <MapPin className="h-3.5 w-3.5" />
                              {report.locationLabel}
                            </span>
                            {report.category && (
                              <span className="inline-flex items-center rounded-full bg-[#e7e2da] px-3 py-1 text-xs font-medium text-[#494741]">
                                {report.category.title}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            {formatShortDate(report.submittedAt)}
                          </div>
                          <Link
                            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#006c4e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00513a]"
                            href={`/laporan/${report.slug}`}
                          >
                            Detail Laporan
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-sm text-slate-500">
                Belum ada agenda prioritas yang bisa dibentuk dari laporan aktif.
              </div>
            )}
          </section>

          <section className="flex flex-col rounded-lg bg-[#0b2540] p-6 text-white shadow-sm lg:col-span-5">
            <h2 className="font-serif text-2xl text-white">Sebarkan Dampak Anda</h2>
            <p className="mt-2 text-sm leading-7 text-[#b1c8eb]">
              Sorot laporan tervalidasi terbaru agar lebih banyak warga ikut mengawasi wilayah
              pesisir.
            </p>

            <div className="relative mt-6 flex flex-1 flex-col justify-center overflow-hidden rounded-xl border border-white/15 bg-white/8 p-5 backdrop-blur">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#86f8c9]/20 blur-3xl" />

              {featuredShareReport ? (
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#86f8c9]">
                    <ShieldCheck className="h-4 w-4" />
                    Laporan Tervalidasi
                  </div>
                  <p className="font-serif text-2xl leading-snug text-white">
                    &quot;{featuredShareReport.title}&quot;
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#d3e4ff]">
                    {featuredShareReport.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006c4e] text-xs font-bold text-white">
                        {shareAuthorInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{shareAuthor}</p>
                        <p className="text-xs text-[#b1c8eb]">
                          {formatDayMonth(featuredShareReport.submittedAt)} ·{' '}
                          {featuredShareReport.locationLabel}
                        </p>
                      </div>
                    </div>
                    <div className="font-serif text-xl italic text-white/55">
                      {siteSettings.siteName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 text-sm text-[#d3e4ff]">
                  Belum ada laporan yang bisa dipakai sebagai kartu berbagi.
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[#006c4e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00513a]"
                href={featuredShareReport ? `/laporan/${featuredShareReport.slug}` : '/laporan'}
              >
                <Download className="h-4 w-4" />
                Buka Card
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 text-white transition hover:bg-white/15"
                href={featuredShareReport ? `/laporan/${featuredShareReport.slug}` : '/laporan'}
              >
                <Share2 className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006c4e]">
                Ringkasan Komunitas
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#000f22]">
                Aktivitas warga membantu respons yang lebih cepat
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Saat ini ada {stats.total} laporan publik, {stats.resolvedCount} yang sudah selesai
                ditangani, dan {stats.topLocations[0]?.label || 'belum ada hotspot dominan'} sebagai
                wilayah dengan laporan terbanyak.
              </p>
            </div>

            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2540]"
              href="/lapor"
            >
              Kirim Laporan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
