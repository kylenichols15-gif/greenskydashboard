import { DEMO_DATA, LOCATIONS, BENCHMARKS } from '@/lib/data'
import { formatCurrency, formatPct, getStatusHigh } from '@/lib/utils'
import Podium from '@/components/Podium'
import DaysLeft from '@/components/DaysLeft'

export default function HygienePage() {
  const { hygienists } = DEMO_DATA
  const sorted = [...hygienists].sort((a, b) => b.prodPerHr - a.prodPerHr)
  const avgProdHr = sorted.reduce((s, h) => s + h.prodPerHr, 0) / (sorted.length || 1)

  const podiumEntries = sorted.slice(0, 3).map(h => ({
    name: h.name,
    locationCode: h.locationCode,
    primaryValue: `$${h.prodPerHr}/hr`,
    primaryLabel: 'Production / Hr',
    secondaryValue: formatCurrency(h.grossProd, true),
    secondaryLabel: 'MTD Prod',
  }))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[#F1F5F9] text-2xl font-bold">Hygiene Leaderboard</h1>
          <p className="text-[#64748B] text-sm mt-1">Production/Hr · Recare · Collections · April 2026</p>
        </div>
        <DaysLeft />
      </div>

      {/* Hero banner */}
      <div className="bg-[#0D2B45] border border-[#0A9E8A]/20 rounded-xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦷</span>
          <div>
            <div className="text-[#F1F5F9] font-bold">Hygiene Performance — Who's Leading the Chair?</div>
            <div className="text-[#64748B] text-sm">Ranked by Production/Hr · {sorted.length} hygienists active</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#F1F5F9] text-2xl font-bold">{sorted.length}</div>
          <div className="text-[#64748B] text-xs uppercase tracking-wider">Hygienists</div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <Podium entries={podiumEntries} />

      {/* Full Leaderboard */}
      <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Full Leaderboard</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {sorted.map((hyg, i) => {
          const loc = LOCATIONS.find(l => l.code === hyg.locationCode)
          const isElite = hyg.prodPerHr > avgProdHr * 1.10
          const isWatch = hyg.prodPerHr < avgProdHr * 0.85
          const recareStatus = getStatusHigh(hyg.recareRate, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow)
          const recareC = { green: 'text-green-400', amber: 'text-amber-400', red: 'text-red-400' }[recareStatus]

          const badge = isElite
            ? { label: '🔥 Elite', cls: 'bg-green-500/10 text-green-400 border-green-500/20' }
            : isWatch
            ? { label: '📋 Needs Work', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
            : { label: '✓ On Track', cls: 'bg-[#1E2A3A] text-[#64748B] border-[#1E2A3A]' }

          const borderColor = i === 0 ? 'border-[#F59E0B]/30' : i === 1 ? 'border-[#94A3B8]/20' : i === 2 ? 'border-[#CD7F32]/30' : 'border-[#1E2A3A]'

          return (
            <div key={hyg.name} className={`bg-[#0D1629] border rounded-xl p-4 ${borderColor}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-[#64748B] font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-[#F1F5F9] font-semibold">{hyg.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-xs px-1.5 py-0.5 rounded border border-[#0A9E8A]/20 font-medium">{hyg.locationCode}</span>
                      <span className="text-[#64748B] text-xs">{loc?.name}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${badge.cls}`}>{badge.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-[#64748B] text-xs">Prod / Hr</div>
                  <div className="text-[#F1F5F9] font-bold">${hyg.prodPerHr}</div>
                  <div className="text-[#64748B] text-xs">{hyg.hoursWorked}h worked</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-xs">MTD Production</div>
                  <div className="text-[#F1F5F9] font-bold">{formatCurrency(hyg.grossProd, true)}</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-xs">Collections</div>
                  <div className="text-[#F1F5F9] font-bold">{formatCurrency(hyg.collections, true)}</div>
                  <div className="text-[#64748B] text-xs">{formatPct(hyg.collRate)} rate</div>
                </div>
                <div>
                  <div className="text-[#64748B] text-xs">Recare %</div>
                  <div className={`font-bold ${recareC}`}>{formatPct(hyg.recareRate)}</div>
                  <div className="text-[#64748B] text-xs">Target 85%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[#3A4A5A] text-xs mt-3">Ranked by production per hour. Compensation data not shown.</p>
    </div>
  )
}
