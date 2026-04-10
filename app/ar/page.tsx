import { DEMO_DATA, LOCATIONS } from '@/lib/data'
import { formatCurrency, formatPct } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'

function AgingBar({ pcts }: { pcts: { d0_30: number; d31_60: number; d61_90: number; d90plus: number } }) {
  return (
    <div className="flex h-3 rounded-full overflow-hidden gap-px">
      <div className="bg-green-500"   style={{ width: `${pcts.d0_30}%` }} title={`0-30: ${pcts.d0_30}%`} />
      <div className="bg-amber-400"   style={{ width: `${pcts.d31_60}%` }} title={`31-60: ${pcts.d31_60}%`} />
      <div className="bg-orange-500"  style={{ width: `${pcts.d61_90}%` }} title={`61-90: ${pcts.d61_90}%`} />
      <div className="bg-red-500"     style={{ width: `${pcts.d90plus}%` }} title={`90+: ${pcts.d90plus}%`} />
    </div>
  )
}

function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : '#EF4444'
  return (
    <div className="bg-[#0D2B45] border border-[#0A9E8A]/20 rounded-xl px-6 py-5 text-center shrink-0">
      <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-1">AR Health Score</div>
      <div className="text-5xl font-bold" style={{ color }}>{score}</div>
      <div className="text-[#64748B] text-xs mt-1">100 = all current, clean aging</div>
    </div>
  )
}

export default function ARAgingPage() {
  const { ar } = DEMO_DATA

  const statusLabel = (s: string) => {
    if (s === 'needs_work') return { label: '✗ Needs Work', cls: 'bg-red-500/10 text-red-400 border-red-500/20' }
    if (s === 'watch')      return { label: '⚠ Watch',      cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    return                         { label: '✓ Good',        cls: 'bg-green-500/10 text-green-400 border-green-500/20' }
  }

  const arRatioColor = (ratio: number) => ratio <= 1.0 ? 'text-green-400' : ratio <= 1.3 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[#F1F5F9] text-2xl font-bold">Accounts Receivable</h1>
          <p className="text-[#64748B] text-sm mt-1">Where's the money? As of {ar.asOf}</p>
        </div>
        <DaysLeft />
      </div>

      {/* Health score + org aging bar */}
      <div className="bg-[#0D2B45] border border-[#0A9E8A]/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-6 mb-4">
          <HealthScore score={ar.healthScore} />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-[#64748B] mb-2">
              <span>0-30 Days: {formatCurrency(ar.buckets.d0_30, true)}</span>
              <span>31-60: {formatCurrency(ar.buckets.d31_60, true)}</span>
              <span>61-90: {formatCurrency(ar.buckets.d61_90, true)}</span>
              <span className="text-red-400">90+: {formatCurrency(ar.buckets.d90plus, true)}</span>
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
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Total AR</div>
          <div className="text-[#F1F5F9] font-bold text-xl">{formatCurrency(ar.total, true)}</div>
          <div className="text-[#64748B] text-xs">6 locations</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Current (0-30)</div>
          <div className={`font-bold text-xl ${ar.pcts.d0_30 >= 75 ? 'text-green-400' : 'text-red-400'}`}>{ar.pcts.d0_30}%</div>
          <div className="text-[#64748B] text-xs">Goal: ≥75%{ar.pcts.d0_30 < 75 && <span className="text-red-400"> ✗ Below 75%</span>}</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Over 60 Days</div>
          <div className="text-red-400 font-bold text-xl">{formatCurrency(ar.buckets.d61_90 + ar.buckets.d90plus, true)}</div>
          <div className="text-[#64748B] text-xs">{(ar.pcts.d61_90 + ar.pcts.d90plus).toFixed(1)}% of total AR</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Over 90 Days</div>
          <div className="text-red-400 font-bold text-xl">{formatCurrency(ar.buckets.d90plus, true)}</div>
          <div className="text-[#64748B] text-xs">Goal: ≤3% · {ar.pcts.d90plus}% actual{ar.pcts.d90plus > 3 && <span className="text-red-400"> ✗</span>}</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">AR:Production</div>
          <div className={`font-bold text-xl ${arRatioColor(ar.arToProdRatio)}`}>{ar.arToProdRatio}x</div>
          <div className="text-[#64748B] text-xs">Goal: ≤1.0x{ar.arToProdRatio > 1.0 && <span className="text-red-400"> ✗ AR outpacing</span>}</div>
        </div>
      </div>

      {/* Alert callout */}
      <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <span className="text-xl shrink-0">🚨</span>
        <div>
          <div className="text-red-300 font-semibold mb-1">
            {ar.locations.filter(l => l.status === 'needs_work').length} of {ar.locations.length} locations need AR attention
          </div>
          <div className="text-red-300/70 text-sm mb-2">
            {formatCurrency(ar.buckets.d61_90 + ar.buckets.d90plus, true)} is sitting past 60 days — that's money getting harder to collect every week.
            The org AR:Prod ratio of {ar.arToProdRatio}x means AR is growing faster than you're producing.
          </div>
          <div className="flex flex-wrap gap-2">
            {['→ Run 90+ aging reports', '→ Weekly follow-up on denials', '→ Verify claim submissions'].map(a => (
              <span key={a} className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Per-location cards */}
      <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Location Detail</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {ar.locations.map(loc => {
          const meta   = LOCATIONS.find(l => l.code === loc.code)
          const status = statusLabel(loc.status)
          const ratio  = arRatioColor(loc.arToProd)

          return (
            <div key={loc.code} className={`bg-[#0D1629] border rounded-xl overflow-hidden ${
              loc.status === 'needs_work' ? 'border-red-500/20' : loc.status === 'watch' ? 'border-amber-500/20' : 'border-[#1E2A3A]'
            }`}>
              {loc.isOSB && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center gap-2">
                  <OSBBadge /><span className="text-amber-400/70 text-xs">Manual source</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-xs font-bold px-2 py-0.5 rounded border border-[#0A9E8A]/20">{loc.code}</span>
                      <span className="text-[#F1F5F9] font-semibold">{meta?.name}</span>
                    </div>
                    <div className="text-[#64748B] text-xs mt-0.5">Total AR: {formatCurrency(loc.total, true)} · AR:Prod <span className={ratio}>{loc.arToProd}x</span></div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${status.cls}`}>{status.label}</span>
                </div>

                <AgingBar pcts={{ d0_30: loc.pct0_30, d31_60: loc.pct31_60, d61_90: loc.pct61_90, d90plus: loc.pct90plus }} />

                <div className="grid grid-cols-4 gap-2 mt-3 text-xs mb-3">
                  <div><div className="text-green-400 font-bold">{formatCurrency(loc.d0_30, true)}</div><div className="text-[#64748B]">0-30 · {loc.pct0_30}%</div></div>
                  <div><div className="text-amber-400 font-bold">{formatCurrency(loc.d31_60, true)}</div><div className="text-[#64748B]">31-60 · {loc.pct31_60}%</div></div>
                  <div><div className="text-orange-400 font-bold">{formatCurrency(loc.d61_90, true)}</div><div className="text-[#64748B]">61-90 · {loc.pct61_90}%</div></div>
                  <div><div className="text-red-400 font-bold">{formatCurrency(loc.d90plus, true)}</div><div className="text-[#64748B]">90+ · {loc.pct90plus}%</div></div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-[#1E2A3A]">
                  <div><div className="text-[#64748B]">Insurance AR</div><div className="text-[#0A9E8A] font-bold">{formatCurrency(loc.insuranceAR, true)}</div></div>
                  <div><div className="text-[#64748B]">Patient AR</div><div className="text-[#0A9E8A] font-bold">{formatCurrency(loc.patientAR, true)}</div></div>
                  <div><div className="text-[#64748B]">Patient %</div><div className="text-[#F1F5F9] font-bold">{loc.patientPct}%</div></div>
                </div>

                {loc.pct90plus > 3 && (
                  <div className="mt-3 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-300">
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
