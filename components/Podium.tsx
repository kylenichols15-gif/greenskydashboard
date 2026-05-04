import { LOCATIONS } from '@/lib/data'

interface PodiumEntry {
  name: string
  locationCode: string
  primaryValue: string
  primaryLabel: string
  secondaryValue?: string
  secondaryLabel?: string
}

interface PodiumProps {
  entries: PodiumEntry[]
}

const MEDALS = ['🥇', '🥈', '🥉']
const RANK_LABELS = ['Champion', '2nd Place', '3rd Place']
const RANK_COLORS = ['text-[#F59E0B]', 'text-[#64748b]', 'text-[#CD7F32]']
const RANK_BORDERS = ['border-amber-200', 'border-[#d1dce9]', 'border-orange-200']
const RANK_BG = ['bg-amber-50', 'bg-white', 'bg-orange-50']

export default function Podium({ entries }: PodiumProps) {
  const top3 = entries.slice(0, 3)
  // Reorder for podium display: 2nd, 1st, 3rd
  const display = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center gap-3 mb-8">
      {display.map((entry) => {
        const rank = top3.indexOf(entry) // 0,1,2
        const isChamp = rank === 0
        const loc = LOCATIONS.find(l => l.code === entry.locationCode)
        const orderClass = rank === 0 ? 'order-1 sm:order-none' : rank === 1 ? 'order-2 sm:order-none' : 'order-3 sm:order-none'

        return (
          <div
            key={entry.name}
            className={`w-full sm:flex-1 sm:max-w-[220px] rounded-xl border p-4 text-center ${RANK_BG[rank]} ${RANK_BORDERS[rank]} ${orderClass}`}
          >
            <div className="text-3xl mb-1">{MEDALS[rank]}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${RANK_COLORS[rank]}`}>
              {RANK_LABELS[rank]}
            </div>
            <div className="text-[#0f172a] font-bold text-sm leading-tight">{entry.name}</div>
            <div className="text-[#64748b] text-xs mb-3">{loc?.name ?? entry.locationCode}</div>
            <div className={`text-2xl font-bold ${RANK_COLORS[rank]}`}>{entry.primaryValue}</div>
            <div className="text-[#64748b] text-xs">{entry.primaryLabel}</div>
            {entry.secondaryValue && (
              <div className="mt-1 text-[#64748b] text-xs">{entry.secondaryValue} {entry.secondaryLabel}</div>
            )}
            {isChamp && (
              <div className="mt-2 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-300 font-semibold">
                🏆 Champion
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
