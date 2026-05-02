import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

// Curated vocabulary spanning analytical verbs, structural terms, and contextual abstractions.
// Cross-text terms (text_id null) appear in both Section A and Section B analysis.

type VocRec = {
  text_id: string | null
  term: string
  definition: string
  usage_in_analysis: string
  ao_relevance: string[]
  target_level: 'B' | 'A' | 'A_STAR'
  theme_codes?: string[]
}

const vocabulary: VocRec[] = [
  // ── Analytical verbs (cross-text) ──────────────────────────────────────────
  { text_id: null, term: 'stages', definition: 'To present or dramatise a concept theatrically.', usage_in_analysis: 'Use as the active analytical verb in topic sentences: "Shakespeare stages delay as the play\'s governing dramatic principle."', ao_relevance: ['AO1', 'AO2'], target_level: 'A' },
  { text_id: null, term: 'constructs', definition: 'To assemble or fashion an idea, character, or argument deliberately.', usage_in_analysis: '"Webster constructs the Cardinal as the institutional face of corruption."', ao_relevance: ['AO1'], target_level: 'A' },
  { text_id: null, term: 'dramatises', definition: 'To render in dramatic form; to enact rather than describe.', usage_in_analysis: '"Shakespeare dramatises conscience as a paralysing force, not a moral compass."', ao_relevance: ['AO1', 'AO2'], target_level: 'A' },
  { text_id: null, term: 'interrogates', definition: 'To examine critically or systematically; to put a concept under pressure.', usage_in_analysis: '"The play interrogates the ethics of revenge rather than endorsing them."', ao_relevance: ['AO1'], target_level: 'A_STAR' },
  { text_id: null, term: 'exposes', definition: 'To make visible or render legible something previously concealed.', usage_in_analysis: '"Webster exposes the structural violence underwriting aristocratic order."', ao_relevance: ['AO1', 'AO5'], target_level: 'A_STAR' },
  { text_id: null, term: 'destabilises', definition: 'To unsettle or render uncertain.', usage_in_analysis: '"The play destabilises the boundary between performance and authenticity."', ao_relevance: ['AO1', 'AO2'], target_level: 'A_STAR' },

  // ── Structural / formal terms ─────────────────────────────────────────────
  { text_id: null, term: 'soliloquy', definition: 'A speech delivered alone on stage that grants the audience access to a character\'s interior thought.', usage_in_analysis: 'Soliloquies in Hamlet are sites of philosophical analysis that perform delay. In Duchess they are rare; the play foregrounds dialogue and surveillance.', ao_relevance: ['AO2'], target_level: 'A' },
  { text_id: null, term: 'aside', definition: 'A brief remark addressed to the audience, unheard by other characters on stage.', usage_in_analysis: 'Bosola\'s asides establish him as the play\'s diagnostician of corruption. Claudius\'s aside in 3.1 is his only moment of involuntary self-knowledge.', ao_relevance: ['AO2'], target_level: 'A' },
  { text_id: null, term: 'dramatic irony', definition: 'A situation in which the audience knows more than one or more characters on stage.', usage_in_analysis: 'In the prayer scene (3.3), the audience hears Claudius\'s prayer fail before Hamlet refuses to kill him — a dramatic irony that exposes Hamlet\'s scruple as based on a false premise.', ao_relevance: ['AO2'], target_level: 'A' },
  { text_id: null, term: 'objective correlative', definition: "T.S. Eliot's term for the external situation that adequately corresponds to (and produces) a particular emotion in the audience.", usage_in_analysis: 'Eliot complains that Hamlet\'s emotion exceeds its objective correlative; A* essays often argue this disproportion is the play\'s achievement, not its flaw.', ao_relevance: ['AO5'], target_level: 'A_STAR', theme_codes: ['HAM_T11'] },
  { text_id: null, term: 'memento mori', definition: 'Latin "remember you must die"; an artistic or philosophical reminder of mortality.', usage_in_analysis: 'Yorick\'s skull (5.1) and the wax-figure tableau (4.1) operate as memento mori — material reductions of the human to the corpse.', ao_relevance: ['AO2', 'AO3'], target_level: 'A', theme_codes: ['HAM_T05', 'MAL_T08'] },
  { text_id: null, term: 'metatheatricality', definition: "A play's awareness of itself as performance.", usage_in_analysis: 'The Mousetrap (3.2) and Hamlet\'s instruction "to hold the mirror up to nature" (3.2) are metatheatrical interventions that comment on the play\'s own form.', ao_relevance: ['AO2'], target_level: 'A_STAR', theme_codes: ['HAM_T06'] },
  { text_id: null, term: 'antic disposition', definition: "Hamlet's deliberately assumed madness, declared at 1.5.", usage_in_analysis: 'A* readings examine whether the antic disposition remains a mask or destabilises the boundary between performance and reality.', ao_relevance: ['AO2', 'AO5'], target_level: 'A', theme_codes: ['HAM_T02', 'HAM_T06'] },

  // ── Contextual abstractions ───────────────────────────────────────────────
  { text_id: null, term: 'body politic', definition: 'The metaphor of the state as an organic body with the monarch as its head.', usage_in_analysis: '"Something is rotten in the state of Denmark" (1.4) literalises the body-politic metaphor: corruption at the head infects the whole.', ao_relevance: ['AO1', 'AO3'], target_level: 'A', theme_codes: ['HAM_T04', 'HAM_T07', 'MAL_T01'] },
  { text_id: null, term: 'malcontent', definition: 'Jacobean stage type: educated, marginalised figure who articulates moral critique while becoming complicit in the corruption he diagnoses.', usage_in_analysis: 'Bosola is the play\'s most fully realised malcontent — his asides are diagnostically accurate while his conduct enacts the predation he condemns.', ao_relevance: ['AO3'], target_level: 'A_STAR', theme_codes: ['MAL_T09'] },
  { text_id: null, term: 'revenge tragedy', definition: 'A genre formalised by Kyd (Spanish Tragedy) and developed through Hamlet, The Revenger\'s Tragedy, The Duchess of Malfi: ghost, command, delay, mousetrap, catastrophe.', usage_in_analysis: 'Hamlet both honours and resists revenge-tragedy convention; the "delay" is the mechanism by which the play interrogates the form.', ao_relevance: ['AO3'], target_level: 'A' },
  { text_id: null, term: 'Oedipus complex', definition: "Freudian construct: the unconscious desire to displace the father and possess the mother.", usage_in_analysis: 'Jones\'s reading uses the Oedipus complex to explain the closet scene\'s intensity and Hamlet\'s revulsion at Gertrude\'s remarriage.', ao_relevance: ['AO5'], target_level: 'A_STAR', theme_codes: ['HAM_T01', 'HAM_T08'] },
  { text_id: null, term: 'tragic hamartia', definition: 'Aristotle\'s term for the protagonist\'s tragic error or flaw.', usage_in_analysis: 'A* essays typically resist a single hamartia reading of Hamlet, arguing that delay is structural rather than personal.', ao_relevance: ['AO3'], target_level: 'A_STAR' },
  { text_id: null, term: 'humoral theory', definition: 'Galenic medicine: mood and behaviour governed by the four humours; melancholy linked to scholarly intellect.', usage_in_analysis: 'Hamlet\'s melancholy and Ophelia\'s "hysteria" both register as recognisable humoral pathologies for the original audience.', ao_relevance: ['AO3'], target_level: 'A', theme_codes: ['HAM_T02'] },
  { text_id: null, term: 'apatheia', definition: 'Stoic ideal: freedom from destructive passion.', usage_in_analysis: 'Horatio embodies apatheia — Hamlet praises him as "not passion\'s slave" (3.2).', ao_relevance: ['AO3'], target_level: 'A_STAR' },
  { text_id: null, term: 'liminality', definition: 'Existence on a threshold between two states.', usage_in_analysis: 'The Ghost is liminal: between life and death, Catholic Purgatory and Protestant denial, paternal authority and supernatural intrusion.', ao_relevance: ['AO3'], target_level: 'A_STAR', theme_codes: ['HAM_T05', 'HAM_T09'] },
  { text_id: null, term: 'patriarchy', definition: 'Social system in which authority and inheritance run through the male line.', usage_in_analysis: '"Patriarchy" should always be paired with a specific mechanism (surveillance, marriage law, household authority) — never used as a stand-alone label.', ao_relevance: ['AO3'], target_level: 'A', theme_codes: ['HAM_T08', 'MAL_T02', 'MAL_T06'] },
  { text_id: null, term: 'bloodline anxiety', definition: 'Jacobean preoccupation with aristocratic lineage purity, threatened by misalliance.', usage_in_analysis: "Ferdinand's rage at the Duchess's match with Antonio crystallises Jacobean bloodline anxiety into pathological violence.", ao_relevance: ['AO3'], target_level: 'A_STAR', theme_codes: ['MAL_T02', 'MAL_T05'] },
]

section('11 — Vocabulary terms')
let count = 0
for (const v of vocabulary) {
  // Schema unique constraint: (text_id, term). For NULL text_id, NULLs are distinct so we manually dedupe.
  let existingId: string | null = null
  if (v.text_id === null) {
    const { data } = await supabase.from('vocabulary_terms').select('id').is('text_id', null).eq('term', v.term).maybeSingle()
    existingId = data?.id ?? null
  } else {
    const { data } = await supabase.from('vocabulary_terms').select('id').eq('text_id', v.text_id).eq('term', v.term).maybeSingle()
    existingId = data?.id ?? null
  }

  let termId: string
  if (existingId) {
    termId = existingId
    await supabase.from('vocabulary_terms').update({
      definition: v.definition, usage_in_analysis: v.usage_in_analysis,
      ao_relevance: v.ao_relevance, target_level: v.target_level,
    }).eq('id', termId)
  } else {
    const { data, error } = await supabase
      .from('vocabulary_terms')
      .insert({ text_id: v.text_id, term: v.term, definition: v.definition, usage_in_analysis: v.usage_in_analysis, ao_relevance: v.ao_relevance, target_level: v.target_level })
      .select('id').single()
    if (error || !data) { err(`Vocab ${v.term}: ${error?.message}`); continue }
    termId = data.id
  }
  count++

  // Theme links
  if (v.theme_codes && v.theme_codes.length > 0) {
    await supabase.from('vocabulary_theme_links').delete().eq('term_id', termId)
    for (const code of v.theme_codes) {
      const { data: theme } = await supabase.from('themes').select('id').eq('theme_code', code).maybeSingle()
      if (!theme) continue
      await supabase.from('vocabulary_theme_links').insert({ term_id: termId, theme_id: theme.id })
    }
  }
}
ok(`${count} vocabulary terms`)

console.log('\n✅  11 Vocabulary complete\n')
