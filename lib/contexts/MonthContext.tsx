'use client'

import { createContext, useContext, useState } from 'react'
import { HISTORICAL_MONTHS } from '@/lib/history'
import type { MonthSnapshot } from '@/lib/types'

type MonthCtx = {
  selectedKey: string | null            // null = current (live) month
  setSelectedKey: (k: string | null) => void
  snapshot: MonthSnapshot | undefined   // undefined = current month
}

const MonthContext = createContext<MonthCtx>({
  selectedKey: null,
  setSelectedKey: () => {},
  snapshot: undefined,
})

export function MonthProvider({ children }: { children: React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const snapshot = selectedKey
    ? HISTORICAL_MONTHS.find(m => m.key === selectedKey)
    : undefined

  return (
    <MonthContext.Provider value={{ selectedKey, setSelectedKey, snapshot }}>
      {children}
    </MonthContext.Provider>
  )
}

export const useMonth = () => useContext(MonthContext)
