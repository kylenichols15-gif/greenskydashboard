import { BENCHMARKS, LOCATIONS, MONTHLY_GOALS } from '@/lib/data'
import { getData, getPeriodInfo } from '@/lib/getData'
import { formatCurrency, formatPct, getStatusHigh, getStatusLow, locationStatus, pctToGoal } from '@/lib/utils'
import KPICard from '@/components/KPICard'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'

type DashData = Awaited<ReturnType<typeof getData>>

function buildFlags(data: DashData) {
  const flags: { level: 'red' | 'amber'; msg: string }[] = []
  const { org, locations } = data

  if (org.phoneAnswerRate < BENCHMARKS.phone_answer_rate.flagBelow)
    flags.push({ level: 'red', msg: `Org phones ${org.phoneAnswerRate}% — below ${BENCHMARKS.phone_answer_rate.flagBelow}% threshold` })
  if (org.hygieneRecare < BENCHMARKS.hygiene_recare.flagBelow)
    flags.push({ level: 'red', msg: `Org recare ${org.hygieneRecare}% — below ${BENCHMARKS.hygiene_recare.flagBelow}% threshold` })

  for (const loc of locations) {
    if (loc.phoneAnswerRate < BENCHMARKS.phone_answer_rate.flagBelow)
      flags.push({ level: 'red', msg: `${loc.code} — Phone ${formatPct(loc.phoneAnswerRate)}` })
    else if (loc.phoneAnswerRate < BENCHMARKS.phone_answer_rate.target)
      flags.push({ level: 'amber', msg: `${loc.code} — Phone ${formatPct(loc.phoneAnswerRate)}` })

    if (loc.recareRate < BENCHMARKS.hygiene_recare.flagBelow)
      flags.push({ level: 'red', msg: `${loc.code} — Recare ${formatPct(loc.recareRate)}` })

    if (loc.suppliesPct > BENCHMARKS.supplies_pct.flagAbove)
      flags.push({ level: 'red', msg: `${loc.code} — Supplies ${loc.suppliesPct}%` })

    if (loc.collectionRate < BENCHMARKS.collections_rate.flagBelow)
      flags.push({ level: 'amber', msg: `${loc.code} — Coll. pace ${formatPct(loc.collectionRate)}` })
  }

  return flags.filter((f, i, arr) => arr.findIndex(x => x.msg === f.msg) === i)
}

export default async function OverviewPage() {
  const data        = await getData()
  const { org, locations } = data
  const prodPct     = pctToGoal(org.production, org.productionGoal)
  const collPct     = pctToGoal(org.collections, org.collectionsGoal)
  const phoneStatus = getStatusHigh(org.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
  const recareStatus = getStatusHigh(org.hygieneRecare, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow)
  const flags       = buildFlags(data)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[#F1F5F9] text-2xl font-bold">GreenSky Overview</h1>
          <p className="text-[#64748B] text-sm mt-1">{data.period} · All 7 locations</p>
        </div>
        <DaysLeft />
      </div>

      {/* Inline Flags */}
      {flags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider self-center">Flags</span>
          {flags.map((flag, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${
                flag.level === 'red'
                  ? 'bg-red-500/10 border-red-500/25 text-red-300'
                  : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
              }`}
            >
              {flag.level === 'red' ? '🔴' : '🟡'} {flag.msg}
            </span>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="MTD Gross Production"
          value={formatCurrency(org.production)}
          subValue={`Goal: ${formatCurrency(org.productionGoal)}`}
          progress={prodPct}
        />
        <KPICard
          label="MTD Collections"
          value={formatCurrency(org.collections)}
          subValue={`Goal: ${formatCurrency(org.collectionsGoal)}`}
          progress={collPct}
        />
        <KPICard
          label="New Patients"
          value={org.newPatients.toString()}
          subValue={`${org.activePatients.toLocaleString()} active`}
        />
        <KPICard
          label="Avg Supplies %"
          value={`${(locations.reduce((s,l) => s + l.suppliesPct, 0) / locations.length).toFixed(1)}%`}
          subValue="Target ≤5%"
          status={getStatusLow(
            locations.reduce((s,l) => s + l.suppliesPct, 0) / locations.length,
            BENCHMARKS.supplies_pct.target,
            BENCHMARKS.supplies_pct.flagAbove
          )}
          detail="Above target"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <KPICard
          label="Avg Phone Answer Rate"
          value={formatPct(org.phoneAnswerRate)}
          subValue={`Target: ${BENCHMARKS.phone_answer_rate.target}%`}
          status={phoneStatus}
          detail={phoneStatus === 'red' ? 'Below threshold' : phoneStatus === 'amber' ? 'Below target' : 'On target'}
        />
        <KPICard
          label="Hygiene Recare"
          value={formatPct(org.hygieneRecare)}
          subValue={`Target: ${BENCHMARKS.hygiene_recare.target}%`}
          status={recareStatus}
          detail={recareStatus === 'red' ? 'Below threshold' : recareStatus === 'amber' ? 'Below target' : 'On target'}
        />
      </div>

      {/* Location Gauge Grid */}
      <div>
        <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Location Scorecard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {locations.map((loc, i) => {
            const goal   = MONTHLY_GOALS[loc.code] ?? 100000
            const pct    = pctToGoal(loc.production, goal)
            const status = locationStatus(loc.status)
            const dotBg  = { green: 'bg-green-400', amber: 'bg-amber-400', red: 'bg-red-400' }[status]
            const barColor = pct >= 100 ? '#10B981' : pct >= 80 ? '#0A9E8A' : pct >= 60 ? '#F59E0B' : '#EF4444'
            const pctColor = { green: 'text-green-400', amber: 'text-amber-400', red: 'text-red-400' }[status]
            const rank = i + 1

            return (
              <div key={loc.code} className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B] text-xs font-bold">#{rank}</span>
                    <span className="text-[#0A9E8A] font-bold text-sm">{loc.code}</span>
                    {loc.isOSB && <OSBBadge />}
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${dotBg}`} />
                </div>
                <div className="text-[#F1F5F9] font-semibold text-lg">{formatCurrency(loc.production, true)}</div>
                <div className="text-[#64748B] text-xs mb-2">of {formatCurrency(goal, true)} goal</div>
                <div className="h-1.5 bg-[#1E2A3A] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }} />
                </div>
                <div className={`text-xs mt-1 font-medium ${pctColor}`}>{pct}% to goal</div>
              </div>
            )
          })}

          {/* Org Total */}
          <div className="bg-[#0D2B45] border border-[#0A9E8A]/25 rounded-lg p-4">
            <div className="text-[#0A9E8A] font-bold text-sm mb-2">ORG TOTAL</div>
            <div className="text-[#F1F5F9] font-semibold text-lg">{formatCurrency(org.production, true)}</div>
            <div className="text-[#64748B] text-xs mb-2">of {formatCurrency(org.productionGoal, true)} goal</div>
            <div className="h-1.5 bg-[#1E2A3A] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#0A9E8A]" style={{ width: `${Math.min(prodPct, 100)}%` }} />
            </div>
            <div className="text-xs mt-1 font-medium text-[#0A9E8A]">{prodPct}% to goal</div>
          </div>
        </div>
      </div>
    </div>
  )
}
