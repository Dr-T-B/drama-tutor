import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlay } from '../../../contexts/PlayContext'
import { useAuth } from '../../../hooks/useAuth'
import { useQuestions, useStartAttempt } from '../hooks'
import { playCodeLabel, playFilterToCode } from '../utils'
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews'
import type { EssayBuilderQuestion, PlayCode } from '../../../types/essayBuilder'

const PLAYS: PlayCode[] = ['hamlet', 'duchess_of_malfi']

export function EssayBuilderHomePage() {
  const { play } = usePlay()
  const { userId, loading: authLoading } = useAuth()
  const filterCode = playFilterToCode(play)
  const playsToShow: PlayCode[] = filterCode ? [filterCode] : PLAYS

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Essay Builder
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          Choose a question, then choose between four essay routes — the app will
          explain why each one works or fails.
        </p>
      </header>

      <div className="space-y-8">
        {playsToShow.map(code => (
          <PlaySection
            key={code}
            play={code}
            authReady={!authLoading && !!userId}
          />
        ))}
      </div>
    </div>
  )
}

function PlaySection({ play, authReady }: { play: PlayCode; authReady: boolean }) {
  const { data, isLoading, error, refetch } = useQuestions(play)
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
        {playCodeLabel(play)}
      </h2>
      {isLoading && <LoadingView />}
      {error && (
        <ErrorView
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      )}
      {!isLoading && !error && data && data.length === 0 && (
        <EmptyView>
          {play === 'duchess_of_malfi'
            ? 'Duchess questions coming soon.'
            : 'No questions seeded yet.'}
        </EmptyView>
      )}
      {!isLoading && !error && data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map(q => (
            <QuestionRow key={q.id} q={q} authReady={authReady} />
          ))}
        </ul>
      )}
    </section>
  )
}

function QuestionRow({
  q,
  authReady,
}: {
  q: EssayBuilderQuestion
  authReady: boolean
}) {
  const navigate = useNavigate()
  const start = useStartAttempt()
  const [error, setError] = useState<string | null>(null)

  async function onStart() {
    setError(null)
    try {
      const attempt = await start.mutateAsync({
        questionId: q.id,
        play: q.play_code,
      })
      navigate(`/essay-builder/${attempt.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start attempt')
    }
  }

  return (
    <li
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          {q.question_text}
        </p>
        {q.question_year !== null && (
          <p className="text-xs text-gray-400 mt-1">{q.question_year}</p>
        )}
        {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
      </div>
      <button
        onClick={onStart}
        disabled={!authReady || start.isPending}
        className="px-4 py-2 rounded-md text-sm font-medium bg-violet-600 text-white
                   hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors shrink-0"
      >
        {start.isPending ? 'Starting…' : 'Start'}
      </button>
    </li>
  )
}
