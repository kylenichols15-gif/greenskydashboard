'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [streamText]               = useState('')
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!res.ok) throw new Error(`Chat request failed: ${res.status}`)

      const { text } = await res.json()
      if (text) {
        setMessages(prev => [...prev, { role: 'assistant', content: text }])
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error connecting to the AI assistant. Make sure your ANTHROPIC_API_KEY is set in Vercel environment variables.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const SUGGESTIONS = [
    'Why is LKW phone performance so low?',
    'Which location has the best collection rate?',
    'What are our biggest revenue risks this month?',
    'How is HNR performing vs. benchmark?',
  ]

  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d1dce9] bg-white shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
            <span className="text-white text-sm">✦</span>
          </div>
          <div>
            <div className="text-[#0f172a] font-semibold text-sm">Ask GreenSky</div>
            <div className="text-[#64748b] text-xs">AI assistant · April 2026 data · Demo mode</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#2563eb]/15 border border-[#2563eb]/20 flex items-center justify-center">
                <span className="text-[#2563eb] text-2xl">✦</span>
              </div>
              <div className="text-center">
                <h2 className="text-[#0f172a] text-lg font-semibold mb-2">Ask anything about GreenSky</h2>
                <p className="text-[#64748b] text-sm max-w-sm">I have access to all 7 locations, production, collections, phone performance, and provider data for April 2026.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); textareaRef.current?.focus() }}
                    className="text-left px-4 py-2.5 bg-white border border-[#d1dce9] rounded-lg text-[#64748b] text-sm hover:border-[#2563eb]/40 hover:text-[#0f172a] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#2563eb]/15 border border-[#2563eb]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#2563eb] text-xs">✦</span>
                </div>
              )}
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#2563eb]/15 border border-[#2563eb]/20 text-[#0f172a] rounded-br-sm'
                  : 'bg-white border border-[#d1dce9] text-[#0f172a] rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-[#2563eb]/15 border border-[#2563eb]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#2563eb] text-xs">✦</span>
              </div>
              <div className="max-w-[85%] rounded-xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-[#d1dce9] text-[#0f172a] whitespace-pre-wrap">
                {streamText || <span className="flex gap-1 items-center"><span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full animate-bounce delay-75" /><span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full animate-bounce delay-150" /></span>}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#d1dce9] bg-[#dde6f2] shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2 bg-white border border-[#d1dce9] rounded-xl p-2 focus-within:border-[#2563eb]/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your locations, providers, phone performance..."
              rows={1}
              className="flex-1 bg-transparent text-[#0f172a] text-sm placeholder-[#3A4A5A] resize-none outline-none px-2 py-1.5 min-h-[36px] max-h-32"
              style={{ resize: 'none' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#2563eb] hover:bg-[#0B8A78] disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors self-end"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2L5 8L2 14L14 8Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <p className="text-[#94a3b8] text-xs mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
        </form>
      </div>
    </div>
  )
}
