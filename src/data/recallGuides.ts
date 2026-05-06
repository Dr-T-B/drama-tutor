import type { AOKey } from './actScenes';

export interface QuotePackage {
  speaker: string;
  act: string;
  text: string;
  methods: string[];
  meaning: string;
  aos: AOKey[];
}

export interface GuideTheme {
  name: string;
  anchorQuote: string;
  method: string;
  aos: AOKey[];
  packages: QuotePackage[];
}

export interface Critic {
  name: string;
  position: string;
  themes: string[];
}

export interface CrossTextConnection {
  title: string;
  detail: string;
}

export interface RecallGuide {
  play: 'HAM' | 'MAL';
  section: 'A' | 'B';
  subtitle: string;
  ao4Note: string;
  themes: GuideTheme[];
  critics: Critic[];
  crossText?: CrossTextConnection[];
  recoveryMoves: { title: string; detail: string }[];
  modelParagraph: { theme: string; quote: string; text: string };
}

export const recallGuides: RecallGuide[] = [

  // ─── HAMLET ──────────────────────────────────────────────────────

  {
    play: 'HAM',
    section: 'A',
    subtitle: 'Hamlet · Shakespeare · Section A',
    ao4Note: 'AO4 in Section A means cross-text connections to The Duchess of Malfi — not a separate paragraph but a clause that deepens your reading. Use it to contrast method, staging, or ideology between the two plays.',
    themes: [
      {
        name: 'Corruption and political decay',
        anchorQuote: '"Something is rotten in the state of Denmark"',
        method: 'Organic decay metaphor / metonymy',
        aos: ['AO2', 'AO3', 'AO4'],
        packages: [
          {
            speaker: 'Marcellus',
            act: 'Act 1, Scene 4',
            text: '"Something is rotten in the state of Denmark"',
            methods: ['Organic decay metaphor', 'Metonymy (state = political body)', 'Deliberate vagueness of "something"'],
            meaning: 'Corruption is systemic, not individual. "Something" identifies rot without naming its source — enacting the epistemological uncertainty structuring the whole play. Spoken by a marginal soldier, not a courtier, because truth cannot be spoken at the centre of power. AO3: Jacobean anxieties about succession and the king\'s two bodies make the body-politic metaphor politically precise.',
            aos: ['AO1', 'AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Ghost',
            act: 'Act 1, Scene 5',
            text: '"The serpent that did sting thy father\'s life / Now wears his crown"',
            methods: ['Reptilian metaphor', 'Paradox of murderer-king', 'Eden displacement imagery'],
            meaning: 'Claudius is reconfigured as the serpent of Genesis — the usurpation is a theological fall, not merely a political crime. The crown becomes a mark of corruption rather than legitimacy. AO3: the serpent imagery invokes both Genesis and Virgil\'s Aeneid — classical and Biblical authority underwrite the Ghost\'s accusation.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 2, Scene 2',
            text: '"Denmark\'s a prison"',
            methods: ['Compressed political metaphor', 'Declarative bluntness', 'Spatial constriction'],
            meaning: 'The reduction of an entire state to a prison collapses political geography into bodily confinement. Hamlet is physically and epistemologically trapped — nowhere in Denmark is outside Claudius\'s surveillance apparatus. AO4: compare with Webster\'s Malfi court — both plays construct the court as a carceral machine.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
        ],
      },
      {
        name: 'Revenge and moral paralysis',
        anchorQuote: '"How all occasions do inform against me"',
        method: 'Personification / self-accusatory register',
        aos: ['AO1', 'AO2', 'AO5'],
        packages: [
          {
            speaker: 'Hamlet',
            act: 'Act 4, Scene 4',
            text: '"How all occasions do inform against me"',
            methods: ['Personification of circumstance', 'Self-accusatory register', 'Legal register of "inform"'],
            meaning: 'Hamlet casts himself as defendant in a moral trial where all evidence convicts him of inaction. "Inform against" carries legal weight — he is testifying against himself. The soliloquy reveals that the problem of revenge is not external obstacle but internal dissonance. AO5: Bradley reads this as tragic overthinking; de Grazia argues the delay is structural (land inheritance), not psychological.',
            aos: ['AO1', 'AO2', 'AO5'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 3, Scene 3',
            text: '"Now might I do it pat, now he is praying"',
            methods: ['Monosyllabic directness undercut by subsequent qualification', 'Colloquial "pat"', 'Dramatic irony (Claudius not absolved)'],
            meaning: 'The brutal simplicity of "pat" performs the very decisiveness Hamlet cannot sustain — it is immediately reversed by the qualification that follows. The dramatic irony is devastating: Claudius\'s prayer failed; Hamlet\'s theological reasoning had no basis. He delays killing a man who was not, in fact, being absolved.',
            aos: ['AO1', 'AO2', 'AO3'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 1, Scene 5',
            text: '"O, cursed spite / That ever I was born to set it right"',
            methods: ['Apostrophe to abstraction', 'Enjambment across duty and burden', 'Passive construction of fate'],
            meaning: 'The enjambment enacts Hamlet\'s relationship to revenge — the line runs on before the full weight of "set it right" arrives. Being "born to" it positions revenge as destiny; Hamlet frames that destiny as a curse, not a calling. This is the structural problem of the entire play compressed into two lines.',
            aos: ['AO1', 'AO2', 'AO5'],
          },
        ],
      },
      {
        name: 'Madness — performed and real',
        anchorQuote: '"I am but mad north-north-west"',
        method: 'Compass metaphor / theatrical self-performance',
        aos: ['AO2', 'AO4', 'AO5'],
        packages: [
          {
            speaker: 'Hamlet',
            act: 'Act 2, Scene 2',
            text: '"I am but mad north-north-west: when the wind is southerly I know a hawk from a handsaw"',
            methods: ['Compass metaphor', 'Deliberate semantic incoherence as performance', 'Theatrical self-awareness', 'Proverbial deflection'],
            meaning: 'The precision of "north-north-west" introduces navigational exactitude into deliberate incoherence — Hamlet\'s intellect controls what appears uncontrolled. In a court of total surveillance, performed madness is a political survival strategy. AO5: Kott reads Elsinore as a totalitarian machine — Hamlet\'s coded speech is legible only to the audience and Horatio, creating a theatrical privilege that implicates the audience in resistance.',
            aos: ['AO2', 'AO3', 'AO4', 'AO5'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 1, Scene 5',
            text: '"To put an antic disposition on"',
            methods: ['Theatrical metalanguage', 'Costume metaphor implicit in "put on"', 'Infinitive of deliberate choice'],
            meaning: 'The phrase "put on" signals conscious performance — madness is a garment, a theatrical device. "Antic" carries the Elizabethan resonance of the professional fool. Hamlet scripts his own role within the court\'s political drama, making him simultaneously character and playwright. AO4: the self-referential theatricality anticipates the Mousetrap — Hamlet is always staging something.',
            aos: ['AO2', 'AO4'],
          },
          {
            speaker: 'Ophelia',
            act: 'Act 3, Scene 1',
            text: '"O, what a noble mind is here o\'erthrown!"',
            methods: ['Apostrophic elegy', 'Military metaphor ("o\'erthrown")', 'Dramatic irony (Ophelia\'s own fate)'],
            meaning: 'Ophelia mourns Hamlet\'s apparent collapse in terms that will precisely describe her own genuine breakdown in Act 4. "O\'erthrown" figures madness as military defeat — a toppling of rational governance. The dramatic irony is structurally devastating: her diagnosis of him becomes her own epitaph. AO5: Adelman reads this moment as the scene\'s inversion of expected gendered hierarchy — Ophelia is briefly the rational mourner of male rationality.',
            aos: ['AO1', 'AO2', 'AO3', 'AO5'],
          },
        ],
      },
      {
        name: 'Death and existential uncertainty',
        anchorQuote: '"The undiscovered country, from whose bourn / No traveller returns"',
        method: 'Spatial metaphor / euphemistic circumlocution',
        aos: ['AO2', 'AO3', 'AO5'],
        packages: [
          {
            speaker: 'Hamlet',
            act: 'Act 3, Scene 1',
            text: '"The undiscovered country, from whose bourn / No traveller returns"',
            methods: ['Spatial metaphor for death', 'Colonial/cartographic register', 'Enjambment reinforcing irreversibility'],
            meaning: 'Death is mapped as unexplored territory — but unlike colonial exploration, it cannot be reported back. The enjambment performs the irrevocability: the line runs past "bourn" (boundary) into the clause of impossibility. AO3: the Reformation had removed purgatory, leaving Protestant culture without a map of the afterlife — Hamlet\'s uncertainty is theologically precise.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 5, Scene 1',
            text: '"Alas, poor Yorick! I knew him, Horatio"',
            methods: ['Prosopopoeia (addressing the skull)', 'Collapsing abstract death into physical intimacy', 'Bathetic simplicity of "I knew him"'],
            meaning: 'The shift from apostrophe to simple declarative deflates heroic elegy into human loss. The skull is both Yorick and all mortality — holding it is a physical confrontation with what death does to the body. "I knew him" reverses the play\'s epistemological anxiety: here Hamlet knows, simply and certainly. AO4: the skull is the play\'s central prop — death made concrete and stageable.',
            aos: ['AO1', 'AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 5, Scene 2',
            text: '"There\'s a special providence in the fall of a sparrow"',
            methods: ['Biblical allusion (Matthew 10:29)', 'Calvinist register of predestination', 'Syntactic quietude after scenes of action'],
            meaning: 'The late Hamlet has moved from paralysis to submission — not passive defeat but a theological reorientation. Providence replaces revenge as the governing logic. AO3: Calvinist predestination theology held that even the sparrow\'s fall is within divine knowledge — Hamlet\'s acceptance is a distinctly Protestant resolution to a play full of Catholic ghost-lore.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
        ],
      },
      {
        name: 'Gender and female subjection',
        anchorQuote: '"Frailty, thy name is woman"',
        method: 'Apostrophe / reductive categorical assertion',
        aos: ['AO1', 'AO2', 'AO3', 'AO5'],
        packages: [
          {
            speaker: 'Hamlet',
            act: 'Act 1, Scene 2',
            text: '"Frailty, thy name is woman"',
            methods: ['Apostrophe to abstraction', 'Reductive categorical assertion', 'Definitional grammar (thy name is)'],
            meaning: 'The grammatical structure performs an act of naming — Hamlet defines women as frailty rather than observing it. The apostrophe to abstraction bypasses Gertrude entirely, making the indictment universal. AO5: Adelman reads this as psychological self-defence against maternal contamination rather than stable misogynist ideology — Hamlet is protecting himself, not making a philosophical claim.',
            aos: ['AO1', 'AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 3, Scene 1',
            text: '"Get thee to a nunnery"',
            methods: ['Imperative verb', 'Semantic doubling (nunnery = convent/brothel)', 'Displacement of desire into aggression'],
            meaning: 'The double meaning of "nunnery" is not incidental — Hamlet simultaneously removes Ophelia from sexuality and accuses her of it. The imperative collapses care and cruelty. AO5: Heilbrun argues the nunnery scene exposes Hamlet\'s unreliable narration — we hear his anxiety, not Ophelia\'s interiority. The scene denies Ophelia a legible interior.',
            aos: ['AO1', 'AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'Ophelia',
            act: 'Act 4, Scene 5',
            text: '"There\'s rosemary, that\'s for remembrance; pray, love, remember"',
            methods: ['Floral semiotics', 'Encoded female protest within madness convention', 'Fragmented syntax of derangement'],
            meaning: 'Ophelia\'s flower distribution encodes a directed social critique delivered under the protection of madness. Rosemary (remembrance), rue (regret), fennel (flattery), columbines (ingratitude) address specific figures in the court. AO3: Jacobean flower language was a recognised system — the original audience would decode her distribution as moral accusation.',
            aos: ['AO1', 'AO2', 'AO3', 'AO5'],
          },
        ],
      },
      {
        name: 'Appearance vs reality',
        anchorQuote: '"Seems, madam? Nay, it is; I know not \'seems\'"',
        method: 'Anaphoric dismissal / ontological claim',
        aos: ['AO1', 'AO2', 'AO4'],
        packages: [
          {
            speaker: 'Hamlet',
            act: 'Act 1, Scene 2',
            text: '"Seems, madam? Nay, it is; I know not \'seems\'"',
            methods: ['Anaphoric dismissal', 'Ontological claim (seems vs is)', 'Metalinguistic awareness', 'Antithesis'],
            meaning: 'Hamlet refuses the vocabulary of performance as applicable to his grief — he places "seems" in implicit quotation marks. The antithesis of "seems" and "is" structures the entire play\'s epistemological problem. AO3: Jacobean court culture was performative by design; Hamlet\'s refusal is a counter-cultural act. AO4: contrast with the Duchess\'s "I am Duchess of Malfi still" — both characters assert authentic selfhood against performative political pressure, but Shakespeare leaves Hamlet\'s claim untested; Webster destroys the Duchess for hers.',
            aos: ['AO1', 'AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 2, Scene 2',
            text: '"The play\'s the thing / Wherein I\'ll catch the conscience of the king"',
            methods: ['Metatheatrical rhyming couplet', 'Theatre as epistemological tool', 'Legal register ("catch")'],
            meaning: 'The couplet\'s rhyme gives it the force of an aphorism — decisive after scenes of paralysis. Hamlet uses theatrical fiction to reveal political truth. AO4: the moment is self-referentially theatrical — Hamlet, a character in a play, decides to use a play to catch the truth. Shakespeare makes his own form the instrument of justice.',
            aos: ['AO2', 'AO4'],
          },
          {
            speaker: 'Polonius',
            act: 'Act 1, Scene 3',
            text: '"To thine own self be true"',
            methods: ['Sentential aphorism', 'Dramatic irony (corrupt speaker)', 'Philosophical maxim undermined by context'],
            meaning: 'One of the play\'s central ironies: its most quoted piece of wisdom is spoken by its most sycophantic, manipulative character. Polonius cannot be "true to himself" because self-interest is his self. The aphorism is structurally undermined by its speaker before the audience even understands how corrupt he is.',
            aos: ['AO1', 'AO2', 'AO5'],
          },
        ],
      },
      {
        name: 'Action and procrastination',
        anchorQuote: '"O, cursed spite / That ever I was born to set it right"',
        method: 'Apostrophe / enjambment across duty and burden',
        aos: ['AO1', 'AO2', 'AO5'],
        packages: [
          {
            speaker: 'Hamlet',
            act: 'Act 1, Scene 5',
            text: '"O, cursed spite / That ever I was born to set it right"',
            methods: ['Apostrophe to abstraction', 'Enjambment across duty and burden', 'Passive construction of fate'],
            meaning: 'The enjambment enacts Hamlet\'s relationship to action — the line runs on before "set it right" arrives. Being "born to" it positions revenge as destiny; Hamlet frames that destiny as a curse. This is the play\'s structural problem in two lines. AO5: Bradley reads this as the essence of the tragic flaw — a man who makes every duty feel like a burden.',
            aos: ['AO1', 'AO2', 'AO5'],
          },
          {
            speaker: 'Hamlet',
            act: 'Act 4, Scene 4',
            text: '"I do not know / Why yet I live to say \'This thing\'s to do\'"',
            methods: ['Self-interrogatory syntax', 'Infinitive deferred across enjambment', 'The gap between thought and action made grammatical'],
            meaning: 'The enjambment is syntactically enacting the problem — "I do not know" breaks across the line and the thing-to-do remains unreached. The phrase "this thing\'s to do" is a placeholder: Hamlet knows the action but cannot name himself as its agent. AO5: de Grazia argues this is structural (the legal problem of land-inheritance) rather than psychological paralysis.',
            aos: ['AO1', 'AO2', 'AO5'],
          },
          {
            speaker: 'Claudius',
            act: 'Act 3, Scene 3',
            text: '"My words fly up, my thoughts remain below: / Words without thoughts never to heaven go"',
            methods: ['Vertical spatial metaphor of failed prayer', 'Rhyming couplet as theological axiom', 'Self-knowledge without capacity for action'],
            meaning: 'Claudius has insight into his own corruption but cannot act on it — he cannot relinquish what he gained by murder. The vertical metaphor spatialises the gap between expression and intention. He is Hamlet\'s structural mirror: both characters know what they should do and cannot do it. Use this quote to complicate any procrastination argument by showing the theme applies to both protagonist and antagonist.',
            aos: ['AO1', 'AO2', 'AO3'],
          },
        ],
      },
    ],
    critics: [
      {
        name: 'A.C. Bradley',
        position: 'Hamlet\'s tragic flaw is excessive contemplation — thought paralyses action. A Romantic reading, later contested: use it but flag it as a partial account that externalises a structural problem as personal failing.',
        themes: ['Action and procrastination', 'Revenge and moral paralysis'],
      },
      {
        name: 'T.S. Eliot',
        position: 'Hamlet is an "artistic failure" — the play\'s emotion is incommensurable to its objective correlative. Provocative for AO5: use when arguing that Shakespeare deliberately exceeds rational resolution, or to demonstrate critical plurality.',
        themes: ['Death and existential uncertainty', 'Revenge and moral paralysis'],
      },
      {
        name: 'Janet Adelman',
        position: 'Hamlet\'s misogyny is rooted in fear of maternal contamination — Gertrude\'s sexuality destabilises his sense of bodily and moral integrity. Reframes "Frailty, thy name is woman" as psychological self-defence, not stable ideology.',
        themes: ['Gender and female subjection', 'Appearance vs reality'],
      },
      {
        name: 'Carolyn Heilbrun',
        position: 'Gertrude is not the adulteress of Hamlet\'s imagination but a pragmatic political survivor — we never hear her perspective, only male interpretations of it. Use against Hamlet\'s reliability as narrator.',
        themes: ['Gender and female subjection'],
      },
      {
        name: 'Jan Kott',
        position: 'Elsinore is a totalitarian political machine — Hamlet is a prisoner of court surveillance, not primarily a philosophising individual. Reframes delay as structural, not psychological. Excellent AO4 bridge to Bosola\'s role in Malfi.',
        themes: ['Corruption and political decay', 'Appearance vs reality'],
      },
      {
        name: 'Margreta de Grazia',
        position: 'Hamlet\'s delay is structural and legal — the problem of usurped land inheritance. Complicates Bradley by shifting focus from interiority to political economy. A Historicist corrective to psychologising the play.',
        themes: ['Action and procrastination', 'Revenge and moral paralysis'],
      },
    ],
    crossText: [
      {
        title: 'Surveillance and secrecy',
        detail: 'Claudius deploys Rosencrantz, Guildenstern, Polonius, and Ophelia as instruments of espionage — mirroring Ferdinand\'s use of Bosola. Both courts are machines of institutionalised watching. In both plays, the surveilled protagonist responds through performance of unreason.',
      },
      {
        title: 'Performed vs real madness',
        detail: 'Hamlet consciously "puts an antic disposition on"; the Duchess asserts selfhood as Bosola attempts psychologically to dissolve it. Ophelia\'s genuine madness and the Duchess\'s constructed breakdown mirror each other — both become theatrical spectacles of female suffering within a patriarchal court.',
      },
      {
        title: 'Corrupt political power',
        detail: '"Something is rotten in the state of Denmark" and Webster\'s pervasive disease and decay imagery share an ideological grammar of corrupted body politics. Both courts are governed by men whose authority rests on murder, marriage control, or ecclesiastical corruption. Both plays frame the court as pathological.',
      },
      {
        title: 'Gender and autonomy',
        detail: '"Frailty, thy name is woman" and the brothers\' control of the Duchess\'s marriage share a common patriarchal structure. Yet Shakespeare gives Gertrude no interior voice; Webster gives the Duchess full selfhood. The contrast exposes what each playwright chose to dramatise — or suppress — about female agency.',
      },
      {
        title: 'Death as theatrical spectacle',
        detail: 'Both plays end in mass death staged for a surviving witness — Horatio; Delio. "Cover her face; mine eyes dazzle" and "The rest is silence" both frame death as something that resists full articulation. Power destroys itself; the witness carries the story.',
      },
      {
        title: 'Theatrical self-consciousness',
        detail: 'The Mousetrap and Webster\'s embedded staging directions both foreground their own theatrical construction. Hamlet uses theatre as an epistemological tool; Webster\'s stage deaths literalise the horror the audience came to witness. Both playwrights make the mechanics of their own form visible.',
      },
    ],
    recoveryMoves: [
      {
        title: 'Method-first reconstruction',
        detail: 'Name the method you recall — "Shakespeare\'s deployment of apostrophe" — then reconstruct the approximate line around it. Method recall fires before word-for-word recall almost every time.',
      },
      {
        title: 'Precise paraphrase with flagging',
        detail: 'Write "Shakespeare\'s Hamlet, in a moment that approximates…" then give the paraphrase. Pivot immediately to AO2 — the method analysis is what the examiner marks, not the accuracy of quotation.',
      },
      {
        title: 'Scene anchor and close reading',
        detail: '"In the nunnery scene, Hamlet instructs Ophelia through a series of imperative verbs…" — without the exact quote you can still perform close reading. Act and scene anchoring maintains textual specificity.',
      },
      {
        title: 'Shift weight to AO3 and AO5',
        detail: 'If quotation fails entirely, double down on contextual analysis and critical voices — neither requires exact quotation. A paragraph built on Adelman and Jacobean gender ideology still scores across three AOs.',
      },
    ],
    modelParagraph: {
      theme: 'Corruption and political decay',
      quote: '"Something is rotten in the state of Denmark"',
      text: 'Shakespeare constructs Elsinore as a body politic in the process of biological collapse [AO1]. Marcellus\'s observation that "something is rotten in the state of Denmark" deploys an organic decay metaphor that metonymically fuses the individual body with the nation — the corruption is not merely Claudius\'s, but systemic [AO2]. The word "something" is precise in its imprecision: it identifies rot without naming its source, enacting the epistemological uncertainty structuring the entire play [AO2]. In a Jacobean political context shaped by anxieties about succession — particularly acute following Elizabeth\'s death and James I\'s accession — the image of state-as-decaying-body resonates with the political theology of the king\'s two bodies [AO3]. That this diagnosis is spoken by a marginal soldier amplifies its theatrical significance: truth is displaced to the political periphery because it cannot be spoken at the centre [AO4 cross-text]. Webster constructs an equivalent ideological grammar in The Duchess of Malfi — yet where Shakespeare gives the diagnosis to a peripheral voice, Webster embeds it in the very agent of corruption (Bosola), exposing the court\'s self-knowledge as both acute and impotent [AO4]. Kott\'s reading of Elsinore as a totalitarian machine reframes Marcellus\'s line as systemic rather than atmospheric — the rot is not a temporary deviation from order but the condition of power itself [AO5].',
    },
  },

  // ─── THE DUCHESS OF MALFI ────────────────────────────────────────

  {
    play: 'MAL',
    section: 'B',
    subtitle: 'The Duchess of Malfi · Webster · Section B',
    ao4Note: 'AO4 in Section B encompasses cross-text connection to Hamlet and awareness of the text as a performed theatrical object. Webster embeds staging directions in dialogue — always consider how the theatrical dimension of your quotation changes its meaning on stage.',
    themes: [
      {
        name: 'Female autonomy',
        anchorQuote: '"I am Duchess of Malfi still"',
        method: 'Tautological assertion / anaphoric self-naming',
        aos: ['AO1', 'AO2', 'AO3'],
        packages: [
          {
            speaker: 'The Duchess',
            act: 'Act 4, Scene 2',
            text: '"I am Duchess of Malfi still"',
            methods: ['Tautological assertion', 'Anaphoric self-naming', 'Monosyllabic resistance'],
            meaning: 'The Duchess\'s identity is not contingent on title or marriage — her selfhood is the claim. The monosyllabic plainness resists Bosola\'s psychological tyranny. AO3: Jacobean women were legally dissolved into male identity upon marriage; Webster makes this line a direct counter-ideological claim. AO5: Whigham identifies this as "simultaneously transgressive and self-annihilating" — she asserts sovereignty at the moment it is extinguished.',
            aos: ['AO1', 'AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'The Duchess',
            act: 'Act 1, Scene 1',
            text: '"Why should only I, / Of all the other princes of the world, / Be cas\'d up, like a holy relic?"',
            methods: ['Rhetorical question', 'Religious metaphor inverted', 'Syntactic indignation across enjambment'],
            meaning: 'The relic metaphor exposes the brothers\' control as sacred stasis — to be preserved is to be immobilised. The rhetorical question asserts her particularity ("only I") against a system that would make her generic and passive. AO5: Luckyj argues the Duchess refuses the category of "woman" as passivity — this line is its earliest expression.',
            aos: ['AO1', 'AO2', 'AO3'],
          },
          {
            speaker: 'The Duchess',
            act: 'Act 3, Scene 2',
            text: '"This is flesh and blood, sir; / \'Tis not the figure cut in alabaster"',
            methods: ['Bodily assertion against funerary sculpture', 'Contrast of living and static', 'Dramatic irony (she will become a figure in death)'],
            meaning: 'The Duchess insists on the vitality of her own body against Ferdinand\'s desire to fix her in static, sexless form. Alabaster was the material of tomb effigies — she knows he wants her immobilised and, ultimately, dead. AO4: on stage this is a physical claim — the actress asserting the body the brothers want to control.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
        ],
      },
      {
        name: 'Power and patriarchy',
        anchorQuote: '"You are my sister; / This was my father\'s poniard"',
        method: 'Prop as patriarchal inheritance / juxtaposition',
        aos: ['AO2', 'AO3', 'AO4'],
        packages: [
          {
            speaker: 'Ferdinand',
            act: 'Act 1, Scene 1',
            text: '"You are my sister; / This was my father\'s poniard"',
            methods: ['Prop as patriarchal inheritance', 'Juxtaposition of family bond and weapon', 'Enjambment connecting sisterhood to threat'],
            meaning: 'The poniard is patriarchal authority made physical — inherited and brandished. The enjambment connects sisterhood to the threat instrumentally: being his sister is what makes the dagger relevant. AO4: on stage, the physical business of presenting the dagger makes the power relationship inescapably bodily from the play\'s opening.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Ferdinand',
            act: 'Act 2, Scene 5',
            text: '"I could kill her now, / In you, or in myself"',
            methods: ['Displaced violence', 'Syntactic identification of self with Antonio', 'Incestuous undercurrent'],
            meaning: 'Ferdinand\'s violence cannot locate its proper object — it displaces between Antonio and himself, suggesting the desire to kill the Duchess is also a desire to destroy himself. AO5: psychoanalytic critics connect the displaced violence to incestuous desire that Ferdinand cannot consciously name.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'The Cardinal',
            act: 'Act 1, Scene 1',
            text: '"You are a widow: / You know already what man is"',
            methods: ['Presumptive assertion', 'Reduction of female experience to sexuality', 'Ecclesiastical patriarchy'],
            meaning: 'The Cardinal reduces the Duchess\'s widowhood to sexual knowledge — her body has been used and is therefore known and contained. The presumption that widowhood defines her entire position enacts the patriarchal logic both brothers share despite their different registers (passionate vs cold).',
            aos: ['AO1', 'AO2', 'AO3'],
          },
        ],
      },
      {
        name: 'Madness and psychological collapse',
        anchorQuote: '"I am acquainted with sad misery / As the tann\'d galley-slave is with his oar"',
        method: 'Extended simile / bodily degradation',
        aos: ['AO1', 'AO2', 'AO3'],
        packages: [
          {
            speaker: 'The Duchess',
            act: 'Act 4, Scene 2',
            text: '"I am acquainted with sad misery / As the tann\'d galley-slave is with his oar"',
            methods: ['Extended simile', 'Bodily degradation', 'Labour as suffering metaphor'],
            meaning: 'The simile fuses emotional suffering with physical toil — misery is not felt but worn into the body, as the oar wears the galley-slave\'s skin. The Duchess positions herself within a rhetoric of endurance rather than defeat. AO3: galley-slavery was a contemporary punishment for serious offenders — the comparison deepens her sense of unjust imprisonment.',
            aos: ['AO1', 'AO2', 'AO3'],
          },
          {
            speaker: 'Ferdinand',
            act: 'Act 5, Scene 2',
            text: '"The wolf shall find her grave and scrape it up: / Not to devour the corpse, but to discover / The horrid murder"',
            methods: ['Lycanthropy metaphor', 'Gothic register', 'Displacement of guilt into hallucination'],
            meaning: 'Ferdinand\'s lycanthropy is both clinical (a recognised Jacobean condition) and symbolic — he becomes the predatory animal his cruelty always implied. The wolf who discovers the murder is Ferdinand discovering his own guilt. AO3: Burton\'s Anatomy of Melancholy (1621) describes lycanthropia as a clinical condition — Webster gives Ferdinand a medically contemporary diagnosis.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Bosola',
            act: 'Act 4, Scene 2',
            text: '"Thou art a box of worm-seed, at best but a salvatory of green mummy"',
            methods: ['Grotesque accumulation', 'Memento mori register', 'Apothecary metaphor reducing body to pharmacological matter'],
            meaning: 'Bosola reduces the Duchess\'s body to decomposing organic matter — she is not a person but pharmacy-shelf content. "Green mummy" (preserved corpse used in Jacobean medicine) anticipates her actual death. AO5: Dollimore reads this as the ideological exposure of the body as undifferentiated matter beneath all social distinction.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
        ],
      },
      {
        name: 'Death and mortality',
        anchorQuote: '"We are merely the stars\' tennis-balls"',
        method: 'Cosmic metaphor / fatalism',
        aos: ['AO2', 'AO3', 'AO5'],
        packages: [
          {
            speaker: 'Bosola',
            act: 'Act 5, Scene 4',
            text: '"We are merely the stars\' tennis-balls, struck and banded / Which way please them"',
            methods: ['Cosmic metaphor', 'Passive voice construction', 'Fatalistic register', '"Merely" as absolute negation of human agency'],
            meaning: 'Human agency is negated entirely — fate is a sporting game played by indifferent forces. "Merely" strips human dignity absolutely. AO3: Jacobean Calvinist predestination theology — election and damnation are not earned. AO5: Belsey argues Webster dramatises "the contradictions of a subject position that is simultaneously wilful and subjected."',
            aos: ['AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'Ferdinand',
            act: 'Act 4, Scene 2',
            text: '"Cover her face; mine eyes dazzle: she died young"',
            methods: ['Imperative verb (embedded stage direction)', 'Double caesura', 'Monosyllabic close', 'Suppressed guilt beneath apparent elegy'],
            meaning: 'The double caesura enacts psychological fragmentation in performance — an actor\'s pause mid-line becomes Ferdinand\'s dissociation made visible. The imperative is a staging directive embedded in the script. "She died young" suppresses guilt beneath apparent elegy — the sentence refuses to name cause or agent. AO4: the moment is theatrical event and psychological collapse simultaneously.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'The Duchess',
            act: 'Act 4, Scene 2',
            text: '"I know death hath ten thousand several doors / For men to take their exits"',
            methods: ['Architectural metaphor for death', 'Theatrical lexicon ("exits")', 'Syntactic control as psychological mastery'],
            meaning: 'The Duchess uses theatre\'s own vocabulary — "exits" — to frame her death as a deliberate departure. The proliferation of doors (ten thousand) converts death\'s inevitability into a kind of freedom. AO4: "exits" is a stage direction embedded in the speech — she is directing her own departure from the play.',
            aos: ['AO1', 'AO2', 'AO4'],
          },
        ],
      },
      {
        name: 'Surveillance and secrecy',
        anchorQuote: '"Methinks I see in your face / a strange distraction"',
        method: 'Visual/performative scrutiny as power',
        aos: ['AO2', 'AO4', 'AO5'],
        packages: [
          {
            speaker: 'Bosola',
            act: 'Act 2, Scene 1',
            text: '"Methinks I see in your face / a strange distraction"',
            methods: ['Visual scrutiny as power', 'Performative reading of the body', '"Methinks" as hedged accusation'],
            meaning: 'Bosola reads the Duchess\'s body for signs of pregnancy — surveillance here is intimate and bodily. "Methinks" performs plausible deniability while the reading is hostile and penetrating. AO4: on stage, the gaze is physical — the audience sees Bosola seeing the Duchess, making the audience complicit in the surveillance.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Ferdinand',
            act: 'Act 1, Scene 1',
            text: '"I would have you give o\'er these chargeable revels: / A visor and a mask are whispering rooms"',
            methods: ['Spatial metaphor (rooms of secrecy)', 'Architectural register of surveillance', 'Paranoid logic of the court'],
            meaning: 'Ferdinand\'s warning against masquerades is itself a surveillance mechanism — he is alerting the Duchess that she is being watched even in spaces of apparent disguise. "Whispering rooms" positions the court as an echo chamber of monitored speech. AO4: compare with Claudius\'s deployment of Rosencrantz and Guildenstern — both courts use personal intimacy as an instrument of political intelligence.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
          {
            speaker: 'Antonio',
            act: 'Act 1, Scene 1',
            text: '"A prince\'s court / Is like a common fountain, whence should flow / Pure silver drops in general"',
            methods: ['Fountain metaphor', 'Ironic idealism', 'Normative claim as dramatic irony'],
            meaning: 'Antonio\'s opening description of the ideal court is immediately and systematically ironised by the play that follows. Webster establishes the moral standard only to demonstrate its total absence. AO5: Kott reads this as Webster\'s political indictment from within — the ideal court is articulated by the man who will be destroyed by the actual one.',
            aos: ['AO1', 'AO2', 'AO3', 'AO5'],
          },
        ],
      },
      {
        name: 'Religion and corruption',
        anchorQuote: '"The law to him / Is like a foul black cobweb to a spider"',
        method: 'Simile / moral inversion',
        aos: ['AO2', 'AO3', 'AO5'],
        packages: [
          {
            speaker: 'Antonio',
            act: 'Act 1, Scene 1',
            text: '"The law to him / Is like a foul black cobweb to a spider"',
            methods: ['Extended simile', 'Moral inversion (law as trap not protection)', 'Arachnid predation metaphor', 'Colour imagery ("foul black")'],
            meaning: 'The Cardinal uses law as a spider uses a web — to catch others while moving freely himself. The simile inverts the law\'s protective function: it is both instrument and product of his predation. "Foul black" intensifies the moral contamination through colour. AO3: post-Reformation anxieties about Catholic ecclesiastical corruption inform the Cardinal\'s portrayal — he is a prince of the Church who operates outside the moral framework the Church claims to represent.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'The Cardinal',
            act: 'Act 5, Scene 5',
            text: '"I am puzzled in a question about hell: / He says, in hell there\'s one material fire"',
            methods: ['Theological irony', 'Self-implication through abstract musing', 'Displacement of guilt into doctrine'],
            meaning: 'The Cardinal\'s death-scene theological pondering is both absurd and self-indicting — he muses on hell while creating it for others. The displacement into doctrine is a refusal to acknowledge personal guilt. AO3: the Cardinal\'s ecclesiastical position makes his corruption doubly transgressive in a post-Reformation context — he is a corrupt Prince of the Church who cannot even recognise his own guilt as it destroys him.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
        ],
      },
      {
        name: 'Revenge and justice',
        anchorQuote: '"Cover her face; mine eyes dazzle: she died young"',
        method: 'Double caesura / embedded stage direction',
        aos: ['AO1', 'AO2', 'AO4'],
        packages: [
          {
            speaker: 'Ferdinand',
            act: 'Act 4, Scene 2',
            text: '"Cover her face; mine eyes dazzle: she died young"',
            methods: ['Imperative verb (staging direction)', 'Double caesura enacting fragmentation', 'Monosyllabic close', 'Guilt suppressed beneath brevity'],
            meaning: 'The imperative is simultaneously a command and a stage direction — Webster inscribes the theatrical event into the dialogue. The double caesura enacts psychological fragmentation; "she died young" suppresses guilt beneath apparent elegy, refusing to name cause or agent. AO4: on stage the pauses after each caesura are Ferdinand\'s dissociation made visible for the audience.',
            aos: ['AO1', 'AO2', 'AO4'],
          },
          {
            speaker: 'Bosola',
            act: 'Act 5, Scene 5',
            text: '"We are only like dead walls, or vaulted graves, / That, ruin\'d, yield no echo"',
            methods: ['Architectural death imagery', 'Simile of moral vacancy', 'Sound as absence (no echo)'],
            meaning: 'Bosola recognises his own moral hollowness — he is a dead structure, not a living conscience. The vaulted grave yields no echo: guilt is not confessed but swallowed. AO5: Dollimore reads Bosola as the figure who exposes the ideological contradictions of service — he performs the court\'s violence while knowing its wrongness, yet cannot act otherwise.',
            aos: ['AO2', 'AO3', 'AO5'],
          },
          {
            speaker: 'Bosola',
            act: 'Act 5, Scene 5',
            text: '"In a mist; I know not how"',
            methods: ['Spatial disorientation as moral condition', 'Syntactic fragmentation', 'Epistemological failure at the close'],
            meaning: 'Bosola dies without understanding what he has done or why — the mist is both literal (stage darkness) and moral. "I know not how" echoes the play\'s persistent epistemological uncertainty: in the end, even the agent of destruction cannot account for his actions. AO4: compare with Hamlet\'s "The rest is silence" — both plays end with language that registers the limit of what can be said about catastrophe.',
            aos: ['AO2', 'AO3', 'AO4'],
          },
        ],
      },
    ],
    critics: [
      {
        name: 'Dollimore',
        position: 'Webster\'s tragedies expose "the ideological contradictions" of power — the court destroys the very values it claims to protect. Applies to Ferdinand, the Cardinal, and the patriarchal control apparatus throughout.',
        themes: ['Power and patriarchy', 'Revenge and justice', 'Religion and corruption'],
      },
      {
        name: 'Whigham',
        position: 'The Duchess\'s self-assertion is simultaneously transgressive and self-annihilating — she claims sovereignty at the moment it is extinguished. Applies to all autonomy and female agency quotations.',
        themes: ['Female autonomy'],
      },
      {
        name: 'Belsey',
        position: 'Webster dramatises the early modern subject caught between agency and subjection — the self is wilful and subjected simultaneously. Applies to the Duchess\'s internal conflict and Bosola\'s moral paralysis.',
        themes: ['Female autonomy', 'Madness and psychological collapse'],
      },
      {
        name: 'Luckyj',
        position: 'The play interrogates Jacobean gender ideology through a protagonist who refuses the category of "woman" as passivity. Applies to courtship scenes and all declarations of selfhood.',
        themes: ['Female autonomy', 'Power and patriarchy'],
      },
      {
        name: 'Garrett',
        position: 'Bosola is a "malcontent" figure whose moral disintegration mirrors the court he serves — his corruption is the court\'s corruption made visible and self-aware.',
        themes: ['Surveillance and secrecy', 'Revenge and justice'],
      },
    ],
    recoveryMoves: [
      {
        title: 'Precise paraphrase with flagging',
        detail: 'If you cannot recall exact wording, paraphrase closely and signal it: "Webster has the Duchess assert, in words that approximate…" Then pivot immediately to method analysis. A paraphrase with strong AO2 outscores an exact quote with weak analysis.',
      },
      {
        title: 'Method-first recovery',
        detail: 'State the method first — "Webster deploys a monosyllabic imperative" — then reconstruct the likely quote around that method. Method recall almost always unlocks partial quote recall.',
      },
      {
        title: 'Speaker and moment anchor',
        detail: '"Ferdinand\'s response to the Duchess\'s body in Act IV employs…" — the marker understands the textual moment even without exact quotation. Act and scene anchoring maintains textual specificity.',
      },
      {
        title: 'Transfer weight to AO3 and AO5',
        detail: 'If quote recall fails entirely, shift to contextual and critical readings — neither requires direct quotation to score. Do not abandon the paragraph. A strong Dollimore reading with contextual framing still yields AO3 and AO5 marks.',
      },
    ],
    modelParagraph: {
      theme: 'Female autonomy',
      quote: '"I am Duchess of Malfi still"',
      text: 'Webster stages female selfhood as an act of radical persistence [AO1]. The Duchess\'s declaration to Bosola that she is "Duchess of Malfi still" enacts what Whigham identifies as a "simultaneously transgressive and self-annihilating" assertion of sovereignty [AO5] — she names herself at the precise moment the name is being stripped from her. Webster\'s deployment of tautological assertion — the Duchess\'s identity is her identity, requiring no external validation — and the monosyllabic plainness of the line construct a syntactic resistance to Bosola\'s interrogatory framework [AO2]. In a Jacobean legal context where married women had no independent title or juridical personhood, the retention of her own name is a direct counter-ideological claim: Webster refuses the period\'s gendered dissolution of female identity [AO3]. On stage, the line\'s brevity demands silence — the actor\'s stillness after delivery performs what the words argue: that selfhood endures [AO4]. Dollimore\'s reading complicates this: the assertion of identity within a structure of absolute power ultimately reveals the instability of that power, rather than its permanence — the Duchess\'s selfhood is a dialectical exposure of patriarchy\'s own contradictions [AO5].',
    },
  },

];
