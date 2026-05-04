'use client'

import { LOCATIONS, PROVIDER_GOALS } from '@/lib/data'
import { useMonth } from '@/lib/contexts/MonthContext'
import { formatCurrency, formatPct, pctToGoal } from '@/lib/utils'
import Podium from '@/components/Podium'
import DaysLeft from '@/components/DaysLeft'
import OSBBadge from '@/components/OSBBadge'
import GoalBar from '@/components/GoalBar'
import type { DashboardData, PeriodData } from '@/lib/types'

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

  const { doctors } = data
  const sorted  = [...doctors].sort((a, b) => b.grossProd - a.grossProd)
  const avgProd = sorted.reduce((s, d) => s + d.grossProd, 0) / (sorted.length || 1)

  const podiumEntries = sorted.slice(0, 3).map(d => ({
    name: d.name,
    locationCode: d.locationCode,
    primaryValue: formatCurrency(d.grossProd, true),
    primaryLabel: 'MTD Production',
    secondaryValue: formatCurrency(d.prodPerDay),
    secondaryLabel: '/ day',
  }))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Doctor Leaderboard</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Production · Efficiency · Collections ·{' '}
            {snapshot ? <span className="text-amber-600 font-semibold">▸ {period.label} — Historical</span> : period.label}
          </p>
        </div>
        <DaysLeft period={period} />
      </div>

      {/* Hero banner */}
      <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-[#0f172a] font-bold">The Race Is On — Who&apos;s Taking the Crown?</div>
            <div className="text-[#64748b] text-sm">Ranked by MTD Production · {sorted.length} doctors competing</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#0f172a] text-2xl font-bold">{sorted.length}</div>
          <div className="text-[#64748b] text-xs uppercase tracking-wider">Doctors</div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <Podium entries={podiumEntries} />

      {/* Full Leaderboard */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Full Leaderboard</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {sorted.map((doc, i) => {
          const loc = LOCATIONS.find(l => l.code === doc.locationCode)

          const isElite = doc.grossProd > avgProd * 1.10
          const isWatch = doc.grossProd < avgProd * 0.85
          const badge = isElite
            ? { label: '🔥 Elite',       cls: 'bg-green-500/10 text-green-400 border-green-500/20' }
            : isWatch
            ? { label: '📋 Needs Work',  cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
            : { label: '✓ On Track',     cls: 'bg-[#f1f5fb] text-[#64748b] border-[#d1dce9]' }

          const goal      = PROVIDER_GOALS[doc.name] ?? 0
          const goalPct   = goal > 0 ? pctToGoal(doc.grossProd, goal) : null
          const goalColor = goalPct === null ? '' : goalPct >= 100 ? 'text-green-400' : goalPct >= 90 ? 'text-amber-400' : 'text-red-400'
          const dollarGap = goal > 0 ? Math.max(0, goal - doc.grossProd) : 0

          const borderColor = i === 0 ? 'border-[#F59E0B]/30' : i === 1 ? 'border-[#94A3B8]/20' : i === 2 ? 'border-[#CD7F32]/30' : 'border-[#d1dce9]'

          return (
            <div key={doc.name} className={`bg-white border rounded-xl p-4 ${borderColor}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f1f5fb] flex items-center justify-center text-[#64748b] font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[#0f172a] font-semibold">{doc.name}</div>
                      {doc.isOSB && <OSBBadge />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs px-1.5 py-0.5 rounded border border-[#2563eb]/20 font-medium">{doc.locationCode}</span>
                      <span className="text-[#64748b] text-xs">{loc?.name}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${badge.cls}`}>{badge.label}</span>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <div className="text-[#64748b] text-xs">MTD Production</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.grossProd, true)}</div>
                  <div className="text-[#64748b] text-xs">{doc.daysWorked}d worked</div>
                </div>
                <div>
                  <div className="text-[#64748b] text-xs">Prod / Day</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.prodPerDay, true)}</div>
                  <div className="text-[#64748b] text-xs">Target $8K+</div>
                </div>
                <div>
                  <div className="text-[#64748b] text-xs">Collections</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.collections, true)}</div>
                  <div className="text-[#64748b] text-xs">{formatPct(doc.collRate)} rate</div>
                </div>
                <div>
                  <div className="text-[#64748b] text-xs">YTD Production</div>
                  <div className="text-[#0f172a] font-bold">{formatCurrency(doc.ytdProd, true)}</div>
                </div>
              </div>

              {goal > 0 && goalPct !== null && (
                <div className="border-t border-[#f1f5fb] pt-3">
                  <GoalBar pct={goalPct} height="thin" />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs font-semibold ${goalColor}`}>{goalPct}% of goal</span>
                    <span className="text-[#94a3b8] text-xs">
                      Goal {formatCurrency(goal, true)}
                      {dollarGap > 0 && <span className="text-[#94a3b8]"> · {formatCurrency(dollarGap, true)} short</span>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[#94a3b8] text-xs mt-3">Compensation data not shown. Ranked by MTD production. Goals are placeholder estimates — confirm with Kyle.</p>
    </div>
  )
}
