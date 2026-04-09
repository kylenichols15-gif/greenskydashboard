import { StatusLevel, getStatusBg } from '@/lib/utils'

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
    <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-5">
      <div className="text-[#64748B] text-xs font-medium uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[#F1F5F9] text-2xl font-bold mb-1">{value}</div>
      {subValue && <div className="text-[#94A3B8] text-sm mb-3">{subValue}</div>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[#64748B] mb-1">
            <span>{progress}% to goal</span>
          </div>
          <div className="h-1.5 bg-[#1E2A3A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: progress >= 100 ? '#10B981' : progress >= 80 ? '#0A9E8A' : progress >= 60 ? '#F59E0B' : '#EF4444',
              }}
            />
          </div>
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
