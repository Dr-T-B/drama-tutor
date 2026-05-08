import type { PlayFilter } from '../types/database'

export type Play = PlayFilter

export interface SentenceStems {
  AO1: string
  AO2: string
  AO3: string
  AO4?: string
  AO5?: string
}

export interface ParagraphTopic {
  topic: string
  ao_focus: string[]
  topic_sentence: string
}

export interface CriticPosition {
  critic: string
  position: string
  embed: string
}

export interface QuestionFramework {
  thesis: string
  paragraph_plan: ParagraphTopic[]
  sentence_stems: SentenceStems
  critic_positions: CriticPosition[]
  model_paragraph: string
}

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
  framework?: QuestionFramework
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
  AO1: 8, AO2: 8, AO3: 6
}

export const pastPaperQuestions: PastPaperQuestion[] = [

  // 2017
  { id: 'ham-2017-a', year: 2017, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents suffering in Hamlet.',
    themes: ['suffering','grief','mortality'],
    framework: {
      thesis: "Shakespeare presents suffering not as an isolated emotional state but as a structural condition of Hamlet's world — one that implicates the court, corrupts relationships, and ultimately becomes the mechanism through which the tragic vision is realised.",
      paragraph_plan: [
        { topic: "Hamlet's private suffering as philosophical crisis", ao_focus: ['AO1','AO2'], topic_sentence: "Shakespeare establishes Hamlet's suffering as an epistemological as much as an emotional condition, figured through the dissolution imagery of the first soliloquy." },
        { topic: "Suffering as political symptom", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The Ghost's revelation transforms private grief into political knowledge, implicating Denmark's suffering in Claudius's act of 'unnatural murder'." },
        { topic: "Ophelia's suffering as gendered silencing", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "Webster — and Shakespeare — locate female suffering in the structures that deny women agency; Ophelia's madness is the only discourse available to her." },
        { topic: "Critical debate: is suffering productive or paralysing?", ao_focus: ['AO5'], topic_sentence: "Critics divide on whether Hamlet's suffering generates moral insight or merely aesthetic self-indulgence — a tension the play refuses to resolve." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents suffering as inseparable from [theme] — Hamlet's condition is not merely personal but...",
        AO2: "The [technique] in '[quote]' enacts suffering through [effect], suggesting that...",
        AO3: "Within the Jacobean context of [context], suffering carries ideological weight as...",
        AO5: "Where [critic A] reads Hamlet's suffering as [position], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "A.C. Bradley", position: "Hamlet's suffering stems from a nature too refined for the brutal act revenge requires", embed: "Bradley's reading of Hamlet as possessing 'a nature whose moral sensibility is too refined' positions suffering as the cost of exceptional consciousness." },
        { critic: "Janet Adelman", position: "Hamlet's suffering is rooted in fantasies of maternal contamination — Gertrude's remarriage poisons his world", embed: "Adelman locates the origin of Hamlet's suffering in 'the rank sweat of an enseamed bed', arguing the maternal body becomes the site of universal corruption." },
        { critic: "L.C. Knights", position: "The suffering in Hamlet is real but self-perpetuating — Hamlet remains complicit in his own paralysis", embed: "Knights reads Hamlet's suffering as partly self-willed, a 'habit of mind' that transforms grief into an instrument of inaction." },
      ],
      model_paragraph: "Shakespeare presents Hamlet's suffering as a condition that exceeds individual psychology and becomes a lens through which the entire Danish court is refracted. In the first soliloquy, the accumulated weight of 'How weary, stale, flat, and unprofitable / Seem to me all the uses of this world' — four adjectives whose very proliferation enacts exhaustion — establishes suffering not as a transient emotional state but as a totalising epistemological condition: the world itself has become the source of revulsion. Bradley reads this as evidence of a 'nature whose moral sensibility is too refined' for survival in Claudius's court, positioning Hamlet's suffering as the cost of superior consciousness. Yet Adelman complicates this by locating the origin of Hamlet's crisis in maternal contamination — the imagery of ''Tis an unweeded garden / That grows to seed' figures Denmark's corruption as organic and feminine, suggesting that Hamlet's suffering is inseparable from anxieties about female sexuality that Shakespeare's Jacobean audience would have recognised as culturally pervasive. The suffering, then, is not merely Hamlet's — it is Denmark's diagnosis.",
    } },
  { id: 'ham-2017-b', year: 2017, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare makes use of the play within the play in Hamlet.',
    themes: ['theatricality','deception','performance','revenge'],
    framework: {
      thesis: "Shakespeare uses the play within the play not merely as a plot device but as the drama's central epistemological instrument — a mechanism through which the nature of truth, performance, and moral knowledge are interrogated simultaneously.",
      paragraph_plan: [
        { topic: "The Mousetrap as truth-seeking device", ao_focus: ['AO1','AO2'], topic_sentence: "Hamlet's deployment of 'The Mousetrap' positions theatre as the only reliable instrument for accessing truth in a court built on performed surfaces." },
        { topic: "Metatheatrical irony — the audience watching an audience", ao_focus: ['AO2','AO3'], topic_sentence: "Shakespeare implicates his own theatre audience in the act of surveillance, collapsing the boundary between the play's fictional watchers and the Globe's real ones." },
        { topic: "The limits of theatrical proof", ao_focus: ['AO1','AO2'], topic_sentence: "The Mousetrap's ambiguous success — Claudius rises, but guilt is not legally proven — exposes the limits of theatrical epistemology." },
        { topic: "Critical perspectives on metatheatre", ao_focus: ['AO5'], topic_sentence: "Critics debate whether the play within the play resolves or deepens the uncertainty at the heart of Hamlet." },
      ],
      sentence_stems: {
        AO1: "Shakespeare uses the play within the play to [argue/reveal/interrogate] — the device functions not merely as plot mechanism but as...",
        AO2: "The [technique] in '[quote]' positions the audience as [role], suggesting that...",
        AO3: "For a Jacobean audience familiar with [context], the theatrical self-reflexivity of the Mousetrap scene would have...",
        AO5: "While [critic A] reads the play within the play as [position], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "Anne Righter", position: "The play within the play is Shakespeare's most sustained exploration of theatre as moral mirror", embed: "Righter argues that Hamlet uses the Mousetrap to 'hold the mirror up to nature' in the most literal sense — art becomes the instrument of ethical revelation." },
        { critic: "Michael Goldman", position: "The Mousetrap exposes the instability of theatrical proof — Claudius's reaction is ambiguous and Hamlet over-reads it", embed: "Goldman's reading highlights that Hamlet's certainty after the Mousetrap is 'wildly disproportionate to the evidence', turning theatrical epistemology back on itself." },
        { critic: "Stephen Greenblatt", position: "The play within the play reflects Renaissance anxieties about the moral status of theatre itself", embed: "Greenblatt contextualises the scene within Puritan attacks on theatre, suggesting Shakespeare simultaneously defends and interrogates his own medium." },
      ],
      model_paragraph: "Shakespeare constructs the play within the play as the drama's most concentrated site of epistemological tension. Hamlet's declaration that 'The play's the thing / Wherein I'll catch the conscience of the king' — the couplet's neat resolution standing in ironic contrast to the messy uncertainty that follows — positions theatre as the only instrument capable of penetrating Claudius's performed innocence. Yet the plan's execution reveals the limits of theatrical proof: Claudius's rising is susceptible to multiple interpretations, and Hamlet's subsequent certainty is, as Goldman argues, 'wildly disproportionate to the evidence'. More significantly, Shakespeare implicates his own audience in this epistemological instability — the Globe's spectators, watching a court watch a play watch a murder, are themselves positioned as both judges and suspects. Greenblatt's contextualisation of the scene within Renaissance debates about theatre's moral status deepens this reading: the Mousetrap is not merely a plot device but Shakespeare's most self-conscious interrogation of what theatre can and cannot know.",
    } },
  { id: 'mal-2017-a', year: 2017, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of a corrupted court in The Duchess of Malfi.",
    themes: ['corruption','power','court','ambition'],
    framework: {
      thesis: "Webster presents a corrupted court not as an exceptional condition but as the inevitable product of systems in which power is concentrated without accountability — the Aragonese court is corruption made architectural, and every character within it is shaped by its logic.",
      paragraph_plan: [
        { topic: "Antonio's opening speech — corruption as systemic", ao_focus: ['AO2','AO3'], topic_sentence: "Antonio's description of the French court as a corrective model immediately precedes the spectacle of its antithesis — Webster uses the ideal to measure the Aragonese court's total failure." },
        { topic: "The Cardinal — spiritual authority corrupted", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The Cardinal's combination of ecclesiastical office and political power — his mistress, his poison, his absolute authority — embodies the play's thesis that institutional power corrupts absolutely." },
        { topic: "Bosola as the court's instrument", ao_focus: ['AO1','AO2'], topic_sentence: "Bosola's role as intelligencer reveals the court's corruption as requiring human instruments — men whose moral agency is purchased and deployed in the service of power." },
        { topic: "Critical perspectives on the corrupted court", ao_focus: ['AO3'], topic_sentence: "Critics have contextualised Webster's corrupted court within Jacobean anxieties about the Spanish court, Italian politics, and the nature of absolutist power." },
      ],
      sentence_stems: {
        AO1: "Webster presents the Aragonese court as [corrupt/corrupting/systematically destructive] — the [character/scene] reveals that...",
        AO2: "The [technique] in '[quote]' encodes corruption through [effect], suggesting that...",
        AO3: "Within Jacobean anxieties about [Italian/Spanish/absolutist courts], Webster's presentation would have been read as...",
      },
      critic_positions: [
        { critic: "Frank Whigham", position: "The court's corruption in Malfi is a function of aristocratic anxiety about social mobility — the brothers fear the Duchess's remarriage because it threatens the integrity of a class system already under pressure", embed: "Whigham reads the court's corruption as historically specific: 'the Aragonese brothers' violence is the violence of a class defending its privileges against erosion'." },
        { critic: "Dympna Callaghan", position: "The court's corruption is fundamentally gendered — it is a system designed to control female sexuality and punish female autonomy", embed: "Callaghan argues that the court's corrupted structures are 'organised around the management of female bodies', making the Duchess's destruction the logical expression of its foundational logic." },
        { critic: "John Russell Brown", position: "Webster presents corruption as a condition that destroys its own instruments — Bosola, Ferdinand, and the Cardinal are all consumed by the system they serve", embed: "Brown's reading emphasises the self-consuming nature of the court's corruption: 'the play shows how power destroys those who exercise it', making the final massacre the court's logical conclusion." },
      ],
      model_paragraph: "Webster establishes the Aragonese court's corruption in the play's opening speech through the device of ironic contrast. Antonio's description of the French court — 'a prince's court / Is like a common fountain, whence should flow / Pure silver drops in general' — functions as an ideal against which the Aragonese court is immediately measured and found catastrophically wanting: the 'cursèd example' that poisons the fountain 'near the head' is not hypothetical but the play's central dramatic reality. Whigham's reading of the court's corruption as historically specific — 'the violence of a class defending its privileges against erosion' — contextualises the brothers' obsessive control of the Duchess's sexuality as a symptom of aristocratic anxiety rather than mere personal pathology. Yet Callaghan's feminist reading deepens this: the court's corruption is 'organised around the management of female bodies', making the Duchess's destruction not an aberration but the system's logical expression. Brown's observation that the corruption ultimately consumes its own instruments — Bosola, the Cardinal, Ferdinand — positions the final massacre not as tragedy but as the court's inevitable self-annihilation: a system so comprehensively corrupted that it can produce nothing but its own destruction.",
    } },
  { id: 'mal-2017-b', year: 2017, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster creates uncertainty in The Duchess of Malfi.',
    themes: ['uncertainty','secrets','deception','identity'],
    framework: {
      thesis: "Webster creates uncertainty in The Duchess of Malfi not as a dramatic failing but as a deliberate philosophical strategy — the play refuses to resolve questions of guilt, motivation, and moral judgement, positioning uncertainty as the appropriate response to a world in which appearance and reality have been permanently severed.",
      paragraph_plan: [
        { topic: "Uncertainty about Bosola — agent or moral agent?", ao_focus: ['AO1','AO2'], topic_sentence: "Bosola's moral status is the play's central site of uncertainty — his role as both executioner and (belated) avenger refuses the audience the comfort of clear moral categorisation." },
        { topic: "The Duchess's secret — uncertainty and identity", ao_focus: ['AO2'], topic_sentence: "The Duchess's secret marriage generates a pervasive uncertainty that transforms the court's surveillance into a mechanism of paranoia rather than knowledge." },
        { topic: "Ferdinand's motivation — uncertainty as theatrical strategy", ao_focus: ['AO2','AO3'], topic_sentence: "Webster deliberately withholds clear motivation for Ferdinand's obsessive control of his sister, producing an uncertainty that has generated centuries of critical debate." },
        { topic: "Critical perspectives on uncertainty", ao_focus: ['AO3'], topic_sentence: "Critics have read the play's uncertainty as reflecting Jacobean anxieties about knowledge, power, and the limits of human judgement." },
      ],
      sentence_stems: {
        AO1: "Webster creates uncertainty through [character/structure/language] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' generates uncertainty through [effect], refusing to resolve...",
        AO3: "Within Jacobean anxieties about [knowledge/surveillance/moral judgement], uncertainty carried the weight of...",
      },
      critic_positions: [
        { critic: "Lisa Hopkins", position: "The uncertainty in Malfi is structural — Webster deliberately withholds information that would allow the audience to make stable moral judgements", embed: "Hopkins argues that Webster's 'systematic withholding of motivation' is a deliberate aesthetic choice, positioning uncertainty as 'the appropriate epistemological condition for a fallen world'." },
        { critic: "Frank Whigham", position: "Ferdinand's uncertain motivation is historically specific — his incestuous obsession reflects aristocratic anxieties about blood purity that Webster's audience would have recognised", embed: "Whigham reads Ferdinand's uncertainty as ideologically grounded: his 'dark desire' is 'the desire of a class' rather than individual pathology, a displacement of anxieties about aristocratic purity." },
        { critic: "Catherine Belsey", position: "The play's uncertainty is a feature of its resistance to the humanist subject — characters in Malfi resist the coherent interiority that humanist drama promises", embed: "Belsey reads Webster's uncertainty as philosophically radical: the play 'refuses the unified subject' of humanist drama, making characters' motivations permanently opaque." },
      ],
      model_paragraph: "Webster creates uncertainty as the play's foundational aesthetic principle, most visibly in his treatment of Bosola — the figure who most resists moral categorisation. Bosola operates throughout as Ferdinand's instrument of surveillance, engineering the Duchess's exposure and overseeing her torture and execution; yet his 'Return, fair soul, from darkness' after her death and his subsequent turn to vengeance position him simultaneously as executioner and avenger, a moral contradiction the play refuses to resolve. Hopkins's reading of this as a 'systematic withholding of motivation' — a deliberate aesthetic choice rather than authorial failure — is compelling: Webster does not lack the skill to clarify Bosola's moral status, he withholds clarity as a philosophical statement. Belsey's more radical reading deepens this: the play 'refuses the unified subject' of humanist drama entirely, making the coherent interiority that would resolve uncertainty an impossibility in this world. The result is a dramatic universe in which, as the Duchess herself acknowledges, 'We are merely the stars' tennis balls' — a formulation that attributes human experience to chance and arbitrary force, and positions uncertainty not as a temporary condition but as the permanent truth of the world Webster has created.",
    } },

  // 2018
  { id: 'ham-2018-a', year: 2018, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents uncertainty in Hamlet.',
    themes: ['uncertainty','doubt','deception','performance'],
    framework: {
      thesis: "Shakespeare presents uncertainty not as a temporary obstacle to knowledge but as the permanent condition of Hamlet's world — a structural feature of the play that implicates language, identity, and moral action simultaneously.",
      paragraph_plan: [
        { topic: "Uncertainty about the Ghost's nature", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The Ghost's ambiguous ontological status — devil, purgatorial spirit, or honest messenger — establishes uncertainty as the play's foundational condition." },
        { topic: "Linguistic uncertainty — the gap between word and meaning", ao_focus: ['AO2'], topic_sentence: "Shakespeare encodes uncertainty into the play's language itself, through soliloquies that circle without resolving, and asides that reveal the instability of public speech." },
        { topic: "Uncertainty and action — the paralysis problem", ao_focus: ['AO1','AO2'], topic_sentence: "Hamlet's inability to act is inseparable from his epistemological uncertainty — he cannot kill Claudius because he cannot be certain enough to justify the act." },
        { topic: "Critical perspectives on uncertainty", ao_focus: ['AO5'], topic_sentence: "Whether uncertainty is Hamlet's tragic flaw or his greatest virtue remains the play's most contested critical question." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents uncertainty as [structural/thematic/psychological] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' enacts uncertainty through [effect], refusing to resolve...",
        AO3: "Within the context of [Reformation theology/Jacobean court culture], uncertainty about [topic] carried the weight of...",
        AO5: "[Critic] argues that Hamlet's uncertainty is [position] — a reading that [supports/challenges/complicates]...",
      },
      critic_positions: [
        { critic: "William Empson", position: "Hamlet's uncertainty is deliberately cultivated by Shakespeare as a dramatic strategy — the play resists resolution by design", embed: "Empson reads the play's uncertainty as intentional irresolution, arguing Shakespeare constructed 'a character who could not make up his mind' as a vehicle for exploring the limits of human knowledge." },
        { critic: "Stephen Greenblatt", position: "The uncertainty about the Ghost reflects specifically Protestant anxieties about purgatory — the Reformation had abolished the theological framework that would have made the Ghost's nature clear", embed: "Greenblatt's contextualisation of the Ghost within post-Reformation theology positions the play's uncertainty as historically specific: 'the dead could no longer return'." },
        { critic: "A.C. Bradley", position: "Uncertainty is Hamlet's tragic flaw — his excessive intellectualism prevents decisive action", embed: "Bradley's reading frames uncertainty as pathological, a 'disturbance of the relation between the power of meditating and the power of acting'." },
      ],
      model_paragraph: "Shakespeare constructs uncertainty not as a temporary obstacle but as the permanent epistemological condition of Hamlet's Denmark. The Ghost's ambiguous ontological status — Hamlet himself acknowledges it may be 'a devil' assuming 'a pleasing shape' to 'abuse me to damn me' — establishes from the outset that the most fundamental questions of the play (who killed Hamlet's father? what does the Ghost want? what does revenge require?) cannot be answered with certainty. Greenblatt's contextualisation within post-Reformation theology deepens this: the abolition of purgatory by Protestant doctrine had, as he argues, left the dead with nowhere to return from — the Ghost is literally theologically impossible, its presence generating an uncertainty that no amount of theatrical proof can resolve. Bradley reads this as Hamlet's fatal flaw, a 'disturbance' between meditation and action; but Empson's counter-reading — that the uncertainty is Shakespeare's deliberate dramatic strategy — is more persuasive: the play does not fail to resolve its uncertainties, it refuses to, positioning irresolution as the only honest response to a corrupt world.",
    } },
  { id: 'ham-2018-b', year: 2018, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents Ophelia in Hamlet.',
    themes: ['ophelia','gender','madness','patriarchy'],
    framework: {
      thesis: "Shakespeare presents Ophelia not as a passive victim but as the play's most revealing diagnostic figure — her treatment by the male characters exposes the court's corruption, and her madness becomes the only authentic language available in a world of performed surfaces.",
      paragraph_plan: [
        { topic: "Ophelia as object of male control", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "Shakespeare establishes Ophelia's subjectivity as perpetually mediated — she is defined by her relationships to Polonius, Laertes, and Hamlet rather than by her own interiority." },
        { topic: "The nunnery scene — Hamlet weaponising Ophelia", ao_focus: ['AO2'], topic_sentence: "In the nunnery scene, Hamlet's language enacts violence against Ophelia's body and identity, deploying her as an instrument of his own psychological crisis." },
        { topic: "Madness as the only authentic discourse", ao_focus: ['AO1','AO2'], topic_sentence: "Ophelia's madness, far from being a breakdown, is presented as the most honest speech in the play — her flower distribution encodes political and sexual truths the court refuses to speak." },
        { topic: "Critical perspectives on Ophelia", ao_focus: ['AO5'], topic_sentence: "Feminist critics have reclaimed Ophelia from the tradition that read her as merely decorative, positioning her as central to the play's critique of patriarchal power." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents Ophelia as [diagnostic figure/victim/truth-teller] — her [scene/speech/action] reveals...",
        AO2: "The [technique] in '[quote]' positions Ophelia as [object/subject/both], with the effect that...",
        AO3: "Within [Elizabethan/Jacobean] constructions of femininity, Ophelia's [behaviour] would have been read as...",
        AO5: "Where [critic A] reads Ophelia as [position], [critic B] reclaims her as...",
      },
      critic_positions: [
        { critic: "Elaine Showalter", position: "Ophelia's madness is a site of feminist reclamation — she has been consistently misread by a critical tradition that mirrors the patriarchal structures of the play itself", embed: "Showalter argues that 'Ophelia's story becomes most powerful in the 20th century', when feminist readings recover her as a figure of resistance rather than passive victimhood." },
        { critic: "Janet Adelman", position: "Ophelia is the collateral damage of Hamlet's crisis about maternal contamination — she is destroyed by anxieties she has no part in creating", embed: "Adelman reads Ophelia's treatment as inseparable from Hamlet's 'fantasies of maternal seductiveness', positioning her destruction as the logical consequence of his contaminated vision of femininity." },
        { critic: "Carol Thomas Neely", position: "Ophelia's madness is Shakespeare's most radical staging of female interiority — the flower scene encodes complex political and sexual knowledge", embed: "Neely argues that the flower distribution 'encodes Ophelia's own complex knowledge', transforming apparent breakdown into the play's most politically charged speech act." },
      ],
      model_paragraph: "Shakespeare presents Ophelia's madness not as the absence of reason but as its displaced expression — the only discourse available to a woman whose subjectivity has been systematically denied. The flower distribution scene deploys symbolic language with a precision that exceeds the rational speech of the court: 'There's rosemary, that's for remembrance' encodes grief, sexual knowledge, and political accusation in a register that the court's performed surfaces cannot accommodate. Neely's reading of this moment as an act of complex female knowledge rather than mere breakdown is compelling — Ophelia distributes herbs whose symbolic meanings indict each recipient, making her the most diagnostically accurate speaker in the play. Yet Adelman's framing complicates this: Ophelia's madness is also the collateral damage of Hamlet's crisis, a crisis that has nothing to do with her and everything to do with his contaminated vision of femininity. Showalter's feminist reclamation — reading the critical tradition's marginalisation of Ophelia as mirroring the patriarchal structures of the play itself — suggests that how we read Ophelia reveals as much about our own critical assumptions as about Shakespeare's intentions.",
    } },
  { id: 'mal-2018-a', year: 2018, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of family relationships in The Duchess of Malfi.",
    themes: ['family','power','gender','control'],
    framework: {
      thesis: "Webster presents family relationships in The Duchess of Malfi not as bonds of love and loyalty but as instruments of power — the brothers' relationship with the Duchess is structured entirely around control, and the play exposes this as the defining pathology of a system that has corrupted the language of family into the grammar of ownership.",
      paragraph_plan: [
        { topic: "The brothers as owners rather than relatives", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "Webster establishes from the opening scene that the brothers' relationship with the Duchess is proprietorial rather than familial — her body, her choice, and her sexuality are treated as their inheritance to manage." },
        { topic: "Ferdinand's relationship — obsession and incest", ao_focus: ['AO2'], topic_sentence: "Ferdinand's relationship with his sister exceeds the language of fraternal authority, generating a psychosexual intensity that the play encodes but never fully names." },
        { topic: "The Duchess's family — Antonio and the children", ao_focus: ['AO1','AO2'], topic_sentence: "Against the corrupted family of the brothers, the Duchess constructs an alternative family with Antonio — one founded on love rather than power, and destroyed precisely because it refuses the brothers' logic." },
        { topic: "Critical perspectives on family", ao_focus: ['AO3'], topic_sentence: "Critics have read Webster's family relationships through psychoanalytic, feminist, and historicist lenses, finding in them the distorted reflection of Jacobean anxieties about inheritance and female sexuality." },
      ],
      sentence_stems: {
        AO1: "Webster presents family relationships as [instruments of power/sites of corruption/alternatives to power] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes the family relationship's [quality] through [effect], suggesting that...",
        AO3: "Within Jacobean constructions of [family/inheritance/female sexuality], the brothers' behaviour would have been read as...",
      },
      critic_positions: [
        { critic: "Frank Whigham", position: "The brothers' relationship with the Duchess reflects aristocratic anxieties about blood contamination — her remarriage threatens the purity of a lineage they have defined as their own", embed: "Whigham reads the family relationship as ideologically driven: the brothers' violence is 'the violence of a class' protecting its bloodline from contamination by a socially inferior husband." },
        { critic: "Dympna Callaghan", position: "The family structure in Malfi is a patriarchal mechanism for the management of female sexuality", embed: "Callaghan argues that the brothers' relationship with the Duchess is 'organised around the control of female reproductivity' — family becomes the institutional language through which female autonomy is denied." },
        { critic: "Lisa Hopkins", position: "The Duchess's alternative family with Antonio represents the play's most radical gesture — a relationship founded on love rather than power", embed: "Hopkins reads the secret marriage as 'a utopian gesture within a dystopian world', the Duchess's construction of an alternative family as the play's most politically charged act of resistance." },
      ],
      model_paragraph: "Webster presents the brothers' relationship with the Duchess as a masterclass in the perversion of familial language into proprietary control. Ferdinand's opening injunction — 'You are my sister' — deploys the language of kinship as a claim of ownership: the sentence that follows is not an expression of affection but a series of commands that position the Duchess's sexuality as a resource to be managed rather than a life to be lived. Whigham's historicist reading is illuminating here: the violence of the brothers is 'the violence of a class' defending a bloodline they have defined as their inheritance, making the Duchess's remarriage to Antonio (a steward, socially their inferior) an act of contamination rather than merely a romantic choice. Callaghan deepens this with her feminist analysis: the family structure is 'organised around the control of female reproductivity', transforming love into the language of the brothers' institutional anxiety. Against this corrupted family, the Duchess constructs an alternative — the secret marriage founded on love rather than power — which Hopkins reads as 'a utopian gesture within a dystopian world'. That this alternative family is destroyed precisely because it refuses the brothers' logic is Webster's most damning structural argument: in this world, love is not merely insufficient protection; it is the thing that makes you most vulnerable.",
    } },
  { id: 'mal-2018-b', year: 2018, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster makes use of reputation in The Duchess of Malfi.',
    themes: ['reputation','honour','gender','society'],
    framework: {
      thesis: "Webster makes use of reputation in The Duchess of Malfi to expose how patriarchal society deploys the language of honour to control female autonomy — reputation is not a neutral moral category but an ideological weapon wielded by the powerful against those who refuse to submit.",
      paragraph_plan: [
        { topic: "Reputation as male property — the brothers' investment", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The brothers' obsession with the Duchess's reputation reveals that reputation, in this world, is not a woman's own but her male relatives' property — her behaviour is their honour." },
        { topic: "The Duchess's defiance of reputation", ao_focus: ['AO2'], topic_sentence: "'I am Duchess of Malfi still' claims a reputation grounded in interior identity rather than social performance — the Duchess redefines reputation as something that cannot be taken by external force." },
        { topic: "Bosola and reputation — the intelligencer's role", ao_focus: ['AO1','AO2'], topic_sentence: "Bosola's role as intelligencer is to gather the evidence that will destroy the Duchess's reputation — his surveillance apparatus reveals how reputation is constructed through selective revelation." },
        { topic: "Critical perspectives on reputation", ao_focus: ['AO3'], topic_sentence: "Critics have read reputation in Malfi as a specifically Jacobean ideological construction — one that reflects anxieties about class, gender, and the Italian setting's perceived moral laxity." },
      ],
      sentence_stems: {
        AO1: "Webster presents reputation as [ideological weapon/site of resistance/male property] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes reputation through [effect], with the consequence that...",
        AO3: "Within Jacobean constructions of [female honour/aristocratic reputation/Italian morality], reputation functioned as...",
      },
      critic_positions: [
        { critic: "Frank Whigham", position: "Reputation in Malfi is a class instrument — the brothers' defence of the Duchess's reputation is the defence of their own aristocratic identity", embed: "Whigham reads reputation as ideologically class-specific: the brothers' obsession is not with their sister's virtue but with 'the integrity of their blood', making reputation a euphemism for aristocratic exclusivity." },
        { critic: "Dympna Callaghan", position: "Female reputation in Malfi is a patriarchal construction designed to police female sexuality", embed: "Callaghan argues that the brothers' concern with the Duchess's reputation is 'a mechanism of sexual surveillance', transforming the language of honour into a technology of control." },
        { critic: "Lisa Hopkins", position: "'I am Duchess of Malfi still' redefines reputation as interior and inalienable — the Duchess claims a self that external degradation cannot destroy", embed: "Hopkins reads the declaration as the play's most radical statement about reputation: the Duchess insists on 'an interiority that transcends social performance', proposing that true reputation resides in identity rather than opinion." },
      ],
      model_paragraph: "Webster exposes reputation in The Duchess of Malfi as an ideological instrument rather than a neutral moral category. The brothers' opening injunction to the Duchess to guard her honour — delivered before any transgression has occurred — reveals that their investment in her reputation is proprietary rather than protective: her body is their honour's vessel, and her autonomous choice is a threat to their identity as much as their lineage. Whigham's historicist reading is precise here: the brothers' obsession is with 'the integrity of their blood' rather than their sister's virtue, making reputation a class instrument wielded against social contamination. Callaghan's feminist reading deepens this: the surveillance apparatus deployed by Bosola to expose the Duchess transforms the language of honour into 'a mechanism of sexual surveillance' — reputation becomes the technology through which female autonomy is denied and punished. Against this, the Duchess's 'I am Duchess of Malfi still' proposes a radical redefinition: Hopkins reads this as claiming 'an interiority that transcends social performance', a reputation grounded in identity rather than opinion that external degradation — the wax figures, the dead hand, the strangling cord — cannot reach. That the play ends with Delio's 'Integrity of life is fame's best friend' suggests Webster endorses this redefinition — but only retrospectively, and only over the Duchess's dead body.",
    } },

  // 2019
  { id: 'ham-2019-a', year: 2019, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents the theme of deception in Hamlet.',
    themes: ['deception','performance','theatricality','corruption'],
    framework: {
      thesis: "Shakespeare presents deception not as the strategy of individual villains but as the structural condition of Elsinore — a court in which performance has so thoroughly displaced authenticity that truth becomes inaccessible and action impossible.",
      paragraph_plan: [
        { topic: "Claudius as the play's master deceiver", ao_focus: ['AO1','AO2'], topic_sentence: "Claudius's regime is founded on an act of theatrical substitution — the murder of a king replaced by the performance of kingship — and Shakespeare encodes this in every aspect of his public speech." },
        { topic: "Hamlet's counter-deception — the antic disposition", ao_focus: ['AO2'], topic_sentence: "Hamlet's adoption of 'an antic disposition' weaponises performance against the court's own culture of surfaces, but risks consuming the performer." },
        { topic: "Deception and gender — Polonius, Ophelia, and surveillance", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The play's surveillance apparatus — Polonius deploying Ophelia as bait — reveals how deception is gendered: women's bodies become instruments of male epistemological strategies." },
        { topic: "Critical perspectives on deception", ao_focus: ['AO5'], topic_sentence: "Critics debate whether Hamlet's deception replicates the corruption he seeks to expose or constitutes a legitimate counter-strategy." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents deception as [structural/gendered/political] — in Elsinore, [observation]...",
        AO2: "The [technique] of '[quote]' encodes deception through [effect], with the consequence that...",
        AO3: "Within Jacobean anxieties about [surveillance/counsel/courtly performance], deception was understood as...",
        AO5: "[Critic] argues that Hamlet's deception [position] — a reading that [supports/complicates]...",
      },
      critic_positions: [
        { critic: "Stephen Greenblatt", position: "The culture of deception in Hamlet reflects the Machiavellian politics of the Renaissance court", embed: "Greenblatt reads Elsinore's culture of performance and surveillance as 'the Machiavellian moment', in which political survival requires the complete subordination of authentic selfhood to strategic performance." },
        { critic: "Margreta de Grazia", position: "Hamlet's deception is ultimately self-defeating — the antic disposition becomes indistinguishable from genuine madness", embed: "De Grazia argues that Hamlet's performed madness 'bleeds into the real', raising the question of whether deception can be deployed without consuming the deceiver." },
        { critic: "Francis Barker", position: "Deception in Hamlet reflects the emergence of a specifically modern interiority — the split between public performance and private self", embed: "Barker reads the play's deceptions as symptoms of 'the tremulous private body' — a newly emergent sense of interiority that the court's surveillance apparatus cannot fully penetrate." },
      ],
      model_paragraph: "Shakespeare presents deception as so thoroughly woven into Elsinore's fabric that the distinction between authentic and performed selfhood becomes impossible to sustain. Claudius's first public address — its smooth syntax and royal plurality performing the legitimacy of a regime founded on murder — is the play's master instance of this condition: 'One may smile, and smile, and be a villain', Hamlet observes, diagnosing a court in which surface and substance have been completely severed. Greenblatt's contextualisation within Renaissance Machiavellianism is apposite here: Elsinore is a court in which, as he argues, political survival requires 'the complete subordination of authentic selfhood to strategic performance'. Yet Hamlet's counter-strategy — the antic disposition — replicates the very condition it seeks to expose. De Grazia's reading that performed madness 'bleeds into the real' is borne out by the play's structural irony: by Act 3, the audience can no longer be certain whether Hamlet's deception remains strategic or has consumed its performer, making the play's central act of counter-deception as epistemologically unstable as the deception it opposes.",
    } },
  { id: 'ham-2019-b', year: 2019, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents the relationship between Hamlet and Gertrude in Hamlet.',
    themes: ['relationships','gender','sexuality','corruption'],
    framework: {
      thesis: "Shakespeare presents the relationship between Hamlet and Gertrude as the play's most psychologically complex bond — one in which grief, desire, disgust, and political anxiety converge, implicating questions of gender, sexuality, and maternal authority that the play refuses to resolve.",
      paragraph_plan: [
        { topic: "Gertrude's remarriage as Hamlet's originary wound", ao_focus: ['AO1','AO2'], topic_sentence: "Before the Ghost's revelation, it is Gertrude's remarriage — not Claudius's murder — that has poisoned Hamlet's world, suggesting that maternal betrayal is the play's deeper trauma." },
        { topic: "The closet scene — confrontation and its limits", ao_focus: ['AO2'], topic_sentence: "The closet scene stages the most direct confrontation of the relationship, but Shakespeare refuses to grant Hamlet the moral authority he seeks — the killing of Polonius immediately undermines his position." },
        { topic: "Gertrude as agent or victim?", ao_focus: ['AO1','AO3'], topic_sentence: "The play's most contested question about Gertrude is whether she knew of the murder — her silence on this point is Shakespeare's most deliberate ambiguity." },
        { topic: "Critical perspectives on Hamlet and Gertrude", ao_focus: ['AO5'], topic_sentence: "Psychoanalytic critics have read the relationship through an Oedipal lens, while feminist critics have sought to recover Gertrude as a figure of political agency." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents Hamlet and Gertrude's relationship as [site of/defined by] — the [scene] reveals that...",
        AO2: "The [technique] in '[quote]' encodes [emotion/conflict] through [effect], with the consequence that...",
        AO3: "Within Jacobean constructions of [maternal authority/widow remarriage/female sexuality], Gertrude's behaviour would have been read as...",
        AO5: "Where [critic A] reads the relationship as [position], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "Janet Adelman", position: "The relationship is defined by Hamlet's fantasy of maternal contamination — Gertrude's body becomes the site of universal corruption", embed: "Adelman argues that Hamlet's crisis originates in 'the rank sweat of an enseamed bed', and that Gertrude's sexuality poisons his vision of all women, all relationships, and Denmark itself." },
        { critic: "Rebecca Smith", position: "Gertrude is not the sexualised, guilty figure of tradition but a caring, politically astute woman trapped between powerful men", embed: "Smith's feminist reading recovers Gertrude as 'a quiet, loving, unimaginative woman', arguing the tradition of her guilt reflects critical projection rather than textual evidence." },
        { critic: "Carolyn Heilbrun", position: "Gertrude's silence is not evidence of guilt but of agency — she withholds herself from a play that seeks to define her", embed: "Heilbrun reads Gertrude's characteristic opacity as resistance: 'she never [allows] herself to be seen with clarity', a strategy that preserves interiority in a court of surveillance." },
      ],
      model_paragraph: "Shakespeare locates the origin of Hamlet's crisis not in his father's murder — which he does not yet know — but in his mother's remarriage, suggesting that the relationship between Hamlet and Gertrude is the play's deeper psychological wound. The first soliloquy's appalled catalogue — 'O most wicked speed, to post / With such dexterity to incestuous sheets' — precedes the Ghost's revelation by two scenes, establishing that maternal betrayal is Hamlet's foundational trauma. Adelman's psychoanalytic reading of this as 'the rank sweat of an enseamed bed' contaminating Hamlet's entire vision is compelling: from this moment, all women are implicated in Gertrude's perceived transgression, Ophelia included. Yet Smith's feminist counter-reading — recovering Gertrude as 'a quiet, loving, unimaginative woman' trapped between powerful men rather than a guilty sexualised figure — reveals how much of the traditional reading is critical projection. Heilbrun's point that Gertrude 'never allows herself to be seen with clarity' is the most productive synthesis: her opacity is not authorial carelessness but deliberate ambiguity, preserving a female interiority that the play's male surveillance apparatus cannot penetrate.",
    } },
  { id: 'mal-2019-a', year: 2019, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of religion in The Duchess of Malfi.",
    themes: ['religion','morality','corruption','death'],
    framework: {
      thesis: "Webster presents religion in The Duchess of Malfi not as a source of genuine spiritual authority but as an ideological instrument — the Cardinal's corrupt ecclesiastical power exposes how religious office can be weaponised, while the Duchess's authentic faith stands as the play's genuine spiritual counter-weight.",
      paragraph_plan: [
        { topic: "The Cardinal — religion as power", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The Cardinal's combination of ecclesiastical authority and political violence — his mistress, his poison, his manipulation of the Duchess's banishment — embodies Webster's thesis that institutional religion is corrupted by power." },
        { topic: "The Duchess's faith — religion as interior resource", ao_focus: ['AO2'], topic_sentence: "Against the Cardinal's institutional religion, the Duchess's faith is private, interior, and resistant to institutional corruption — 'Heaven-gates are not so highly arch'd / As princes' palaces' positions authentic spirituality against architectural power." },
        { topic: "Death and religion — Bosola's contemptus mundi", ao_focus: ['AO2','AO3'], topic_sentence: "Bosola's 'Thou art a box of worm seed' speech deploys the religious tradition of contemptus mundi — meditating on mortality as a path to spiritual clarity — in service of psychological cruelty, exposing how religious discourse can be weaponised." },
        { topic: "Critical perspectives on religion", ao_focus: ['AO3'], topic_sentence: "Critics have contextualised the play's religious dimension within the Jacobean anxieties about Catholicism, ecclesiastical corruption, and the relationship between spiritual and temporal authority." },
      ],
      sentence_stems: {
        AO1: "Webster presents religion as [corrupted/authentic/weaponised] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' deploys religious [imagery/language/allusion] to [effect], suggesting that...",
        AO3: "Within Jacobean anxieties about [Catholicism/ecclesiastical corruption/spiritual authority], Webster's presentation would have been read as...",
      },
      critic_positions: [
        { critic: "John Russell Brown", position: "The Cardinal represents Webster's indictment of the institutional Church as a vehicle for political rather than spiritual power", embed: "Brown reads the Cardinal as Webster's most sustained critique of ecclesiastical corruption: a figure in whom 'holy office has been entirely subordinated to political ambition', making the Church a department of state rather than a spiritual institution." },
        { critic: "Lisa Hopkins", position: "The Duchess's faith is the play's authentic spiritual centre — her stoic acceptance of death draws on genuine religious resources rather than institutional religion", embed: "Hopkins reads the Duchess's dying as 'a kind of martyrdom', her faith a private resource that institutional religion — represented by the Cardinal — has no access to." },
        { critic: "Frank Whigham", position: "The play's religious dimension reflects Jacobean Protestant anxieties about Catholic corruption — the Cardinal and the Italian setting encode a specifically anti-Catholic critique", embed: "Whigham contextualises the play's religion within Jacobean anti-Catholicism: the Cardinal's corruption 'would have been immediately legible to a Protestant audience as evidence of Rome's spiritual bankruptcy'." },
      ],
      model_paragraph: "Webster presents the Cardinal as the play's most comprehensive embodiment of religious corruption — a figure in whom ecclesiastical office has become entirely indistinguishable from political power. His arming for battle in Act 3 — exchanging cardinal's robes for military armour — is the play's most theatrical statement of this thesis: the spiritual and temporal have collapsed into each other, and the Church is revealed as a department of state rather than a spiritual institution. Brown's reading of this as Webster's 'indictment of institutional religion' is precise: the Cardinal does not merely fail to embody Christian values, he actively weaponises religious authority — using the ecclesiastical machinery of banishment to destroy his sister. Whigham's historicist contextualisation deepens this: for a Jacobean Protestant audience, the Cardinal's Italian Catholic corruption would have been 'immediately legible as evidence of Rome's spiritual bankruptcy', making the character a vehicle for the period's most charged religio-political anxieties. Against this institutional corruption, the Duchess's faith offers an alternative — Hopkins reads her dying as 'a kind of martyrdom', her 'Heaven-gates are not so highly arch'd / As princes' palaces' proposing that authentic spirituality is inversely proportional to institutional power. Webster's religious vision is thus structurally dialectical: institutional religion corrupts, private faith redeems — and the play ends with the corrupt instrument destroyed by the very power it served.",
    } },
  { id: 'mal-2019-b', year: 2019, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of the theme of excess in The Duchess of Malfi.",
    themes: ['excess','violence','death','power'],
    framework: {
      thesis: "Webster presents excess in The Duchess of Malfi as the defining condition of a world in which power has been freed from moral constraint — the brothers' excess of control, the Cardinal's excess of ambition, and the play's excess of violence are not aberrations but the logical expression of a system without accountability.",
      paragraph_plan: [
        { topic: "Excess of control — Ferdinand's obsession", ao_focus: ['AO2'], topic_sentence: "Ferdinand's psychosexual excess — his obsessive surveillance of his sister, his lycanthropic breakdown — presents control itself as a form of pathology when freed from rational limit." },
        { topic: "Excess of violence — the torture and death scenes", ao_focus: ['AO2','AO3'], topic_sentence: "The play's accumulation of violent spectacle in Act 4 — the dead hand, the wax figures, the strangling — exceeds the conventions of revenge tragedy and raises questions about Webster's relationship to his own genre." },
        { topic: "Bosola and moral excess — complicity without limit", ao_focus: ['AO1','AO2'], topic_sentence: "Bosola's willingness to perform any act in service of the brothers reveals moral excess as the inevitable condition of those who surrender agency to power." },
        { topic: "Critical perspectives on excess", ao_focus: ['AO3'], topic_sentence: "Critics have debated whether the play's excess is a formal flaw or a deliberate aesthetic strategy — and whether Webster endorses or critiques the violence he stages." },
      ],
      sentence_stems: {
        AO1: "Webster presents excess as [pathological/structural/aesthetic] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' enacts excess through [effect], suggesting that...",
        AO3: "Within Jacobean conventions of [revenge tragedy/theatrical violence/moral philosophy], excess was understood as...",
      },
      critic_positions: [
        { critic: "Jacqueline Pearce", position: "The play's excess of violence is a deliberate aesthetic strategy — Webster uses spectacle to implicate the audience in the pleasure of watching", embed: "Pearce reads the torture scenes as 'a deliberate confrontation of the audience with its own appetite for violent spectacle', making the excess a meta-theatrical critique of theatrical consumption." },
        { critic: "Michael Neill", position: "Excess in Malfi is the formal expression of a world in which death has lost its meaning through repetition", embed: "Neill argues that Webster's accumulation of deaths produces 'a numbing of moral response', the excess of violence paradoxically reducing its emotional impact and questioning the tragedy's ability to generate catharsis." },
        { critic: "Frank Whigham", position: "The excess in Malfi reflects the aristocratic pathology of a class that has exceeded its own moral limits", embed: "Whigham reads the brothers' excess as ideologically specific: their violence is 'the excess of a class that has outlived its moral justification', making destruction the only register left available to power without purpose." },
      ],
      model_paragraph: "Webster presents excess as the defining aesthetic and moral condition of The Duchess of Malfi, most concentrated in the torture sequence of Act 4. The accumulation of violent spectacle — the dead hand, the wax figures of Antonio and the children, the dance of madmen, the strangling cord — exceeds the already generous conventions of Jacobean revenge tragedy, raising the question Pearce identifies as central: whether the audience's appetite for theatrical violence implicates them in the very excess they witness. The dead hand, presented to the Duchess as Antonio's, encodes excess in its very artificiality: it is not merely cruel but elaborately, aesthetically cruel, a cruelty that has been crafted rather than merely inflicted. Neill's reading of this accumulation as producing 'a numbing of moral response' is persuasive — by the time the Duchess is strangled, the audience has witnessed so much violence that the emotional mathematics of tragedy have been disrupted, catharsis replaced by something closer to exhaustion. Whigham's historicist reading positions this excess ideologically: the brothers' violence is 'the excess of a class that has outlived its moral justification', destruction the only register available to power that has freed itself from accountability. The result is a world in which excess is not aberrant but structural — the logical endpoint of a system without limit.",
    } },

  // 2021
  { id: 'ham-2021-a', year: 2021, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare makes use of acting and the theatre in Hamlet.',
    themes: ['theatricality','performance','deception','metatheatre'],
    framework: {
      thesis: "Shakespeare makes acting and the theatre the central metaphor through which Hamlet interrogates authenticity, moral knowledge, and the relationship between performance and truth — ultimately implicating the audience in the same epistemological instability that paralyses its protagonist.",
      paragraph_plan: [
        { topic: "The Player's speech — acting as moral model", ao_focus: ['AO2','AO3'], topic_sentence: "The First Player's ability to weep for Hecuba — a fictional character — shames Hamlet and positions theatrical feeling as paradoxically more authentic than his own paralysed grief." },
        { topic: "The Mousetrap — theatre as epistemological instrument", ao_focus: ['AO1','AO2'], topic_sentence: "Hamlet's deployment of the Mousetrap positions theatre as the only reliable mechanism for accessing moral truth in a court of performed surfaces." },
        { topic: "The antic disposition — self as performance", ao_focus: ['AO2'], topic_sentence: "Hamlet's adopted madness collapses the boundary between performer and performance, raising the question of whether authentic selfhood can survive strategic theatricality." },
        { topic: "Metatheatrical implications for the audience", ao_focus: ['AO2','AO3','AO5'], topic_sentence: "Shakespeare's sustained metatheatricality implicates the Globe audience in the play's epistemological instability — watching becomes morally complex." },
      ],
      sentence_stems: {
        AO1: "Shakespeare makes use of [acting/theatre/performance] to [explore/interrogate/expose] — in [scene], this manifests as...",
        AO2: "The [technique] in '[quote]' deploys theatricality to [effect], with the consequence that...",
        AO3: "For a Jacobean audience [context about theatre], Shakespeare's metatheatricality would have [effect]...",
        AO5: "[Critic] argues that Shakespeare's use of theatre [position] — a reading supported by...",
      },
      critic_positions: [
        { critic: "Anne Righter", position: "Hamlet is Shakespeare's most sustained meditation on the relationship between theatre and truth", embed: "Righter positions the play as the culmination of Shakespeare's metatheatrical concerns, arguing that Hamlet uses 'the mirror of theatre' to test the limits of moral knowledge." },
        { critic: "Michael Goldman", position: "The theatrical self-consciousness of Hamlet implicates the audience in its own act of watching", embed: "Goldman argues that Shakespeare's metatheatricality creates 'a kind of guilty self-consciousness in the audience', positioning spectatorship as morally compromised." },
        { critic: "Stephen Greenblatt", position: "Hamlet's theatricality reflects Renaissance anxieties about the moral status of the actor's art", embed: "Greenblatt contextualises the play's interest in acting within Puritan attacks on theatre, suggesting Shakespeare both defends and interrogates the legitimacy of his own medium." },
      ],
      model_paragraph: "Shakespeare positions acting as the play's central epistemological problem through the Player's speech in Act 2. Hamlet's appalled question — 'Is it not monstrous that this player here, / But in a fiction, in a dream of passion, / Could force his soul so to his own conceit / That from her working all his visage wann'd?' — identifies what Goldman calls the morally troubling core of theatrical performance: the actor's ability to produce genuine emotion for a fictional cause exposes the gap between authentic feeling and its expression that Hamlet cannot bridge in his own life. The 'dream of passion' that produces real tears is more honest, Shakespeare implies, than the 'suits of woe' that Hamlet himself wears. Righter's reading of the scene as Shakespeare's 'mirror of theatre' is compelling: the Player holds up acting as a model of moral commitment that Hamlet, with his infinite capacity for self-analysis, cannot match. Yet Greenblatt's contextualisation within Puritan anxieties about acting complicates this — by making theatre the instrument of moral revelation, Shakespeare simultaneously defends his own medium and acknowledges its dangerous power to dissolve the boundary between truth and fiction.",
    } },
  { id: 'ham-2021-b', year: 2021, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore Shakespeare's presentation of Polonius in Hamlet.",
    themes: ['polonius','supporting characters','deception','patriarchy'],
    framework: {
      thesis: "Shakespeare presents Polonius not merely as a comic figure but as the play's most revealing embodiment of institutional corruption — a man whose mastery of performed wisdom conceals an intelligence deployed entirely in the service of power rather than truth.",
      paragraph_plan: [
        { topic: "Polonius as satirical target — the gap between maxim and practice", ao_focus: ['AO2'], topic_sentence: "The irony that Polonius's most celebrated wisdom — 'To thine own self be true' — is delivered by the play's most inauthentic counsellor is Shakespeare's sharpest structural joke." },
        { topic: "Polonius as instrument of surveillance", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "Polonius's deployment of Reynaldo, Ophelia, and himself as intelligence-gathering instruments reveals a mind entirely oriented toward surveillance rather than counsel." },
        { topic: "Polonius as father — the damage of performed authority", ao_focus: ['AO1','AO2'], topic_sentence: "Polonius's relationship with his children is the domestic expression of his political mode — authority performed rather than felt, with devastating consequences for Ophelia." },
        { topic: "Critical perspectives on Polonius", ao_focus: ['AO5'], topic_sentence: "Critics divide between reading Polonius as purely comic and recognising him as a genuinely dangerous figure whose death has real consequences." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents Polonius as [corrupt counsellor/instrument of surveillance/comic foil] — his [action/speech] reveals...",
        AO2: "The [technique] of '[quote]' exposes Polonius's [quality] through [effect], suggesting that...",
        AO3: "Within Jacobean anxieties about [counsel/surveillance/court corruption], Polonius represents...",
        AO5: "Where [critic A] reads Polonius as [comic/dangerous], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "Francis Barker", position: "Polonius is the embodiment of the surveillance state — his intelligence-gathering apparatus is the political unconscious of Claudius's regime", embed: "Barker reads Polonius as the institutional expression of 'a world entirely given over to the penetration of private space', his death removing a figure whose surveillance capacity made him indispensable to power." },
        { critic: "Harold Jenkins", position: "Polonius is primarily a comic figure whose pretensions to wisdom are Shakespeare's vehicle for satirising the type of the verbose counsellor", embed: "Jenkins's traditional reading positions Polonius as 'the tedious old fool' — a satirical target whose verbal excesses ('Brevity is the soul of wit', delivered at length) are the play's gentlest humour." },
        { critic: "Margreta de Grazia", position: "Polonius's death is the play's pivotal structural mistake — it is the act that makes all subsequent tragedy inevitable", embed: "De Grazia argues that the killing of Polonius — not the Ghost's revelation — is the play's true turning point, transforming Hamlet from avenger into fugitive." },
      ],
      model_paragraph: "Shakespeare presents Polonius as the play's most dangerous comic figure — a man whose verbal performances of wisdom conceal an intelligence entirely oriented toward surveillance and control. The structural irony of 'To thine own self be true' — the play's most celebrated counsel, delivered by its most inauthentic counsellor — is Shakespeare's sharpest diagnostic tool: if this is the wisdom Claudius's court produces, the rot is total. Barker's reading of Polonius as the institutional expression of 'a world entirely given over to the penetration of private space' deepens this: his deployment of Reynaldo to spy on Laertes, and of Ophelia as bait for Hamlet, reveals a man who has converted the language of paternal care into the practice of political intelligence. Jenkins's more traditional reading of Polonius as merely a comic verbose counsellor — 'the tedious old fool' — underestimates the damage his mode of authority inflicts on his daughter: Ophelia's destruction is the direct consequence of a father who has never distinguished between his children's welfare and his own political survival. De Grazia's identification of Polonius's death as the play's true turning point — rather than the Ghost's revelation — positions him as structurally more significant than his comedic presentation suggests.",
    } },
  { id: 'mal-2021-a', year: 2021, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore Webster\'s presentation of the relationship between the Duchess and Bosola in The Duchess of Malfi.',
    themes: ['bosola','duchess','power','surveillance','identity'],
    framework: {
      thesis: "Webster presents the relationship between the Duchess and Bosola as the play's most morally complex bond — a relationship structured by surveillance, power, and complicity that transforms, through the Duchess's death, into something approaching genuine recognition, making Bosola's belated turn the play's most painful expression of moral awakening.",
      paragraph_plan: [
        { topic: "Bosola as instrument of surveillance", ao_focus: ['AO1','AO2'], topic_sentence: "The relationship is established as one of asymmetric power — Bosola's role as intelligencer positions him as the tool of the brothers' control, his relationship with the Duchess defined by extraction rather than recognition." },
        { topic: "The contemptus mundi speech — cruelty as perverted care", ao_focus: ['AO2'], topic_sentence: "'Thou art a box of worm seed' encodes the relationship's central paradox — Bosola performs cruelty in the service of power while the speech itself suggests a tortured care that the role forbids him to express." },
        { topic: "Recognition after death — too late", ao_focus: ['AO2'], topic_sentence: "'Return, fair soul, from darkness' marks the relationship's most honest moment — Bosola's attempted revivification reveals the recognition that his role has systematically denied." },
        { topic: "Critical perspectives on the Duchess and Bosola", ao_focus: ['AO3'], topic_sentence: "Critics have debated whether Bosola's turn constitutes genuine moral awakening or merely the belated guilt of a man who has run out of other options." },
      ],
      sentence_stems: {
        AO1: "Webster presents the relationship between the Duchess and Bosola as [complex/paradoxical/morally ambiguous] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes the relationship's [quality] through [effect], suggesting that...",
        AO3: "Within Jacobean constructions of [service/surveillance/moral complicity], Bosola's role would have been read as...",
      },
      critic_positions: [
        { critic: "Lee Bliss", position: "Bosola's relationship with the Duchess is defined by the tension between his institutional role and his suppressed moral consciousness", embed: "Bliss reads Bosola as 'a man who knows what he is doing is wrong and does it anyway', making the Duchess-Bosola relationship a sustained dramatisation of moral complicity and its costs." },
        { critic: "Dympna Callaghan", position: "The relationship is structured by gender as much as by power — Bosola's surveillance of the Duchess enacts a specifically masculine form of knowledge-as-control", embed: "Callaghan reads Bosola's role as 'the gendered gaze institutionalised', his surveillance of the Duchess's body a mechanism of patriarchal power that the brothers have outsourced." },
        { critic: "Lisa Hopkins", position: "Bosola's belated turn represents the play's most authentic moral gesture — however inadequate, it is the only recognition the Duchess receives from a man", embed: "Hopkins reads Bosola's 'Return, fair soul, from darkness' as 'the play's most genuine moment of ethical response', however compromised by its timing and its failure." },
      ],
      model_paragraph: "Webster presents the relationship between the Duchess and Bosola as structured by an asymmetry of power that the play gradually, devastatingly undermines. Bosola's role as intelligencer — gathering the evidence of the secret marriage, engineering the Duchess's exposure — positions the relationship as one of extraction: he watches, reports, and destroys, and the Duchess exists within this relationship as object rather than subject. Yet the contemptus mundi speech in Act 4 complicates this entirely: 'Thou art a box of worm seed, at best but a salvatory of green mummy' performs cruelty in the service of the brothers' psychological torture programme while simultaneously encoding a philosophical engagement with the Duchess's condition that exceeds the role's requirements. Bliss reads this as the tension at Bosola's core — 'a man who knows what he is doing is wrong and does it anyway' — making the speech a form of displaced care that the institutional role forbids him to express directly. Hopkins's reading of 'Return, fair soul, from darkness' as 'the play's most genuine moment of ethical response' — however compromised — locates the relationship's most honest instant at the moment of its total failure: Bosola can recognise the Duchess only when she is dead, and his recognition arrives too late to constitute anything other than a monument to what the system he served has destroyed.",
    } },
  { id: 'mal-2021-b', year: 2021, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster presents death in The Duchess of Malfi.',
    themes: ['death','violence','excess','mortality','revenge tragedy'],
    framework: {
      thesis: "Webster presents death in The Duchess of Malfi not as a tragic conclusion but as the play's central philosophical and theatrical preoccupation — death is staged with such frequency, variety, and self-consciousness that it becomes the lens through which all human value is measured and found insufficient.",
      paragraph_plan: [
        { topic: "The Duchess's death — agency and stoicism", ao_focus: ['AO2'], topic_sentence: "'I know death hath ten thousand several doors / For men to take their exits' reframes death as a site of agency — the Duchess claims control over the manner of dying even as the manner is forced upon her." },
        { topic: "Death as spectacle — the torture sequence", ao_focus: ['AO2','AO3'], topic_sentence: "The elaborateness of the torture sequence — the dead hand, the wax figures, the strangling — positions death as theatrical event, raising questions about the audience's relationship to violent spectacle." },
        { topic: "Death and its aftermath — Ferdinand and Bosola", ao_focus: ['AO1','AO2'], topic_sentence: "The deaths of Ferdinand and Bosola in Act 5 extend the play's meditation on death beyond the Duchess — the massacre becomes a statement about the self-consuming nature of the system that produced it." },
        { topic: "Critical perspectives on death", ao_focus: ['AO3'], topic_sentence: "Critics have read the play's preoccupation with death within the contexts of Jacobean memento mori traditions, revenge tragedy conventions, and Webster's distinctive theatrical aesthetic." },
      ],
      sentence_stems: {
        AO1: "Webster presents death as [philosophical preoccupation/theatrical spectacle/measure of value] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes death through [effect], with the consequence that...",
        AO3: "Within Jacobean traditions of [memento mori/revenge tragedy/stoic philosophy], death carried the weight of...",
      },
      critic_positions: [
        { critic: "Michael Neill", position: "Death in Malfi is presented with such theatrical elaboration that it becomes an aesthetic experience — Webster transforms mortality into spectacle", embed: "Neill argues that Webster's death scenes constitute 'a theatre of dying', in which the Duchess's execution is 'choreographed as carefully as a masque', making death an art form rather than a fact." },
        { critic: "Lisa Hopkins", position: "The Duchess's death is the play's moral centre — her stoic acceptance transforms dying into the play's most powerful assertion of human dignity", embed: "Hopkins reads the Duchess's death as 'a kind of martyrdom', her 'Heaven-gates are not so highly arch'd' positioning authentic dignity against institutional power in the play's most resonant spiritual statement." },
        { critic: "John Russell Brown", position: "The play's accumulation of deaths produces a nihilistic vision — Webster offers no redemptive framework for the massacre", embed: "Brown reads the final act's multiple deaths as 'a vision of universal destruction', the closing moral of 'Integrity of life is fame's best friend' standing in ironic relation to a play that has shown integrity leading directly to annihilation." },
      ],
      model_paragraph: "Webster stages the Duchess's death with a theatrical elaboration that Neill identifies as the defining feature of his dramatic vision: 'a theatre of dying' in which execution is 'choreographed as carefully as a masque', transforming mortality from biological fact into aesthetic event. The Duchess's response to the strangling cord — 'I know death hath ten thousand several doors / For men to take their exits' — deploys the theatrical metaphor of the exit to reframe death as a site of agency rather than passivity: she chooses the manner even as the manner is forced upon her, claiming a kind of sovereignty over her own dying that the brothers' elaborate torture apparatus has been designed precisely to deny. Hopkins's reading of this as 'a kind of martyrdom' positions the death within a spiritual framework: the Duchess's stoic acceptance draws on genuine faith rather than mere defiance, making her dying the play's most powerful assertion of human dignity. Yet Brown's darker reading — that the play's accumulation of deaths produces 'a vision of universal destruction' — is equally persuasive: the closing moral of 'Integrity of life is fame's best friend' stands in such ironic relation to the deaths that precede it that Webster appears to offer not consolation but its theatrical simulacrum, a genre's expected moral gesture emptied of the conviction the play has systematically dismantled.",
    } },

  // 2022
  { id: 'ham-2022-a', year: 2022, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents heroism in Hamlet.',
    themes: ['heroism','suffering','honour','mortality'],
    framework: {
      thesis: "Shakespeare presents heroism in Hamlet as a concept under sustained interrogation — the play inherits the classical heroic tradition only to dismantle it, positioning Hamlet's distinctly intellectual, self-conscious mode of being as both the antithesis and the apotheosis of heroic action.",
      paragraph_plan: [
        { topic: "The classical heroic model — Old Hamlet and Fortinbras", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "Shakespeare establishes the classical heroic template through Old Hamlet and Fortinbras, against which Hamlet's reflective paralysis is measured and found wanting — or found superior." },
        { topic: "Hamlet's alternative heroism — intellectual courage", ao_focus: ['AO1','AO2'], topic_sentence: "Hamlet's heroism, if it exists, resides in his refusal to act on insufficient evidence — a moral scruple that Shakespeare presents as both admirable and catastrophic." },
        { topic: "The readiness — heroism as acceptance", ao_focus: ['AO2'], topic_sentence: "By Act 5, Hamlet's heroism has been redefined as stoic acceptance rather than active achievement — 'The readiness is all' marks a shift from doing to being." },
        { topic: "Critical perspectives on Hamlet as hero", ao_focus: ['AO5'], topic_sentence: "Critics from Bradley to Nietzsche have debated whether Hamlet is the quintessential tragic hero or the tragedy of a man constitutionally unsuited to heroic action." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents heroism in Hamlet as [contested/redefined/dismantled] — the play positions [character] as...",
        AO2: "The [technique] of '[quote]' redefines heroism through [effect], suggesting that...",
        AO3: "Within [classical/Renaissance/Jacobean] constructions of heroism, Hamlet's [behaviour] would have been read as...",
        AO5: "Where [critic A] reads Hamlet as [heroic/failed], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "A.C. Bradley", position: "Hamlet is the tragic hero par excellence — his greatness is inseparable from the sensitivity that makes decisive action impossible", embed: "Bradley's sympathetic reading frames Hamlet's heroism as residing in his exceptional nature: 'a soul too refined and great-minded for the brutal work of revenge'." },
        { critic: "T.S. Eliot", position: "Hamlet is an artistic failure — the play cannot adequately represent his emotion because there is no adequate objective correlative for it", embed: "Eliot's provocative reading positions Hamlet not as a hero but as a character whose emotion exceeds the play's capacity to contain it, making 'heroism' an inappropriate category." },
        { critic: "Harold Bloom", position: "Hamlet is the first truly modern hero — his self-consciousness and interiority represent a new form of heroic being", embed: "Bloom's reading frames Hamlet's intellectual heroism as historically unprecedented: 'Hamlet is so much larger than the play', his consciousness representing 'the inauguration of the human'." },
      ],
      model_paragraph: "Shakespeare presents heroism in Hamlet as a concept that the play inherits from the classical tradition only to interrogate with increasing severity. The Ghost's description of Old Hamlet — 'so excellent a king; that was to this / Hyperion to a satyr' — establishes the heroic template against which Hamlet is measured: physical courage, decisive action, moral clarity. Against this standard, Hamlet's reflective paralysis appears as failure. Yet Bradley's reading complicates this: Hamlet's heroism resides in a 'nature too refined' for the brutal work of revenge — his refusal to kill Claudius at prayer is not cowardice but a scruple about the quality of revenge that demonstrates moral sophistication exceeding anything the classical model accommodates. Bloom's positioning of Hamlet as 'the first truly modern hero' takes this further: the self-consciousness that prevents action is itself a new form of heroic being, one in which interiority rather than deed defines the self. By Act 5, Shakespeare has redefined the heroic entirely: 'The readiness is all' substitutes stoic acceptance for active achievement, proposing that the willingness to die — not the capacity to kill — is the play's final heroic standard.",
    } },
  { id: 'ham-2022-b', year: 2022, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare makes use of settings in Hamlet.',
    themes: ['setting','corruption','entrapment','mortality'],
    framework: {
      thesis: "Shakespeare uses setting in Hamlet not as a neutral backdrop but as an active dramatic agent — Elsinore's physical and symbolic geography externalises the play's psychological and political corruption, making space itself a vehicle for meaning.",
      paragraph_plan: [
        { topic: "Elsinore as prison — the spatial metaphor of entrapment", ao_focus: ['AO2'], topic_sentence: "Hamlet's declaration that 'Denmark's a prison' collapses a nation into an architectural metaphor of confinement, establishing setting as a projection of psychological and political condition." },
        { topic: "The battlements — threshold between worlds", ao_focus: ['AO2','AO3'], topic_sentence: "The Ghost's appearances on the battlements position this liminal space as the threshold between the living and the dead, the natural and the supernatural, the political and the theological." },
        { topic: "The court versus the margins", ao_focus: ['AO1','AO2'], topic_sentence: "Shakespeare contrasts the court's performed surfaces with marginal spaces — the players' world, the graveyard — where truth can be spoken that the court refuses." },
        { topic: "Critical perspectives on setting", ao_focus: ['AO5'], topic_sentence: "Critics have read Elsinore through lenses ranging from political allegory to psychoanalytic space, finding in its geography the external mapping of Hamlet's interior crisis." },
      ],
      sentence_stems: {
        AO1: "Shakespeare uses the setting of [location] to [externalise/expose/contrast] — the space functions as...",
        AO2: "The [technique] in '[quote]' encodes [meaning] through spatial [imagery/metaphor], suggesting that...",
        AO3: "Within [Jacobean/Renaissance] understandings of [place/court/threshold], the setting of [location] would have carried the weight of...",
        AO5: "[Critic] reads Elsinore as [position] — a reading that [illuminates/complicates]...",
      },
      critic_positions: [
        { critic: "Gaston Bachelard", position: "Elsinore is a phenomenological space — its architecture externalises the psychic condition of its inhabitants", embed: "Bachelard's concept of the 'poetics of space' applied to Elsinore positions the castle as a psychic projection: its towers, cellars, and thresholds map Hamlet's own interior geography." },
        { critic: "Stephen Greenblatt", position: "The setting of Hamlet reflects specifically Elizabethan anxieties about the court as a place of dangerous performance", embed: "Greenblatt reads Elsinore as 'the Machiavellian court' — a space in which every surface conceals a strategy and architectural proximity to power breeds corruption." },
        { critic: "Margreta de Grazia", position: "The graveyard scene democratises space — in death, the distinctions of Elsinore's court are dissolved", embed: "De Grazia reads the graveyard as the play's spatial counterpoint to Elsinore: 'the great leveller of rank', where Yorick and Alexander the Great share the same ultimate destination." },
      ],
      model_paragraph: "Shakespeare constructs Elsinore as a space in which architectural confinement and psychological entrapment become indistinguishable. Hamlet's compression of an entire nation into the single metaphor of 'Denmark's a prison' — and the subsequent elaboration, 'a goodly one, in which there are many confines, wards, and dungeons' — positions setting not as background but as active agent: the physical space of the court externalises the political and psychological conditions it contains. Greenblatt's reading of Elsinore as 'the Machiavellian court' contextualises this: in a space where every architectural position signals proximity to power, surveillance is built into the very geometry of the castle — Polonius hides behind the arras, Claudius and Polonius observe from concealment, and the battlements are both threshold and trap. Yet Bachelard's phenomenological approach deepens this further: Elsinore's spaces are psychic projections as much as political ones. The contrast with the graveyard — where, as De Grazia argues, 'the great leveller of rank' dissolves Elsinore's hierarchies — positions death as the only space outside the court's architecture of power, the only setting in which authentic speech is possible.",
    } },
  { id: 'mal-2022-a', year: 2022, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's use of imagery and symbolism in The Duchess of Malfi.",
    themes: ['imagery','symbolism','death','gender','revenge tragedy'],
    framework: {
      thesis: "Webster's use of imagery and symbolism in The Duchess of Malfi is not decorative but diagnostic — images of poison, animals, enclosure, and death do not merely illustrate the play's themes but constitute its argument, making the play's moral vision inseparable from its figurative language.",
      paragraph_plan: [
        { topic: "Animal imagery — the corruption of human nature", ao_focus: ['AO2'], topic_sentence: "Webster deploys animal imagery systematically — from Bosola's 'horse-leach' and Ferdinand's wolf to the 'stars' tennis balls' — to figure the dehumanising effects of power on those who exercise it." },
        { topic: "Poison as symbolic language", ao_focus: ['AO2','AO3'], topic_sentence: "The Cardinal's literal poison mirrors the symbolic poison that has infected the Aragonese court from its head — Webster makes the play's central metaphor literal in the final act." },
        { topic: "The dead hand and wax figures — symbolic torture", ao_focus: ['AO2'], topic_sentence: "The dead hand and wax figures in Act 4 function as symbolic objects within the torture sequence — their power lies in their ability to manipulate the Duchess through simulation rather than reality." },
        { topic: "Critical perspectives on imagery", ao_focus: ['AO3'], topic_sentence: "Critics have analysed Webster's imagery within the contexts of Jacobean emblematic tradition, Mannerist aesthetics, and the play's relationship to the visual arts." },
      ],
      sentence_stems: {
        AO1: "Webster uses imagery and symbolism to [argue/expose/encode] — the [image/symbol] of [topic] functions as...",
        AO2: "The [technique] of '[quote]' deploys [imagery type] to [effect], suggesting that...",
        AO3: "Within Jacobean [emblematic/Mannerist/theatrical] traditions, the image of [topic] would have carried the weight of...",
      },
      critic_positions: [
        { critic: "Inga-Stina Ewbank", position: "Webster's imagery is the primary vehicle of his moral vision — the play thinks through its images rather than through its plot", embed: "Ewbank argues that in Webster, 'the imagery does the work of argument', making the play's figurative language not illustration but the primary instrument of moral cognition." },
        { critic: "Michael Neill", position: "The dead hand and wax figures are Mannerist objects — Webster's imagery reflects a specifically Jacobean aesthetic of the grotesque", embed: "Neill contextualises Webster's symbolic objects within 'the Mannerist tradition of the grotesque', reading the dead hand as an object that 'aestheticises horror' in a manner characteristic of Jacobean theatrical experimentation." },
        { critic: "Lisa Hopkins", position: "The animal imagery in Malfi traces the progressive dehumanisation of the powerful — Ferdinand's lycanthropy is the logical endpoint of a process the play has been encoding from the start", embed: "Hopkins reads the animal imagery as a systematic dehumanisation narrative: Ferdinand's transformation into a wolf is 'the inevitable conclusion of a character who has always been more beast than man'." },
      ],
      model_paragraph: "Webster's imagery in The Duchess of Malfi operates not as decoration but as the primary instrument of moral argument — what Ewbank identifies as a drama that 'thinks through its images'. The animal imagery that pervades the play traces a systematic dehumanisation: from Bosola's description of court favourites as 'horse-leeches' in the opening scenes to Ferdinand's lycanthropic delusion in Act 5, Webster figures the corruption of power as a regression from the human to the bestial. Hopkins's reading of Ferdinand's transformation as 'the inevitable conclusion of a character who has always been more beast than man' is supported by the imagery's trajectory: the wolf Ferdinand imagines unearthing 'a dead body' is already present in his 'The wolf shall find her' of Act 1, making his madness the literalisation of a metaphor the play has been developing throughout. Neill's contextualisation of the dead hand within the Mannerist grotesque deepens the analysis: the object 'aestheticises horror' in a manner that implicates the audience — the dead hand is not merely cruel but beautiful in its craft, and Webster's staging of this beauty alongside its cruelty positions the audience as complicit in the aesthetic consumption of violence. Ewbank's formulation is thus verified structurally: the imagery does not illustrate Webster's moral vision — it is his moral vision.",
    } },
  { id: 'mal-2022-b', year: 2022, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster makes use of features of revenge tragedy in The Duchess of Malfi.',
    themes: ['revenge tragedy','genre','death','violence','corruption'],
    framework: {
      thesis: "Webster makes use of revenge tragedy conventions in The Duchess of Malfi with a self-consciousness that simultaneously inhabits and critiques the genre — the play fulfils the formal expectations of revenge tragedy while systematically undermining the moral certainties on which those expectations depend.",
      paragraph_plan: [
        { topic: "Genre conventions — what the play inherits", ao_focus: ['AO2','AO3'], topic_sentence: "Webster inherits the revenge tragedy's standard architecture — corrupt court, secret crime, delayed vengeance, catastrophic finale — deploying it with sufficient fidelity to genre to establish audience expectation." },
        { topic: "The subversion of the revenger figure", ao_focus: ['AO1','AO2'], topic_sentence: "Bosola as reluctant, belated, and ultimately self-defeating revenger undermines the genre's promise of purposeful agency — revenge in Malfi is accident rather than design." },
        { topic: "The finale — revenge tragedy's moral promise unfulfilled", ao_focus: ['AO2'], topic_sentence: "'We are merely the stars' tennis balls' positions the finale not as the genre's promised restoration of order but as a statement of universal determinism — justice is not restored, it accidentally occurs." },
        { topic: "Critical perspectives on genre", ao_focus: ['AO3'], topic_sentence: "Critics have debated the extent to which Malfi fulfils or subverts the revenge tragedy genre — and what Webster's relationship to generic convention reveals about his wider dramatic vision." },
      ],
      sentence_stems: {
        AO1: "Webster makes use of revenge tragedy conventions to [fulfil/subvert/interrogate] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' [inhabits/critiques] the revenge tragedy convention of [topic] through [effect]...",
        AO3: "Within the Jacobean revenge tragedy tradition established by [Kyd/Tourneur/Middleton], Webster's use of [convention] [extends/subverts]...",
      },
      critic_positions: [
        { critic: "John Russell Brown", position: "Malfi inhabits the revenge tragedy genre while systematically undermining its moral framework", embed: "Brown reads the play as 'a revenge tragedy that refuses the genre's promises', deploying its conventions with sufficient fidelity to establish expectation and then frustrating that expectation at every turn." },
        { critic: "Catherine Belsey", position: "Webster's use of genre is self-conscious and critical — Malfi is a revenge tragedy that questions whether revenge can ever produce justice", embed: "Belsey argues that Webster uses the revenge tragedy framework to interrogate 'the myth of retributive justice', exposing the genre's moral promise as ideologically convenient rather than truthful." },
        { critic: "Michael Neill", position: "The play's finale is a parody of the revenge tragedy's promised restoration of order — catastrophe replaces justice", embed: "Neill reads the final act's multiple deaths as 'the revenge tragedy's restoration of order rendered as farce', the genre's conventional finale subverted into a massacre that restores nothing and clarifies less." },
      ],
      model_paragraph: "Webster deploys the conventions of revenge tragedy with the self-consciousness of a dramatist who has fully absorbed the genre in order to interrogate it. The play's architecture is generically impeccable: a corrupt court, a secret crime, a figure positioned as potential avenger (Bosola), and a catastrophic finale — all the formal expectations of the genre are met. Yet Brown's reading of Malfi as 'a revenge tragedy that refuses the genre's promises' is borne out at every level of execution: Bosola's revenge is belated, accidental, and self-defeating, killing Antonio by mistake before despatching the Cardinal and dying in the same act, making the genre's promised purposeful agency a fiction. Belsey's more radical critique positions this subversion as ideologically charged: Webster uses the revenge tragedy framework to interrogate 'the myth of retributive justice', exposing the genre's moral certainty as a comforting narrative rather than a truthful account of how power actually operates. Neill's reading of the finale as 'the revenge tragedy's restoration of order rendered as farce' is the most devastating: the closing moral — 'Integrity of life is fame's best friend' — is exactly the platitude the genre conventionally produces, but Webster has so thoroughly dismantled the moral framework that would give it meaning that it stands as the play's most ironic gesture: a genre's expected consolation offered over a catastrophe that consoles nothing.",
    } },

  // 2023
  { id: 'ham-2023-a', year: 2023, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore Shakespeare's presentation of grief in Hamlet.",
    themes: ['grief','suffering','mortality','madness'],
    framework: {
      thesis: "Shakespeare presents grief in Hamlet as both the play's origin and its most politically transgressive act — Hamlet's refusal to perform recovery exposes a court that requires grief to be managed and abbreviated, and this refusal becomes the source of both his moral integrity and his tragic isolation.",
      paragraph_plan: [
        { topic: "Grief as political transgression", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The court's insistence that Hamlet 'cast his nighted colour off' reveals grief as politically dangerous — a refusal of the narrative of smooth succession that Claudius's regime requires." },
        { topic: "The language of grief — soliloquy as authentic space", ao_focus: ['AO2'], topic_sentence: "The soliloquy form grants Hamlet a private space for grief that the court denies him publicly — yet even here, grief is mediated through self-conscious performance." },
        { topic: "Ophelia's grief as contrast", ao_focus: ['AO1','AO2'], topic_sentence: "Ophelia's madness offers a parallel grief narrative — one that, lacking Hamlet's philosophical resources, finds expression only in fragmented song and symbolic gesture." },
        { topic: "Critical perspectives on grief", ao_focus: ['AO5'], topic_sentence: "Critics have debated whether Hamlet's grief is authentic or performed, genuine mourning or a vehicle for existential crisis." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents grief as [politically transgressive/authentically human/philosophically complex] — Hamlet's [action/speech] reveals...",
        AO2: "The [technique] in '[quote]' encodes grief through [effect], with the consequence that...",
        AO3: "Within [Elizabethan/Jacobean] conventions of [mourning/succession/court protocol], Hamlet's grief would have been read as...",
        AO5: "Where [critic A] reads Hamlet's grief as [position], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "C.S. Lewis", position: "The subject of Hamlet is not grief but the fear of what comes after death — the Ghost makes mortality's aftermath the play's real concern", embed: "Lewis's reading redirects attention from grief to dread: 'Hamlet's tragedy is a tragedy of the afterlife', and his grief is inseparable from his terror of what the Ghost has revealed." },
        { critic: "Janet Adelman", position: "Hamlet's grief is contaminated by his crisis about maternal sexuality — he cannot mourn his father cleanly because Gertrude's remarriage has poisoned the loss", embed: "Adelman argues that Hamlet's grief is 'impure from the start', entangled with rage at his mother, making mourning impossible as a clean emotional process." },
        { critic: "Peter Sacks", position: "The soliloquies are grief work — Hamlet's language is the drama's attempt to process loss through the only means available to the self-conscious mourner", embed: "Sacks reads the soliloquies through the lens of elegy, arguing that Hamlet's linguistic elaborations are 'the work of mourning' — attempts to metabolise loss that the court's time-frame refuses." },
      ],
      model_paragraph: "Shakespeare presents grief in Hamlet as the play's most politically charged emotion — an insistence on loss that Claudius's regime cannot accommodate. The court's opening pressure on Hamlet to 'cast thy nighted colour off' and 'throw to earth / This unprevailing woe' reveals grief as a political problem before it is a personal one: the smooth performance of succession requires that loss be brief, manageable, and publicly concluded. Hamlet's first soliloquy refuses this demand entirely — 'O that this too too solid flesh would melt' — establishing grief not as a phase to be passed through but as a totalising condition that reshapes his entire perception of the world. Peter Sacks's reading of the soliloquies as 'the work of mourning' is apt here: Hamlet's language proliferates precisely because grief demands elaboration that the court's abbreviated protocols deny. Yet Adelman's complication is essential: Hamlet's grief is 'impure from the start', entangled with the rage at maternal betrayal that precedes the Ghost's revelation. The result is a grief that cannot be resolved — not because Hamlet is constitutionally incapable of resolution, but because what he is mourning is not simply his father's death but the collapse of an entire symbolic order.",
    } },
  { id: 'ham-2023-b', year: 2023, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore Shakespeare's presentation of Laertes in Hamlet.",
    themes: ['laertes','supporting characters','revenge','honour','foil'],
    framework: {
      thesis: "Shakespeare presents Laertes as Hamlet's most purposeful foil — a character who embodies the action-oriented revenge hero that Hamlet cannot be, and whose very success in this role exposes the moral bankruptcy of the revenger's code.",
      paragraph_plan: [
        { topic: "Laertes as foil — action versus reflection", ao_focus: ['AO1','AO2'], topic_sentence: "Shakespeare constructs Laertes as Hamlet's structural double — facing an identical provocation (a murdered father) but responding with the decisive action Hamlet cannot produce." },
        { topic: "Laertes and the corruption of revenge", ao_focus: ['AO1','AO2'], topic_sentence: "Laertes's willingness to 'cut [Hamlet's] throat i'th'church' exposes the moral cost of the revenger's code — decisive action, Shakespeare implies, requires the suspension of ethical scruple." },
        { topic: "The duel — both as instruments of Claudius", ao_focus: ['AO1','AO2'], topic_sentence: "The final duel positions both Laertes and Hamlet as instruments of Claudius's manipulation — their opposition collapses into mutual destruction engineered by the play's true villain." },
        { topic: "Critical perspectives on Laertes", ao_focus: ['AO5'], topic_sentence: "Critics have debated whether Laertes is a straightforwardly heroic contrast to Hamlet or a figure whose moral compromises indict the revenge ethos he embodies." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents Laertes as [foil/double/instrument] — his [action/speech] reveals, by contrast, that Hamlet...",
        AO2: "The [technique] of '[quote]' positions Laertes as [quality], with the effect that...",
        AO3: "Within [Jacobean/Renaissance] constructions of [revenge/honour/masculinity], Laertes's response would have been read as...",
        AO5: "Where [critic A] reads Laertes as [position], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "A.C. Bradley", position: "Laertes is an imperfect foil — his moral compromises (the poisoned sword, the unhatched plot) undermine the heroic contrast he is meant to provide", embed: "Bradley notes that Laertes's willingness to use underhanded means 'diminishes him' as a heroic counterweight to Hamlet, suggesting Shakespeare deliberately complicates the foil relationship." },
        { critic: "Harold Jenkins", position: "Laertes functions as a mirror image of Hamlet — facing the same situation, he takes the path Hamlet cannot, and the results are equally catastrophic", embed: "Jenkins reads the structural parallel between Hamlet and Laertes as Shakespeare's most deliberate design: 'both are sons who have lost their fathers', and both are destroyed by the same system." },
        { critic: "Margreta de Grazia", position: "Laertes's role in the final scene is to bring about the catastrophe that Hamlet's own hesitation has repeatedly deferred", embed: "De Grazia positions Laertes as the structural agent of the play's conclusion — his poisoned sword is the instrument through which the tragedy's deferred inevitability is finally realised." },
      ],
      model_paragraph: "Shakespeare constructs Laertes as Hamlet's most precise structural foil — a character who faces an identical provocation (a murdered father, a demand for revenge) and responds with the unequivocal action that Hamlet cannot produce. Where Hamlet meditates, theorises, and delays, Laertes storms the palace with a mob at his back and declares 'To hell, allegiance! Vows to the blackest devil! / Conscience and grace, to the profoundest pit!' — a wholesale suspension of ethical scruple that the play presents as both admirable in its decisiveness and catastrophic in its moral cost. Jenkins's reading of the parallel as Shakespeare's most deliberate structural design is compelling: both are sons who have lost their fathers, both are instruments of Claudius's manipulation, and both are destroyed by a system that has manufactured their conflict. Yet Bradley's complication is essential: Laertes's willingness to 'cut his throat i'th'church' and his agreement to the poisoned sword 'diminishes him' as a heroic alternative to Hamlet's scruples. De Grazia's positioning of Laertes as the structural agent of the play's deferred conclusion — his poisoned sword the mechanism through which inevitability is finally realised — suggests that Shakespeare's foil relationship is not simply a contrast between action and inaction, but an indictment of both.",
    } },
  { id: 'mal-2023-a', year: 2023, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore how Webster makes use of secrets and lies in The Duchess of Malfi.',
    themes: ['secrets','deception','uncertainty','surveillance','identity'],
    framework: {
      thesis: "Webster makes use of secrets and lies in The Duchess of Malfi as the primary mechanism through which power is exercised and resisted — the secret marriage is the play's generative act of resistance, and the apparatus of surveillance deployed to uncover it is the play's most complete embodiment of how power operates in a corrupt world.",
      paragraph_plan: [
        { topic: "The secret marriage as act of resistance", ao_focus: ['AO1','AO2'], topic_sentence: "The Duchess's secret marriage is not merely a romantic choice but a political act — the secrecy is constitutive of its resistance, an assertion of autonomous selfhood within a surveillance state." },
        { topic: "The surveillance apparatus — Bosola and the brothers", ao_focus: ['AO2','AO3'], topic_sentence: "The elaborate machinery deployed to uncover the secret — Bosola's intelligencing, the apricot test, the staged madhouse — reveals how much power requires the management of secrets to sustain itself." },
        { topic: "Lies and their consequences", ao_focus: ['AO1','AO2'], topic_sentence: "The dead hand and wax figures are lies — fabricated objects deployed to destroy the Duchess's psychological resistance — and their power reveals how lies can be weaponised as instruments of torture." },
        { topic: "Critical perspectives on secrets and lies", ao_focus: ['AO3'], topic_sentence: "Critics have read the play's economy of secrets within Jacobean anxieties about surveillance, counsel, and the relationship between public performance and private truth." },
      ],
      sentence_stems: {
        AO1: "Webster makes use of secrets and lies to [expose/dramatise/resist] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes [secret/lie] through [effect], suggesting that...",
        AO3: "Within Jacobean anxieties about [surveillance/court counsel/public/private], secrets carried the weight of...",
      },
      critic_positions: [
        { critic: "Lisa Hopkins", position: "The secret marriage is the play's most radical gesture — a deliberate act of resistance that creates a private space within a totalising surveillance apparatus", embed: "Hopkins reads the secret marriage as 'a utopian gesture within a dystopian world', the Duchess's construction of a private truth as the play's most politically charged act of self-assertion." },
        { critic: "Frank Whigham", position: "The brothers' obsession with uncovering the secret reflects aristocratic anxieties about blood contamination — the secret they seek to expose is not merely romantic but genealogical", embed: "Whigham reads the surveillance apparatus as ideologically driven: 'the brothers' need to know is the need of a class to police its bloodline', making the uncovering of the secret a matter of aristocratic survival rather than personal jealousy." },
        { critic: "Catherine Belsey", position: "The play's secrets resist the audience's desire for disclosure as much as the brothers' — Webster withholds full intelligibility as a deliberate aesthetic strategy", embed: "Belsey argues that Webster's 'systematic withholding' extends to the audience: 'the play's secrets are never fully disclosed', making the audience complicit in the same epistemological uncertainty that paralyses its characters." },
      ],
      model_paragraph: "Webster positions the Duchess's secret marriage as the play's generative act of resistance — a deliberate creation of private truth within a world given over entirely to surveillance. Hopkins's reading of the secret marriage as 'a utopian gesture within a dystopian world' captures its political charge: by marrying Antonio in secret, the Duchess does not merely choose a husband but asserts the existence of a private self that the brothers' surveillance apparatus has no right to penetrate. The elaborate machinery deployed in response — Bosola's intelligencing, the apricot stratagem, the psychological torture of the fabricated dead hand and wax figures — reveals, as Whigham argues, how much the brothers' need to know is 'the need of a class to police its bloodline': the secret they seek to expose is genealogical before it is romantic. The fabricated objects of Act 4 constitute lies weaponised as torture instruments — the dead hand and wax figures are not merely cruel but specifically epistemological, designed to destroy the Duchess's confidence in her own knowledge of reality. Belsey's observation that the play's secrets resist full disclosure even for the audience deepens the analysis: Webster does not simply stage the management of secrets, he implicates the audience in the same epistemological uncertainty, making the experience of watching Malfi as much about the limits of knowledge as about the violence that results from its pursuit.",
    } },
  { id: 'mal-2023-b', year: 2023, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore Webster's presentation of gender roles in The Duchess of Malfi.",
    themes: ['gender','patriarchy','power','identity','duchess'],
    framework: {
      thesis: "Webster's presentation of gender roles in The Duchess of Malfi constitutes a radical interrogation of patriarchal ideology — the play exposes the mechanisms through which female autonomy is denied, while simultaneously constructing in the Duchess a figure whose resistance to those mechanisms makes her the drama's moral and political centre.",
      paragraph_plan: [
        { topic: "The ideology of female enclosure — 'cased up like a holy relic'", ao_focus: ['AO2','AO3'], topic_sentence: "Webster's relic imagery exposes how female sanctity is ideologically constructed as a mechanism of enclosure — the Duchess is preserved not for her own sake but for the brothers' honour." },
        { topic: "The Duchess as gender transgressor", ao_focus: ['AO1','AO2'], topic_sentence: "The Duchess's autonomous choice of husband, her direct courtship of Antonio, and her defiant self-identification as 'Duchess of Malfi still' constitute a systematic transgression of the gender roles her brothers seek to enforce." },
        { topic: "Bosola and the gendered gaze", ao_focus: ['AO2','AO3'], topic_sentence: "Bosola's surveillance of the Duchess's body — most explicitly in the apricot scene, which is designed to reveal a pregnancy — enacts a specifically masculine form of knowledge-as-control." },
        { topic: "Critical perspectives on gender", ao_focus: ['AO3'], topic_sentence: "Feminist critics have reclaimed the play as a foundational text for gender analysis, while historicist readings have contextualised its gender politics within Jacobean constructions of femininity and aristocratic honour." },
      ],
      sentence_stems: {
        AO1: "Webster presents gender roles as [ideologically constructed/sites of resistance/instruments of power] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes gender [ideology/resistance] through [effect], suggesting that...",
        AO3: "Within Jacobean constructions of [femininity/widowhood/aristocratic honour], the Duchess's behaviour would have been read as...",
      },
      critic_positions: [
        { critic: "Dympna Callaghan", position: "The play's gender politics are organised around the control of female reproductivity — the Duchess's body is the primary site of ideological contestation", embed: "Callaghan argues that the brothers' violence is 'organised around the management of female reproductivity', making the Duchess's pregnant body the play's central political battleground." },
        { critic: "Susan Zimmerman", position: "The Duchess's courtship of Antonio is a radical gender reversal — she adopts the masculine role of wooer within a culture that denies women this agency", embed: "Zimmerman reads the wooing scene as 'a deliberate inversion of gender convention', the Duchess's adoption of the active courtship role constituting a transgression of Jacobean gender norms that would have been immediately legible to the original audience." },
        { critic: "Lisa Hopkins", position: "'I am Duchess of Malfi still' is the play's most radical gender statement — the Duchess refuses to allow external degradation to define her identity", embed: "Hopkins reads the declaration as 'the play's most powerful assertion of female selfhood', a claim to an interior identity that patriarchal power cannot reach even through the systematic destruction of her external circumstances." },
      ],
      model_paragraph: "Webster presents the gender roles of The Duchess of Malfi as a system of ideological enclosure — the brothers' insistence that the Duchess remain 'cased up like a holy relic' exposes how female sanctity is not a condition of spiritual value but a mechanism of patriarchal control. Callaghan's feminist analysis is precise: the brothers' violence is 'organised around the management of female reproductivity', making the apricot scene — designed by Bosola to detect pregnancy — the play's most literal enactment of the female body as political battleground. Against this enclosure, the Duchess constructs an active counter-gender performance: Zimmerman's reading of the wooing scene as 'a deliberate inversion of gender convention' captures the radical charge of a woman adopting the masculine role of wooer within a culture that explicitly denies her this agency. Yet Webster's most powerful gender statement comes not in action but in language — Hopkins's reading of 'I am Duchess of Malfi still' as 'the play's most powerful assertion of female selfhood' identifies the moment at which the Duchess refuses to allow the systematic destruction of her external circumstances to determine her interior identity. The declaration's economy — five words, one claim — enacts the resistance it states: in the face of the brothers' elaborate torture apparatus, the Duchess's self-definition is both minimal and absolute.",
    } },

  // 2024
  { id: 'ham-2024-a', year: 2024, play: 'HAM', section: 'A', option: 'EITHER',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: 'Explore how Shakespeare presents the relationship between Hamlet and Ophelia in Hamlet.',
    themes: ['ophelia','relationships','gender','madness','patriarchy'],
    framework: {
      thesis: "Shakespeare presents the relationship between Hamlet and Ophelia as the play's most painful casualty of a corrupt political order — a bond that might have been redemptive is systematically destroyed by surveillance, patriarchal control, and the demands of Hamlet's revenge mission, leaving Ophelia as the most eloquent victim of Elsinore's corruption.",
      paragraph_plan: [
        { topic: "The relationship before the play — what is lost", ao_focus: ['AO1','AO3'], topic_sentence: "Shakespeare establishes through retrospective accounts that Hamlet and Ophelia's relationship pre-existed the play's action, making its destruction a measure of what Claudius's regime has cost." },
        { topic: "The nunnery scene — weaponisation of intimacy", ao_focus: ['AO2'], topic_sentence: "The nunnery scene transforms the relationship's history into a weapon — Hamlet deploys their intimacy as a vehicle for cruelty that serves his strategic purposes while destroying Ophelia." },
        { topic: "Ophelia's madness as the relationship's aftermath", ao_focus: ['AO2'], topic_sentence: "Ophelia's mad songs encode the history of the relationship in fragmented form, transforming private grief into public spectacle and indicting Hamlet as much as Claudius." },
        { topic: "Critical perspectives on the relationship", ao_focus: ['AO5'], topic_sentence: "Critics debate whether Hamlet's treatment of Ophelia is strategic performance or genuine cruelty — and whether the distinction matters." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents the relationship between Hamlet and Ophelia as [casualty/symptom/measure] of — in [scene], this manifests as...",
        AO2: "The [technique] in '[quote]' encodes the relationship's [destruction/complexity] through [effect], suggesting that...",
        AO3: "Within [Jacobean/Elizabethan] constructions of [courtship/female honour/male authority], the relationship would have been read as...",
        AO5: "Where [critic A] reads Hamlet's treatment of Ophelia as [position], [critic B] argues that...",
      },
      critic_positions: [
        { critic: "Janet Adelman", position: "Hamlet's relationship with Ophelia is contaminated from the start by his crisis about maternal sexuality — Ophelia becomes the target of rage that properly belongs to Gertrude", embed: "Adelman argues that Hamlet displaces his rage at Gertrude onto Ophelia: 'Get thee to a nunnery' is addressed to his mother as much as to Ophelia, making the relationship's destruction a symptom of a deeper psychic wound." },
        { critic: "Elaine Showalter", position: "Ophelia's relationship with Hamlet has been read through his perspective — feminist recovery requires reading it through hers", embed: "Showalter argues that 'Ophelia's story becomes most powerful' when recovered from Hamlet's narrative, positioning her as a figure of complex interiority rather than passive victimhood." },
        { critic: "Carol Thomas Neely", position: "The relationship's destruction is not Hamlet's fault alone — the surveillance apparatus of Polonius and Claudius weaponises it", embed: "Neely reads the nunnery scene as engineered by Polonius and Claudius rather than originating in Hamlet's cruelty, positioning the relationship's destruction as a structural rather than personal tragedy." },
      ],
      model_paragraph: "Shakespeare presents the relationship between Hamlet and Ophelia as the play's most precise measure of what Claudius's regime has destroyed. The nunnery scene — engineered by Polonius and Claudius, as Neely argues, rather than originating in Hamlet's autonomous cruelty — transforms a relationship of apparent intimacy into an instrument of surveillance and political management. Hamlet's eruption, 'Get thee to a nunnery, go, farewell — or if thou wilt needs marry, marry a fool, for wise men know well enough what monsters you make of them', deploys the language of intimacy as a weapon: the familiarity that makes the cruelty cut is itself evidence of what the relationship once was. Adelman's reading complicates this further — Hamlet's rage at Ophelia is displaced from Gertrude, making the nunnery scene an act of misdirected violence that has nothing to do with Ophelia's own behaviour. Showalter's feminist insistence on reading the relationship through Ophelia's perspective rather than Hamlet's positions the mad songs of Act 4 as the relationship's most honest account: fragmented, encoded, denied the coherent narrative that only survives for those the court permits to speak.",
    } },
  { id: 'ham-2024-b', year: 2024, play: 'HAM', section: 'A', option: 'OR',
    totalMarks: 35, aos: ['AO1','AO2','AO3','AO5'],
    aoWeightings: HAMLET_AO_WEIGHTS,
    question: "Explore the extent to which Shakespeare's Hamlet is a play full of doubt and confusion.",
    themes: ['uncertainty','doubt','deception','mortality','madness'],
    framework: {
      thesis: "Shakespeare constructs Hamlet as a play in which doubt and confusion are not incidental features but constitutive principles — the play does not resolve its uncertainties because it is structured to refuse resolution, positioning epistemological instability as the only honest response to a world in which truth is irretrievably contaminated.",
      paragraph_plan: [
        { topic: "The Ghost — doubt at the source", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The Ghost's ambiguous ontological status — potentially a devil exploiting Hamlet's grief — ensures that the play's foundational 'fact' remains permanently doubtful." },
        { topic: "Language and confusion — the gap between word and meaning", ao_focus: ['AO2'], topic_sentence: "Shakespeare encodes confusion into the play's linguistic texture — soliloquies that reason in circles, asides that contradict public speech, and puns that generate meaning by refusing to settle." },
        { topic: "Confusion as political symptom", ao_focus: ['AO1','AO3'], topic_sentence: "The confusion that pervades Hamlet is not simply Hamlet's — it is a structural feature of a court in which performed surfaces have replaced truth." },
        { topic: "The extent question — is resolution possible?", ao_focus: ['AO1','AO5'], topic_sentence: "The question of 'extent' demands critical engagement: whether the play's doubt and confusion are ultimately resolved — or whether the ending provides closure without genuine resolution." },
      ],
      sentence_stems: {
        AO1: "Shakespeare presents doubt and confusion as [structural/constitutive/symptomatic] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' generates confusion through [effect], refusing to resolve...",
        AO3: "Within [post-Reformation/Jacobean] epistemological anxieties, the doubt in Hamlet carries the cultural weight of...",
        AO5: "The extent to which Hamlet is 'a play full of doubt' is contested: where [critic A] argues [position], [critic B] suggests...",
      },
      critic_positions: [
        { critic: "William Empson", position: "The play's ambiguity is deliberate and unresolvable — Shakespeare constructed irreducible complexity as an artistic strategy", embed: "Empson's reading positions the play's doubt as intentional: Shakespeare built 'a character who could not make up his mind' as a vehicle for exploring the limits of human knowledge, not as an artistic failure." },
        { critic: "Stephen Greenblatt", position: "The doubt in Hamlet reflects specifically post-Reformation anxieties — the Ghost is theologically impossible in a Protestant world", embed: "Greenblatt's historical reading positions the play's doubt as culturally specific: 'the dead could no longer return' in Protestant theology, making the Ghost's existence — and therefore Hamlet's entire mission — permanently uncertain." },
        { critic: "A.C. Bradley", position: "The confusion in Hamlet is a symptom of character rather than design — it reflects Hamlet's exceptional but paralysed consciousness", embed: "Bradley's psychological reading locates the play's doubt in Hamlet's 'disturbance of the relation between the power of meditating and the power of acting' — confusion as character flaw rather than structural principle." },
      ],
      model_paragraph: "Shakespeare constructs doubt and confusion as the play's constitutive principles rather than incidental features, ensuring that even the play's apparent resolutions generate further uncertainty. The Ghost's ambiguous ontological status — Hamlet himself acknowledges it may be 'a devil' assuming 'a pleasing shape' to 'abuse me to damn me' — means that the foundational 'fact' on which the entire revenge plot rests is permanently doubtful. Greenblatt's historical contextualisation is decisive here: the abolition of purgatory by Protestant theology had, as he argues, made the Ghost theologically impossible — its presence generating an uncertainty that no theatrical proof can resolve. Empson's counter-reading — that this ambiguity is Shakespeare's deliberate artistic strategy rather than a problem to be solved — reframes the question: the play does not fail to resolve its doubts, it refuses to, positioning irresolution as the only epistemologically honest response to a world in which Claudius can smile and be a villain. Bradley's reading that the confusion reflects Hamlet's character rather than the play's design is, on this account, insufficient: the confusion is not Hamlet's alone, it is Denmark's — a structural feature of a court in which, as Marcellus observes from the very first act, 'Something is rotten.'",
    } },
  { id: 'mal-2024-a', year: 2024, play: 'MAL', section: 'B', option: 'EITHER',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: 'Explore the extent to which Webster presents The Duchess of Malfi as a critique of contemporary society.',
    themes: ['society','corruption','power','gender','court'],
    framework: {
      thesis: "Webster presents The Duchess of Malfi as a sustained critique of Jacobean society — the play exposes the mechanisms through which aristocratic power is maintained through the management of female bodies, the corruption of institutional authority, and the systematic subordination of moral agency to political survival.",
      paragraph_plan: [
        { topic: "The court as social critique", ao_focus: ['AO2','AO3'], topic_sentence: "Antonio's opening speech establishes the play's critical framework — the ideal of the French court as corrective model against which the Aragonese court's total corruption is measured." },
        { topic: "Gender and social order", ao_focus: ['AO1','AO2','AO3'], topic_sentence: "The brothers' control of the Duchess reflects and critiques a social order in which female autonomy is systematically denied in the service of aristocratic inheritance and class purity." },
        { topic: "The limits of the critique — does Webster offer alternatives?", ao_focus: ['AO1','AO2'], topic_sentence: "The extent question demands engagement with whether Webster's critique is reformist or nihilistic — whether the play proposes alternatives to the society it anatomises or merely stages its destruction." },
        { topic: "Critical perspectives on social critique", ao_focus: ['AO3'], topic_sentence: "Critics have debated the extent to which Malfi constitutes a genuine social critique or merely exploits social corruption for theatrical effect." },
      ],
      sentence_stems: {
        AO1: "Webster presents [aspect of society] as [corrupted/critiqued/exposed] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes social critique through [effect], suggesting that...",
        AO3: "Within the Jacobean context of [social mobility/aristocratic anxiety/court corruption], Webster's critique would have been read as...",
      },
      critic_positions: [
        { critic: "Frank Whigham", position: "The play's social critique is historically specific — Webster anatomises a class system in crisis, its violence the symptom of aristocratic anxiety about social mobility", embed: "Whigham reads the play as 'a diagnosis of a class in terminal decline', its violence 'the violence of a system that has outlived its moral justification'." },
        { critic: "Dympna Callaghan", position: "The play's critique is primarily feminist — it exposes the mechanisms through which patriarchal society controls female bodies and punishes female autonomy", embed: "Callaghan argues that Webster's social critique is 'organised around the body of the Duchess', making gender the primary axis of a social analysis that extends to questions of class, power, and institutional authority." },
        { critic: "Catherine Belsey", position: "The play's critique is radical but not reformist — Webster exposes the contradictions of his society without proposing their resolution", embed: "Belsey reads Malfi as 'a radical but not a revolutionary text', one that 'anatomises its society's contradictions' without proposing the alternative social arrangements that would resolve them." },
      ],
      model_paragraph: "Webster constructs the critique of contemporary society in The Duchess of Malfi through a structural irony that makes the ideal the measure of the actual. Antonio's description of the French court as a fountain of 'pure silver drops' — immediately followed by the spectacle of its Aragonese antithesis — establishes the critical framework: a society is being judged against its own stated values and found catastrophically wanting. Whigham's historicist reading positions the critique as class-specific: the brothers' violence is 'the violence of a system that has outlived its moral justification', the Aragonese court a class in terminal decline whose aristocratic anxieties about blood contamination have transformed family into an instrument of destruction. Callaghan's feminist analysis deepens this: the play's critique is 'organised around the body of the Duchess', making gender the primary axis through which social power is exercised and exposed. Yet Belsey's observation that the critique is 'radical but not revolutionary' — that Webster 'anatomises his society's contradictions' without proposing their resolution — is the most precise characterisation of the play's political mode: the closing moral ('Integrity of life is fame's best friend') offers the consolation of a social value without the social conditions that would make it achievable, positioning Webster's critique as diagnosis without remedy.",
    } },
  { id: 'mal-2024-b', year: 2024, play: 'MAL', section: 'B', option: 'OR',
    totalMarks: 25, aos: ['AO1','AO2','AO3'],
    aoWeightings: MALFI_AO_WEIGHTS,
    question: "Explore the presentation of Ferdinand in Webster's The Duchess of Malfi.",
    themes: ['ferdinand','power','gender','madness','violence','control'],
    framework: {
      thesis: "Webster presents Ferdinand as the play's most psychologically extreme figure — a character in whom the ideological imperatives of aristocratic honour and patriarchal control are so thoroughly internalised that they produce, inevitably, psychological disintegration, making Ferdinand simultaneously the system's most devoted servant and its most spectacular victim.",
      paragraph_plan: [
        { topic: "Ferdinand's control — surveillance as pathology", ao_focus: ['AO2'], topic_sentence: "Ferdinand's pre-emptive surveillance of his sister — 'I would have you give o'er these chargeable revels' precedes any transgression — reveals a controlling impulse that the play codes as pathological from the outset." },
        { topic: "The incestuous subtext", ao_focus: ['AO2','AO3'], topic_sentence: "Webster encodes Ferdinand's motivation in the language of incestuous obsession without ever making it explicit — 'Damn her! that body of hers' fragments under the pressure of a desire the play refuses to name." },
        { topic: "Lycanthropy — the body turned against itself", ao_focus: ['AO2'], topic_sentence: "Ferdinand's lycanthropic delusion — believing himself to be a wolf unearthing corpses — is the logical endpoint of the animal imagery that has characterised him throughout: corruption made literal, the beast finally visible beneath the aristocrat." },
        { topic: "Critical perspectives on Ferdinand", ao_focus: ['AO3'], topic_sentence: "Critics have debated Ferdinand's motivation — whether his obsession is primarily incestuous, ideological, or psychological — and what his disintegration reveals about the play's wider social vision." },
      ],
      sentence_stems: {
        AO1: "Webster presents Ferdinand as [pathological/ideologically driven/psychologically disintegrating] — in [scene], this manifests as...",
        AO2: "The [technique] of '[quote]' encodes Ferdinand's [quality] through [effect], suggesting that...",
        AO3: "Within Jacobean constructions of [aristocratic honour/incest/lycanthropy], Ferdinand's behaviour would have been read as...",
      },
      critic_positions: [
        { critic: "Frank Whigham", position: "Ferdinand's obsession is ideologically rather than psychologically driven — his incestuous desire is the displaced anxiety of a class defending its bloodline", embed: "Whigham reads Ferdinand's 'dark desire' as 'the desire of a class rather than an individual', a displacement of aristocratic anxiety about blood contamination into the register of personal obsession." },
        { critic: "Dympna Callaghan", position: "Ferdinand's relationship with his sister enacts a specifically patriarchal form of sexual violence — his control of her body is the most extreme expression of the play's gender politics", embed: "Callaghan reads Ferdinand's obsession as 'the patriarchal logic of sexual possession taken to its pathological extreme', making his breakdown the inevitable consequence of a system that has licensed this logic without limit." },
        { critic: "Lisa Hopkins", position: "Ferdinand's lycanthropy is the play's most powerful symbolic statement — the aristocrat's human mask removed to reveal the beast that power has always been", embed: "Hopkins reads the lycanthropy as 'the literalisation of a metaphor the play has been building throughout', Ferdinand's transformation into a wolf the moment at which the play's animal imagery achieves its fullest and most devastating expression." },
      ],
      model_paragraph: "Webster presents Ferdinand's controlling relationship with his sister as the system's logic taken to its pathological extreme. The opening instruction — 'I would have you give o'er these chargeable revels' — establishes surveillance before any transgression has occurred, revealing a controlling impulse that has no object beyond control itself. Whigham's historicist reading positions this as ideological before it is personal: Ferdinand's obsession is 'the desire of a class rather than an individual', his need to manage his sister's sexuality a displacement of aristocratic anxiety about blood contamination into the register of personal obsession. Yet Callaghan's feminist analysis insists on the sexual violence at its core: Ferdinand's behaviour is 'the patriarchal logic of sexual possession taken to its pathological extreme', his eruption at news of the Duchess's pregnancy — 'Damn her! that body of hers' — revealing an investment in her body that the ideological language of honour cannot adequately contain. Hopkins's reading of the lycanthropy as 'the literalisation of a metaphor the play has been building throughout' positions Ferdinand's breakdown as the play's most honest moment: the animal imagery that has characterised him since Act 1 finally achieves its fullest expression, the aristocratic mask removed to reveal the beast that power, freed from accountability, has always been.",
    } },
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
