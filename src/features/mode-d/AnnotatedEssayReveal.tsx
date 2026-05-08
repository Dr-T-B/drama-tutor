import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { usePatriarchalControlReveal } from '../../data/modeD'
import { AnnotatedParagraphCard } from './AnnotatedParagraph'

const SLOT_LABELS: Record<string, string> = {
  INTRODUCTION: 'Intro',
  BODY_1: 'Body 1',
  BODY_2: 'Body 2',
  BODY_3: 'Body 3',
  CONCLUSION: 'Conclusion',
}

function formatReadingTime(totalSeconds: number): string {
  const mins = Math.round(totalSeconds / 60)
  return `~${mins} min read`
}

export function AnnotatedEssayReveal() {
  const { data: paragraphs, isLoading, error } = usePatriarchalControlReveal()
  const containerRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-[#6E6E73]">
        Loading annotated essay…
      </div>
    )
  }

  if (error || !paragraphs?.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-rose-600">
          {error ? `Error: ${(error as Error).message}` : 'No essay paragraphs found. Import D007 data first.'}
        </p>
        <Link to="/mode-d/duchess/patriarchal-control" className="text-sm text-blue-600 hover:underline mt-2 block">
          ← Back to trainer
        </Link>
      </div>
    )
  }

  const totalWords   = paragraphs.reduce((s, p) => s + p.word_count, 0)
  const totalSeconds = paragraphs.reduce((s, p) => s + p.recommended_reading_time_seconds, 0)
  const questionText = 'Explore Webster\'s presentation of control in The Duchess of Malfi.'

  const isDraft = paragraphs.some(
    p => p.marking_status !== 'approved' || p.quote_verification_status !== 'verified'
  )

  const scrollTo = (roundNumber: number) => {
    const el = document.getElementById(`para-${roundNumber}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#1D1D1F]">
          Annotated Model Essay — Patriarchal Control
        </h1>
        <p className="text-sm text-[#6E6E73]">{questionText}</p>
        <p className="text-xs text-[#AEAEB2]">
          {totalWords} words · {formatReadingTime(totalSeconds)}
        </p>
      </div>

      {/* Compliance strip */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs bg-[#F5F5F7] text-[#6E6E73] px-2.5 py-1 rounded-full font-medium">Duchess</span>
        <span className="text-xs bg-[#F5F5F7] text-[#6E6E73] px-2.5 py-1 rounded-full font-medium">Section B</span>
        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">AO1 / AO2 / AO3 only</span>
        <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-medium">AO4 / AO5 blocked</span>
        {isDraft && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
            DRAFT — quotes unverified
          </span>
        )}
      </div>

      {/* Usage note */}
      <div className="bg-[#F5F5F7] rounded-lg px-4 py-3 text-xs text-[#6E6E73]">
        <span className="font-medium text-[#1D1D1F]">How to use:</span>
        {' '}Tap or click any highlighted phrase to see the technique and examiner note.
        {' '}Colour key: <span className="text-blue-700 font-medium">AO1 = blue</span>
        {' '}· <span className="text-amber-700 font-medium">AO2 = amber</span>
        {' '}· <span className="text-green-700 font-medium">AO3 = green</span>.
        {' '}Press Esc to close a note.
      </div>

      {/* Sticky paragraph nav */}
      <div className="sticky top-14 z-10 bg-white/90 backdrop-blur-sm border-b border-[#D2D2D7] py-2 -mx-6 px-6 flex gap-2 overflow-x-auto">
        {paragraphs.map(p => (
          <button
            key={p.round_number}
            onClick={() => scrollTo(p.round_number)}
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-[#D2D2D7] hover:bg-[#F5F5F7] transition-colors whitespace-nowrap"
          >
            R{p.round_number} {SLOT_LABELS[p.paragraph_slot]}
          </button>
        ))}
      </div>

      {/* Paragraph cards */}
      <div className="space-y-5">
        {paragraphs.map(p => (
          <AnnotatedParagraphCard key={p.paragraph_key} paragraph={p} />
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#D2D2D7]">
        <Link
          to="/mode-d/duchess/patriarchal-control"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Patriarchal Control trainer
        </Link>
      </div>
    </div>
  )
}
