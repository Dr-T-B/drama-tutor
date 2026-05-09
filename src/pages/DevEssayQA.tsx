import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PastQuestionSelector } from '../components/PastQuestionSelector'
import {
  buildDuchessSystemPrompt,
  buildDuchessUserMessage,
  type PastQuestion,
} from '../lib/duchessEssayPrompt'

// TODO (post-13-May): gate this route behind auth. Currently unlinked + relies on
// security-through-obscurity for the timeboxed pre-exam window.
const MODEL_NAME = 'claude-opus-4-7'

function wordCount(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function DevEssayQA() {
  const [selected, setSelected] = useState<PastQuestion | null>(null)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')
  const [activeThemes, setActiveThemes] = useState<string[]>([])

  async function generate() {
    if (!selected) return
    setLoading(true)
    setError('')
    setOutput('')
    setCopyState('idle')
    try {
      const system = buildDuchessSystemPrompt()
      const user = buildDuchessUserMessage(selected)
      const res = await fetch('/api/generate-duchess-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, user }),
      })
      if (!res.ok || !res.body) throw new Error(`API error ${res.status}`)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setOutput(acc)
      }
      if (!acc.trim()) throw new Error('Empty stream')
    } catch {
      setError('Generation failed — check the network tab and try again.')
    }
    setLoading(false)
  }

  async function copyMarkdown() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 1500)
    } catch {
      setError('Clipboard write failed')
    }
  }

  const wc = wordCount(output)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Essay generator QA — Duchess (dev only)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Spot-check the locked Section B scaffold across past questions before merging.
          Not linked from the main nav.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <PastQuestionSelector
          selectedQuestionId={selected?.id ?? null}
          onSelect={(q) => setSelected(q)}
          activeThemes={activeThemes}
          onActiveThemesChange={setActiveThemes}
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={generate}
          disabled={!selected || loading}
          className="text-sm font-semibold bg-[#0071E3] hover:bg-[#0077ED]
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white rounded-lg px-4 py-2 transition-colors"
        >
          {loading ? 'Generating…' : 'Generate model answer'}
        </button>
        {selected && (
          <span className="text-xs text-gray-500">
            Selected: {selected.year} · {selected.eitherOr}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm
                        px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {selected && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4 space-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Question being sent
            </p>
            <p className="text-sm text-gray-800">{selected.questionText}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            <span><span className="font-semibold">Themes:</span> {selected.themeTags.join(', ') || '—'}</span>
            <span><span className="font-semibold">Model:</span> {MODEL_NAME}</span>
            <span><span className="font-semibold">Words:</span> {wc}</span>
          </div>
        </div>
      )}

      {(output || loading) && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-[#0071E3]">
              Model answer
              {loading && <span className="ml-2 text-xs text-gray-500 font-normal">· streaming…</span>}
            </span>
            <button
              onClick={copyMarkdown}
              disabled={!output}
              className="text-xs font-medium border border-gray-200 hover:border-gray-300
                         disabled:opacity-50 rounded-md px-3 py-1.5 text-gray-700"
            >
              {copyState === 'copied' ? 'Copied ✓' : 'Copy markdown'}
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            {output
              ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
              : <p className="text-gray-500 italic">Composing model answer…</p>}
          </div>
        </div>
      )}
    </div>
  )
}
