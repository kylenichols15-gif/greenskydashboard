import { LOCATIONS } from '@/lib/data'
import { getData, getPeriodInfo } from '@/lib/getData'
import { formatCurrency, formatPct } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'

const MONTHLY_GOALS: Record<string, number> = {
  LKW: 120000, LT: 100000, HNR: 70000, HNS: 65000, PB: 80000, PR: 55000, OSB: 30000,
}

// T1=95%, T2(Bonus)=100%, T3=106%, T4=112%, T5=118%
const TIERS = [
  { label: 'Silver',   tag:'T1', pct: 95,  color: 'text-slate-300',   bg: 'bg-slate-500/10  border-slate-400/20',  amount: 500  },
  { label: 'Bonus',    tag:'T2', pct: 100, color: 'text-[#F59E0B]',   bg: 'bg-[#F59E0B]/10  border-[#F59E0B]/25',  amount: 1000, isTarget: true },
  { label: 'Gold',     tag:'T3', pct: 106, color: 'text-yellow-300',  bg: 'bg-yellow-500/10 border-yellow-500/20', amount: 1500 },
  { label: 'Sapphire', tag:'T4', pct: 112, color: 'text-cyan-300',    bg: 'bg-cyan-500/10   border-cyan-500/20',   amount: 1750 },
  { label: 'Diamond',  tag:'T5', pct: 118, color: 'text-violet-300',  bg: 'bg-violet-500/10 border-violet-500/20', amount: 2000 },
]

function getCurrentTier(pct: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (pct >= TIERS[i].pct) return TIERS[i]
  }
  return null
}
function getNextTier(pct: number) {
  return TIERS.find(t => pct < t.pct) ?? null
}

export default async function BonusPage() {
  const [data, PERIOD_INFO] = await Promise.all([getData(), getPeriodInfo()])
  const { locations } = data
  const orgTotal = locations.reduce((s, l) => s + l.collections, 0)
  const orgGoal  = Object.values(MONTHLY_GOALS).reduce((s, g) => s + g, 0)
  const orgPct   = (orgTotal / orgGoal) * 100
  const orgTier  = getCurrentTier(orgPct)
  const orgNext  = getNextTier(orgPct)
  const orgDollarToNext = orgNext ? Math.max(0, (orgNext.pct / 100) * orgGoal - orgTotal) : 0
  const orgPerDay = PERIOD_INFO.daysRemaining > 0 ? orgDollarToNext / PERIOD_INFO.daysRemaining : 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#0D2B45] border border-[#0A9E8A]/20 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💰</span>
              <h1 className="text-[#F1F5F9] text-2xl font-bold">April Bonus Race</h1>
            </div>
            <p className="text-[#94A3B8] text-sm">Hit your collection goal and the whole team gets paid. Every dollar counts!</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-[#64748B]">
              <span>Day {PERIOD_INFO.daysComplete} of {PERIOD_INFO.totalBizDays}</span>
              <div className="flex-1 max-w-[200px] h-1.5 bg-[#1E2A3A] rounded-full overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${(PERIOD_INFO.daysComplete / PERIOD_INFO.totalBizDays) * 100}%` }} />
              </div>
              <span>{Math.round((PERIOD_INFO.daysComplete / PERIOD_INFO.totalBizDays) * 100)}%</span>
            </div>
          </div>
          <DaysLeft />
        </div>
      </div>

      {/* Tier Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {TIERS.map(tier => (
          <div key={tier.label} className={`rounded-xl border px-4 py-3 text-center relative ${tier.bg} ${tier.isTarget ? 'ring-1 ring-[#F59E0B]/40' : ''}`}>
            {tier.isTarget && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0A0F1E] text-[10px] font-bold px-2 py-0.5 rounded-full">THE TARGET</div>
            )}
            <div className={`font-bold text-sm ${tier.color}`}>{tier.tag} — {tier.label}</div>
            <div className={`text-xs mt-0.5 opacity-70 ${tier.color}`}>{tier.pct}% of Goal</div>
            <div className={`font-bold text-lg mt-1 ${tier.color}`}>${tier.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Org Total */}
      <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">Organization Total</div>
          <div className={`text-2xl font-bold ${orgTier ? orgTier.color : 'text-red-400'}`}>
            {formatPct(orgPct, 1)} of Goal
          </div>
        </div>

        <div className="relative h-5 bg-[#1E2A3A] rounded-full overflow-hidden mb-1">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min((orgPct / 120) * 100, 100)}%`,
              backgroundColor: orgPct >= 118 ? '#8B5CF6' : orgPct >= 112 ? '#06B6D4' : orgPct >= 106 ? '#EAB308' : orgPct >= 100 ? '#F59E0B' : orgPct >= 95 ? '#94A3B8' : '#EF4444',
            }}
          />
          {TIERS.map(t => (
            <div key={t.tag} className="absolute top-0 h-full w-px bg-[#0A0F1E]/50" style={{ left: `${(t.pct / 120) * 100}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[#3A4A5A] mb-3">
          {TIERS.map(t => (
            <span key={t.tag} style={{ marginLeft: `${(t.pct / 120) * 100 - 4}%` }}>{t.pct}%</span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-[#64748B] text-xs">Collected</div>
            <div className="text-[#F1F5F9] font-bold">{formatCurrency(orgTotal)}</div>
            <div className="text-[#64748B] text-xs">7 locations</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs">Goal (T2 Bonus)</div>
            <div className="text-[#F1F5F9] font-bold">{formatCurrency(orgGoal)}</div>
            <div className="text-[#64748B] text-xs">100% = bonus for all</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs">Bridge to Bonus</div>
            <div className="text-red-400 font-bold">{formatCurrency(Math.max(0, orgGoal - orgTotal), true)}</div>
            <div className="text-[#64748B] text-xs">needed to hit T2</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs">Projected Pace</div>
            <div className="text-[#F1F5F9] font-bold">{formatPct(orgPct / (PERIOD_INFO.daysComplete / PERIOD_INFO.totalBizDays) * 0.87, 0)}</div>
            <div className="text-[#64748B] text-xs">if pace holds</div>
          </div>
        </div>
      </div>

      {/* Motivational callout */}
      <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl p-4 mb-8 text-center">
        <div className="text-[#F59E0B] font-bold text-lg mb-1">
          💪 The race is ON! {PERIOD_INFO.daysRemaining} days to close the gap and earn that bonus!
        </div>
        {orgNext && orgPerDay > 0 && (
          <div className="text-[#94A3B8] text-sm">
            We need <strong className="text-[#F59E0B]">{formatCurrency(orgPerDay, true)}/day</strong> org-wide to reach {orgNext.label}.
            Schedule, collect, follow up — let's make it happen!
          </div>
        )}
      </div>

      {/* Per-location */}
      <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Location Breakdown</h2>
      <div className="flex flex-col gap-3">
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
          const perDay = PERIOD_INFO.daysRemaining > 0 ? dollarToNext / PERIOD_INFO.daysRemaining : 0
          const barWidth = Math.min((pct / 120) * 100, 100)
          const barColor = pct >= 118 ? '#8B5CF6' : pct >= 112 ? '#06B6D4' : pct >= 106 ? '#EAB308' : pct >= 100 ? '#F59E0B' : pct >= 95 ? '#94A3B8' : pct >= 70 ? '#F59E0B' : '#EF4444'

          return (
            <div key={loc.code} className="bg-[#0D1629] border border-[#1E2A3A] rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#64748B] text-sm font-bold">#{i + 1}</span>
                  <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-sm font-bold px-3 py-1 rounded border border-[#0A9E8A]/20">{loc.code}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#F1F5F9] font-semibold">{meta?.name}</span>
                      {loc.isOSB && <OSBBadge />}
                    </div>
                    <div className="text-[#64748B] text-xs">{meta?.brand}</div>
                  </div>
                </div>
                {tier ? (
                  <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${tier.color} ${tier.bg}`}>
                    {tier.tag} — {tier.label} · ${tier.amount.toLocaleString()}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg border text-sm font-medium text-red-400 bg-red-500/10 border-red-500/20">
                    No Bonus Yet
                  </span>
                )}
              </div>

              {/* Bar */}
              <div className="mb-1">
                <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
                  <span>{formatCurrency(loc.collections)} collected</span>
                  <span className="font-semibold" style={{ color: barColor }}>{formatPct(pct, 1)} of {formatCurrency(goal, true)} goal</span>
                </div>
                <div className="relative h-4 bg-[#1E2A3A] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
                  {TIERS.map(t => (
                    <div key={t.tag} className="absolute top-0 h-full w-px bg-[#0A0F1E]/60" style={{ left: `${(t.pct / 120) * 100}%` }} />
                  ))}
                </div>
              </div>

              {/* Bridge to bonus */}
              {next && dollarToNext > 0 && (
                <div className="mt-3 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[#F59E0B] font-semibold">💰 Unlock {next.label}</span>
                    <span className="text-[#94A3B8] text-sm"> — Collect {formatCurrency(dollarToNext, true)} more</span>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-[#94A3B8]">That's </span>
                    <span className="text-[#F59E0B] font-semibold">{formatCurrency(perDay, true)}/day</span>
                    <span className="text-[#94A3B8]"> for {PERIOD_INFO.daysRemaining} days</span>
                  </div>
                </div>
              )}
              {!next && tier?.tag === 'T5' && (
                <div className="mt-3 text-violet-400 text-sm font-semibold text-center">💎 Diamond tier achieved — maximum bonus unlocked!</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
