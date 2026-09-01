'use client'

import { DAILY_LEADERBOARD, LOCATIONS } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

type Row = { name: string; locationCode: string; dailyProd: number }

// Team colors per location — gives the board a "team jersey" feel
const TEAM: Record<string, { bg: string; text: string; ring: string }> = {
  LKW: { bg: 'bg-blue-100',    text: 'text-blue-700',    ring: 'ring-blue-300'    },
  LT:  { bg: 'bg-violet-100',  text: 'text-violet-700',  ring: 'ring-violet-300'  },
  HNR: { bg: 'bg-teal-100',    text: 'text-teal-700',    ring: 'ring-teal-300'    },
  HNS: { bg: 'bg-orange-100',  text: 'text-orange-700',  ring: 'ring-orange-300'  },
  HNK: { bg: 'bg-pink-100',    text: 'text-pink-700',    ring: 'ring-pink-300'    },
  PB:  { bg: 'bg-green-100',   text: 'text-green-700',   ring: 'ring-green-300'   },
  PR:  { bg: 'bg-red-100',     text: 'text-red-700',     ring: 'ring-red-300'     },
  OSB: { bg: 'bg-indigo-100',  text: 'text-indigo-700',  ring: 'ring-indigo-300'  },
}

const CHASE_TITLES = ['💪 In the hunt', '🚀 Climbing', '⚡ Pushing', '🎯 On the board', '🔧 Grinding', '📈 Building']

type Accent = {
  title: string; border: string; glow: string; heroBg: string
  heroText: string; num: string; leadBadge: string
}
const ACCENTS: Record<'doctors' | 'hygienists', Accent> = {
  doctors: {
    title:   'from-amber-500 via-orange-500 to-rose-500',
    border:  'from-amber-300 via-orange-400 to-rose-400',
    glow:    'lb-glow',
    heroBg:  'from-amber-50 to-orange-50',
    heroText:'text-orange-500',
    num:     'from-amber-500 to-rose-500',
    leadBadge:'text-orange-600 bg-orange-100',
  },
  hygienists: {
    title:   'from-sky-500 via-indigo-500 to-violet-500',
    border:  'from-sky-300 via-indigo-400 to-violet-400',
    glow:    'lb-glow-cool',
    heroBg:  'from-sky-50 to-indigo-50',
    heroText:'text-indigo-500',
    num:     'from-sky-500 to-indigo-500',
    leadBadge:'text-indigo-600 bg-indigo-100',
  },
}

function locName(code: string) { return LOCATIONS.find(l => l.code === code)?.name ?? code }
function firstName(name: string) { const p = name.split(','); return p.length > 1 ? p[1].trim() : name }
function rankList(rows: Row[]) { return [...rows].filter(r => r.dailyProd > 0).sort((a, b) => b.dailyProd - a.dailyProd) }

function Board({ kind, label, emoji, rows }: { kind: 'doctors' | 'hygienists'; label: string; emoji: string; rows: Row[] }) {
  const a = ACCENTS[kind]
  const ranked = rankList(rows)
  const champ = ranked[0], second = ranked[1], third = ranked[2]
  const chase = ranked.slice(3)
  const dayTotal = ranked.reduce((s, r) => s + r.dailyProd, 0)
  const lead = champ && second ? champ.dailyProd - second.dailyProd : 0
  const unit = kind === 'doctors' ? 'docs' : 'RDH'

  return (
    <div className="lb-pop">
      {/* Column header */}
      <div className="text-center mb-4">
        <div className={`text-2xl font-black bg-gradient-to-r ${a.title} bg-clip-text text-transparent`}>
          {emoji} {label}
        </div>
      </div>

      {!champ && (
        <div className="text-center text-[#94a3b8] py-12 text-sm">No production logged yet.</div>
      )}

      {champ && (
        <>
          {/* Champion hero */}
          <div className={`relative mb-5 rounded-3xl p-[2px] bg-gradient-to-br ${a.border} ${a.glow}`}>
            <div className={`relative rounded-3xl bg-gradient-to-br ${a.heroBg} px-4 py-5 text-center overflow-hidden`}>
              <div className="absolute inset-0 lb-shine pointer-events-none" />
              <div className="text-5xl lb-float mb-1">👑</div>
              <div className={`text-[10px] font-black uppercase tracking-[0.18em] ${a.heroText}`}>Champion of the Day</div>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-[#0f172a]">{firstName(champ.name)}</div>
              <div className="mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TEAM[champ.locationCode]?.bg} ${TEAM[champ.locationCode]?.text}`}>
                  {locName(champ.locationCode)}
                </span>
              </div>
              <div className={`mt-2 text-4xl font-black bg-gradient-to-r ${a.num} bg-clip-text text-transparent tabular-nums`}>
                {formatCurrency(champ.dailyProd)}
              </div>
              {lead > 0 && (
                <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold ${a.leadBadge} px-3 py-1 rounded-full`}>
                  🔥 Leading by {formatCurrency(lead)}
                </div>
              )}
            </div>
          </div>

          {/* Podium 2 / 1 / 3 */}
          <div className="grid grid-cols-3 gap-1.5 items-end mb-5">
            {[second, champ, third].map((r, col) => {
              if (!r) return <div key={col} />
              const place = col === 1 ? 1 : col === 0 ? 2 : 3
              const medal = place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'
              const h = place === 1 ? 'h-24' : place === 2 ? 'h-16' : 'h-12'
              const grad = place === 1 ? 'from-amber-400 to-yellow-500' : place === 2 ? 'from-slate-300 to-slate-400' : 'from-orange-300 to-amber-600'
              return (
                <div key={r.name} className="flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl mb-0.5">{medal}</div>
                  <div className="font-black text-[#0f172a] text-xs sm:text-sm text-center leading-tight">{firstName(r.name)}</div>
                  <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${TEAM[r.locationCode]?.bg} ${TEAM[r.locationCode]?.text}`}>
                    {r.locationCode}
                  </div>
                  <div className="font-black text-[#0f172a] text-xs sm:text-sm mt-1 tabular-nums">{formatCurrency(r.dailyProd, true)}</div>
                  <div className={`w-full ${h} mt-1.5 rounded-t-xl bg-gradient-to-b ${grad} flex items-start justify-center pt-1.5 shadow-inner`}>
                    <span className="text-white font-black text-lg sm:text-xl drop-shadow">{place}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* The chase (rank 4+) */}
          {chase.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] px-1">The Chase</div>
              {chase.map((r, i) => {
                const rank = i + 4
                const team = TEAM[r.locationCode]
                return (
                  <div key={r.name} className="flex items-center gap-2.5 rounded-xl bg-white border border-[#e2e8f0] px-3 py-2.5 hover:shadow-md hover:border-[#cbd5e1] transition-all">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ring-2 ${team?.ring} ${team?.bg} ${team?.text} flex items-center justify-center font-black text-sm`}>
                      {rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#0f172a] text-sm truncate">{firstName(r.name)}</div>
                      <div className="text-[10px] text-[#94a3b8] truncate">{CHASE_TITLES[i % CHASE_TITLES.length]} · {locName(r.locationCode)}</div>
                    </div>
                    <div className="font-black text-[#0f172a] text-sm tabular-nums">{formatCurrency(r.dailyProd)}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Column scoreboard */}
          <div className="rounded-2xl bg-[#0f172a] text-white px-4 py-3 flex items-center justify-around">
            <div className="text-center">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total</div>
              <div className="text-lg font-black tabular-nums">{formatCurrency(dayTotal, true)}</div>
            </div>
            <div className="w-px h-8 bg-slate-600" />
            <div className="text-center">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">In the Race</div>
              <div className="text-lg font-black tabular-nums">{ranked.length} {unit}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function LeaderboardClient() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 bg-clip-text text-transparent">
          🏆 Daily Leaderboard
        </div>
        <div className="mt-2 inline-flex items-center gap-2 bg-[#0f172a] text-white text-xs font-bold px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {DAILY_LEADERBOARD.dateShort} · who's taking the crown?
        </div>
      </div>

      {/* Split screen: Doctors | Hygienists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:divide-x lg:divide-[#e2e8f0]">
        <div className="lg:pr-8">
          <Board kind="doctors" label="Doctors" emoji="🦷" rows={DAILY_LEADERBOARD.doctors} />
        </div>
        <div>
          <Board kind="hygienists" label="Hygienists" emoji="✨" rows={DAILY_LEADERBOARD.hygienists} />
        </div>
      </div>

      <p className="text-center text-[11px] text-[#94a3b8] mt-8">
        Daily gross production (Procedure Charges) · all locations · fresh each morning. Go get 'em. 💪
      </p>
    </div>
  )
}
