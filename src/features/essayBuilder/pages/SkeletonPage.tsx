import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AoBadge } from '../../../components/AoBadge'
import { useChoicesForAttempt, usePath, useSkeleton } from '../hooks'
import { ErrorView, LoadingView } from '../components/StateViews'
import type { EssaySkeletonParagraph } from '../../../types/essayBuilder'

export function SkeletonPage() {
  const { attemptId } = useParams<{ attemptId: string }>()

  const choices = useChoicesForAttempt(attemptId)
  const latestChoice = choices.data?.[choices.data.length - 1] ?? null
  const path = usePath(latestChoice?.path_option_id)
  const skeleton = useSkeleton(path.data?.id)

  const isLoading = choices.isLoading || path.isLoading || skeleton.isLoading
  const err = choices.error || path.error || skeleton.error

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <LoadingView />
      </div>
    )
  }

  if (err || !choices.data || !path.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ErrorView
          message={(err as Error | null)?.message}
          onRetry={() => {
            choices.refetch()
            path.refetch()
            skeleton.refetch()
          }}
        />
      </div>
    )
  }

  const cls = path.data.classification
  const unlockable = cls === 'correct' || cls === 'partial'

  if (!unlockable || !skeleton.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to={`/essay-builder/${attemptId}`}
          className="text-xs text-gray-500 hover:text-gray-700 mb-3 inline-block"
        >
          ← Back to paths
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
          No skeleton is unlocked for this attempt yet. Choose a correct or
          partial route to unlock one.
        </div>
      </div>
    )
  }

  const sk = skeleton.data

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        to={`/essay-builder/${attemptId}/feedback/${latestChoice?.id ?? ''}`}
        className="text-xs text-gray-500 hover:text-gray-700 mb-3 inline-block"
      >
        ← Back to feedback
      </Link>

      {sk.upgrade_banner && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-amber-700 mb-1">
            Upgrade banner
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">{sk.upgrade_banner}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                      rounded-xl p-5 mb-5">
        <p className="text-[10px] uppercase tracking-wide font-semibold text-violet-600 mb-1">
          Thesis
        </p>
        <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed font-medium">
          {sk.thesis}
        </p>
      </div>

      <div className="space-y-3 mb-5">
        {sk.paragraphs.map((p, i) => (
          <ParagraphCard key={i} index={i} paragraph={p} />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                      rounded-xl p-5 mb-5">
        <p className="text-[10px] uppercase tracking-wide font-semibold text-violet-600 mb-2">
          Conclusion
        </p>
        <div className="space-y-3">
          <Section title="Function" body={sk.conclusion.function} />
          <Section title="Dialectical move" body={sk.conclusion.dialectical_move} />
        </div>
      </div>

    </div>
  )
}

function ParagraphCard({
  index,
  paragraph,
}: {
  index: number
  paragraph: EssaySkeletonParagraph
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-left
                   hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Paragraph {index + 1}
        </span>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          <Section title="Function" body={paragraph.function} />

          {paragraph.ao4_embed && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AoBadge ao="AO4" />
                <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                  Comparative embed
                </p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph.ao4_embed}
              </p>
            </div>
          )}

          {paragraph.ao2_methods.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AoBadge ao="AO2" />
                <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                  Methods
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {paragraph.ao2_methods.map((m, j) => (
                  <span
                    key={j}
                    className="inline-block px-2 py-0.5 rounded-full text-xs
                               bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {paragraph.ao3_anchor && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AoBadge ao="AO3" />
                <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                  Context anchor
                </p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph.ao3_anchor}
              </p>
            </div>
          )}

          {paragraph.ao5_debate && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AoBadge ao="AO5" />
                <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                  Critical debate
                </p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph.ao5_debate}
              </p>
            </div>
          )}

          {paragraph.key_quote_ids.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
                Key quotes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {paragraph.key_quote_ids.map((q, j) => (
                  <span
                    key={j}
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-mono
                               bg-violet-50 text-violet-700"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
        {title}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{body}</p>
    </div>
  )
}
