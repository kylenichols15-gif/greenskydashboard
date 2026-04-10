import { PERIOD_INFO } from '@/lib/data'

export default function DaysLeft() {
  const { totalBizDays, daysComplete, daysRemaining, label } = PERIOD_INFO
  const pct = Math.round((daysComplete / totalBizDays) * 100)

  return (
    <div className="bg-[#0D2B45] border border-[#0A9E8A]/20 rounded-lg px-5 py-4 text-right shrink-0 min-w-[160px]">
      <div className="text-[#F59E0B] text-3xl font-bold leading-none">{daysRemaining}</div>
      <div className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mt-0.5">Days Left</div>
      <div className="text-[#64748B] text-xs mt-1">Day {daysComplete} of {totalBizDays} complete</div>
      <div className="mt-2 h-1 bg-[#1E2A3A] rounded-full overflow-hidden">
        <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
