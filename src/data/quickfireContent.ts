/**
 * quickfireContent — curated static data for two of the three quickfire drills.
 *
 * The Quote Attribution Flash drill pulls live from Supabase (revision_drill_questions);
 * the methods and question-decoding lists below are intentionally hand-curated so
 * Neha sees the same examples she's been working with, in priority order.
 */

import type { PlayCode } from '../types/session';

// ──────────────────────────────────────────────────────────────────────────
// AO2 Method Priming — 15 methods, each with an example quote.
// ──────────────────────────────────────────────────────────────────────────

export interface MethodCard {
  method: string;
  definition: string;
  examples: Array<{
    quote: string;
    source: string;        // e.g. "Hamlet, 1.2"
    play: PlayCode;
  }>;
}

export const AO2_METHODS: MethodCard[] = [
  {
    method: 'Apostrophe + personification',
    definition: 'Direct address to an absent or abstract entity, often personified',
    examples: [
      { quote: 'Frailty, thy name is woman.', source: 'Hamlet, 1.2', play: 'HAM' },
    ],
  },
  {
    method: 'Monosyllabic tricolon + caesurae',
    definition: 'Three short clauses, each cut by a full stop — rhetorical collapse',
    examples: [
      { quote: 'Cover her face. Mine eyes dazzle. She died young.', source: 'Ferdinand, 4.2', play: 'MAL' },
    ],
  },
  {
    method: 'Declarative name-claim + durational adverb',
    definition: 'Self-identification anchored by a word that converts identity into duration',
    examples: [
      { quote: 'I am Duchess of Malfi still.', source: 'The Duchess, 4.2', play: 'MAL' },
    ],
  },
  {
    method: 'Catholic Purgatorial diction',
    definition: 'Theological vocabulary specifying finite-term penance after death',
    examples: [
      { quote: 'Doomed for a certain term to walk the night.', source: 'Ghost, 1.5', play: 'HAM' },
    ],
  },
  {
    method: 'Mythological antithesis + idealisation',
    definition: 'Classical comparison that converts political contrast into mythic register',
    examples: [
      { quote: 'Hyperion to a satyr.', source: 'Hamlet, 1.2', play: 'HAM' },
    ],
  },
  {
    method: 'Interrogative tricolon',
    definition: 'Three escalating questions that convert encounter into interrogation',
    examples: [
      { quote: 'Were you not sent for? Is it your own inclining? Is it a free visitation?', source: 'Hamlet to R&G, 2.2', play: 'HAM' },
    ],
  },
  {
    method: 'Extended metaphor + anaphora',
    definition: 'A figure sustained across clauses, with repeated openings ("you would…")',
    examples: [
      { quote: 'You would seek to play upon me; you would seem to know my stops; you would pluck out the heart of my mystery.', source: 'Hamlet, 3.2', play: 'HAM' },
    ],
  },
  {
    method: 'Ironic euphemism',
    definition: 'A polite phrasing that exposes moral evasion ("make love to this employment")',
    examples: [
      { quote: 'Why, man, they did make love to this employment; they are not near my conscience.', source: 'Hamlet, 5.2', play: 'HAM' },
    ],
  },
  {
    method: 'Bald declaration + structural punchline',
    definition: 'A flat statement delivered with maximum compression for harshest effect',
    examples: [
      { quote: 'Rosencrantz and Guildenstern are dead.', source: 'English Ambassador, 5.2', play: 'HAM' },
    ],
  },
  {
    method: 'Hyperbole + metaphor of footsteps',
    definition: 'Exaggeration paired with a physical figure that converts opposition into ground',
    examples: [
      { quote: "If all my royal kindred lay in my way unto this marriage, I'd make them my low footsteps.", source: 'The Duchess, 1.2', play: 'MAL' },
    ],
  },
  {
    method: 'Pastoral imagery + inverted comparison',
    definition: 'Nature imagery used to put the natural state above the civilised one',
    examples: [
      { quote: "The birds that live i'th' field on the wild benefit of nature live happier than we, for they may choose their mates.", source: 'The Duchess, 3.5', play: 'MAL' },
    ],
  },
  {
    method: 'Sleeping/waking metaphor + reflexive',
    definition: 'A figure of consciousness directed inward, turning the cynic against himself',
    examples: [
      { quote: 'I am angry with myself, now that I wake.', source: 'Bosola, 4.2', play: 'MAL' },
    ],
  },
  {
    method: 'Anaphora + cosmic hyperbole',
    definition: 'Repetition that builds toward an image of cosmic scale',
    examples: [
      { quote: 'Pull, and pull strongly, for your able strength must pull down heaven upon me.', source: 'The Duchess, 4.2', play: 'MAL' },
    ],
  },
  {
    method: 'Cosmic simile + fatalist syntax',
    definition: 'Comparison to celestial mechanics that strips humans of agency',
    examples: [
      { quote: "We are merely the stars' tennis-balls, struck and bandied which way please them.", source: 'Bosola, 5.4', play: 'MAL' },
    ],
  },
  {
    method: 'Imperative + cosmetic metaphor',
    definition: 'Command paired with a figure that exposes honour as surface application',
    examples: [
      { quote: 'Off, my painted honour!', source: 'Bosola, 4.2', play: 'MAL' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Question Decoding — past Edexcel questions with model decoding.
// Per question: focus word + which pairings best illustrate + a model thesis.
// ──────────────────────────────────────────────────────────────────────────

export interface QuestionDecode {
  id: string;
  play: PlayCode;
  year: number;
  question: string;
  focusWord: string;
  focusOptions: string[];                 // including the right one
  illustratingPairings: string[];         // e.g. ['ham-gh', 'ham-og']
  modelThesis: string;                    // a Level-5 thesis using the focus word precisely
  decodingNote: string;                   // why the focus word + pairings work
}

export const QUESTION_DECODES: QuestionDecode[] = [
  {
    id: 'ham-2023-action',
    play: 'HAM',
    year: 2023,
    question: 'Explore the significance of action and inaction in Hamlet.',
    focusWord: 'action and inaction',
    focusOptions: ['action', 'inaction', 'action and inaction', 'delay'],
    illustratingPairings: ['ham-og', 'ham-rg'],
    modelThesis: "Shakespeare frames action and inaction not as opposites but as the same dramatic problem viewed from inside two incompatible theological frameworks — so that Hamlet's <em>inaction</em> is, paradoxically, the most responsible <em>action</em> the play permits.",
    decodingNote: "The focus is the *pairing* of action and inaction — not one or the other. Reductive readings that treat Hamlet as simply 'indecisive' miss the AO5 weave (Greenblatt/Prosser) that frames hesitation as theologically rational.",
  },
  {
    id: 'ham-2022-fatherson',
    play: 'HAM',
    year: 2022,
    question: 'Explore the significance of the father-son relationship in Hamlet.',
    focusWord: 'father-son relationship',
    focusOptions: ['father', 'son', 'father-son relationship', 'family'],
    illustratingPairings: ['ham-og', 'ham-gh'],
    modelThesis: "Shakespeare makes the father–son relationship the play's <em>structural ghost</em>: Hamlet is asked to act on a paternal command issued by a figure whose ontological and theological status cannot be verified — so that filial duty becomes the engine of, rather than the solution to, the tragedy.",
    decodingNote: "'Father-son' is the precise phrase — not just 'family'. The Ghost × Old Hamlet pairing is the obvious anchor; Gertrude × Horatio supplies the secondary structure of substitute-fatherhood claims.",
  },
  {
    id: 'ham-2021-loyalty',
    play: 'HAM',
    year: 2021,
    question: 'Explore the significance of loyalty and betrayal in Hamlet.',
    focusWord: 'loyalty and betrayal',
    focusOptions: ['loyalty', 'betrayal', 'loyalty and betrayal', 'friendship'],
    illustratingPairings: ['ham-gh', 'ham-rg'],
    modelThesis: "Shakespeare stages loyalty and betrayal as <em>structural opposites embedded in the same characters</em> — so that Horatio's fidelity and R&G's compliance emerge from indistinguishable courtly registers, and the play's bleakest insight is that the line between the two is determined less by intention than by political circumstance.",
    decodingNote: "Both terms matter — answers that pivot only on betrayal miss the contrast. Horatio and R&G are the structural pair; the dialectic is Dollimore on surveillance vs Neill on theatricalised loyalty.",
  },
  {
    id: 'mal-2024-suffering',
    play: 'MAL',
    year: 2024,
    question: 'Explore the significance of suffering in The Duchess of Malfi.',
    focusWord: 'suffering',
    focusOptions: ['pain', 'suffering', 'death', 'persecution'],
    illustratingPairings: ['mal-bd', 'mal-fc'],
    modelThesis: "Webster presents suffering not as something inflicted on the Duchess but as something she <em>actively transforms</em> — the masque of madmen, designed to break her, becomes the moral demonstration that breaks her killer, so that the play stages suffering as a paradoxical instrument of agency.",
    decodingNote: "The Bosola × Duchess pairing is the centre — 4.2 is the play's suffering-set-piece. Ferdinand × Cardinal supplies the *causes* of suffering. Section B is AO1+2+3 only — no critic weave.",
  },
  {
    id: 'mal-2023-religion',
    play: 'MAL',
    year: 2023,
    question: 'Explore the significance of religion and morality in The Duchess of Malfi.',
    focusWord: 'religion and morality',
    focusOptions: ['religion', 'morality', 'religion and morality', 'faith'],
    illustratingPairings: ['mal-fc', 'mal-bd'],
    modelThesis: "Webster separates religion from morality so completely that the play's most sustained moral consciousness develops in <em>Bosola</em> — a malcontent hireling — while the Cardinal's ecclesiastical office provides only the operational cover for institutional villainy.",
    decodingNote: "The trick word here is 'and' — the question asks how the two relate. The Cardinal is religion-without-morality; Bosola becomes morality-without-religion. That inversion is the AO1 sophistication.",
  },
];
