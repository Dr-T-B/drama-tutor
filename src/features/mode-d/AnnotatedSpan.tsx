import { useState, useRef, useId, useEffect } from 'react'
import { AoBadge } from '../../components/AoBadge'
import type { DuchessAOTag, ModeDAnnotation } from '../../types/modeDTrainer'

// Colour key matching AoBadge palette
const HIGHLIGHT: Record<DuchessAOTag, string> = {
  AO1: 'bg-blue-100 underline decoration-blue-400 decoration-dotted',
  AO2: 'bg-amber-100 underline decoration-amber-400 decoration-dotted',
  AO3: 'bg-green-100 underline decoration-green-400 decoration-dotted',
}

// Multi-AO: use primary AO colour (first tag) with all tags shown as chips
function primaryHighlight(aoTags: DuchessAOTag[]): string {
  return HIGHLIGHT[aoTags[0]] ?? 'bg-gray-100 underline decoration-gray-400 decoration-dotted'
}

interface Props {
  annotation: ModeDAnnotation
}

export function AnnotatedSpan({ annotation }: Props) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLButtonElement>(null)
  const descId     = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus() }
    }
    const onClickOut = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOut)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOut)
    }
  }, [open])

  const hlClass = primaryHighlight(annotation.ao_tags as DuchessAOTag[])

  return (
    <span className="relative inline">
      <button
        ref={btnRef}
        type="button"
        role="button"
        tabIndex={0}
        aria-describedby={open ? descId : undefined}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={`rounded px-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${hlClass}`}
      >
        {annotation.span_text}
        {annotation.ao_tags.map(ao => (
          <sup key={ao} className="ml-0.5">
            <AoBadge ao={ao} />
          </sup>
        ))}
      </button>

      {open && (
        <span
          ref={popoverRef}
          id={descId}
          role="tooltip"
          className="absolute z-20 left-0 top-full mt-1 w-72 bg-white border border-[#D2D2D7] rounded-xl shadow-lg p-3 space-y-1.5 text-left"
        >
          <p className="text-xs font-semibold text-[#1D1D1F]">{annotation.technique}</p>
          <p className="text-xs text-[#6E6E73] leading-relaxed">{annotation.note}</p>
          <div className="flex gap-1 flex-wrap pt-1">
            {annotation.ao_tags.map(ao => <AoBadge key={ao} ao={ao} />)}
          </div>
        </span>
      )}
    </span>
  )
}
