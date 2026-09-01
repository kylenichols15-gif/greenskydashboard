'use client'

import { BENCHMARKS, MONTHLY_GOALS } from '@/lib/data'
import { useMonth } from '@/lib/contexts/MonthContext'
import { formatCurrency, formatPct, getStatusHigh, getStatusLow, collectionsVsPaceStatus, pctToGoal } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'
import GoalBar from '@/components/GoalBar'
import type { DashboardData, PeriodData } from '@/lib/types'

type StatusColor = 'green' | 'amber' | 'red'

const FILL_COLOR: Record<StatusColor, string> = {
  green: '#10B981',
  amber: '#F59E0B',
  red:   '#EF4444',
}

const STATUS_PILL: Record<StatusColor, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red:   'bg-red-100 text-red-700',
}

const STATUS_VALUE: Record<StatusColor, string> = {
  green: 'text-green-600',
  amber: 'text-amber-600',
  red:   'text-red-500',
}

const STATUS_BORDER_T: Record<StatusColor, string> = {
  green: 'border-t-green-500',
  amber: 'border-t-amber-500',
  red:   'border-t-red-500',
}

// ── Hero bar ── tall bar with % label inside, arbitrary target/pace line ──────
function HeroBar({
  pct,
  status,
  markerPct,
  markerLabel = 'pace',
}: {
  pct:          number
  status:       StatusColor
  markerPct:    number
  markerLabel?: string
}) {
  const fillWidth  = Math.min(pct, 100)
  const markerLeft = Math.min(markerPct, 99)
  const markerColor = fillWidth >= markerLeft ? 'rgba(255,255,255,0.8)' : '#94a3b8'
  const labelInside = fillWidth > 18

  return (
    <div className="relative" style={{ paddingTop: 20 }}>
      {/* Marker label + caret */}
      <div
        className="absolute top-0 flex flex-col items-center"
        style={{ left: `${markerLeft}%`, transform: 'translateX(-50%)' }}
      >
        <span className="text-[9px] font-bold uppercase tracking-wide text-[#94a3b8] leading-none whitespace-nowrap">
          {markerLabel}
        </span>
        <div
          style={{
            width: 0, height: 0, marginTop: 2,
            borderLeft: '3.5px solid transparent',
            borderRight: '3.5px solid transparent',
            borderTop: '4px solid #94a3b8',
          }}
        />
      </div>

      {/* Track */}
      <div className="relative h-10 bg-[#f1f5fb] rounded-xl overflow-hidden">
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-xl"
          style={{ width: `${fillWidth}%`, backgroundColor: FILL_COLOR[status] }}
        />

        {/* Pace/target line */}
        <div
          className="absolute inset-y-0"
          style={{
            left:            `${markerLeft}%`,
            width:           2.5,
            transform:       'translateX(-50%)',
            backgroundColor: markerColor,
            zIndex:          10,
          }}
        />

        {/* % label — inside fill when wide enough, otherwise outside to the right */}
        {labelInside ? (
          <div className="absolute inset-0 flex items-center px-4">
            <span className="text-white text-sm font-black drop-shadow-sm">{pct}%</span>
          </div>
        ) : (
          <div
            className="absolute inset-y-0 flex items-center"
            style={{ left: `${fillWidth}%`, paddingLeft: 8 }}
          >
            <span className="text-[#64748b] text-sm font-black">{pct}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Stat bar (phone / supplies) — target line, no pace ───────────────────────
function StatBar({
  pct,
  status,
  targetPct,
  scaleMax = 100,
  invert = false,
}: {
  pct:       number
  status:    StatusColor
  targetPct: number
  scaleMax?: number
  invert?:   boolean          // lower = better (supplies)
}) {
  const fillWidth   = Math.min((pct / scaleMax) * 100, 100)
  const targetLeft  = Math.min((targetPct / scaleMax) * 100, 99)
  const markerColor = !invert
    ? (fillWidth >= targetLeft ? 'rgba(255,255,255,0.8)' : '#94a3b8')
    : (fillWidth <= targetLeft ? 'rgba(255,255,255,0.8)' : '#94a3b8')

  return (
    <div className="relative" style={{ paddingTop: 20 }}>
      <div
        className="absolute top-0 flex flex-col items-center"
        style={{ left: `${targetLeft}%`, transform: 'translateX(-50%)' }}
      >
        <span className="text-[9px] font-bold uppercase tracking-wide text-[#94a3b8] leading-none whitespace-nowrap">
          target
        </span>
        <div style={{ width: 0, height: 0, marginTop: 2, borderLeft: '3.5px solid transparent', borderRight: '3.5px solid transparent', borderTop: '4px solid #94a3b8' }} />
      </div>

      <div className="relative h-10 bg-[#f1f5fb] rounded-xl overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-xl"
          style={{ width: `${fillWidth}%`, backgroundColor: FILL_COLOR[status] }}
        />
        <div
          className="absolute inset-y-0"
          style={{ left: `${targetLeft}%`, width: 2.5, transform: 'translateX(-50%)', backgroundColor: markerColor, zIndex: 10 }}
        />
        <div className="absolute inset-0 flex items-center px-4">
          <span className={`text-sm font-black drop-shadow-sm ${fillWidth > 18 ? 'text-white' : 'text-[#64748b]'}`}>
            {pct}%
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function OverviewClient({
  currentData,
  currentPeriod,
}: {
  currentData:   DashboardData
  currentPeriod: PeriodData
}) {
  const { snapshot } = useMonth()
  const data   = snapshot?.data        ?? currentData
  const period = snapshot?.periodInfo  ?? currentPeriod

  const { org, locations } = data
  const { daysComplete, totalBizDays } = period
  const pacePct = Math.round((daysComplete / totalBizDays) * 100)

  // Org metrics
  const prodPct      = pctToGoal(org.production,  org.productionGoal)
  const collPct      = pctToGoal(org.collections, org.collectionsGoal)
  const prodStatus   = collectionsVsPaceStatus(org.production,  org.productionGoal,  daysComplete, totalBizDays) as StatusColor
  const collStatus   = collectionsVsPaceStatus(org.collections, org.collectionsGoal, daysComplete, totalBizDays) as StatusColor
  const phoneStatus  = getStatusHigh(org.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow) as StatusColor
  const suppliesPct  = (org as { suppliesPct?: number }).suppliesPct ?? (locations.reduce((s, l) => s + l.suppliesPct, 0) / locations.length)
  const suppliesStatus = getStatusLow(suppliesPct, BENCHMARKS.supplies_pct.target, BENCHMARKS.supplies_pct.flagAbove) as StatusColor

  // Sorted locations
  const sortedLocs = [...locations].sort((a, b) => {
    const ga = MONTHLY_GOALS[a.code] ?? 100000
    const gb = MONTHLY_GOALS[b.code] ?? 100000
    return pctToGoal(b.collections, gb) - pctToGoal(a.collections, ga)
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">GreenSky Overview</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            {snapshot
              ? <span className="text-amber-600 font-semibold">▸ {period.label} — Historical</span>
              : <>{data.period} · Data as of {period.dataAsOf} · {daysComplete} of {totalBizDays} business days</>
            }
          </p>
        </div>
        <DaysLeft period={period} />
      </div>

      {/* ── Org Metrics ──────────────────────────────────────────────────────── */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Org Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

        {/* Production */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">MTD Production</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_PILL[prodStatus]}`}>
              {prodStatus === 'green' ? 'On Track' : prodStatus === 'amber' ? 'Watch' : 'Critical'}
            </span>
          </div>
          <div className={`text-3xl font-black mb-0.5 ${STATUS_VALUE[prodStatus]}`}>{formatCurrency(org.production)}</div>
          <div className="text-[#94a3b8] text-xs mb-1">Goal: {formatCurrency(org.productionGoal)}</div>
          <HeroBar pct={prodPct} status={prodStatus} markerPct={pacePct} />
        </div>

        {/* Collections */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">MTD Collections</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_PILL[collStatus]}`}>
              {collStatus === 'green' ? 'On Track' : collStatus === 'amber' ? 'Watch' : 'Critical'}
            </span>
          </div>
          <div className={`text-3xl font-black mb-0.5 ${STATUS_VALUE[collStatus]}`}>{formatCurrency(org.collections)}</div>
          <div className="text-[#94a3b8] text-xs mb-1">Goal: {formatCurrency(org.collectionsGoal)}</div>
          <HeroBar pct={collPct} status={collStatus} markerPct={pacePct} />
        </div>

        {/* Phone Answer Rate */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">Phone Answer Rate</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_PILL[phoneStatus]}`}>
              {phoneStatus === 'green' ? 'On Track' : phoneStatus === 'amber' ? 'Watch' : 'Critical'}
            </span>
          </div>
          <div className={`text-3xl font-black mb-0.5 ${STATUS_VALUE[phoneStatus]}`}>{formatPct(org.phoneAnswerRate)}</div>
          <div className="text-[#94a3b8] text-xs mb-1">Target: ≥{BENCHMARKS.phone_answer_rate.target}%</div>
          <StatBar
            pct={Math.round(org.phoneAnswerRate)}
            status={phoneStatus}
            targetPct={BENCHMARKS.phone_answer_rate.target}
          />
        </div>

        {/* Supplies % */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">Supplies %</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_PILL[suppliesStatus]}`}>
              {suppliesStatus === 'green' ? 'On Track' : suppliesStatus === 'amber' ? 'Watch' : 'Critical'}
            </span>
          </div>
          <div className={`text-3xl font-black mb-0.5 ${STATUS_VALUE[suppliesStatus]}`}>{suppliesPct.toFixed(1)}%</div>
          <div className="text-[#94a3b8] text-xs mb-1">Target: ≤5.5% of collections</div>
          <StatBar
            pct={parseFloat(suppliesPct.toFixed(1))}
            status={suppliesStatus}
            targetPct={5.5}
            scaleMax={10}
            invert
          />
        </div>
      </div>

      {/* ── Location Scorecard ───────────────────────────────────────────────── */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Location Scorecard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {sortedLocs.map((loc) => {
          const goal       = MONTHLY_GOALS[loc.code] ?? 100000
          const pct        = pctToGoal(loc.collections, goal)
          const paceStatus = collectionsVsPaceStatus(loc.collections, goal, daysComplete, totalBizDays) as StatusColor

          return (
            <div
              key={loc.code}
              className={`bg-white border border-[#d1dce9] border-t-4 rounded-xl p-4 ${STATUS_BORDER_T[paceStatus]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#0f172a] font-bold text-sm">{loc.code}</span>
                  {loc.isOSB && <OSBBadge />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${STATUS_PILL[paceStatus]}`}>
                  {paceStatus === 'green' ? 'On Track' : paceStatus === 'amber' ? 'Watch' : 'Critical'}
                </span>
              </div>
              <div className={`text-xl font-black ${STATUS_VALUE[paceStatus]}`}>{formatCurrency(loc.collections, true)}</div>
              <div className="text-[#94a3b8] text-xs mb-1">of {formatCurrency(goal, true)}</div>
              <GoalBar pct={pct} height="thick" periodInfo={{ daysComplete, totalBizDays }} />
              <div className={`text-xs mt-1 font-bold ${STATUS_VALUE[paceStatus]}`}>{pct}%</div>
            </div>
          )
        })}

        {/* Org Total */}
        <div className="bg-[#eff6ff] border border-[#2563eb]/25 border-t-4 border-t-[#2563eb] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#2563eb] font-bold text-sm">ORG TOTAL</span>
            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
              All
            </span>
          </div>
          <div className="text-xl font-black text-[#2563eb]">{formatCurrency(org.collections, true)}</div>
          <div className="text-[#94a3b8] text-xs mb-1">of {formatCurrency(org.collectionsGoal, true)}</div>
          <GoalBar pct={collPct} height="thick" color="#2563eb" periodInfo={{ daysComplete, totalBizDays }} />
          <div className="text-xs mt-1 font-bold text-[#2563eb]">{collPct}%</div>
        </div>
      </div>
    </div>
  )
}
