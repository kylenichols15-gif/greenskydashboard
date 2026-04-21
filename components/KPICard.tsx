import { StatusLevel, getStatusBg } from '@/lib/utils'
import GoalBar from './GoalBar'

interface KPICardProps {
  label: string
  value: string
  subValue?: string
  progress?: number
  status?: StatusLevel
  detail?: string
}

export default function KPICard({ label, value, subValue, progress, status, detail }: KPICardProps) {
  return (
    <div className="bg-white border border-[#d1dce9] rounded-lg p-5">
      <div className="text-[#64748b] text-xs font-medium uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[#0f172a] text-2xl font-bold mb-1">{value}</div>
      {subValue && <div className="text-[#64748b] text-sm mb-3">{subValue}</div>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[#64748b] mb-1">
            <span>{progress}% to goal</span>
          </div>
          <GoalBar pct={progress} height="thin" />
        </div>
      )}
      {status && detail && (
        <div className={`inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded text-xs border ${getStatusBg(status)}`}>
          {detail}
        </div>
      )}
    </div>
  )
}
