import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { isAuthenticated } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenSky Dental — Dashboard',
  description: 'GreenSky Dental DSO Operations Dashboard',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated()

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-[#0A0F1E] text-[#F1F5F9] min-h-screen`}>
        {authed ? (
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-60 min-h-screen">
              {children}
            </main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
