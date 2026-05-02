import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import { readBlock, splitByH2, splitByH3, clean } from '../lib/parsers.js'
import 'dotenv/config'

const { data: comp } = await supabase.from('components').select('id').eq('paper_code', '9ET0/01').single()
const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!comp || !hamRow || !malRow) { err('Prereqs missing.'); process.exit(1) }

// ─── Timing strategies ───────────────────────────────────────────────────────
section('10 — Timing strategies')
const timing = [
  {
    section: 'SECTION_A' as const, total_minutes: 80, planning_minutes: 5, writing_minutes: 70, checking_minutes: 5,
    recommended_paragraphs: 4,
    strategy_note: 'Section A (Hamlet, 35 marks): ~17 min per paragraph × 4 + intro/conclusion. Prioritise AO2 depth and AO5 integration.',
  },
  {
    section: 'SECTION_B' as const, total_minutes: 55, planning_minutes: 5, writing_minutes: 45, checking_minutes: 5,
    recommended_paragraphs: 4,
    strategy_note: 'Section B (Duchess of Malfi, 25 marks): ~12 min per paragraph × 4. AO5 not assessed; maximise AO2 analysis. Do not compare with Hamlet.',
  },
]
for (const t of timing) {
  const { error } = await supabase.from('timing_strategies').upsert(
    { ...t, component_id: comp.id },
    { onConflict: 'component_id,section' },
  )
  if (error) err(`Timing ${t.section}: ${error.message}`)
  else ok(`Timing ${t.section}`)
}

// ─── Grade level descriptors (block 1, section 1b) ───────────────────────────
section('10 — Grade level descriptors')
const levelMd = readBlock('block1_exam_logic_ao_framework.md')
const levelSec = splitByH2(levelMd).find(s => /1b\.\s*Level Descriptor Translations/i.test(s.title))
if (!levelSec) { err('1b. Level Descriptor Translations section not found') }
else {
  for (const sub of splitByH3(levelSec.body)) {
    const m = sub.title.match(/^Level\s*(\d+)\b/i)
    if (!m) continue
    const levelNo = parseInt(m[1], 10)
    const descM = sub.body.match(/\*\*What the writing actually does:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/)
    const exam  = sub.body.match(/\*\*Self-assessment diagnostic:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/)
    const why   = sub.body.match(/\*\*Why students get stuck here:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/)
    const descriptor = clean(descM?.[1] ?? '').replace(/\s+/g, ' ').trim()
    const examiner   = clean(exam?.[1] ?? '').replace(/\s+/g, ' ').trim()
    const success    = clean(why?.[1]  ?? '').replace(/\s+/g, ' ').trim()
    if (!descriptor) continue
    const grade_band = levelNo <= 2 ? 'B' : levelNo === 3 ? 'A' : 'A_STAR'
    for (const sec of ['SECTION_A', 'SECTION_B'] as const) {
      const { error } = await supabase.from('grade_level_descriptors').upsert({
        component_id: comp.id,
        section: sec,
        ao_code: null,
        level_no: levelNo,
        grade_band,
        descriptor,
        examiner_translation: examiner || null,
        success_criteria: success || null,
      }, { onConflict: 'component_id,section,ao_code,level_no' })
      if (error) err(`  level ${levelNo} ${sec}: ${error.message}`)
    }
    ok(`Level ${levelNo} (${grade_band})`)
  }
}

// ─── Common errors (block 1, section 1d) ─────────────────────────────────────
section('10 — Common errors')
const errSec = splitByH2(levelMd).find(s => /1d\.\s*Common Errors/i.test(s.title))
if (!errSec) { err('1d. Common Errors section not found') }
else {
  let inserted = 0
  for (const sub of splitByH3(errSec.body)) {
    const m = sub.title.match(/^Error\s*(\d+):\s*(.+)$/i)
    if (!m) continue
    const errorName = m[2].trim()
    const whatM = sub.body.match(/\*\*What it is:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/)
    const whyM  = sub.body.match(/\*\*Why it limits the mark:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/)
    const fixM  = sub.body.match(/\*\*The fix:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*|$)/)
    const desc = clean(whatM?.[1] ?? '').replace(/\s+/g, ' ').trim()
    const symptom = clean(whyM?.[1] ?? '').replace(/\s+/g, ' ').trim() || null
    const fix = clean(fixM?.[1] ?? '').replace(/\s+/g, ' ').trim() || 'See block 1, section 1d'
    if (!desc) continue
    // Idempotent: delete by name then insert
    await supabase.from('common_errors')
      .delete()
      .eq('component_id', comp.id)
      .eq('error_name', errorName)
    const { error } = await supabase.from('common_errors').insert({
      component_id: comp.id,
      text_id: null,
      section: null,
      ao_code: null,
      error_name: errorName,
      error_description: desc,
      symptom_in_student_writing: symptom,
      correction_strategy: fix,
      severity: 3,
    })
    if (error) err(`Error '${errorName}': ${error.message}`)
    else inserted++
  }
  ok(`Inserted ${inserted} common errors`)
}

// ─── Paragraph sentence stems (curated set, both sections) ───────────────────
section('10 — Paragraph sentence stems')
const stems = [
  // AO1 — argument scaffolding
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO1' as const, label: 'Conceptual topic',
    text: 'Shakespeare stages [theme] not as [conventional reading] but as [counter-claim], so that…',
    note: 'Open with an analytical verb (stages, constructs, dramatises). Avoid "shows" / "presents".' },
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO1' as const, label: 'Concession-and-counter',
    text: 'While [common reading], the play in fact [your reading], because…',
    note: 'Useful when engaging with critics — opens space for AO5 integration.' },
  // AO2 — close analysis
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO2' as const, label: 'Method → effect',
    text: 'The [method] in "[quote]" — [specific word] — [precise effect on audience], so that [thematic significance].',
    note: 'The full AO2 chain in a single sentence. The "specific word" is the heart of the analysis.' },
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO2' as const, label: 'Structural positioning',
    text: "Shakespeare's decision to position [moment] *after* [prior moment] creates a structural irony in which…",
    note: 'A* moves analyse where moments sit in the play architecture, not just what they say.' },
  // AO3 — embedded context
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO3' as const, label: 'Embedded context',
    text: '[Quote] activates [specific cultural/theological framework], so that [analytical consequence for the reading].',
    note: 'Context must shape interpretation, not be listed as background.' },
  // AO5 — critic integration
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO5' as const, label: 'Weave-in critic',
    text: '…a reading that aligns with [Critic]\'s argument that [position], where [textual moment] becomes [reframed reading].',
    note: 'Strategy 1 (WEAVE) — critic shares the analytical sentence rather than getting their own.' },
  { section: 'SECTION_A' as const, text_id: hamRow.id, ao_code: 'AO5' as const, label: 'Frame-with critic',
    text: '[Critic] argues that [position]. This is most precisely visible in [moment], where…',
    note: 'Strategy 2 (FRAME) — critic opens the paragraph; close reading tests their claim.' },
  // Section B — same scaffolding, no AO5
  { section: 'SECTION_B' as const, text_id: malRow.id, ao_code: 'AO1' as const, label: 'Conceptual topic',
    text: 'Webster constructs [theme] not as [conventional reading] but as [counter-claim], staging…',
    note: 'Use "Webster" (not "the writer"). AO5 not required in Section B.' },
  { section: 'SECTION_B' as const, text_id: malRow.id, ao_code: 'AO2' as const, label: 'Method → effect',
    text: 'The [method] in "[quote]" — [specific word] — [precise effect], revealing [thematic significance].',
    note: 'Section B has no AO5; maximise depth of AO2 analysis instead.' },
  { section: 'SECTION_B' as const, text_id: malRow.id, ao_code: 'AO3' as const, label: 'Embedded context',
    text: 'Webster\'s [moment] resonates with [specific Jacobean cultural condition], so that [analytical consequence].',
    note: 'Jacobean context (court patronage, widow law, anti-Catholic discourse) is the AO3 backbone.' },
]
let stemCount = 0
for (const s of stems) {
  // Idempotent: delete by (text_id, section, ao_code, label) then insert
  await supabase.from('paragraph_sentence_stems').delete()
    .eq('text_id', s.text_id).eq('section', s.section)
    .eq('ao_code', s.ao_code).eq('stem_label', s.label)
  const { error } = await supabase.from('paragraph_sentence_stems').insert({
    text_id: s.text_id,
    section: s.section,
    ao_code: s.ao_code,
    stem_label: s.label,
    stem_text: s.text,
    usage_note: s.note,
    target_level: 'A',
  })
  if (error) err(`Stem ${s.label}: ${error.message}`)
  else stemCount++
}
ok(`${stemCount} paragraph sentence stems`)

console.log('\n✅  10 Exam skills complete\n')
