import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { usePlay } from '../contexts/PlayContext'

const HAM_ID = '9c213169-bfaa-4fbc-84e0-96b76045a53f'
const MAL_ID = '7d4c42dd-79b1-44db-ae66-8c85fe83bd72'

type CriticEntry = {
  critic_id: string
  name: string
  school: string
  year: number | null
  key_text: string | null
  play_title: string
  text_id: string
  interpretation: string
  usable_ao5_sentence: string | null
  counter_reading: string | null
  ao_tags: string[]
  exam_tip: string | null
  ao4_connection: string | null
  short_quote: string | null
  themes: string[]
}

const AO_CLS: Record<string, string> = {
  AO1: 'bg-amber-50 text-amber-800',
  AO2: 'bg-blue-50 text-blue-800',
  AO3: 'bg-red-50 text-red-800',
  AO5: 'bg-teal-50 text-teal-800',
}

// Component 1 Drama (9ET0/01) AOs:
//   Section A (Hamlet) → AO1/AO2/AO3/AO5
//   Section B (Malfi)  → AO1/AO2/AO3 only
function aosForPlay(p: 'HAM' | 'MAL' | 'both'): string[] {
  if (p === 'HAM') return ['AO1', 'AO2', 'AO3', 'AO5']
  if (p === 'MAL') return ['AO1', 'AO2', 'AO3']
  return ['AO1', 'AO2', 'AO3', 'AO5']
}

async function fetchCritics(textIds: string[]): Promise<CriticEntry[]> {
  const { data, error } = await supabase
    .from('critic_interpretations')
    .select(`
      text_id, interpretation, usable_ao5_sentence,
      counter_reading, ao_tags, exam_tip, ao4_connection,
      short_quote, themes,
      critics!inner(id, name, school, year, key_text),
      texts!inner(title)
    `)
    .in('text_id', textIds)
  if (error) throw error

  const seen = new Set<string>()
  return (data as any[])
    .filter(row => {
      const key = `${row.critics.id}::${row.text_id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map(row => ({
      critic_id: row.critics.id,
      name: row.critics.name,
      school: row.critics.school,
      year: row.critics.year,
      key_text: row.critics.key_text,
      play_title: row.texts.title,
      text_id: row.text_id,
      interpretation: row.interpretation,
      usable_ao5_sentence: row.usable_ao5_sentence,
      counter_reading: row.counter_reading,
      ao_tags: row.ao_tags ?? [],
      exam_tip: row.exam_tip,
      ao4_connection: row.ao4_connection,
      short_quote: row.short_quote,
      themes: row.themes ?? [],
    }))
}

export default function CriticsView() {
  const { play } = usePlay()
  const [selAOs, setSelAOs] = useState<Set<string>>(new Set())
  const [selSchools, setSelSchools] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const textIds =
    play === 'HAM' ? [HAM_ID] :
    play === 'MAL' ? [MAL_ID] :
    [HAM_ID, MAL_ID]

  const visibleAOs = aosForPlay(play)

  const { data: critics = [], isLoading, error } = useQuery({
    queryKey: ['critics', textIds],
    queryFn: () => fetchCritics(textIds),
    staleTime: 5 * 60 * 1000,
  })

  const schools = useMemo(
    () => [...new Set(critics.map(c => c.school))].sort(),
    [critics]
  )

  const filtered = useMemo(() => critics.filter(c => {
    if (selAOs.size > 0 && !c.ao_tags.some(ao => selAOs.has(ao))) return false
    if (selSchools.size > 0 && !selSchools.has(c.school)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.school.toLowerCase().includes(q) ||
        c.interpretation.toLowerCase().includes(q) ||
        c.ao_tags.some(ao => ao.toLowerCase().includes(q))
      )
    }
    return true
  }), [critics, selAOs, selSchools, search])

  const toggle = <T extends string>(
    set: Set<T>, setSet: (s: Set<T>) => void, val: T
  ) => {
    const next = new Set(set)
    if (next.has(val)) next.delete(val)
    else next.add(val)
    setSet(next)
  }

  const clearAll = () => {
    setSelAOs(new Set()); setSelSchools(new Set()); setSearch('')
  }

  if (isLoading) return (
    <div className="p-10 text-center text-sm text-gray-400">Loading critics…</div>
  )
  if (error) return (
    <div className="p-10 text-center text-sm text-red-400">Error loading critics.</div>
  )

  const groups: Record<string, CriticEntry[]> =
    play === 'both'
      ? filtered.reduce((acc, c) => {
          ;(acc[c.play_title] ??= []).push(c); return acc
        }, {} as Record<string, CriticEntry[]>)
      : { '': filtered }

  const examDate = new Date('2026-05-13T00:00:00')
  const daysLeft = Math.max(0,
    Math.round((examDate.getTime() - Date.now()) / 86400000)
  )
  const sectionLabel = play === 'HAM'
    ? 'Section A — Hamlet'
    : play === 'MAL'
    ? 'Section B — The Duchess of Malfi'
    : 'Both sections'
  const sectionAoNote = play === 'HAM'
    ? 'Assesses AO1, AO2, AO3, AO5'
    : play === 'MAL'
    ? 'Assesses AO1, AO2, AO3 only'
    : 'AOs vary by section'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-[#1D1D1F]">Critics library</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {filtered.length} of {critics.length} critics ·{' '}
          {play === 'HAM' ? 'Hamlet' : play === 'MAL' ? 'The Duchess of Malfi' : 'Both plays'}
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2
                      px-3 py-2 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA]
                      text-xs text-[#6E6E73]">
        <span>{sectionLabel} · {sectionAoNote}</span>
        <span className="flex items-center gap-2">
          {visibleAOs.map(ao => (
            <span key={ao}
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${AO_CLS[ao]}`}>
              {ao}
            </span>
          ))}
          <span className="ml-1">
            11 May 2026 ·{' '}
            <strong className="text-gray-700 dark:text-gray-200">{daysLeft} days</strong>
          </span>
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 w-16 shrink-0">Filter AO</span>
          {visibleAOs.map(ao => (
            <button key={ao} onClick={() => toggle(selAOs, setSelAOs, ao)}
              className={`px-2.5 py-0.5 rounded-full text-xs border transition-colors ${
                selAOs.has(ao)
                  ? 'bg-[#0071E3] text-white border-[#0071E3]'
                  : 'border-[#D2D2D7] text-[#6E6E73] hover:border-[#A1A1A6]'
              }`}>{ao}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-[#6E6E73] w-16 shrink-0">School</span>
          {schools.map(s => (
            <button key={s} onClick={() => toggle(selSchools, setSelSchools, s)}
              className={`px-2.5 py-0.5 rounded-full text-xs border transition-colors ${
                selSchools.has(s)
                  ? 'bg-[#0071E3] text-white border-[#0071E3]'
                  : 'border-[#D2D2D7] text-[#6E6E73] hover:border-[#A1A1A6]'
              }`}>{s}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search critics, themes, arguments…"
            className="flex-1 text-sm px-3 py-1.5 rounded-full border border-[#D2D2D7]
                       bg-white text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]" />
          <button onClick={clearAll}
            className="text-xs px-3 py-1.5 rounded-full border border-[#D2D2D7]
                       text-[#6E6E73] hover:border-[#A1A1A6]">
            Clear all
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-12 text-sm text-gray-400">No critics match the current filters</p>
      ) : (
        Object.entries(groups).map(([playTitle, entries]) => (
          <div key={playTitle}>
            {play === 'both' && (
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                {playTitle}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entries.map(c => {
                const id = `${c.critic_id}::${c.text_id}`
                const expanded = expandedId === id
                return (
                  <div key={id}
                    className="bg-white border border-[#D2D2D7] rounded-xl p-4 flex flex-col gap-3"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>

                    {/* Row 1: school + AO tags */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8E8ED]
                                       text-[#6E6E73] leading-snug shrink-0 max-w-[55%]">
                        {c.school}
                      </span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {c.ao_tags
                          .filter(ao => visibleAOs.includes(ao))
                          .map(ao => (
                            <span key={ao}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${AO_CLS[ao] ?? ''}`}>
                              {ao}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Row 2: name + year */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[#1D1D1F]">{c.name}</span>
                      {c.year && (
                        <span className="text-xs text-gray-400">{c.year}</span>
                      )}
                    </div>

                    {/* Row 3: interpretation (clamped to 3 lines) */}
                    <p className="text-sm text-[#1D1D1F] leading-relaxed line-clamp-3">
                      {c.interpretation}
                    </p>

                    {/* Row 4: short quote blockquote */}
                    {c.short_quote && (
                      <div className="border-l-2 border-[#D2D2D7] pl-3">
                        <p className="text-xs italic text-[#6E6E73] leading-relaxed">
                          {c.short_quote}
                        </p>
                      </div>
                    )}

                    {/* Row 5: theme chips */}
                    {c.themes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.themes.map(t => (
                          <span key={t}
                            className="text-[11px] px-2 py-0.5 rounded
                                       bg-[#E8E8ED] text-[#6E6E73]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(expanded ? null : id)}
                      className="self-start text-xs px-2.5 py-1 rounded-lg border
                                 border-[#D2D2D7] text-[#6E6E73] hover:bg-gray-50 transition-colors">
                      {expanded ? '▲ hide exam notes' : '▼ exam notes'}
                    </button>

                    {/* Expanded: three-move dialectical panel */}
                    {expanded && (
                      <div className="border-t border-[#E5E5EA] pt-3 flex flex-col gap-2.5">

                        {/* Move 1 — Establish */}
                        <div className="rounded-lg p-3 bg-teal-50 border border-teal-100">
                          <p className="text-[10px] font-semibold uppercase tracking-wider
                                        text-teal-700 mb-1.5">
                            Move 1 — Establish
                          </p>
                          <p className="text-xs text-teal-900 leading-relaxed">
                            {c.school} perspective: {c.interpretation}
                          </p>
                        </div>

                        {/* Move 2 — Challenge */}
                        {c.counter_reading && (
                          <div className="rounded-lg p-3 bg-red-50 border border-red-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wider
                                          text-red-700 mb-1.5">
                              Move 2 — Challenge
                            </p>
                            <p className="text-xs text-red-900 leading-relaxed">
                              {c.counter_reading}
                            </p>
                          </div>
                        )}

                        {/* Move 3 — Advance */}
                        {c.exam_tip && (
                          <div className="rounded-lg p-3 bg-blue-50 border border-blue-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wider
                                          text-blue-700 mb-1.5">
                              Move 3 — Advance
                            </p>
                            <p className="text-xs text-blue-900 leading-relaxed">
                              {c.exam_tip}
                            </p>
                          </div>
                        )}

                        {/* Deployable AO5 sentence — Section A (Hamlet) only */}
                        {c.usable_ao5_sentence && c.play_title === 'Hamlet' && (
                          <div>
                            <p className="text-[10px] font-medium text-[#6E6E73] mb-1">
                              Deployable AO5 sentence
                            </p>
                            <div className="border-l-2 border-[#D2D2D7] pl-3">
                              <p className="text-xs italic text-[#1D1D1F] leading-relaxed">
                                {c.usable_ao5_sentence}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Source note */}
                        {c.key_text && (
                          <p className="text-[10px] text-gray-400 italic">{c.key_text}</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
