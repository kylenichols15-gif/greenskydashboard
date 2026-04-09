import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { DEMO_DATA, BENCHMARKS } from '@/lib/data'

function buildSystemPrompt() {
  const { period, org, locations } = DEMO_DATA
  return `You are the GreenSky Dental executive AI assistant. You have access to current performance data for GreenSky Dental, a 7-location DSO in Kentucky.

CURRENT PERIOD: ${period}
ORG PRODUCTION: $${org.production.toLocaleString()} vs $${org.productionGoal.toLocaleString()} goal (${Math.round(org.production / org.productionGoal * 100)}% to goal)
ORG COLLECTIONS: $${org.collections.toLocaleString()} (${Math.round(org.collections / org.production * 100)}% collection rate)
PHONE ANSWER RATE: ${org.phoneAnswerRate}% (target: 80%)
HYGIENE RECARE: ${org.hygieneRecare}% (target: 85%)

LOCATION SUMMARY:
${locations.map(l => `${l.code}: $${l.production.toLocaleString()} production, ${l.phoneAnswerRate}% phones, ${l.recareRate}% recare, status: ${l.status}${l.isOSB ? ' [ALT DATA — manual source]' : ''}`).join('\n')}

DEO BENCHMARKS: NOI 20-25%, Supplies <6%, Lab <8%, Payroll <28%, Recare 85%, Phone Answer >80%, Collections Rate >98%

RULES:
- Lead with the answer, then support it with data
- Quantify everything — no vague statements
- LT (Lincoln Trail) has an active legal/tax matter — acknowledge it exists if asked but do NOT surface details or analyze it; redirect the user to handle it directly
- OSB data is manual/approximate — always note this when referencing OSB
- Never include compensation data in responses
- EBITDA framing on all operational questions
- If asked about Iron Bridge, clarify it is a management entity and does not have clinical/production metrics`
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages,
  })

  return new Response(stream.toReadableStream())
}
