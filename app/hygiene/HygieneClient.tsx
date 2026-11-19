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
  // Ranked by $/hr (efficiency). Zero-hour providers (no time-clock data) sort to the bottom.
  const sorted    = [...hygienists].sort((a, b) => b.prodPerHr - a.prodPerHr)
  const ranked    = sorted.filter(h => h.prodPerHr > 0)
  const avgProdHr = ranked.reduce((s, h) => s + h.prodPerHr, 0) / (ranked.length || 1)

  const podiumEntries = sorted.slice(0, 3).map(h => ({
    name: h.name,
    locationCode: h.locationCode,
    primaryValue: `$${h.prodPerHr}/hr`,
    primaryLabel: 'Prod / Hr',
    secondaryValue: formatCurrency(h.adjProd ?? h.grossProd, true),
    secondaryLabel: 'Adj Production',
  }))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Hygiene Performance</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Production · Efficiency ·{' '}
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
            <div className="text-[#64748b] text-sm">Ranked by Production / Hour · {sorted.length} hygienists</div>
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
                {['#', 'Name', 'Location', 'Gross Prod', 'Adj Prod', 'Collections', 'Coll %', 'Hrs', '$/Hr', '$/Pt'].map(h => (
                  <th key={h} className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-3 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((h, i) => {
                const loc          = LOCATIONS.find(l => l.code === h.locationCode)
                // Coll % = collections ÷ ADJUSTED production (true collection rate; falls back to stored
                // gross-based collRate on frozen months that predate adjProd).
                const adjCollRate  = (h.adjProd && h.adjProd > 0) ? (h.collections / h.adjProd) * 100 : h.collRate
                const isElite      = h.prodPerHr > avgProdHr * 1.1
                const isWatch      = h.prodPerHr < avgProdHr * 0.85 && h.prodPerHr > 0
                return (
                  <tr key={`${h.name}-${h.locationCode}`} className="border-b border-[#d1dce9]/50 hover:bg-[#f1f5fb] transition-colors">
                    <td className="px-3 py-3 text-[#64748b] font-bold text-xs">#{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="text-[#0f172a] font-medium text-sm">{h.name}{i === 0 && ' 🐐'}</div>
                      {isElite && <span className="text-[10px] text-green-600 font-semibold">🔥 Elite</span>}
                      {isWatch  && <span className="text-[10px] text-amber-600 font-semibold">📋 Watch</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs px-1.5 py-0.5 rounded border border-[#2563eb]/20 font-medium">{h.locationCode}</span>
                    </td>
                    <td className="px-3 py-3 text-[#64748b]">{formatCurrency(h.grossProd, true)}</td>
                    <td className="px-3 py-3 text-[#0f172a] font-bold">{h.adjProd !== undefined ? formatCurrency(h.adjProd, true) : '—'}</td>
                    <td className="px-3 py-3 text-[#0f172a]">{formatCurrency(h.collections, true)}</td>
                    <td className="px-3 py-3 text-[#64748b]">{formatPct(adjCollRate)}</td>
                    <td className="px-3 py-3 text-[#64748b]">{h.hoursWorked > 0 ? h.hoursWorked.toFixed(1) : '—'}</td>
                    <td className="px-3 py-3 text-[#0f172a] font-medium">{h.prodPerHr > 0 ? `$${h.prodPerHr}` : '—'}</td>
                    <td className="px-3 py-3 text-[#64748b]">
                      {h.prodPerPatient !== undefined
                        ? <span>{formatCurrency(h.prodPerPatient, true)}<span className="text-[#94a3b8] text-[10px]"> · {h.patientCount}pt</span></span>
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[#94a3b8] text-xs mt-3">
        <strong>Adj Prod</strong> = adjusted production (Production Total — gross less charge/credit adjustments &amp; write-offs),
        from the Provider A/R Totals report. <strong>$/Hr</strong> = adjusted production ÷ hours worked (what they charge out),
        and the board is ranked by it. <strong>Coll %</strong> = collections ÷ adjusted production MTD (true collection rate).
        Gross Prod is shown for reference. Providers without time-clock hours rank last; low-hours providers can show inflated
        $/hr early in the month ($/Hr available Apr 2026 onward). $/Pt = gross production ÷ patients seen (June 2026 onward).
      </p>
    </div>
  )
}
