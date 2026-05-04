import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { MonthProvider } from '@/lib/contexts/MonthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenSky Dental — Dashboard',
  description: 'GreenSky Dental DSO Operations Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-[#dde6f2] text-[#0f172a] min-h-screen`}>
        <MonthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-60 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
              {children}
            </main>
          </div>
        </MonthProvider>
      </body>
    </html>
  )
}
