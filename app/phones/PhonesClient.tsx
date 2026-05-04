'use client'

import { BENCHMARKS, LOCATIONS } from '@/lib/data'
import { useMonth } from '@/lib/contexts/MonthContext'
import { formatCurrency, formatPct, getStatusHigh } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'
import type { DashboardData, PeriodData } from '@/lib/types'

const NP_CALL_RATE   = 0.32
const CLOSE_RATE     = 0.65
const AVG_NP_VALUE   = 850
const VALUE_PER_MISS = Math.round(NP_CALL_RATE * CLOSE_RATE * AVG_NP_VALUE) // ~$177

function missedRevenue(missed: number) { return missed * VALUE_PER_MISS }

function answerRateColor(rate: number) {
  if (rate >= BENCHMARKS.phone_answer_rate.target)    return 'text-green-600'
  if (rate >= BENCHMARKS.phone_answer_rate.flagBelow) return 'text-amber-600'
  return 'text-red-600'
}

function CircleGauge({ rate }: { rate: number }) {
  const r = 28, circ = 2 * Math.PI * r, fill = (rate / 100) * circ
  const color = rate >= 80 ? '#10B981' : rate >= 70 ? '#F59E0B' : '#EF4444'
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
      <text x="36" y="40" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
        {rate.toFixed(1)}%
      </text>
    </svg>
  )
}

export default function PhonesClient({
  currentData,
  currentPeriod,
}: {
  currentData:   DashboardData
  currentPeriod: PeriodData
}) {
  const { snapshot } = useMonth()
  const data   = snapshot?.data       ?? currentData
  const period = snapshot?.periodInfo ?? currentPeriod

  const { org, phones } = data
  const totalMissed       = phones.reduce((s, p) => s + p.missed, 0)
  const totalAtRisk       = missedRevenue(totalMissed)
  const sorted            = [...phones].sort((a, b) => b.answerRate - a.answerRate)
  const top3              = sorted.filter(p => p.answerRate > 0).slice(0, 3)
  const MEDALS            = ['🥇', '🥈', '🥉']
  const RANK_LABELS       = ['Phone Champ', '2nd Place', '3rd Place']
  const RANK_COLORS       = ['text-[#F59E0B]', 'text-[#64748b]', 'text-[#CD7F32]']
  const podiumOrder       = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3
  const totalCalls        = phones.reduce((s, p) => s + p.totalCalls, 0)
  const targetAnswered    = totalCalls * (BENCHMARKS.phone_answer_rate.target / 100)
  const currentAnswered   = phones.reduce((s, p) => s + p.answered, 0)
  const recoverableMisses = Math.max(0, Math.round(targetAnswered - currentAnswered))
  const recoverableRevenue = missedRevenue(recoverableMisses)

  // Last entry has the lowest answer rate (for "biggest gap")
  const worstLoc = sorted.filter(p => p.answerRate > 0).at(-1) ?? sorted.at(-1)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Phone Leaderboard</h1>
          <p className="text-[#64748b] text-sm mt-1 truncate">
            Answer Rate · Missed Calls · Revenue at Risk ·{' '}
            {snapshot ? <span className="text-amber-600 font-semibold">▸ {period.label}</span> : period.label}
          </p>
        </div>
        <DaysLeft period={period} />
      </div>

      {/* Hero */}
      <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">📞</span>
            <div className="min-w-0">
              <div className="text-[#0f172a] font-bold">Ring Ring — Who&apos;s Picking Up?</div>
              <div className="text-[#64748b] text-sm">Ranked by Answer Rate · Missed calls = missed revenue</div>
            </div>
          </div>
          <div className="flex gap-6 text-right shrink-0">
            <div>
              <div className={`text-2xl font-bold ${answerRateColor(org.phoneAnswerRate)}`}>{org.phoneAnswerRate}%</div>
              <div className="text-[#64748b] text-xs">Org Answer Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#64748b]">{BENCHMARKS.phone_answer_rate.target}%</div>
              <div className="text-[#64748b] text-xs">Target</div>
            </div>
          </div>
        </div>
      </div>

      {/* Org KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Total Calls</div>
          <div className="text-[#0f172a] font-bold text-xl">{totalCalls.toLocaleString()}</div>
          <div className="text-[#64748b] text-xs">{currentAnswered.toLocaleString()} answered</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Missed Calls</div>
          <div className="text-red-600 font-bold text-xl">{totalMissed.toLocaleString()}</div>
          <div className="text-[#64748b] text-xs">{totalCalls > 0 ? ((totalMissed / totalCalls) * 100).toFixed(1) : '0.0'}% miss rate</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Revenue at Risk</div>
          <div className="text-red-600 font-bold text-xl">{formatCurrency(totalAtRisk, true)}</div>
          <div className="text-[#64748b] text-xs">~${VALUE_PER_MISS}/missed call</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-lg p-4">
          <div className="text-[#64748b] text-xs">Biggest Gap</div>
          <div className="text-red-600 font-bold text-xl">{worstLoc?.code ?? '—'}</div>
          <div className="text-[#64748b] text-xs">{worstLoc ? `${worstLoc.answerRate}% answer rate` : 'No data'}</div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <>
          <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Top 3 — Best Answer Rates</h2>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center gap-3 mb-8">
            {podiumOrder.map((p) => {
              const rank = top3.indexOf(p)
              const meta = LOCATIONS.find(l => l.code === p.code)
              return (
                <div key={p.code} className={`sm:flex-1 sm:max-w-[200px] w-full rounded-xl border p-4 text-center ${
                  rank === 0 ? 'bg-amber-50 border-amber-200' :
                  rank === 1 ? 'bg-white border-[#d1dce9]' : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="text-3xl mb-1">{MEDALS[rank]}</div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${RANK_COLORS[rank]}`}>{RANK_LABELS[rank]}</div>
                  <div className="text-[#0f172a] font-bold text-sm">{p.code}</div>
                  <div className="text-[#64748b] text-xs mb-3">{meta?.name}</div>
                  <div className="flex justify-center mb-1"><CircleGauge rate={p.answerRate} /></div>
                  <div className="text-[#64748b] text-xs">{p.answered}/{p.totalCalls} calls</div>
                  {rank === 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-300 font-semibold">
                      📞 Phone Champ
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Full leaderboard */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">Full Leaderboard</h2>
      <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d1dce9]">
                {['Rank', 'Location', 'Total Calls', 'Answered', 'Missed', 'Answer Rate', 'Est. Revenue at Risk'].map(h => (
                  <th key={h} className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const meta  = LOCATIONS.find(l => l.code === p.code)
                const color = answerRateColor(p.answerRate)
                const bg    = p.answerRate >= 80 ? 'bg-green-50 border-green-200' : p.answerRate >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
                return (
                  <tr key={i} className="border-b border-[#d1dce9]/50 hover:bg-[#f1f5fb] transition-colors">
                    <td className="px-4 py-3 text-[#64748b] font-bold">#{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs px-2 py-0.5 rounded border border-[#2563eb]/20 font-bold">{p.code}</span>
                        <span className="text-[#64748b] text-xs">{meta?.name}</span>
                        {meta?.isOSB && <OSBBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#0f172a]">{p.totalCalls.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-600">{p.answered.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-600">{p.missed.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-semibold ${color} ${bg}`}>
                        {p.answerRate > 0 ? formatPct(p.answerRate) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">{p.missed > 0 ? formatCurrency(missedRevenue(p.missed)) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue at Risk callout */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💸</span>
          <div className="flex-1">
            <div className="text-red-700 font-semibold mb-3">Revenue at Risk from Missed Calls</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-red-100 rounded-lg px-4 py-3">
                <div className="text-red-800 text-2xl font-bold">{formatCurrency(totalAtRisk)}</div>
                <div className="text-red-600 text-xs font-medium mt-0.5">Total at risk MTD</div>
                <div className="text-[#94a3b8] text-xs mt-1">{totalMissed.toLocaleString()} missed calls × ${VALUE_PER_MISS}/call</div>
              </div>
              <div className="bg-white border border-red-100 rounded-lg px-4 py-3">
                <div className="text-red-800 text-2xl font-bold">{formatCurrency(recoverableRevenue)}</div>
                <div className="text-red-600 text-xs font-medium mt-0.5">Recoverable to {BENCHMARKS.phone_answer_rate.target}% target</div>
                <div className="text-[#94a3b8] text-xs mt-1">{recoverableMisses.toLocaleString()} fewer misses if org hits {BENCHMARKS.phone_answer_rate.target}%</div>
              </div>
            </div>
            <div className="bg-white border border-red-100 rounded-lg p-4">
              <div className="text-[#475569] text-xs font-semibold uppercase tracking-wider mb-3">How This Is Calculated</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-[#0f172a] text-xl font-bold">{(NP_CALL_RATE * 100).toFixed(0)}%</div>
                  <div className="text-[#64748b] text-xs font-medium">New Patient Call Rate</div>
                  <div className="text-[#94a3b8] text-xs mt-0.5">of inbound calls are prospective new patients</div>
                </div>
                <div className="text-center">
                  <div className="text-[#0f172a] text-xl font-bold">{(CLOSE_RATE * 100).toFixed(0)}%</div>
                  <div className="text-[#64748b] text-xs font-medium">Close Rate (if answered)</div>
                  <div className="text-[#94a3b8] text-xs mt-0.5">of answered new patient calls convert</div>
                </div>
                <div className="text-center">
                  <div className="text-[#0f172a] text-xl font-bold">${AVG_NP_VALUE}</div>
                  <div className="text-[#64748b] text-xs font-medium">Avg New Patient Value</div>
                  <div className="text-[#94a3b8] text-xs mt-0.5">first visit + same-day treatment</div>
                </div>
              </div>
              <div className="bg-[#f1f5fb] rounded-lg px-4 py-2.5 text-center">
                <span className="text-[#64748b] text-sm">
                  {(NP_CALL_RATE * 100).toFixed(0)}% × {(CLOSE_RATE * 100).toFixed(0)}% × ${AVG_NP_VALUE} =
                </span>
                <span className="text-[#0f172a] font-bold text-sm"> ~${VALUE_PER_MISS} expected value per missed call</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
