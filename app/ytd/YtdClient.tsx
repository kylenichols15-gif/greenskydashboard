'use client'

import { useState } from 'react'
import { HISTORICAL_MONTHS } from '@/lib/history'
import { LOCATIONS } from '@/lib/data'
import { formatCurrency, formatPct } from '@/lib/utils'
import OSBBadge from '@/components/OSBBadge'
import DaysLeft from '@/components/DaysLeft'
import type { DashboardData, PeriodData } from '@/lib/types'

// ─── SVG Primitives ───────────────────────────────────────────────────────────

function LineChart({
  data,
  color = '#2563eb',
  danger = false,
  height = 110,
  formatVal = (v: number) => String(v),
  goal,
  goalLabel,
}: {
  data: { label: string; value: number }[]
  color?: string
  danger?: boolean
  height?: number
  formatVal?: (v: number) => string
  goal?: number
  goalLabel?: string
}) {
  if (data.length < 2) return null
  const vals   = data.map(d => d.value)
  const minVal = Math.min(...vals)
  const maxVal = Math.max(...vals, goal ?? 0)
  const range  = maxVal - minVal || 1
  const pad    = range * 0.25
  const lo     = Math.max(0, minVal - pad)
  const hi     = maxVal + pad

  const DOT_R   = 4
  const VAL_H   = 16
  const LABEL_H = 20
  const W       = 340
  const xStep   = W / (data.length - 1)
  const svgH    = VAL_H + height + DOT_R + LABEL_H

  const lineColor = danger ? '#ef4444' : color

  const ptY = (v: number) => VAL_H + height - ((v - lo) / (hi - lo)) * height
  const ptX = (i: number) => i * xStep

  const linePoints = data.map((d, i) => `${ptX(i)},${ptY(d.value)}`).join(' ')
  const areaPoints = `0,${VAL_H + height} ${linePoints} ${W},${VAL_H + height}`
  const goalY      = goal !== undefined ? ptY(goal) : null

  return (
    <svg viewBox={`0 0 ${W} ${svgH}`} className="w-full overflow-visible" preserveAspectRatio="xMidYMid meet">
      {/* Area fill */}
      <polygon points={areaPoints} fill={danger ? 'rgba(239,68,68,0.07)' : `${color}12`} />
      {/* Goal line */}
      {goalY !== null && (
        <>
          <line x1={0} y1={goalY} x2={W} y2={goalY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,4" />
          {goalLabel && <text x={W - 2} y={goalY - 3} textAnchor="end" fill="#f59e0b" fontSize="8" fontWeight="600">{goalLabel}</text>}
        </>
      )}
      {/* Line */}
      <polyline points={linePoints} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots + labels */}
      {data.map((d, i) => {
        const cx = ptX(i)
        const cy = ptY(d.value)
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={DOT_R + 2} fill="white" stroke={lineColor} strokeWidth="2.5" />
            <text
              x={cx}
              y={Math.max(cy - DOT_R - 4, VAL_H - 2)}
              textAnchor="middle"
              fill={lineColor}
              fontSize="9"
              fontWeight="700"
            >{formatVal(d.value)}</text>
            <text x={cx} y={VAL_H + height + DOT_R + LABEL_H - 3} textAnchor="middle" fill="#64748b" fontSize="10">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function BarChart({
  data,
  color = '#2563eb',
  height = 100,
  formatVal = (v: number) => String(v),
  goalValue,
}: {
  data: { label: string; value: number }[]
  color?: string
  height?: number
  formatVal?: (v: number) => string
  goalValue?: number
}) {
  const maxVal = Math.max(...data.map(d => d.value), goalValue ?? 0) * 1.08 || 1
  const BAR_W  = 44
  const GAP    = 20
  const VAL_H  = 14
  const LBL_H  = 18
  const totalW = data.length * (BAR_W + GAP) - GAP
  const svgH   = VAL_H + height + LBL_H
  const goalY  = goalValue ? VAL_H + height - (goalValue / maxVal) * height : null

  return (
    <svg viewBox={`0 0 ${totalW} ${svgH}`} className="w-full overflow-visible" preserveAspectRatio="xMidYMid meet">
      {goalY !== null && (
        <>
          <line x1={0} y1={goalY} x2={totalW} y2={goalY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,4" />
          <text x={totalW - 1} y={goalY - 3} textAnchor="end" fill="#f59e0b" fontSize="7.5" fontWeight="600">Goal</text>
        </>
      )}
      {data.map((d, i) => {
        const barH = maxVal > 0 ? Math.max((d.value / maxVal) * height, d.value > 0 ? 2 : 0) : 0
        const x    = i * (BAR_W + GAP)
        const y    = VAL_H + height - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={BAR_W} height={barH} fill={color} rx="3" />
            <text x={x + BAR_W / 2} y={Math.max(y - 3, 10)} textAnchor="middle" fill="#0f172a" fontSize="8.5" fontWeight="600">
              {d.value > 0 ? formatVal(d.value) : '—'}
            </text>
            <text x={x + BAR_W / 2} y={VAL_H + height + LBL_H - 2} textAnchor="middle" fill="#64748b" fontSize="10">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const shortLabel = (m: typeof HISTORICAL_MONTHS[0]) => m.periodInfo.label.split(' ')[0].slice(0, 3)
const mom = (cur: number, prev: number) => prev > 0 ? ((cur - prev) / prev) * 100 : null

const LOC_COLORS: Record<string, string> = {
  LKW: '#2563eb', LT: '#10b981', HNR: '#f59e0b',
  HNS: '#8b5cf6', PB: '#ef4444', PR: '#06b6d4', OSB: '#f97316',
}

type MetricKey = 'production' | 'collections' | 'collRate' | 'phoneRate' | 'newPatients' | 'arScore'

const METRICS: { key: MetricKey; label: string; color: string; orgOnly?: boolean }[] = [
  { key: 'production',  label: 'Production',   color: '#2563eb' },
  { key: 'collections', label: 'Collections',  color: '#10b981' },
  { key: 'collRate',    label: 'Coll Rate',     color: '#f59e0b' },
  { key: 'phoneRate',   label: 'Phone Rate',    color: '#8b5cf6' },
  { key: 'newPatients', label: 'New Patients',  color: '#06b6d4' },
  { key: 'arScore',     label: 'AR Score',      color: '#ef4444', orgOnly: true },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function YtdClient({
  currentData,
  currentPeriod,
}: {
  currentData:   DashboardData
  currentPeriod: PeriodData
}) {
  const [selectedLoc,    setSelectedLoc]    = useState<string>('ALL')
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('production')

  const completed = HISTORICAL_MONTHS  // Jan–Apr in order

  // ── Static org-level trend data ───────────────────────────────────────────
  const orgTrend = completed.map(m => ({
    label:          shortLabel(m),
    production:     m.data.org.production,
    collections:    m.data.org.collections,
    newPatients:    m.data.org.newPatients,
    phoneAnswerRate:m.data.org.phoneAnswerRate,
    arHealthScore:  m.data.ar.healthScore,
    productionGoal: m.data.org.productionGoal,
    bizDays:        m.periodInfo.totalBizDays,
    collRate:       m.data.org.production > 0
                      ? +(m.data.org.collections / m.data.org.production * 100).toFixed(1)
                      : 0,
  }))

  // ── YTD summary totals ────────────────────────────────────────────────────
  const ytdProduction  = completed.reduce((s, m) => s + m.data.org.production,    0)
  const ytdCollections = completed.reduce((s, m) => s + m.data.org.collections,   0)
  const ytdNewPatients = completed.reduce((s, m) => s + m.data.org.newPatients,   0)
  const ytdProdGoal    = completed.reduce((s, m) => s + m.data.org.productionGoal, 0)
  const ytdCollRate    = ytdProduction > 0 ? (ytdCollections / ytdProduction) * 100 : 0
  const ytdProdVsGoal  = ytdProdGoal  > 0 ? (ytdProduction  / ytdProdGoal)   * 100 : 0
  const avgPhoneRate   = orgTrend.reduce((s, m) => s + m.phoneAnswerRate, 0) / orgTrend.length

  // ── Interactive chart data ────────────────────────────────────────────────
  const effectiveLoc = METRICS.find(m => m.key === selectedMetric)?.orgOnly ? 'ALL' : selectedLoc

  const chartData = completed.map(m => {
    const label = shortLabel(m)
    if (effectiveLoc === 'ALL') {
      switch (selectedMetric) {
        case 'production':  return { label, value: m.data.org.production }
        case 'collections': return { label, value: m.data.org.collections }
        case 'collRate':    return { label, value: m.data.org.production > 0 ? +(m.data.org.collections / m.data.org.production * 100).toFixed(1) : 0 }
        case 'phoneRate':   return { label, value: m.data.org.phoneAnswerRate }
        case 'newPatients': return { label, value: m.data.org.newPatients }
        case 'arScore':     return { label, value: m.data.ar.healthScore }
      }
    }
    const loc = m.data.locations.find(l => l.code === effectiveLoc)
    if (!loc) return { label, value: 0 }
    switch (selectedMetric) {
      case 'production':  return { label, value: loc.production }
      case 'collections': return { label, value: loc.collections }
      case 'collRate':    return { label, value: loc.collectionRate }
      case 'phoneRate':   return { label, value: loc.phoneAnswerRate }
      case 'newPatients': return { label, value: loc.newPatients }
      case 'arScore':     return { label, value: m.data.ar.healthScore }
    }
  })

  const metricCfg  = METRICS.find(m => m.key === selectedMetric)!
  const chartColor = effectiveLoc === 'ALL' ? metricCfg.color : (LOC_COLORS[effectiveLoc] ?? metricCfg.color)
  const isDanger   = selectedMetric === 'arScore'
  const isCurrency = selectedMetric === 'production' || selectedMetric === 'collections'
  const isPct      = selectedMetric === 'collRate' || selectedMetric === 'phoneRate'

  const chartFormatVal = isCurrency
    ? (v: number) => formatCurrency(v, true)
    : isPct
    ? (v: number) => `${v.toFixed(1)}%`
    : (v: number) => v > 0 ? String(v) : '—'

  // Chart goal line
  const chartGoal      = selectedMetric === 'production' && effectiveLoc === 'ALL' ? 2400000 : undefined
  const chartGoalLabel = chartGoal ? '$2.4M' : undefined

  // Summary stat for chart header
  const chartVals = chartData.map(d => d.value)
  const chartSum  = isCurrency ? chartVals.reduce((s, v) => s + v, 0) : null
  const chartLast = chartVals[chartVals.length - 1]
  const chartPrev = chartVals[chartVals.length - 2]
  const chartMoM  = mom(chartLast, chartPrev)

  // New patients per-location data gap note
  const hasNpGap = selectedMetric === 'newPatients' && effectiveLoc !== 'ALL' && effectiveLoc !== 'OSB'

  // ── Doctor monthly cross-ref ──────────────────────────────────────────────
  const aprDoctors = completed[completed.length - 1].data.doctors
  const doctorRows = [...aprDoctors]
    .sort((a, b) => b.ytdProd - a.ytdProd)
    .map(aprDoc => ({
      name:    aprDoc.name,
      loc:     aprDoc.locationCode,
      isOSB:   aprDoc.isOSB,
      ytd:     aprDoc.ytdProd,
      monthly: completed.map(m => m.data.doctors.find(d => d.name === aprDoc.name)?.grossProd ?? 0),
    }))

  // ── Location monthly production ───────────────────────────────────────────
  const locationRows = ['LKW', 'LT', 'PB', 'PR', 'OSB', 'HNS', 'HNR'].map(code => {
    const monthly = completed.map(m => m.data.locations.find(l => l.code === code)?.production ?? 0)
    return { code, monthly, ytd: monthly.reduce((s, v) => s + v, 0), isOSB: code === 'OSB' }
  }).sort((a, b) => b.ytd - a.ytd)

  // ── Color helpers ─────────────────────────────────────────────────────────
  const pctColor   = (v: number, t: number, f: number) => v >= t ? 'text-green-600' : v >= f ? 'text-amber-600' : 'text-red-600'
  const arColor    = (s: number) => s >= 70 ? 'text-green-600' : s >= 55 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#0f172a] text-2xl font-bold">Year-to-Date Overview</h1>
          <p className="text-[#64748b] text-sm mt-1">January – April 2026 · All 7 locations · 4 complete months</p>
        </div>
        <DaysLeft period={currentPeriod} />
      </div>

      {/* YTD KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl p-4">
          <div className="text-[#64748b] text-xs">YTD Production</div>
          <div className="text-[#1d4ed8] font-bold text-xl">{formatCurrency(ytdProduction, true)}</div>
          <div className="text-[#64748b] text-xs">{formatPct(ytdProdVsGoal, 1)} of annual goal pace</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-xl p-4">
          <div className="text-[#64748b] text-xs">YTD Collections</div>
          <div className="text-[#0f172a] font-bold text-xl">{formatCurrency(ytdCollections, true)}</div>
          <div className={`text-xs ${pctColor(ytdCollRate, 95, 85)}`}>{formatPct(ytdCollRate, 1)} coll rate</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-xl p-4">
          <div className="text-[#64748b] text-xs">Total New Patients</div>
          <div className="text-[#0f172a] font-bold text-xl">{ytdNewPatients.toLocaleString()}</div>
          <div className="text-[#64748b] text-xs">{Math.round(ytdNewPatients / completed.length)}/mo avg</div>
        </div>
        <div className="bg-white border border-[#d1dce9] rounded-xl p-4">
          <div className="text-[#64748b] text-xs">Avg Phone Rate</div>
          <div className={`font-bold text-xl ${pctColor(avgPhoneRate, 80, 70)}`}>{formatPct(avgPhoneRate, 1)}</div>
          <div className="text-[#64748b] text-xs">Jan–Apr avg · Target 80%</div>
        </div>
      </div>

      {/* ── Interactive Trend Chart ─────────────────────────────────────── */}
      <div className="bg-white border border-[#d1dce9] rounded-xl p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[#0f172a] font-semibold text-sm">Trend Explorer</h2>
            <p className="text-[#64748b] text-xs mt-0.5">Select a metric and location to explore month-over-month trends</p>
          </div>
          {/* Chart summary stat */}
          <div className="text-right shrink-0">
            {chartSum !== null && (
              <div className="text-[#0f172a] font-bold text-lg">{formatCurrency(chartSum, true)}</div>
            )}
            {chartSum === null && (
              <div className="text-[#0f172a] font-bold text-lg">{chartFormatVal(chartLast)}</div>
            )}
            <div className="text-[#64748b] text-xs">
              {chartSum !== null ? 'YTD total' : 'Latest (Apr)'}
              {chartMoM !== null && (
                <span className={`ml-1.5 font-semibold ${chartMoM >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {chartMoM >= 0 ? '▲' : '▼'} {Math.abs(chartMoM).toFixed(1)}% MoM
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedMetric === m.key
                  ? 'text-white border-transparent'
                  : 'bg-white text-[#64748b] border-[#d1dce9] hover:text-[#0f172a]'
              }`}
              style={selectedMetric === m.key ? { backgroundColor: m.color, borderColor: m.color } : {}}
            >
              {m.label}{m.orgOnly ? ' (org)' : ''}
            </button>
          ))}
        </div>

        {/* Location pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(['ALL', 'LKW', 'LT', 'HNR', 'HNS', 'PB', 'PR', 'OSB'] as const).map(code => {
            const isOrgOnly  = metricCfg.orgOnly
            const isDisabled = isOrgOnly && code !== 'ALL'
            const isActive   = effectiveLoc === code
            const locColor   = code === 'ALL' ? '#2563eb' : LOC_COLORS[code]
            return (
              <button
                key={code}
                onClick={() => !isDisabled && setSelectedLoc(code)}
                disabled={isDisabled}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isDisabled ? 'opacity-30 cursor-not-allowed bg-[#f1f5fb] text-[#94a3b8] border-[#e2e8f0]' :
                  isActive   ? 'text-white border-transparent' :
                  'bg-white text-[#64748b] border-[#d1dce9] hover:text-[#0f172a]'
                }`}
                style={isActive && !isDisabled ? { backgroundColor: locColor, borderColor: locColor } : {}}
              >
                {code === 'ALL' ? 'All Org' : code}
              </button>
            )
          })}
        </div>

        {/* Data gap warning */}
        {hasNpGap && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 mb-4">
            ⚠ Per-location new patient data not available for Jan–Mar (non-OSB). Showing 0 for those months.
            Use <strong>All Org</strong> for complete new patient trends.
          </div>
        )}

        {/* Chart */}
        <div className="pt-2">
          <LineChart
            data={chartData}
            color={chartColor}
            danger={isDanger}
            height={120}
            formatVal={chartFormatVal}
            goal={chartGoal}
            goalLabel={chartGoalLabel}
          />
        </div>

        {/* AR Score declining callout */}
        {selectedMetric === 'arScore' && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
            🚨 AR Health Score has declined <strong>19 points</strong> (68 → 49) over 4 months.
            90+ day balances grew from $88K to $223K. Requires immediate collection focus.
          </div>
        )}
        {/* Phone Rate improving callout */}
        {selectedMetric === 'phoneRate' && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
            ✓ Phone answer rate improved <strong>+16.0pp</strong> Jan → Apr (53.3% → 69.3%).
            Still {formatPct(69.3, 1)} vs 80% target — {(80 - 69.3).toFixed(1)}pp gap remaining.
          </div>
        )}
      </div>

      {/* ── Monthly Snapshot Table ──────────────────────────────────────── */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Month-by-Month Snapshot</h2>
      <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d1dce9] bg-[#f8fafc]">
                <th className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3 w-32">Metric</th>
                {orgTrend.map((m, i) => (
                  <th key={i} className="text-center text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3">{m.label}</th>
                ))}
                <th className="text-center text-[#0f172a] text-xs font-semibold uppercase tracking-wider px-4 py-3 bg-[#eff6ff] border-l border-[#2563eb]/10">YTD</th>
              </tr>
            </thead>
            <tbody>
              {/* Production */}
              <tr className="border-b border-[#d1dce9]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">Production</td>
                {orgTrend.map((m, i) => {
                  const delta = i > 0 ? mom(m.production, orgTrend[i-1].production) : null
                  return (
                    <td key={i} className="px-4 py-3 text-center">
                      <div className="text-[#0f172a] font-bold">{formatCurrency(m.production, true)}</div>
                      {delta !== null && <div className={`text-[10px] ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>{delta >= 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(1)}%</div>}
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 text-[#1d4ed8] font-bold">{formatCurrency(ytdProduction, true)}</td>
              </tr>
              {/* vs Goal */}
              <tr className="border-b border-[#d1dce9]/50 bg-[#f8fafc]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">vs Goal</td>
                {orgTrend.map((m, i) => {
                  const pct = m.productionGoal > 0 ? (m.production / m.productionGoal) * 100 : 0
                  return <td key={i} className={`px-4 py-3 text-center text-sm font-semibold ${pctColor(pct, 100, 90)}`}>{formatPct(pct, 1)}</td>
                })}
                <td className={`px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 font-bold ${pctColor(ytdProdVsGoal, 100, 90)}`}>{formatPct(ytdProdVsGoal, 1)}</td>
              </tr>
              {/* Collections */}
              <tr className="border-b border-[#d1dce9]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">Collections</td>
                {orgTrend.map((m, i) => {
                  const delta = i > 0 ? mom(m.collections, orgTrend[i-1].collections) : null
                  return (
                    <td key={i} className="px-4 py-3 text-center">
                      <div className="text-[#0f172a] font-bold">{formatCurrency(m.collections, true)}</div>
                      {delta !== null && <div className={`text-[10px] ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>{delta >= 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(1)}%</div>}
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 text-[#1d4ed8] font-bold">{formatCurrency(ytdCollections, true)}</td>
              </tr>
              {/* Collection Rate */}
              <tr className="border-b border-[#d1dce9]/50 bg-[#f8fafc]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">Coll Rate</td>
                {orgTrend.map((m, i) => (
                  <td key={i} className={`px-4 py-3 text-center text-sm font-semibold ${pctColor(m.collRate, 95, 85)}`}>{formatPct(m.collRate, 1)}</td>
                ))}
                <td className={`px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 font-bold ${pctColor(ytdCollRate, 95, 85)}`}>{formatPct(ytdCollRate, 1)}</td>
              </tr>
              {/* New Patients */}
              <tr className="border-b border-[#d1dce9]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">New Patients</td>
                {orgTrend.map((m, i) => {
                  const delta = i > 0 ? mom(m.newPatients, orgTrend[i-1].newPatients) : null
                  return (
                    <td key={i} className="px-4 py-3 text-center">
                      <div className="text-[#0f172a] font-bold">{m.newPatients}</div>
                      {delta !== null && <div className={`text-[10px] ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>{delta >= 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(0)}%</div>}
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 text-[#1d4ed8] font-bold">{ytdNewPatients.toLocaleString()}</td>
              </tr>
              {/* Phone Rate */}
              <tr className="border-b border-[#d1dce9]/50 bg-[#f8fafc]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">Phone Rate</td>
                {orgTrend.map((m, i) => (
                  <td key={i} className={`px-4 py-3 text-center text-sm font-semibold ${pctColor(m.phoneAnswerRate, 80, 70)}`}>{formatPct(m.phoneAnswerRate, 1)}</td>
                ))}
                <td className={`px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 font-bold ${pctColor(avgPhoneRate, 80, 70)}`}>{formatPct(avgPhoneRate, 1)} avg</td>
              </tr>
              {/* Business Days */}
              <tr className="border-b border-[#d1dce9]/50">
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">Biz Days</td>
                {orgTrend.map((m, i) => (
                  <td key={i} className="px-4 py-3 text-center text-[#64748b] text-sm">{m.bizDays}</td>
                ))}
                <td className="px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10 text-[#64748b]">{orgTrend.reduce((s, m) => s + m.bizDays, 0)}</td>
              </tr>
              {/* AR Score */}
              <tr>
                <td className="px-4 py-3 text-[#64748b] text-xs font-semibold">AR Score</td>
                {orgTrend.map((m, i) => (
                  <td key={i} className={`px-4 py-3 text-center text-sm font-bold ${arColor(m.arHealthScore)}`}>
                    {m.arHealthScore}
                    {i > 0 && (
                      <span className={`ml-1 text-[10px] font-normal ${m.arHealthScore < orgTrend[i-1].arHealthScore ? 'text-red-500' : 'text-green-600'}`}>
                        {m.arHealthScore < orgTrend[i-1].arHealthScore ? `▼${orgTrend[i-1].arHealthScore - m.arHealthScore}` : `▲${m.arHealthScore - orgTrend[i-1].arHealthScore}`}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-center bg-[#eff6ff] border-l border-[#2563eb]/10">
                  <span className={`text-sm font-bold ${arColor(orgTrend[orgTrend.length - 1].arHealthScore)}`}>
                    {orgTrend[orgTrend.length - 1].arHealthScore} <span className="text-[10px] text-red-500">↓19pts</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Doctor YTD Leaderboard ──────────────────────────────────────── */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Doctor YTD Production</h2>
      <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d1dce9] bg-[#f8fafc]">
                <th className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3 w-8">#</th>
                <th className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3">Doctor</th>
                {completed.map(m => (
                  <th key={m.key} className="text-right text-[#64748b] text-xs font-semibold uppercase tracking-wider px-3 py-3">{shortLabel(m)}</th>
                ))}
                <th className="text-right text-[#0f172a] text-xs font-semibold uppercase tracking-wider px-4 py-3 bg-[#eff6ff] border-l border-[#2563eb]/10">YTD</th>
              </tr>
            </thead>
            <tbody>
              {doctorRows.map((doc, i) => {
                const barW = doctorRows[0].ytd > 0 ? (doc.ytd / doctorRows[0].ytd) * 100 : 0
                const lastTwo = doc.monthly.slice(-2)
                const trend   = lastTwo[1] > lastTwo[0] ? '▲' : lastTwo[1] < lastTwo[0] ? '▼' : '—'
                const trendColor = lastTwo[1] > lastTwo[0] ? 'text-green-600' : lastTwo[1] < lastTwo[0] ? 'text-red-500' : 'text-[#94a3b8]'
                return (
                  <tr key={doc.name} className="border-b border-[#d1dce9]/50 hover:bg-[#f1f5fb] transition-colors">
                    <td className="px-4 py-3 text-[#64748b] font-bold text-xs">#{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#2563eb]/10 text-[#2563eb] text-[10px] px-1.5 py-0.5 rounded border border-[#2563eb]/20 font-medium">{doc.loc}</span>
                        <span className="text-[#0f172a] font-medium text-xs">{doc.name}</span>
                        {doc.isOSB && <OSBBadge />}
                        <span className={`text-[10px] font-bold ${trendColor}`}>{trend}</span>
                      </div>
                    </td>
                    {doc.monthly.map((v, mi) => (
                      <td key={mi} className="px-3 py-3 text-right text-[#64748b] text-xs font-medium">
                        {v > 0 ? formatCurrency(v, true) : '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right bg-[#eff6ff] border-l border-[#2563eb]/10">
                      <div className="text-[#1d4ed8] font-bold text-sm">{formatCurrency(doc.ytd, true)}</div>
                      <div className="h-1 bg-[#dbeafe] rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${barW}%` }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
              {/* Total row */}
              <tr className="bg-[#f8fafc] border-t border-[#d1dce9]">
                <td colSpan={2} className="px-4 py-3 text-[#0f172a] font-semibold text-xs">All Doctors</td>
                {completed.map((m, mi) => {
                  const total = m.data.doctors.reduce((s, d) => s + d.grossProd, 0)
                  return <td key={mi} className="px-3 py-3 text-right text-[#0f172a] font-bold text-xs">{formatCurrency(total, true)}</td>
                })}
                <td className="px-4 py-3 text-right bg-[#eff6ff] border-l border-[#2563eb]/10 text-[#1d4ed8] font-bold">
                  {formatCurrency(doctorRows.reduce((s, d) => s + d.ytd, 0), true)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Location Monthly Production ─────────────────────────────────── */}
      <h2 className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-3">Location Monthly Production</h2>
      <div className="bg-white border border-[#d1dce9] rounded-xl overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d1dce9] bg-[#f8fafc]">
                <th className="text-left text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3">Location</th>
                {completed.map(m => (
                  <th key={m.key} className="text-right text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 py-3">{shortLabel(m)}</th>
                ))}
                <th className="text-right text-[#0f172a] text-xs font-semibold uppercase tracking-wider px-4 py-3 bg-[#eff6ff] border-l border-[#2563eb]/10">YTD</th>
              </tr>
            </thead>
            <tbody>
              {locationRows.map(loc => {
                const meta   = LOCATIONS.find(l => l.code === loc.code)
                const topYtd = locationRows[0].ytd
                const barW   = topYtd > 0 ? (loc.ytd / topYtd) * 100 : 0
                const avg    = loc.ytd / loc.monthly.filter(v => v > 0).length
                return (
                  <tr key={loc.code} className="border-b border-[#d1dce9]/50 hover:bg-[#f1f5fb] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs px-1.5 py-0.5 rounded border border-[#2563eb]/20 font-bold">{loc.code}</span>
                        <span className="text-[#64748b] text-xs hidden sm:inline">{meta?.name}</span>
                        {loc.isOSB && <OSBBadge />}
                      </div>
                    </td>
                    {loc.monthly.map((v, mi) => {
                      const ratio = avg > 0 ? v / avg : 1
                      const cellColor = ratio >= 1.12 ? 'text-green-600' : ratio <= 0.72 ? 'text-red-500' : 'text-[#0f172a]'
                      return (
                        <td key={mi} className={`px-4 py-3 text-right font-medium text-sm ${cellColor}`}>
                          {formatCurrency(v, true)}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-right bg-[#eff6ff] border-l border-[#2563eb]/10">
                      <div className="text-[#1d4ed8] font-bold">{formatCurrency(loc.ytd, true)}</div>
                      <div className="h-1 bg-[#dbeafe] rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${barW}%` }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
              {/* Org total row */}
              <tr className="bg-[#f8fafc] border-t border-[#d1dce9]">
                <td className="px-4 py-3 text-[#0f172a] font-semibold text-xs">Org Total</td>
                {completed.map((m, mi) => (
                  <td key={mi} className="px-4 py-3 text-right text-[#0f172a] font-bold text-sm">
                    {formatCurrency(m.data.org.production, true)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right bg-[#eff6ff] border-l border-[#2563eb]/10 text-[#1d4ed8] font-bold">
                  {formatCurrency(ytdProduction, true)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[#94a3b8] text-xs mt-3">
        Production = gross procedure charges. OSB = Dental Intel (manual source). Jan–Mar location data aggregated from ProviderTotals.
        Collection rate = collections ÷ gross production for the month (not adjusted collections rate).
        Green/red in location table = vs that location&apos;s own 4-month avg (±12% threshold).
      </p>
    </div>
  )
}
