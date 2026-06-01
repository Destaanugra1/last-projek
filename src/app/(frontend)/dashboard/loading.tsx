import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="lb-dash" aria-busy="true" aria-live="polite">
      <div className="lb-dash-hero space-y-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-12 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="lb-dash-hero__meta flex gap-3">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-7 w-44 rounded-full" />
        </div>
      </div>

      <div className="lb-dash-kpis">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="lb-dash-kpi" key={i}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-3 w-36" />
            <Skeleton className="absolute right-6 top-6 h-12 w-12 rounded opacity-20" />
          </div>
        ))}
      </div>

      <div className="lb-dash-grid">
        <div className="lb-dash-grid__left">
          <div className="lb-dash-panel space-y-4">
            <div className="lb-dash-panel__head flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="lb-dash-timeline flex h-44 items-end gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton className="flex-1" key={i} style={{ height: `${30 + i * 8}%` }} />
              ))}
            </div>
          </div>

          <div className="lb-dash-panel space-y-3">
            <div className="lb-dash-panel__head flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="lb-dash-category space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="lb-dash-category__row flex items-center gap-3" key={i}>
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-dash-panel lb-dash-panel--dark space-y-3">
            <div className="lb-dash-panel__head flex justify-between">
              <Skeleton className="h-5 w-40" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <Skeleton className="h-3 w-20" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className="lb-dash-alerts space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  className="lb-dash-alert space-y-2 rounded-md p-3"
                  key={i}
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="lb-dash-alert__head flex justify-between">
                    <Skeleton className="h-4 w-3/4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton className="h-5 w-16 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <Skeleton className="h-3 w-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lb-dash-grid__right">
          <div className="lb-dash-panel space-y-3">
            <div className="lb-dash-panel__head">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="lb-dash-status space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="lb-dash-status__row flex justify-between" key={i}>
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-10 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-dash-panel space-y-3">
            <div className="lb-dash-panel__head flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="lb-dash-locations space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="lb-dash-locations__row flex items-center gap-3" key={i}>
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-dash-panel space-y-3">
            <div className="lb-dash-panel__head">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="lb-dash-status space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="lb-dash-status__row flex justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-10 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="lb-dash-cta space-y-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-7 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-11 w-44" />
          </div>
        </div>
      </div>
    </main>
  )
}
