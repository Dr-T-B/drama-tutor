import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import { readBlock, splitByH2, splitByH3, clean } from '../lib/parsers.js'
import 'dotenv/config'

const { data: comp } = await supabase.from('components').select('id').eq('paper_code', '9ET0/01').single()
const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!comp || !hamRow || !malRow) { err('Prereqs missing.'); process.exit(1) }

type ModelRec = {
  name: string
  formula: string
  worked_example: string
  applies_to: ('SECTION_A' | 'SECTION_B')[]
}

function parseThesisModels(md: string): ModelRec[] {
  const records: ModelRec[] = []
  const h2 = splitByH2(md)
  const sec = h2.find(s => /8b\.\s*THESIS CONSTRUCTION/i.test(s.title))
  if (!sec) return records
  for (const s of splitByH3(sec.body)) {
    const m = s.title.match(/^Model\s*(\d+):\s*(.+)$/i)
    if (!m) continue
    const isCriticalOnly = /Section\s*A\s*only|AO5/i.test(s.title)
    const formulaM = s.body.match(/\*\*Formula:\*\*\s*([\s\S]*?)(?=\n\n|\*\*Worked)/i)
    const exampleM = s.body.match(/\*\*Worked example[^*]*\*\*[\s\S]*?>\s*([\s\S]*?)(?=\n\n\*\*|$)/i)
    records.push({
      name: clean(m[2]),
      formula: clean(formulaM?.[1] ?? '').replace(/\s+/g, ' ').trim(),
      worked_example: clean(exampleM?.[1] ?? '').replace(/\s+/g, ' ').trim(),
      applies_to: isCriticalOnly ? ['SECTION_A'] : ['SECTION_A', 'SECTION_B'],
    })
  }
  return records
}

section('07 — Thesis models')
const models = parseThesisModels(readBlock('block8_exam_skills_schema.md'))
info(`Parsed ${models.length} thesis models`)

for (const m of models) {
  for (const sec of m.applies_to) {
    const textId = sec === 'SECTION_A' ? hamRow.id : malRow.id
    // Idempotent: delete by (component_id, text_id, section, model name) signature
    await supabase.from('thesis_models')
      .delete()
      .eq('component_id', comp.id)
      .eq('section', sec)
      .like('thesis_model', `${m.name}%`)
    const { error } = await supabase.from('thesis_models').insert({
      component_id:  comp.id,
      text_id:       textId,
      section:       sec,
      question_stem: `[Section ${sec === 'SECTION_A' ? 'A' : 'B'}] ${sec === 'SECTION_A' ? 'Explore [topic] in Hamlet…' : 'Explore [topic] in The Duchess of Malfi…'}`,
      thesis_model:  `${m.name}\n\nFormula: ${m.formula}\n\nWorked example: ${m.worked_example}`,
      target_level:  'A_STAR',
      ao_focus:      sec === 'SECTION_A' && /critical/i.test(m.name) ? ['AO1', 'AO5'] : ['AO1', 'AO2', 'AO3'],
      warning_note:  /critical/i.test(m.name) ? 'Section A only. Section B does not assess AO5.' : null,
    })
    if (error) err(`  ${m.name} (${sec}): ${error.message}`)
    else ok(`${m.name} (${sec})`)
  }
}

console.log('\n✅  07 Thesis models complete\n')
