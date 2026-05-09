import { useMemo } from 'react'
import { pastPaperQuestions, type PastPaperQuestion } from '../data/pastPapers'
import type { PastQuestion } from '../lib/duchessEssayPrompt'

const MALFI_AOS: { AO1: number; AO2: number; AO3: number } = { AO1: 8, AO2: 8, AO3: 6 }

const AO_BADGE: Record<string, string> = {
  AO1: 'bg-blue-100 text-blue-700',
  AO2: 'bg-amber-100 text-amber-700',
  AO3: 'bg-green-100 text-green-700',
  AO5: 'bg-purple-100 text-purple-700',
}

function toPastQuestion(q: PastPaperQuestion): PastQuestion {
  return {
    id: q.id,
    year: q.year,
    eitherOr: q.option,
    questionText: q.question,
    themeTags: q.themes,
    aoWeightings: {
      AO1: q.aoWeightings.AO1 ?? MALFI_AOS.AO1,
      AO2: q.aoWeightings.AO2 ?? MALFI_AOS.AO2,
      AO3: q.aoWeightings.AO3 ?? MALFI_AOS.AO3,
    },
    marks: q.totalMarks,
  }
}

interface Props {
  selectedQuestionId: string | null
  onSelect: (question: PastQuestion) => void
  activeThemes: string[]
  onActiveThemesChange: (themes: string[]) => void
}

export function PastQuestionSelector({
  selectedQuestionId,
  onSelect,
  activeThemes,
  onActiveThemesChange,
}: Props) {
  const duchessQuestions = useMemo(
    () => pastPaperQuestions.filter(q => q.play === 'MAL'),
    [],
  )

  const allThemes = useMemo(() => {
    const set = new Set<string>()
    for (const q of duchessQuestions) for (const t of q.themes) set.add(t)
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [duchessQuestions])

  const visibleQuestions = useMemo(() => {
    if (activeThemes.length === 0) return duchessQuestions
    return duchessQuestions.filter(q =>
      q.themes.some(t => activeThemes.includes(t)),
    )
  }, [duchessQuestions, activeThemes])

  const years = useMemo(
    () => [...new Set(visibleQuestions.map(q => q.year))].sort((a, b) => b - a),
    [visibleQuestions],
  )

  function toggleTheme(theme: string) {
    onActiveThemesChange(
      activeThemes.includes(theme)
        ? activeThemes.filter(t => t !== theme)
        : [...activeThemes, theme],
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
          Filter by theme
        </p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {allThemes.map(theme => {
            const active = activeThemes.includes(theme)
            return (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`text-[12px] rounded-full px-2.5 py-1 border transition-colors ${
                  active
                    ? 'bg-[#0071E3] text-white border-[#0071E3]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {theme}
              </button>
            )
          })}
        </div>
      </div>

      {visibleQuestions.length === 0 ? (
        <p className="text-sm text-gray-700 italic py-4">
          No questions match the selected themes.
        </p>
      ) : (
        <div className="space-y-6">
          {years.map(year => (
            <div key={year}>
              <p className="text-sm text-gray-700 font-semibold mb-2">{year}</p>
              <div className="space-y-3">
                {visibleQuestions
                  .filter(q => q.year === year)
                  .map(q => {
                    const isSelected = selectedQuestionId === q.id
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onSelect(toPastQuestion(q))}
                        className={`w-full text-left rounded-xl border bg-white p-4 space-y-2
                          transition-all ${
                            isSelected
                              ? 'border-[#0071E3] ring-2 ring-[#0071E3] ring-offset-1'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            {q.option}
                          </span>
                          <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                            {q.totalMarks} marks
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">{q.question}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(q.aoWeightings)
                            .filter(([, v]) => v > 0)
                            .map(([ao, weight]) => (
                              <span
                                key={ao}
                                className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                                  AO_BADGE[ao] ?? 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {ao} ×{weight}
                              </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {q.themes.map(t => (
                            <span
                              key={t}
                              className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
