'use client'

import { LOCATIONS } from '@/lib/data'
import { useMonth } from '@/lib/contexts/MonthContext'
import { formatCurrency, formatPct } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'
import type { DashboardData, PeriodData } from '@/lib/types'

function AgingBar({ pcts }: { pcts: { d0_30: number; d31_60: number; d61_90: number; d90plus: number } }) {
  return (
    <div className="flex h-3 rounded-full overflow-hidden gap-px">
      <div className="bg-green-500"  style={{ width: `${pcts.d0_30}%` }} title={`0-30: ${pcts.d0_30}%`} />
      <div className="bg-amber-400"  style={{ width: `${pcts.d31_60}%` }} title={`31-60: ${pcts.d31_60}%`} />
      <div className="bg-orange-500" style={{ width: `${pcts.d61_90}%` }} title={`61-90: ${pcts.d61_90}%`} />
      <div className="bg-red-500"    style={{ width: `${pcts.d90plus}%` }} title={`90+: ${pcts.d90plus}%`} />
    </div>
  )
}

function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : '#EF4444'
  return (
    <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl px-6 py-5 text-center shrink-0">
      <div className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-1">AR Health Score</div>
      <div className="text-5xl font-bold" style={{ color }}>{score}</div>
      <div className="text-[#64748b] text-xs mt-1">100 = all current, clean aging</div>
    </div>
  )
}

export default function ArClient({
  currentData,
  currentPeriod,
}: {
  currentData:   DashboardData
  currentPeriod: PeriodData
}) {
  const { snapshot } = useMonth()
  const data   = snapshot?.data       ?? currentData
  const period = snapshot?.periodInfo ?? currentPeriod

  const { ar } = data

  const statusLabel = (s: string) => {
    if (s === 'needs_work') return { label: '✗ Needs Work', cls: 'bg-red-50 text-red-700 border-red-200' }
    if (s === 'watch')      return { label: '⚠ Watch',      cls: 'bg-amber-50 text-amber-700 border-amber-200' }
    if (s === 'on_pace')    return { label: '⊙ On Pace',    cls: 'bg-blue-50 text-blue-700 border-blue-200' }
    return                         { label: '✓ Good',        cls: 'bg-green-50 text-green-700 border-green-200' }
  }
  const arRatioColor = (ratio: number) => ratio <= 1.0 ? 'text-green-600' : ratio <= 1.3 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Accounts Receivable</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Where&apos;s the money? As of {ar.asOf}
            {snapshot && <span className="text-amber-600 font-semibold ml-2">▸ {period.label} — Historical</span>}
          </p>
        </div>
        <DaysLeft period={period} />
      </div>

      {/* Health score + org aging bar */}
      <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <HealthScore score={ar.healthScore} />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-[#64748b] mb-2">
              <span>0-30 Days: {formatCurrency(ar.buckets.d0_30, true)}</span>
              <span>31-60: {formatCurrency(ar.buckets.d31_60, true)}</span>
              <span>61-90: {formatCurrency(ar.buckets.d61_90, true)}</span>
              <span className="text-red-600">90+: {formatCurrency(ar.buckets.d90plus, true)}</span>
            </div>
            <div className="flex h-5 rounded-lg overflow-hidden gap-px">
              <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${ar.pcts.d0_30}%` }}>{ar.pcts.d0_30}%</div>
              <div className="bg-amber-400 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${ar.pcts.d31_60}%` }}>{ar.pcts.d31_60}%</div>
              <div className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${ar.pcts.d61_90}%` }}>{ar.pcts.d61_90}%</div>
              <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${ar.pcts.d90plus}%` }}>{ar.pcts.d90plus}%</div>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> 0-30 Days</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 31-60</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> 61-90</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 90+</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Total AR</div>
          <div className="text-[#0f172a] font-bold text-xl">{formatCurrency(ar.total, true)}</div>
          <div className="text-[#64748b] text-xs">6 locations</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Current (0-30)</div>
          <div className={`font-bold text-xl ${ar.pcts.d0_30 >= 75 ? 'text-green-600' : 'text-red-600'}`}>{ar.pcts.d0_30}%</div>
          <div className="text-[#64748b] text-xs">Goal: ≥75%{ar.pcts.d0_30 > 0 && ar.pcts.d0_30 < 75 && <span className="text-red-600"> ✗ Below 75%</span>}</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Over 60 Days</div>
          <div className="text-red-600 font-bold text-xl">{formatCurrency(ar.buckets.d61_90 + ar.buckets.d90plus, true)}</div>
          <div className="text-[#64748b] text-xs">{(ar.pcts.d61_90 + ar.pcts.d90plus).toFixed(1)}% of total AR</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Over 90 Days</div>
          <div className="text-red-600 font-bold text-xl">{formatCurrency(ar.buckets.d90plus, true)}</div>
          <div className="text-[#64748b] text-xs">Goal: ≤3% · {ar.pcts.d90plus}% actual{ar.pcts.d90plus > 3 && <span className="text-red-600"> ✗</span>}</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">AR:Production</div>
          <div className={`font-bold text-xl ${arRatioColor(ar.arToProdRatio)}`}>{ar.arToProdRatio}x</div>
          <div className="text-[#64748b] text-xs">Goal: ≤1.0x{ar.arToProdRatio > 1.0 && <span className="text-red-600"> ✗ AR outpacing</span>}</div>
        </div>
      </div>

      {/* Alert callout */}
      {ar.locations.filter(l => l.status === 'needs_work').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-xl shrink-0">🚨</span>
          <div>
            <div className="text-red-700 font-semibold mb-1">
              {ar.locations.filter(l => l.status === 'needs_work').length} of {ar.locations.length} locations need AR attention
            </div>
            <div className="text-red-600 text-sm mb-2">
              {formatCurrency(ar.buckets.d61_90 + ar.buckets.d90plus, true)} is sitting past 60 days — that&apos;s money getting harder to collect every week.
              The org AR:Prod ratio of {ar.arToProdRatio}x means AR is growing faster than you&apos;re producing.
            </div>
            <div className="flex flex-wrap gap-2">
              {['→ Run 90+ aging reports', '→ Weekly follow-up on denials', '→ Verify claim submissions'].map(a => (
                <span key={a} className="text-xs text-red-600 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">{a}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Per-location cards */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Location Detail</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...ar.locations].sort((a, b) => a.pct90plus - b.pct90plus).map((loc, i) => {
          const meta   = LOCATIONS.find(l => l.code === loc.code)
          const status = statusLabel(loc.status)
          const ratio  = arRatioColor(loc.arToProd)

          return (
            <div key={loc.code} className={`bg-white border rounded-xl overflow-hidden ${
              loc.status === 'needs_work' ? 'border-red-500/20' : loc.status === 'watch' ? 'border-amber-500/20' : 'border-[#d1dce9]'
            }`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs font-bold px-2 py-0.5 rounded border border-[#2563eb]/20">{loc.code}</span>
                      <span className="text-[#0f172a] font-semibold">{meta?.name}{i === 0 && ' 🐐'}</span>
                      {meta?.isOSB && <OSBBadge />}
                    </div>
                    <div className="text-[#64748b] text-xs mt-0.5">Total AR: {formatCurrency(loc.total, true)} · AR:Prod <span className={ratio}>{loc.arToProd}x</span></div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${status.cls}`}>{status.label}</span>
                </div>

                <AgingBar pcts={{ d0_30: loc.pct0_30, d31_60: loc.pct31_60, d61_90: loc.pct61_90, d90plus: loc.pct90plus }} />

                <div className="grid grid-cols-4 gap-2 mt-3 text-xs mb-3">
                  <div><div className="text-green-600 font-bold">{formatCurrency(loc.d0_30, true)}</div><div className="text-[#64748b]">0-30 · {loc.pct0_30}%</div></div>
                  <div><div className="text-amber-600 font-bold">{formatCurrency(loc.d31_60, true)}</div><div className="text-[#64748b]">31-60 · {loc.pct31_60}%</div></div>
                  <div><div className="text-orange-600 font-bold">{formatCurrency(loc.d61_90, true)}</div><div className="text-[#64748b]">61-90 · {loc.pct61_90}%</div></div>
                  <div><div className="text-red-600 font-bold">{formatCurrency(loc.d90plus, true)}</div><div className="text-[#64748b]">90+ · {loc.pct90plus}%</div></div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-[#d1dce9]">
                  <div><div className="text-[#64748b]">Insurance AR</div><div className="text-[#2563eb] font-bold">{formatCurrency(loc.insuranceAR, true)}</div></div>
                  <div><div className="text-[#64748b]">Patient AR</div><div className="text-[#2563eb] font-bold">{formatCurrency(loc.patientAR, true)}</div></div>
                  <div><div className="text-[#64748b]">Patient %</div><div className="text-[#0f172a] font-bold">{loc.patientPct}%</div></div>
                </div>

                {loc.pct90plus > 3 && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                    🚨 {formatCurrency(loc.d90plus, true)} over 90 days ({loc.pct90plus}%) — run aging report, identify top balances, target under 3%.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
