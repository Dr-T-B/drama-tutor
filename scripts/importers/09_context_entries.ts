import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

// Curated standalone context entries used across multiple themes/quotes.
// Per-quote AO3 notes are already in quote_ao_links.note; this table holds
// the high-value contextual pillars that inform multiple analyses.

type CtxRec = {
  text_id: string | null
  context_code: string
  context_type: string
  title: string
  explanation: string
  exam_trigger: string | null
  danger_of_overuse: string | null
}

const entries: CtxRec[] = [
  // ─── Hamlet contexts ─────────────────────────────────────────────────────────
  { text_id: hamRow.id, context_code: 'HAM_CTX_REFORMATION_PURGATORY', context_type: 'religious',
    title: 'Reformation theology and the Ghost',
    explanation: 'The Protestant Reformation officially abolished the Catholic doctrine of Purgatory, yet the Ghost in Hamlet appears to come from precisely such a place — "Doomed for a certain term to walk the night, / And for the day confined to fast in fires" (1.5). The play stages a theological dissonance: the Ghost\'s authority depends on a doctrine its Protestant audience was officially required to reject. This unresolved tension is the play\'s engine for Hamlet\'s delay and the moral uncertainty around the revenge command.',
    exam_trigger: 'Use when discussing the Ghost, Hamlet\'s delay, the prayer scene, or the play\'s theology of conscience. Greenblatt unlocks this directly.',
    danger_of_overuse: 'Do not just label the Ghost "Catholic" — show how the theological context generates the dramatic problem.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_ELIZABETHAN_REVENGE', context_type: 'literary',
    title: 'Elizabethan revenge tragedy conventions',
    explanation: 'Hamlet sits within a popular genre with established conventions: a ghost commanding revenge, a delaying revenger, a play-within-a-play, madness (real or feigned), and a catastrophic finale. Kyd\'s The Spanish Tragedy (c. 1587) is the genre\'s template. Shakespeare both honours and interrogates the form, particularly through Hamlet\'s philosophical resistance to the swift action the genre demands.',
    exam_trigger: 'Use when discussing structure, the Ghost\'s command, the Mousetrap, or the final catastrophe.',
    danger_of_overuse: 'Genre context becomes wallpaper if not connected to a specific moment — show what Shakespeare does *with* the convention.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_HUMORAL_MELANCHOLY', context_type: 'historical',
    title: 'Galenic humoral theory and melancholy',
    explanation: 'Early modern medicine, derived from Galen, understood mood as governed by four humours. Excess black bile produced melancholy — associated with scholars, intellectuals, and brooding contemplation. "The scholar\'s disease" had specific gendered and class associations and was a recognised pathology, not merely a metaphor.',
    exam_trigger: 'Use when discussing Hamlet\'s temperament, the "antic disposition", or Ophelia\'s madness.',
    danger_of_overuse: 'Don\'t reduce Hamlet to a humoral diagnosis — use it to enrich, not replace, conceptual analysis.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_BODY_POLITIC', context_type: 'political',
    title: 'The body politic metaphor',
    explanation: 'Renaissance political thought conceived the state as an organic body with the monarch as its head. Corruption at the head — fratricide, usurpation — was understood to infect the entire commonwealth. Shakespeare\'s "rotten" Denmark literalises this metaphor: political disorder manifests as physical disease.',
    exam_trigger: 'Use with disease imagery, the "rotten state" line, the "unweeded garden", or any political-corruption analysis.',
    danger_of_overuse: 'Avoid name-dropping "body politic" as decoration — quote a specific image and tie it to the doctrine.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_ELIZABETHAN_SURVEILLANCE', context_type: 'political',
    title: 'Elizabethan intelligence networks',
    explanation: 'The Elizabethan state under Walsingham developed an extensive apparatus of informers, intercepted letters, and political surveillance. Polonius\'s deployment of Reynaldo (2.1) and the Rosencrantz/Guildenstern errand (2.2) would have been immediately recognisable as the routine machinery of state intelligence, not eccentric villainy.',
    exam_trigger: 'Use with surveillance scenes, Polonius, eavesdropping, the nunnery scene, the closet scene.',
    danger_of_overuse: 'Don\'t list Elizabethan facts — show how surveillance shapes the play\'s dramatic possibilities.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_CHAIN_OF_BEING', context_type: 'philosophical',
    title: 'The Elizabethan Chain of Being',
    explanation: 'Tillyard\'s influential reading of Elizabethan cosmology positioned every entity in a hierarchical order — divine, royal, noble, common, animal — with disturbance at one level rippling through the whole. Hamlet\'s "time is out of joint" articulates not personal grievance but cosmic disorder.',
    exam_trigger: 'Use with "time is out of joint", the cosmic disorder of Denmark, the implications of regicide.',
    danger_of_overuse: 'Tillyard\'s framework is now critically contested; deploy as the play\'s contemporary worldview, not as historical fact.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_HUMANIST_IDEAL', context_type: 'philosophical',
    title: 'Renaissance humanism and the universal man',
    explanation: 'The humanist ideal of the uomo universale — the courtier, soldier, scholar synthesised in one figure — was canonised by Castiglione. Hamlet possesses every component of the ideal ("The courtier\'s, soldier\'s, scholar\'s eye, tongue, sword", 3.1) but the play tests whether completeness of understanding produces capacity for action.',
    exam_trigger: 'Use with Hamlet\'s self-presentation, the contrast with Fortinbras, the "rogue and peasant slave" soliloquy.',
    danger_of_overuse: 'Don\'t simply label Hamlet "humanist"; show what the play does to the ideal.' },
  { text_id: hamRow.id, context_code: 'HAM_CTX_FEMALE_CHASTITY', context_type: 'social',
    title: 'Early modern female chastity and remarriage',
    explanation: 'Conduct books and sermons constructed female virtue almost entirely in terms of chastity and submission. Widow remarriage to a brother-in-law violated affinity laws (those very laws had been central to Henry VIII\'s break with Rome). Gertrude\'s "o\'er-hasty marriage" thus carried specifically English political resonance, not merely personal scandal.',
    exam_trigger: 'Use with Gertrude\'s remarriage, Hamlet\'s revulsion, the closet scene, the "incest" charge.',
    danger_of_overuse: 'Tie the legal/cultural fact to a quoted image; otherwise it stays as background.' },

  // ─── Duchess of Malfi contexts ───────────────────────────────────────────────
  { text_id: malRow.id, context_code: 'MAL_CTX_JACOBEAN_PATRONAGE', context_type: 'historical',
    title: 'Jacobean court patronage and surveillance',
    explanation: 'Jacobean court life ran on patronage networks, intelligence-gathering, and the calibrated exchange of favour. Bosola\'s installation as "intelligencer" (1.1) is a precise dramatisation of this system. Sir Robert Cecil\'s spy apparatus under James I made surveillance a routine instrument of aristocratic power.',
    exam_trigger: 'Use with Bosola\'s commissioning, the apricot scene, the bedchamber invasion.',
    danger_of_overuse: 'Don\'t catalogue Jacobean facts — show how the play converts a routine system into dramatic horror.' },
  { text_id: malRow.id, context_code: 'MAL_CTX_ANTI_CATHOLIC', context_type: 'religious',
    title: 'Jacobean anti-Catholic discourse',
    explanation: 'Webster\'s Italian Catholic court would have registered for a Jacobean Protestant audience as foreign, decadent, and dangerous. The Cardinal\'s combination of clerical office and political/sexual corruption activates anti-Catholic stereotypes about the Italian church as a site of conspiracy and hypocrisy.',
    exam_trigger: 'Use with the Cardinal, Julia\'s death, the play\'s pervasive religious-language-as-cover-for-vice.',
    danger_of_overuse: 'The play also stages real moral horror — don\'t reduce all corruption to anti-Catholic prejudice.' },
  { text_id: malRow.id, context_code: 'MAL_CTX_WIDOW_LEGAL_STATUS', context_type: 'social',
    title: 'Widow\'s legal status in Jacobean England',
    explanation: 'Jacobean widows possessed legal autonomy unavailable to wives or unmarried women — they could own property, manage estates, and choose new partners. This legal freedom existed within a culture that viewed independent female desire with suspicion. The Duchess\'s remarriage is legally permissible but socially transgressive.',
    exam_trigger: 'Use with the wooing scene (1.1), "we are forced to woo", the secret marriage.',
    danger_of_overuse: 'Don\'t state the legal fact then leave it — show how the gap between legal right and social punishment generates the play\'s tragedy.' },
  { text_id: malRow.id, context_code: 'MAL_CTX_ARISTOCRATIC_BLOODLINE', context_type: 'social',
    title: 'Aristocratic bloodline anxiety',
    explanation: 'Jacobean society organised inheritance, title, and political legitimacy around bloodline purity. Marriage across rank threatened the entire system. Ferdinand\'s rage at the Duchess\'s match with her steward registers not personal eccentricity but systemic anxiety about social hierarchy.',
    exam_trigger: 'Use with Ferdinand\'s violence, the "bulrush" speech, the secret marriage, the strangling.',
    danger_of_overuse: 'Connect the cultural anxiety to a specific quoted moment — vague references to "Jacobean society" produce empty paragraphs.' },
  { text_id: malRow.id, context_code: 'MAL_CTX_REVENGE_TRAGEDY', context_type: 'literary',
    title: 'Jacobean revenge tragedy and the malcontent',
    explanation: 'The Jacobean stage developed the revenge tragedy further than the Elizabethans — Tourneur\'s The Revenger\'s Tragedy, Marston\'s The Malcontent, Webster\'s own The White Devil. The malcontent figure (Bosola) is a recognisable type: educated, marginalised, morally articulate, complicit in the corruption he despises.',
    exam_trigger: 'Use with Bosola, his asides, the "horse-leech" speech, his trajectory from spy to (anti-)avenger.',
    danger_of_overuse: 'Don\'t treat Bosola as a generic type — show what Webster does to refuse the malcontent\'s usual moral satisfactions.' },
  { text_id: malRow.id, context_code: 'MAL_CTX_HUMORAL_BODILY_LEGIBILITY', context_type: 'historical',
    title: 'Humoral medicine and the legible body',
    explanation: 'The Jacobean stage assumed that concealed sin would inevitably manifest physically; humoral medicine held that the body could not sustain deception. Bosola\'s apricot test (2.1) operationalises this assumption: the Duchess\'s pregnancy is exposed because the body cannot lie.',
    exam_trigger: 'Use with the apricot scene, the broader logic of surveillance, Ferdinand\'s "bestial" demand to "see" his sister.',
    danger_of_overuse: 'Mention humoral theory once, with a quote — repeated mentions become a tic.' },
  { text_id: null, context_code: 'GEN_CTX_BODY_POLITIC', context_type: 'political',
    title: 'The body politic — both texts',
    explanation: 'The metaphor of the state as an organic body, with the monarch/ruler as its head, runs through both plays. In Hamlet the metaphor is explicit ("rotten in the state"); in The Duchess of Malfi Antonio\'s opening fountain speech ("if\'t chance / Some cursed example poison\'t near the head") makes systemic corruption a structural diagnosis.',
    exam_trigger: 'Use when comparing political-corruption motifs across both texts (in Section A only — comparison is forbidden in Section B).',
    danger_of_overuse: 'AO4 is not assessed in Component 1; do not import comparison into Section B essays.' },
  { text_id: null, context_code: 'GEN_CTX_MEMENTO_MORI', context_type: 'philosophical',
    title: 'Memento mori and tragic mortality',
    explanation: 'Both plays sustain an explicit memento mori tradition: Hamlet\'s "Alexander died… returneth to dust" and the Duchess\'s wax-figure tableau both stage the reduction of greatness to material death. The skull, the dead hand, the strangling cord — material reminders of mortality structure the tragic vision of both texts.',
    exam_trigger: 'Use in Hamlet (graveyard), in the Duchess (4.1, 4.2), or in any thematic discussion of death and the body.',
    danger_of_overuse: 'Mention memento mori once with a specific image — don\'t turn the term into a label.' },
]

section('09 — Context entries')
for (const e of entries) {
  // For null text_id, our unique constraint is (text_id, context_code) with NULLS NOT DISTINCT? No — schema unique is (text_id, context_code) — Postgres treats nulls as distinct by default, so null+null aren't equal. We use select-then-upsert manually.
  const q = supabase.from('context_entries').select('id').eq('context_code', e.context_code)
  const { data: existing } = e.text_id
    ? await q.eq('text_id', e.text_id).maybeSingle()
    : await q.is('text_id', null).maybeSingle()

  if (existing) {
    const { error } = await supabase.from('context_entries').update({
      context_type: e.context_type, title: e.title, explanation: e.explanation,
      exam_trigger: e.exam_trigger, danger_of_overuse: e.danger_of_overuse,
    }).eq('id', existing.id)
    if (error) err(`Ctx ${e.context_code}: ${error.message}`)
    else ok(`Ctx ${e.context_code} (updated)`)
  } else {
    const { error } = await supabase.from('context_entries').insert(e)
    if (error) err(`Ctx ${e.context_code}: ${error.message}`)
    else ok(`Ctx ${e.context_code}`)
  }
}

console.log('\n✅  09 Context entries complete\n')
