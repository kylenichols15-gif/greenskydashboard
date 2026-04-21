'use client'
import { PERIOD_INFO } from '@/lib/data'

interface GoalBarProps {
  pct: number           // actual % vs goal (0–120+)
  barMax?: number       // bar scale ceiling — 100 for standard, 120 for bonus race
  height?: 'thin' | 'medium' | 'thick'  // h-1.5 | h-2.5 | h-4
  color?: string        // override fill color (hex)
  showMarker?: boolean  // default true
  className?: string
}

const heightClass = { thin: 'h-1.5', medium: 'h-2.5', thick: 'h-4' }

function defaultColor(pct: number) {
  if (pct >= 100) return '#10B981'
  if (pct >= 80)  return '#0A9E8A'
  if (pct >= 60)  return '#F59E0B'
  return '#EF4444'
}

export default function GoalBar({
  pct,
  barMax = 100,
  height = 'thin',
  color,
  showMarker = true,
  className = '',
}: GoalBarProps) {
  const { daysComplete, totalBizDays } = PERIOD_INFO
  const pacePct      = (daysComplete / totalBizDays) * 100   // e.g. 68.18 % through period
  const fillWidth    = Math.min((pct   / barMax) * 100, 100) // fill % of bar width
  const markerLeft   = Math.min((pacePct / barMax) * 100, 99) // pace line % of bar width
  const fillColor    = color ?? defaultColor(pct)
  const hClass       = heightClass[height]

  // Is the fill already past the marker? Use white line so it pops
  const markerColor  = fillWidth >= markerLeft ? 'rgba(255,255,255,0.85)' : '#64748b'

  return (
    <div className={`relative ${className}`} style={{ paddingTop: 14 }}>
      {/* Pace label + triangle above the bar */}
      {showMarker && (
        <div
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${markerLeft}%`, transform: 'translateX(-50%)' }}
        >
          <span
            className="text-[9px] font-bold uppercase tracking-wide leading-none whitespace-nowrap"
            style={{ color: '#94a3b8' }}
          >
            pace
          </span>
          {/* Downward triangle */}
          <div
            style={{
              width: 0, height: 0,
              borderLeft: '3.5px solid transparent',
              borderRight: '3.5px solid transparent',
              borderTop: '4px solid #94a3b8',
              marginTop: 1,
            }}
          />
        </div>
      )}

      {/* Track (no overflow-hidden so marker line can extend) */}
      <div className={`relative ${hClass} bg-[#f1f5fb] rounded-full`}>
        {/* Fill bar */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${fillWidth}%`, backgroundColor: fillColor }}
        />

        {/* Pace marker line (inside bar) */}
        {showMarker && (
          <div
            className="absolute top-0 h-full"
            style={{
              left:      `${markerLeft}%`,
              width:     2,
              transform: 'translateX(-50%)',
              backgroundColor: markerColor,
              boxShadow: '0 0 2px rgba(0,0,0,0.25)',
              zIndex: 10,
              borderRadius: 1,
            }}
          />
        )}
      </div>
    </div>
  )
}
