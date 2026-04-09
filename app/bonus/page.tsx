import { DEMO_DATA, LOCATIONS } from '@/lib/data'
import { formatCurrency, formatPct } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'

const MONTHLY_GOALS: Record<string, number> = {
  LKW: 120000, LT: 100000, HNR: 70000, HNS: 65000, PB: 80000, PR: 55000, OSB: 30000,
}

const TIERS = [
  { label: 'Silver',   min: 0.95,  max: 1.00,  amount: 500,  color: 'text-slate-300',   bg: 'bg-slate-500/10 border-slate-500/20' },
  { label: 'Gold',     min: 1.00,  max: 1.05,  amount: 1000, color: 'text-yellow-300',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { label: 'Platinum', min: 1.05,  max: 1.10,  amount: 1500, color: 'text-cyan-300',    bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Diamond',  min: 1.10,  max: Infinity, amount: 2000, color: 'text-violet-300', bg: 'bg-violet-500/10 border-violet-500/20' },
]

function getTier(pct: number) {
  return TIERS.find(t => pct >= t.min * 100 && pct < t.max * 100) ?? null
}

function getNextTier(pct: number) {
  const idx = TIERS.findIndex(t => pct >= t.min * 100 && pct < t.max * 100)
  return idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

export default function BonusPage() {
  const { locations } = DEMO_DATA

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#F1F5F9] text-2xl font-bold">Bonus Race</h1>
        <p className="text-[#64748B] text-sm mt-1">April 2026 · Collections vs. Monthly Goal · Demo Data</p>
      </div>

      {/* Tier Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {TIERS.map(tier => (
          <div key={tier.label} className={`rounded-lg border px-4 py-3 ${tier.bg}`}>
            <div className={`font-bold text-sm ${tier.color}`}>{tier.label}</div>
            <div className={`text-xs mt-0.5 ${tier.color} opacity-80`}>{tier.min * 100}–{tier.max === Infinity ? '110+' : tier.max * 100}% of goal</div>
            <div className={`font-semibold text-base mt-1 ${tier.color}`}>${tier.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Location Cards */}
      <div className="flex flex-col gap-4">
        {locations.map(loc => {
          const meta      = LOCATIONS.find(l => l.code === loc.code)
          const goal      = MONTHLY_GOALS[loc.code] ?? 100000
          const pct       = (loc.collections / goal) * 100
          const tier      = getTier(pct)
          const nextTier  = getNextTier(pct)
          const barWidth  = Math.min(pct, 115)
          const dollarToNext = nextTier ? Math.max(0, nextTier.min * goal - loc.collections) : 0

          const barColor = pct >= 110 ? '#8B5CF6' : pct >= 105 ? '#06B6D4' : pct >= 100 ? '#EAB308' : pct >= 95 ? '#94A3B8' : pct >= 80 ? '#F59E0B' : '#EF4444'

          return (
            <div key={loc.code} className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-sm font-bold px-3 py-1 rounded border border-[#0A9E8A]/20">
                    {loc.code}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#F1F5F9] font-semibold">{meta?.name}</span>
                      {loc.isOSB && <OSBBadge />}
                    </div>
                    <div className="text-[#64748B] text-xs">{meta?.brand}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tier ? (
                    <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${tier.color} ${tier.bg}`}>
                      {tier.label} · ${tier.amount.toLocaleString()}
                    </span>
                  ) : pct >= 80 ? (
                    <span className="px-3 py-1 rounded-lg border text-sm font-medium text-amber-400 bg-amber-500/10 border-amber-500/20">
                      Approaching Silver
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-lg border text-sm font-medium text-red-400 bg-red-500/10 border-red-500/20">
                      No Bonus
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
                  <span>{formatCurrency(loc.collections)} collected</span>
                  <span className="font-semibold" style={{ color: barColor }}>{formatPct(pct, 1)} of {formatCurrency(goal, true)} goal</span>
                </div>
                <div className="relative h-4 bg-[#1E2A3A] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${barWidth / 115 * 100}%`, backgroundColor: barColor }} />
                  {/* Tier markers */}
                  {[95, 100, 105, 110].map(t => (
                    <div
                      key={t}
                      className="absolute top-0 h-full w-px bg-[#0A0F1E]/60"
                      style={{ left: `${(t / 115) * 100}%` }}
                    />
                  ))}
                </div>
                {/* Tier labels under bar */}
                <div className="relative h-4 mt-0.5">
                  {[95, 100, 105, 110].map(t => (
                    <span
                      key={t}
                      className="absolute text-[10px] text-[#3A4A5A] -translate-x-1/2"
                      style={{ left: `${(t / 115) * 100}%` }}
                    >
                      {t}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Next Tier Call to Action */}
              {nextTier && dollarToNext > 0 && (
                <div className="text-xs text-[#64748B] mt-2">
                  <span className={`font-semibold ${nextTier.color}`}>{formatCurrency(dollarToNext)}</span> more to reach {nextTier.label} (${nextTier.amount.toLocaleString()})
                </div>
              )}
              {!nextTier && tier?.label === 'Diamond' && (
                <div className="text-xs text-violet-400 mt-2 font-semibold">Diamond tier achieved — maximum bonus unlocked!</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
