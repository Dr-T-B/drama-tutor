import { useState } from 'react'
import type { CriticEnriched, PlayFilter } from '../types/database'

const PLAY_LABEL = { HAM: 'Hamlet', MAL: 'Duchess' }
const PLAY_BADGE = {
  HAM: 'bg-violet-100 text-violet-800',
  MAL: 'bg-teal-100 text-teal-800',
}

interface Props {
  critic: CriticEnriched
  play: PlayFilter
}

export function CriticCard({ critic, play }: Props) {
  const [open, setOpen] = useState(false)

  const visibleInterps = critic.interpretations.filter(ci =>
    play === 'both' || ci.play === play
  )

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow cursor-pointer
        hover:shadow-sm ${open ? 'shadow-sm border-gray-300' : 'border-gray-200'}`}
      onClick={() => setOpen(o => !o)}
    >
      {/* ── CLOSED ROW ── */}
      <div className="p-4 flex items-start gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-gray-900">
              {critic.name}
            </span>
            {critic.source_note && (
              <span className="text-xs text-gray-400">({critic.source_note})</span>
            )}
          </div>
          <p className="text-sm text-gray-500">{critic.school}</p>
          {critic.key_text && (
            <p className="text-xs text-gray-400 italic">{critic.key_text}</p>
          )}
        </div>
        <span className="text-gray-300 text-sm mt-1 shrink-0">
          {open ? '▲' : '▼'}
        </span>
      </div>

      {/* ── EXPANDED ── */}
      {open && (
        <div
          className="border-t border-gray-100 p-4 flex flex-col gap-5"
          onClick={e => e.stopPropagation()}
        >
          {/* Core position */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Core critical position
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {critic.core_position}
            </p>
          </div>

          {/* Interpretations */}
          {visibleInterps.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Interpretations
              </p>
              <div className="flex flex-col gap-4">
                {visibleInterps.map(ci => (
                  <div key={ci.id} className="rounded-lg border border-gray-200 p-3
                                              flex flex-col gap-2">
                    {/* Play badge + theme */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${PLAY_BADGE[ci.play]}`}>
                        {PLAY_LABEL[ci.play]}
                      </span>
                      {ci.theme_name && (
                        <span className="text-xs text-gray-400">{ci.theme_name}</span>
                      )}
                    </div>

                    {/* Interpretation */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {ci.interpretation}
                    </p>

                    {/* AO5 sentence */}
                    {ci.usable_ao5_sentence && (
                      <div className="bg-purple-50 rounded-lg p-2.5 border
                                      border-purple-100">
                        <p className="text-xs font-semibold text-purple-600 mb-1">
                          AO5 sentence
                        </p>
                        <p className="text-xs text-purple-900 leading-relaxed">
                          {ci.usable_ao5_sentence}
                        </p>
                      </div>
                    )}

                    {/* Counter-reading */}
                    {ci.counter_reading && (
                      <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          Counter-reading
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {ci.counter_reading}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No interpretations for the selected play filter.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
