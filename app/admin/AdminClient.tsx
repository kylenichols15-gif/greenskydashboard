'use client'

import { useState, useCallback } from 'react'
import { LOCATIONS } from '@/lib/data'

type TabId = 'period' | 'locations' | 'providers' | 'phones' | 'osb' | 'ar'

const TABS: { id: TabId; label: string }[] = [
  { id: 'period',    label: '📅 Period' },
  { id: 'locations', label: '📍 Location Data' },
  { id: 'providers', label: '👨‍⚕️ Providers' },
  { id: 'phones',    label: '📞 Phone Data' },
  { id: 'osb',       label: '🦷 OSB (Dental Intel)' },
  { id: 'ar',        label: '💰 AR Aging' },
]

function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
        saved ? 'bg-green-500 text-white' : 'bg-[#0A9E8A] hover:bg-[#08866f] text-white'
      } disabled:opacity-50`}
    >
      {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
    </button>
  )
}

async function saveSection(section: string, payload: unknown) {
  const res = await fetch('/api/admin/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, payload }),
  })
  if (!res.ok) throw new Error(await res.text())
}

// ─── Period Tab ──────────────────────────────────────────────────────────────
function PeriodTab({ initial }: { initial: { label: string; totalBizDays: number; daysComplete: number; daysRemaining: number } }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const remaining = form.totalBizDays - form.daysComplete

  async function handleSave() {
    setSaving(true)
    try {
      await saveSection('period', { ...form, daysRemaining: remaining })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <p className="text-[#64748B] text-sm">Set the current reporting period shown across all dashboard pages.</p>
      <div>
        <label className="text-[#94A3B8] text-xs uppercase tracking-wider block mb-1">Period Label</label>
        <input
          className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#0A9E8A]"
          value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          placeholder="e.g. April 2026"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[#94A3B8] text-xs uppercase tracking-wider block mb-1">Total Business Days</label>
          <input
            type="number"
            className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#0A9E8A]"
            value={form.totalBizDays}
            onChange={e => setForm(f => ({ ...f, totalBizDays: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label className="text-[#94A3B8] text-xs uppercase tracking-wider block mb-1">Days Completed</label>
          <input
            type="number"
            className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#0A9E8A]"
            value={form.daysComplete}
            onChange={e => setForm(f => ({ ...f, daysComplete: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div className="text-[#64748B] text-sm">Days Remaining: <span className="text-amber-400 font-bold">{remaining}</span></div>
      <SaveButton onClick={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Location Tab ─────────────────────────────────────────────────────────────
type LocRow = {
  code: string; production: number; collections: number; newPatients: number;
  suppliesPct: number; recareRate: number; phoneAnswerRate: number; activePatients: number;
  collectionRate: number; status: string; isOSB?: boolean;
}

function LocationTab({ initial }: { initial: LocRow[] }) {
  const [rows, setRows] = useState<LocRow[]>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [csvError, setCsvError] = useState('')

  function update(code: string, field: keyof LocRow, val: string | number) {
    setRows(r => r.map(row => row.code === code ? { ...row, [field]: typeof val === 'string' && field !== 'status' ? Number(val) || 0 : val } : row))
  }

  // Auto-recalculate collection rate when production/collections change
  function updateMoney(code: string, field: 'production' | 'collections', val: string) {
    setRows(r => r.map(row => {
      if (row.code !== code) return row
      const updated = { ...row, [field]: Number(val) || 0 }
      updated.collectionRate = updated.production > 0 ? Math.round((updated.collections / updated.production) * 1000) / 10 : 0
      return updated
    }))
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string).replace(/^\uFEFF/, '') // strip BOM
        const lines = text.split(/\r?\n/).filter(l => l.trim())

        // Find header row
        const headerIdx = lines.findIndex(l =>
          /production|procedure|charges|collections|payments/i.test(l)
        )
        if (headerIdx === -1) { setCsvError('Could not detect header row. Make sure this is a Dentrix production summary CSV.'); return }

        const headers = lines[headerIdx].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
        const dataLines = lines.slice(headerIdx + 1)

        const colIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)))
        const locCol  = colIdx(['location', 'practice', 'office'])
        const prodCol = colIdx(['procedure charges', 'gross prod', 'procedure charge'])
        const netCol  = colIdx(['production total', 'net prod', 'net production'])
        const collCol = colIdx(['payments', 'collections', 'payment'])
        const npCol   = colIdx(['new patient'])

        if (locCol === -1) { setCsvError('Cannot find location/practice column.'); return }

        const codeMap: Record<string, string> = {
          'lakewood': 'LKW', 'lincoln trail': 'LT', 'radcliff': 'HNR',
          'shepherdsville': 'HNS', 'bardstown': 'PB', 'proctor radcliff': 'PR',
          'osbourne': 'OSB', 'lkw': 'LKW', 'lt': 'LT', 'hnr': 'HNR',
          'hns': 'HNS', 'pb': 'PB', 'pr': 'PR', 'osb': 'OSB',
        }

        const parsed: Partial<Record<string, Partial<LocRow>>> = {}
        for (const line of dataLines) {
          const cols = line.split(',').map(c => c.trim().replace(/"/g, ''))
          const locRaw = cols[locCol]?.toLowerCase() ?? ''
          const code = Object.entries(codeMap).find(([k]) => locRaw.includes(k))?.[1]
          if (!code) continue

          const num = (i: number) => i === -1 ? 0 : Math.abs(parseFloat(cols[i]?.replace(/[$,]/g, '') || '0')) || 0
          parsed[code] = {
            production: prodCol !== -1 ? num(prodCol) : netCol !== -1 ? num(netCol) : undefined,
            collections: collCol !== -1 ? num(collCol) : undefined,
            newPatients: npCol !== -1 ? Math.round(num(npCol)) : undefined,
          }
        }

        if (Object.keys(parsed).length === 0) { setCsvError('No matching location rows found. Check that location names match GreenSky codes.'); return }

        setRows(r => r.map(row => {
          const p = parsed[row.code]
          if (!p) return row
          const prod = p.production ?? row.production
          const coll = p.collections ?? row.collections
          return {
            ...row,
            production: prod,
            collections: coll,
            newPatients: p.newPatients ?? row.newPatients,
            collectionRate: prod > 0 ? Math.round((coll / prod) * 1000) / 10 : row.collectionRate,
          }
        }))
      } catch {
        setCsvError('Failed to parse CSV. Make sure it is a valid Dentrix export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveSection('locations', rows)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const STATUS_OPTIONS = ['on_pace', 'behind', 'critical', 'ahead']

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#64748B] text-sm">Upload a Dentrix location/practice summary CSV, or enter numbers manually.</p>
          {csvError && <p className="text-red-400 text-xs mt-1">⚠ {csvError}</p>}
        </div>
        <label className="cursor-pointer bg-[#1E2A3A] hover:bg-[#243040] border border-[#1E2A3A] text-[#94A3B8] text-sm px-4 py-2 rounded-lg transition-colors">
          Upload Dentrix CSV
          <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              {['Location', 'Gross Prod ($)', 'Collections ($)', 'New Pts', 'Active Pts', 'Coll Rate %', 'Supplies %', 'Recare %', 'Phone %', 'Status'].map(h => (
                <th key={h} className="text-left text-[#64748B] font-semibold uppercase tracking-wider px-2 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.filter(r => !r.isOSB).map(row => (
              <tr key={row.code} className="border-b border-[#1E2A3A]/50">
                <td className="px-2 py-2 font-bold text-[#0A9E8A]">{row.code}</td>
                {(['production', 'collections'] as const).map(f => (
                  <td key={f} className="px-2 py-1">
                    <input type="number" className="w-28 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                      value={row[f]} onChange={e => updateMoney(row.code, f, e.target.value)} />
                  </td>
                ))}
                {(['newPatients', 'activePatients'] as const).map(f => (
                  <td key={f} className="px-2 py-1">
                    <input type="number" className="w-20 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                      value={row[f]} onChange={e => update(row.code, f, e.target.value)} />
                  </td>
                ))}
                <td className="px-2 py-1 text-[#64748B]">{row.collectionRate.toFixed(1)}%</td>
                {(['suppliesPct', 'recareRate', 'phoneAnswerRate'] as const).map(f => (
                  <td key={f} className="px-2 py-1">
                    <input type="number" step="0.1" className="w-16 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                      value={row[f]} onChange={e => update(row.code, f, e.target.value)} />
                  </td>
                ))}
                <td className="px-2 py-1">
                  <select className="bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A] text-xs"
                    value={row.status} onChange={e => update(row.code, 'status', e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
    </div>
  )
}

// ─── Providers Tab ────────────────────────────────────────────────────────────
type DoctorRow = { name: string; locationCode: string; grossProd: number; collections: number; collRate: number; prodPerDay: number; daysWorked: number; ytdProd: number }
type HygRow    = { name: string; locationCode: string; grossProd: number; collections: number; collRate: number; hoursWorked: number; prodPerHr: number; recareRate: number }

function ProvidersTab({ initialDoctors, initialHygienists }: { initialDoctors: DoctorRow[]; initialHygienists: HygRow[] }) {
  const [doctors, setDoctors] = useState<DoctorRow[]>(initialDoctors)
  const [hygienists, setHygienists] = useState<HygRow[]>(initialHygienists)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [csvError, setCsvError] = useState('')

  function updateDoc(i: number, field: keyof DoctorRow, val: string) {
    setDoctors(r => r.map((row, idx) => {
      if (idx !== i) return row
      const updated = { ...row, [field]: isNaN(Number(val)) || field === 'name' || field === 'locationCode' ? val : Number(val) }
      if (field === 'grossProd' || field === 'collections') {
        updated.collRate = updated.grossProd > 0 ? Math.round((updated.collections / updated.grossProd) * 1000) / 10 : 0
      }
      if (field === 'grossProd' || field === 'daysWorked') {
        updated.prodPerDay = updated.daysWorked > 0 ? Math.round(updated.grossProd / updated.daysWorked) : 0
      }
      return updated
    }))
  }

  function updateHyg(i: number, field: keyof HygRow, val: string) {
    setHygienists(r => r.map((row, idx) => {
      if (idx !== i) return row
      const updated = { ...row, [field]: isNaN(Number(val)) || field === 'name' || field === 'locationCode' ? val : Number(val) }
      if (field === 'grossProd' || field === 'collections') {
        updated.collRate = updated.grossProd > 0 ? Math.round((updated.collections / updated.grossProd) * 1000) / 10 : 0
      }
      if (field === 'grossProd' || field === 'hoursWorked') {
        updated.prodPerHr = updated.hoursWorked > 0 ? Math.round(updated.grossProd / updated.hoursWorked) : 0
      }
      return updated
    }))
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string).replace(/^\uFEFF/, '')
        const lines = text.split(/\r?\n/).filter(l => l.trim())
        const headerIdx = lines.findIndex(l => /provider|doctor|hygien/i.test(l) && /produc|charge/i.test(l))
        if (headerIdx === -1) { setCsvError('Cannot detect header row. Make sure this is a Dentrix Provider Totals CSV.'); return }

        const headers = lines[headerIdx].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
        const col = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)))

        const nameCol   = col(['provider', 'name'])
        const typeCol   = col(['type', 'category', 'role'])
        const locCol    = col(['location', 'practice', 'office'])
        const prodCol   = col(['procedure charges', 'gross prod', 'procedure charge'])
        const netCol    = col(['production total', 'net prod'])
        const collCol   = col(['payments', 'collections'])
        const daysCol   = col(['days worked', 'days'])
        const hrsCol    = col(['hours', 'hrs'])
        const ytdCol    = col(['ytd', 'year to date'])

        const codeMap: Record<string, string> = {
          'lakewood': 'LKW', 'lincoln trail': 'LT', 'radcliff hn': 'HNR', 'h&n radcliff': 'HNR',
          'shepherdsville': 'HNS', 'bardstown': 'PB', 'proctor radcliff': 'PR', 'osbourne': 'OSB',
          'lkw': 'LKW', 'lt': 'LT', 'hnr': 'HNR', 'hns': 'HNS', 'pb': 'PB', 'pr': 'PR', 'osb': 'OSB',
        }

        const newDocs: DoctorRow[] = []
        const newHygs: HygRow[] = []

        for (const line of lines.slice(headerIdx + 1)) {
          const cols = line.split(',').map(c => c.trim().replace(/"/g, ''))
          const name = nameCol !== -1 ? cols[nameCol] : ''
          if (!name) continue

          const num = (i: number) => i === -1 ? 0 : Math.abs(parseFloat(cols[i]?.replace(/[$,]/g, '') || '0')) || 0
          const locRaw = locCol !== -1 ? cols[locCol].toLowerCase() : ''
          const code = Object.entries(codeMap).find(([k]) => locRaw.includes(k))?.[1] ?? 'LKW'
          const typeRaw = typeCol !== -1 ? cols[typeCol].toLowerCase() : ''
          const isHyg = typeRaw.includes('hygien')

          const prod = prodCol !== -1 ? num(prodCol) : netCol !== -1 ? num(netCol) : 0
          const coll = num(collCol)
          const collRate = prod > 0 ? Math.round((coll / prod) * 1000) / 10 : 0

          if (isHyg) {
            const hrs = num(hrsCol)
            newHygs.push({ name, locationCode: code, grossProd: prod, collections: coll, collRate, hoursWorked: hrs, prodPerHr: hrs > 0 ? Math.round(prod / hrs) : 0, recareRate: 0 })
          } else {
            const days = num(daysCol)
            newDocs.push({ name, locationCode: code, grossProd: prod, collections: coll, collRate, prodPerDay: days > 0 ? Math.round(prod / days) : 0, daysWorked: days, ytdProd: num(ytdCol) })
          }
        }

        if (newDocs.length > 0) setDoctors(newDocs)
        if (newHygs.length > 0) setHygienists(newHygs)
        if (newDocs.length === 0 && newHygs.length === 0) setCsvError('No provider rows detected. Check CSV format.')
      } catch {
        setCsvError('Failed to parse provider CSV.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveSection('doctors', doctors)
      await saveSection('hygienists', hygienists)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const locCodes = LOCATIONS.map(l => l.code)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#64748B] text-sm">Upload Dentrix Provider Totals CSV, or edit manually. Recare % for hygienists must be entered manually.</p>
          {csvError && <p className="text-red-400 text-xs mt-1">⚠ {csvError}</p>}
        </div>
        <label className="cursor-pointer bg-[#1E2A3A] hover:bg-[#243040] border border-[#1E2A3A] text-[#94A3B8] text-sm px-4 py-2 rounded-lg transition-colors">
          Upload Provider CSV
          <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
        </label>
      </div>

      <h3 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-3">Doctors</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              {['Name', 'Location', 'Gross Prod', 'Collections', 'Coll %', 'Days', 'Prod/Day', 'YTD Prod'].map(h => (
                <th key={h} className="text-left text-[#64748B] font-semibold px-2 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc, i) => (
              <tr key={i} className="border-b border-[#1E2A3A]/50">
                <td className="px-2 py-1"><input className="w-44 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={doc.name} onChange={e => updateDoc(i, 'name', e.target.value)} /></td>
                <td className="px-2 py-1">
                  <select className="bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={doc.locationCode} onChange={e => updateDoc(i, 'locationCode', e.target.value)}>
                    {locCodes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1"><input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={doc.grossProd} onChange={e => updateDoc(i, 'grossProd', e.target.value)} /></td>
                <td className="px-2 py-1"><input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={doc.collections} onChange={e => updateDoc(i, 'collections', e.target.value)} /></td>
                <td className="px-2 py-1 text-[#64748B]">{doc.collRate.toFixed(1)}%</td>
                <td className="px-2 py-1"><input type="number" className="w-16 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={doc.daysWorked} onChange={e => updateDoc(i, 'daysWorked', e.target.value)} /></td>
                <td className="px-2 py-1 text-[#64748B]">${doc.prodPerDay.toLocaleString()}</td>
                <td className="px-2 py-1"><input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={doc.ytdProd} onChange={e => updateDoc(i, 'ytdProd', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-3">Hygienists</h3>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              {['Name', 'Location', 'Gross Prod', 'Collections', 'Coll %', 'Hours', 'Prod/Hr', 'Recare %'].map(h => (
                <th key={h} className="text-left text-[#64748B] font-semibold px-2 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hygienists.map((hyg, i) => (
              <tr key={i} className="border-b border-[#1E2A3A]/50">
                <td className="px-2 py-1"><input className="w-44 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={hyg.name} onChange={e => updateHyg(i, 'name', e.target.value)} /></td>
                <td className="px-2 py-1">
                  <select className="bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={hyg.locationCode} onChange={e => updateHyg(i, 'locationCode', e.target.value)}>
                    {locCodes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1"><input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={hyg.grossProd} onChange={e => updateHyg(i, 'grossProd', e.target.value)} /></td>
                <td className="px-2 py-1"><input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={hyg.collections} onChange={e => updateHyg(i, 'collections', e.target.value)} /></td>
                <td className="px-2 py-1 text-[#64748B]">{hyg.collRate.toFixed(1)}%</td>
                <td className="px-2 py-1"><input type="number" step="0.5" className="w-20 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={hyg.hoursWorked} onChange={e => updateHyg(i, 'hoursWorked', e.target.value)} /></td>
                <td className="px-2 py-1 text-[#64748B]">${hyg.prodPerHr}</td>
                <td className="px-2 py-1"><input type="number" step="0.1" className="w-20 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]" value={hyg.recareRate} onChange={e => updateHyg(i, 'recareRate', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveButton onClick={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Phones Tab ───────────────────────────────────────────────────────────────
type PhoneRow = { code: string; totalCalls: number; answered: number; missed: number; answerRate: number; estMissedRevenue: number }

function PhonesTab({ initial }: { initial: PhoneRow[] }) {
  const [rows, setRows] = useState<PhoneRow[]>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function update(code: string, field: 'totalCalls' | 'answered', val: string) {
    setRows(r => r.map(row => {
      if (row.code !== code) return row
      const updated = { ...row, [field]: Number(val) || 0 }
      updated.missed = Math.max(0, updated.totalCalls - updated.answered)
      updated.answerRate = updated.totalCalls > 0 ? Math.round((updated.answered / updated.totalCalls) * 1000) / 10 : 0
      updated.estMissedRevenue = updated.missed * 80
      return updated
    }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveSection('phones', rows)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="text-[#64748B] text-sm mb-4">Enter call data from Mango Voice. Missed calls and answer rate are auto-calculated. Est. revenue = missed × $80.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              {['Location', 'Total Calls', 'Answered', 'Missed', 'Answer Rate', 'Rev at Risk'].map(h => (
                <th key={h} className="text-left text-[#64748B] text-xs font-semibold uppercase tracking-wider px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.code} className="border-b border-[#1E2A3A]/50">
                <td className="px-3 py-2 font-bold text-[#0A9E8A]">{row.code}</td>
                <td className="px-3 py-2">
                  <input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                    value={row.totalCalls} onChange={e => update(row.code, 'totalCalls', e.target.value)} />
                </td>
                <td className="px-3 py-2">
                  <input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                    value={row.answered} onChange={e => update(row.code, 'answered', e.target.value)} />
                </td>
                <td className="px-3 py-2 text-red-400 font-bold">{row.missed.toLocaleString()}</td>
                <td className="px-3 py-2">
                  <span className={`font-bold ${row.answerRate >= 80 ? 'text-green-400' : row.answerRate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {row.answerRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-2 text-red-400">${row.estMissedRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
    </div>
  )
}

// ─── OSB Tab ──────────────────────────────────────────────────────────────────
function OSBTab({ initialLocations }: { initialLocations: LocRow[] }) {
  const osb = initialLocations.find(l => l.code === 'OSB') ?? {
    code: 'OSB', production: 0, collections: 0, collectionRate: 0, newPatients: 0,
    activePatients: 0, suppliesPct: 0, recareRate: 0, phoneAnswerRate: 0, status: 'on_pace', isOSB: true,
  }
  const [form, setForm] = useState(osb)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set(field: keyof LocRow, val: string) {
    setForm(f => {
      const updated = { ...f, [field]: Number(val) || 0 }
      if (field === 'production' || field === 'collections') {
        updated.collectionRate = updated.production > 0 ? Math.round((updated.collections / updated.production) * 1000) / 10 : 0
      }
      return updated
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      // Merge OSB back into locations array
      const res = await fetch('/api/admin/data')
      const { data } = await res.json()
      const locations = (data.locations as LocRow[]).map(l => l.code === 'OSB' ? { ...form, isOSB: true } : l)
      await saveSection('locations', locations)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-amber-400 text-xs mb-2">
        ALT DATA — MANUAL SOURCE (Dental Intel)
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Gross Production ($)', field: 'production' },
          { label: 'Collections ($)', field: 'collections' },
          { label: 'New Patients', field: 'newPatients' },
          { label: 'Active Patients', field: 'activePatients' },
          { label: 'Supplies %', field: 'suppliesPct' },
          { label: 'Recare Rate %', field: 'recareRate' },
          { label: 'Phone Answer Rate %', field: 'phoneAnswerRate' },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="text-[#94A3B8] text-xs uppercase tracking-wider block mb-1">{label}</label>
            <input
              type="number"
              step={field.includes('Pct') || field.includes('Rate') ? '0.1' : '1'}
              className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#0A9E8A]"
              value={form[field as keyof LocRow] as number}
              onChange={e => set(field as keyof LocRow, e.target.value)}
            />
          </div>
        ))}
        <div>
          <label className="text-[#94A3B8] text-xs uppercase tracking-wider block mb-1">Collection Rate %</label>
          <div className="text-[#F1F5F9] font-bold text-sm py-2">{form.collectionRate.toFixed(1)}%</div>
        </div>
      </div>
      <SaveButton onClick={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── AR Tab ───────────────────────────────────────────────────────────────────
type ARLoc = { code: string; total: number; d0_30: number; d31_60: number; d61_90: number; d90plus: number; pct0_30: number; pct31_60: number; pct61_90: number; pct90plus: number; insuranceAR: number; patientAR: number; patientPct: number; arToProd: number; status: string; isOSB?: boolean }

function ARTab({ initialAR }: { initialAR: { asOf: string; healthScore: number; total: number; buckets: Record<string, number>; pcts: Record<string, number>; arToProdRatio: number; locations: ARLoc[] } }) {
  const [asOf, setAsOf] = useState(initialAR.asOf)
  const [locs, setLocs] = useState<ARLoc[]>(initialAR.locations)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function update(code: string, field: keyof ARLoc, val: string) {
    setLocs(r => r.map(loc => {
      if (loc.code !== code) return loc
      const updated = { ...loc, [field]: isNaN(Number(val)) || field === 'status' ? val : Number(val) }
      // Recalculate totals and pcts
      const total = updated.d0_30 + updated.d31_60 + updated.d61_90 + updated.d90plus
      updated.total = total
      if (total > 0) {
        updated.pct0_30   = Math.round((updated.d0_30   / total) * 1000) / 10
        updated.pct31_60  = Math.round((updated.d31_60  / total) * 1000) / 10
        updated.pct61_90  = Math.round((updated.d61_90  / total) * 1000) / 10
        updated.pct90plus = Math.round((updated.d90plus / total) * 1000) / 10
      }
      if (updated.insuranceAR + updated.patientAR > 0) {
        updated.patientPct = Math.round((updated.patientAR / (updated.insuranceAR + updated.patientAR)) * 100)
      }
      return updated
    }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const total = locs.reduce((s, l) => s + l.total, 0)
      const buckets = {
        d0_30:   locs.reduce((s, l) => s + l.d0_30, 0),
        d31_60:  locs.reduce((s, l) => s + l.d31_60, 0),
        d61_90:  locs.reduce((s, l) => s + l.d61_90, 0),
        d90plus: locs.reduce((s, l) => s + l.d90plus, 0),
      }
      const pcts = {
        d0_30:   total > 0 ? Math.round((buckets.d0_30   / total) * 1000) / 10 : 0,
        d31_60:  total > 0 ? Math.round((buckets.d31_60  / total) * 1000) / 10 : 0,
        d61_90:  total > 0 ? Math.round((buckets.d61_90  / total) * 1000) / 10 : 0,
        d90plus: total > 0 ? Math.round((buckets.d90plus / total) * 1000) / 10 : 0,
      }
      // Simple health score: 100 - penalties for aging
      const healthScore = Math.max(0, Math.min(100, Math.round(100 - (pcts.d31_60 * 0.5) - (pcts.d61_90 * 1.5) - (pcts.d90plus * 3))))
      const res = await fetch('/api/admin/data')
      const { data } = await res.json()
      const arToProdRatio = data.org?.production > 0 ? Math.round((total / data.org.production) * 100) / 100 : 0

      await saveSection('ar', { asOf, healthScore, total, buckets, pcts, arToProdRatio, locations: locs })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="text-[#94A3B8] text-xs uppercase tracking-wider block mb-1">AR As-Of Date</label>
          <input
            className="bg-[#111827] border border-[#1E2A3A] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#0A9E8A]"
            value={asOf}
            onChange={e => setAsOf(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
        </div>
        <p className="text-[#64748B] text-sm self-end pb-2">Totals, pcts, health score, and AR:Prod ratio are auto-calculated when you save.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              {['Loc', '0-30 ($)', '31-60 ($)', '61-90 ($)', '90+ ($)', 'Ins AR ($)', 'Pt AR ($)', 'AR:Prod', 'Status'].map(h => (
                <th key={h} className="text-left text-[#64748B] font-semibold px-2 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locs.map(loc => (
              <tr key={loc.code} className="border-b border-[#1E2A3A]/50">
                <td className="px-2 py-1 font-bold text-[#0A9E8A]">{loc.code}{loc.isOSB && <span className="ml-1 text-amber-400 text-[10px]">ALT</span>}</td>
                {(['d0_30', 'd31_60', 'd61_90', 'd90plus', 'insuranceAR', 'patientAR'] as const).map(f => (
                  <td key={f} className="px-2 py-1">
                    <input type="number" className="w-24 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                      value={loc[f]} onChange={e => update(loc.code, f, e.target.value)} />
                  </td>
                ))}
                <td className="px-2 py-1">
                  <input type="number" step="0.01" className="w-16 bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A]"
                    value={loc.arToProd} onChange={e => update(loc.code, 'arToProd', e.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <select className="bg-[#111827] border border-[#1E2A3A] rounded px-2 py-1 text-[#F1F5F9] focus:outline-none focus:border-[#0A9E8A] text-xs"
                    value={loc.status} onChange={e => update(loc.code, 'status', e.target.value)}>
                    {['good', 'watch', 'needs_work'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
    </div>
  )
}

// ─── Main Admin Client ────────────────────────────────────────────────────────
export default function AdminClient({ initialData, initialPeriod }: {
  initialData: typeof import('@/lib/data').DEMO_DATA
  initialPeriod: typeof import('@/lib/data').PERIOD_INFO
}) {
  const [tab, setTab] = useState<TabId>('period')
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [logging, setLogging] = useState(false)

  const handleLogin = useCallback(async () => {
    setLogging(true)
    setAuthError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setLoggedIn(true)
      } else {
        setAuthError('Incorrect password')
      }
    } finally {
      setLogging(false)
    }
  }, [password])

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-[#F1F5F9] font-bold text-lg">Admin Access</div>
            <div className="text-[#64748B] text-sm mt-1">GreenSky Dashboard Data Manager</div>
          </div>
          <input
            type="password"
            className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-3 text-[#F1F5F9] mb-3 focus:outline-none focus:border-[#0A9E8A]"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            disabled={logging}
            className="w-full bg-[#0A9E8A] hover:bg-[#08866f] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {logging ? 'Checking…' : 'Enter'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#F1F5F9] text-2xl font-bold">Data Manager</h1>
          <p className="text-[#64748B] text-sm mt-1">Update dashboard data — changes go live immediately</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-semibold">Admin</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0D1629] p-1 rounded-xl border border-[#1E2A3A] overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'bg-[#0A9E8A]/15 text-[#0A9E8A] border border-[#0A9E8A]/20'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0D1629] border border-[#1E2A3A] rounded-xl p-6">
        {tab === 'period'    && <PeriodTab    initial={initialPeriod} />}
        {tab === 'locations' && <LocationTab  initial={initialData.locations as LocRow[]} />}
        {tab === 'providers' && <ProvidersTab initialDoctors={initialData.doctors as DoctorRow[]} initialHygienists={initialData.hygienists as HygRow[]} />}
        {tab === 'phones'    && <PhonesTab    initial={initialData.phones as PhoneRow[]} />}
        {tab === 'osb'       && <OSBTab       initialLocations={initialData.locations as LocRow[]} />}
        {tab === 'ar'        && <ARTab        initialAR={initialData.ar as Parameters<typeof ARTab>[0]['initialAR']} />}
      </div>
    </div>
  )
}
