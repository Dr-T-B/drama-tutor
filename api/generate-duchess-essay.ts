// Edge runtime — required env var in Vercel:
//   ANTHROPIC_API_KEY
//
// Locked Duchess of Malfi (Edexcel Component 1 Section B) full-essay generator.
// Accepts a { system, user } envelope built client-side from
// src/lib/duchessEssayPrompt.ts (single source of truth). Streams plain text.
// Model is pinned to claude-opus-4-7 — see ../docs/ for rationale (hallucination
// risk on Renaissance drama is the highest-stakes failure mode for an exam aid).

export const config = { runtime: 'edge' }

const MODEL = 'claude-opus-4-7'
const MAX_TOKENS = 4000

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: { system?: unknown; user?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const system = typeof body.system === 'string' ? body.system : null
  const user = typeof body.user === 'string' ? body.user : null
  if (!system || !user) {
    return new Response('system and user must be strings', { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response('ANTHROPIC_API_KEY not configured', { status: 500 })
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      stream: true,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text()
    return new Response(errText, { status: upstream.status })
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()
      let buf = ''
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const payload = line.slice(5).trim()
            if (!payload || payload === '[DONE]') continue
            try {
              const evt = JSON.parse(payload)
              if (
                evt.type === 'content_block_delta' &&
                evt.delta?.type === 'text_delta' &&
                typeof evt.delta.text === 'string'
              ) {
                controller.enqueue(encoder.encode(evt.delta.text))
              }
            } catch {
              // ignore malformed SSE chunks
            }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}
