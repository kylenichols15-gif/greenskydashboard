'use client'

import { useState } from 'react'
import { DEMO_DATA, LOCATIONS } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

type TabType = 'Doctor' | 'Hygienist'

function getLocationName(code: string) {
  return LOCATIONS.find(l => l.code === code)?.name ?? code
}

export default function ProvidersPage() {
  const [tab, setTab] = useState<TabType>('Doctor')

  const doctors    = DEMO_DATA.providers.filter(p => p.type === 'Doctor')
  const hygienists = DEMO_DATA.providers.filter(p => p.type === 'Hygienist')

  const providers  = tab === 'Doctor' ? doctors : hygienists
  const avgProd    = providers.reduce((s, p) => s + p.grossProd, 0) / (providers.length || 1)

  function rowClass(grossProd: number) {
    if (grossProd > avgProd * 1.10) return 'bg-green-500/5'
    if (grossProd < avgProd * 0.85) return 'bg-red-500/5'
    return ''
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#F1F5F9] text-2xl font-bold">Providers</h1>
        <p className="text-[#64748B] text-sm mt-1">April 2026 · Demo Data</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0D1629] border border-[#1E2A3A] rounded-lg p-1 w-fit">
        {(['Doctor', 'Hygienist'] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-[#0A9E8A] text-white'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            {t === 'Doctor' ? 'Doctors' : 'Hygienists'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'Doctor' ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2A3A]">
                  {['Provider', 'Location', 'MTD Production', 'Collections', 'Prod/Day', 'Days', 'YTD Production', 'Status'].map(h => (
                    <th key={h} className="text-left text-[#64748B] text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...doctors].sort((a, b) => b.grossProd - a.grossProd).map((p, i) => {
                  const isHigh = p.grossProd > avgProd * 1.10
                  const isLow  = p.grossProd < avgProd * 0.85
                  return (
                    <tr key={i} className={`border-b border-[#1E2A3A]/50 hover:bg-[#111827] transition-colors ${rowClass(p.grossProd)}`}>
                      <td className="px-4 py-3 text-[#F1F5F9] font-medium">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-xs px-2 py-0.5 rounded border border-[#0A9E8A]/20 font-medium">
                          {p.locationCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#F1F5F9] font-semibold">{formatCurrency(p.grossProd)}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{formatCurrency(p.collections)}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{formatCurrency(p.prodPerDay ?? 0)}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{p.daysWorked ?? '—'}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{formatCurrency(p.ytdProd ?? 0)}</td>
                      <td className="px-4 py-3">
                        {isHigh && <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">Above avg</span>}
                        {isLow  && <span className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">Below avg</span>}
                        {!isHigh && !isLow && <span className="text-xs text-[#64748B]">On track</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2A3A]">
                  {['Provider', 'Location', 'MTD Production', 'Collections', 'Hours', 'Prod/Hr', 'Status'].map(h => (
                    <th key={h} className="text-left text-[#64748B] text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...hygienists].sort((a, b) => b.grossProd - a.grossProd).map((p, i) => {
                  const isHigh = p.grossProd > avgProd * 1.10
                  const isLow  = p.grossProd < avgProd * 0.85
                  return (
                    <tr key={i} className={`border-b border-[#1E2A3A]/50 hover:bg-[#111827] transition-colors ${rowClass(p.grossProd)}`}>
                      <td className="px-4 py-3 text-[#F1F5F9] font-medium">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#0A9E8A]/10 text-[#0A9E8A] text-xs px-2 py-0.5 rounded border border-[#0A9E8A]/20 font-medium">
                          {p.locationCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#F1F5F9] font-semibold">{formatCurrency(p.grossProd)}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{formatCurrency(p.collections)}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{p.hoursWorked ?? '—'}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">${p.prodPerHr ?? '—'}/hr</td>
                      <td className="px-4 py-3">
                        {isHigh && <span className="text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">Above avg</span>}
                        {isLow  && <span className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">Below avg</span>}
                        {!isHigh && !isLow && <span className="text-xs text-[#64748B]">On track</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <p className="text-[#3A4A5A] text-xs mt-3">Row highlights: green = &gt;10% above avg · red = &gt;15% below avg · Compensation data not shown.</p>
    </div>
  )
}
