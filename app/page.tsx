import { BENCHMARKS, MONTHLY_GOALS, PERIOD_INFO } from '@/lib/data'
import { getData, getPeriodInfo } from '@/lib/getData'
import { formatCurrency, formatPct, getStatusHigh, getStatusLow, locationStatus, pctToGoal } from '@/lib/utils'
import KPICard from '@/components/KPICard'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'
import GoalBar from '@/components/GoalBar'

export default async function OverviewPage() {
  const data        = await getData()
  const { org, locations } = data
  const prodPct     = pctToGoal(org.production, org.productionGoal)
  const collPct     = pctToGoal(org.collections, org.collectionsGoal)
  const phoneStatus = getStatusHigh(org.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
  const recareStatus = getStatusHigh(org.hygieneRecare, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">GreenSky Overview</h1>
          <p className="text-[#64748b] text-sm mt-1">{data.period} · All 7 locations</p>
        </div>
        <DaysLeft />
      </div>

      {/* Data Freshness Banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 mb-8">
        <span className="text-amber-500 text-xl">📅</span>
        <div>
          <span className="text-amber-800 font-bold text-base">Data as of {PERIOD_INFO.dataAsOf}</span>
          <span className="text-amber-700 text-sm ml-2">· Last manual upload</span>
        </div>
        <div className="ml-auto text-amber-600 text-xs font-medium bg-amber-100 border border-amber-200 rounded-full px-3 py-0.5">
          {PERIOD_INFO.daysComplete} of {PERIOD_INFO.totalBizDays} business days
        </div>
      </div>


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
        <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Location Scorecard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...locations].sort((a, b) => {
            const ga = MONTHLY_GOALS[a.code] ?? 100000
            const gb = MONTHLY_GOALS[b.code] ?? 100000
            return pctToGoal(b.collections, gb) - pctToGoal(a.collections, ga)
          }).map((loc, i) => {
            const goal     = MONTHLY_GOALS[loc.code] ?? 100000
            const pct      = pctToGoal(loc.collections, goal)
            const pacePct  = Math.round((PERIOD_INFO.daysComplete / PERIOD_INFO.totalBizDays) * 100)
            const ratio    = pct / pacePct
            const paceStatus = pct >= pacePct ? 'green' : ratio >= 0.92 ? 'amber' : ratio >= 0.78 ? 'orange' : 'red'
            const dotBg    = { green: 'bg-green-500', amber: 'bg-amber-500', orange: 'bg-orange-500', red: 'bg-red-500' }[paceStatus]
            const pctColor = { green: 'text-green-600', amber: 'text-amber-600', orange: 'text-orange-500', red: 'text-red-600' }[paceStatus]
            const rank = i + 1

            return (
              <div key={loc.code} className="bg-white border border-[#d1dce9] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748b] text-xs font-bold">#{rank}</span>
                    <span className="text-[#2563eb] font-bold text-sm">{loc.code}</span>
                    {loc.isOSB && <OSBBadge />}
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${dotBg}`} />
                </div>
                <div className="text-[#0f172a] font-semibold text-lg">{formatCurrency(loc.collections, true)}</div>
                <div className="text-[#64748b] text-xs mb-2">of {formatCurrency(goal, true)} goal</div>
                <GoalBar pct={pct} height="thin" />
                <div className={`text-xs mt-1 font-medium ${pctColor}`}>{pct}% to goal</div>
              </div>
            )
          })}

          {/* Org Total */}
          <div className="bg-[#eff6ff] border border-[#2563eb]/25 rounded-lg p-4">
            <div className="text-[#2563eb] font-bold text-sm mb-2">ORG TOTAL</div>
            <div className="text-[#0f172a] font-semibold text-lg">{formatCurrency(org.collections, true)}</div>
            <div className="text-[#64748b] text-xs mb-2">of {formatCurrency(org.collectionsGoal, true)} goal</div>
                <GoalBar pct={collPct} height="thin" color="#2563eb" />
            <div className="text-xs mt-1 font-medium text-[#2563eb]">{collPct}% to goal</div>
          </div>
        </div>
      </div>
    </div>
  )
}
