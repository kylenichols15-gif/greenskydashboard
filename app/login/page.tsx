'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Incorrect password. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dde6f2] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#2563eb] flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">GS</span>
          </div>
          <h1 className="text-[#0f172a] text-2xl font-bold">GreenSky Dental</h1>
          <p className="text-[#64748b] text-sm mt-1">Operations Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[#64748b] text-xs font-medium uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter dashboard password"
                autoFocus
                required
                className="w-full bg-[#f1f5fb] border border-[#d1dce9] rounded-lg px-4 py-2.5 text-[#0f172a] placeholder-[#3A4A5A] text-sm focus:outline-none focus:border-[#2563eb] transition-colors"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-[#0B8A78] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#94a3b8] text-xs mt-6">
          GreenSky Dental DSO · Elizabethtown, KY
        </p>
      </div>
    </div>
  )
}
