'use client'
import { PERIOD_INFO } from '@/lib/data'

interface GoalBarProps {
  pct: number           // actual % vs goal (0–120+)
  barMax?: number       // bar scale ceiling — 100 for standard, 120 for bonus race
  height?: 'thin' | 'medium' | 'thick'  // h-1.5 | h-2.5 | h-4
  color?: string        // override fill color (hex) — skips pace-relative logic
  showMarker?: boolean  // default true
  className?: string
}

const heightClass = { thin: 'h-1.5', medium: 'h-2.5', thick: 'h-4' }

// Color reflects performance vs. current pace, not fixed absolute thresholds.
// ratio = actual% / pace% — are you keeping up with where you should be?
function paceColor(pct: number, pacePct: number) {
  if (pct >= 100)             return '#10B981'  // goal complete — bright green
  if (pct >= pacePct)         return '#10B981'  // at or ahead of pace — green
  const ratio = pct / pacePct
  if (ratio >= 0.92)          return '#F59E0B'  // within 8% of pace — amber
  if (ratio >= 0.78)          return '#F97316'  // 8–22% behind pace — orange
  return '#EF4444'                              // >22% behind pace — red
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
  const pacePct    = (daysComplete / totalBizDays) * 100    // % through the period
  const fillWidth  = Math.min((pct    / barMax) * 100, 100) // fill % of bar width
  const markerLeft = Math.min((pacePct / barMax) * 100, 99) // pace line % of bar width
  const fillColor  = color ?? paceColor(pct, pacePct)
  const hClass     = heightClass[height]

  // White line when fill has passed the marker, slate otherwise
  const markerColor = fillWidth >= markerLeft ? 'rgba(255,255,255,0.85)' : '#64748b'

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

      {/* Track */}
      <div className={`relative ${hClass} bg-[#f1f5fb] rounded-full`}>
        {/* Fill bar */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${fillWidth}%`, backgroundColor: fillColor }}
        />

        {/* Pace marker line */}
        {showMarker && (
          <div
            className="absolute top-0 h-full"
            style={{
              left:            `${markerLeft}%`,
              width:           2,
              transform:       'translateX(-50%)',
              backgroundColor: markerColor,
              boxShadow:       '0 0 2px rgba(0,0,0,0.25)',
              zIndex:          10,
              borderRadius:    1,
            }}
          />
        )}
      </div>
    </div>
  )
}
