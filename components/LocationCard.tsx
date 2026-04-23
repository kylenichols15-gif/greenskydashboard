import { formatCurrency, formatPct, getStatusHigh, getStatusLow, collectionsVsPaceStatus, pctToGoal } from '@/lib/utils'
import { BENCHMARKS, LOCATIONS, MONTHLY_GOALS, PERIOD_INFO } from '@/lib/data'
import StatusBadge from './StatusBadge'
import OSBBadge from './OSBBadge'
import BenchmarkBar from './BenchmarkBar'
import GoalBar from './GoalBar'

interface LocationData {
  code: string
  production: number
  collections: number
  collectionRate: number
  newPatients: number
  recareRate: number
  phoneAnswerRate: number
  activePatients: number
  suppliesPct: number
  status: string
  isOSB?: boolean
}

export default function LocationCard({ loc }: { loc: LocationData }) {
  const meta   = LOCATIONS.find(l => l.code === loc.code)
  const goal   = MONTHLY_GOALS[loc.code] ?? 100000
  const pct    = pctToGoal(loc.production, goal)

  // Status driven by collections vs. pace — not the manual status string in data.ts
  const status = collectionsVsPaceStatus(
    loc.collections,
    goal,
    PERIOD_INFO.daysComplete,
    PERIOD_INFO.totalBizDays,
  )

  const phoneStatus    = getStatusHigh(loc.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
  const hasRecare      = loc.recareRate > 0
  const recareStatus   = hasRecare ? getStatusHigh(loc.recareRate, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow) : 'amber'
  const suppliesStatus = getStatusLow(loc.suppliesPct, BENCHMARKS.supplies_pct.target, BENCHMARKS.supplies_pct.flagAbove)

  const metricDot = (s: 'green' | 'amber' | 'red') => ({
    green: 'text-green-400',
    amber: 'text-amber-400',
    red:   'text-red-400',
  }[s])

  return (
    <div className="bg-white border border-[#d1dce9] rounded-lg overflow-hidden">
      {loc.isOSB && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center gap-2">
          <OSBBadge />
          <span className="text-amber-400/70 text-xs">Manual source — not from Dentrix Ascend</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="bg-[#2563eb]/15 text-[#2563eb] text-xs font-bold px-2 py-0.5 rounded border border-[#2563eb]/20">
                {loc.code}
              </span>
              <StatusBadge status={status} dot />
            </div>
            <div className="text-[#0f172a] font-semibold mt-1">{meta?.name}</div>
            <div className="text-[#64748b] text-xs">{meta?.brand}</div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Production + Collections */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-[#64748b] text-xs mb-0.5">Production</div>
            <div className="text-[#0f172a] font-semibold text-sm">{formatCurrency(loc.production, true)}</div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs mb-0.5">Collections</div>
            <div className="text-[#0f172a] font-semibold text-sm">{formatCurrency(loc.collections, true)}</div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs mb-0.5">Coll. Rate</div>
            <div className={`font-semibold text-sm ${metricDot(getStatusHigh(loc.collectionRate, 98, 95))}`}>{formatPct(loc.collectionRate)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-[#64748b] text-xs mb-0.5">New Pts</div>
            <div className="text-[#0f172a] font-semibold text-sm">{loc.newPatients}</div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs mb-0.5">Recare %</div>
            <div className={`font-semibold text-sm ${hasRecare ? metricDot(recareStatus) : 'text-[#94a3b8]'}`}>
              {hasRecare ? formatPct(loc.recareRate) : '—'}
            </div>
          </div>
          <div>
            <div className="text-[#64748b] text-xs mb-0.5">Phone Ans.</div>
            <div className={`font-semibold text-sm ${metricDot(phoneStatus)}`}>{formatPct(loc.phoneAnswerRate)}</div>
          </div>
        </div>

        {/* Production progress bar (vs collections goal) */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-[#64748b] mb-1">
            <span>vs. {formatCurrency(goal, true)} goal</span>
            <span className={status === 'green' ? 'text-green-400' : status === 'amber' ? 'text-amber-400' : 'text-red-400'}>{pct}%</span>
          </div>
          <GoalBar pct={pct} height="thin" />
        </div>

        {/* Supplies */}
        <BenchmarkBar
          value={loc.suppliesPct}
          target={BENCHMARKS.supplies_pct.target}
          flagThreshold={BENCHMARKS.supplies_pct.flagAbove}
          direction="low"
          label="Supplies %"
          status={suppliesStatus}
        />
      </div>
    </div>
  )
}
