export type ThemeSummary = {
  id: string
  theme_code: string
  theme_name: string
  play: 'HAM' | 'MAL'
  section_relevance: string | null
}

export type ThesisRow = {
  thesis_text: string
  grade_band: 'B' | 'A' | 'A_STAR'
  ao_focus: string | null
  examiner_commentary: string | null
}

export type GuidanceRow = {
  guidance_type: string
  content: string
  ao_code: string | null
  target_level: string | null
}

export type QuoteMethod = {
  word_or_detail: string | null
  effect: string | null
  ao2_methods: { method_name: string } | null
}

export type QuoteRow = {
  id: string
  quote_text?: string | null
  text?: string | null
  content?: string | null
  speaker: string | null
  act_scene: string | null
  exam_sentence?: string | null
  memorisation_priority?: number | null
  ao_codes: string[]
  quote_methods: QuoteMethod[]
  [k: string]: any
}

export type CriticRow = {
  id: string
  interpretation?: string | null
  position?: string | null
  summary?: string | null
  usable_ao5_sentence: string | null
  critics: { name: string; school: string | null } | null
  [k: string]: any
}

export type CharacterRow = {
  id: string
  name: string
  dramatic_function: string | null
  theme_linked: boolean
  [k: string]: any
}

export type MethodRow = {
  id: string
  method_name: string
  method_category: string | null
  [k: string]: any
}

export type CommonErrorRow = {
  id: string
  name: string
  description: string | null
  correction_strategy: string | null
  severity: number | null
  [k: string]: any
}

export type StemRow = {
  id: string
  ao_code: string | null
  label: string | null
  stem_text: string | null
  [k: string]: any
}

export type EssayPlanRow = {
  id: string
  question?: string | null
  thesis?: string | null
  grade_band?: 'B' | 'A' | 'A_STAR' | null
  [k: string]: any
}

export type FrameworkData = {
  theme: {
    id: string
    theme_code: string
    theme_name: string
    section_relevance: string | null
    play: 'HAM' | 'MAL'
    play_title: string
  }
  theses: ThesisRow[]
  guidance: GuidanceRow[]
  quotes: QuoteRow[]
  critics: CriticRow[]
  characters: CharacterRow[]
  methods: MethodRow[]
  commonErrors: CommonErrorRow[]
  stems: StemRow[]
  essayPlans: EssayPlanRow[]
}

export type AiAnalysis = {
  question_decoded: {
    command_word: string
    what_is_really_asked: string
    conceptual_trap: string
    examiner_wants: string
  }
  core_argument: {
    recommended_thesis: string
    argument_direction: string
    dialectical_move: string
    section_note: string
  }
  ao_breakdown: { ao1: string; ao2: string; ao3: string; ao4: string; ao5: string }
  character_guidance: Array<{
    name: string
    priority: 'essential' | 'strong' | 'optional'
    why: string
    angle: string
  }>
  quote_selection: Array<{
    quote: string
    speaker: string
    why_this_question: string
    method_to_foreground: string
    ao5_pairing: string
  }>
  critic_deployment: Array<{
    critic: string
    position: string
    when_to_use: string
    sentence: string
  }>
  method_focus: Array<{
    method: string
    why_central: string
    exam_move: string
  }>
  errors_to_avoid: string[]
  forbidden_moves: string[]
}

async function readError(res: Response): Promise<string> {
  try {
    const j = await res.json()
    return j?.error ?? JSON.stringify(j)
  } catch {
    return await res.text()
  }
}

export async function fetchAllThemes(): Promise<ThemeSummary[]> {
  const res = await fetch('/api/themes')
  if (!res.ok) {
    throw new Error(`fetchAllThemes failed (${res.status}): ${await readError(res)}`)
  }
  return res.json()
}

export type PastQuestion = {
  id: string
  question_text: string
  question_year: number
  question_number: string | null
  section: 'SECTION_A' | 'SECTION_B'
}

export async function fetchPastQuestions(
  year: number,
  section: 'SECTION_A' | 'SECTION_B',
): Promise<PastQuestion[]> {
  const url = `/api/past-questions?year=${year}&section=${section}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`fetchPastQuestions failed (${res.status}): ${await readError(res)}`)
  }
  return res.json()
}

export async function buildFramework(
  themeId: string,
  question: string,
): Promise<{ data: FrameworkData; ai: AiAnalysis }> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ themeId, question }),
  })
  if (!res.ok) {
    throw new Error(`buildFramework failed (${res.status}): ${await readError(res)}`)
  }
  return res.json()
}
