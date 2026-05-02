import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useExamSkills } from '../hooks/useExamSkills'
import { AoBadge } from '../components/AoBadge'
import type { GradeBand } from '../types/database'

const SECTION_PLAY = { SECTION_A: 'HAM', SECTION_B: 'MAL' } as const
const SECTION_LABEL = {
  SECTION_A: 'Section A — Hamlet (35 marks)',
  SECTION_B: 'Section B — Duchess of Malfi (25 marks)',
}

const GRADE_STYLE: Record<GradeBand, { bg: string; text: string; badge: string }> = {
  B:      { bg: 'bg-blue-50',   text: 'text-blue-900',   badge: 'bg-blue-100 text-blue-700'   },
  A:      { bg: 'bg-violet-50', text: 'text-violet-900', badge: 'bg-violet-100 text-violet-700' },
  A_STAR: { bg: 'bg-amber-50',  text: 'text-amber-900',  badge: 'bg-amber-100 text-amber-700'  },
}

const GRADE_LABEL: Record<GradeBand, string> = {
  B: 'Grade B', A: 'Grade A', A_STAR: 'A*',
}

function SectionHeader({
  title, open, onToggle, count,
}: { title: string; open: boolean; onToggle: () => void; count?: number }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4
                 hover:bg-gray-50 transition-colors text-left rounded-xl"
    >
      <div className="flex items-center gap-3">
        <p className="text-base font-semibold text-gray-900">{title}</p>
        {count !== undefined && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <span className="text-gray-300 text-sm">{open ? '▲' : '▼'}</span>
    </button>
  )
}

export function Exam() {
  const { userId, loading: authLoading } = useAuth()
  const { play } = usePlay()
  const { timing, grades, errors, vocab, isLoading } = useExamSkills(userId)

  const [openTiming, setOpenTiming]   = useState(true)
  const [openGrades, setOpenGrades]   = useState(false)
  const [openErrors, setOpenErrors]   = useState(false)
  const [openVocab, setOpenVocab]     = useState(false)
  const [expandedError, setExpandedError] = useState<string | null>(null)
  const [vocabSearch, setVocabSearch] = useState('')

  const visibleTiming = useMemo(() =>
    timing.filter(ts => {
      const tsPlay = SECTION_PLAY[ts.section]
      return play === 'both' || tsPlay === play
    }),
    [timing, play]
  )

  const filteredVocab = useMemo(() => {
    if (!vocabSearch.trim()) return vocab
    const term = vocabSearch.toLowerCase()
    return vocab.filter(v =>
      v.term.toLowerCase().includes(term) ||
      v.definition.toLowerCase().includes(term) ||
      v.usage_in_analysis?.toLowerCase().includes(term)
    )
  }, [vocab, vocabSearch])

  if (authLoading || isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading exam skills…
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Exam skills</h1>

      {/* SECTION 1: Timing */}
      <div className="rounded-xl border border-gray-200 bg-white mb-4">
        <SectionHeader
          title="Timing strategy"
          open={openTiming}
          onToggle={() => setOpenTiming(o => !o)}
        />
        {openTiming && (
          <div className="border-t border-gray-100 p-4 flex flex-col gap-4">
            {visibleTiming.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No timing data for the selected play.
              </p>
            )}
            {visibleTiming.map(ts => (
              <div key={ts.id}
                className="rounded-xl border border-gray-200 overflow-hidden">
                <div className={`px-4 py-3 font-semibold text-sm
                  ${ts.section === 'SECTION_A'
                    ? 'bg-violet-50 text-violet-900 border-b border-violet-100'
                    : 'bg-teal-50 text-teal-900 border-b border-teal-100'}`}>
                  {SECTION_LABEL[ts.section]}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y
                                divide-gray-100">
                  {[
                    { label: 'Total',    value: ts.total_minutes,    unit: 'min' },
                    { label: 'Planning', value: ts.planning_minutes,  unit: 'min' },
                    { label: 'Writing',  value: ts.writing_minutes,   unit: 'min' },
                    { label: 'Checking', value: ts.checking_minutes,  unit: 'min' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col items-center
                                                      py-3 gap-0.5">
                      <span className="text-xl font-semibold text-gray-900">
                        {item.value}
                      </span>
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                  ))}
                </div>
                {ts.strategy_note && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {ts.strategy_note}
                    </p>
                  </div>
                )}
                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">{ts.recommended_paragraphs} paragraphs</span>
                    {' — '}
                    {Math.round(ts.writing_minutes / ts.recommended_paragraphs)} min each
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Grade descriptors */}
      <div className="rounded-xl border border-gray-200 bg-white mb-4">
        <SectionHeader
          title="Grade level descriptors"
          open={openGrades}
          onToggle={() => setOpenGrades(o => !o)}
          count={grades.length}
        />
        {openGrades && (
          <div className="border-t border-gray-100 p-4 flex flex-col gap-3">
            {grades.map(g => {
              const style = GRADE_STYLE[g.grade_band]
              const borderCls = g.grade_band === 'B'
                ? 'border-blue-200'
                : g.grade_band === 'A'
                ? 'border-violet-200'
                : 'border-amber-200'
              return (
                <div key={g.id}
                  className={`rounded-xl border p-4 flex flex-col gap-3
                    ${style.bg} ${borderCls}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold w-5 h-5 rounded-full
                                     bg-white flex items-center justify-center
                                     border text-gray-600">
                      {g.level_no}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5
                                      rounded-full ${style.badge}`}>
                      {GRADE_LABEL[g.grade_band]}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${style.text}`}>
                    {g.descriptor}
                  </p>
                  {g.examiner_translation && (
                    <div className="bg-white bg-opacity-60 rounded-lg p-2.5">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Examiner voice
                      </p>
                      <p className="text-xs text-gray-700 italic leading-relaxed">
                        {g.examiner_translation}
                      </p>
                    </div>
                  )}
                  {g.success_criteria && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Success criteria
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {g.success_criteria}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: Common errors */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <SectionHeader
          title="Common errors to avoid"
          open={openErrors}
          onToggle={() => setOpenErrors(o => !o)}
          count={errors.length}
        />
        {openErrors && (
          <div className="border-t border-gray-100 p-4 flex flex-col gap-2">
            {errors.map(err => (
              <div key={err.id}
                className={`rounded-xl border cursor-pointer transition-shadow
                  hover:shadow-sm
                  ${expandedError === err.id
                    ? 'border-red-200 shadow-sm'
                    : 'border-gray-200'}`}
                onClick={() =>
                  setExpandedError(e => e === err.id ? null : err.id)
                }
              >
                <div className="p-3 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <p className="text-sm font-semibold text-gray-800 flex-1">
                    {err.error_name}
                  </p>
                  <span className="text-gray-300 text-xs">
                    {expandedError === err.id ? '▲' : '▼'}
                  </span>
                </div>

                {expandedError === err.id && (
                  <div
                    className="border-t border-red-100 p-3 flex flex-col gap-3"
                    onClick={e => e.stopPropagation()}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {err.error_description}
                    </p>
                    {err.symptom_in_student_writing && (
                      <div className="bg-red-50 rounded-lg p-2.5 border
                                      border-red-100">
                        <p className="text-xs font-semibold text-red-600 mb-1">
                          What it looks like
                        </p>
                        <p className="text-xs text-red-900 leading-relaxed">
                          {err.symptom_in_student_writing}
                        </p>
                      </div>
                    )}
                    {err.correction_strategy && (
                      <div className="bg-green-50 rounded-lg p-2.5 border
                                      border-green-100">
                        <p className="text-xs font-semibold text-green-700 mb-1">
                          How to fix it
                        </p>
                        <p className="text-xs text-green-900 leading-relaxed">
                          {err.correction_strategy}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 4: Vocabulary ── */}
      {vocab.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white mt-4">
          <SectionHeader
            title="Analytical vocabulary"
            open={openVocab}
            onToggle={() => setOpenVocab(o => !o)}
            count={vocab.length}
          />
          {openVocab && (
            <div className="border-t border-gray-100 p-4 flex flex-col gap-3">
              {/* Search */}
              <input
                type="search"
                placeholder="Search terms, definitions…"
                value={vocabSearch}
                onChange={e => setVocabSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-violet-300"
              />
              {/* Term list */}
              <div className="flex flex-col gap-2">
                {filteredVocab.map(v => (
                  <div key={v.id}
                    className="rounded-xl border border-gray-200 p-3
                               flex flex-col gap-1.5">
                    {/* Term + AO badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 italic">
                        {v.term}
                      </span>
                      <div className="flex gap-1 ml-auto">
                        {v.ao_relevance.map(ao => (
                          <AoBadge key={ao} ao={ao} />
                        ))}
                      </div>
                    </div>
                    {/* Definition */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {v.definition}
                    </p>
                    {/* Usage example */}
                    {v.usage_in_analysis && (
                      <div className="bg-amber-50 rounded-lg px-3 py-2
                                      border border-amber-100">
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">
                          In your essay
                        </p>
                        <p className="text-xs text-amber-900 italic leading-relaxed">
                          {v.usage_in_analysis}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {filteredVocab.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No terms match.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
