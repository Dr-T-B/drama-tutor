import { supabase } from '../lib/supabaseAdmin.js'
import { register } from '../lib/ids.js'
import { ok, err, section } from '../lib/log.js'
import 'dotenv/config'

// ─── Component ───────────────────────────────────────────────────────────────
section('00 — Seed: component')
const { data: comp, error: compErr } = await supabase
  .from('components')
  .upsert({
    exam_board:         'Pearson Edexcel',
    qualification:      'A Level English Literature',
    specification_code: '9ET0',
    paper_code:         '9ET0/01',
    title:              'Component 1: Drama',
    total_marks:        60,
  }, { onConflict: 'paper_code' })
  .select('id')
  .single()

if (compErr || !comp) {
  err(`Component: ${compErr?.message ?? 'no row returned'}`)
  process.exit(1)
}
register('component:9ET0/01', comp.id)
ok(`Component → ${comp.id}`)
const compId = comp.id

// ─── Assessment Objectives reference data ─────────────────────────────────────
section('00 — Seed: assessment_objectives')
const aos = [
  { code: 'AO1', label: 'Knowledge & Argument',     description: 'Articulate informed, personal and creative responses to literary texts, using associated concepts and terminology, and coherent, accurate written expression.' },
  { code: 'AO2', label: 'Methods & Analysis',       description: 'Analyse ways in which meanings are shaped in literary texts.' },
  { code: 'AO3', label: 'Context',                  description: 'Demonstrate understanding of the significance and influence of the contexts in which literary texts are written and received.' },
  { code: 'AO4', label: 'Connections',              description: 'Explore connections across literary texts.' },
  { code: 'AO5', label: 'Critical interpretations', description: 'Explore literary texts informed by different interpretations.' },
]
for (const ao of aos) {
  const { error } = await supabase.from('assessment_objectives').upsert(ao, { onConflict: 'code' })
  if (error) err(`AO ${ao.code}: ${error.message}`)
  else ok(`AO ${ao.code}`)
}

// ─── Texts ───────────────────────────────────────────────────────────────────
section('00 — Seed: texts')
const texts = [
  {
    short_code: 'HAM',
    title: 'Hamlet',
    author: 'William Shakespeare',
    section: 'A_HAMLET' as const,
    exam_section: 'SECTION_A' as const,
    marks: 35,
    edition_note: 'Arden Third Edition (ISBN 978-1-903436-48-4) recommended',
    line_reference_system: 'Act.Scene.Line',
  },
  {
    short_code: 'MAL',
    title: 'The Duchess of Malfi',
    author: 'John Webster',
    section: 'B_OTHER_DRAMA' as const,
    exam_section: 'SECTION_B' as const,
    marks: 25,
    edition_note: 'Bloomsbury Methuen Drama (ISBN 978-1-472-52065-4)',
    line_reference_system: 'Act.Scene',
  },
]

for (const t of texts) {
  const { data, error } = await supabase
    .from('texts')
    .upsert({ ...t, component_id: compId }, { onConflict: 'component_id,short_code' })
    .select('id')
    .single()
  if (error || !data) {
    err(`Text ${t.short_code}: ${error?.message}`)
    continue
  }
  register(`text:${t.short_code}`, data.id)
  ok(`Text ${t.short_code} → ${data.id}`)
}

const hamTextId = (await supabase.from('texts').select('id').eq('short_code', 'HAM').eq('component_id', compId).single()).data!.id
const malTextId = (await supabase.from('texts').select('id').eq('short_code', 'MAL').eq('component_id', compId).single()).data!.id

// ─── Acts & scenes: Hamlet ────────────────────────────────────────────────────
section('00 — Seed: acts_scenes (Hamlet)')
const hamletScenes = [
  { act_no: 1, scene_no: 1, scene_label: '1.1', synopsis: 'The sentinels encounter the Ghost', structural_function: 'Exposition and supernatural premise' },
  { act_no: 1, scene_no: 2, scene_label: '1.2', synopsis: 'Claudius holds court; first Hamlet soliloquy', structural_function: 'Court vs. Hamlet; "unweeded garden"' },
  { act_no: 1, scene_no: 3, scene_label: '1.3', synopsis: 'Polonius and Laertes counsel Ophelia', structural_function: 'Surveillance begins; patriarchal control' },
  { act_no: 1, scene_no: 4, scene_label: '1.4', synopsis: 'Hamlet and the Ghost on the battlements', structural_function: '"Something is rotten"; supernatural summons' },
  { act_no: 1, scene_no: 5, scene_label: '1.5', synopsis: 'Ghost reveals the murder; revenge commanded', structural_function: 'Inciting incident; "antic disposition"' },
  { act_no: 2, scene_no: 1, scene_label: '2.1', synopsis: 'Polonius sends Reynaldo to spy on Laertes', structural_function: 'Surveillance apparatus established' },
  { act_no: 2, scene_no: 2, scene_label: '2.2', synopsis: 'Rosencrantz and Guildenstern; the players arrive', structural_function: 'Performance and espionage' },
  { act_no: 3, scene_no: 1, scene_label: '3.1', synopsis: '"To be or not to be"; nunnery scene', structural_function: 'Philosophical crisis; Ophelia used as bait' },
  { act_no: 3, scene_no: 2, scene_label: '3.2', synopsis: 'The Mousetrap; Claudius reacts', structural_function: 'Proof of guilt; play-within-a-play' },
  { act_no: 3, scene_no: 3, scene_label: '3.3', synopsis: 'Claudius at prayer; Hamlet delays', structural_function: 'Delay at its crisis; moral scruple' },
  { act_no: 3, scene_no: 4, scene_label: '3.4', synopsis: 'The closet scene; Polonius killed', structural_function: 'Maternal confrontation; accidental murder' },
  { act_no: 4, scene_no: 1, scene_label: '4.1', synopsis: "Claudius responds to Polonius's death", structural_function: 'Political crisis for Claudius' },
  { act_no: 4, scene_no: 3, scene_label: '4.3', synopsis: 'Hamlet sent to England', structural_function: 'Exile; counter-plot' },
  { act_no: 4, scene_no: 4, scene_label: '4.4', synopsis: "Fortinbras's army; Hamlet's \"How all occasions\" soliloquy", structural_function: 'Action vs. delay contrast' },
  { act_no: 4, scene_no: 5, scene_label: '4.5', synopsis: "Ophelia's madness; Laertes returns", structural_function: 'Female madness; revenge imperative renewed' },
  { act_no: 4, scene_no: 6, scene_label: '4.6', synopsis: "Horatio receives Hamlet's letter", structural_function: 'Plot bridge; pirates' },
  { act_no: 4, scene_no: 7, scene_label: '4.7', synopsis: "Claudius plots with Laertes; Ophelia's death reported", structural_function: 'Conspiracy; elegiac pastoral' },
  { act_no: 5, scene_no: 1, scene_label: '5.1', synopsis: "The graveyard; Yorick; Ophelia's burial", structural_function: 'Memento mori; mortality confronted' },
  { act_no: 5, scene_no: 2, scene_label: '5.2', synopsis: 'The duel; catastrophe; resolution', structural_function: 'Tragic resolution; "the readiness is all"' },
]

for (const s of hamletScenes) {
  const { data, error } = await supabase
    .from('acts_scenes')
    .upsert({ ...s, text_id: hamTextId }, { onConflict: 'text_id,act_no,scene_no' })
    .select('id')
    .single()
  if (error || !data) { err(`Scene HAM ${s.scene_label}: ${error?.message}`); continue }
  register(`scene:HAM:${s.scene_label}`, data.id)
  ok(`Scene HAM ${s.scene_label}`)
}

// ─── Acts & scenes: Duchess of Malfi ──────────────────────────────────────────
section('00 — Seed: acts_scenes (Duchess of Malfi)')
const duchessScenes = [
  { act_no: 1, scene_no: 1, scene_label: '1.1', synopsis: 'Antonio describes the ideal court; Ferdinand and Cardinal warn the Duchess', structural_function: 'Thesis statement; the prohibition; surveillance begins' },
  { act_no: 1, scene_no: 2, scene_label: '1.2', synopsis: 'The wooing scene — Duchess proposes to Antonio', structural_function: 'Defiance; secret marriage' },
  { act_no: 2, scene_no: 1, scene_label: '2.1', synopsis: "Bosola's apricot stratagem reveals pregnancy", structural_function: 'Surveillance as bodily intrusion' },
  { act_no: 2, scene_no: 2, scene_label: '2.2', synopsis: 'Antonio frames the birth; horoscope discovered', structural_function: 'Information leakage' },
  { act_no: 2, scene_no: 3, scene_label: '2.3', synopsis: 'Bosola finds the horoscope', structural_function: 'Discovery escalates' },
  { act_no: 2, scene_no: 4, scene_label: '2.4', synopsis: "The Cardinal's affair with Julia established", structural_function: 'Double standard; clerical hypocrisy' },
  { act_no: 2, scene_no: 5, scene_label: '2.5', synopsis: "Ferdinand's rage at news of Duchess's child", structural_function: 'Sexualised tyranny; incestuous undertone' },
  { act_no: 3, scene_no: 1, scene_label: '3.1', synopsis: 'Time has passed; Ferdinand returns to confront the Duchess', structural_function: 'Premeditation of vengeance' },
  { act_no: 3, scene_no: 2, scene_label: '3.2', synopsis: "Ferdinand enters the bedchamber; Duchess's identity declared", structural_function: 'Invasion of private space; "I am Duchess of Malfi still"' },
  { act_no: 3, scene_no: 3, scene_label: '3.3', synopsis: 'The brothers plot; Bosola advanced', structural_function: 'Conspiracy formalised' },
  { act_no: 3, scene_no: 4, scene_label: '3.4', synopsis: 'Cardinal arms; Duchess at Loretto', structural_function: 'Dumb-show; political display' },
  { act_no: 3, scene_no: 5, scene_label: '3.5', synopsis: 'Escape and capture', structural_function: 'Failed evasion; control reimposed' },
  { act_no: 4, scene_no: 1, scene_label: '4.1', synopsis: 'Dead hand; waxwork; torture of the Duchess', structural_function: 'Psychological horror; endurance' },
  { act_no: 4, scene_no: 2, scene_label: '4.2', synopsis: 'Masque of madmen; Duchess strangled', structural_function: 'Death scene; stoic defiance' },
  { act_no: 5, scene_no: 1, scene_label: '5.1', synopsis: "Antonio's plan to confront the Cardinal", structural_function: 'Last hope; political naïveté' },
  { act_no: 5, scene_no: 2, scene_label: '5.2', synopsis: "Ferdinand's lycanthropy; the Cardinal's self-diagnosis", structural_function: 'Moral collapse; nemesis' },
  { act_no: 5, scene_no: 3, scene_label: '5.3', synopsis: "Echo scene; Antonio hears the Duchess's voice", structural_function: 'Ghost echo; elegiac coda' },
  { act_no: 5, scene_no: 4, scene_label: '5.4', synopsis: 'Antonio killed by Bosola in error', structural_function: 'Accident; moral chaos' },
  { act_no: 5, scene_no: 5, scene_label: '5.5', synopsis: 'Triple catastrophe: Cardinal, Ferdinand, Bosola die', structural_function: 'Retribution; bleak resolution' },
]

for (const s of duchessScenes) {
  const { data, error } = await supabase
    .from('acts_scenes')
    .upsert({ ...s, text_id: malTextId }, { onConflict: 'text_id,act_no,scene_no' })
    .select('id')
    .single()
  if (error || !data) { err(`Scene MAL ${s.scene_label}: ${error?.message}`); continue }
  register(`scene:MAL:${s.scene_label}`, data.id)
  ok(`Scene MAL ${s.scene_label}`)
}

// ─── Component AO weightings ──────────────────────────────────────────────────
section('00 — Seed: component_ao_weightings')
const weightings = [
  // Section A (Hamlet) — 35 marks; AO1 AO2 AO3 AO5
  { section: 'SECTION_A' as const, ao_code: 'AO1' as const, marks: null, weighting_note: 'Integrated across response' },
  { section: 'SECTION_A' as const, ao_code: 'AO2' as const, marks: null, weighting_note: 'Integrated across response' },
  { section: 'SECTION_A' as const, ao_code: 'AO3' as const, marks: null, weighting_note: 'Integrated across response' },
  { section: 'SECTION_A' as const, ao_code: 'AO5' as const, marks: null, weighting_note: 'Integrated across response' },
  // Section B (Duchess) — 25 marks; AO1 AO2 AO3
  { section: 'SECTION_B' as const, ao_code: 'AO1' as const, marks: null, weighting_note: 'Integrated across response' },
  { section: 'SECTION_B' as const, ao_code: 'AO2' as const, marks: null, weighting_note: 'Integrated across response' },
  { section: 'SECTION_B' as const, ao_code: 'AO3' as const, marks: null, weighting_note: 'AO4 and AO5 not assessed in Section B' },
]
for (const w of weightings) {
  const { error } = await supabase
    .from('component_ao_weightings')
    .upsert({ ...w, component_id: compId }, { onConflict: 'component_id,section,ao_code' })
  if (error) err(`Weighting ${w.section}/${w.ao_code}: ${error.message}`)
  else ok(`Weighting ${w.section}/${w.ao_code}`)
}

console.log('\n✅  00 Seed complete\n')
