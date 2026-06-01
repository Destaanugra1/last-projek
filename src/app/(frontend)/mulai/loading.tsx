import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="lb-onboarding-shell" aria-busy="true" aria-live="polite">
      <div className="lb-onboarding-bg" />

      <section className="lb-splash-card">
        <div className="lb-splash-card__head flex items-center justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="lb-splash-mark mx-auto my-8 flex items-center justify-center">
          <Skeleton className="lb-splash-orb h-32 w-32 rounded-full" />
        </div>
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-3/4" />
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
        <div className="lb-dot-loader mt-6 flex justify-center gap-2" aria-hidden="true">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </section>

      <section className="lb-onboarding-panel space-y-6">
        <div className="lb-onboarding-panel__copy space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-2/3" />
        </div>
        <div className="lb-onboarding-grid grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <article className="lb-onboarding-card space-y-3 p-5" key={i}>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </article>
          ))}
        </div>
        <div className="lb-onboarding-actions flex items-center justify-between">
          <div className="lb-onboarding-dots flex gap-2" aria-label="Indikator slide">
            <Skeleton className="h-2 w-6 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
          <div className="lb-hero__actions flex gap-3">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </section>
    </div>
  )
}
