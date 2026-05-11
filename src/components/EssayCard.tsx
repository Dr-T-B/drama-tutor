import { useState } from 'react'
import { AoBadge } from './AoBadge'
import { EssayDetail } from './EssayDetail'
import type { Essay, EssayProbability } from '../types/essay'

const PLAY_STYLE = {
  HAM: {
    badge: 'bg-violet-100 text-violet-800',
    border: 'border-violet-200',
    accent: 'text-violet-700',
  },
  MAL: {
    badge: 'bg-teal-100 text-teal-800',
    border: 'border-teal-200',
    accent: 'text-teal-700',
  },
} as const

const PROBABILITY_STYLE: Record<EssayProbability, { label: string; cls: string }> = {
  very_high:   { label: 'Very high', cls: 'bg-rose-100 text-rose-800' },
  high:        { label: 'High',      cls: 'bg-orange-100 text-orange-800' },
  medium_high: { label: 'Med-high',  cls: 'bg-amber-100 text-amber-800' },
  medium:      { label: 'Medium',    cls: 'bg-yellow-100 text-yellow-800' },
  low:         { label: 'Low',       cls: 'bg-gray-100 text-gray-700' },
}

export function EssayCard({ essay }: { essay: Essay }) {
  const [open, setOpen] = useState(false)
  const style = PLAY_STYLE[essay.play]
  const prob = PROBABILITY_STYLE[essay.probability_2026]

  const yearLabel =
    essay.year === null
      ? 'Character study'
      : `${essay.year} · Section ${essay.section}${essay.question_number ? ` · Q${essay.question_number}` : ''}`

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow ${
        open ? 'shadow-sm ' + style.border : 'border-gray-200 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-4 flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {essay.play === 'HAM' ? 'Hamlet' : 'Duchess'}
          </span>
          <span className="text-xs text-gray-400">{yearLabel}</span>
          <span className={`ml-auto text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${prob.cls}`}>
            {prob.label}
          </span>
        </div>

        <p className="text-gray-900 font-medium leading-snug">
          {essay.question_text}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            {essay.aos.map(ao => (
              <AoBadge key={ao} ao={ao} />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            ~{essay.word_count_approx} words
          </span>
        </div>

        <span className={`text-xs font-medium ${style.accent}`}>
          {open ? '− Hide essay' : '+ View essay'}
        </span>
      </button>

      {open && (
        <div
          className="border-t border-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <EssayDetail essay={essay} />
        </div>
      )}
    </div>
  )
}
