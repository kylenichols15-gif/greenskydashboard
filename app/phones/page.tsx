import { BENCHMARKS, LOCATIONS } from '@/lib/data'
import { getData } from '@/lib/getData'
import { formatCurrency, formatPct, getStatusHigh } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'

function answerRateColor(rate: number) {
  if (rate >= BENCHMARKS.phone_answer_rate.target)    return 'text-green-400'
  if (rate >= BENCHMARKS.phone_answer_rate.flagBelow) return 'text-amber-400'
  return 'text-red-400'
}

function CircleGauge({ rate }: { rate: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const fill = (rate / 100) * circ
  const color = rate >= 80 ? '#10B981' : rate >= 70 ? '#F59E0B' : '#EF4444'

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1E2A3A" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="40" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
        {rate.toFixed(1)}%
      </text>
    </svg>
  )
}

export default async function PhonesPage() {
  const data = await getData()
  const { org, phones } = data
  const totalMissed = phones.reduce((s, p) => s + p.estMissedRevenue, 0)
  const sorted = [...phones].sort((a, b) => b.answerRate - a.answerRate)

  // Top 3
  const top3 = sorted.slice(0, 3)
  const MEDALS = ['🥇', '🥈', '🥉']
  const RANK_LABELS = ['Phone Champ', '2nd Place', '3rd Place']
  const RANK_COLORS = ['text-[#F59E0B]', 'text-[#94A3B8]', 'text-[#CD7F32]']
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[#F1F5F9] text-2xl font-bold">Phone Leaderboard</h1>
          <p className="text-[#64748B] text-sm mt-1">Answer Rate · Missed Calls · Revenue at Risk · April 2026</p>
        </div>
        <DaysLeft />
      </div>

      {/* Hero */}
      <div className="bg-[#0D2B45] border border-[#0A9E8A]/20 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📞</span>
          <div>
            <div className="text-[#F1F5F9] font-bold">Ring Ring — Who's Picking Up the Phone?</div>
            <div className="text-[#64748B] text-sm">Ranked by Answer Rate · Missed calls = missed revenue</div>
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className={`text-2xl font-bold ${answerRateColor(org.phoneAnswerRate)}`}>{org.phoneAnswerRate}%</div>
            <div className="text-[#64748B] text-xs">Org Answer Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#94A3B8]">{BENCHMARKS.phone_answer_rate.target}%</div>
            <div className="text-[#64748B] text-xs">Target</div>
          </div>
        </div>
      </div>

      {/* Org KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Total Calls</div>
          <div className="text-[#F1F5F9] font-bold text-xl">{phones.reduce((s,p) => s + p.totalCalls, 0).toLocaleString()}</div>
          <div className="text-[#64748B] text-xs">{phones.reduce((s,p) => s + p.answered, 0).toLocaleString()} answered</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Missed Calls</div>
          <div className="text-red-400 font-bold text-xl">{phones.reduce((s,p) => s + p.missed, 0).toLocaleString()}</div>
          <div className="text-[#64748B] text-xs">{((phones.reduce((s,p) => s + p.missed, 0) / phones.reduce((s,p) => s + p.totalCalls, 0)) * 100).toFixed(1)}% miss rate</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Revenue at Risk</div>
          <div className="text-red-400 font-bold text-xl">{formatCurrency(totalMissed, true)}</div>
          <div className="text-[#64748B] text-xs">~$80/missed call</div>
        </div>
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-4">
          <div className="text-[#64748B] text-xs">Biggest Gap</div>
          <div className="text-red-400 font-bold text-xl">{sorted[sorted.length - 1].code}</div>
          <div className="text-[#64748B] text-xs">{sorted[sorted.length-1].answerRate}% answer rate</div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Top 3 — Best Answer Rates</h2>
      <div className="flex items-end justify-center gap-3 mb-8">
        {podiumOrder.map((p) => {
          const rank = top3.indexOf(p)
          const meta = LOCATIONS.find(l => l.code === p.code)
          return (
            <div
              key={p.code}
              className={`flex-1 max-w-[200px] rounded-xl border p-4 text-center ${
                rank === 0 ? 'bg-[#F59E0B]/8 border-[#F59E0B]/30' :
                rank === 1 ? 'bg-[#94A3B8]/5 border-[#94A3B8]/20' :
                'bg-[#CD7F32]/8 border-[#CD7F32]/30'
              }`}
              style={{ transform: rank === 0 ? 'scale(1.04)' : 'none' }}
            >
              <div className="text-3xl mb-1">{MEDALS[rank]}</div>
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${RANK_COLORS[rank]}`}>{RANK_LABELS[rank]}</div>
              <div className="text-[#F1F5F9] font-bold text-sm">{p.code}</div>
              <div className="text-[#64748B] text-xs mb-3">{meta?.name}</div>
              <div className="flex justify-center mb-1"><CircleGauge rate={p.answerRate} /></div>
              <div className="text-[#64748B] text-xs">{p.answered}/{p.totalCalls} calls</div>
              {rank === 0 && (
                <div className="mt-2 inline-flex items-center gap-1 bg-[#F59E0B]/15 text-[#F59E0B] text-xs px-2 py-0.5 rounded-full border border-[#F59E0B]/25 font-semibold">
                  📞 Phone Champ
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Full leaderboard */}
      <h2 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-4">Full Leaderboard</h2>
      <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2A3A]">
                {['Rank', 'Location', 'Total Calls', 'Answered', 'Missed', 'Answer Rate', 'Est. Revenue at Risk'].map(h => (
                  <th key={h} className="text-left text-[#64748B] text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const meta  = LOCATIONS.find(l => l.code === p.code)
                const color = answerRateColor(p.answerRate)
                const bg    = p.answerRate >= 80 ? 'bg-green-500/10 border-green-500/20' : p.answerRate >= 70 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'
                return (
                  <tr key={i} className="border-b border-[#1E2A3A]/50 hover:bg-[#111827] transition-colors">
                    <td className="px-4 py-3 text-[#64748B] font-bold">#{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-xs px-2 py-0.5 rounded border border-[#0A9E8A]/20 font-bold">{p.code}</span>
                        <span className="text-[#94A3B8] text-xs">{meta?.name}</span>
                        {meta?.isOSB && <OSBBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#F1F5F9]">{p.totalCalls.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-400">{p.answered.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-400">{p.missed.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-semibold ${color} ${bg}`}>
                        {formatPct(p.answerRate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-400 font-medium">{formatCurrency(p.estMissedRevenue)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue callout */}
      <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💸</span>
          <div>
            <div className="text-red-300 font-semibold mb-1">Revenue at Risk from Missed Calls</div>
            <div className="text-red-200 text-2xl font-bold mb-1">{formatCurrency(totalMissed)}/month</div>
            <div className="text-red-300/70 text-sm">
              {phones.reduce((s,p) => s + p.missed, 0).toLocaleString()} missed calls MTD · Every missed call = ~$80 in potential new patient revenue.
              {' '}Getting to {BENCHMARKS.phone_answer_rate.target}% org-wide would recover an estimated <strong className="text-red-200">{formatCurrency(totalMissed * 0.6)}/month</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
