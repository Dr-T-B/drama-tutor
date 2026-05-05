import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import 'dotenv/config'

type Section = 'SECTION_A' | 'SECTION_B'

type Question = {
  year: number
  number: string
  text: string
  section: Section
}

const HAMLET_QUESTIONS: Question[] = [
  { year: 2017, number: '1', text: 'Explore the significance of the supernatural in Hamlet.', section: 'SECTION_A' },
  { year: 2017, number: '2', text: 'Explore the significance of performance and acting in Hamlet.', section: 'SECTION_A' },
  { year: 2018, number: '1', text: 'Explore the significance of women in Hamlet.', section: 'SECTION_A' },
  { year: 2018, number: '2', text: 'Explore the significance of corruption in Hamlet.', section: 'SECTION_A' },
  { year: 2019, number: '1', text: 'Explore the significance of revenge in Hamlet.', section: 'SECTION_A' },
  { year: 2019, number: '2', text: 'Explore the significance of appearance and reality in Hamlet.', section: 'SECTION_A' },
  { year: 2020, number: '1', text: 'Explore the significance of mortality in Hamlet.', section: 'SECTION_A' },
  { year: 2020, number: '2', text: 'Explore the significance of madness in Hamlet.', section: 'SECTION_A' },
  { year: 2021, number: '1', text: 'Explore the significance of power in Hamlet.', section: 'SECTION_A' },
  { year: 2021, number: '2', text: 'Explore the significance of loyalty and betrayal in Hamlet.', section: 'SECTION_A' },
  { year: 2022, number: '1', text: 'Explore the significance of justice in Hamlet.', section: 'SECTION_A' },
  { year: 2022, number: '2', text: 'Explore the significance of the father-son relationship in Hamlet.', section: 'SECTION_A' },
  { year: 2023, number: '1', text: 'Explore the significance of action and inaction in Hamlet.', section: 'SECTION_A' },
  { year: 2023, number: '2', text: 'Explore the significance of honour in Hamlet.', section: 'SECTION_A' },
  { year: 2024, number: '1', text: 'Explore the significance of grief in Hamlet.', section: 'SECTION_A' },
  { year: 2024, number: '2', text: 'Explore the significance of deception in Hamlet.', section: 'SECTION_A' },
]

const MALFI_QUESTIONS: Question[] = [
  { year: 2017, number: '1', text: 'Explore the significance of gender and power in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2017, number: '2', text: 'Explore the significance of surveillance and secrecy in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2018, number: '1', text: 'Explore the significance of corruption in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2018, number: '2', text: 'Explore the significance of identity in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2019, number: '1', text: 'Explore the significance of death in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2019, number: '2', text: 'Explore the significance of madness in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2020, number: '1', text: 'Explore the significance of loyalty and betrayal in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2020, number: '2', text: 'Explore the significance of power in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2021, number: '1', text: 'Explore the significance of ambition in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2021, number: '2', text: 'Explore the significance of justice and revenge in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2022, number: '1', text: 'Explore the significance of marriage and family in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2022, number: '2', text: 'Explore the significance of appearance and reality in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2023, number: '1', text: 'Explore the significance of religion and morality in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2023, number: '2', text: 'Explore the significance of the body in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2024, number: '1', text: 'Explore the significance of suffering in The Duchess of Malfi.', section: 'SECTION_B' },
  { year: 2024, number: '2', text: 'Explore the significance of fate and free will in The Duchess of Malfi.', section: 'SECTION_B' },
]

section('12 — Exam questions (past papers 2017–2024)')

const { data: component, error: compErr } = await supabase
  .from('components')
  .select('id')
  .eq('paper_code', '9ET0/01')
  .single()
if (compErr || !component) { err(`Component not found: ${compErr?.message}`); process.exit(1) }

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts HAM/MAL not found'); process.exit(1) }

info(`Component ${component.id} · HAM ${hamRow.id} · MAL ${malRow.id}`)

const all = [
  ...HAMLET_QUESTIONS.map(q => ({ ...q, text_id: hamRow.id })),
  ...MALFI_QUESTIONS.map(q => ({ ...q, text_id: malRow.id })),
]

let inserted = 0
let updated = 0
let failed = 0

for (const q of all) {
  // question_text_hash is GENERATED ALWAYS from question_text — use it to dedupe.
  // The unique index is (component_id, section, question_text_hash); look up by
  // the same input columns the hash derives from.
  const { data: existing } = await supabase
    .from('exam_questions')
    .select('id')
    .eq('component_id', component.id)
    .eq('section', q.section)
    .eq('question_text', q.text)
    .maybeSingle()

  const payload = {
    component_id: component.id,
    text_id: q.text_id,
    section: q.section,
    question_text: q.text,
    question_year: q.year,
    question_number: q.number,
    source: 'past_paper' as const,
  }

  if (existing) {
    const { error } = await supabase.from('exam_questions').update(payload).eq('id', existing.id)
    if (error) { err(`${q.year}/${q.number} ${q.section}: ${error.message}`); failed++; continue }
    updated++
  } else {
    const { error } = await supabase.from('exam_questions').insert(payload)
    if (error) { err(`${q.year}/${q.number} ${q.section}: ${error.message}`); failed++; continue }
    inserted++
  }
}

ok(`${inserted} inserted, ${updated} updated, ${failed} failed (of ${all.length})`)
console.log('\n✅  12 Exam questions complete\n')
