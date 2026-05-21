import { reportStatusFlow, statusMeta } from '@/lib/lautbersih'
import type { FrontendReport } from '@/lib/reports'

export const ProgressStepper = ({ status }: { status: FrontendReport['status'] }) => {
  const activeIndex = reportStatusFlow.indexOf(
    (status === 'rejected' ? 'pending_review' : status) as (typeof reportStatusFlow)[number],
  )

  return (
    <div>
      <div className="lb-stepper" aria-label="Status laporan">
        {reportStatusFlow.map((step, index) => {
          const state =
            index < activeIndex ? 'completed' : index === activeIndex ? 'active' : 'upcoming'

          return (
            <div className={`lb-step lb-step--${state}`} key={step}>
              <span className="lb-step__dot" />
              {index < reportStatusFlow.length - 1 ? <span className="lb-step__line" /> : null}
              <strong>{statusMeta[step].label}</strong>
            </div>
          )
        })}
      </div>
      {status === 'rejected' ? (
        <div className="lb-stepper-note">
          Laporan ditolak setelah tahap review. Admin dapat membuka ulang laporan jika ada bukti
          tambahan.
        </div>
      ) : null}
    </div>
  )
}
