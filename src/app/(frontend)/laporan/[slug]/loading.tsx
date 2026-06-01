import { AppShell } from '@/components/lautbersih/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <AppShell activePath="/laporan">
      <section className="lb-detail-hero">
        <div className="lb-detail-hero__meta flex flex-wrap gap-3">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <div className="lb-detail-hero__head">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="lb-hero__actions">
            <Skeleton className="h-11 w-44" />
          </div>
        </div>
      </section>

      <div className="lb-detail-shell">
        <div className="flex flex-col gap-5">
          <Skeleton className="lb-detail-gallery h-72 w-full rounded-2xl" />

          <section className="lb-panel lb-detail-panel space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-3 w-44" />
          </section>
        </div>

        <section className="lb-detail-main space-y-6">
          <div className="lb-detail-grid grid gap-4 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="space-y-2" key={i}>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ))}
          </div>

          <section className="lb-analysis-card lb-detail-ai space-y-4">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          </section>

          <section className="lb-panel lb-detail-panel space-y-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-1/2" />
            <div className="flex items-center gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton className="h-9 w-9 rounded-full" key={i} />
              ))}
            </div>
          </section>
        </section>
      </div>
    </AppShell>
  )
}
