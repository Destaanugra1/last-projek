import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main
      style={{ margin: '0 auto', maxWidth: '1200px', padding: '40px 24px 80px' }}
      aria-busy="true"
      aria-live="polite"
    >
      <div style={{ marginBottom: '40px' }}>
        <Skeleton className="h-3 w-48" />
        <Skeleton className="mt-2 h-10 w-2/3" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="lb-report-list-card space-y-4" key={i}>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
            </div>
            <div className="lb-report-list-card__footer flex justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
