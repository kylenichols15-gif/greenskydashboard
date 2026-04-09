import { StatusLevel } from '@/lib/utils'

interface BenchmarkBarProps {
  value: number
  target: number
  flagThreshold: number
  direction: 'high' | 'low' // 'high' = higher is better, 'low' = lower is better
  label?: string
  unit?: string
  status: StatusLevel
}

export default function BenchmarkBar({ value, target, flagThreshold, direction, label, unit = '%', status }: BenchmarkBarProps) {
  const max = direction === 'high' ? Math.max(target * 1.1, value * 1.05) : Math.max(flagThreshold * 1.2, value * 1.1)
  const pct = Math.min((value / max) * 100, 100)
  const targetPct = (target / max) * 100

  const barColor = status === 'green' ? '#10B981' : status === 'amber' ? '#F59E0B' : '#EF4444'

  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-[#64748B] mb-1">
          <span>{label}</span>
          <span className="text-[#94A3B8] font-medium">{value}{unit} <span className="text-[#64748B]">/ {target}{unit} target</span></span>
        </div>
      )}
      <div className="relative h-2 bg-[#1E2A3A] rounded-full overflow-visible">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
        {/* Target marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-[#94A3B8] rounded-full opacity-60"
          style={{ left: `${targetPct}%` }}
        />
      </div>
    </div>
  )
}
