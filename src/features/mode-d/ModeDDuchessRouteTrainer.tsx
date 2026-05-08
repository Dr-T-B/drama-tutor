import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AoBadge } from '../../components/AoBadge'
import { useDuchessOptionsByRoute } from '../../data/modeD'
import type {
  ModeDDifficultyBand,
  ModeDStemOption,
  ModeDRoundResult,
  DuchessAOTag,
} from '../../types/modeDTrainer'

type TrainerState =
  | { phase: 'loading' }
  | { phase: 'round'; roundIndex: number; selected: string | null }
  | { phase: 'feedback'; roundIndex: number; selected: ModeDStemOption }
  | { phase: 'complete'; results: ModeDRoundResult[] }

interface Props {
  routeKey: string
  routeTitle: string
  difficultyBand: ModeDDifficultyBand
  riskWarning: string
  revealRoute?: string
}

const SLOT_LABELS: Record<string, string> = {
  INTRODUCTION: 'Introduction',
  BODY_1: 'Body 1',
  BODY_2: 'Body 2',
  BODY_3: 'Body 3',
  CONCLUSION: 'Conclusion',
}

const BAND_LABELS: Record<ModeDDifficultyBand, string> = {
  LEVEL_5_ENTRY:    'Level 5 Entry',
  LEVEL_5_ADVANCED: 'Level 5 Advanced',
}

const GRADE_LABELS: Record<string, string> = {
  U: 'U — Level 1',
  E: 'E — Level 2',
  C: 'C — Level 3–4',
  A_STAR: 'A* — Level 5',
}

function groupByRound(options: ModeDStemOption[]): ModeDStemOption[][] {
  const map = new Map<number, ModeDStemOption[]>()
  for (const opt of options) {
    if (!map.has(opt.round_number)) map.set(opt.round_number, [])
    map.get(opt.round_number)!.push(opt)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([, opts]) =>
      opts.slice().sort((a, b) => a.option_label.localeCompare(b.option_label))
    )
}

function computeAOProfile(results: ModeDRoundResult[]): Record<DuchessAOTag, { selected: number; best: number }> {
  const profile: Record<DuchessAOTag, { selected: number; best: number }> = {
    AO1: { selected: 0, best: 0 },
    AO2: { selected: 0, best: 0 },
    AO3: { selected: 0, best: 0 },
  }
  for (const r of results) {
    for (const ao of r.selected.ao_tags as DuchessAOTag[]) {
      profile[ao].selected += r.score
    }
    for (const ao of r.best.ao_tags as DuchessAOTag[]) {
      profile[ao].best += r.best.score_value
    }
  }
  return profile
}

function dominantErrorType(results: ModeDRoundResult[]): string | null {
  const counts = new Map<string, number>()
  for (const r of results) {
    if (!r.selected.is_best_answer) {
      counts.set(r.selected.error_type, (counts.get(r.selected.error_type) ?? 0) + 1)
    }
  }
  if (counts.size === 0) return null
  return [...counts.entries()].sort(([, a], [, b]) => b - a)[0][0]
}

const ERROR_TYPE_LABELS: Record<string, string> = {
  NARRATIVE_SUMMARY: 'Narrative summary (retelling rather than analysis)',
  CONTEXT_DUMP: 'Context dump (AO3 stranded without textual analysis)',
  THESIS_TOO_GENERAL: 'Thesis too general (correct direction, no method named)',
  AO2_THIN: 'AO2 thin (method-aware but unnamed)',
  CONCEPTUAL_METHOD_LED: 'Level 5 — conceptual and method-led',
}

const ERROR_RECOMMENDATIONS: Record<string, string> = {
  NARRATIVE_SUMMARY: 'Focus on naming Webster\'s technique before describing the event.',
  CONTEXT_DUMP: 'Lead with the dramatic device; activate context as the audience-recognition lens.',
  THESIS_TOO_GENERAL: 'Name the specific dramatic apparatus and technique in your topic sentence.',
  AO2_THIN: 'Replace impression-language with precise dramatic/grammatical terms.',
}

export function ModeDDuchessRouteTrainer({ routeKey, routeTitle, difficultyBand, riskWarning, revealRoute }: Props) {
  const { data: allOptions, isLoading, error } = useDuchessOptionsByRoute(routeKey)
  const rounds = useMemo(() => allOptions ? groupByRound(allOptions) : [], [allOptions])

  const [state, setState] = useState<TrainerState>({ phase: 'loading' })
  const accResults = useRef<ModeDRoundResult[]>([])

  // Sync from loading once data arrives
  if (state.phase === 'loading' && rounds.length > 0) {
    setState({ phase: 'round', roundIndex: 0, selected: null })
  }

  const isDraft = allOptions?.some(
    o => o.marking_status !== 'approved' || o.quote_verification_status !== 'verified'
  ) ?? true

  if (isLoading || state.phase === 'loading') {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-[#6E6E73]">
        Loading trainer…
      </div>
    )
  }

  if (error || rounds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-rose-600">
          {error ? `Error: ${(error as Error).message}` : 'No stems found for this route. Import data first.'}
        </p>
        <Link to="/mode-d/duchess" className="text-sm text-blue-600 hover:underline mt-2 block">
          ← Back to Duchess routes
        </Link>
      </div>
    )
  }

  // ── Complete screen ───────────────────────────────────────────────────────
  if (state.phase === 'complete') {
    const { results } = state
    const totalScore = results.reduce((s, r) => s + r.score, 0)
    const maxScore   = results.length * 4
    const pct        = Math.round((totalScore / maxScore) * 100)
    const aoProfile  = computeAOProfile(results)
    const dominant   = dominantErrorType(results)

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <ComplianceStrip isDraft={isDraft} />

        <div className="bg-white rounded-xl border border-[#D2D2D7] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[#1D1D1F]">
            {routeTitle} — Final Score
          </h2>
          <div className="text-4xl font-bold text-[#1D1D1F]">
            {totalScore} / {maxScore}
            <span className="text-lg font-normal text-[#6E6E73] ml-2">({pct}%)</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#1D1D1F]">AO-weighted profile</h3>
            {(['AO1','AO2','AO3'] as DuchessAOTag[]).map(ao => {
              const p    = aoProfile[ao]
              const pctA = p.best > 0 ? Math.round((p.selected / p.best) * 100) : 0
              return (
                <div key={ao} className="flex items-center gap-3">
                  <AoBadge ao={ao} />
                  <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${pctA}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6E6E73] w-10 text-right">{pctA}%</span>
                </div>
              )
            })}
          </div>

          {dominant && dominant !== 'CONCEPTUAL_METHOD_LED' && (
            <div className="bg-amber-50 rounded-lg p-4 space-y-1">
              <p className="text-sm font-medium text-amber-800">Dominant error pattern</p>
              <p className="text-sm text-amber-700">{ERROR_TYPE_LABELS[dominant] ?? dominant}</p>
              {ERROR_RECOMMENDATIONS[dominant] && (
                <p className="text-xs text-amber-600 mt-1">{ERROR_RECOMMENDATIONS[dominant]}</p>
              )}
            </div>
          )}

          {dominant === 'CONCEPTUAL_METHOD_LED' && (
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800">
                Excellent — Level 5 across all rounds.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {revealRoute ? (
              <Link
                to={revealRoute}
                className="px-4 py-2 bg-[#1D1D1F] text-white text-sm font-medium rounded-lg hover:bg-[#2D2D2F] transition-colors"
              >
                Read annotated model essay →
              </Link>
            ) : (
              <button
                disabled
                className="px-4 py-2 bg-[#F5F5F7] text-[#AEAEB2] text-sm font-medium rounded-lg cursor-not-allowed"
                title="Annotated essay not yet available for this route"
              >
                Model essay — coming soon
              </button>
            )}
            <button
              onClick={() => setState({ phase: 'round', roundIndex: 0, selected: null })}
              className="px-4 py-2 border border-[#D2D2D7] text-sm font-medium rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              Retake
            </button>
            <Link
              to="/mode-d/duchess"
              className="px-4 py-2 border border-[#D2D2D7] text-sm font-medium rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              Back to Duchess hub
            </Link>
          </div>
        </div>

        {/* Per-round summary */}
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#D2D2D7] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1D1D1F]">
                  Round {r.round_number} — {SLOT_LABELS[r.paragraph_slot]}
                </span>
                <span className={`text-sm font-semibold ${r.score === 4 ? 'text-green-700' : r.score >= 2 ? 'text-amber-700' : 'text-rose-600'}`}>
                  {r.score}/4
                </span>
              </div>
              {!r.selected.is_best_answer && (
                <p className="text-xs text-[#6E6E73]">
                  You chose: <span className="font-medium">{r.selected.option_label}</span>
                  {' '}({GRADE_LABELS[r.selected.grade_band]})
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Round screen ──────────────────────────────────────────────────────────
  if (state.phase === 'round' || state.phase === 'feedback') {
    const roundIndex = state.roundIndex
    const roundOptions = rounds[roundIndex]
    const questionText = roundOptions[0].question_text
    const slot = roundOptions[0].paragraph_slot
    const roundNumber = roundOptions[0].round_number
    const best = roundOptions.find(o => o.is_best_answer)!

    const selectedOption = state.phase === 'feedback'
      ? state.selected
      : state.selected
        ? roundOptions.find(o => o.option_key === state.selected) ?? null
        : null

    const isAnswered = state.phase === 'feedback'

    const handleSelect = (optKey: string) => {
      if (state.phase !== 'round') return
      setState({ phase: 'round', roundIndex, selected: optKey })
    }

    const handleSubmit = () => {
      if (state.phase !== 'round' || !state.selected) return
      const chosen = roundOptions.find(o => o.option_key === state.selected)!
      setState({ phase: 'feedback', roundIndex, selected: chosen })
    }

    const handleNext = () => {
      if (state.phase !== 'feedback') return
      const result: ModeDRoundResult = {
        round_number: roundNumber,
        paragraph_slot: slot as any,
        selected: state.selected,
        best,
        score: state.selected.score_value,
      }
      accResults.current.push(result)

      if (roundIndex + 1 >= rounds.length) {
        setState({ phase: 'complete', results: [...accResults.current] })
      } else {
        setState({ phase: 'round', roundIndex: roundIndex + 1, selected: null })
      }
    }

    // Clear accumulator when starting a fresh session (round 0, pre-answer)
    if (state.phase === 'round' && roundIndex === 0 && !isAnswered) {
      accResults.current = []
    }

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-5">
        <ComplianceStrip isDraft={isDraft} />

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-wide">
              {routeTitle}
            </span>
            <span className="text-xs text-[#AEAEB2]">·</span>
            <span className="text-xs text-[#6E6E73]">{BAND_LABELS[difficultyBand]}</span>
            <span className="text-xs text-[#AEAEB2]">·</span>
            <span className="text-xs text-[#6E6E73]">Round {roundNumber} of {rounds.length}</span>
          </div>
          <h1 className="text-lg font-semibold text-[#1D1D1F]">{questionText}</h1>
          <p className="text-sm text-[#6E6E73]">
            Paragraph {roundNumber} — {SLOT_LABELS[slot]}
          </p>
        </div>

        {/* Risk warning */}
        <div className="bg-[#FFF9EC] border border-amber-200 rounded-lg px-4 py-2">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Route risk: </span>{riskWarning}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {rounds.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < roundIndex ? 'bg-green-500'
                : i === roundIndex ? 'bg-blue-500'
                : 'bg-[#D2D2D7]'
              }`}
            />
          ))}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {roundOptions.map(opt => {
            const isSelected = state.phase === 'round'
              ? state.selected === opt.option_key
              : state.selected.option_key === opt.option_key
            const isBest  = isAnswered && opt.is_best_answer
            const isWrong = isAnswered && isSelected && !opt.is_best_answer

            let borderCls = 'border-[#D2D2D7]'
            let bgCls     = 'bg-white'
            if (isSelected && !isAnswered) { borderCls = 'border-blue-400'; bgCls = 'bg-blue-50' }
            if (isBest)   { borderCls = 'border-green-500'; bgCls = 'bg-green-50' }
            if (isWrong)  { borderCls = 'border-rose-400'; bgCls = 'bg-rose-50' }

            return (
              <button
                key={opt.option_key}
                disabled={isAnswered}
                onClick={() => handleSelect(opt.option_key)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${borderCls} ${bgCls} ${!isAnswered ? 'hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex gap-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isSelected && !isAnswered ? 'border-blue-500 text-blue-700 bg-blue-100'
                    : isBest ? 'border-green-600 text-green-700 bg-green-100'
                    : isWrong ? 'border-rose-500 text-rose-700 bg-rose-100'
                    : 'border-[#D2D2D7] text-[#6E6E73]'
                  }`}>
                    {opt.option_label}
                  </span>
                  <p className="text-sm text-[#1D1D1F] leading-relaxed">{opt.option_text}</p>
                </div>
                {isAnswered && (isBest || isWrong) && (
                  <div className="mt-3 pl-9 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isBest && <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">A* answer — {opt.score_value} pts</span>}
                      {isWrong && <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">{GRADE_LABELS[opt.grade_band]} — {opt.score_value} pt{opt.score_value !== 1 ? 's' : ''}</span>}
                      {opt.ao_tags.map(ao => <AoBadge key={ao} ao={ao} />)}
                    </div>
                    {isWrong && (
                      <>
                        <p className="text-xs font-medium text-[#1D1D1F]">Examiner diagnosis</p>
                        <p className="text-xs text-[#6E6E73]">{opt.examiner_diagnosis}</p>
                        <p className="text-xs font-medium text-[#1D1D1F] mt-1">Feedback</p>
                        <p className="text-xs text-[#6E6E73]">{opt.student_feedback}</p>
                        <p className="text-xs font-medium text-[#1D1D1F] mt-1">How to upgrade</p>
                        <p className="text-xs text-[#6E6E73]">{opt.upgrade_instruction}</p>
                      </>
                    )}
                    {isBest && (
                      <>
                        <p className="text-xs font-medium text-[#1D1D1F]">Why this is Level 5</p>
                        <p className="text-xs text-[#6E6E73]">{opt.examiner_diagnosis}</p>
                        <p className="text-xs text-[#6E6E73] mt-1">{opt.student_feedback}</p>
                      </>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Action buttons */}
        {!isAnswered ? (
          <button
            disabled={state.selected === null}
            onClick={handleSubmit}
            className="w-full py-3 bg-[#1D1D1F] text-white text-sm font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2D2D2F] transition-colors"
          >
            Submit answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-[#1D1D1F] text-white text-sm font-medium rounded-xl hover:bg-[#2D2D2F] transition-colors"
          >
            {roundIndex + 1 >= rounds.length ? 'See final score' : 'Next round →'}
          </button>
        )}
      </div>
    )
  }

  return null
}

function ComplianceStrip({ isDraft }: { isDraft: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs bg-[#F5F5F7] text-[#6E6E73] px-2.5 py-1 rounded-full font-medium">Duchess</span>
      <span className="text-xs bg-[#F5F5F7] text-[#6E6E73] px-2.5 py-1 rounded-full font-medium">Section B</span>
      <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">AO1 / AO2 / AO3 only</span>
      <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-medium">AO4 / AO5 blocked</span>
      {isDraft && (
        <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
          DRAFT — content unverified
        </span>
      )}
    </div>
  )
}
