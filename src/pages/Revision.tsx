import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePlay } from '../contexts/PlayContext'
import { useRevisionDeck } from '../hooks/useRevisionDeck'
import { ProgressRing } from '../components/ProgressRing'
import { AoBadge } from '../components/AoBadge'
import type { SRSBucket } from '../types/database'

const BUCKETS: { bucket: SRSBucket; label: string; colour: string }[] = [
  { bucket: 'again', label: 'Again',  colour: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { bucket: 'hard',  label: 'Hard',   colour: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { bucket: 'good',  label: 'Good',   colour: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { bucket: 'easy',  label: 'Easy',   colour: 'bg-green-100 text-green-700 hover:bg-green-200' },
]

export function Revision() {
  const { userId, loading: authLoading } = useAuth()
  const { play } = usePlay()
  const { dueDeck, masteredCount, totalCards, isLoading, rateCard, isRating } =
    useRevisionDeck(userId, play)

  const [flipped, setFlipped] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)

  // Reset flip when card changes
  const currentCard = dueDeck[cardIndex] ?? null

  function handleRate(bucket: SRSBucket) {
    if (!currentCard || isRating) return
    rateCard(currentCard.id, bucket)
    setFlipped(false)
    // Advance to next card; if at end the deck re-renders with updated data
    setCardIndex(i => (i + 1 < dueDeck.length ? i + 1 : 0))
  }

  if (authLoading || isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading cards…
    </div>
  )

  if (!authLoading && !userId) return (
    <div className="flex items-center justify-center h-64 text-red-400">
      Sign-in failed — please reload the page.
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Revision</h1>
        <ProgressRing value={masteredCount} max={totalCards} />
        <span className="text-sm text-gray-500">
          {masteredCount}/{totalCards} mastered
        </span>
        {dueDeck.length > 0 && (
          <span className="ml-auto bg-violet-100 text-violet-700 text-sm
                           font-semibold px-2.5 py-0.5 rounded-full">
            {dueDeck.length} due
          </span>
        )}
      </div>

      {/* Empty state */}
      {dueDeck.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300
                        flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-3xl">🎭</span>
          <p className="text-gray-600 font-medium">All caught up!</p>
          <p className="text-sm text-gray-400">Come back later for more cards.</p>
        </div>
      )}

      {/* Flashcard */}
      {currentCard && (
        <div className="flex flex-col gap-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((cardIndex) / dueDeck.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-right">
            {cardIndex + 1} / {dueDeck.length}
          </p>

          {/* Card face */}
          <div
            onClick={() => setFlipped(f => !f)}
            className={[
              'rounded-2xl border cursor-pointer select-none min-h-48',
              'flex flex-col gap-3 p-6 transition-all',
              flipped
                ? 'bg-gray-900 text-white border-gray-700'
                : 'bg-white text-gray-900 border-gray-200 hover:border-violet-300',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <AoBadge ao={currentCard.ao_focus} />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                ${flipped
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-500'}`}>
                {currentCard.card_type === 'quote' ? 'Quote' : 'Theme'}
              </span>
            </div>

            <p className={[
              'text-lg font-medium leading-snug flex-1',
              flipped ? 'text-white' : 'text-gray-900',
            ].join(' ')}>
              {flipped
                ? currentCard.back_content
                : currentCard.front_prompt.replace(/^\[[A-Z_0-9]+\]\s*/, '')
              }
            </p>

            {!flipped && (
              <p className="text-xs text-gray-400 mt-auto">
                Tap to reveal answer
              </p>
            )}
          </div>

          {/* SRS buttons — only visible after flip */}
          {flipped && (
            <div className="grid grid-cols-4 gap-2">
              {BUCKETS.map(b => (
                <button
                  key={b.bucket}
                  onClick={() => handleRate(b.bucket)}
                  disabled={isRating}
                  className={[
                    'py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50',
                    b.colour,
                  ].join(' ')}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
