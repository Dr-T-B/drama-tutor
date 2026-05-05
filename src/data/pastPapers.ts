import type { PlayFilter } from '../types/database'

export type Play = PlayFilter

export interface PastPaperQuestion {
  id: string
  year: number
  play: Play
  section: 'A' | 'B'
  option: 'EITHER' | 'OR'
  question: string
  totalMarks: 35 | 25
  aos: string[]
  aoWeightings: Record<string, number>
  themes: string[]
}

export interface ThemeQuote {
  text: string
  speaker: string
  act: string
  scene: string
  significance: string
}

export interface ThemeQuoteBank {
  theme: string
  plays: Play[]
  quotes: ThemeQuote[]
}

const HAMLET_AO_WEIGHTS: Record<string, number> = {
  AO1: 12, AO2: 12, AO3: 6, AO5: 5
}
const MALFI_AO_WEIGHTS: Record<string, number> = {
  AO1: 8, AO2: 8, AO3: 6, AO4: 3
}

export const pastPaperQuestions: PastPaperQuestion[] = [

  // 2017
  { id: 'ham-2017-a', year: 2017, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents suffering in Hamlet.',
    themes: ['suffering','grief','mortality'] },
  { id: 'ham-2017-b', year: 2017, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare makes use of the play within the play in Hamlet.',
    themes: ['theatricality','deception','performance','revenge'] },
  { id: 'mal-2017-a', year: 2017, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of a corrupted court in The Duchess of Malfi.",
    themes: ['corruption','power','court','ambition'] },
  { id: 'mal-2017-b', year: 2017, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster creates uncertainty in The Duchess of Malfi.',
    themes: ['uncertainty','secrets','deception','identity'] },

  // 2018
  { id: 'ham-2018-a', year: 2018, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents uncertainty in Hamlet.',
    themes: ['uncertainty','doubt','deception','performance'] },
  { id: 'ham-2018-b', year: 2018, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents Ophelia in Hamlet.',
    themes: ['ophelia','gender','madness','patriarchy'] },
  { id: 'mal-2018-a', year: 2018, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of family relationships in The Duchess of Malfi.",
    themes: ['family','power','gender','control'] },
  { id: 'mal-2018-b', year: 2018, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster makes use of reputation in The Duchess of Malfi.',
    themes: ['reputation','honour','gender','society'] },

  // 2019
  { id: 'ham-2019-a', year: 2019, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents the theme of deception in Hamlet.',
    themes: ['deception','performance','theatricality','corruption'] },
  { id: 'ham-2019-b', year: 2019, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents the relationship between Hamlet and Gertrude in Hamlet.',
    themes: ['relationships','gender','sexuality','corruption'] },
  { id: 'mal-2019-a', year: 2019, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of religion in The Duchess of Malfi.",
    themes: ['religion','morality','corruption','death'] },
  { id: 'mal-2019-b', year: 2019, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of the theme of excess in The Duchess of Malfi.",
    themes: ['excess','violence','death','power'] },

  // 2021
  { id: 'ham-2021-a', year: 2021, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare makes use of acting and the theatre in Hamlet.',
    themes: ['theatricality','performance','deception','metatheatre'] },
  { id: 'ham-2021-b', year: 2021, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore Shakespeare's presentation of Polonius in Hamlet.",
    themes: ['polonius','supporting characters','deception','patriarchy'] },
  { id: 'mal-2021-a', year: 2021, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore Webster\'s presentation of the relationship between the Duchess and Bosola in The Duchess of Malfi.',
    themes: ['bosola','duchess','power','surveillance','identity'] },
  { id: 'mal-2021-b', year: 2021, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster presents death in The Duchess of Malfi.',
    themes: ['death','violence','excess','mortality','revenge tragedy'] },

  // 2022
  { id: 'ham-2022-a', year: 2022, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents heroism in Hamlet.',
    themes: ['heroism','suffering','honour','mortality'] },
  { id: 'ham-2022-b', year: 2022, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare makes use of settings in Hamlet.',
    themes: ['setting','corruption','entrapment','mortality'] },
  { id: 'mal-2022-a', year: 2022, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's use of imagery and symbolism in The Duchess of Malfi.",
    themes: ['imagery','symbolism','death','gender','revenge tragedy'] },
  { id: 'mal-2022-b', year: 2022, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster makes use of features of revenge tragedy in The Duchess of Malfi.',
    themes: ['revenge tragedy','genre','death','violence','corruption'] },

  // 2023
  { id: 'ham-2023-a', year: 2023, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore Shakespeare's presentation of grief in Hamlet.",
    themes: ['grief','suffering','mortality','madness'] },
  { id: 'ham-2023-b', year: 2023, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore Shakespeare's presentation of Laertes in Hamlet.",
    themes: ['laertes','supporting characters','revenge','honour','foil'] },
  { id: 'mal-2023-a', year: 2023, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster makes use of secrets and lies in The Duchess of Malfi.',
    themes: ['secrets','deception','uncertainty','surveillance','identity'] },
  { id: 'mal-2023-b', year: 2023, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of gender roles in The Duchess of Malfi.",
    themes: ['gender','patriarchy','power','identity','duchess'] },

  // 2024
  { id: 'ham-2024-a', year: 2024, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents the relationship between Hamlet and Ophelia in Hamlet.',
    themes: ['ophelia','relationships','gender','madness','patriarchy'] },
  { id: 'ham-2024-b', year: 2024, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore the extent to which Shakespeare's Hamlet is a play full of doubt and confusion.",
    themes: ['uncertainty','doubt','deception','mortality','madness'] },
  { id: 'mal-2024-a', year: 2024, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore the extent to which Webster presents The Duchess of Malfi as a critique of contemporary society.',
    themes: ['society','corruption','power','gender','court'] },
  { id: 'mal-2024-b', year: 2024, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3','AO4'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore the presentation of Ferdinand in Webster's The Duchess of Malfi.",
    themes: ['ferdinand','power','gender','madness','violence','control'] },
]

export interface ThemeFrequency {
  theme: string
  play: Play
  count: number
  years: number[]
}

export function getThemeFrequencies(play: Play): ThemeFrequency[] {
  const map = new Map<string, { count: number; years: Set<number> }>()
  pastPaperQuestions
    .filter(q => q.play === play)
    .forEach(q => {
      q.themes.forEach(t => {
        if (!map.has(t)) map.set(t, { count: 0, years: new Set() })
        const entry = map.get(t)!
        entry.count += 1
        entry.years.add(q.year)
      })
    })
  return Array.from(map.entries())
    .map(([theme, { count, years }]) => ({
      theme, play, count,
      years: Array.from(years).sort()
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
}

export const themeQuoteBanks: ThemeQuoteBank[] = [
  {
    theme: 'uncertainty', plays: ['HAM'],
    quotes: [
      { text: 'The time is out of joint. O cursèd spite / That ever I was born to set it right.',
        speaker: 'Hamlet', act: '1', scene: '5',
        significance: "Establishes Hamlet's awareness of disorder and his paralysing burden; the enjambment enacts hesitation." },
      { text: 'To be or not to be, that is the question.',
        speaker: 'Hamlet', act: '3', scene: '1',
        significance: "The play's central epistemological crisis: existence, action, and certainty all suspended in a single unanswerable question." },
      { text: 'I know not "seems".',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: "Hamlet's refusal of performance inverts the court's culture of surfaces — yet his own subsequent play-acting complicates this claim." },
      { text: "Denmark's a prison.",
        speaker: 'Hamlet', act: '2', scene: '2',
        significance: 'The spatial metaphor of confinement underpins the atmosphere of surveillance and inescapable uncertainty.' },
    ]
  },
  {
    theme: 'ophelia', plays: ['HAM'],
    quotes: [
      { text: 'Get thee to a nunnery.',
        speaker: 'Hamlet', act: '3', scene: '1',
        significance: "The pun on 'nunnery' (brothel in Elizabethan slang) collapses Ophelia's purity and corruption simultaneously; Hamlet weaponises her body." },
      { text: "O what a noble mind is here o'erthrown!",
        speaker: 'Ophelia', act: '3', scene: '1',
        significance: "Her lament for Hamlet's apparent madness is also her most lucid moment — she becomes the play's clearest moral voice before her own breakdown." },
      { text: "There's rosemary, that's for remembrance.",
        speaker: 'Ophelia', act: '4', scene: '5',
        significance: 'The flower distribution scene deploys symbolic language as the only discourse available to a silenced woman; grief becomes performance.' },
      { text: 'Her clothes spread wide, and mermaid-like awhile they bore her up.',
        speaker: 'Gertrude', act: '4', scene: '7',
        significance: "Gertrude's aestheticised account of Ophelia's death denies the audience direct witness — Ophelia is mediated, gazed upon, never spoken for." },
    ]
  },
  {
    theme: 'theatricality', plays: ['HAM'],
    quotes: [
      { text: "The play's the thing / Wherein I'll catch the conscience of the king.",
        speaker: 'Hamlet', act: '2', scene: '2',
        significance: 'Metatheatrical pivot: Hamlet deploys theatre as an epistemological instrument, implicating the audience in acts of watching and judging.' },
      { text: 'Suit the action to the word, the word to the action.',
        speaker: 'Hamlet', act: '3', scene: '2',
        significance: "The Players' advice ironises Hamlet's own inability to align word and action throughout the play." },
      { text: 'I must be cruel only to be kind.',
        speaker: 'Hamlet', act: '3', scene: '4',
        significance: "The oxymoron signals that Hamlet's self-awareness of his own performance does not diminish its damage." },
      { text: 'One may smile, and smile, and be a villain.',
        speaker: 'Hamlet', act: '1', scene: '5',
        significance: "Diagnoses Claudius's courtly performance and establishes the play's central distrust of surfaces over substance." },
    ]
  },
  {
    theme: 'grief', plays: ['HAM'],
    quotes: [
      { text: 'O that this too too solid flesh would melt.',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: "The dissolution fantasy reveals grief as a desire for self-erasure; the variant 'sallied' (sullied) adds contamination not just sorrow." },
      { text: 'How weary, stale, flat, and unprofitable / Seem to me all the uses of this world.',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: 'The accumulation of four adjectives enacts the exhausting weight of grief; the world itself becomes a source of revulsion.' },
      { text: 'He was a man. Take him for all in all / I shall not look upon his like again.',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: "The spare eulogy — only 'a man' — strips grief of heroic language, making it private and therefore more acute." },
      { text: 'Good Hamlet, cast thy nighted colour off.',
        speaker: 'Gertrude', act: '1', scene: '2',
        significance: "The court's command to perform recovery reveals how grief threatens political stability; Hamlet's mourning is already transgressive." },
    ]
  },
  {
    theme: 'deception', plays: ['HAM'],
    quotes: [
      { text: 'There is something rotten in the state of Denmark.',
        speaker: 'Marcellus', act: '1', scene: '4',
        significance: 'The organic imagery of decay frames political deception as systemic corruption rather than individual villainy.' },
      { text: 'I will speak daggers to her but use none.',
        speaker: 'Hamlet', act: '3', scene: '2',
        significance: "The disjunction between word and action is constitutive of Hamlet's character — he weaponises language because he cannot use violence." },
      { text: 'A little more than kin, and less than kind.',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: "The play's first aside establishes Hamlet's relationship to performance — private truth against public surface from the opening scene." },
      { text: 'These are but the trappings and the suits of woe.',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: 'Hamlet distinguishes inner grief from external signs, but the play subsequently complicates whether this distinction is sustainable.' },
    ]
  },
  {
    theme: 'supporting characters', plays: ['HAM'],
    quotes: [
      { text: 'To thine own self be true.',
        speaker: 'Polonius', act: '1', scene: '3',
        significance: "The irony that Polonius's most famous advice is delivered by the play's arch-deceiver undermines the aphorism and satirises corrupt wisdom." },
      { text: 'Brevity is the soul of wit.',
        speaker: 'Polonius', act: '2', scene: '2',
        significance: "Self-defeating: Polonius's verbose delivery of a maxim about concision exposes him as comic — but his garrulousness causes real damage." },
      { text: 'Do not, as some ungracious pastors do, / Show me the steep and thorny way to heaven.',
        speaker: 'Ophelia', act: '1', scene: '3',
        significance: "Ophelia's sharp deflection of Laertes's moralising reveals her as a figure of more intelligence than the play subsequently allows." },
      { text: 'The readiness is all.',
        speaker: 'Hamlet', act: '5', scene: '2',
        significance: 'Positioned before the duel, this links to Laertes\'s parallel arc — both figures arriving at action from opposite directions.' },
    ]
  },
  {
    theme: 'heroism', plays: ['HAM'],
    quotes: [
      { text: 'What a piece of work is a man! How noble in reason, how infinite in faculty.',
        speaker: 'Hamlet', act: '2', scene: '2',
        significance: "The humanist celebration is immediately undercut by 'And yet to me what is this quintessence of dust?' — heroism is inseparable from disillusionment." },
      { text: 'Now cracks a noble heart. Good night, sweet prince.',
        speaker: 'Horatio', act: '5', scene: '2',
        significance: "Horatio's elegy constructs the heroic retrospectively; the audience must decide whether the play has earned this tribute." },
      { text: 'The readiness is all.',
        speaker: 'Hamlet', act: '5', scene: '2',
        significance: "Hamlet's stoic acceptance reframes passivity as heroism — critics including Adelman read this as defeat dressed as virtue." },
      { text: 'He was a man. Take him for all in all.',
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: 'The praise of his father collapses heroism into simple humanity — the standard against which all subsequent action is measured.' },
    ]
  },
  {
    theme: 'setting', plays: ['HAM'],
    quotes: [
      { text: "'Tis an unweeded garden / That grows to seed.",
        speaker: 'Hamlet', act: '1', scene: '2',
        significance: "The garden metaphor of the fallen state inverts the Edenic image; Denmark's corruption is figured as natural disorder, not human agency." },
      { text: 'This goodly frame, the earth, seems to me a sterile promontory.',
        speaker: 'Hamlet', act: '2', scene: '2',
        significance: "The physical world recoils from Hamlet's grief — setting becomes a projection of interior psychological collapse." },
      { text: "Denmark's a prison.",
        speaker: 'Hamlet', act: '2', scene: '2',
        significance: 'The compression of an entire nation into a single architectural metaphor signals suffocating entrapment.' },
      { text: 'Something is rotten in the state of Denmark.',
        speaker: 'Marcellus', act: '1', scene: '4',
        significance: 'Spoken by a minor character, not Hamlet — the observation is systemic, not personal, foregrounding the political geography of decay.' },
    ]
  },
  {
    theme: 'uncertainty', plays: ['MAL'],
    quotes: [
      { text: 'I am Duchess of Malfi still.',
        speaker: 'Duchess', act: '4', scene: '2',
        significance: "Declaration against all physical evidence of her degradation — title, identity, selfhood asserted in defiance; 'still' carries temporal and tonal weight." },
      { text: 'Cover her face. Mine eyes dazzle. She died young.',
        speaker: 'Ferdinand', act: '4', scene: '2',
        significance: "Ferdinand's fractured syntax enacts psychological rupture; the command to cover her body is simultaneously a refusal to witness and a final act of control." },
      { text: "We are merely the stars' tennis balls, struck and bandied / Which way please them.",
        speaker: 'Bosola', act: '5', scene: '4',
        significance: "The sports metaphor reduces human agency to plaything status; Bosola's belated moral clarity arrives too late to alter the tragedy." },
      { text: "Integrity of life is fame's best friend.",
        speaker: 'Delio', act: '5', scene: '5',
        significance: 'The closing couplet offers moral certainty the play has systematically dismantled — its platitudinous quality raises questions about whether Webster endorses or ironises it.' },
    ]
  },
  {
    theme: 'corruption', plays: ['MAL'],
    quotes: [
      { text: "The court is like a common fountain, whence should flow / Pure silver drops in general; but if't chance / Some cursèd example poison't near the head, / Death and diseases through the whole land spread.",
        speaker: 'Antonio', act: '1', scene: '1',
        significance: "The opening speech establishes corruption as systemic, spreading from the top down; Antonio's idealism immediately precedes the spectacle of its failure." },
      { text: "Ambition, madam, is a great man's madness.",
        speaker: 'Antonio', act: '1', scene: '1',
        significance: "The equation of ambition with madness anticipates Ferdinand's lycanthropy and the Cardinal's cold strategising — both forms of appetitive excess." },
      { text: 'The misery of us that are born great! / We are forc\'d to express our violent passions / In riddles and in dreams.',
        speaker: 'Duchess', act: '3', scene: '5',
        significance: 'The Duchess locates her suffering in the institutional constraints of rank — greatness becomes a form of imprisonment, not privilege.' },
      { text: 'In seeking to avoid ill, man may do ill.',
        speaker: 'Bosola', act: '4', scene: '2',
        significance: "Bosola's self-awareness about moral compromise is the play's most sophisticated articulation of corruption as a structural trap, not a personal failing." },
    ]
  },
  {
    theme: 'gender', plays: ['MAL'],
    quotes: [
      { text: 'Why should only I, of all the other princes of the world, / Be cased up like a holy relic?',
        speaker: 'Duchess', act: '3', scene: '2',
        significance: 'The relic simile captures how female sanctity is weaponised — she is preserved not for her own sake but for the brothers\' honour.' },
      { text: 'I am Duchess of Malfi still.',
        speaker: 'Duchess', act: '4', scene: '2',
        significance: "The insistence on title under torture redefines nobility as interior rather than institutional; gender and rank are disentangled at the moment of death." },
      { text: 'A woman who by chance hath missed / The beaten and well-trod road of the world.',
        speaker: 'Ferdinand', act: '3', scene: '2',
        significance: "Ferdinand's normalising metaphor of the 'well-trod road' reveals how female autonomy is framed as deviation rather than individuality." },
      { text: "You have bloodily approv'd the ancient truth, / That women cast their lots best by their tears.",
        speaker: 'Bosola', act: '5', scene: '5',
        significance: "Bosola's closing observation is deeply ambivalent — does Webster endorse this 'ancient truth' or expose it as the ideology that destroyed the Duchess?" },
    ]
  },
  {
    theme: 'bosola', plays: ['MAL'],
    quotes: [
      { text: 'I am your creature.',
        speaker: 'Bosola', act: '1', scene: '1',
        significance: "Encapsulates Bosola's structural position — intelligence in service of power, moral agency surrendered for patronage." },
      { text: 'Thou art a box of worm seed.',
        speaker: 'Bosola', act: '4', scene: '2',
        significance: "The contemptus mundi speech, addressed to the Duchess, performs cruelty while expressing a perverted care — Bosola's relationship to her is constitutively paradoxical." },
      { text: 'Return, fair soul, from darkness.',
        speaker: 'Bosola', act: '4', scene: '2',
        significance: "The attempted revivification marks Bosola's belated turn — too late to save, early enough to convict him of complicity." },
      { text: "We are merely the stars' tennis balls.",
        speaker: 'Bosola', act: '5', scene: '4',
        significance: "The play's most economical statement of tragic determinism; Bosola arrives at philosophical resignation at the moment of total catastrophe." },
    ]
  },
  {
    theme: 'ferdinand', plays: ['MAL'],
    quotes: [
      { text: 'I would have you give o\'er these chargeable revels.',
        speaker: 'Ferdinand', act: '1', scene: '1',
        significance: "The controlling opening instruction establishes Ferdinand's surveillance before any transgression; he polices the Duchess pre-emptively." },
      { text: 'Damn her! that body of hers.',
        speaker: 'Ferdinand', act: '2', scene: '5',
        significance: "The eruption of sexualised rage at the news of the Duchess's pregnancy signals Ferdinand's incestuous obsession; language fragments under the pressure." },
      { text: 'Cover her face. Mine eyes dazzle. She died young.',
        speaker: 'Ferdinand', act: '4', scene: '2',
        significance: 'Three utterances compressing grief, guilt, aesthetic response, and self-exculpation; the halting rhythm enacts psychological disintegration.' },
      { text: 'The wolf shall find her.',
        speaker: 'Ferdinand', act: '1', scene: '1',
        significance: "The wolf metaphor foreshadows Ferdinand's lycanthropy — his violence is coded as bestial from the outset, corrupted nature made legible through predatory imagery." },
    ]
  },
  {
    theme: 'death', plays: ['MAL'],
    quotes: [
      { text: 'I know death hath ten thousand several doors / For men to take their exits.',
        speaker: 'Duchess', act: '4', scene: '2',
        significance: 'The theatrical metaphor of exit reframes death as agency — the Duchess chooses the manner if not the moment of her death.' },
      { text: 'What would it pleasure me to have my throat cut / With diamonds?',
        speaker: 'Duchess', act: '4', scene: '2',
        significance: "The sardonic refusal of beautified suffering; the Duchess rejects the aestheticisation of her own destruction." },
      { text: "We are merely the stars' tennis balls.",
        speaker: 'Bosola', act: '5', scene: '4',
        significance: "Death in the play is not individual but systemic — Bosola's line universalises the massacre into a statement of tragic determinism." },
      { text: "Integrity of life is fame's best friend.",
        speaker: 'Delio', act: '5', scene: '5',
        significance: 'The closing moral stands in ironic relation to the deaths it follows — the play has shown integrity leading directly to annihilation.' },
    ]
  },
  {
    theme: 'revenge tragedy', plays: ['MAL'],
    quotes: [
      { text: "We are merely the stars' tennis balls.",
        speaker: 'Bosola', act: '5', scene: '4',
        significance: "Webster's most explicit statement of tragic inevitability — the revenger becomes victim, the genre's logic turns against its own instruments." },
      { text: 'I know death hath ten thousand several doors / For men to take their exits.',
        speaker: 'Duchess', act: '4', scene: '2',
        significance: "The generic expectation of a planned revenge is replaced by stoic acceptance — Webster subverts the genre's action-centred logic." },
      { text: "Integrity of life is fame's best friend.",
        speaker: 'Delio', act: '5', scene: '5',
        significance: "The conventional closing moral masks how comprehensively Webster has undermined the genre's promise that justice will be restored." },
      { text: 'The misery of us that are born great.',
        speaker: 'Duchess', act: '3', scene: '5',
        significance: 'The Duchess positions herself within a lineage of tragic nobility — the play simultaneously inhabits and critiques that generic expectation.' },
    ]
  },
  {
    theme: 'secrets', plays: ['MAL'],
    quotes: [
      { text: 'I am Duchess of Malfi still.',
        speaker: 'Duchess', act: '4', scene: '2',
        significance: "The secret marriage — the play's generative secret — is affirmed at the moment of its most extreme exposure; secrecy and identity merge." },
      { text: 'In seeking to avoid ill, man may do ill.',
        speaker: 'Bosola', act: '4', scene: '2',
        significance: "The moral paradox of Bosola's role as intelligencer: his surveillance of the Duchess's secret directly causes the catastrophe he claims to regret." },
      { text: 'Cover her face.',
        speaker: 'Ferdinand', act: '4', scene: '2',
        significance: "The physical concealment enacts the play's economy of secrets — the face that has been watched, reported on, and controlled is finally, too late, hidden." },
      { text: 'I have this night digg\'d up a mandrake.',
        speaker: 'Bosola', act: '2', scene: '1',
        significance: "The mandrake — whose root screams when unearthed — figures the extraction of the Duchess's secret pregnancy as a violent, supernatural act of revelation." },
    ]
  },
]

export function getQuotesForTheme(theme: string, play: Play): ThemeQuote[] {
  return themeQuoteBanks.find(
    b => b.theme === theme && b.plays.includes(play)
  )?.quotes ?? []
}

export function getQuestionsForPlay(play: Play): PastPaperQuestion[] {
  return pastPaperQuestions.filter(q => q.play === play)
}
