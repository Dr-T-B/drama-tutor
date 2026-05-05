import { useCallback, useState } from 'react'
import {
  getQuestionsForPlay,
  getThemeFrequencies,
  type PastPaperQuestion,
} from '../../data/pastPapers'
import type { PlayFilter } from '../../types/database'

interface Props {
  play: PlayFilter
  onPractise?: (q: PastPaperQuestion) => void
}

export default function ExamSkillsPanel({ play, onPractise }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const playsToShow: Array<'HAM' | 'MAL'> =
    play === 'both' ? (['HAM', 'MAL'] as const).slice() : ([play] as Array<'HAM' | 'MAL'>)

  const toggle = useCallback((key: string) => {
    setExpanded(prev => (prev === key ? null : key))
  }, [])

  return (
    <div className="space-y-6">
      {playsToShow.map(p => {
        const freqs = getThemeFrequencies(p)
        const maxCount = freqs[0]?.count ?? 1
        const questionsForPlay = getQuestionsForPlay(p)
        return (
          <div key={p}>
            {play === 'both' && (
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3
                ${p === 'HAM' ? 'text-violet-700' : 'text-teal-700'}`}>
                {p === 'HAM' ? 'Hamlet' : 'Duchess of Malfi'}
              </p>
            )}
            <div className="space-y-3">
              {freqs.map(f => {
                const key = `${p}:${f.theme}`
                const isOpen = expanded === key
                const themeQuestions = questionsForPlay.filter(q =>
                  q.themes.includes(f.theme)
                )
                return (
                  <div key={f.theme}>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 capitalize flex items-center gap-1">
                          {f.theme}
                          <svg
                            className="w-3 h-3 text-gray-400 transition-transform"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            viewBox="0 0 20 20" fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-gray-400">{f.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full ${f.count >= 2
                            ? 'bg-violet-500' : 'bg-gray-300'}`}
                          style={{ width: `${(f.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {f.years.map(y => (
                          <span key={y}
                            className="text-[10px] bg-gray-100 text-gray-500
                              rounded px-1.5 py-0.5">{y}</span>
                        ))}
                      </div>
                    </button>

                    {isOpen && themeQuestions.length > 0 && (
                      <div className="mt-2 ml-2 space-y-2">
                        {themeQuestions
                          .sort((a, b) => b.year - a.year)
                          .map(q => (
                            <div key={q.id}
                              className="border border-gray-200 rounded-lg p-3 bg-white">
                              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                                  Edexcel {q.year}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                  Section {q.section} · {q.option}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {q.aos.join(', ')} · {q.totalMarks} marks
                                </span>
                              </div>
                              <p className="text-xs text-gray-800 italic leading-relaxed">
                                "{q.question}"
                              </p>
                              {onPractise && (
                                <div className="mt-2 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); onPractise(q) }}
                                    className="text-[11px] font-medium text-violet-600 hover:text-violet-700"
                                  >
                                    Practise this →
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
