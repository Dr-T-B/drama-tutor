import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useQuotes } from '../hooks/useQuotes'
import { QuoteCard } from '../components/QuoteCard'
import { EssayCard } from '../components/EssayCard'
import {
  getEssaysByTheme,
  getCharacterStudies,
} from '../data/essays'
import type { EssayPlay } from '../types/essay'

export function Quotes() {
  const { userId, loading: authLoading } = useAuth()
  const { play } = usePlay()
  const { enriched, isLoading } = useQuotes(userId)

  const [search, setSearch]           = useState('')
  const [charFilter, setCharFilter]   = useState<string | null>(null)
  const [themeFilter, setThemeFilter] = useState<string | null>(null)
  const [prioFilter, setPrioFilter]   = useState<number | null>(null)

  // Filter by play first, then derive available characters + themes for
  // the current play selection (so pills stay relevant)
  const playFiltered = useMemo(() =>
    enriched.filter(q =>
      play === 'both' || q.play === play
    ), [enriched, play])

  // Derive unique speakers for character pills
  const speakers = useMemo(() => {
    const s = new Set(playFiltered.map(q => q.speaker).filter(Boolean))
    return [...s].sort()
  }, [playFiltered])

  // Derive unique primary themes for theme pills
  const themes = useMemo(() => {
    const seen = new Map<string, string>()
    playFiltered.forEach(q => {
      if (q.primary_theme) seen.set(q.primary_theme.theme_code, q.primary_theme.theme_name)
    })
    return [...seen.entries()].map(([code, name]) => ({ code, name })).sort((a,b) => a.code.localeCompare(b.code))
  }, [playFiltered])

  // Apply all filters
  const filtered = useMemo(() => {
    let result = playFiltered
    if (charFilter)   result = result.filter(q => q.speaker === charFilter)
    if (themeFilter)  result = result.filter(q => q.primary_theme?.theme_code === themeFilter)
    if (prioFilter)   result = result.filter(q => q.memorisation_priority === prioFilter)
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(q =>
        q.content.toLowerCase().includes(term) ||
        q.speaker.toLowerCase().includes(term) ||
        q.exam_sentence?.toLowerCase().includes(term)
      )
    }
    return result
  }, [playFiltered, charFilter, themeFilter, prioFilter, search])

  // Reset character + theme filter when play changes
  // (avoids showing a Hamlet character filter while on MAL)
  const resetFilters = () => {
    setCharFilter(null)
    setThemeFilter(null)
    setPrioFilter(null)
    setSearch('')
  }

  if (authLoading || isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading quotes…
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Quote bank</h1>
        <span className="text-sm text-gray-400 ml-auto">
          {filtered.length} / {playFiltered.length} quotes
        </span>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search quotes, speakers, exam sentences…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-xl border border-[#D2D2D7] px-4 py-2.5 text-sm bg-white text-[#1D1D1F]
                   focus:outline-none focus:ring-2 focus:ring-[#0071E3] mb-4"
      />

      {/* Filter pills row */}
      <div className="flex flex-col gap-3 mb-6">

        {/* Priority */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-xs text-gray-400 w-16 shrink-0">Priority</span>
          {[5,4,3,2,1].map(p => (
            <button key={p}
              onClick={() => setPrioFilter(prioFilter === p ? null : p)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                prioFilter === p
                  ? 'bg-amber-400 text-amber-900 border-amber-400'
                  : 'bg-white text-[#6E6E73] border-[#D2D2D7] hover:border-[#A1A1A6]'
              }`}>
              {'★'.repeat(p)}
            </button>
          ))}
        </div>

        {/* Characters */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-xs text-gray-400 w-16 shrink-0">Speaker</span>
          {speakers.map(sp => (
            <button key={sp}
              onClick={() => setCharFilter(charFilter === sp ? null : sp)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                charFilter === sp
                  ? 'bg-[#0071E3] text-white border-[#0071E3]'
                  : 'bg-white text-[#6E6E73] border-[#D2D2D7] hover:border-[#A1A1A6]'
              }`}>
              {sp}
            </button>
          ))}
        </div>

        {/* Themes — collapsible if more than 8 */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-xs text-gray-400 w-16 shrink-0">Theme</span>
          {themes.slice(0, 12).map(t => (
            <button key={t.code}
              onClick={() => setThemeFilter(themeFilter === t.code ? null : t.code)}
              title={t.code}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                themeFilter === t.code
                  ? 'bg-[#0071E3] text-white border-[#0071E3]'
                  : 'bg-white text-[#6E6E73] border-[#D2D2D7] hover:border-[#A1A1A6]'
              }`}>
              {t.name}
            </button>
          ))}
        </div>

        {/* Reset */}
        {(charFilter || themeFilter || prioFilter || search) && (
          <button
            onClick={resetFilters}
            className="self-start text-xs text-gray-400 hover:text-gray-700 underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Quote list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No quotes match these filters.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(q => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </div>
      )}

      <ThemeEssays
        play={play}
        themeCode={themeFilter}
        themeName={themes.find(t => t.code === themeFilter)?.name ?? null}
      />

      <CharacterStudies play={play} />
    </div>
  )
}

function ThemeEssays({
  play,
  themeCode,
  themeName,
}: {
  play: 'HAM' | 'MAL' | 'both'
  themeCode: string | null
  themeName: string | null
}) {
  if (!themeCode || play === 'both') return null
  const essays = getEssaysByTheme(play as EssayPlay, themeCode)
  if (essays.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">
        Model essays exploring{themeName ? ` "${themeName}"` : ' this theme'}
      </h2>
      <div className="flex flex-col gap-3">
        {essays.map(e => (
          <EssayCard key={e.id} essay={e} />
        ))}
      </div>
    </section>
  )
}

function CharacterStudies({ play }: { play: 'HAM' | 'MAL' | 'both' }) {
  const [open, setOpen] = useState(false)
  const studies = useMemo(() => {
    if (play === 'both') {
      return [...getCharacterStudies('HAM'), ...getCharacterStudies('MAL')]
    }
    return getCharacterStudies(play as EssayPlay)
  }, [play])
  if (studies.length === 0) return null

  return (
    <section className="mt-10">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
      >
        <span className="text-sm font-semibold text-gray-800">
          Character studies
          <span className="ml-2 text-xs font-normal text-gray-400">
            {studies.length}
          </span>
        </span>
        <span className="text-xs text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {studies.map(e => (
            <EssayCard key={e.id} essay={e} />
          ))}
        </div>
      )}
    </section>
  )
}
