import { useMemo, useState } from 'react'
import { recallGuides } from '../data/recallGuides'
import { RecallGuide } from '../components/RecallGuide'
import { usePlay } from '../contexts/PlayContext'

type Tab = 'HAM' | 'MAL'

const PLAY_LABEL: Record<Tab, string> = {
  HAM: 'Hamlet',
  MAL: 'The Duchess of Malfi',
}

export function RecallGuidePage() {
  const { play } = usePlay()
  const [tab, setTab] = useState<Tab>(play === 'MAL' ? 'MAL' : 'HAM')

  const activeTab: Tab = play === 'both' ? tab : play

  const guide = useMemo(
    () => recallGuides.find(g => g.play === activeTab),
    [activeTab],
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Quote Recall Guide</h1>
        <p className="text-gray-500 mt-1">
          {PLAY_LABEL[activeTab]} · Section {guide?.section ?? ''}
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

      {guide ? (
        <RecallGuide guide={guide} />
      ) : (
        <p className="text-sm text-gray-500">No guide available for this play.</p>
      )}
    </div>
  )
}
