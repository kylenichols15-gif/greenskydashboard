import { LOCATIONS, MONTHLY_GOALS, PERIOD_INFO } from '@/lib/data'
import { getData, getPeriodInfo } from '@/lib/getData'
import { formatCurrency, formatPct } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'

// T1=95%, T2(Bonus)=100%, T3=106%, T4=112%, T5=118%
const TIERS = [
  { label: 'Silver',   tag:'T1', pct: 95,  color: 'text-slate-500',  bg: 'bg-slate-100  border-slate-300',  barColor: '#94A3B8', amount: 500  },
  { label: 'Bonus',    tag:'T2', pct: 100, color: 'text-amber-600',  bg: 'bg-amber-50   border-amber-300',  barColor: '#F59E0B', amount: 1000, isTarget: true },
  { label: 'Gold',     tag:'T3', pct: 106, color: 'text-yellow-600', bg: 'bg-yellow-50  border-yellow-300', barColor: '#EAB308', amount: 1500 },
  { label: 'Sapphire', tag:'T4', pct: 112, color: 'text-cyan-600',   bg: 'bg-cyan-50    border-cyan-300',   barColor: '#06B6D4', amount: 1750 },
  { label: 'Diamond',  tag:'T5', pct: 118, color: 'text-violet-600', bg: 'bg-violet-50  border-violet-300', barColor: '#8B5CF6', amount: 2000 },
]

const BAR_MAX = 120

function getCurrentTier(pct: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (pct >= TIERS[i].pct) return TIERS[i]
  }
  return null
}
function getNextTier(pct: number) {
  return TIERS.find(t => pct < t.pct) ?? null
}

// Pace-relative fill color: green when on/ahead of pace, amber when close,
// red only when significantly behind. Tier colors lock in once a tier is reached.
function barFillColor(pct: number, pacePct: number) {
  if (pct >= 118) return '#8B5CF6'
  if (pct >= 112) return '#06B6D4'
  if (pct >= 106) return '#EAB308'
  if (pct >= 100) return '#F59E0B'
  if (pct >= 95)  return '#94A3B8'
  // Below T1 — reflect pace performance
  if (pct >= pacePct)            return '#10B981'  // at or ahead of pace
  const ratio = pct / pacePct
  if (ratio >= 0.85)             return '#F59E0B'  // within 15% of pace
  return '#EF4444'                                  // significantly behind
}

// Text color matching the fill color logic
function paceTextColor(pct: number, pacePct: number) {
  if (pct >= 118) return 'text-violet-600'
  if (pct >= 112) return 'text-cyan-600'
  if (pct >= 106) return 'text-yellow-600'
  if (pct >= 100) return 'text-amber-600'
  if (pct >= 95)  return 'text-slate-500'
  if (pct >= pacePct) return 'text-green-600'
  const ratio = pct / pacePct
  if (ratio >= 0.85) return 'text-amber-600'
  return 'text-red-600'
}

export default async function BonusPage() {
  const [data, periodInfo] = await Promise.all([getData(), getPeriodInfo()])
  const { locations } = data
  const { daysComplete, totalBizDays, daysRemaining } = periodInfo
  const dataAsOf = (periodInfo as any).dataAsOf ?? `Day ${daysComplete}`

  const pacePct = (daysComplete / totalBizDays) * 100   // e.g. 63.6%

  const orgTotal = locations.reduce((s, l) => s + l.collections, 0)
  const orgGoal  = Object.values(MONTHLY_GOALS).reduce((s, g) => s + g, 0)
  const orgPct   = (orgTotal / orgGoal) * 100
  const orgTier  = getCurrentTier(orgPct)
  const orgNext  = getNextTier(orgPct)
  const orgDollarToNext = orgNext ? Math.max(0, (orgNext.pct / 100) * orgGoal - orgTotal) : 0
  const orgPerDay = daysRemaining > 0 ? orgDollarToNext / daysRemaining : 0

  // Org projected final % (straight-line from current pace)
  const orgProjectedPct = daysComplete > 0 ? (orgTotal / daysComplete) * totalBizDays / orgGoal * 100 : orgPct
  const orgProjectedTier = getCurrentTier(orgProjectedPct)

  // Pace marker position on 0–120 bar scale
  const paceBarLeft = Math.min((pacePct / BAR_MAX) * 100, 99)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💰</span>
              <h1 className="text-[#0f172a] text-2xl font-bold">April Bonus Race</h1>
            </div>
            <p className="text-[#64748b] text-sm">Hit your collection goal and the whole team gets paid. Every dollar counts!</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748b]">
              <span>Day {daysComplete} of {totalBizDays}</span>
              <div className="w-32 h-1.5 bg-[#f1f5fb] rounded-full overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pacePct}%` }} />
              </div>
              <span>{Math.round(pacePct)}%</span>
              <span className="text-[#94a3b8]">·</span>
              <span className="text-[#94a3b8] text-xs">Data as of {dataAsOf}</span>
            </div>
          </div>
          <DaysLeft />
        </div>
      </div>

      {/* Tier Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {TIERS.map(tier => (
          <div key={tier.label} className={`rounded-xl border px-4 py-3 text-center relative ${tier.bg} ${tier.isTarget ? 'ring-1 ring-amber-400/40' : ''}`}>
            {tier.isTarget && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">THE TARGET</div>
            )}
            <div className={`font-bold text-sm ${tier.color}`}>{tier.tag} — {tier.label}</div>
            <div className={`text-xs mt-0.5 opacity-70 ${tier.color}`}>{tier.pct}% of Goal</div>
            <div className={`font-bold text-lg mt-1 ${tier.color}`}>{tier.pct}%</div>
          </div>
        ))}
      </div>

      {/* Org Total */}
      <div className="bg-white border border-[#d1dce9] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">Organization Total</div>
          <div className={`text-2xl font-bold ${paceTextColor(orgPct, pacePct)}`}>
            {formatPct(orgPct, 1)} of Goal
          </div>
        </div>
        {/* Projected tier callout */}
        <div className="flex items-center gap-2 mb-3">
          {orgProjectedTier ? (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${orgProjectedTier.bg} ${orgProjectedTier.color}`}>
              On pace for {orgProjectedTier.tag} — {orgProjectedTier.label} ({formatPct(orgProjectedPct, 0)} projected)
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-red-50 border-red-200 text-red-600">
              Projected {formatPct(orgProjectedPct, 0)} — no tier at current pace
            </span>
          )}
        </div>

        {/* Bar with pace marker */}
        <div className="relative" style={{ paddingTop: 14 }}>
          <div className="absolute top-0 flex flex-col items-center" style={{ left: `${paceBarLeft}%`, transform: 'translateX(-50%)' }}>
            <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 leading-none whitespace-nowrap">pace</span>
            <div style={{ width:0, height:0, borderLeft:'3.5px solid transparent', borderRight:'3.5px solid transparent', borderTop:'4px solid #94a3b8', marginTop:1 }} />
          </div>
          <div className="relative h-5 bg-[#f1f5fb] rounded-full overflow-hidden mb-1">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((orgPct / BAR_MAX) * 100, 100)}%`, backgroundColor: barFillColor(orgPct, pacePct) }} />
            {TIERS.map(t => (
              <div key={t.tag} className="absolute top-0 h-full w-px bg-[#cbd5e1]" style={{ left: `${(t.pct / BAR_MAX) * 100}%` }} />
            ))}
            <div className="absolute top-0 h-full w-0.5 bg-white/80" style={{ left: `${paceBarLeft}%`, transform: 'translateX(-50%)', zIndex:10, boxShadow:'0 0 2px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
        <div className="flex text-[10px] text-[#94a3b8] mb-4 relative h-4">
          {TIERS.map(t => (
            <span key={t.tag} className="absolute" style={{ left: `${(t.pct / BAR_MAX) * 100}%`, transform: 'translateX(-50%)' }}>{t.pct}%</span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-[#64748b] text-xs">Collected</div>
            <div className="text-[#0f172a] font-bold">{formatCurrency(orgTotal)}</div>
            <div className="text-[#64748b] text-xs">7 locations</div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs">Goal (T2 Bonus)</div>
            <div className="text-[#0f172a] font-bold">{formatCurrency(orgGoal)}</div>
            <div className="text-[#64748b] text-xs">100% = bonus for all</div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs">Bridge to Bonus</div>
            <div className="text-red-600 font-bold">{formatCurrency(Math.max(0, orgGoal - orgTotal), true)}</div>
            <div className="text-[#64748b] text-xs">needed to hit T2</div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs">Projected Final</div>
            <div className={`font-bold ${paceTextColor(orgProjectedPct, 100)}`}>{formatPct(orgProjectedPct, 0)}</div>
            <div className="text-[#64748b] text-xs">if pace holds</div>
          </div>
        </div>
      </div>

      {/* Motivational callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
        <div className="text-amber-600 font-bold text-lg mb-1">
          💪 The race is ON! {daysRemaining} days to close the gap and earn that bonus!
        </div>
        {orgNext && orgPerDay > 0 && (
          <div className="text-[#475569] text-sm">
            We need <strong className="text-amber-600">{formatCurrency(orgPerDay, true)}/day</strong> org-wide to reach {orgNext.label}.
            Schedule, collect, follow up — let's make it happen!
          </div>
        )}
      </div>

      {/* Per-location */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Location Breakdown</h2>
      <div className="flex flex-col gap-4">
        {[...locations].sort((a, b) => {
          const pctA = (a.collections / (MONTHLY_GOALS[a.code] ?? 100000)) * 100
          const pctB = (b.collections / (MONTHLY_GOALS[b.code] ?? 100000)) * 100
          return pctB - pctA
        }).map((loc, i) => {
          const meta  = LOCATIONS.find(l => l.code === loc.code)
          const goal  = MONTHLY_GOALS[loc.code] ?? 100000
          const pct   = (loc.collections / goal) * 100
          const tier  = getCurrentTier(pct)
          const next  = getNextTier(pct)
          const dollarToNext = next ? Math.max(0, (next.pct / 100) * goal - loc.collections) : 0
          const perDay = daysRemaining > 0 ? dollarToNext / daysRemaining : 0
          const barWidth = Math.min((pct / BAR_MAX) * 100, 100)
          const fill = barFillColor(pct, pacePct)

          // Projected final % at current daily pace
          const projectedPct = daysComplete > 0 ? (loc.collections / daysComplete) * totalBizDays / goal * 100 : pct
          const projectedTier = getCurrentTier(projectedPct)

          // Status badge: show current tier if reached, projected tier if on pace, or warning if behind
          const ratio = pct / pacePct
          const aheadOfPace = pct >= pacePct

          return (
            <div key={loc.code} className="bg-white border border-[#d1dce9] rounded-xl p-5">
              {/* Location header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#64748b] text-sm font-bold">#{i + 1}</span>
                  <span className="bg-[#2563eb]/10 text-[#2563eb] text-sm font-bold px-3 py-1 rounded border border-[#2563eb]/20">{loc.code}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#0f172a] font-semibold">{meta?.name}</span>
                      {loc.isOSB && <OSBBadge />}
                    </div>
                    <div className="text-[#64748b] text-xs">{meta?.brand}</div>
                  </div>
                </div>

                {/* Status badge — current tier if reached, projected tier if ahead of pace, warning if behind */}
                {tier ? (
                  <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${tier.color} ${tier.bg}`}>
                    {tier.tag} — {tier.label} ✓
                  </span>
                ) : projectedTier && aheadOfPace ? (
                  <span className={`px-3 py-1 rounded-lg border text-sm font-semibold ${projectedTier.color} ${projectedTier.bg}`}>
                    On Pace → {projectedTier.tag} {projectedTier.label}
                  </span>
                ) : projectedTier && ratio >= 0.85 ? (
                  <span className={`px-3 py-1 rounded-lg border text-sm font-semibold text-amber-600 bg-amber-50 border-amber-300`}>
                    Close → {projectedTier.tag} {projectedTier.label} projected
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg border text-sm font-medium text-red-600 bg-red-50 border-red-200">
                    Behind Pace
                  </span>
                )}
              </div>

              {/* Progress bar with tier markers + pace indicator */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-[#64748b] mb-1.5">
                  <span>{formatCurrency(loc.collections)} collected · <span className="font-medium">projected {formatPct(projectedPct, 0)}</span></span>
                  <span className="font-semibold" style={{ color: fill }}>{formatPct(pct, 1)} of {formatCurrency(goal, true)} goal</span>
                </div>
                <div className="relative" style={{ paddingTop: 14 }}>
                  <div className="absolute top-0 flex flex-col items-center" style={{ left: `${paceBarLeft}%`, transform: 'translateX(-50%)' }}>
                    <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 leading-none whitespace-nowrap">pace</span>
                    <div style={{ width:0, height:0, borderLeft:'3.5px solid transparent', borderRight:'3.5px solid transparent', borderTop:'4px solid #94a3b8', marginTop:1 }} />
                  </div>
                  <div className="relative h-4 bg-[#f1f5fb] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: fill }} />
                    {TIERS.map(t => (
                      <div key={t.tag} className="absolute top-0 h-full w-px bg-[#cbd5e1]" style={{ left: `${(t.pct / BAR_MAX) * 100}%` }} />
                    ))}
                    <div className="absolute top-0 h-full w-0.5 bg-white/80" style={{ left: `${paceBarLeft}%`, transform: 'translateX(-50%)', zIndex:10, boxShadow:'0 0 2px rgba(0,0,0,0.3)' }} />
                  </div>
                </div>
              </div>

              {/* Tier milestone row */}
              <div className="grid grid-cols-5 gap-1 mb-3">
                {TIERS.map(t => {
                  const dollarAtTier = (t.pct / 100) * goal
                  const reached    = pct >= t.pct
                  const isNext     = !reached && t === next
                  const isProjected = !reached && projectedTier?.tag === t.tag
                  return (
                    <div
                      key={t.tag}
                      className={`rounded-lg border px-2 py-1.5 text-center text-xs transition-all ${
                        reached
                          ? `${t.bg} ${t.color} border-current font-semibold`
                          : isProjected && aheadOfPace
                          ? `${t.bg} ${t.color} border-current font-semibold ring-1 ring-current opacity-70`
                          : isNext
                          ? 'bg-amber-50 border-amber-300 text-amber-600 font-semibold ring-1 ring-amber-300'
                          : 'bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]'
                      }`}
                    >
                      <div className="font-bold">{t.tag}</div>
                      <div className="text-[10px] leading-tight">{formatCurrency(dollarAtTier, true)}</div>
                      {reached && <div className="text-[10px] mt-0.5">✓</div>}
                      {!reached && isProjected && aheadOfPace && <div className="text-[10px] mt-0.5">→ pace</div>}
                      {isNext && !isProjected && <div className="text-[10px] mt-0.5">← next</div>}
                    </div>
                  )
                })}
              </div>

              {/* Bridge callout */}
              {next && dollarToNext > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-amber-600 font-semibold">💰 Unlock {next.label}</span>
                    <span className="text-[#64748b] text-sm"> — Collect {formatCurrency(dollarToNext, true)} more</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-[#64748b]">That's </span>
                    <span className="text-amber-600 font-semibold">{formatCurrency(perDay, true)}/day</span>
                    <span className="text-[#64748b]"> for {daysRemaining} days</span>
                  </div>
                </div>
              )}
              {!next && tier?.tag === 'T5' && (
                <div className="mt-2 text-violet-600 text-sm font-semibold text-center">💎 Diamond tier achieved — maximum bonus unlocked!</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
