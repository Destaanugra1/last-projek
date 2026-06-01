import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="lb-news-page" aria-busy="true" aria-live="polite">
      <div className="lb-news-section-bar">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-36" />
      </div>

      <div className="lb-news-top">
        <div className="lb-news-hero">
          <Skeleton className="lb-news-hero__img h-72 w-full rounded-2xl" />
          <div className="lb-news-hero__body space-y-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-8 w-3/5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
            </div>
            <div className="lb-news-hero__meta flex gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="lb-news-secondary flex flex-col gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="lb-news-secondary__item" key={i}>
              <div className="lb-news-secondary__text space-y-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="lb-news-secondary__thumb h-24 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="lb-news-rule h-px w-full" />
      <Skeleton className="lb-news-more-label h-5 w-64" />

      <div className="lb-news-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="lb-news-card overflow-hidden rounded-2xl" key={i}>
            <Skeleton className="lb-news-card__img h-44 w-full" />
            <div className="lb-news-card__body space-y-3 p-5">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/5" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
