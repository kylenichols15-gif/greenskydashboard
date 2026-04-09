'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/',          label: 'Overview',    icon: '◈' },
  { href: '/locations', label: 'Locations',   icon: '⊞' },
  { href: '/providers', label: 'Providers',   icon: '⊙' },
  { href: '/phones',    label: 'Phones',      icon: '⌘' },
  { href: '/bonus',     label: 'Bonus Race',  icon: '◎' },
  { href: '/chat',      label: 'Ask GreenSky',icon: '✦' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 mt-8">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-[#0A9E8A]/15 text-[#0A9E8A] border border-[#0A9E8A]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111827]'
            }`}
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0D1629] border border-[#1E2A3A] text-[#94A3B8]"
        onClick={() => setOpen(!open)}
      >
        <span className="block w-5 h-0.5 bg-current mb-1.5"></span>
        <span className="block w-5 h-0.5 bg-current mb-1.5"></span>
        <span className="block w-5 h-0.5 bg-current"></span>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#0D1629] border-r border-[#1E2A3A] z-40 flex flex-col
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="px-5 pt-6 pb-4 border-b border-[#1E2A3A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#0A9E8A] flex items-center justify-center">
              <span className="text-white text-xs font-bold">GS</span>
            </div>
            <div>
              <div className="text-[#F1F5F9] text-sm font-semibold leading-tight">GreenSky Dental</div>
              <div className="text-[#64748B] text-xs">Operations Dashboard</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <NavLinks />
        </div>

        <div className="px-5 py-4 border-t border-[#1E2A3A]">
          <div className="text-[#64748B] text-xs">April 2026 · Demo Data</div>
        </div>
      </aside>
    </>
  )
}
