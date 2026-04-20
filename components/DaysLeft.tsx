import { PERIOD_INFO } from '@/lib/data'

export default function DaysLeft() {
  const { totalBizDays, daysComplete, daysRemaining, dataAsOf } = PERIOD_INFO
  const pct = Math.round((daysComplete / totalBizDays) * 100)

  return (
    <>
      {/* Mobile: compact horizontal strip */}
      <div className="sm:hidden flex items-center gap-3 bg-[#eff6ff] border border-[#2563eb]/20 rounded-lg px-4 py-2 w-full">
        <span className="text-[#F59E0B] text-2xl font-bold leading-none">{daysRemaining}</span>
        <div className="flex-1">
          <div className="text-[#475569] text-xs font-semibold">Days Left · Day {daysComplete}/{totalBizDays}</div>
          <div className="mt-1 h-1 bg-[#dde6f2] rounded-full overflow-hidden">
            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[#64748b] text-xs mt-1">📅 Data as of {dataAsOf}</div>
        </div>
      </div>
      {/* Desktop: vertical card */}
      <div className="hidden sm:block bg-[#eff6ff] border border-[#2563eb]/20 rounded-lg px-5 py-4 text-right shrink-0 min-w-[180px]">
        <div className="text-[#F59E0B] text-3xl font-bold leading-none">{daysRemaining}</div>
        <div className="text-[#475569] text-xs font-semibold uppercase tracking-wider mt-0.5">Days Left</div>
        <div className="text-[#475569] text-xs mt-1">Day {daysComplete} of {totalBizDays} complete</div>
        <div className="mt-2 h-1 bg-[#dde6f2] rounded-full overflow-hidden">
          <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[#2563eb] text-xs font-semibold mt-2">📅 Data as of {dataAsOf}</div>
      </div>
    </>
  )
}
