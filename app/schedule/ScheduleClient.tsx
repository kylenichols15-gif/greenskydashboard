'use client'

import { useState } from 'react'
import { SCHEDULE_DATA, PERIOD_INFO } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'

// ─── Types ────────────────────────────────────────────────────────────────────

type RemLoc = {
  code: string
  name: string
  dentist: number
  hygiene: number
  total: number
  mtdGross: number
  isOSB: boolean
}

type FutureLoc = {
  code: string
  name: string
  dentist?: number
  hygiene?: number
  total: number
  isOSB: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOC_COLORS: Record<string, string> = {
  LKW: '#2563eb', LT: '#10b981', HNR: '#f59e0b',
  HNS: '#8b5cf6', HNK: '#ec4899', PB: '#ef4444', PR: '#06b6d4', OSB: '#f97316',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortName(name: string): string {
  const parts = name.split(',')
  if (parts.length < 2) return name
  const last  = parts[0].trim()
  const first = parts[1].trim()
  return `${first[0]}. ${last}`
}

function goalColor(pct: number): string {
  return pct >= 90 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444'
}

function PctBar({
  pct,
  color = '#2563eb',
  height = 'h-2.5',
}: {
  pct: number
  color?: string
  height?: string
}) {
  return (
    <div className={`${height} bg-[#dde6f2] rounded-full overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
      />
    </div>
  )
}

// Stacked bar: dentist (dark blue) + hygiene (light blue)
function DentHygBar({
  dentist,
  hygiene,
  max,
}: {
  dentist: number
  hygiene: number
  max: number
}) {
  const dPct = (dentist / max) * 100
  const hPct = (hygiene / max) * 100
  return (
    <div className="h-5 bg-[#dde6f2] rounded-md overflow-hidden flex">
      <div
        className="h-full bg-[#2563eb] shrink-0"
        style={{ width: `${dPct}%` }}
        title={`Dentist: ${formatCurrency(dentist)}`}
      />
      <div
        className="h-full bg-[#93c5fd] shrink-0"
        style={{ width: `${hPct}%` }}
        title={`Hygiene: ${formatCurrency(hygiene)}`}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScheduleClient() {
  const { remainingThisMonth, futureMonths, providerSchedule } = SCHEDULE_DATA

  const [selectedProvider, setSelectedProvider] = useState<string>('Nichols, Christopher')

  const projectedTotal = remainingThisMonth.mtdGross + remainingThisMonth.scheduledTotal
  const projectedPct   = (projectedTotal / remainingThisMonth.monthlyGoal) * 100
  const pColor         = goalColor(projectedPct)

  const june       = futureMonths[0]
  const laterMonths = futureMonths.slice(1)
  const juneMax    = Math.max(...june.locations.map(l => l.total))
  const junePct    = (june.scheduledTotal / june.monthlyGoal) * 100

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Schedule &amp; Pipeline</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Gross scheduled production — as of {SCHEDULE_DATA.asOf} · {PERIOD_INFO.label}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-semibold">
          <span>⏱</span>
          <span>{remainingThisMonth.daysRemaining} biz days remaining in {PERIOD_INFO.label.split(' ')[0]}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 1 — REMAINING THIS MONTH
      ══════════════════════════════════════════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-[#2563eb] rounded-full inline-block" />
          <h2 className="text-[#0f172a] text-base font-semibold">Remaining This Month — {PERIOD_INFO.label}</h2>
        </div>

        {/* Summary banner */}
        <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-5 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-[#64748b] text-[11px] font-semibold uppercase tracking-wider">MTD Gross</div>
              <div className="text-[#0f172a] text-xl font-bold mt-1">
                {formatCurrency(remainingThisMonth.mtdGross, true)}
              </div>
              <div className="text-[#64748b] text-xs mt-0.5">through {PERIOD_INFO.dataAsOf}</div>
            </div>
            <div>
              <div className="text-[#64748b] text-[11px] font-semibold uppercase tracking-wider">Sched Remaining</div>
              <div className="text-[#0f172a] text-xl font-bold mt-1">
                {formatCurrency(remainingThisMonth.scheduledTotal, true)}
              </div>
              <div className="text-[#64748b] text-xs mt-0.5">{remainingThisMonth.daysRemaining} biz days left</div>
            </div>
            <div>
              <div className="text-[#64748b] text-[11px] font-semibold uppercase tracking-wider">Projected Month</div>
              <div className="text-xl font-bold mt-1" style={{ color: pColor }}>
                {formatCurrency(projectedTotal, true)}
              </div>
              <div className="text-[#64748b] text-xs mt-0.5">at 100% schedule fill</div>
            </div>
            <div>
              <div className="text-[#64748b] text-[11px] font-semibold uppercase tracking-wider">vs $2.4M Goal</div>
              <div className="text-xl font-bold mt-1" style={{ color: pColor }}>
                {projectedPct.toFixed(1)}%
              </div>
              <div className="text-[#64748b] text-xs mt-0.5">
                {formatCurrency(remainingThisMonth.monthlyGoal - projectedTotal, true)} gap
              </div>
            </div>
          </div>
          <PctBar pct={projectedPct} color={pColor} height="h-3" />
          <div className="flex justify-between text-xs text-[#64748b] mt-1.5">
            <span>Projected: {formatCurrency(projectedTotal)}</span>
            <span>Goal: {formatCurrency(remainingThisMonth.monthlyGoal)}</span>
          </div>
        </div>

        {/* Location table */}
        <div className="bg-white border border-[#d1dce9] rounded-xl overflow-x-auto">
          {/* Header row */}
          <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] min-w-[640px] text-[11px] font-semibold text-[#64748b] uppercase tracking-wide px-4 py-2.5 border-b border-[#d1dce9] bg-[#f8fafc]">
            <div>Location</div>
            <div className="text-right">Dentist Sched</div>
            <div className="text-right">Hygiene Sched</div>
            <div className="text-right font-bold text-[#0f172a]">Total Remaining</div>
            <div className="text-right">MTD Gross</div>
            <div className="text-right">Projected Month</div>
          </div>

          {(remainingThisMonth.locations as RemLoc[]).map(loc => {
            const projected  = loc.mtdGross + loc.total
            const isHNSHyg   = loc.code === 'HNS' && loc.hygiene < 5000
            return (
              <div
                key={loc.code}
                className={`grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] min-w-[640px] items-center px-4 py-3 border-b border-[#d1dce9]/60 last:border-0 ${isHNSHyg ? 'bg-red-50/30' : 'hover:bg-[#f8fafc]'} transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0f172a] w-8 shrink-0">{loc.code}</span>
                  <span className="text-xs text-[#64748b] truncate hidden sm:inline">{loc.name}</span>
                  {loc.isOSB && <OSBBadge />}
                </div>
                <div className="text-right text-xs text-[#0f172a]">{formatCurrency(loc.dentist, true)}</div>
                <div className={`text-right text-xs ${isHNSHyg ? 'text-red-600 font-semibold' : 'text-[#0f172a]'}`}>
                  {formatCurrency(loc.hygiene, true)}
                  {isHNSHyg && <span className="ml-1">⚠</span>}
                </div>
                <div className="text-right text-xs font-semibold text-[#0f172a]">{formatCurrency(loc.total, true)}</div>
                <div className="text-right text-xs text-[#64748b]">{formatCurrency(loc.mtdGross, true)}</div>
                <div className="text-right text-xs font-bold text-[#0f172a]">{formatCurrency(projected, true)}</div>
              </div>
            )
          })}

          {/* Totals row */}
          <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] min-w-[640px] items-center px-4 py-3 bg-[#f8fafc] border-t border-[#d1dce9] text-xs font-semibold">
            <div className="text-[#0f172a]">Org Total</div>
            <div className="text-right text-[#64748b]">
              {formatCurrency((remainingThisMonth.locations as RemLoc[]).reduce((s, l) => s + l.dentist, 0), true)}
            </div>
            <div className="text-right text-[#64748b]">
              {formatCurrency((remainingThisMonth.locations as RemLoc[]).reduce((s, l) => s + l.hygiene, 0), true)}
            </div>
            <div className="text-right text-[#0f172a]">{formatCurrency(remainingThisMonth.scheduledTotal, true)}</div>
            <div className="text-right text-[#64748b]">{formatCurrency(remainingThisMonth.mtdGross, true)}</div>
            <div className="text-right font-bold" style={{ color: pColor }}>
              {formatCurrency(projectedTotal, true)}
            </div>
          </div>
        </div>

        {/* HNS flag note */}
        <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <span className="shrink-0 font-bold">⚠</span>
          <span>
            <strong>HNS hygiene: only $2,926 scheduled for the remaining 5 days.</strong>{' '}
            Structural staffing gap — Logsdon is the only hygienist rostered at Shepherdsville.
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — JUNE PIPELINE
      ══════════════════════════════════════════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-[#2563eb] rounded-full inline-block" />
          <h2 className="text-[#0f172a] text-base font-semibold">{june.month} Pipeline</h2>
          <span className="text-xs text-[#64748b] font-normal">— {june.approxBizDays} approx biz days</span>
        </div>

        <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden">
          {/* Summary header */}
          <div className="bg-[#eff6ff] border-b border-[#2563eb]/20 px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <span className="text-2xl font-bold text-[#0f172a]">{formatCurrency(june.scheduledTotal)}</span>
                <span className="text-[#64748b] text-sm ml-2">scheduled gross</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-right">
                  <div className="text-[11px] text-[#64748b] uppercase tracking-wide">vs $2.4M Goal</div>
                  <div className="text-lg font-bold" style={{ color: goalColor(junePct) }}>
                    {junePct.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-amber-700 font-medium">
                  ⚡ {june.earlySchedulingNote}
                </div>
              </div>
            </div>
            <PctBar pct={junePct} color={goalColor(junePct)} height="h-3" />
          </div>

          {/* Location bars */}
          <div className="p-5 space-y-5">
            {(june.locations as FutureLoc[]).map(loc => {
              const flagLow = loc.code === 'HNS'
              return (
                <div key={loc.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a] w-8 shrink-0">{loc.code}</span>
                      <span className="text-xs text-[#64748b]">{loc.name}</span>
                      {loc.isOSB && <OSBBadge />}
                      {flagLow && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                          ⚠ Low
                        </span>
                      )}
                    </div>
                    <div className="text-right text-xs leading-tight">
                      <span className="font-semibold text-[#0f172a]">{formatCurrency(loc.total, true)}</span>
                      {loc.dentist !== undefined && (
                        <span className="text-[#94a3b8] ml-2">
                          D:{formatCurrency(loc.dentist, true)} · H:{formatCurrency(loc.hygiene ?? 0, true)}
                        </span>
                      )}
                    </div>
                  </div>
                  {loc.dentist !== undefined ? (
                    <DentHygBar dentist={loc.dentist} hygiene={loc.hygiene ?? 0} max={juneMax} />
                  ) : (
                    <PctBar pct={(loc.total / juneMax) * 100} color="#2563eb" height="h-5" />
                  )}
                </div>
              )
            })}

            {/* HNS note + provider breakdown pointer */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-[#d1dce9] text-xs">
              <div className="text-amber-700 font-medium">
                ⚠ HNS: Connolly $31.8K + Logsdon $13.2K only — schedule needs attention
              </div>
              <div className="sm:ml-auto text-[#94a3b8]">
                Dentist/hygiene breakdown by provider available in Section 4 ↓
              </div>
            </div>
          </div>

          {/* Location detail table */}
          <div className="border-t border-[#d1dce9] overflow-x-auto">
            <div className="px-5 py-2 bg-[#f8fafc] border-b border-[#d1dce9]/60 text-[11px] text-[#94a3b8]">
              Location totals only — dentist/hygiene split by provider available in Section 4 below
            </div>
            <div className="grid grid-cols-[1fr_auto] text-[11px] font-semibold text-[#64748b] uppercase tracking-wide px-5 py-2.5 bg-[#f8fafc]">
              <div>Location</div>
              <div className="text-right">Scheduled Total</div>
            </div>
            {(june.locations as FutureLoc[]).map(loc => (
              <div
                key={loc.code}
                className="grid grid-cols-[1fr_auto] items-center px-5 py-2.5 border-t border-[#d1dce9]/40 text-xs hover:bg-[#f8fafc] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0f172a] w-8 shrink-0">{loc.code}</span>
                  <span className="text-[#64748b]">{loc.name}</span>
                  {loc.isOSB && <OSBBadge />}
                </div>
                <div className="text-right font-semibold text-[#0f172a]">{formatCurrency(loc.total)}</div>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto] items-center px-5 py-2.5 border-t border-[#d1dce9] bg-[#f8fafc] text-xs font-semibold">
              <div className="text-[#0f172a]">Total</div>
              <div className="text-right text-[#0f172a]">{formatCurrency(june.scheduledTotal)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — FORWARD PIPELINE (Jul + Aug)
      ══════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-[#94a3b8] rounded-full inline-block" />
          <h2 className="text-[#0f172a] text-base font-semibold">Forward Pipeline</h2>
          <span className="text-xs text-[#64748b] font-normal">— early-stage scheduling, for awareness only</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {laterMonths.map(fm => {
            const pct      = (fm.scheduledTotal / fm.monthlyGoal) * 100
            const sorted   = [...fm.locations].sort((a, b) => b.total - a.total)
            const fmMax    = sorted[0].total
            const fmColor  = '#94a3b8'  // grey — schedule is too early for status coloring
            return (
              <div key={fm.key} className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden">
                {/* Card header */}
                <div className="bg-[#f8fafc] border-b border-[#d1dce9] px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#0f172a]">{fm.month}</div>
                    <div className="text-xs text-[#64748b]">{fm.approxBizDays} approx biz days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#0f172a]">{formatCurrency(fm.scheduledTotal, true)}</div>
                    <div className="text-xs text-[#64748b]">{pct.toFixed(1)}% of $2.4M goal</div>
                  </div>
                </div>

                {/* Early scheduling note */}
                {fm.earlySchedulingNote && (
                  <div className="px-4 py-2 bg-[#f8fafc] border-b border-[#d1dce9] text-xs text-[#64748b] italic">
                    ⚡ {fm.earlySchedulingNote}
                  </div>
                )}

                {/* Progress bar */}
                <div className="px-4 pt-3 pb-1">
                  <PctBar pct={pct} color={fmColor} height="h-2" />
                  <div className="text-right text-[11px] text-[#94a3b8] mt-1">{pct.toFixed(1)}% booked</div>
                </div>

                {/* Location list */}
                <div className="px-4 pb-4 space-y-2.5 mt-2">
                  {sorted.map(loc => (
                    <div key={loc.code}>
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#0f172a] w-8">{loc.code}</span>
                          <span className="text-[#64748b]">{loc.name}</span>
                          {loc.isOSB && <OSBBadge />}
                        </div>
                        <span className="text-[#0f172a] font-medium">{formatCurrency(loc.total, true)}</span>
                      </div>
                      <div className="h-1.5 bg-[#dde6f2] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#94a3b8]"
                          style={{ width: `${(loc.total / fmMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 — PROVIDER FORWARD SCHEDULE
      ══════════════════════════════════════════════ */}
      <ProviderScheduleSection
        providerSchedule={providerSchedule ?? []}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />

    </div>
  )
}

// ─── Provider Schedule Sub-Component ─────────────────────────────────────────

type ProvEntry = {
  name: string
  specialty: string
  locationCode: string
  isOSB: boolean
  months: { Jun: number; Jul: number; Aug: number }
}

function ProviderScheduleSection({
  providerSchedule,
  selectedProvider,
  setSelectedProvider,
}: {
  providerSchedule: ProvEntry[]
  selectedProvider: string
  setSelectedProvider: (v: string) => void
}) {
  const doctors    = providerSchedule.filter(p => p.specialty === 'Dentist')
  const hygienists = providerSchedule.filter(p => p.specialty === 'Hygienist')

  const selected = providerSchedule.find(p => p.name === selectedProvider) ?? doctors[0]
  if (!selected) return null

  const locColor   = LOC_COLORS[selected.locationCode] ?? '#2563eb'
  const months     = [
    { label: 'June',   key: 'Jun' as const, amount: selected.months.Jun },
    { label: 'July',   key: 'Jul' as const, amount: selected.months.Jul },
    { label: 'August', key: 'Aug' as const, amount: selected.months.Aug },
  ]
  const maxAmt = Math.max(...months.map(m => m.amount), 1)

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-[#8b5cf6] rounded-full inline-block" />
        <h2 className="text-[#0f172a] text-base font-semibold">Provider Forward Schedule</h2>
        <span className="text-xs text-[#64748b] font-normal">— Jun · Jul · Aug scheduled gross</span>
      </div>

      <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden">

        {/* Provider selector */}
        <div className="px-5 pt-5 pb-4 border-b border-[#d1dce9]">

          {/* Doctors */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Doctors</div>
            <div className="flex flex-wrap gap-1.5">
              {doctors.map(doc => {
                const isActive = selectedProvider === doc.name
                const color    = LOC_COLORS[doc.locationCode] ?? '#2563eb'
                return (
                  <button
                    key={doc.name}
                    onClick={() => setSelectedProvider(doc.name)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${isActive ? 'text-white border-transparent' : 'bg-white text-[#64748b] border-[#d1dce9] hover:text-[#0f172a]'}`}
                    style={isActive ? { backgroundColor: color, borderColor: color } : {}}
                  >
                    {shortName(doc.name)}
                    {doc.isOSB && <span className="ml-1 opacity-70">●</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Hygienists */}
          <div>
            <div className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Hygienists</div>
            <div className="flex flex-wrap gap-1.5">
              {hygienists.map(hyg => {
                const isActive = selectedProvider === hyg.name
                const color    = LOC_COLORS[hyg.locationCode] ?? '#2563eb'
                return (
                  <button
                    key={hyg.name}
                    onClick={() => setSelectedProvider(hyg.name)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${isActive ? 'text-white border-transparent' : 'bg-white text-[#64748b] border-[#d1dce9] hover:text-[#0f172a]'}`}
                    style={isActive ? { backgroundColor: color, borderColor: color } : {}}
                  >
                    {shortName(hyg.name)}
                    {hyg.isOSB && <span className="ml-1 opacity-70">●</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected provider display */}
        <div className="p-5">

          {/* Context bar */}
          <div className="flex flex-wrap items-center gap-2 mb-5 px-3 py-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: locColor }} />
            <span className="text-sm font-semibold text-[#0f172a]">{selected.name}</span>
            <span className="text-[#94a3b8] text-xs">·</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded border"
              style={{ color: locColor, backgroundColor: `${locColor}14`, borderColor: `${locColor}30` }}
            >
              {selected.locationCode}
            </span>
            <span className="text-[#94a3b8] text-xs">·</span>
            <span className="text-xs text-[#64748b]">{selected.specialty}</span>
            {selected.isOSB && (
              <>
                <span className="text-[#94a3b8] text-xs">·</span>
                <OSBBadge />
              </>
            )}
            <span className="ml-auto text-xs text-[#94a3b8]">
              Total {formatCurrency(months.reduce((s, m) => s + m.amount, 0), true)} Jun–Aug
            </span>
          </div>

          {/* OSB ALT DATA note */}
          {selected.isOSB && (
            <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
              <span className="font-bold shrink-0">⚠ ALT DATA — MANUAL SOURCE</span>
              <span>OSB schedule data is from Dental Intel and may not reflect real-time Ascend scheduling.</span>
            </div>
          )}

          {/* Month bars */}
          <div className="space-y-5">
            {months.map(m => {
              const pct = (m.amount / maxAmt) * 100
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#0f172a]">{m.label}</span>
                    <span className="text-sm font-bold text-[#0f172a]">{formatCurrency(m.amount)}</span>
                  </div>
                  <div className="h-8 bg-[#dde6f2] rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center px-3 transition-all"
                      style={{
                        width: `${Math.max(pct, m.amount > 0 ? 3 : 0)}%`,
                        backgroundColor: locColor,
                      }}
                    >
                      {pct >= 15 && (
                        <span className="text-white text-xs font-semibold">{formatCurrency(m.amount, true)}</span>
                      )}
                    </div>
                  </div>
                  {m.amount === 0 && (
                    <div className="text-xs text-[#94a3b8] mt-1">No schedule on books yet</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Note */}
          <p className="mt-5 text-[11px] text-[#94a3b8]">
            Amounts reflect gross scheduled production from Dentrix Ascend. Jul and Aug are early-stage — expect these to grow as patients book appointments.
          </p>
        </div>
      </div>
    </section>
  )
}
