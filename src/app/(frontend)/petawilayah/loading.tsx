import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="lb-monitoring" aria-busy="true" aria-live="polite">
      <main className="lb-monitoring__main">
        <aside className="lb-monitoring__sidebar">
          <div className="lb-monitoring__sidebar-head space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="lb-monitoring__sidebar-body space-y-5">
            <div className="lb-monitoring__category-list space-y-2">
              <Skeleton className="h-3 w-24" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="lb-monitoring__category-row flex items-center gap-3" key={i}>
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>

            <div className="lb-monitoring__severity-toggle flex gap-2">
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-9 flex-1 rounded-md" />
            </div>

            <div className="lb-monitoring__severity-stats grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="space-y-1 text-center" key={i}>
                  <Skeleton className="mx-auto h-7 w-12" />
                  <Skeleton className="mx-auto h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="lb-monitoring__canvas-wrap">
          <div className="lb-monitoring__map-shell">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </section>
      </main>

      <footer className="lb-monitoring__ticker">
        <div className="lb-monitoring__ticker-live flex items-center gap-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="lb-monitoring__ticker-marquee flex-1">
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="lb-monitoring__ticker-status">
          <Skeleton className="h-3 w-24" />
        </div>
      </footer>
    </div>
  )
}
