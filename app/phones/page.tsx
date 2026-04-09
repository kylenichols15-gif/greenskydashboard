import { DEMO_DATA, BENCHMARKS, LOCATIONS } from '@/lib/data'
import { formatCurrency, formatPct, getStatusHigh } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'

function answerRateColor(rate: number) {
  if (rate >= BENCHMARKS.phone_answer_rate.target)       return 'text-green-400'
  if (rate >= BENCHMARKS.phone_answer_rate.flagBelow)    return 'text-amber-400'
  return 'text-red-400'
}
function answerRateBg(rate: number) {
  if (rate >= BENCHMARKS.phone_answer_rate.target)       return 'bg-green-500/10 border-green-500/20'
  if (rate >= BENCHMARKS.phone_answer_rate.flagBelow)    return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

export default function PhonesPage() {
  const { org, phones } = DEMO_DATA
  const totalMissedRevenue = phones.reduce((s, p) => s + p.estMissedRevenue, 0)
  const orgStatus = getStatusHigh(org.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
  const gaugePct  = Math.min(org.phoneAnswerRate, 100)

  const gaugeColor = orgStatus === 'green' ? '#10B981' : orgStatus === 'amber' ? '#F59E0B' : '#EF4444'

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#F1F5F9] text-2xl font-bold">Phones</h1>
        <p className="text-[#64748B] text-sm mt-1">April 2026 · Mango Voice · Demo Data</p>
      </div>

      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-1 bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Org Answer Rate</div>
          <div className="text-5xl font-bold mb-1" style={{ color: gaugeColor }}>{org.phoneAnswerRate}%</div>
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-[#64748B] mb-1">
              <span>0%</span>
              <span className="text-[#94A3B8]">Target: {BENCHMARKS.phone_answer_rate.target}%</span>
              <span>100%</span>
            </div>
            <div className="relative h-3 bg-[#1E2A3A] rounded-full overflow-visible">
              <div className="h-full rounded-full transition-all" style={{ width: `${gaugePct}%`, backgroundColor: gaugeColor }} />
              {/* Target marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#94A3B8] rounded-full opacity-60"
                style={{ left: `${BENCHMARKS.phone_answer_rate.target}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-6">
          <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Total Calls This Month</div>
          <div className="text-3xl font-bold text-[#F1F5F9]">{phones.reduce((s, p) => s + p.totalCalls, 0).toLocaleString()}</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-green-400 font-semibold">{phones.reduce((s, p) => s + p.answered, 0).toLocaleString()}</div>
              <div className="text-[#64748B] text-xs">Answered</div>
            </div>
            <div>
              <div className="text-red-400 font-semibold">{phones.reduce((s, p) => s + p.missed, 0).toLocaleString()}</div>
              <div className="text-[#64748B] text-xs">Missed</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-6">
          <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Est. Revenue at Risk</div>
          <div className="text-3xl font-bold text-red-400">{formatCurrency(totalMissedRevenue, true)}/mo</div>
          <div className="text-[#64748B] text-xs mt-2">Based on {phones.reduce((s, p) => s + p.missed, 0).toLocaleString()} missed calls × $80 avg new patient value</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2A3A]">
                {['Code', 'Location', 'Total Calls', 'Answered', 'Missed', 'Answer Rate', 'Est. Revenue at Risk'].map(h => (
                  <th key={h} className="text-left text-[#64748B] text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...phones].sort((a, b) => a.answerRate - b.answerRate).map((p, i) => {
                const meta  = LOCATIONS.find(l => l.code === p.code)
                const color = answerRateColor(p.answerRate)
                const bg    = answerRateBg(p.answerRate)
                return (
                  <tr key={i} className="border-b border-[#1E2A3A]/50 hover:bg-[#111827] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-xs px-2 py-0.5 rounded border border-[#0A9E8A]/20 font-bold">{p.code}</span>
                        {meta?.isOSB && <OSBBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#94A3B8]">{meta?.name ?? p.code}</td>
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

      {/* Callout */}
      <div className="bg-red-500/8 border border-red-500/20 rounded-lg p-5">
        <p className="text-red-300 text-sm leading-relaxed">
          Based on current missed call volume, GreenSky is leaving an estimated{' '}
          <strong className="text-red-200">{formatCurrency(totalMissedRevenue)}/month</strong> in new patient revenue on the table.
          At {BENCHMARKS.phone_answer_rate.target}% answer rate, that gap closes to under{' '}
          <strong className="text-red-200">$15,000/month</strong>.
          LKW alone ({formatPct(phones.find(p => p.code === 'LKW')?.answerRate ?? 0)} answer rate) accounts for{' '}
          <strong className="text-red-200">{formatCurrency(phones.find(p => p.code === 'LKW')?.estMissedRevenue ?? 0)}</strong> of that gap.
        </p>
      </div>
    </div>
  )
}
