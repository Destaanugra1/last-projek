import { severityMeta, statusMeta } from '@/lib/lautbersih'

type Severity = keyof typeof severityMeta
type Status = keyof typeof statusMeta

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const meta = severityMeta[severity]

  return <span className={`lb-badge lb-badge--severity-${meta.tone}`}>{meta.label}</span>
}

export const StatusBadge = ({ status }: { status: Status }) => {
  const meta = statusMeta[status]

  return <span className={`lb-badge lb-badge--status-${meta.tone}`}>{meta.label}</span>
}
