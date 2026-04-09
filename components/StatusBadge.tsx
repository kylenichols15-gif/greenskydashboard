import { StatusLevel, getStatusBg } from '@/lib/utils'

interface StatusBadgeProps {
  status: StatusLevel
  label?: string
  dot?: boolean
}

export default function StatusBadge({ status, label, dot }: StatusBadgeProps) {
  if (dot) {
    const colors = { green: 'bg-green-400', amber: 'bg-amber-400', red: 'bg-red-400' }
    return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />
  }

  const labels: Record<StatusLevel, string> = {
    green: label || 'On Pace',
    amber: label || 'Behind',
    red:   label || 'Critical',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusBg(status)}`}>
      {labels[status]}
    </span>
  )
}
