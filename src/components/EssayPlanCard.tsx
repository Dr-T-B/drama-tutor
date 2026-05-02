import { useState } from 'react'
import { AoBadge } from './AoBadge'
import type { EssayPlanEnriched } from '../types/database'

const PLAY_BADGE = {
  HAM: 'bg-violet-100 text-violet-800',
  MAL: 'bg-teal-100 text-teal-800',
}

const PLAY_LABEL = { HAM: 'Hamlet', MAL: 'Duchess' }

function formatLevel(level: string | null): string {
  if (!level) return ''
  return level === 'A_STAR' ? 'A*' : level
}

interface AoRowProps { label: string; content: string | null }
function AoRow({ label, content }: AoRowProps) {
  if (!content) return null
  return (
    <div className="flex gap-2 items-start">
      <AoBadge ao={label} />
      <p className="text-xs text-gray-600 leading-relaxed flex-1">{content}</p>
    </div>
  )
}

export function EssayPlanCard({ plan }: { plan: EssayPlanEnriched }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow cursor-pointer
        hover:shadow-sm ${open ? 'shadow-sm border-gray-300' : 'border-gray-200'}`}
      onClick={() => setOpen(o => !o)}
    >
      {/* ── CLOSED ROW ── */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
            ${PLAY_BADGE[plan.play]}`}>
            {PLAY_LABEL[plan.play]}
          </span>
          <span className="text-xs text-gray-400 font-mono">{plan.theme_code}</span>
          {plan.timed_plan && plan.plan_minutes && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5
                             rounded-full font-medium ml-auto">
              ⏱ {plan.plan_minutes} min
            </span>
          )}
          {plan.target_level && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5
                             rounded-full font-medium">
              {formatLevel(plan.target_level)}
            </span>
          )}
        </div>
        <p className="text-gray-900 font-medium leading-snug text-sm">
          {plan.question_text}
        </p>
        <p className="text-xs text-gray-400">{plan.theme_name}</p>
      </div>

      {/* ── EXPANDED ── */}
      {open && (
        <div
          className="border-t border-gray-100 p-4 flex flex-col gap-5"
          onClick={e => e.stopPropagation()}
        >
          {/* Conceptual thesis */}
          {plan.conceptual_thesis &&
            plan.conceptual_thesis !== plan.question_text && (
            <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
              <p className="text-xs font-semibold text-violet-600 uppercase
                             tracking-wide mb-1">
                Conceptual thesis
              </p>
              <p className="text-sm text-violet-900 leading-relaxed">
                {plan.conceptual_thesis}
              </p>
            </div>
          )}

          {/* Examiner rationale */}
          {plan.examiner_rationale && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase
                             tracking-wide mb-1">
                Examiner rationale
              </p>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                {plan.examiner_rationale}
              </p>
            </div>
          )}

          {/* Paragraphs */}
          {plan.paragraphs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase
                             tracking-wide mb-3">
                Paragraph plan
              </p>
              <div className="flex flex-col gap-4">
                {plan.paragraphs.map(pp => (
                  <div key={pp.id}
                    className="rounded-lg border border-gray-200 p-3 flex flex-col gap-3">
                    {/* Para header */}
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600
                                       text-xs font-semibold flex items-center
                                       justify-center shrink-0">
                        {pp.paragraph_no}
                      </span>
                      {pp.paragraph_function && (
                        <p className="text-sm font-semibold text-gray-800">
                          {pp.paragraph_function}
                        </p>
                      )}
                    </div>

                    {/* Topic sentence */}
                    {pp.topic_sentence && (
                      <p className="text-sm text-gray-700 leading-relaxed
                                     border-l-2 border-violet-200 pl-3">
                        {pp.topic_sentence}
                      </p>
                    )}

                    {/* Linked quote */}
                    {pp.quote_content && (
                      <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
                        <p className="text-xs text-gray-400 mb-1">
                          Key quote{pp.quote_speaker ? ` — ${pp.quote_speaker}` : ''}
                        </p>
                        <p className="text-xs text-gray-700 italic">
                          "{pp.quote_content}"
                        </p>
                      </div>
                    )}

                    {/* AO moves */}
                    <div className="flex flex-col gap-1.5">
                      <AoRow label="AO2" content={pp.ao2_move} />
                      <AoRow label="AO3" content={pp.ao3_move} />
                      <AoRow label="AO4" content={pp.ao4_move} />
                      <AoRow label="AO5" content={pp.ao5_move} />
                    </div>

                    {/* Mini judgement */}
                    {pp.mini_judgement && (
                      <div className="bg-amber-50 rounded p-2.5 border
                                      border-amber-100">
                        <p className="text-xs font-semibold text-amber-700 mb-1">
                          Mini judgement
                        </p>
                        <p className="text-xs text-amber-900 leading-relaxed">
                          {pp.mini_judgement}
                        </p>
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
