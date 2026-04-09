import { formatCurrency, formatPct, getStatusHigh, getStatusLow, locationStatus, pctToGoal } from '@/lib/utils'
import { BENCHMARKS, LOCATIONS } from '@/lib/data'
import StatusBadge from './StatusBadge'
import OSBBadge from './OSBBadge'
import BenchmarkBar from './BenchmarkBar'

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

const MONTHLY_GOALS: Record<string, number> = {
  LKW: 120000,
  LT:  100000,
  HNR:  70000,
  HNS:  65000,
  PB:   80000,
  PR:   55000,
  OSB:  30000,
}

export default function LocationCard({ loc }: { loc: LocationData }) {
  const meta   = LOCATIONS.find(l => l.code === loc.code)
  const goal   = MONTHLY_GOALS[loc.code] ?? 100000
  const pct    = pctToGoal(loc.production, goal)
  const status = locationStatus(loc.status)

  const phoneStatus   = getStatusHigh(loc.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
  const recareStatus  = getStatusHigh(loc.recareRate, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow)
  const suppliesStatus = getStatusLow(loc.suppliesPct, BENCHMARKS.supplies_pct.target, BENCHMARKS.supplies_pct.flagAbove)

  const metricDot = (s: 'green' | 'amber' | 'red') => ({
    green: 'text-green-400',
    amber: 'text-amber-400',
    red:   'text-red-400',
  }[s])

  return (
    <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg overflow-hidden">
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
              <span className="bg-[#0A9E8A]/15 text-[#0A9E8A] text-xs font-bold px-2 py-0.5 rounded border border-[#0A9E8A]/20">
                {loc.code}
              </span>
              <StatusBadge status={status} dot />
            </div>
            <div className="text-[#F1F5F9] font-semibold mt-1">{meta?.name}</div>
            <div className="text-[#64748B] text-xs">{meta?.brand}</div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Production + Collections */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-[#64748B] text-xs mb-0.5">Production</div>
            <div className="text-[#F1F5F9] font-semibold text-sm">{formatCurrency(loc.production, true)}</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs mb-0.5">Collections</div>
            <div className="text-[#F1F5F9] font-semibold text-sm">{formatCurrency(loc.collections, true)}</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs mb-0.5">Coll. Rate</div>
            <div className={`font-semibold text-sm ${metricDot(getStatusHigh(loc.collectionRate, 98, 95))}`}>{formatPct(loc.collectionRate)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-[#64748B] text-xs mb-0.5">New Pts</div>
            <div className="text-[#F1F5F9] font-semibold text-sm">{loc.newPatients}</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs mb-0.5">Recare %</div>
            <div className={`font-semibold text-sm ${metricDot(recareStatus)}`}>{formatPct(loc.recareRate)}</div>
          </div>
          <div>
            <div className="text-[#64748B] text-xs mb-0.5">Phone Ans.</div>
            <div className={`font-semibold text-sm ${metricDot(phoneStatus)}`}>{formatPct(loc.phoneAnswerRate)}</div>
          </div>
        </div>

        {/* Production progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-[#64748B] mb-1">
            <span>vs. {formatCurrency(goal, true)} goal</span>
            <span className={status === 'green' ? 'text-green-400' : status === 'amber' ? 'text-amber-400' : 'text-red-400'}>{pct}%</span>
          </div>
          <div className="h-1.5 bg-[#1E2A3A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: pct >= 100 ? '#10B981' : pct >= 80 ? '#0A9E8A' : pct >= 60 ? '#F59E0B' : '#EF4444',
              }}
            />
          </div>
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
