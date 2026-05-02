import { useState } from 'react'
import { AoBadge } from './AoBadge'
import type { ThemeEnriched, GradeBand } from '../types/database'

const GRADE_LABEL: Record<GradeBand, string> = {
  B:      'Grade B',
  A:      'Grade A',
  A_STAR: 'A*',
}

const GRADE_STYLE: Record<GradeBand, string> = {
  B:      'border-blue-200 bg-blue-50',
  A:      'border-violet-200 bg-violet-50',
  A_STAR: 'border-amber-200 bg-amber-50',
}

const GRADE_LABEL_STYLE: Record<GradeBand, string> = {
  B:      'text-blue-700 bg-blue-100',
  A:      'text-violet-700 bg-violet-100',
  A_STAR: 'text-amber-700 bg-amber-100',
}

const PLAY_STYLE = {
  HAM: 'bg-violet-100 text-violet-800',
  MAL: 'bg-teal-100 text-teal-800',
}

export function ThemeCard({ theme }: { theme: ThemeEnriched }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow cursor-pointer
        hover:shadow-sm ${open ? 'shadow-sm border-gray-300' : 'border-gray-200'}`}
      onClick={() => setOpen(o => !o)}
    >
      {/* ── CLOSED ROW ── */}
      <div className="p-4 flex items-start gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
              ${PLAY_STYLE[theme.play]}`}>
              {theme.play === 'HAM' ? 'Hamlet' : 'Duchess'}
            </span>
            <span className="text-xs font-mono text-gray-400">{theme.theme_code}</span>
            <span className="text-xs text-gray-400 ml-auto">
              {theme.quote_count} quotes
            </span>
          </div>
          <p className="text-gray-900 font-medium leading-snug">{theme.theme_name}</p>
          {theme.section_relevance && (
            <p className="text-xs text-gray-400 line-clamp-2">{theme.section_relevance}</p>
          )}
        </div>
        <span className="text-gray-300 text-sm mt-1 shrink-0">
          {open ? '▲' : '▼'}
        </span>
      </div>

      {/* ── EXPANDED ── */}
      {open && (
        <div
          className="border-t border-gray-100 p-4 flex flex-col gap-5"
          onClick={e => e.stopPropagation()}
        >
          {/* Graded theses */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Graded thesis statements
            </p>
            <div className="flex flex-col gap-3">
              {theme.theses.map(thesis => (
                <div key={thesis.id}
                  className={`rounded-lg border p-3 ${GRADE_STYLE[thesis.grade_band]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${GRADE_LABEL_STYLE[thesis.grade_band]}`}>
                      {GRADE_LABEL[thesis.grade_band]}
                    </span>
                    <div className="flex gap-1">
                      {thesis.ao_focus.map(ao => (
                        <AoBadge key={ao} ao={ao} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {thesis.thesis_text}
                  </p>
                  {thesis.examiner_commentary && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {thesis.examiner_commentary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Critic views linked to this theme */}
          {theme.critic_views.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Critical perspectives
              </p>
              <div className="flex flex-col gap-3">
                {theme.critic_views.map(ci => (
                  <div key={ci.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {ci.critic_name}
                      </span>
                      <span className="text-xs text-gray-400">{ci.critic_school}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {ci.interpretation}
                    </p>
                    {ci.usable_ao5_sentence && (
                      <div className="bg-purple-50 rounded p-2 border border-purple-100">
                        <p className="text-xs font-semibold text-purple-600 mb-0.5">
                          AO5 sentence
                        </p>
                        <p className="text-xs text-purple-900">{ci.usable_ao5_sentence}</p>
                      </div>
                    )}
                    {ci.counter_reading && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-400 mb-0.5">
                          Counter-reading
                        </p>
                        <p className="text-xs text-gray-600">{ci.counter_reading}</p>
                      </div>
                    )}
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
