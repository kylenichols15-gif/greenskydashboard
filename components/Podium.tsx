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
const RANK_COLORS = ['text-[#F59E0B]', 'text-[#94A3B8]', 'text-[#CD7F32]']
const RANK_BORDERS = ['border-[#F59E0B]/30', 'border-[#94A3B8]/20', 'border-[#CD7F32]/30']
const RANK_BG = ['bg-[#F59E0B]/8', 'bg-[#94A3B8]/5', 'bg-[#CD7F32]/8']

export default function Podium({ entries }: PodiumProps) {
  const top3 = entries.slice(0, 3)
  // Reorder for podium display: 2nd, 1st, 3rd
  const display = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <div className="flex items-end justify-center gap-3 mb-8">
      {display.map((entry, displayIdx) => {
        const rank = top3.indexOf(entry) // 0,1,2
        const isChamp = rank === 0
        const loc = LOCATIONS.find(l => l.code === entry.locationCode)

        return (
          <div
            key={entry.name}
            className={`flex-1 max-w-[220px] rounded-xl border p-4 text-center ${RANK_BG[rank]} ${RANK_BORDERS[rank]} ${isChamp ? 'mb-0' : 'mb-0'}`}
            style={{ transform: isChamp ? 'scale(1.04)' : 'none' }}
          >
            <div className="text-3xl mb-1">{MEDALS[rank]}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${RANK_COLORS[rank]}`}>
              {RANK_LABELS[rank]}
            </div>
            <div className="text-[#F1F5F9] font-bold text-sm leading-tight">{entry.name}</div>
            <div className="text-[#64748B] text-xs mb-3">{loc?.name ?? entry.locationCode}</div>
            <div className={`text-2xl font-bold ${RANK_COLORS[rank]}`}>{entry.primaryValue}</div>
            <div className="text-[#64748B] text-xs">{entry.primaryLabel}</div>
            {entry.secondaryValue && (
              <div className="mt-1 text-[#94A3B8] text-xs">{entry.secondaryValue} {entry.secondaryLabel}</div>
            )}
            {isChamp && (
              <div className="mt-2 inline-flex items-center gap-1 bg-[#F59E0B]/15 text-[#F59E0B] text-xs px-2 py-0.5 rounded-full border border-[#F59E0B]/25 font-semibold">
                🏆 Champion
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
