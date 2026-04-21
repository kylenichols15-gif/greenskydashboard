export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export type StatusLevel = 'green' | 'amber' | 'red'

export function getStatusColor(level: StatusLevel): string {
  switch (level) {
    case 'green': return '#10B981'
    case 'amber': return '#F59E0B'
    case 'red':   return '#EF4444'
  }
}

export function getStatusBg(level: StatusLevel): string {
  switch (level) {
    case 'green': return 'bg-green-50 text-green-700 border-green-200'
    case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'red':   return 'bg-red-50 text-red-700 border-red-200'
  }
}

// For metrics where higher is better (e.g. phone answer rate, recare rate)
export function getStatusHigh(value: number, target: number, flagBelow: number): StatusLevel {
  if (value >= target) return 'green'
  const threshold5 = flagBelow + (target - flagBelow) * 0.05
  if (value >= flagBelow) return 'amber'
  return 'red'
}

// For metrics where lower is better (e.g. supplies %)
export function getStatusLow(value: number, target: number, flagAbove: number): StatusLevel {
  if (value <= target) return 'green'
  if (value <= flagAbove) return 'amber'
  return 'red'
}

// Legacy — kept for any callers that still need it
export function locationStatus(status: string): StatusLevel {
  if (status === 'on_pace') return 'green'
  if (status === 'behind')  return 'amber'
  return 'red'
}

// Compute location status from actual collections vs. pace — this is the source of truth.
// Green = at/ahead of pace. Amber = within 15% of pace. Red = >15% behind pace.
export function collectionsVsPaceStatus(
  collections: number,
  goal: number,
  daysComplete: number,
  totalBizDays: number,
): StatusLevel {
  const pct     = (collections / goal) * 100
  const pacePct = (daysComplete / totalBizDays) * 100
  if (pct >= pacePct)            return 'green'
  const ratio = pct / pacePct
  if (ratio >= 0.85)             return 'amber'
  return 'red'
}

export function pctToGoal(current: number, goal: number): number {
  return Math.round((current / goal) * 100)
}
