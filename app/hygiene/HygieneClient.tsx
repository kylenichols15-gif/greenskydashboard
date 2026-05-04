'use client'

import { LOCATIONS, BENCHMARKS } from '@/lib/data'
import { useMonth } from '@/lib/contexts/MonthContext'
import { formatCurrency, formatPct, getStatusHigh } from '@/lib/utils'
import Podium from '@/components/Podium'
import DaysLeft from '@/components/DaysLeft'
import type { DashboardData, PeriodData } from '@/lib/types'

export default function HygieneClient({
  currentData,
  currentPeriod,
}: {
  currentData:   DashboardData
  currentPeriod: PeriodData
}) {
  const { snapshot } = useMonth()
  const data   = snapshot?.data       ?? currentData
  const period = snapshot?.periodInfo ?? currentPeriod

  const { hygienists } = data
  const sorted    = [...hygienists].sort((a, b) => b.grossProd - a.grossProd)
  const avgProdHr = sorted.reduce((s, h) => s + h.prodPerHr, 0) / (sorted.length || 1)

  const podiumEntries = sorted.slice(0, 3).map(h => ({
    name: h.name,
    locationCode: h.locationCode,
    primaryValue: formatCurrency(h.grossProd, true),
    primaryLabel: 'MTD Production',
    secondaryValue: `$${h.prodPerHr}/hr`,
    secondaryLabel: 'Prod / Hr',
  }))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Hygiene Performance</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Production · Efficiency · Recare ·{' '}
            {snapshot ? <span className="text-amber-600 font-semibold">▸ {period.label}</span> : period.label}
          </p>
        </div>
        <DaysLeft period={period} />
      </div>

      {/* Hero */}
      <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✦</span>
          <div>
            <div className="text-[#0f172a] font-bold">Hygiene Leaderboard — Production &amp; Efficiency</div>
            <div className="text-[#64748b] text-sm">Ranked by MTD Production · {sorted.length} hygienists</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#0f172a] text-2xl font-bold">{sorted.length}</div>
          <div className="text-[#64748b] text-xs uppercase tracking-wider">Hygienists</div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <Podium entries={podiumEntries} />

      {/* Full Leaderboard */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Full Leaderboard</h2>
      <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d1dce9]">
                {['#', 'Name', 'Location', 'MTD Prod', 'Collections', 'Coll %', 'Hrs', '$/Hr', 'Recare'].map(h => (
                  <th key={h} className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-3 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((h, i) => {
                const loc          = LOCATIONS.find(l => l.code === h.locationCode)
                const isElite      = h.prodPerHr > avgProdHr * 1.1
                const isWatch      = h.prodPerHr < avgProdHr * 0.85 && h.prodPerHr > 0
                const recareStatus = h.recareRate > 0 ? getStatusHigh(h.recareRate, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow) : null
                const recareColor  = recareStatus ? { green: 'text-green-600', amber: 'text-amber-600', red: 'text-red-600' }[recareStatus] : 'text-[#94a3b8]'

                return (
                  <tr key={`${h.name}-${h.locationCode}`} className="border-b border-[#d1dce9]/50 hover:bg-[#f1f5fb] transition-colors">
                    <td className="px-3 py-3 text-[#64748b] font-bold text-xs">#{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="text-[#0f172a] font-medium text-sm">{h.name}</div>
                      {isElite && <span className="text-[10px] text-green-600 font-semibold">🔥 Elite</span>}
                      {isWatch  && <span className="text-[10px] text-amber-600 font-semibold">📋 Watch</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs px-1.5 py-0.5 rounded border border-[#2563eb]/20 font-medium">{h.locationCode}</span>
                    </td>
                    <td className="px-3 py-3 text-[#0f172a] font-bold">{formatCurrency(h.grossProd, true)}</td>
                    <td className="px-3 py-3 text-[#0f172a]">{formatCurrency(h.collections, true)}</td>
                    <td className="px-3 py-3 text-[#64748b]">{formatPct(h.collRate)}</td>
                    <td className="px-3 py-3 text-[#64748b]">{h.hoursWorked > 0 ? h.hoursWorked.toFixed(1) : '—'}</td>
                    <td className="px-3 py-3 text-[#0f172a] font-medium">{h.prodPerHr > 0 ? `$${h.prodPerHr}` : '—'}</td>
                    <td className={`px-3 py-3 font-medium ${recareColor}`}>
                      {h.recareRate > 0 ? formatPct(h.recareRate) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[#94a3b8] text-xs mt-3">
        $/Hr and hours worked available from Apr 2026 onward. Recare = OSB only (Dental Intel). Ranked by MTD production.
      </p>
    </div>
  )
}
