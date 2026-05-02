import { useState } from 'react'
import { AoBadge } from './AoBadge'
import type { QuoteEnriched } from '../types/database'

const PLAY_STYLE = {
  HAM: { badge: 'bg-violet-100 text-violet-800', border: 'border-violet-200' },
  MAL: { badge: 'bg-teal-100 text-teal-800',    border: 'border-teal-200'   },
}

function PriorityDots({ priority }: { priority: number | null }) {
  if (!priority) return null
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= priority ? 'bg-amber-400' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export function QuoteCard({ quote }: { quote: QuoteEnriched }) {
  const [open, setOpen] = useState(false)
  const style = PLAY_STYLE[quote.play]

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow cursor-pointer
        hover:shadow-sm ${open ? 'shadow-sm ' + style.border : 'border-gray-200'}`}
      onClick={() => setOpen(o => !o)}
    >
      {/* ── CLOSED / ALWAYS-VISIBLE ROW ── */}
      <div className="p-4 flex flex-col gap-2">
        {/* Top row: play badge + quote_id + priority dots */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {quote.play === 'HAM' ? 'Hamlet' : 'Duchess'}
          </span>
          <span className="text-xs text-gray-400 font-mono">{quote.quote_id}</span>
          <div className="ml-auto">
            <PriorityDots priority={quote.memorisation_priority} />
          </div>
        </div>

        {/* Quote content */}
        <p className="text-gray-900 font-medium leading-snug">
          "{quote.content}"
        </p>

        {/* Speaker + act/scene + AO badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">
            {quote.speaker}
            {quote.act_scene ? ` · ${quote.act_scene}` : ''}
          </span>
          <div className="flex gap-1 ml-auto">
            {quote.ao_links.map(l => (
              <AoBadge key={l.ao_code} ao={l.ao_code} />
            ))}
          </div>
        </div>

        {/* Primary theme pill */}
        {quote.primary_theme && (
          <span className="text-xs text-gray-400">
            {quote.primary_theme.theme_name}
          </span>
        )}
      </div>

      {/* ── EXPANDED DETAIL ── */}
      {open && (
        <div
          className="border-t border-gray-100 p-4 flex flex-col gap-4"
          onClick={e => e.stopPropagation()}
        >
          {quote.dramatic_moment && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Dramatic moment
              </p>
              <p className="text-sm text-gray-700">{quote.dramatic_moment}</p>
            </div>
          )}

          {quote.structural_function && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Structural function
              </p>
              <p className="text-sm text-gray-700">{quote.structural_function}</p>
            </div>
          )}

          {quote.exam_sentence && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                Exam sentence
              </p>
              <p className="text-sm text-amber-900">{quote.exam_sentence}</p>
            </div>
          )}

          {quote.ao_links.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Assessment objectives
              </p>
              <div className="flex flex-col gap-1.5">
                {quote.ao_links.map(l => (
                  <div key={l.ao_code} className="flex gap-2 items-start">
                    <AoBadge ao={l.ao_code} />
                    {l.note && (
                      <p className="text-xs text-gray-600 leading-snug">{l.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {quote.secondary_themes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Secondary themes
              </p>
              <div className="flex flex-col gap-1">
                {quote.secondary_themes.map(st => (
                  <div key={st.theme.id} className="flex gap-2 items-start">
                    <span className="text-xs font-mono text-gray-400 shrink-0">
                      {st.theme.theme_code}
                    </span>
                    <span className="text-xs text-gray-600">
                      {st.theme.theme_name}
                      {st.relevance_note ? ` — ${st.relevance_note}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
