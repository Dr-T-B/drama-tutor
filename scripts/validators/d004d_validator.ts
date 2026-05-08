// D004D validator — Mode D Duchess MCQ stem options
// Rules apply to both Route A and Route B rows identically.

export type D004DRow = {
  option_key: string
  model_essay_key: string
  route_key: string
  play_code: string
  exam_section_code: string
  ao_profile_lock: string
  question_text: string
  route_title: string
  blocked_ao_check: string
  round_key: string
  round_number: number
  paragraph_slot: string
  option_label: string
  option_text: string
  classification: string
  grade_band: string
  is_best_answer: boolean
  score_value: number
  ao_tags: string[]
  primary_ao_focus: string
  error_type: string
  examiner_diagnosis: string
  student_feedback: string
  upgrade_instruction: string
  marking_status: string
  quote_verification_status: string
}

type ValidationFailure = { row: string; rule: string; value: unknown }

const VALID_SLOTS   = new Set(['INTRODUCTION','BODY_1','BODY_2','BODY_3','CONCLUSION'])
const VALID_LABELS  = new Set(['A','B','C','D'])
const VALID_CLSF    = new Set(['NARRATIVE','CONTEXT','PARTIAL','BEST'])
const VALID_BANDS   = new Set(['U','E','C','A_STAR'])
const VALID_AOS     = new Set(['AO1','AO2','AO3'])
const VALID_PAF     = new Set(['AO1','AO2','AO3'])
const VALID_MARKING = new Set(['draft','checked','approved'])
const VALID_QVS     = new Set(['pending','checked','verified'])
const SCORE_MAP: Record<string, number> = { NARRATIVE: 0, CONTEXT: 1, PARTIAL: 2, BEST: 4 }

const BLOCKED_CRITIC_NAMES  = ['Eagleton','Bradley','Greenblatt','Belsey','Dollimore','Aughterson','Aers']
const BLOCKED_CRITIC_PHRASES = [/as critic \w+ argues/i, /critics argue/i, /the critic/i]
const BLOCKED_CONTENT_WORDS  = [/\bhamlet\b/i, /\bshakespeare\b/i, /\bcompared with\b/i, /\bcomparison\b/i, /\bcompares\b/i]

function checkBlockedContent(text: string, field: string, rowKey: string): ValidationFailure[] {
  const failures: ValidationFailure[] = []
  for (const re of BLOCKED_CONTENT_WORDS) {
    if (re.test(text)) {
      failures.push({ row: rowKey, rule: `blocked-content:${field}`, value: re.source })
    }
  }
  for (const name of BLOCKED_CRITIC_NAMES) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(text)) {
      failures.push({ row: rowKey, rule: `blocked-critic:${field}`, value: name })
    }
  }
  for (const re of BLOCKED_CRITIC_PHRASES) {
    if (re.test(text)) {
      failures.push({ row: rowKey, rule: `blocked-critic-phrase:${field}`, value: re.source })
    }
  }
  return failures
}

export function validateD004DRows(rows: D004DRow[]): ValidationFailure[] {
  const failures: ValidationFailure[] = []

  // Group by route + round for best-answer checks
  const byRouteRound = new Map<string, D004DRow[]>()
  for (const row of rows) {
    const k = `${row.route_key}__${row.round_number}`
    if (!byRouteRound.has(k)) byRouteRound.set(k, [])
    byRouteRound.get(k)!.push(row)
  }

  for (const row of rows) {
    const k = row.option_key

    // Rule 1: option_key non-empty
    if (!row.option_key?.trim()) {
      failures.push({ row: k, rule: 'option_key-non-empty', value: row.option_key })
    }

    // Rule 2: play_code
    if (row.play_code !== 'DUCHESS') {
      failures.push({ row: k, rule: 'play_code-duchess', value: row.play_code })
    }

    // Rule 3: exam_section_code
    if (row.exam_section_code !== 'SECTION_B_OTHER_DRAMA') {
      failures.push({ row: k, rule: 'exam_section_code', value: row.exam_section_code })
    }

    // Rule 4: ao_profile_lock
    if (row.ao_profile_lock !== 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY') {
      failures.push({ row: k, rule: 'ao_profile_lock', value: row.ao_profile_lock })
    }

    // Rule 5: blocked_ao_check
    if (row.blocked_ao_check !== 'PASS') {
      failures.push({ row: k, rule: 'blocked_ao_check', value: row.blocked_ao_check })
    }

    // Rule 6: round_number range
    if (row.round_number < 1 || row.round_number > 5) {
      failures.push({ row: k, rule: 'round_number-range', value: row.round_number })
    }

    // Rule 7: paragraph_slot
    if (!VALID_SLOTS.has(row.paragraph_slot)) {
      failures.push({ row: k, rule: 'paragraph_slot', value: row.paragraph_slot })
    }

    // Rule 8: option_label
    if (!VALID_LABELS.has(row.option_label)) {
      failures.push({ row: k, rule: 'option_label', value: row.option_label })
    }

    // Rule 9: option_text non-empty
    if (!row.option_text?.trim()) {
      failures.push({ row: k, rule: 'option_text-non-empty', value: '' })
    }

    // Rule 10: classification
    if (!VALID_CLSF.has(row.classification)) {
      failures.push({ row: k, rule: 'classification', value: row.classification })
    }

    // Rule 11: grade_band
    if (!VALID_BANDS.has(row.grade_band)) {
      failures.push({ row: k, rule: 'grade_band', value: row.grade_band })
    }

    // Rule 12: score_value matches classification
    if (SCORE_MAP[row.classification] !== undefined && row.score_value !== SCORE_MAP[row.classification]) {
      failures.push({ row: k, rule: 'score_value-matches-classification', value: `${row.classification}→${row.score_value}` })
    }

    // Rule 13: is_best_answer iff classification=BEST
    const expectBest = row.classification === 'BEST'
    if (row.is_best_answer !== expectBest) {
      failures.push({ row: k, rule: 'is_best_answer-matches-classification', value: `is_best_answer=${row.is_best_answer} classification=${row.classification}` })
    }

    // Rule 14: ao_tags non-empty and subset of {AO1,AO2,AO3}
    if (!Array.isArray(row.ao_tags) || row.ao_tags.length === 0) {
      failures.push({ row: k, rule: 'ao_tags-non-empty', value: row.ao_tags })
    } else {
      const invalid = row.ao_tags.filter(t => !VALID_AOS.has(t))
      if (invalid.length > 0) {
        failures.push({ row: k, rule: 'ao_tags-no-ao4-ao5', value: invalid })
      }
    }

    // Rule 15: primary_ao_focus
    if (!VALID_PAF.has(row.primary_ao_focus)) {
      failures.push({ row: k, rule: 'primary_ao_focus', value: row.primary_ao_focus })
    }

    // Rule 16: non-empty text fields
    for (const [field, val] of [
      ['examiner_diagnosis', row.examiner_diagnosis],
      ['student_feedback', row.student_feedback],
      ['upgrade_instruction', row.upgrade_instruction],
      ['error_type', row.error_type],
      ['question_text', row.question_text],
      ['route_key', row.route_key],
      ['round_key', row.round_key],
      ['model_essay_key', row.model_essay_key],
    ] as [string, string][]) {
      if (!val?.trim()) {
        failures.push({ row: k, rule: `${field}-non-empty`, value: '' })
      }
    }

    // Rule 17: marking_status and quote_verification_status
    if (!VALID_MARKING.has(row.marking_status)) {
      failures.push({ row: k, rule: 'marking_status', value: row.marking_status })
    }
    if (!VALID_QVS.has(row.quote_verification_status)) {
      failures.push({ row: k, rule: 'quote_verification_status', value: row.quote_verification_status })
    }

    // Rule 18: no Hamlet/comparison/critic contamination in text fields
    for (const [field, val] of [
      ['option_text', row.option_text],
      ['examiner_diagnosis', row.examiner_diagnosis],
      ['student_feedback', row.student_feedback],
      ['upgrade_instruction', row.upgrade_instruction],
    ] as [string, string][]) {
      failures.push(...checkBlockedContent(val ?? '', field, k))
    }
  }

  // Rule 19: exactly one best answer per route × round
  for (const [key, group] of byRouteRound) {
    const bests = group.filter(r => r.is_best_answer)
    if (bests.length !== 1) {
      failures.push({ row: key, rule: 'one-best-per-round', value: bests.length })
    }
  }

  // Rule 20: R5 best answer must not contain AO2 in ao_tags
  const r5bests = rows.filter(r => r.round_number === 5 && r.is_best_answer)
  for (const row of r5bests) {
    if (row.ao_tags.includes('AO2')) {
      failures.push({ row: row.option_key, rule: 'r5-best-excludes-ao2', value: row.ao_tags })
    }
  }

  return failures
}
