import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Essay } from '../types/essay'

const PLAY_STYLE = {
  HAM: {
    chip: 'bg-violet-100 text-violet-800 border-violet-200',
    accent: 'text-violet-700',
    bar: 'border-violet-200',
  },
  MAL: {
    chip: 'bg-teal-100 text-teal-800 border-teal-200',
    accent: 'text-teal-700',
    bar: 'border-teal-200',
  },
} as const

// Match patterns like **[AO1]**, **[AO1 + AO2]**, **[Conclusion linked to question]**
const AO_LABEL_RE = /\*\*\[([^\]]+)\]\*\*/g

function renderAoChips(markdown: string, chipCls: string): string {
  // Replace **[...]** with a custom HTML span carrying chip styling.
  // react-markdown won't render raw HTML by default, so instead we transform
  // into a code-fence-safe inline marker that we render via the `strong` slot.
  // Simpler: pre-process so each marker becomes its own paragraph-break-free
  // bolded inline using a sentinel. Then the `strong` renderer styles it.
  return markdown.replace(AO_LABEL_RE, (_, inner) => `**⟦${inner}⟧**`)
}

export function EssayDetail({ essay }: { essay: Essay }) {
  const style = PLAY_STYLE[essay.play]
  const transformed = renderAoChips(essay.content_markdown, style.chip)

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="text-xs text-gray-500 leading-snug">
        <span className="font-semibold">Probability rationale: </span>
        {essay.rationale_2026}
      </div>

      <article className="prose prose-sm max-w-none prose-p:text-gray-800 prose-p:leading-relaxed prose-strong:text-gray-900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            strong: ({ children }) => {
              const text = String(children)
              const m = text.match(/^⟦(.+)⟧$/)
              if (m) {
                return (
                  <span
                    className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border align-middle mr-1 ${style.chip}`}
                  >
                    {m[1]}
                  </span>
                )
              }
              return <strong>{children}</strong>
            },
          }}
        >
          {transformed}
        </ReactMarkdown>
      </article>

      {essay.related_quotes.length > 0 && (
        <div className={`border-t pt-4 ${style.bar}`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Related quotes
          </p>
          <ul className="flex flex-col gap-1.5">
            {essay.related_quotes.map((q, i) => (
              <li
                key={i}
                className="text-sm text-gray-700 font-serif italic leading-snug"
              >
                "{q}"
              </li>
            ))}
          </ul>
        </div>
      )}

      {essay.related_acts.length > 0 && (
        <div className={`border-t pt-4 ${style.bar}`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Related acts/scenes
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {essay.related_acts.map(a => (
              <a
                key={a}
                href="/acts"
                className={`text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200 hover:border-gray-300 ${style.accent}`}
              >
                {a}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
