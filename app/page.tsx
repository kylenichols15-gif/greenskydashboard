import { DEMO_DATA, BENCHMARKS, LOCATIONS } from '@/lib/data'
import { formatCurrency, formatPct, getStatusHigh, locationStatus, pctToGoal } from '@/lib/utils'
import KPICard from '@/components/KPICard'
import StatusBadge from '@/components/StatusBadge'
import OSBBadge from '@/components/OSBBadge'

const MONTHLY_GOALS: Record<string, number> = {
  LKW: 120000, LT: 100000, HNR: 70000, HNS: 65000, PB: 80000, PR: 55000, OSB: 30000,
}

function buildFlags() {
  const flags: { level: 'red' | 'amber'; msg: string }[] = []
  const { org, locations, phones } = DEMO_DATA

  if (org.phoneAnswerRate < BENCHMARKS.phone_answer_rate.flagBelow) {
    const missedRev = phones.reduce((s, p) => s + p.estMissedRevenue, 0)
    flags.push({ level: 'red', msg: `Org phone answer rate ${org.phoneAnswerRate}% — below ${BENCHMARKS.phone_answer_rate.flagBelow}% threshold. Est. ${formatCurrency(missedRev, true)} monthly revenue at risk.` })
  }
  if (org.hygieneRecare < BENCHMARKS.hygiene_recare.flagBelow) {
    flags.push({ level: 'red', msg: `Org hygiene recare ${org.hygieneRecare}% — below ${BENCHMARKS.hygiene_recare.flagBelow}% threshold. Target is ${BENCHMARKS.hygiene_recare.target}%.` })
  }

  for (const loc of locations) {
    if (loc.phoneAnswerRate < BENCHMARKS.phone_answer_rate.flagBelow) {
      const ph = phones.find(p => p.code === loc.code)
      flags.push({ level: 'red', msg: `${loc.code} phone answer rate ${loc.phoneAnswerRate}% — below ${BENCHMARKS.phone_answer_rate.flagBelow}% threshold. Est. ${formatCurrency(ph?.estMissedRevenue ?? 0, true)}/mo revenue at risk.` })
    } else if (loc.phoneAnswerRate < BENCHMARKS.phone_answer_rate.target) {
      flags.push({ level: 'amber', msg: `${loc.code} phone answer rate ${loc.phoneAnswerRate}% — below ${BENCHMARKS.phone_answer_rate.target}% target.` })
    }
    if (loc.recareRate < BENCHMARKS.hygiene_recare.flagBelow) {
      flags.push({ level: 'red', msg: `${loc.code} hygiene recare ${loc.recareRate}% — below ${BENCHMARKS.hygiene_recare.flagBelow}% threshold.` })
    }
    if (loc.suppliesPct > BENCHMARKS.supplies_pct.flagAbove) {
      flags.push({ level: 'red', msg: `${loc.code} supplies at ${loc.suppliesPct}% — above ${BENCHMARKS.supplies_pct.flagAbove}% flag threshold.` })
    }
  }

  // de-dupe
  return flags.filter((f, i, arr) => arr.findIndex(x => x.msg === f.msg) === i)
}

export default function OverviewPage() {
  const { org, locations } = DEMO_DATA
  const prodPct    = pctToGoal(org.production, org.productionGoal)
  const collPct    = pctToGoal(org.collections, org.collectionsGoal)
  const phoneStatus = getStatusHigh(org.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
  const flags       = buildFlags()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#F1F5F9] text-2xl font-bold">Overview</h1>
        <p className="text-[#64748B] text-sm mt-1">April 2026 · All 7 locations · Demo Data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="MTD Production"
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
          subValue={`${org.activePatients.toLocaleString()} active patients`}
        />
        <KPICard
          label="Phone Answer Rate"
          value={formatPct(org.phoneAnswerRate)}
          subValue={`Target: ${BENCHMARKS.phone_answer_rate.target}%`}
          status={phoneStatus}
          detail={phoneStatus === 'red' ? 'Below threshold' : phoneStatus === 'amber' ? 'Below target' : 'On target'}
        />
      </div>

      {/* Location Gauge Grid */}
      <div className="mb-8">
        <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Location Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {locations.map(loc => {
            const goal   = MONTHLY_GOALS[loc.code] ?? 100000
            const pct    = pctToGoal(loc.production, goal)
            const status = locationStatus(loc.status)
            const dotBg  = { green: 'bg-green-400', amber: 'bg-amber-400', red: 'bg-red-400' }[status]
            const barColor = pct >= 100 ? '#10B981' : pct >= 80 ? '#0A9E8A' : pct >= 60 ? '#F59E0B' : '#EF4444'
            const pctColor = { green: 'text-green-400', amber: 'text-amber-400', red: 'text-red-400' }[status]

            return (
              <div key={loc.code} className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
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

      {/* Flag Bar */}
      {flags.length > 0 && (
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-5">
          <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-3">Active Flags</h2>
          <div className="flex flex-col gap-2">
            {flags.map((flag, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg border ${
                  flag.level === 'red'
                    ? 'bg-red-500/8 border-red-500/20 text-red-300'
                    : 'bg-amber-500/8 border-amber-500/20 text-amber-300'
                }`}
              >
                <span className="shrink-0 mt-0.5">{flag.level === 'red' ? '🔴' : '🟡'}</span>
                <span>{flag.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
