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
    case 'green': return 'bg-green-500/10 text-green-400 border-green-500/20'
    case 'amber': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'red':   return 'bg-red-500/10 text-red-400 border-red-500/20'
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

export function locationStatus(status: string): StatusLevel {
  if (status === 'on_pace') return 'green'
  if (status === 'behind')  return 'amber'
  return 'red'
}

export function pctToGoal(current: number, goal: number): number {
  return Math.round((current / goal) * 100)
}
