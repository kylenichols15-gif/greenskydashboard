'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import MonthToggle from '@/components/MonthToggle'

const NAV_ITEMS = [
  { href: '/',           label: 'Overview',    icon: '◈' },
  { href: '/leaderboard',label: 'Leaderboard', icon: '🏆' },
  { href: '/ytd',        label: 'YTD Trends',  icon: '◑' },
  { href: '/locations',  label: 'Locations',   icon: '⊞' },
  { href: '/doctors',    label: 'Doctors',     icon: '⊙' },
  { href: '/hygiene',    label: 'Hygiene',     icon: '✦' },
  { href: '/phones',    label: 'Phones',      icon: '⌘' },
  { href: '/bonus',     label: 'Bonus',       icon: '◎' },
  { href: '/ar',        label: 'AR',          icon: '◷' },
  { href: '/schedule',  label: 'Schedule',    icon: '◫' },
  { href: '/chat',      label: 'Ask AI',      icon: '❋' },
]

// Bottom nav: 5 primary items for mobile
const BOTTOM_NAV = [
  { href: '/',            label: 'Home',        icon: '◈' },
  { href: '/leaderboard', label: 'Leaders',     icon: '🏆' },
  { href: '/doctors',     label: 'Doctors',     icon: '⊙' },
  { href: '/hygiene',     label: 'Hygiene',     icon: '✦' },
  { href: '/bonus',       label: 'Bonus',       icon: '◎' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-white border border-[#d1dce9] shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-[#0f172a] mb-1.5"></span>
        <span className="block w-5 h-0.5 bg-[#0f172a] mb-1.5"></span>
        <span className="block w-5 h-0.5 bg-[#0f172a]"></span>
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-white border-r border-[#d1dce9] z-40 flex flex-col
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="px-5 pt-6 pb-4 border-b border-[#d1dce9]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#2563eb] flex items-center justify-center">
              <span className="text-white text-xs font-bold">GS</span>
            </div>
            <div>
              <div className="text-[#0f172a] text-sm font-semibold leading-tight">GreenSky Dental</div>
              <div className="text-[#64748b] text-xs">Operations Dashboard</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/20'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5fb]'
                  }`}
                >
                  <span className="text-base w-5 text-center">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        <MonthToggle />
      </aside>

      {/* Mobile bottom nav bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#d1dce9] flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {BOTTOM_NAV.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                active ? 'text-[#2563eb]' : 'text-[#94a3b8]'
              }`}
            >
              <span className={`text-lg leading-none ${active ? 'text-[#2563eb]' : 'text-[#94a3b8]'}`}>{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
        {/* More button */}
        <button
          onClick={() => setOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold text-[#94a3b8]`}
        >
          <span className="text-lg leading-none">···</span>
          <span>More</span>
        </button>
      </nav>
    </>
  )
}
