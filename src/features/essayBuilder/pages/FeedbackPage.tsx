import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AoBadge } from '../../../components/AoBadge'
import {
  useChoice,
  useChoicesForAttempt,
  useCompleteAttempt,
  useFeedback,
  usePath,
  usePaths,
} from '../hooks'
import {
  isCorrectFeedback,
  isExamRiskFeedback,
  isPartialFeedback,
  isWrongFeedback,
} from '../../../types/essayBuilder'
import type {
  AODiagnosis,
  EssayPathFeedback,
  EssayPathOption,
} from '../../../types/essayBuilder'
import { ErrorView, LoadingView } from '../components/StateViews'

const CLASS_LABEL: Record<string, string> = {
  correct: 'Correct route',
  partial: 'Partial route',
  wrong: 'Off-question route',
  exam_risk: 'Exam-risk route',
}

const CLASS_BADGE_CLS: Record<string, string> = {
  correct: 'bg-emerald-100 text-emerald-800',
  partial: 'bg-amber-100 text-amber-800',
  wrong: 'bg-rose-100 text-rose-800',
  exam_risk: 'bg-orange-100 text-orange-800',
}

export function FeedbackPage() {
  const { attemptId, choiceId } = useParams<{ attemptId: string; choiceId: string }>()
  const navigate = useNavigate()

  const choice = useChoice(choiceId)
  const path = usePath(choice.data?.path_option_id)
  const feedback = useFeedback(path.data?.feedback_id)
  const choices = useChoicesForAttempt(attemptId)
  const allPaths = usePaths(path.data?.question_id)
  const completeAttempt = useCompleteAttempt()

  const correctPath = useMemo(
    () => allPaths.data?.find(p => p.classification === 'correct') ?? null,
    [allPaths.data],
  )

  const isLoading =
    choice.isLoading || path.isLoading || feedback.isLoading || choices.isLoading
  const err = choice.error || path.error || feedback.error || choices.error

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <LoadingView />
      </div>
    )
  }

  if (err || !choice.data || !path.data || !feedback.data || !choices.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ErrorView
          message={(err as Error | null)?.message}
          onRetry={() => {
            choice.refetch()
            path.refetch()
            feedback.refetch()
            choices.refetch()
          }}
        />
      </div>
    )
  }

  const cls = path.data.classification
  const totalAttempts = choices.data.length
  const showCompareWithCorrect =
    (cls === 'wrong' || cls === 'exam_risk') && totalAttempts >= 2

  async function unlockSkeleton() {
    try {
      await completeAttempt.mutateAsync({
        attemptId: attemptId!,
        outcome: cls,
        unlocked: true,
      })
    } finally {
      navigate(`/essay-builder/${attemptId}/skeleton`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        to={`/essay-builder/${attemptId}`}
        className="text-xs text-gray-500 hover:text-gray-700 mb-3 inline-block"
      >
        ← Back to paths
      </Link>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                      rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide rounded-full
                        px-2 py-0.5 ${CLASS_BADGE_CLS[cls] ?? 'bg-gray-100 text-gray-700'}`}
          >
            {CLASS_LABEL[cls] ?? cls}
          </span>
          <span className="text-xs text-gray-400">
            Attempt {choice.data.retry_number}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {path.data.path_label}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
          {path.data.thesis_direction}
        </p>
      </div>

      <FeedbackBody feedback={feedback.data} />

      {showCompareWithCorrect && correctPath && (
        <CompareWithCorrect path={correctPath} />
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {cls === 'correct' && (
          <button
            onClick={unlockSkeleton}
            disabled={completeAttempt.isPending}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium
                       hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {completeAttempt.isPending ? 'Unlocking…' : 'Unlock essay skeleton'}
          </button>
        )}
        {cls === 'partial' && (
          <button
            onClick={unlockSkeleton}
            disabled={completeAttempt.isPending}
            className="px-4 py-2 rounded-md bg-amber-600 text-white text-sm font-medium
                       hover:bg-amber-700 disabled:opacity-60 transition-colors"
          >
            {completeAttempt.isPending ? 'Unlocking…' : 'Unlock skeleton with upgrade notes'}
          </button>
        )}
        {(cls === 'wrong' || cls === 'exam_risk') && (
          <button
            onClick={() => navigate(`/essay-builder/${attemptId}`)}
            className="px-4 py-2 rounded-md bg-violet-600 text-white text-sm font-medium
                       hover:bg-violet-700 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

function FeedbackBody({ feedback }: { feedback: EssayPathFeedback }) {
  if (isCorrectFeedback(feedback)) {
    const b = feedback.body_sections
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
        <Headline text={feedback.headline} tone="emerald" />
        <Section title="Why it fits" body={b.why_it_fits} />
        <Section title="AO integration" body={b.ao_integration} />
      </div>
    )
  }
  if (isPartialFeedback(feedback)) {
    const b = feedback.body_sections
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
        <Headline text={feedback.headline} tone="amber" />
        <Section title="What it misses" body={b.what_it_misses} />
        <Section title="Upgrade advice" body={b.upgrade_advice} />
        <AoDiagnosisList items={b.ao_diagnosis} />
      </div>
    )
  }
  if (isWrongFeedback(feedback)) {
    const b = feedback.body_sections
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-4">
        <Headline text={feedback.headline} tone="rose" />
        <Section title="The mismatch" body={b.mismatch} />
        <Section title="What it would become" body={b.what_it_becomes} />
        <AoDiagnosisList items={[b.ao_diagnosis]} />
        <Section title="How to redirect" body={b.redirect} />
      </div>
    )
  }
  if (isExamRiskFeedback(feedback)) {
    const b = feedback.body_sections
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-4">
        <Headline text={feedback.headline} tone="orange" />
        <Section title="Exam danger" body={b.exam_danger} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">
              AO problem
            </p>
            <AoBadge ao={b.ao_problem.ao} />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{b.ao_problem.descriptor}</p>
        </div>
        <Section title="What it would become" body={b.what_it_becomes} />
        <Section title="How to redirect" body={b.redirect} />
      </div>
    )
  }
  return null
}

function Headline({ text, tone }: { text: string; tone: 'emerald' | 'amber' | 'rose' | 'orange' }) {
  const cls = {
    emerald: 'text-emerald-900',
    amber: 'text-amber-900',
    rose: 'text-rose-900',
    orange: 'text-orange-900',
  }[tone]
  return <p className={`text-base font-semibold ${cls}`}>{text}</p>
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
        {title}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
    </div>
  )
}

function AoDiagnosisList({ items }: { items: AODiagnosis[] }) {
  if (!items.length) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
        AO diagnosis
      </p>
      <ul className="space-y-2">
        {items.map((d, i) => (
          <li key={i} className="flex items-start gap-2">
            <AoBadge ao={d.ao} />
            <span className="text-sm text-gray-700 leading-relaxed">{d.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CompareWithCorrect({ path }: { path: EssayPathOption }) {
  return (
    <aside className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
      <p className="text-[10px] uppercase tracking-wide font-semibold text-emerald-700 mb-1">
        Compare with correct route
      </p>
      <p className="text-sm font-semibold text-emerald-900 mb-1">{path.path_label}</p>
      <p className="text-sm text-emerald-900 leading-relaxed">{path.thesis_direction}</p>
    </aside>
  )
}
