'use client'

import { useState } from 'react'
import { LOCATIONS, MONTHLY_GOALS, BENCHMARKS, PERIOD_INFO } from '@/lib/data'
import { formatCurrency, formatPct, getStatusHigh, getStatusLow, collectionsVsPaceStatus, pctToGoal } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import StatusBadge from '@/components/StatusBadge'
import DaysLeft from '@/components/DaysLeft'
import GoalBar from '@/components/GoalBar'

const TABS = ['ALL', 'LKW', 'LT', 'HNR', 'HNS', 'PB', 'PR', 'OSB']

type LocRow = {
  code: string; production: number; collections: number; collectionRate: number;
  newPatients: number; recareRate: number; phoneAnswerRate: number; activePatients: number;
  suppliesPct: number; status: string; isOSB?: boolean;
}

export default function LocationsClient({ locations, periodLabel, daysRemaining }: {
  locations: LocRow[]
  periodLabel: string
  daysRemaining: number
}) {
  const [activeTab, setActiveTab] = useState('ALL')
  const filtered = activeTab === 'ALL' ? locations : locations.filter(l => l.code === activeTab)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Location Detail</h1>
          <p className="text-[#64748b] text-sm mt-1">Full scorecard per location · {periodLabel}</p>
        </div>
        <DaysLeft />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-[#64748b] text-xs font-semibold uppercase tracking-wider self-center mr-1">Show:</span>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              activeTab === tab
                ? 'bg-[#2563eb] text-white border-[#2563eb]'
                : 'bg-white text-[#64748b] border-[#d1dce9] hover:text-[#0f172a]'
            }`}
          >
            {tab === 'ALL' ? 'All Locations' : `${tab} · ${LOCATIONS.find(l => l.code === tab)?.name.split(' ').slice(-1)[0] ?? tab}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(loc => {
          const meta         = LOCATIONS.find(l => l.code === loc.code)
          const goal         = MONTHLY_GOALS[loc.code] ?? 100000
          const pct          = pctToGoal(loc.collections, goal)
          const status       = collectionsVsPaceStatus(loc.collections, goal, PERIOD_INFO.daysComplete, PERIOD_INFO.totalBizDays)
          const dollarToGoal = Math.max(0, goal - loc.collections)
          const perDay       = daysRemaining > 0 ? dollarToGoal / daysRemaining : 0

          const phoneStatus    = getStatusHigh(loc.phoneAnswerRate, BENCHMARKS.phone_answer_rate.target, BENCHMARKS.phone_answer_rate.flagBelow)
          const recareStatus   = getStatusHigh(loc.recareRate, BENCHMARKS.hygiene_recare.target, BENCHMARKS.hygiene_recare.flagBelow)
          const suppliesStatus = getStatusLow(loc.suppliesPct, BENCHMARKS.supplies_pct.target, BENCHMARKS.supplies_pct.flagAbove)
          const collStatus     = getStatusHigh(Math.min(loc.collectionRate, 99), BENCHMARKS.collections_rate.target, BENCHMARKS.collections_rate.flagBelow)

          const phoneC    = { green:'text-green-400', amber:'text-amber-400', red:'text-red-400' }[phoneStatus]
          const recareC   = { green:'text-green-400', amber:'text-amber-400', red:'text-red-400' }[recareStatus]
          const suppliesC = { green:'text-green-400', amber:'text-amber-400', red:'text-red-400' }[suppliesStatus]
          const collC     = { green:'text-green-400', amber:'text-amber-400', red:'text-red-400' }[collStatus]

          return (
            <div key={loc.code} className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden">
              {loc.isOSB && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center gap-2">
                  <OSBBadge />
                  <span className="text-amber-400/70 text-xs">Manual source — Dental Intel, not Dentrix Ascend</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#2563eb]/15 text-[#2563eb] text-xs font-bold px-2 py-0.5 rounded border border-[#2563eb]/20">{loc.code}</span>
                      <StatusBadge status={status} dot />
                    </div>
                    <div className="text-[#0f172a] font-semibold">{meta?.name}</div>
                    <div className="text-[#64748b] text-xs">{meta?.brand}</div>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <div className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-2">Revenue</div>
                <div className="grid grid-cols-3 gap-3 mb-1">
                  <div>
                    <div className="text-[#64748b] text-xs">Production MTD</div>
                    <div className="text-[#0f172a] font-bold">{formatCurrency(loc.production, true)}</div>
                  </div>
                  <div>
                    <div className="text-[#64748b] text-xs">Collections MTD</div>
                    <div className="text-[#0f172a] font-bold">{formatCurrency(loc.collections, true)}</div>
                    <div className="text-[#64748b] text-xs">Goal {formatCurrency(goal, true)}</div>
                  </div>
                  <div>
                    <div className="text-[#64748b] text-xs">Coll. Rate</div>
                    <div className={`font-bold ${collC}`}>{formatPct(Math.min(loc.collectionRate, 99))}</div>
                  </div>
                </div>

                <div className="mb-1">
                  <GoalBar pct={pct} height="thin" />
                </div>
                <div className="flex justify-between text-xs mb-4">
                  <span className={`font-semibold ${{ green:'text-green-400', amber:'text-amber-400', red:'text-red-400' }[status]}`}>{pct}% to goal</span>
                  {dollarToGoal > 0 && (
                    <span className="text-[#64748b]">{formatCurrency(dollarToGoal, true)} to go · <span className="text-[#64748b]">{formatCurrency(perDay, true)}/day needed</span></span>
                  )}
                </div>

                <div className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-2">Patients</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-[#64748b] text-xs">New Patients MTD</div>
                    <div className="text-[#0f172a] font-bold text-lg">{loc.newPatients}</div>
                  </div>
                  <div>
                    <div className="text-[#64748b] text-xs">Active Patients</div>
                    <div className="text-[#0f172a] font-bold text-lg">{loc.activePatients.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-2">Operations</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-lg border p-3 ${suppliesStatus === 'red' ? 'bg-red-500/8 border-red-500/20' : suppliesStatus === 'amber' ? 'bg-amber-500/8 border-amber-500/20' : 'bg-green-500/8 border-green-500/20'}`}>
                    <div className="text-[#64748b] text-xs">Supplies %</div>
                    <div className={`font-bold text-lg ${suppliesC}`}>{loc.suppliesPct}%</div>
                    <div className="text-[#64748b] text-xs">Target &lt;6%</div>
                  </div>
                  <div className={`rounded-lg border p-3 ${phoneStatus === 'red' ? 'bg-red-500/8 border-red-500/20' : phoneStatus === 'amber' ? 'bg-amber-500/8 border-amber-500/20' : 'bg-green-500/8 border-green-500/20'}`}>
                    <div className="text-[#64748b] text-xs">Phone Answer</div>
                    <div className={`font-bold text-lg ${phoneC}`}>{formatPct(loc.phoneAnswerRate)}</div>
                    <div className="text-[#64748b] text-xs">Target &gt;80%</div>
                  </div>
                  <div className={`rounded-lg border p-3 col-span-2 ${recareStatus === 'red' ? 'bg-red-500/8 border-red-500/20' : recareStatus === 'amber' ? 'bg-amber-500/8 border-amber-500/20' : 'bg-green-500/8 border-green-500/20'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[#64748b] text-xs">Hygiene Recare</div>
                        <div className={`font-bold text-lg ${recareC}`}>{formatPct(loc.recareRate)}</div>
                      </div>
                      <div className="text-[#64748b] text-xs">Target 85%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
