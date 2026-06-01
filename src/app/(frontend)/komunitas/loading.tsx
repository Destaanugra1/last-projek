import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[linear-gradient(180deg,#f7f9ff_0%,#edf4ff_100%)] text-[#101d29]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Skeleton className="h-8 w-44 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="mx-auto h-12 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="mx-auto h-5 w-full" />
              <Skeleton className="mx-auto h-5 w-5/6" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-44" />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <section className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm md:col-span-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="flex items-center gap-4 rounded-lg border p-3" key={i}>
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                  <Skeleton className="h-5 w-10" />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-6 md:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Skeleton className="h-44 w-full rounded-lg" />
              <div className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm">
                <Skeleton className="h-6 w-48 rounded-full" />
                <Skeleton className="mt-5 h-7 w-2/3" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            <section className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-56" />
                  <Skeleton className="h-3 w-72" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="rounded-lg border p-4 text-center" key={i}>
                    <Skeleton className="mx-auto h-16 w-16 rounded-full" />
                    <Skeleton className="mx-auto mt-4 h-4 w-3/4" />
                    <Skeleton className="mx-auto mt-2 h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="flex flex-col gap-5 lg:col-span-7">
            <div className="space-y-2 border-b border-slate-200 pb-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-3 w-80" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="overflow-hidden rounded-lg border border-[#0b2540]/10 bg-white shadow-sm" key={i}>
                <div className="grid gap-5 p-5 sm:grid-cols-[220px_minmax(0,1fr)]">
                  <Skeleton className="h-40 w-full rounded-md" />
                  <div className="flex flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-lg bg-[#0b2540] p-6 text-white shadow-sm lg:col-span-5">
            <Skeleton className="h-7 w-2/3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <Skeleton className="mt-2 h-4 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton className="mt-1 h-4 w-3/4" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <Skeleton
              className="mt-6 h-48 w-full rounded-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
            />
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
              <Skeleton className="h-12 w-12 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.10)' }} />
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-[#0b2540]/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-11 w-36" />
          </div>
        </section>
      </div>
    </main>
  )
}
