import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

interface UserPlanRow {
  id: string
  title: string
  source: 'exam' | 'manual'
  source_question_id: string | null
  play: 'HAM' | 'MAL' | null
  thesis: string | null
  paragraph_plan: ParagraphPlanItem[] | null
  sentence_stems: Record<string, string> | null
  critic_positions: CriticPositionItem[] | null
  model_paragraph: string | null
  saved_sections: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

interface ParagraphPlanItem {
  topic?: string
  topic_sentence?: string
  ao_focus?: string[]
}

interface CriticPositionItem {
  critic?: string
  position?: string
  embed?: string
}

const PHASES = [
  {
    num: 1, title: 'Claim', aos: ['AO1'],
    points: [
      'Make a specific, arguable assertion — not a topic sentence, an interpretive move.',
      'Use the language of the question stem; answer the question from the first word.',
      'Signal the method: "Shakespeare employs X to suggest Y…" / "Webster constructs X in order to…"',
      'One clear, precise claim per paragraph — avoid compound claims.',
    ],
    note: null as string | null,
    ao4note: null as string | null,
  },
  {
    num: 2, title: 'Ground', aos: ['AO1', 'AO2'],
    points: [
      'Select precise evidence: word or phrase level — not sentence-length quotation.',
      'Analyse diction, imagery, syntax, tone, register, rhythm and metre.',
      'For drama: analyse theatrical form — soliloquy, aside, dramatic irony, prose/verse shift, staging.',
      'Every sentence must name a technique or articulate an effect — eliminate paraphrase entirely.',
    ],
    note: null as string | null,
    ao4note: null as string | null,
  },
  {
    num: 3, title: 'Complicate', aos: ['AO3', 'AO5'],
    points: [
      'Contextualise: bring in historical or cultural context that generates insight, not background information.',
      'Deploy critic: name → summarise position → complicate or challenge → advance your argument.',
      'Dialectical move: "Critics such as X argue… yet this reading…" — never merely agree with a critic.',
      'Advance: return to your thesis with new or deeper insight gained from the complication.',
    ],
    note: 'Level 4 → Level 5 transition: a Level 4 paragraph stops at Phase 2. A Level 5 paragraph completes Phase 3 and genuinely advances the argument.' as string | null,
    ao4note: 'For Section B: weave AO4 connections to Hamlet into Phase 3 — at the point of critical or contextual expansion, not as a separate move.' as string | null,
  },
]

const ESSAY_STRUCTURE = {
  intro: [
    { title: 'Direct response', body: 'Answer the question in the first sentence — no preamble, no plot summary. Use the language of the question. The examiner should know your position immediately.' },
    { title: 'Thesis', body: 'State your interpretive position: what you will argue across the whole essay. Specific and contestable — not a statement the examiner would accept without reading further.' },
    { title: 'Qualification', body: 'Acknowledge complexity immediately. Signal the counter-argument you will engage with. This establishes a dialectical essay from the outset — a hallmark of Level 5.' },
  ],
  body: [
    'Each paragraph = one significant argumentive step, not merely a new topic or quotation.',
    'Paragraphs must build — each one develops or complicates the thesis, not merely adds to it.',
    'Plan the logical sequence before writing: what must be established first? What follows necessarily?',
    'Organise by argument — never by character, chronology or quotation list.',
    'AO4 note (Section B): connections to Hamlet should appear 2–3 times across the body, woven into critical or contextual expansion — not confined to a dedicated comparison paragraph.',
  ],
  conclusion: [
    { title: 'Return', body: 'Use the language of the question directly — signal you have answered what was asked, not a related question of your own devising.' },
    { title: 'Synthesise', body: 'Draw together the cumulative insight of your argument — this is a culminating interpretive statement, not a summary of what each paragraph contained.' },
    { title: 'Evaluate', body: 'A decisive, confident final judgement. State what you have argued and why it is the most productive reading. Avoid hedging at the close — this is where certainty is earned.' },
  ],
}

const QUESTION_TYPES = [
  { stem: '"Explore the significance of…"', guidance: 'Significance = function + meaning + effect. What does this moment, character or theme do within the play? Multiple, competing significances give you your dialectical structure. Begin with your most important claim about significance.' },
  { stem: '"How does [playwright] present…"', guidance: 'Heavy AO2 emphasis — the HOW is the methods. Frame each paragraph around a specific method: diction, imagery, theatrical form, structural position. Do not discuss what is presented without analysing how. Context and critics enter through the methods lens.' },
  { stem: '"Discuss the view that…"', guidance: 'Built-in invitation for dialectical argument. Do not fully agree or disagree — Level 5 responses agree in part, complicate, and qualify. Engage with critics who hold the opposing view rather than those who confirm yours.' },
  { stem: '"Explore the ways in which…"', guidance: 'WAYS implies variety of approach — aim for genuine diversity: language analysis, dramatic form, contextual dimension, critical perspective. Avoid repeating the same type of analytical move across paragraphs.' },
]

const LEVEL5 = [
  { title: 'Argument is dialectical, not linear', l4: 'Paragraphs add points in sequence. Critics confirm the argument already made.', l5: 'Paragraphs build by complicating each other. Critics challenge the argument and force it to develop.' },
  { title: 'Evidence is precise, not quotation-heavy', l4: 'Long quotations with limited analysis. Quotation used as evidence of a point already made.', l5: 'Word or phrase level precision. Quotation is the starting point for analysis. Multiple analytical moves from a single phrase.' },
  { title: 'Context generates insight, not background', l4: '"In Shakespeare\'s time, women were subordinated…" — context as historical backdrop, disconnected from textual analysis.', l5: 'Context deepens or destabilises the analysis: "Greenblatt\'s reading reframes this moment as a product of Reformation anxiety, which…"' },
  { title: 'Form is analysed as meaningful, not labelled', l4: '"This is a soliloquy" / "Shakespeare uses dramatic irony here" — form identified but significance not explored.', l5: 'The soliloquy form itself becomes the argument\'s evidence — as Belsey argues, the form stages the very fragmentation of selfhood the speech describes.' },
  { title: 'Voice is confident and evaluative', l4: 'Consistent hedging: "This could suggest…" / "It might be argued that…" used as a default register throughout.', l5: 'Decisive evaluative language at key moments: "I would argue…" / "The most productive reading is…" — hedging only where genuine critical debate warrants it.' },
]

const AO_CLS: Record<string, string> = {
  AO1: 'bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  AO2: 'bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  AO3: 'bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  AO4: 'bg-purple-50 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  AO5: 'bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200',
}

async function fetchPlans(): Promise<UserPlanRow[]> {
  const { data, error } = await supabase
    .from('user_essay_plans')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as UserPlanRow[]
}

export default function EssaysView() {
  const [tab, setTab] = useState<'framework' | 'plans'>('framework')
  const [fwTab, setFwTab] = useState<'para' | 'essay' | 'qtypes' | 'l5'>('para')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['user_essay_plans'],
    queryFn: fetchPlans,
    enabled: tab === 'plans',
    staleTime: 60_000,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_essay_plans').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_essay_plans'] })
    },
  })

  function handleDelete(plan: UserPlanRow) {
    if (!confirm(`Delete "${plan.title}"? This cannot be undone.`)) return
    if (expandedId === plan.id) setExpandedId(null)
    deleteMutation.mutate(plan.id)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5">
        {(['framework', 'plans'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            {t === 'framework' ? 'Essay framework' : 'My plans'}
          </button>
        ))}
      </div>

      {tab === 'framework' && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            A single argumentive framework applies across all Edexcel Component 1 question types,
            operating at two levels: paragraph anatomy and essay structure.
          </p>
          <div className="flex flex-wrap gap-0 border-b border-gray-200 dark:border-gray-700 mb-5">
            {([['para', 'Paragraph anatomy'], ['essay', 'Essay structure'], ['qtypes', 'Question types'], ['l5', 'Level 5 markers']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFwTab(key as typeof fwTab)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  fwTab === key
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}>{label}</button>
            ))}
          </div>

          {fwTab === 'para' && (
            <div className="space-y-3">
              {PHASES.map(ph => (
                <div key={ph.num}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center
                                     justify-center text-xs font-medium text-gray-700 dark:text-gray-200">
                      {ph.num}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{ph.title}</span>
                    {ph.aos.map(ao => (
                      <span key={ao} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${AO_CLS[ao]}`}>{ao}</span>
                    ))}
                  </div>
                  <ul className="space-y-1.5">
                    {ph.points.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex gap-2">
                        <span className="text-gray-300 dark:text-gray-600 mt-0.5">–</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {ph.note && (
                    <div className="mt-3 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                                    text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong className="text-gray-900 dark:text-gray-100">Level 4 → Level 5:</strong> {ph.note}
                    </div>
                  )}
                  {ph.ao4note && (
                    <div className="mt-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                                    text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex gap-1.5 items-start">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50
                                       text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 shrink-0 mt-0.5">
                        AO4
                      </span>
                      {ph.ao4note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {fwTab === 'essay' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3">Introduction — 3 moves</p>
                <div className="space-y-3">
                  {ESSAY_STRUCTURE.intro.map((move, j) => (
                    <div key={j}>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{j + 1}. {move.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{move.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Body — 4 to 6 paragraphs
                </p>
                <ul className="space-y-1.5">
                  {ESSAY_STRUCTURE.body.map((p, j) => (
                    <li key={j} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex gap-2">
                      <span className="text-gray-300 dark:text-gray-600 mt-0.5">–</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3">Conclusion — 3 moves</p>
                <div className="space-y-3">
                  {ESSAY_STRUCTURE.conclusion.map((move, j) => (
                    <div key={j}>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{j + 1}. {move.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{move.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {fwTab === 'qtypes' && (
            <div className="space-y-3">
              {QUESTION_TYPES.map((qt, i) => (
                <div key={i}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">{qt.stem}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{qt.guidance}</p>
                </div>
              ))}
            </div>
          )}

          {fwTab === 'l5' && (
            <div className="space-y-3">
              {LEVEL5.map((m, i) => (
                <div key={i}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3">{i + 1}. {m.title}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([['Level 4', m.l4, false], ['Level 5', m.l5, true]] as const).map(([label, text, good]) => (
                      <div key={label}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className={`w-2 h-2 rounded-full ${good ? 'bg-green-500' : 'bg-red-400'}`} />
                          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'plans' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              {plansLoading ? 'Loading…' : `${plans.length} plan${plans.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {plans.length === 0 && !plansLoading ? (
            <div className="text-center py-16 text-sm text-gray-400">
              No plans yet — open a question on the Exam page and tap “Save to My Plans”.
            </div>
          ) : (
            <div className="space-y-2">
              {plans.map(plan => {
                const isOpen = expandedId === plan.id
                return (
                  <div key={plan.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl overflow-hidden">
                    <div
                      onClick={() => setExpandedId(isOpen ? null : plan.id)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40
                                 flex items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {plan.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-gray-400">
                            {new Date(plan.updated_at).toLocaleDateString('en-GB')}
                          </span>
                          {plan.source === 'exam' && (
                            <span className="text-[10px] font-medium bg-violet-50 text-violet-700
                                             dark:bg-violet-900/40 dark:text-violet-200
                                             rounded-full px-2 py-0.5">
                              From past paper
                            </span>
                          )}
                          {plan.play && (
                            <span className="text-[10px] font-medium bg-gray-100 text-gray-600
                                             dark:bg-gray-700 dark:text-gray-300
                                             rounded-full px-2 py-0.5">
                              {plan.play === 'HAM' ? 'Hamlet' : 'Malfi'}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(plan) }}
                        disabled={deleteMutation.isPending}
                        className="text-gray-300 hover:text-red-500 transition-colors
                                   text-sm shrink-0"
                        aria-label="Delete plan"
                        title="Delete plan"
                      >
                        🗑
                      </button>
                      <span className="text-gray-300 text-sm shrink-0">{isOpen ? '▲' : '▼'}</span>
                    </div>

                    {isOpen && (
                      <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-4">
                        {plan.thesis && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide
                                          text-violet-600 mb-1">Thesis</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                              {plan.thesis}
                            </p>
                          </div>
                        )}

                        {plan.paragraph_plan && plan.paragraph_plan.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide
                                          text-violet-600 mb-2">Paragraph plan</p>
                            <div className="space-y-2">
                              {plan.paragraph_plan.map((p, i) => (
                                <div key={i} className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                      {p.topic}
                                    </p>
                                    <div className="flex gap-1 flex-shrink-0">
                                      {(p.ao_focus ?? []).map(ao => (
                                        <span key={ao} className="text-[9px] bg-violet-100
                                          text-violet-700 rounded px-1.5 py-0.5">{ao}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {p.topic_sentence}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {plan.sentence_stems && Object.keys(plan.sentence_stems).length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide
                                          text-violet-600 mb-2">Sentence stems</p>
                            <div className="space-y-1.5">
                              {Object.entries(plan.sentence_stems)
                                .filter(([, v]) => v)
                                .map(([ao, stem]) => (
                                  <div key={ao} className="flex gap-2 text-xs">
                                    <span className="font-semibold text-gray-500
                                                     flex-shrink-0 w-8">{ao}</span>
                                    <span className="text-gray-700 dark:text-gray-300
                                                     leading-relaxed">{stem}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {plan.critic_positions && plan.critic_positions.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide
                                          text-violet-600 mb-2">Critic positions</p>
                            <div className="space-y-2">
                              {plan.critic_positions.map((c, i) => (
                                <div key={i} className="rounded-lg border border-gray-200
                                  dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                                  <p className="text-xs font-semibold text-gray-800
                                                dark:text-gray-200 mb-0.5">{c.critic}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 italic">
                                    {c.position}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {c.embed}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {plan.model_paragraph && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide
                                          text-violet-600 mb-1">Model paragraph</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {plan.model_paragraph}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
