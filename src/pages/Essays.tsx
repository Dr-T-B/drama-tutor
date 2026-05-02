import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useEssays } from '../hooks/useEssays'
import { EssayPlanCard } from '../components/EssayPlanCard'
import { AoBadge } from '../components/AoBadge'

export function Essays() {
  const { userId, loading: authLoading } = useAuth()
  const { play } = usePlay()
  const { enriched, stems, isLoading } = useEssays(userId)
  const [showStems, setShowStems] = useState(false)

  const filtered = useMemo(() =>
    enriched.filter(ep => play === 'both' || ep.play === play),
    [enriched, play]
  )

  if (authLoading || isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading essay plans…
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Essay builder</h1>
        <span className="text-sm text-gray-400 ml-auto">
          {filtered.length} plans
        </span>
      </div>

      {/* Essay plans */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No essay plans for the selected play.
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {filtered.map(ep => (
            <EssayPlanCard key={ep.id} plan={ep} />
          ))}
        </div>
      )}

      {/* Sentence stems toolkit */}
      {stems.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowStems(s => !s)}
            className="w-full flex items-center justify-between p-4
                       hover:bg-gray-50 transition-colors text-left"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Writing toolkit — sentence stems
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {stems.length} stems across AO1 / AO2 / AO3 / AO5
              </p>
            </div>
            <span className="text-gray-300 text-sm">
              {showStems ? '▲' : '▼'}
            </span>
          </button>

          {showStems && (
            <div className="border-t border-gray-100 p-4 flex flex-col gap-3">
              {stems.map(stem => (
                <div key={stem.id}
                  className="rounded-lg border border-gray-200 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <AoBadge ao={stem.ao_code} />
                    <span className="text-xs font-semibold text-gray-700">
                      {stem.stem_label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {stem.stem_text}
                  </p>
                  {stem.usage_note && (
                    <p className="text-xs text-gray-400 italic">{stem.usage_note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
