import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useAttempt,
  useChoicesForAttempt,
  usePaths,
  useQuestion,
  useRecordChoice,
} from '../hooks'
import { ErrorView, LoadingView } from '../components/StateViews'
import { seededShuffle } from '../utils'
import type { EssayPathOption } from '../../../types/essayBuilder'

export function PathSelectionPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()

  const attempt = useAttempt(attemptId)
  const question = useQuestion(attempt.data?.question_id)
  const paths = usePaths(attempt.data?.question_id)
  const choices = useChoicesForAttempt(attemptId)
  const recordChoice = useRecordChoice()

  const [pendingPathId, setPendingPathId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const shuffled = useMemo<EssayPathOption[]>(() => {
    if (!paths.data || !attempt.data) return []
    return seededShuffle(paths.data, attempt.data.id)
  }, [paths.data, attempt.data])

  const isLoading = attempt.isLoading || question.isLoading || paths.isLoading || choices.isLoading
  const fetchError = attempt.error || question.error || paths.error || choices.error

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <LoadingView />
      </div>
    )
  }

  if (fetchError || !attempt.data || !question.data || !paths.data || !choices.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ErrorView
          message={(fetchError as Error | null)?.message}
          onRetry={() => {
            attempt.refetch()
            question.refetch()
            paths.refetch()
            choices.refetch()
          }}
        />
      </div>
    )
  }

  async function confirmChoice(pathId: string) {
    setSubmitError(null)
    const ok = window.confirm(
      'Once you choose, the app will explain why each path works or fails. Ready?',
    )
    if (!ok) {
      setPendingPathId(null)
      return
    }
    try {
      const retryNumber = (choices.data?.length ?? 0) + 1
      const choice = await recordChoice.mutateAsync({
        attemptId: attemptId!,
        pathOptionId: pathId,
        retryNumber,
      })
      navigate(`/essay-builder/${attemptId}/feedback/${choice.id}`)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to record choice')
      setPendingPathId(null)
    }
  }

  const retryNumber = (choices.data?.length ?? 0) + 1

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        to="/essay-builder"
        className="text-xs text-gray-500 hover:text-gray-700 mb-3 inline-block"
      >
        ← Back to questions
      </Link>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                      rounded-xl p-5 mb-6">
        <p className="text-[11px] uppercase tracking-wide text-violet-600 font-semibold mb-1">
          Question {retryNumber > 1 ? `· Attempt ${retryNumber}` : ''}
        </p>
        <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed">
          {question.data.question_text}
        </p>
        {question.data.question_year !== null && (
          <p className="text-xs text-gray-400 mt-2">{question.data.question_year}</p>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Pick the route you would take into this essay.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shuffled.map(p => (
          <button
            key={p.id}
            onClick={() => {
              setPendingPathId(p.id)
              confirmChoice(p.id)
            }}
            disabled={recordChoice.isPending}
            className="text-left bg-white dark:bg-gray-800 border border-gray-200
                       dark:border-gray-700 rounded-xl p-4 hover:border-violet-400
                       hover:shadow-sm transition-all disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
              {p.path_label}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {p.thesis_direction}
            </p>
            {pendingPathId === p.id && recordChoice.isPending && (
              <p className="text-xs text-violet-600 mt-2">Saving choice…</p>
            )}
          </button>
        ))}
      </div>

      {submitError && (
        <p className="text-sm text-rose-600 mt-3">{submitError}</p>
      )}
    </div>
  )
}
