import { AppShell } from '@/components/lautbersih/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <AppShell activePath="/profil">
      <section className="lb-profile-header">
        <div className="lb-profile-header__avatar-wrap">
          <Skeleton className="lb-profile-header__avatar h-24 w-24 rounded-full" />
          <Skeleton className="lb-profile-header__status h-5 w-24" />
        </div>
        <div className="lb-profile-header__identity space-y-3">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-10 w-72" />
          <div className="lb-profile-header__meta-row flex items-center gap-3">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="lb-profile-header__actions">
          <Skeleton className="h-11 w-40" />
        </div>
      </section>

      <div className="lb-profile-layout">
        <div className="lb-profile-main space-y-6">
          <div className="lb-panel lb-profile-info-card space-y-5">
            <div className="lb-profile-section-head flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="lb-profile-info-grid grid gap-4 md:grid-cols-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="space-y-2" key={i}>
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-panel lb-profile-reports-card space-y-4">
            <div className="lb-profile-section-head flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="lb-profile-report-list space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="lb-profile-report-row flex items-center gap-3 p-3" key={i}>
                  <Skeleton className="lb-profile-report-row__rail h-12 w-1 rounded-full" />
                  <div className="lb-profile-report-row__body flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-2/5" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lb-profile-sidebar space-y-6">
          <div className="lb-panel lb-profile-stats-card space-y-4">
            <Skeleton className="h-3 w-44" />
            <div className="lb-profile-stats-list space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="lb-profile-stat-row flex items-center justify-between" key={i}>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-panel lb-profile-badge-card space-y-4">
            <Skeleton className="h-3 w-32" />
            <div className="lb-profile-badge-hero flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <div className="lb-profile-badge-grid grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="lb-profile-mini-badge space-y-2 p-3 text-center" key={i}>
                  <Skeleton className="mx-auto h-8 w-8" />
                  <Skeleton className="mx-auto h-3 w-3/4" />
                  <Skeleton className="mx-auto h-2 w-2/3" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-panel lb-profile-category-card space-y-3">
            <Skeleton className="h-3 w-36" />
            <div className="lb-profile-category-list space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="lb-profile-category-row flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-panel lb-profile-security-card space-y-3">
            <Skeleton className="h-3 w-36" />
            <div className="lb-profile-security-list space-y-3">
              <Skeleton className="lb-profile-security-divider h-px w-full" />
              <div className="lb-profile-security-row flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
