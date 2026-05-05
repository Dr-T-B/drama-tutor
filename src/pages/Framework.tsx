import { useEffect, useMemo, useState } from 'react'
import {
  fetchAllThemes,
  buildFramework,
  type ThemeSummary,
  type FrameworkData,
  type AiAnalysis,
  type QuoteRow,
} from '../hooks/useFrameworkData'

type Status = 'idle' | 'loading' | 'done' | 'error'

const AO_BG: Record<string, string> = {
  AO1: 'bg-blue-100 text-blue-800',
  AO2: 'bg-green-100 text-green-800',
  AO3: 'bg-amber-100 text-amber-800',
  AO4: 'bg-purple-100 text-purple-800',
  AO5: 'bg-rose-100 text-rose-800',
}
const AO_RING: Record<string, string> = {
  AO1: 'border-blue-300 bg-blue-50',
  AO2: 'border-green-300 bg-green-50',
  AO3: 'border-amber-300 bg-amber-50',
  AO4: 'border-purple-300 bg-purple-50',
  AO5: 'border-rose-300 bg-rose-50',
}

const PRIORITY_CARD: Record<string, string> = {
  essential: 'border-red-300 bg-red-50',
  strong: 'border-amber-300 bg-amber-50',
  optional: 'border-gray-200 bg-gray-50',
}
const PRIORITY_PILL: Record<string, string> = {
  essential: 'bg-red-600 text-white',
  strong: 'bg-amber-500 text-white',
  optional: 'bg-gray-400 text-white',
}

function gradeClasses(g?: string | null): { cls: string; label: string } {
  if (g === 'A_STAR') return { cls: 'bg-amber-100 text-amber-700 font-bold', label: 'A★' }
  if (g === 'A') return { cls: 'bg-violet-100 text-violet-700', label: 'A' }
  return { cls: 'bg-gray-100 text-gray-600', label: g ?? 'B' }
}

function AoBadgeInline({ ao }: { ao: string }) {
  const cls = AO_BG[ao] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{ao}</span>
  )
}

function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-3xl font-bold text-gray-300 tabular-nums">{n}</span>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  )
}

function quoteText(q: any): string {
  return (q?.quote_text ?? q?.text ?? q?.content ?? '') as string
}

export function Framework() {
  const [themes, setThemes] = useState<ThemeSummary[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<string>('')
  const [question, setQuestion] = useState<string>('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [data, setData] = useState<FrameworkData | null>(null)
  const [ai, setAi] = useState<AiAnalysis | null>(null)

  useEffect(() => {
    fetchAllThemes()
      .then(setThemes)
      .catch((e: Error) => {
        setStatus('error')
        setErrorMsg(`Could not load themes: ${e.message}`)
      })
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [])

  const hamletThemes = useMemo(() => themes.filter(t => t.play === 'HAM'), [themes])
  const malfiThemes = useMemo(() => themes.filter(t => t.play === 'MAL'), [themes])

  function autoDetectTheme(): string | null {
    if (!question.trim() || !themes.length) return null
    const q = question.toLowerCase()
    for (const t of themes) {
      const words = (t.theme_name ?? '').toLowerCase().split(/\W+/).filter(w => w.length > 4)
      if (words.some(w => q.includes(w))) return t.id
    }
    return null
  }

  async function handleBuild() {
    setErrorMsg('')
    if (!question.trim()) {
      setErrorMsg('Please enter an exam question.')
      setStatus('error')
      return
    }

    let themeId = selectedThemeId
    if (!themeId) {
      const detected = autoDetectTheme()
      if (!detected) {
        setErrorMsg('Could not auto-detect a theme from the question — please select one from the dropdown.')
        setStatus('error')
        return
      }
      themeId = detected
      setSelectedThemeId(detected)
    }

    setStatus('loading')
    try {
      const result = await buildFramework(themeId, question)
      setData(result.data)
      setAi(result.ai)
      setStatus('done')
    } catch (e: any) {
      setErrorMsg(String(e?.message ?? e))
      setStatus('error')
    }
  }

  const stemsByAo = useMemo(() => {
    const out: Record<string, FrameworkData['stems']> = {}
    if (!data) return out
    for (const s of data.stems) {
      const key = s.ao_code ?? 'OTHER'
      ;(out[key] ||= []).push(s)
    }
    return out
  }, [data])

  const methodsByCategory = useMemo(() => {
    const out: Record<string, FrameworkData['methods']> = {}
    if (!data) return out
    for (const m of data.methods) {
      const key = m.method_category ?? 'Other'
      ;(out[key] ||= []).push(m)
    }
    return out
  }, [data])

  const aiPriorityMethodNames = useMemo(() => {
    if (!ai) return new Set<string>()
    return new Set(ai.method_focus.map(m => m.method.toLowerCase()))
  }, [ai])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Input zone */}
      <section className="bg-gray-900 text-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎯 Exam Framework Builder</h1>
          <p className="text-gray-400 mb-6 text-sm">
            Edexcel A-Level English Literature — Component 1 Drama (9ET0/01). Paste a past question, pick a theme, get
            a 10-section A*-targeted framework built from your revision data.
          </p>

          <label className="block text-sm font-medium text-gray-300 mb-1">Exam question</label>
          <textarea
            rows={3}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder='e.g. "Explore the significance of madness in Hamlet. In your answer, you must consider the dramatic methods Shakespeare uses."'
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <label className="block text-sm font-medium text-gray-300 mt-4 mb-1">
            Theme <span className="text-gray-500 font-normal">(or leave blank to auto-detect)</span>
          </label>
          <select
            value={selectedThemeId}
            onChange={e => setSelectedThemeId(e.target.value)}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">— Select a theme —</option>
            <optgroup label="Hamlet (Section A)">
              {hamletThemes.map(t => (
                <option key={t.id} value={t.id}>
                  {t.theme_code} · {t.theme_name}
                </option>
              ))}
            </optgroup>
            <optgroup label="The Duchess of Malfi (Section B)">
              {malfiThemes.map(t => (
                <option key={t.id} value={t.id}>
                  {t.theme_code} · {t.theme_name}
                </option>
              ))}
            </optgroup>
          </select>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleBuild}
              disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold text-sm transition-colors"
            >
              {status === 'loading' ? 'Building framework — fetching data + running AI analysis…' : 'Build framework'}
            </button>
            {status === 'error' && errorMsg && (
              <span className="text-sm text-red-400">{errorMsg}</span>
            )}
          </div>
        </div>
      </section>

      {/* Output zone */}
      {data && ai && (
        <section className="bg-white px-6 py-12">
          <div className="max-w-5xl mx-auto space-y-14">
            <header className="border-b border-gray-200 pb-6">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                {data.theme.play_title} · {data.theme.section_relevance ?? ''}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{data.theme.theme_name}</h2>
              <p className="text-sm text-gray-600 italic mt-2">"{question}"</p>
            </header>

            {/* 01 Question decoded */}
            <div>
              <SectionHeader n="01" title="Question decoded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">Command word</div>
                  <div className="text-gray-900">{ai.question_decoded.command_word}</div>
                </div>
                <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-violet-700 mb-1">What is really asked</div>
                  <div className="text-gray-900">{ai.question_decoded.what_is_really_asked}</div>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-red-700 mb-1">Conceptual trap</div>
                  <div className="text-gray-900">{ai.question_decoded.conceptual_trap}</div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-green-700 mb-1">Examiner wants</div>
                  <div className="text-gray-900">{ai.question_decoded.examiner_wants}</div>
                </div>
              </div>
            </div>

            {/* 02 Core argument */}
            <div>
              <SectionHeader n="02" title="Core argument" />
              <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-5 mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-amber-800 mb-2">Recommended thesis</div>
                <p className="text-gray-900 text-lg leading-relaxed">{ai.core_argument.recommended_thesis}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Argument direction</div>
                  <div className="text-sm text-gray-800">{ai.core_argument.argument_direction}</div>
                </div>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Dialectical move</div>
                  <div className="text-sm text-gray-800">{ai.core_argument.dialectical_move}</div>
                </div>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Section note</div>
                  <div className="text-sm text-gray-800">{ai.core_argument.section_note}</div>
                </div>
              </div>
              {data.theses.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved theses for this theme</h3>
                  <ul className="space-y-2">
                    {data.theses.map((t, i) => {
                      const g = gradeClasses(t.grade_band)
                      return (
                        <li key={i} className="flex gap-3 items-start rounded-md border border-gray-200 p-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${g.cls} shrink-0`}>{g.label}</span>
                          <div className="text-sm text-gray-800">
                            <p>{t.thesis_text}</p>
                            {t.examiner_commentary && (
                              <p className="text-xs text-gray-500 italic mt-1">{t.examiner_commentary}</p>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* 03 AOs */}
            <div>
              <SectionHeader n="03" title="Assessment objectives" />
              <div className="space-y-2">
                {(['ao1', 'ao2', 'ao3', 'ao4', 'ao5'] as const).map(key => {
                  const code = key.toUpperCase()
                  return (
                    <div key={key} className={`flex gap-3 items-start rounded-md border p-3 ${AO_RING[code]}`}>
                      <AoBadgeInline ao={code} />
                      <p className="text-sm text-gray-800 flex-1">{ai.ao_breakdown[key]}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 04 Sentence stems */}
            <div>
              <SectionHeader n="04" title="Sentence stems" />
              {Object.keys(stemsByAo).length === 0 ? (
                <p className="text-sm text-gray-500 italic">No sentence stems found in your revision data.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(stemsByAo).map(([ao, list]) => (
                    <div key={ao}>
                      <div className="mb-2"><AoBadgeInline ao={ao} /></div>
                      <ul className="space-y-1.5">
                        {list.map(s => (
                          <li key={s.id} className="text-sm">
                            {s.label && <span className="font-semibold text-gray-700">{s.label}: </span>}
                            <span className="italic text-gray-700">{s.stem_text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 05 Characters */}
            <div>
              <SectionHeader n="05" title="Characters" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ai.character_guidance.map((c, i) => {
                  const cls = PRIORITY_CARD[c.priority] ?? PRIORITY_CARD.optional
                  const pill = PRIORITY_PILL[c.priority] ?? PRIORITY_PILL.optional
                  const dbChar = data.characters.find(
                    x => x.name?.toLowerCase() === c.name.toLowerCase()
                  )
                  return (
                    <div key={i} className={`rounded-lg border p-4 ${cls}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{c.name}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${pill}`}>{c.priority}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-1"><span className="font-semibold">Why:</span> {c.why}</p>
                      <p className="text-sm text-gray-800"><span className="font-semibold">Angle:</span> {c.angle}</p>
                      {dbChar?.dramatic_function && (
                        <p className="text-xs italic text-gray-600 mt-2 pt-2 border-t border-gray-200">
                          {dbChar.dramatic_function}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 06 Quotes — ranked list */}
            <div>
              <SectionHeader n="06" title="Quotes — ranked by priority" />
              {(() => {
                const sorted = [...data.quotes].sort(
                  (a, b) => (b.memorisation_priority ?? 0) - (a.memorisation_priority ?? 0),
                )
                const mustUse = sorted.filter(q => (q.memorisation_priority ?? 0) === 5)
                const strong = sorted.filter(q => (q.memorisation_priority ?? 0) === 4)
                const additional = sorted.filter(q => (q.memorisation_priority ?? 0) <= 3)

                let rank = 0
                const renderCard = (q: QuoteRow) => {
                  rank += 1
                  const priority = q.memorisation_priority ?? 0
                  let badgeLabel = 'Optional'
                  let badgeCls = 'bg-gray-200 text-gray-700'
                  if (priority === 5) { badgeLabel = 'Must use'; badgeCls = 'bg-amber-200 text-amber-900' }
                  else if (priority === 4) { badgeLabel = 'Strong'; badgeCls = 'bg-violet-200 text-violet-900' }
                  else if (priority === 3) { badgeLabel = 'Useful'; badgeCls = 'bg-gray-200 text-gray-800' }

                  const methodNames = (q.quote_methods ?? [])
                    .map(m => m.ao2_methods?.method_name)
                    .filter((n): n is string => !!n)

                  return (
                    <div key={q.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-3xl font-bold text-gray-300 tabular-nums leading-none">{rank}</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${badgeCls}`}>
                          {badgeLabel}
                        </span>
                        {(q.speaker || q.act_scene) && (
                          <span className="text-xs text-gray-500">
                            {q.speaker}
                            {q.speaker && q.act_scene ? ' · ' : ''}
                            {q.act_scene}
                          </span>
                        )}
                        <div className="flex gap-1 ml-auto">
                          {q.ao_codes.map(ao => <AoBadgeInline key={ao} ao={ao} />)}
                        </div>
                      </div>

                      <blockquote className="border-l-4 border-violet-500 pl-3 italic text-gray-900 mb-3">
                        "{quoteText(q)}"
                      </blockquote>

                      {q.exam_sentence ? (
                        <div className="rounded bg-green-50 border border-green-200 p-3 mb-3">
                          <div className="text-xs font-bold uppercase text-green-700 mb-1">Why this quote works</div>
                          <p className="text-sm text-gray-800">{q.exam_sentence}</p>
                        </div>
                      ) : (
                        <p className="text-xs italic text-gray-400 mb-3">Exam sentence not yet added</p>
                      )}

                      {methodNames.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {methodNames.map((m, i) => (
                            <span
                              key={`${q.id}-m-${i}`}
                              className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <div className="space-y-6">
                    {mustUse.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-amber-700 mb-3">
                          ★ Use these first
                        </h3>
                        <div className="space-y-3">{mustUse.map(renderCard)}</div>
                      </div>
                    )}
                    {strong.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-violet-700 mb-3">
                          Strong choices
                        </h3>
                        <div className="space-y-3">{strong.map(renderCard)}</div>
                      </div>
                    )}
                    {additional.length > 0 && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-gray-600 mb-3 select-none">
                          Additional options ({additional.length})
                        </summary>
                        <div className="space-y-3 mt-3">{additional.map(renderCard)}</div>
                      </details>
                    )}
                    {sorted.length === 0 && (
                      <p className="text-sm italic text-gray-500">No quotes found for this theme.</p>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* 07 Critics */}
            <div>
              <SectionHeader n="07" title="Critics (AO5)" />
              <div className="space-y-3">
                {ai.critic_deployment.map((c, i) => (
                  <div key={i} className="rounded-md border border-rose-200 overflow-hidden">
                    <div className="bg-rose-100 px-4 py-2 flex justify-between items-baseline">
                      <h4 className="font-semibold text-rose-900">{c.critic}</h4>
                      <span className="text-xs text-rose-700 italic">{c.when_to_use}</span>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-800 mb-2"><span className="font-semibold">Position:</span> {c.position}</p>
                      <p className="text-sm text-gray-900 italic bg-rose-50 border-l-2 border-rose-300 pl-3 py-1">
                        {c.sentence}
                      </p>
                    </div>
                  </div>
                ))}
                {(() => {
                  const aiNames = new Set(ai.critic_deployment.map(c => c.critic.toLowerCase()))
                  const extras = data.critics.filter(
                    dc => dc.critics?.name && !aiNames.has(dc.critics.name.toLowerCase()) && dc.usable_ao5_sentence
                  )
                  if (!extras.length) return null
                  return (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Other usable AO5 sentences</h4>
                      <ul className="space-y-1.5">
                        {extras.map(e => (
                          <li key={e.id} className="text-sm text-gray-700">
                            <span className="font-semibold">{e.critics?.name}:</span>{' '}
                            <span className="italic">{e.usable_ao5_sentence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* 08 Methods */}
            <div>
              <SectionHeader n="08" title="Dramatic methods" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {ai.method_focus.map((m, i) => (
                  <div key={i} className="rounded-lg border-2 border-green-300 bg-green-50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{m.method}</h4>
                    <p className="text-sm text-gray-800 mb-3">{m.why_central}</p>
                    <pre className="text-xs font-mono bg-white border border-green-200 rounded p-2 whitespace-pre-wrap text-gray-800">{m.exam_move}</pre>
                  </div>
                ))}
              </div>
              {Object.keys(methodsByCategory).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Full methods bank</h3>
                  <div className="space-y-3">
                    {Object.entries(methodsByCategory).map(([cat, list]) => (
                      <div key={cat}>
                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{cat}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {list.map(m => {
                            const hl = aiPriorityMethodNames.has(m.method_name.toLowerCase())
                            return (
                              <span
                                key={m.id}
                                className={
                                  'px-2 py-1 rounded-full text-xs ' +
                                  (hl
                                    ? 'bg-green-200 text-green-900 font-semibold'
                                    : 'bg-gray-100 text-gray-700')
                                }
                              >
                                {m.method_name}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 09 Common errors */}
            <div>
              <SectionHeader n="09" title="Common errors" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {ai.errors_to_avoid.map((e, i) => (
                  <div key={i} className="rounded-lg border border-red-300 bg-red-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-red-700 mb-1">Avoid</div>
                    <p className="text-sm text-gray-900">{e}</p>
                  </div>
                ))}
              </div>
              {data.commonErrors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">From the examiner error log</h3>
                  {data.commonErrors.map(e => (
                    <div key={e.id} className="rounded-md border border-gray-200 p-3">
                      <div className="font-semibold text-gray-900 text-sm">{e.name}</div>
                      {e.description && <p className="text-sm text-gray-700 mt-1">{e.description}</p>}
                      {e.correction_strategy && (
                        <p className="text-sm text-green-800 mt-2">
                          <span className="font-semibold">Fix:</span> {e.correction_strategy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 10 Forbidden moves */}
            <div>
              <SectionHeader n="10" title="Forbidden moves" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ai.forbidden_moves.map((m, i) => (
                  <div key={i} className="rounded-lg bg-gray-900 text-gray-100 p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-amber-400 mb-1">Avoid</div>
                    <p className="text-sm">{m}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus: essay plans */}
            {data.essayPlans.length > 0 && (
              <div>
                <SectionHeader n="+" title="Saved essay plans for this theme" />
                <div className="space-y-3">
                  {data.essayPlans.map(p => {
                    const g = gradeClasses(p.grade_band ?? null)
                    return (
                      <div key={p.id} className="rounded-md border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-sm font-semibold text-gray-900">{p.question ?? '(no question)'}</p>
                          <span className={`shrink-0 px-2 py-0.5 rounded text-xs ${g.cls}`}>{g.label}</span>
                        </div>
                        {p.thesis && <p className="text-sm text-gray-700 italic">{p.thesis}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
