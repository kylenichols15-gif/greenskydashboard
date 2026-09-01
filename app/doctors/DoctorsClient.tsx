'use client'

import { useState } from 'react'
import { LOCATIONS, PROVIDER_GOALS, DOCTOR_COLL_GOALS, REMAINING_SCHEDULE_BY_PROVIDER } from '@/lib/data'
import { useMonth } from '@/lib/contexts/MonthContext'
import { formatCurrency, formatPct } from '@/lib/utils'
import Podium from '@/components/Podium'
import DaysLeft from '@/components/DaysLeft'
import OSBBadge from '@/components/OSBBadge'
import type { DashboardData, PeriodData } from '@/lib/types'

const BAR_MAX = 120   // bars scale to 120% so overachievers still show movement

// ── Colour logic (mirrors bonus page) ────────────────────────────────────────
function collFillColor(pct: number, pacePct: number) {
  if (pct >= pacePct * 1.05) return '#10B981'          // comfortably ahead — green
  if (pct >= pacePct)        return '#34D399'          // on pace — light green
  if (pct >= pacePct * 0.85) return '#F59E0B'          // close — amber
  return '#EF4444'                                     // behind — red
}
function paceStatusLabel(pct: number, pacePct: number) {
  if (pct >= pacePct * 1.05) return { text: 'Ahead',    cls: 'bg-green-100 text-green-700 border-green-300'  }
  if (pct >= pacePct)        return { text: 'On Pace',  cls: 'bg-green-50  text-green-600 border-green-200'  }
  if (pct >= pacePct * 0.85) return { text: 'Watch',    cls: 'bg-amber-50  text-amber-600 border-amber-300'  }
  return                            { text: 'Behind',   cls: 'bg-red-50    text-red-600   border-red-300'    }
}

// ── Collections bar with pace caret ──────────────────────────────────────────
function CollBar({
  value, goal, pacePct, daysComplete, totalBizDays,
}: {
  value: number; goal: number; pacePct: number
  daysComplete: number; totalBizDays: number
}) {
  const pct        = goal > 0 ? (value / goal) * 100 : 0
  const barW       = Math.min(pct, BAR_MAX) / BAR_MAX * 100
  const fill       = collFillColor(pct, pacePct)
  const paceLeft   = Math.min((pacePct / BAR_MAX) * 100, 99)
  const goalLineAt = (100 / BAR_MAX) * 100
  const projected  = daysComplete > 0 ? (value / daysComplete) * totalBizDays : value
  const projPct    = goal > 0 ? (projected / goal) * 100 : 0

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">Collections</span>
        <span className="text-[10px] text-[#94a3b8]">Goal: {formatCurrency(goal, true)}</span>
      </div>

      {/* Bar with pace caret */}
      <div className="relative" style={{ paddingTop: 12 }}>
        {/* Pace caret */}
        <div className="absolute top-0 flex flex-col items-center" style={{ left: `${paceLeft}%`, transform: 'translateX(-50%)' }}>
          <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400 leading-none whitespace-nowrap">pace</span>
          <div style={{ width:0, height:0, borderLeft:'3px solid transparent', borderRight:'3px solid transparent', borderTop:'3.5px solid #94a3b8', marginTop:1 }} />
        </div>

        <div className="relative h-3 bg-[#f1f5fb] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${barW}%`, backgroundColor: fill }} />
          {/* 100% goal line */}
          <div className="absolute top-0 h-full w-px bg-[#94a3b8]/70" style={{ left: `${goalLineAt}%` }} />
          {/* Pace white line */}
          <div className="absolute top-0 h-full w-0.5 bg-white/70" style={{ left: `${paceLeft}%`, transform: 'translateX(-50%)', zIndex: 10, boxShadow: '0 0 2px rgba(0,0,0,0.2)' }} />
        </div>
      </div>

      <div className="flex justify-between text-[10px] mt-0.5">
        <span className="text-[#94a3b8]">{formatCurrency(value, true)}</span>
        <span className="text-[#94a3b8]">
          Proj: <span className={projPct >= 100 ? 'text-green-600 font-semibold' : projPct >= 85 ? 'text-amber-600 font-semibold' : 'text-red-500 font-semibold'}>
            {formatCurrency(projected, true)} ({projPct.toFixed(0)}%)
          </span>
        </span>
      </div>
    </div>
  )
}

// ── Production bar — goal-aware when PROVIDER_GOALS set, else relative scale ──
function ProdBar({
  value, goal, scaleMax, pacePct, daysComplete, totalBizDays,
}: {
  value: number; goal: number; scaleMax: number
  pacePct: number; daysComplete: number; totalBizDays: number
}) {
  if (goal > 0) {
    const pct       = (value / goal) * 100
    const barW      = Math.min(pct, BAR_MAX) / BAR_MAX * 100
    const fill      = collFillColor(pct, pacePct)
    const paceLeft  = Math.min((pacePct / BAR_MAX) * 100, 99)
    const goalLine  = (100 / BAR_MAX) * 100
    const projected = daysComplete > 0 ? (value / daysComplete) * totalBizDays : value
    const projPct   = (projected / goal) * 100

    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">Production</span>
          <span className="text-[10px] text-[#94a3b8]">Goal: {formatCurrency(goal, true)}</span>
        </div>
        <div className="relative" style={{ paddingTop: 12 }}>
          <div className="absolute top-0 flex flex-col items-center" style={{ left: `${paceLeft}%`, transform: 'translateX(-50%)' }}>
            <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400 leading-none whitespace-nowrap">pace</span>
            <div style={{ width:0, height:0, borderLeft:'3px solid transparent', borderRight:'3px solid transparent', borderTop:'3.5px solid #94a3b8', marginTop:1 }} />
          </div>
          <div className="relative h-3 bg-[#f1f5fb] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${barW}%`, backgroundColor: fill }} />
            <div className="absolute top-0 h-full w-px bg-[#94a3b8]/70" style={{ left: `${goalLine}%` }} />
            <div className="absolute top-0 h-full w-0.5 bg-white/70" style={{ left: `${paceLeft}%`, transform: 'translateX(-50%)', zIndex: 10, boxShadow: '0 0 2px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
        <div className="flex justify-between text-[10px] mt-0.5">
          <span className="text-[#94a3b8]">{formatCurrency(value, true)}</span>
          <span className="text-[#94a3b8]">
            Proj: <span className={projPct >= 100 ? 'text-green-600 font-semibold' : projPct >= 85 ? 'text-amber-600 font-semibold' : 'text-red-500 font-semibold'}>
              {formatCurrency(projected, true)} ({projPct.toFixed(0)}%)
            </span>
          </span>
        </div>
      </div>
    )
  }

  // Fallback — relative scale bar when no goal set
  const barW = scaleMax > 0 ? (value / scaleMax) * 100 : 0
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">Production</span>
        <span className="text-[10px] text-amber-500 font-semibold">Goal TBD</span>
      </div>
      <div className="relative h-3 bg-[#f1f5fb] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#94a3b8]" style={{ width: `${barW}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-[#94a3b8] mt-0.5">
        <span>{formatCurrency(value, true)}</span>
        <span className="text-amber-500">— pending</span>
      </div>
    </div>
  )
}

export default function DoctorsClient({
  currentData,
  currentPeriod,
}: {
  currentData:   DashboardData
  currentPeriod: PeriodData
}) {
  const { snapshot } = useMonth()
  const data   = snapshot?.data       ?? currentData
  const period = snapshot?.periodInfo ?? currentPeriod

  const [sortBy, setSortBy] = useState<'collections' | 'production'>('collections')

  const { doctors } = data
  const { daysComplete, totalBizDays, daysRemaining } = period
  const pacePct = (daysComplete / totalBizDays) * 100

  // Sort key function
  const sortVal = (d: typeof doctors[number]) =>
    sortBy === 'production' ? d.grossProd : d.collections

  // Doctors with goals — ranked by selected metric
  const withGoals = doctors
    .filter(d => DOCTOR_COLL_GOALS[d.name] !== undefined)
    .map(d => ({
      ...d,
      collGoal: DOCTOR_COLL_GOALS[d.name]!,
      collPct:  DOCTOR_COLL_GOALS[d.name]! > 0
        ? (d.collections / DOCTOR_COLL_GOALS[d.name]!) * 100 : 0,
    }))
    .sort((a, b) => sortVal(b) - sortVal(a))

  const withoutGoals = doctors
    .filter(d => DOCTOR_COLL_GOALS[d.name] === undefined)
    .sort((a, b) => sortVal(b) - sortVal(a))
  const allSorted = [...withGoals, ...withoutGoals]
  const maxGross  = Math.max(...allSorted.map(d => d.grossProd), 1)

  // Podium: top 3 by selected metric
  const podiumEntries = allSorted.slice(0, 3).map(d => {
    const collGoal = DOCTOR_COLL_GOALS[d.name]
    const prodGoal = PROVIDER_GOALS[d.name] ?? 0
    if (sortBy === 'production') {
      return {
        name:           d.name,
        locationCode:   d.locationCode,
        primaryValue:   formatCurrency(d.grossProd, true),
        primaryLabel:   'MTD Production',
        secondaryValue: prodGoal > 0
          ? `${((d.grossProd / prodGoal) * 100).toFixed(1)}% of goal`
          : `${d.collRate.toFixed(1)}% coll rate`,
        secondaryLabel: prodGoal > 0 ? `(goal ${formatCurrency(prodGoal, true)})` : '',
      }
    }
    return {
      name:           d.name,
      locationCode:   d.locationCode,
      primaryValue:   formatCurrency(d.collections, true),
      primaryLabel:   'Total Collections',
      secondaryValue: collGoal
        ? `${((d.collections / collGoal) * 100).toFixed(1)}% of goal`
        : `${d.collRate.toFixed(1)}% coll rate`,
      secondaryLabel: collGoal ? `(goal ${formatCurrency(collGoal, true)})` : '',
    }
  })

  // Org-level pace summary counts
  const aheadCount  = withGoals.filter(d => d.collPct >= pacePct).length
  const behindCount = withGoals.length - aheadCount

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Doctor Leaderboard</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Ranked by {sortBy === 'production' ? 'MTD Production' : 'Total Collections'} · {period.label} ·{' '}
            {snapshot
              ? <span className="text-amber-600 font-semibold">▸ Historical</span>
              : `Day ${daysComplete} of ${totalBizDays} · ${Math.round(pacePct)}% complete`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Sort toggle */}
          <div className="flex rounded-lg border border-[#d1dce9] overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setSortBy('collections')}
              className={`px-3 py-1.5 transition-colors ${sortBy === 'collections' ? 'bg-[#2563eb] text-white' : 'bg-white text-[#64748b] hover:bg-[#f1f5fb]'}`}
            >
              Collections
            </button>
            <button
              onClick={() => setSortBy('production')}
              className={`px-3 py-1.5 transition-colors border-l border-[#d1dce9] ${sortBy === 'production' ? 'bg-[#2563eb] text-white' : 'bg-white text-[#64748b] hover:bg-[#f1f5fb]'}`}
            >
              Production
            </button>
          </div>
          <DaysLeft period={period} />
        </div>
      </div>

      {/* Pace summary banner */}
      <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-[#0f172a] font-bold">Doctor Collections — {period.label}</div>
              <div className="text-[#64748b] text-sm">
                Month is <strong>{Math.round(pacePct)}%</strong> complete · {daysRemaining} days remaining
              </div>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="text-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-700 text-xl font-bold">{aheadCount}</div>
              <div className="text-green-600 text-[10px] font-semibold uppercase tracking-wide">On/Ahead</div>
            </div>
            <div className="text-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-xl font-bold">{behindCount}</div>
              <div className="text-red-500 text-[10px] font-semibold uppercase tracking-wide">Behind</div>
            </div>
          </div>
        </div>

        {/* Month progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8] whitespace-nowrap">Month progress</span>
          <div className="flex-1 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
            <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${pacePct}%` }} />
          </div>
          <span className="text-[10px] text-[#64748b] font-semibold whitespace-nowrap">{Math.round(pacePct)}% — Day {daysComplete}/{totalBizDays}</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <Podium entries={podiumEntries} />

      {/* Full Leaderboard */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Full Leaderboard</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {allSorted.map((doc, i) => {
          const loc      = LOCATIONS.find(l => l.code === doc.locationCode)
          const collGoal = DOCTOR_COLL_GOALS[doc.name]
          const prodGoal = PROVIDER_GOALS[doc.name] ?? 0
          const collPct  = collGoal ? (doc.collections / collGoal) * 100 : null
          const status   = collPct !== null ? paceStatusLabel(collPct, pacePct) : null

          const borderColor = i === 0 ? 'border-[#F59E0B]/30' : i === 1 ? 'border-[#94A3B8]/20' : i === 2 ? 'border-[#CD7F32]/30' : 'border-[#d1dce9]'

          return (
            <div key={doc.name} className={`bg-white border rounded-xl p-4 ${borderColor}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f1f5fb] flex items-center justify-center text-[#64748b] font-bold text-sm shrink-0">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[#0f172a] font-semibold">{doc.name}{i === 0 && ' 🐐'}</div>
                      {doc.isOSB && <OSBBadge />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs px-1.5 py-0.5 rounded border border-[#2563eb]/20 font-medium">{doc.locationCode}</span>
                      <span className="text-[#64748b] text-xs">{loc?.name}</span>
                    </div>
                  </div>
                </div>
                {/* Pace status + % */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {status && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.cls}`}>
                      {status.text}
                    </span>
                  )}
                  {collPct !== null && (
                    <div className={`font-bold text-sm ${collPct >= pacePct ? 'text-green-600' : collPct >= pacePct * 0.85 ? 'text-amber-600' : 'text-red-500'}`}>
                      {collPct.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div>
                  <div className="text-[#64748b] text-xs">MTD Production</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.grossProd, true)}</div>
                  <div className="text-[#64748b] text-xs">{doc.daysWorked}d worked</div>
                </div>
                <div>
                  <div className="text-[#64748b] text-xs">Prod / Patient</div>
                  {doc.prodPerPatient !== undefined ? (
                    <>
                      <div className="text-[#0f172a] font-bold">{formatCurrency(doc.prodPerPatient, true)}</div>
                      <div className="text-[#64748b] text-xs">{doc.patientCount} pts</div>
                    </>
                  ) : (
                    <div className="text-[#94a3b8] font-bold">—</div>
                  )}
                </div>
                <div>
                  <div className="text-[#64748b] text-xs">Collections</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.collections, true)}</div>
                  <div className="text-[#64748b] text-xs">{formatPct(doc.collRate)} rate</div>
                </div>
                <div>
                  <div className="text-[#64748b] text-xs">YTD Production</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.ytdProd, true)}</div>
                  <div className="text-[#64748b] text-xs">{formatCurrency(doc.prodPerDay, true)}/day</div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="border-t border-[#f1f5fb] pt-3 flex flex-col gap-3">
                {collGoal !== undefined ? (
                  <CollBar
                    value={doc.collections}
                    goal={collGoal}
                    pacePct={pacePct}
                    daysComplete={daysComplete}
                    totalBizDays={totalBizDays}
                  />
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">Collections</span>
                      <span className="text-[10px] text-[#94a3b8]">Goal TBD</span>
                    </div>
                    <div className="h-3 bg-[#f1f5fb] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#94a3b8]" style={{ width: `${(doc.collections / Math.max(...allSorted.map(d => d.collections), 1)) * 100}%` }} />
                    </div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">{formatCurrency(doc.collections, true)}</div>
                  </div>
                )}
                <ProdBar
                  value={doc.grossProd}
                  goal={prodGoal}
                  scaleMax={maxGross}
                  pacePct={pacePct}
                  daysComplete={daysComplete}
                  totalBizDays={totalBizDays}
                />

                {/* Booked pipeline — remaining scheduled production + projection to goal */}
                {(() => {
                  const remSched = REMAINING_SCHEDULE_BY_PROVIDER[doc.name]
                  if (remSched === undefined || snapshot) return null  // live month only
                  const projected = doc.grossProd + remSched
                  const projPct   = prodGoal > 0 ? (projected / prodGoal) * 100 : null
                  return (
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">📅</span>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b] leading-tight">Booked rest of month</div>
                          <div className="text-[#0f172a] font-bold text-sm leading-tight">{formatCurrency(remSched, true)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-[#64748b] leading-tight">Projected (MTD + booked)</div>
                        <div className="text-sm font-bold leading-tight">
                          <span className="text-[#0f172a]">{formatCurrency(projected, true)}</span>
                          {projPct !== null && (
                            <span className={projPct >= 100 ? ' text-green-600' : projPct >= 85 ? ' text-amber-600' : ' text-red-500'}>
                              {' '}({projPct.toFixed(0)}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[#94a3b8] text-xs mt-3">
        Compensation data not shown. Ranked by {sortBy === 'production' ? 'MTD gross production' : 'total collections MTD'}. Pace caret = expected position at {Math.round(pacePct)}% of month. Production goals = 130% of collections goal.
      </p>
    </div>
  )
}
