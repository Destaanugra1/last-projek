import { AppShell } from '@/components/lautbersih/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <AppShell activePath="/notifikasi">
      <section className="lb-page-hero lb-page-hero--compact space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </section>

      <section className="lb-notification-list space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article
            className={`lb-notification-card flex gap-4 p-4${i < 3 ? ' lb-notification-card--unread' : ''}`}
            key={i}
          >
            <Skeleton className="lb-notification-card__icon h-10 w-10 rounded-full" />
            <div className="lb-notification-card__body flex-1 space-y-2">
              <div className="lb-notification-card__head flex items-center gap-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  )
}
