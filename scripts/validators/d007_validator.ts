// D007 validator — Mode D annotated essay paragraphs
// All 16 rules from spec §9.2.

export type D007Annotation = {
  span_text: string
  ao_tags: string[]
  technique: string
  note: string
}

export type D007Row = {
  paragraph_key: string
  template_key: string
  model_essay_key: string
  route_key: string
  round_key: string
  round_number: number
  paragraph_slot: string
  paragraph_text: string
  annotations: D007Annotation[]
  examiner_summary: string
  word_count: number
  recommended_reading_time_seconds: number
  marking_status: string
  quote_verification_status: string
}

type ValidationFailure = { row: string; span?: string; rule: string; value: unknown }

const VALID_SLOTS  = ['INTRODUCTION','BODY_1','BODY_2','BODY_3','CONCLUSION'] as const
const VALID_AOS    = new Set(['AO1','AO2','AO3'])
const ROUTE_A_KEY  = 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL'
const TEMPLATE_KEY = 'REVEAL_DUCHESS_SECTION_B'
const MODEL_KEY    = 'MODE_D_D001R_DUCHESS_CONTROL_001'

const BLOCKED_CRITIC_NAMES  = ['Eagleton','Bradley','Greenblatt','Belsey','Dollimore','Aughterson','Aers']
const BLOCKED_CRITIC_PHRASES = [/as critic \w+ argues/i, /critics argue/i, /the critic/i]
const BLOCKED_CONTENT_WORDS  = [/\bhamlet\b/i, /\bshakespeare\b/i, /\bcompared with\b/i, /\bcomparison\b/i, /\bcompares\b/i]

function checkBlockedText(text: string, field: string, rowKey: string): ValidationFailure[] {
  const failures: ValidationFailure[] = []
  for (const re of BLOCKED_CONTENT_WORDS) {
    if (re.test(text)) failures.push({ row: rowKey, rule: `blocked-content:${field}`, value: re.source })
  }
  for (const name of BLOCKED_CRITIC_NAMES) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(text)) {
      failures.push({ row: rowKey, rule: `blocked-critic:${field}`, value: name })
    }
  }
  for (const re of BLOCKED_CRITIC_PHRASES) {
    if (re.test(text)) failures.push({ row: rowKey, rule: `blocked-critic-phrase:${field}`, value: re.source })
  }
  return failures
}

export function validateD007Paragraphs(rows: D007Row[]): ValidationFailure[] {
  const failures: ValidationFailure[] = []

  // Rule 1: exactly 5 rows
  if (rows.length !== 5) {
    failures.push({ row: 'batch', rule: 'exactly-5-rows', value: rows.length })
  }

  // Rule 2: exactly 5 distinct round_numbers (1–5) and paragraph_slots in correct alignment
  const roundNums = rows.map(r => r.round_number)
  const slots     = rows.map(r => r.paragraph_slot)
  const expectedRounds = [1,2,3,4,5]
  const expectedSlots  = VALID_SLOTS as unknown as string[]

  for (const n of expectedRounds) {
    if (!roundNums.includes(n)) {
      failures.push({ row: 'batch', rule: 'missing-round_number', value: n })
    }
  }
  for (const s of expectedSlots) {
    if (!slots.includes(s)) {
      failures.push({ row: 'batch', rule: 'missing-paragraph_slot', value: s })
    }
  }
  for (const row of rows) {
    const expectedSlot = expectedSlots[row.round_number - 1]
    if (row.paragraph_slot !== expectedSlot) {
      failures.push({ row: row.paragraph_key, rule: 'round-slot-alignment', value: `round ${row.round_number} → slot ${row.paragraph_slot} (expected ${expectedSlot})` })
    }
  }

  for (const row of rows) {
    const k = row.paragraph_key

    // Rule 3: route_key
    if (row.route_key !== ROUTE_A_KEY) {
      failures.push({ row: k, rule: 'route_key-patriarchal-control', value: row.route_key })
    }

    // Rule 4: round_key non-empty (DB FK check handles resolution)
    if (!row.round_key?.trim()) {
      failures.push({ row: k, rule: 'round_key-non-empty', value: '' })
    }

    // Rule 5: paragraph_text word count 100–300
    const wordCount = row.paragraph_text.split(/\s+/).filter(Boolean).length
    if (wordCount < 100 || wordCount > 300) {
      failures.push({ row: k, rule: 'paragraph_text-word-count-100-300', value: wordCount })
    }

    // Rule 6: word_count field matches actual count
    if (row.word_count !== wordCount) {
      failures.push({ row: k, rule: 'word_count-matches-actual', value: `stored=${row.word_count} actual=${wordCount}` })
    }

    // Rule 7: annotations is non-empty array; each has required non-empty fields
    if (!Array.isArray(row.annotations) || row.annotations.length === 0) {
      failures.push({ row: k, rule: 'annotations-non-empty-array', value: row.annotations })
    } else {
      for (const ann of row.annotations) {
        if (!ann.span_text?.trim()) {
          failures.push({ row: k, span: ann.span_text, rule: 'annotation-span_text-non-empty', value: '' })
        }
        if (!Array.isArray(ann.ao_tags) || ann.ao_tags.length === 0) {
          failures.push({ row: k, span: ann.span_text, rule: 'annotation-ao_tags-non-empty', value: ann.ao_tags })
        }
        if (!ann.technique?.trim()) {
          failures.push({ row: k, span: ann.span_text, rule: 'annotation-technique-non-empty', value: '' })
        }
        if (!ann.note?.trim()) {
          failures.push({ row: k, span: ann.span_text, rule: 'annotation-note-non-empty', value: '' })
        }
      }
    }

    // Rule 8: every span_text appears verbatim in paragraph_text (FATAL)
    if (Array.isArray(row.annotations)) {
      for (const ann of row.annotations) {
        if (ann.span_text && !row.paragraph_text.includes(ann.span_text)) {
          failures.push({ row: k, span: ann.span_text, rule: 'span_text-verbatim-in-paragraph', value: ann.span_text })
        }
      }
    }

    // Rule 9: ao_tags subset of {AO1,AO2,AO3}
    if (Array.isArray(row.annotations)) {
      for (const ann of row.annotations) {
        if (Array.isArray(ann.ao_tags)) {
          const invalid = ann.ao_tags.filter(t => !VALID_AOS.has(t))
          if (invalid.length > 0) {
            failures.push({ row: k, span: ann.span_text, rule: 'annotation-ao_tags-no-ao4-ao5', value: invalid })
          }
        }
      }
    }

    // Rule 10: R5 CONCLUSION annotations have ao_tags ⊆ {AO1,AO3} — no AO2
    if (row.round_number === 5 && Array.isArray(row.annotations)) {
      for (const ann of row.annotations) {
        if (Array.isArray(ann.ao_tags) && ann.ao_tags.includes('AO2')) {
          failures.push({ row: k, span: ann.span_text, rule: 'r5-annotation-excludes-ao2', value: ann.ao_tags })
        }
      }
    }

    // Rule 11 & 12: blocked content in paragraph_text, examiner_summary, annotation notes
    failures.push(...checkBlockedText(row.paragraph_text, 'paragraph_text', k))
    failures.push(...checkBlockedText(row.examiner_summary, 'examiner_summary', k))
    if (Array.isArray(row.annotations)) {
      for (const ann of row.annotations) {
        failures.push(...checkBlockedText(ann.note ?? '', 'annotation.note', k))
      }
    }

    // Rule 13: examiner_summary non-empty
    if (!row.examiner_summary?.trim()) {
      failures.push({ row: k, rule: 'examiner_summary-non-empty', value: '' })
    }

    // Rule 14: marking_status = 'draft' and quote_verification_status = 'pending' on import
    if (row.marking_status !== 'draft') {
      failures.push({ row: k, rule: 'import-marking_status-draft', value: row.marking_status })
    }
    if (row.quote_verification_status !== 'pending') {
      failures.push({ row: k, rule: 'import-quote_verification_status-pending', value: row.quote_verification_status })
    }

    // Rule 15: template_key
    if (row.template_key !== TEMPLATE_KEY) {
      failures.push({ row: k, rule: 'template_key', value: row.template_key })
    }

    // Rule 16: model_essay_key
    if (row.model_essay_key !== MODEL_KEY) {
      failures.push({ row: k, rule: 'model_essay_key', value: row.model_essay_key })
    }
  }

  return failures
}
