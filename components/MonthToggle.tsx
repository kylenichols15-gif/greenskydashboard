'use client'

import { useMonth } from '@/lib/contexts/MonthContext'
import { HISTORICAL_MONTHS } from '@/lib/history'
import { PERIOD_INFO } from '@/lib/data'

// Short label for each historical month pill
function shortLabel(label: string): string {
  // "January 2026" → "Jan"
  return label.split(' ')[0].slice(0, 3)
}

export default function MonthToggle() {
  const { selectedKey, setSelectedKey } = useMonth()

  const currentLabel = `${PERIOD_INFO.label.split(' ')[0].slice(0, 3)}`

  const activeLabel = selectedKey
    ? HISTORICAL_MONTHS.find(m => m.key === selectedKey)?.periodInfo.label ?? ''
    : `${PERIOD_INFO.label} · BD${PERIOD_INFO.daysComplete}`

  return (
    <div className="px-3 pt-3 pb-1 border-t border-[#d1dce9]">
      <div className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider mb-2 px-1">
        Period
      </div>

      {/* Pill row */}
      <div className="flex flex-wrap gap-1 mb-2">
        {HISTORICAL_MONTHS.map(m => {
          const active = selectedKey === m.key
          return (
            <button
              key={m.key}
              onClick={() => setSelectedKey(active ? null : m.key)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                active
                  ? 'bg-[#2563eb] text-white border-[#2563eb]'
                  : 'bg-[#f1f5fb] text-[#64748b] border-[#d1dce9] hover:bg-[#dde6f2] hover:text-[#0f172a]'
              }`}
            >
              {shortLabel(m.periodInfo.label)}
            </button>
          )
        })}
        {/* Live / current pill */}
        <button
          onClick={() => setSelectedKey(null)}
          className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
            selectedKey === null
              ? 'bg-[#2563eb] text-white border-[#2563eb]'
              : 'bg-[#f1f5fb] text-[#64748b] border-[#d1dce9] hover:bg-[#dde6f2] hover:text-[#0f172a]'
          }`}
        >
          {currentLabel}
        </button>
      </div>

      {/* Active month label */}
      <div className="text-[#64748b] text-[11px] px-1 truncate">
        {selectedKey ? (
          <span className="text-amber-600 font-medium">▸ {activeLabel} — FINAL</span>
        ) : (
          <span>{activeLabel}</span>
        )}
      </div>
    </div>
  )
}
