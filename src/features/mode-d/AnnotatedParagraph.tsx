import { AnnotatedSpan } from './AnnotatedSpan'
import type { ModeDAnnotatedParagraph, ModeDAnnotation } from '../../types/modeDTrainer'

interface Segment {
  start: number
  end: number
  annotation: ModeDAnnotation | null
}

function buildSegments(text: string, annotations: ModeDAnnotation[]): Segment[] {
  // Build non-overlapping sorted covered ranges
  const covered: Array<{ start: number; end: number; annotation: ModeDAnnotation }> = []

  for (const ann of annotations) {
    if (!ann.span_text) continue
    const idx = text.indexOf(ann.span_text)
    if (idx === -1) {
      console.warn(`[AnnotatedParagraph] span_text not found: "${ann.span_text.substring(0, 40)}"`)
      continue
    }
    const start = idx
    const end   = idx + ann.span_text.length

    // Skip if overlaps with an already-claimed range
    const overlaps = covered.some(c => start < c.end && end > c.start)
    if (overlaps) {
      console.warn(`[AnnotatedParagraph] overlapping span skipped: "${ann.span_text.substring(0, 40)}"`)
      continue
    }
    covered.push({ start, end, annotation: ann })
  }

  // Sort by start position
  covered.sort((a, b) => a.start - b.start)

  // Build full segment list (plain + annotated)
  const segments: Segment[] = []
  let cursor = 0
  for (const c of covered) {
    if (cursor < c.start) {
      segments.push({ start: cursor, end: c.start, annotation: null })
    }
    segments.push({ start: c.start, end: c.end, annotation: c.annotation })
    cursor = c.end
  }
  if (cursor < text.length) {
    segments.push({ start: cursor, end: text.length, annotation: null })
  }

  return segments
}

const SLOT_LABELS: Record<string, string> = {
  INTRODUCTION: 'Introduction',
  BODY_1: 'Body 1',
  BODY_2: 'Body 2',
  BODY_3: 'Body 3',
  CONCLUSION: 'Conclusion',
}

interface Props {
  paragraph: ModeDAnnotatedParagraph
}

export function AnnotatedParagraphCard({ paragraph }: Props) {
  const segments  = buildSegments(paragraph.paragraph_text, paragraph.annotations)
  const allAOTags = [...new Set(paragraph.annotations.flatMap(a => a.ao_tags))].sort()

  return (
    <div id={`para-${paragraph.round_number}`} className="bg-white rounded-xl border border-[#D2D2D7] p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1D1D1F]">
          Paragraph {paragraph.round_number} — {SLOT_LABELS[paragraph.paragraph_slot]}
        </h3>
        <div className="flex gap-1 flex-wrap justify-end">
          {allAOTags.map(ao => (
            <span
              key={ao}
              className="text-xs px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-600"
            >
              {ao}
            </span>
          ))}
        </div>
      </div>

      {/* Annotated paragraph text */}
      <p className="text-sm text-[#1D1D1F] leading-relaxed">
        {segments.map((seg, i) => {
          const text = paragraph.paragraph_text.slice(seg.start, seg.end)
          if (seg.annotation) {
            return <AnnotatedSpan key={i} annotation={seg.annotation} />
          }
          return <span key={i}>{text}</span>
        })}
      </p>

      {/* Examiner note */}
      <div className="border-t border-[#F5F5F7] pt-3">
        <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-1">
          Examiner note
        </p>
        <p className="text-xs text-[#6E6E73] italic leading-relaxed">
          {paragraph.examiner_summary}
        </p>
      </div>
    </div>
  )
}
