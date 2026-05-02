import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useCritics } from '../hooks/useCritics'
import { CriticCard } from '../components/CriticCard'

export function Critics() {
  const { userId, loading: authLoading } = useAuth()
  const { play } = usePlay()
  const { enriched, isLoading } = useCritics(userId)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return enriched
    const term = search.toLowerCase()
    return enriched.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.school.toLowerCase().includes(term) ||
      c.core_position.toLowerCase().includes(term) ||
      c.interpretations.some(ci =>
        ci.interpretation.toLowerCase().includes(term)
      )
    )
  }, [enriched, search])

  if (authLoading || isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading critics…
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Critic library</h1>
        <span className="text-sm text-gray-400 ml-auto">
          {enriched.length} critics
        </span>
      </div>

      <input
        type="search"
        placeholder="Search critics, schools, interpretations…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-violet-300 mb-6"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No critics match.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(c => (
            <CriticCard key={c.id} critic={c} play={play} />
          ))}
        </div>
      )}
    </div>
  )
}
