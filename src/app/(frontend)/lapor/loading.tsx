import { AppShell } from '@/components/lautbersih/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <AppShell activePath="/lapor">
      <section className="lb-page-hero lb-page-hero--compact space-y-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-2/3" />
      </section>

      <div className="space-y-6">
        <div className="lb-panel space-y-4 p-6">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="lb-panel space-y-4 p-6">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>

        <div className="lb-panel space-y-4 p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>

        <div className="lb-panel space-y-4 p-6">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className="h-24 w-full rounded-xl" key={i} />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-40" />
        </div>
      </div>
    </AppShell>
  )
}
