import { useState, useMemo, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useExamSkills } from '../hooks/useExamSkills'
import { AoBadge } from '../components/AoBadge'
import ExamSkillsPanel from '../components/drama/ExamSkillsPanel'
import { supabase } from '../lib/supabase'
import type { GradeBand } from '../types/database'
import { getQuestionsForPlay, getThemeFrequencies, themeQuoteBanks } from '../data/pastPapers'
import type { ThemeQuoteBank, PastPaperQuestion } from '../data/pastPapers'

type SectionKey = 'thesis' | 'paragraph_plan' | 'sentence_stems' | 'critic_positions' | 'model_paragraph'

const SECTION_OPTIONS: { key: SectionKey; label: string }[] = [
  { key: 'thesis',           label: 'Thesis' },
  { key: 'paragraph_plan',   label: 'Paragraph plan' },
  { key: 'sentence_stems',   label: 'Sentence stems' },
  { key: 'critic_positions', label: 'Critic positions' },
  { key: 'model_paragraph',  label: 'Model paragraph' },
]
const ALL_SECTION_KEYS: SectionKey[] = SECTION_OPTIONS.map(s => s.key)

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

const aoTooltips: Record<string, string> = {
  AO1: "Informed personal response — argue a clear position",
  AO2: "Methods & form — name the technique, explain its effect",
  AO3: "Context — embed it to sharpen a claim, not bolt it on",
  AO4: "Connections — compare across texts continuously",
  AO5: "Critics — paraphrase a position and show you've weighed it",
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
  const [openPapers, setOpenPapers]       = useState(false)
  const [openFreq,   setOpenFreq]         = useState(false)
  const [openQuotes, setOpenQuotes]       = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [openCard, setOpenCard]           = useState<string | null>(null)
  const [savedSections, setSavedSections] = useState<Record<string, SectionKey[]>>({})
  const [savingId, setSavingId]           = useState<string | null>(null)
  const [savedConfirm, setSavedConfirm]   = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!savedConfirm) return
    const t = setTimeout(() => setSavedConfirm(null), 3000)
    return () => clearTimeout(t)
  }, [savedConfirm])

  const saveMutation = useMutation({
    mutationFn: async ({ q, sections }: { q: PastPaperQuestion; sections: SectionKey[] }) => {
      if (!q.framework) throw new Error('No framework to save')
      const fw = q.framework
      const row: Record<string, unknown> = {
        title: q.question.length > 200 ? q.question.slice(0, 200) : q.question,
        source: 'exam',
        source_question_id: q.id,
        play: q.play,
        thesis:           sections.includes('thesis')           ? fw.thesis           : null,
        paragraph_plan:   sections.includes('paragraph_plan')   ? fw.paragraph_plan   : null,
        sentence_stems:   sections.includes('sentence_stems')   ? fw.sentence_stems   : null,
        critic_positions: sections.includes('critic_positions') ? fw.critic_positions : null,
        model_paragraph:  sections.includes('model_paragraph')  ? fw.model_paragraph  : null,
        saved_sections:   sections,
      }
      const { error } = await supabase.from('user_essay_plans').insert(row)
      if (error) throw error
    },
    onSuccess: (_d, vars) => {
      setSavedConfirm(vars.q.id)
      setSavingId(null)
      queryClient.invalidateQueries({ queryKey: ['user_essay_plans'] })
    },
    onError: () => setSavingId(null),
  })

  function toggleSection(qid: string, key: SectionKey) {
    setSavedSections(prev => {
      const current = prev[qid] ?? ALL_SECTION_KEYS
      const next = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key]
      return { ...prev, [qid]: next }
    })
  }

  function handleSave(q: PastPaperQuestion) {
    const sections = savedSections[q.id] ?? ALL_SECTION_KEYS
    if (sections.length === 0) return
    setSavingId(q.id)
    saveMutation.mutate({ q, sections })
  }

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

  const playsToShow = play === 'both'
    ? (['HAM', 'MAL'] as const)
    : ([play] as const)
  const availableBanks = themeQuoteBanks.filter(b =>
    play === 'both' ? true : b.plays.includes(play as 'HAM' | 'MAL')
  )
  const activeTheme = selectedTheme ?? availableBanks[0]?.theme ?? null
  const activeQuotes = activeTheme
    ? availableBanks.filter(b => b.theme === activeTheme).flatMap(b => b.quotes)
    : []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Exam skills</h1>

      <SectionHeader
        title="Past papers"
        open={openPapers}
        onToggle={() => setOpenPapers(o => !o)}
      />
      {openPapers && (
        <div className="px-4 pb-4 space-y-6">
          {playsToShow.map(p => {
            const questions = getQuestionsForPlay(p)
            const years = [...new Set(questions.map(q => q.year))].sort((a,b) => b-a)
            return (
              <div key={p}>
                {play === 'both' && (
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-3
                    ${p === 'HAM' ? 'text-violet-700' : 'text-teal-700'}`}>
                    {p === 'HAM' ? 'Hamlet' : 'Duchess of Malfi'}
                  </p>
                )}
                {years.map(year => (
                  <div key={year} className="mb-4">
                    <p className="text-xs text-gray-400 font-medium mb-2">{year}</p>
                    <div className="space-y-3">
                      {questions.filter(q => q.year === year).map(q => (
                        <div key={q.id}
                          className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 cursor-pointer"
                          onClick={() => { if (openCard !== q.id) setOpenCard(q.id) }}>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-semibold uppercase
                              tracking-wide text-gray-400">{q.option}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-500
                              rounded-full px-2 py-0.5">{q.totalMarks} marks</span>
                          </div>
                          <p className="text-sm text-gray-800">{q.question}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(q.aoWeightings)
                              .filter(([, v]) => v > 0)
                              .map(([ao, weight]) => {
                                const colours: Record<string,string> = {
                                  AO1: 'bg-blue-100 text-blue-700',
                                  AO2: 'bg-amber-100 text-amber-700',
                                  AO3: 'bg-green-100 text-green-700',
                                  AO4: 'bg-rose-100 text-rose-700',
                                  AO5: 'bg-purple-100 text-purple-700',
                                }
                                return (
                                  <span key={ao} className="relative group inline-block">
                                    <span className={`text-[10px] font-medium rounded-full
                                      px-2 py-0.5 ${colours[ao] ?? 'bg-gray-100 text-gray-600'}`}>
                                      {ao} ×{weight}
                                    </span>
                                    <span className="pointer-events-none absolute bottom-full left-1/2
                                      -translate-x-1/2 mb-2 w-56 rounded-lg bg-gray-900 px-3 py-2
                                      text-xs text-white opacity-0 group-hover:opacity-100
                                      transition-opacity duration-150 z-50 text-center leading-snug
                                      shadow-lg whitespace-normal">
                                      {aoTooltips[ao]}
                                    </span>
                                  </span>
                                )
                              })}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {q.themes.map(t => (
                              <span key={t}
                                className="text-[10px] bg-gray-100 text-gray-600
                                  rounded-full px-2 py-0.5">{t}</span>
                            ))}
                          </div>

                          {openCard === q.id && q.framework && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">

                              <div className="flex justify-end mb-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpenCard(null) }}
                                  className="text-xs text-gray-400 hover:text-gray-600
                                    flex items-center gap-1">
                                  <span>✕</span>
                                  <span>Close</span>
                                </button>
                              </div>

                              {/* THESIS */}
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide
                                  text-violet-600 mb-1">Thesis</p>
                                <p className="text-sm text-gray-700 leading-relaxed italic">
                                  {q.framework.thesis}
                                </p>
                              </div>

                              {/* PARAGRAPH PLAN */}
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide
                                  text-violet-600 mb-2">Paragraph plan</p>
                                <div className="space-y-2">
                                  {q.framework.paragraph_plan.map((p, i) => (
                                    <div key={i} className="rounded-lg bg-gray-50 p-3">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="text-xs font-medium text-gray-800">{p.topic}</p>
                                        <div className="flex gap-1 flex-shrink-0">
                                          {p.ao_focus.map(ao => (
                                            <span key={ao} className="text-[9px] bg-violet-100
                                              text-violet-700 rounded px-1.5 py-0.5">{ao}</span>
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        {p.topic_sentence}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* SENTENCE STEMS */}
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide
                                  text-violet-600 mb-2">Sentence stems</p>
                                <div className="space-y-1.5">
                                  {Object.entries(q.framework.sentence_stems)
                                    .filter(([, v]) => v)
                                    .map(([ao, stem]) => (
                                      <div key={ao} className="flex gap-2 text-xs">
                                        <span className="font-semibold text-gray-500
                                          flex-shrink-0 w-8">{ao}</span>
                                        <span className="text-gray-700 leading-relaxed">{stem}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              {/* CRITIC POSITIONS */}
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide
                                  text-violet-600 mb-2">Critic positions</p>
                                <div className="space-y-2">
                                  {q.framework.critic_positions.map((c, i) => (
                                    <div key={i} className="rounded-lg border border-gray-200
                                      bg-white p-3">
                                      <p className="text-xs font-semibold text-gray-800 mb-0.5">
                                        {c.critic}
                                      </p>
                                      <p className="text-xs text-gray-600 mb-1 italic">
                                        {c.position}
                                      </p>
                                      <p className="text-xs text-gray-500 leading-relaxed">
                                        {c.embed}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* MODEL PARAGRAPH */}
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide
                                  text-violet-600 mb-1">Model paragraph</p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {q.framework.model_paragraph}
                                </p>
                              </div>

                              {/* SAVE TO MY PLANS */}
                              <div className="pt-4 border-t border-gray-100"
                                onClick={(e) => e.stopPropagation()}>
                                <p className="text-[10px] font-semibold uppercase tracking-wide
                                  text-violet-600 mb-2">Save to My Plans</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {SECTION_OPTIONS.map(opt => {
                                    const checked = (savedSections[q.id] ?? ALL_SECTION_KEYS)
                                      .includes(opt.key)
                                    return (
                                      <label key={opt.key}
                                        className="flex items-center gap-1.5 text-xs text-gray-700
                                          bg-gray-50 hover:bg-gray-100 rounded-full px-2.5 py-1
                                          cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => toggleSection(q.id, opt.key)}
                                          className="accent-violet-600"
                                        />
                                        {opt.label}
                                      </label>
                                    )
                                  })}
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleSave(q)}
                                    disabled={savingId === q.id ||
                                      ((savedSections[q.id] ?? ALL_SECTION_KEYS).length === 0)}
                                    className="text-xs font-medium bg-violet-600 hover:bg-violet-700
                                      disabled:bg-gray-300 disabled:cursor-not-allowed
                                      text-white rounded-lg px-3 py-1.5 transition-colors"
                                  >
                                    {savingId === q.id ? 'Saving…' : 'Save to My Plans'}
                                  </button>
                                  {savedConfirm === q.id && (
                                    <span className="text-xs text-green-600 font-medium
                                      transition-opacity">
                                      ✓ Saved to My Plans
                                    </span>
                                  )}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      <SectionHeader
        title="Theme frequency"
        open={openFreq}
        onToggle={() => setOpenFreq(o => !o)}
      />
      {openFreq && (
        <div className="px-4 pb-4">
          <ExamSkillsPanel play={play} />
        </div>
      )}

      <SectionHeader
        title="Quote bank"
        open={openQuotes}
        onToggle={() => setOpenQuotes(o => !o)}
      />
      {openQuotes && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {[...new Set(availableBanks.map(b => b.theme))].map(theme => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`text-xs rounded-full px-3 py-1 border capitalize
                  ${activeTheme === theme
                    ? 'bg-violet-100 text-violet-700 border-violet-300'
                    : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {theme}
              </button>
            ))}
          </div>
          {activeQuotes.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No quotes available for this selection.
            </p>
          ) : (
            <div className="space-y-4">
              {play === 'both'
                ? (['HAM','MAL'] as const).map(p => {
                    const pQuotes = availableBanks
                      .filter(b => b.theme === activeTheme && b.plays.includes(p))
                      .flatMap(b => b.quotes)
                    if (pQuotes.length === 0) return null
                    return (
                      <div key={p}>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2
                          ${p === 'HAM' ? 'text-violet-700' : 'text-teal-700'}`}>
                          {p === 'HAM' ? 'Hamlet' : 'Duchess of Malfi'}
                        </p>
                        {pQuotes.map((q, i) => (
                          <div key={i}
                            className="rounded-xl border border-gray-200 bg-white p-4 mb-3">
                            <p className="text-sm italic text-gray-800 mb-1">"{q.text}"</p>
                            <p className="text-xs text-gray-500">
                              {q.speaker} — Act {q.act}, Scene {q.scene}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              {q.significance}
                            </p>
                          </div>
                        ))}
                      </div>
                    )
                  })
                : activeQuotes.map((q, i) => (
                    <div key={i}
                      className="rounded-xl border border-gray-200 bg-white p-4">
                      <p className="text-sm italic text-gray-800 mb-1">"{q.text}"</p>
                      <p className="text-xs text-gray-500">
                        {q.speaker} — Act {q.act}, Scene {q.scene}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {q.significance}
                      </p>
                    </div>
                  ))
              }
            </div>
          )}
        </div>
      )}

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
