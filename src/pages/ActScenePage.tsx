import { useMemo, useState } from 'react'
import { actScenes } from '../data/actScenes'
import { ActSceneView } from '../components/ActSceneView'
import { usePlay } from '../contexts/PlayContext'

type Tab = 'HAM' | 'MAL'

const PLAY_LABEL: Record<Tab, string> = {
  HAM: 'Hamlet',
  MAL: 'The Duchess of Malfi',
}

export function ActScenePage() {
  const { play } = usePlay()
  const [tab, setTab] = useState<Tab>(play === 'MAL' ? 'MAL' : 'HAM')

  const activeTab: Tab = play === 'both' ? tab : play

  const scenes = useMemo(
    () => actScenes.filter(s => s.play === activeTab),
    [activeTab],
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Acts &amp; Scenes</h1>
        <p className="text-gray-500 mt-1">
          Act-by-act revision — {PLAY_LABEL[activeTab]}
        </p>
      </div>

      {play === 'both' && (
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {(['HAM', 'MAL'] as const).map(t => {
            const active = t === tab
            const cls = active
              ? 'border-[#0071E3] text-[#0071E3]'
              : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]'
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${cls}`}
              >
                {PLAY_LABEL[t]}
              </button>
            )
          })}
        </div>
      )}

      <ActSceneView guide={scenes} />
    </div>
  )
}
