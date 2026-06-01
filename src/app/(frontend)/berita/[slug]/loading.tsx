import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="lb-news-page" aria-busy="true" aria-live="polite">
      <div className="lb-berita-detail-nav">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-44" />
      </div>

      <article className="lb-berita-detail">
        <div className="lb-berita-detail__meta flex flex-wrap gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <Skeleton className="h-10 w-11/12" />
        <Skeleton className="h-10 w-8/12" />

        <div className="lb-berita-detail__byline flex gap-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="lb-berita-detail__cover h-72 w-full rounded-2xl" />

        <div className="lb-berita-detail__content space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-9/12" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-8/12" />
        </div>

        <div className="lb-berita-detail__footer flex gap-3">
          <Skeleton className="h-11 w-56" />
          <Skeleton className="h-11 w-48" />
        </div>
      </article>
    </main>
  )
}
