import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useThemes } from '../hooks/useThemes'
import { ThemeCard } from '../components/ThemeCard'

export function Themes() {
  const { userId, loading: authLoading } = useAuth()
  const { play } = usePlay()
  const { enriched, isLoading } = useThemes(userId)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = enriched.filter(t =>
      play === 'both' || t.play === play
    )
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(t =>
        t.theme_name.toLowerCase().includes(term) ||
        t.theses.some(th => th.thesis_text.toLowerCase().includes(term))
      )
    }
    return result
  }, [enriched, play, search])

  if (authLoading || isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading themes…
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Theme explorer</h1>
        <span className="text-sm text-gray-400 ml-auto">
          {filtered.length} themes
        </span>
      </div>

      <input
        type="search"
        placeholder="Search themes or thesis statements…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-violet-300 mb-6"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No themes match.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(t => (
            <ThemeCard key={t.id} theme={t} />
          ))}
        </div>
      )}
    </div>
  )
}
