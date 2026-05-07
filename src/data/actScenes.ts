export type AOKey = 'AO1' | 'AO2' | 'AO3' | 'AO4' | 'AO5'

export interface SceneQuote {
  speaker: string;
  text: string;
  methods: string[];
  significance: string;
  aos: AOKey[];
}

export interface ActScene {
  play: 'HAM' | 'MAL';
  act: number;
  scene: number;
  title: string;
  summary: string;
  dramaticSignificance: string;
  keyQuotes: SceneQuote[];
  themes: string[];
  characters: string[];
  aoFocus: AOKey[];
  examTip: string;
  contextNote?: string;
}

export const actScenes: ActScene[] = [

  // ─── HAMLET ───────────────────────────────────────────

  {
    play: 'HAM',
    act: 1,
    scene: 1,
    title: 'The Ghost appears on the battlements',
    summary: 'Guards Barnardo and Francisco, joined by Horatio, encounter the Ghost of King Hamlet on the battlements of Elsinore at midnight. Horatio, the play\'s rationalist, is forced to credit what he sees despite his scepticism. The scene establishes Denmark as a state under both military and psychic disturbance.',
    dramaticSignificance: 'The Ghost\'s appearance sets the epistemological problem at the heart of the play: how do you know what is real? Horatio cannot explain the apparition within his rational framework. The scene opens the appearance/reality theme before Hamlet has spoken a word. The military context (Fortinbras\'s threat) establishes political instability as the backdrop for personal tragedy.',
    keyQuotes: [
      {
        speaker: 'Marcellus',
        text: '"Something is rotten in the state of Denmark"',
        methods: ['Organic decay metaphor', 'Metonymy (state = political body)', 'Deliberate vagueness of "something"'],
        significance: 'The diagnosis of corruption is delivered by a marginal soldier — truth cannot be spoken at the centre of the court. "Something" identifies rot without naming its source, enacting the epistemological uncertainty that structures the entire play.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Horatio',
        text: '"What, has this thing appear\'d again tonight?"',
        methods: ['Reductive demotion of Ghost to "thing"', 'Sceptical register before conviction'],
        significance: 'Horatio\'s rationalism initially refuses the supernatural category. "Thing" strips the Ghost of personhood — the word will be retracted once Horatio sees the apparition. AO3: Elizabethan theology debated whether ghosts were genuine spirits, hallucinations, or demonic deceptions.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Corruption and political decay', 'Appearance vs reality', 'Death and existential uncertainty'],
    characters: ['Barnardo', 'Francisco', 'Horatio', 'Marcellus', 'Ghost'],
    aoFocus: ['AO2', 'AO3'],
    examTip: 'Use this scene for corruption/political decay questions. The fact that the diagnosis comes from a soldier (not a courtier) is a key analytical point — power cannot speak truth about itself.',
    contextNote: 'AO3: Elizabethan audiences were acutely aware of the Danish/Norwegian territorial context — the play\'s political geography was recognisably contemporary. The Ghost also raises Protestant anxieties about purgatory, which the Reformation had officially rejected.',
  },

  {
    play: 'HAM',
    act: 1,
    scene: 2,
    title: 'Claudius\'s court; Hamlet\'s first soliloquy',
    summary: 'Claudius presides over his court with performed legitimacy, addressing the marriage to Gertrude and the Norwegian threat. Hamlet\'s grief and disgust are apparent. Alone, Hamlet delivers his first soliloquy. Horatio arrives to report the Ghost\'s appearance.',
    dramaticSignificance: 'The contrast between Claudius\'s polished public performance and Hamlet\'s private anguish establishes the appearance/reality theme immediately. The soliloquy opens Hamlet\'s interiority — his language reveals a mind that refuses to inhabit performance. The court scene also establishes Claudius as a rhetorically skilled political operator, not a crude villain.',
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"Seems, madam? Nay, it is; I know not \'seems\'"',
        methods: ['Anaphoric dismissal', 'Ontological claim (seems vs is)', 'Metalinguistic awareness', 'Antithesis'],
        significance: 'Hamlet refuses the vocabulary of performance as applicable to his grief. He places "seems" in implicit quotation marks — it is a category he will not inhabit. The antithesis of "seems" and "is" structures the entire play\'s epistemological problem. AO3: Jacobean court culture was performative by design; Hamlet\'s refusal is a counter-cultural act.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
      {
        speaker: 'Hamlet',
        text: '"O, that this too solid flesh would melt, / Thaw, and resolve itself into a dew"',
        methods: ['Bodily dissolution imagery', 'Thermal register (solid → melt → dew)', 'Wish for self-annihilation without suicide'],
        significance: 'The soliloquy opens with a wish to dissolve rather than to act — the opposite of the revenge hero the Ghost will demand. The thermal sequence (solid to melt to dew) figures death as a natural process, not a violent act, allowing Hamlet to wish for it without theological guilt.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"Frailty, thy name is woman"',
        methods: ['Apostrophe to abstraction', 'Reductive categorical assertion', 'Definitional grammar (thy name is)'],
        significance: 'The grammatical structure performs an act of naming — Hamlet defines women as frailty rather than observing it. The apostrophe to abstraction bypasses Gertrude entirely, making the indictment universal. AO5: Adelman reads this as psychological self-defence against maternal contamination rather than stable misogynist ideology.',
        aos: ['AO1', 'AO2', 'AO5'],
      },
    ],
    themes: ['Appearance vs reality', 'Gender and female subjection', 'Action and procrastination', 'Death and existential uncertainty'],
    characters: ['Claudius', 'Gertrude', 'Hamlet', 'Polonius', 'Laertes', 'Horatio'],
    aoFocus: ['AO1', 'AO2', 'AO3', 'AO5'],
    examTip: 'Essential for appearance/reality, gender, and procrastination questions. "I know not \'seems\'" is one of the most method-rich single lines in the play — three distinct analytical moves in six words.',
  },

  {
    play: 'HAM',
    act: 1,
    scene: 3,
    title: 'Polonius advises Laertes and Ophelia',
    summary: 'Laertes departs for France and receives Polonius\'s famous string of advice. Polonius then forbids Ophelia from seeing Hamlet, reading his affection as political danger and instrumentalising her body as a tool of his social ambitions.',
    dramaticSignificance: 'The scene establishes Polonius as simultaneously wise-sounding and corrupt — his advice to Laertes is genuinely contradicted by his treatment of Ophelia. The irony is structural: the man who says "to thine own self be true" then instructs his daughter to deny her own feelings. Ophelia\'s compliance here seeds her destruction in Act 4.',
    keyQuotes: [
      {
        speaker: 'Polonius',
        text: '"To thine own self be true"',
        methods: ['Sentential aphorism', 'Dramatic irony (corrupt speaker)', 'Philosophical maxim in political context'],
        significance: 'One of the play\'s central ironies: the most quoted piece of wisdom is spoken by its most sycophantic, manipulative character. Polonius cannot be "true to himself" because self-interest is his self. The aphorism is structurally undermined by its speaker before the audience even knows how corrupt he is.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Polonius',
        text: '"Do not believe his vows; for they are brokers"',
        methods: ['Commercial metaphor (brokers = go-betweens)', 'Reduction of love to transaction', 'Patriarchal overriding of female experience'],
        significance: 'Polonius reduces Hamlet\'s expressions of love to political instruments — "brokers" in the commercial sense. He overwrites Ophelia\'s own reading of her experience. AO3: Jacobean fathers had legal authority over daughters\' marriages; Polonius\'s intervention is socially sanctioned even if psychologically damaging.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Appearance vs reality', 'Gender and female subjection', 'Corruption and political decay'],
    characters: ['Laertes', 'Ophelia', 'Polonius'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'Use for gender questions and appearance/reality. The Polonius irony is a high-value analytical point — always name the speaker when quoting "to thine own self be true" and immediately note the dramatic irony.',
  },

  {
    play: 'HAM',
    act: 1,
    scene: 5,
    title: "The Ghost's revelation; Hamlet's oath",
    summary: "The Ghost reveals Claudius's murder by poison and demands revenge. It forbids harming Gertrude. Hamlet swears his companions to secrecy and announces his plan to perform madness. The act ends with Hamlet's lament about being born to set things right.",
    dramaticSignificance: "The scene sets the entire revenge plot in motion but immediately complicates it — the Ghost's command creates an ethical problem (revenge vs Christian morality against killing). Hamlet's decision to perform madness is made consciously, as a theatrical strategy. The final couplet frames revenge as burden, not calling.",
    keyQuotes: [
      {
        speaker: 'Ghost',
        text: '"The serpent that did sting thy father\'s life / Now wears his crown"',
        methods: ['Reptilian metaphor', 'Paradox of murderer-king', 'Displacement of Eden imagery'],
        significance: 'Claudius is reconfigured as the serpent of Genesis — the usurpation is a theological fall, not merely a political crime. The crown becomes a mark of corruption rather than legitimacy. AO3: the serpent imagery invokes both the Garden of Eden and Virgil\'s Aeneid — classical and Biblical authority underwrite the Ghost\'s accusation.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
      {
        speaker: 'Hamlet',
        text: '"To put an antic disposition on"',
        methods: ['Theatrical metalanguage', 'Costume metaphor implicit in "put on"', 'Infinitive of deliberate choice'],
        significance: 'The phrase "put on" signals conscious performance — madness is a garment. "Antic" carries the Elizabethan theatrical resonance of the professional fool. Hamlet scripts his own role within the court\'s political drama, making him simultaneously character and playwright.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"O, cursed spite / That ever I was born to set it right"',
        methods: ['Apostrophe to abstraction', 'Enjambment across duty and burden', 'Passive construction of fate'],
        significance: 'The enjambment enacts Hamlet\'s relationship to revenge — the line runs on before the full weight of "set it right" arrives. Being "born to" it positions revenge as destiny; Hamlet frames that destiny as a curse. This is the play\'s structural problem compressed into two lines.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Revenge and moral paralysis', 'Corruption and political decay', 'Madness — performed and real', 'Action and procrastination'],
    characters: ['Hamlet', 'Ghost', 'Horatio', 'Marcellus'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'Essential for revenge and procrastination questions. The contrast between the Ghost\'s urgency and Hamlet\'s final couplet (framing revenge as curse, not heroic duty) is the engine of the play\'s delay.',
  },

  {
    play: 'HAM',
    act: 2,
    scene: 2,
    title: 'The players arrive; surveillance and the Mousetrap plan',
    summary: 'Claudius and Polonius deploy Rosencrantz and Guildenstern to spy on Hamlet. The players arrive; Hamlet commissions The Murder of Gonzago. The act ends with Hamlet\'s plan to use theatre to test the Ghost\'s claim and his self-lacerating "rogue and peasant slave" soliloquy.',
    dramaticSignificance: 'The surveillance apparatus of the court is fully established — Hamlet is watched from every direction. His performed madness navigates these watchers with precision. Theatre becomes an epistemological tool: Hamlet uses fiction to reveal truth. The soliloquy reveals his self-contempt but also his plan.',
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"I am but mad north-north-west: when the wind is southerly / I know a hawk from a handsaw"',
        methods: ['Compass metaphor', 'Deliberate semantic incoherence as performance', 'Theatrical self-awareness'],
        significance: 'The precision of "north-north-west" introduces navigational exactitude into deliberate incoherence. Hamlet\'s intellect controls what appears uncontrolled. In a court of total surveillance, performed madness is a political survival strategy — the audience shares the joke; the court does not.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"The play\'s the thing / Wherein I\'ll catch the conscience of the king"',
        methods: ['Metatheatrical rhyming couplet', 'Theatre as epistemological tool', 'Legal register ("catch")'],
        significance: 'The couplet\'s rhyme gives it the force of an aphorism — decisive after scenes of paralysis. Hamlet uses theatrical fiction to reveal political truth. AO2: the moment is self-referentially theatrical — Hamlet, a character in a play, decides to use a play to catch the truth.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"What a piece of work is a man! / How noble in reason, how infinite in faculty"',
        methods: ['Ironic eulogy of human capability', 'Humanist register undercut by nihilism', 'Rhetorical accumulation that collapses'],
        significance: 'The passage echoes Renaissance humanism (Pico della Mirandola) only to negate it — "And yet, to me, what is this quintessence of dust?" The irony is structural: the most eloquent defence of human dignity arrives in a context of total disillusionment.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Appearance vs reality', 'Madness — performed and real', 'Action and procrastination', 'Corruption and political decay'],
    characters: ['Hamlet', 'Rosencrantz', 'Guildenstern', 'Polonius', 'Players'],
    aoFocus: ['AO2', 'AO3', 'AO5'],
    examTip: 'Key for madness, surveillance, and appearance/reality questions. "I am but mad north-north-west" is one of the best quotes in the play for demonstrating Hamlet\'s intellectual control of his own performed unreason.',
  },

  {
    play: 'HAM',
    act: 3,
    scene: 1,
    title: '"To be or not to be"; the nunnery scene',
    summary: 'Claudius and Polonius observe from concealment as Hamlet delivers his most famous soliloquy. Ophelia returns Hamlet\'s letters; Hamlet\'s treatment of her in the "nunnery scene" is savage and apparently motiveless from her perspective. Claudius and Polonius interpret what they have seen differently.',
    dramaticSignificance: 'The soliloquy stages Hamlet\'s paralysis as philosophical rather than merely emotional — the problem is not what to do but whether action itself is coherent in a world of radical uncertainty. The nunnery scene reveals the cost of performed madness: Ophelia absorbs its cruelty as real, and the play prepares her destruction here.',
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"To be or not to be, that is the question"',
        methods: ['Existential binary', 'Infinitive construction (action deferred)', 'Rhetorical question as philosophical arrest'],
        significance: 'The infinite verb "to be" defers action grammatically before the content even arrives. The "question" frame positions existence itself as unanswerable — Hamlet cannot even decide whether to decide. Avoid thin analysis: the line\'s power is in its grammatical structure, not its paraphraseable content.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"The undiscovered country, from whose bourn / No traveller returns"',
        methods: ['Spatial metaphor for death', 'Colonial/cartographic register', 'Enjambment reinforcing irreversibility'],
        significance: 'Death is mapped as unexplored territory — but unlike colonial exploration, it cannot be reported back. The enjambment performs the irrevocability: the line runs past "bourn" (boundary) into the clause of impossibility. AO3: Shakespeare co-opts Elizabethan discovery narratives to figure absolute unknowing.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
      {
        speaker: 'Hamlet',
        text: '"Get thee to a nunnery"',
        methods: ['Imperative verb', 'Semantic doubling (nunnery = convent/brothel)', 'Displacement of desire into aggression'],
        significance: 'The double meaning of "nunnery" is not incidental — Hamlet simultaneously removes Ophelia from sexuality and accuses her of it. The imperative collapses care and cruelty. AO5: Heilbrun argues the nunnery scene exposes Hamlet\'s unreliable narration — we hear his anxiety, not Ophelia\'s interiority.',
        aos: ['AO1', 'AO2', 'AO5'],
      },
      {
        speaker: 'Ophelia',
        text: '"O, what a noble mind is here o\'erthrown!"',
        methods: ['Apostrophic elegy', 'Military metaphor ("o\'erthrown")', 'Dramatic irony (Ophelia\'s own fate)'],
        significance: 'Ophelia mourns Hamlet\'s apparent collapse in terms that will precisely describe her own genuine breakdown in Act 4. "O\'erthrown" figures madness as military defeat. The dramatic irony is structurally devastating: her diagnosis of him becomes her own epitaph.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Death and existential uncertainty', 'Action and procrastination', 'Madness — performed and real', 'Gender and female subjection', 'Appearance vs reality'],
    characters: ['Hamlet', 'Ophelia', 'Claudius', 'Polonius'],
    aoFocus: ['AO1', 'AO2', 'AO3', 'AO5'],
    examTip: 'The most examined scene in Hamlet. For top-band responses, avoid simply paraphrasing "To be or not to be" — focus on the grammatical construction (infinite verb, deferred action) and contrast the philosophical register of the soliloquy with the cruelty of the nunnery scene that immediately follows.',
    contextNote: 'AO3: The soliloquy\'s meditation on "the undiscovered country" engages directly with Protestant anxieties about the afterlife — the Reformation had removed purgatory, leaving Protestant culture without a map of what death meant. Hamlet\'s uncertainty is theologically precise.',
  },

  {
    play: 'HAM',
    act: 3,
    scene: 2,
    title: 'The Mousetrap; Claudius\'s guilt confirmed',
    summary: 'The players perform The Murder of Gonzago as Hamlet and Horatio observe Claudius\'s reaction. Claudius rises and leaves. His guilt is confirmed. Hamlet is summoned to Gertrude. The play-within-a-play is the epistemological climax of the revenge plot.',
    dramaticSignificance: 'Theatre literally performs the function Hamlet assigned it — catching the conscience of the king. The scene is structurally the hinge of the play: Hamlet now has what he considers proof. AO2: the play-within-a-play makes the theatrical form of Hamlet itself visible — the audience watches characters watching a play, creating layered theatrical self-consciousness.',
    keyQuotes: [
      {
        speaker: 'Gertrude',
        text: '"The lady doth protest too much, methinks"',
        methods: ['Ironic self-implication', 'Misreading as unwitting self-revelation', 'Understatement ("methinks")'],
        significance: 'Gertrude\'s comment on the Player Queen\'s excessive vows of fidelity is unwittingly self-indicting — she is commenting on her own situation. The line is one of the play\'s great dramatic ironies: she criticises performed loyalty while embodying its absence.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"Let the galled jade wince, our withers are unwrung"',
        methods: ['Equine metaphor', 'Knowing performance of innocence', 'Direct address to the guilty party'],
        significance: 'Hamlet uses the language of horse-riding to claim innocence while directing guilt at Claudius. "Galled jade" = a horse with sores from the harness. He is taunting Claudius directly while maintaining theatrical deniability.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Appearance vs reality', 'Revenge and moral paralysis', 'Corruption and political decay'],
    characters: ['Hamlet', 'Horatio', 'Claudius', 'Gertrude', 'Players', 'Ophelia', 'Polonius'],
    aoFocus: ['AO2'],
    examTip: 'Key for appearance/reality and revenge questions. The metatheatrical opportunity is exceptional here — the play-within-a-play is the most self-consciously theatrical moment in the canon. Always note that Hamlet is simultaneously director, audience, and actor.',
  },

  {
    play: 'HAM',
    act: 3,
    scene: 3,
    title: "Claudius at prayer; Hamlet's delay",
    summary: "Claudius attempts to pray for forgiveness and cannot — the words fly up but his thoughts remain earthbound. Hamlet finds him kneeling and delays the killing, reasoning that dying in prayer would send Claudius to heaven. The scene is the closest Hamlet comes to decisive action before Act 5.",
    dramaticSignificance: "The scene reveals that Hamlet's delay is not only intellectual but theological — he reasons himself out of action through a logical argument that is also self-serving. The dramatic irony is devastating: Claudius was not absolved; his prayer failed; Hamlet's theological reasoning had no basis. Both men are caught in failed systems of meaning.",
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"Now might I do it pat, now he is praying"',
        methods: ['Monosyllabic directness', 'Colloquial "pat" undercut by subsequent qualification', 'Dramatic irony'],
        significance: 'The brutal simplicity of "pat" — now, easily, cleanly — is immediately reversed by the qualification that follows. The monosyllabic opening performs the very decisiveness Hamlet cannot sustain. AO5: Bradley reads this as overthinking; de Grazia argues it is a legitimate theological calculation in its cultural context.',
        aos: ['AO1', 'AO2', 'AO5'],
      },
      {
        speaker: 'Claudius',
        text: '"My words fly up, my thoughts remain below: / Words without thoughts never to heaven go"',
        methods: ['Vertical spatial metaphor of failed prayer', 'Rhyming couplet as theological axiom', 'Self-knowledge without action'],
        significance: 'Claudius has insight into his own corruption but cannot act on it — he cannot give up what he gained by murder. The vertical metaphor (words up, thoughts below) spatialises the gap between expression and intention. He is Hamlet\'s moral mirror: both characters know what they should do and cannot do it.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Revenge and moral paralysis', 'Action and procrastination', 'Death and existential uncertainty', 'Religion'],
    characters: ['Claudius', 'Hamlet'],
    aoFocus: ['AO1', 'AO2', 'AO3', 'AO5'],
    examTip: 'The Claudius/Hamlet parallel here is a high-value AO1 point: both men have knowledge of what they should do and cannot act on it. Claudius\'s "words fly up" mirrors Hamlet\'s paralysis structurally. Use this for both revenge and procrastination questions.',
    contextNote: 'AO3: The theology of prayer, absolution, and the state of the soul at death was intensely debated in the Reformation period. Hamlet\'s reasoning about Claudius dying in a state of grace engages seriously with Protestant soteriology.',
  },

  {
    play: 'HAM',
    act: 3,
    scene: 4,
    title: 'The closet scene; Polonius killed',
    summary: "Hamlet confronts Gertrude in her bedchamber. He kills Polonius behind the arras, mistaking him for Claudius. The Ghost reappears — visible to Hamlet but not to Gertrude. Hamlet urges Gertrude to reject Claudius and confesses the reality of his behaviour.",
    dramaticSignificance: "The first act of violence in the play displaces from the correct target — Hamlet acts, but kills the wrong man. This is the structural pivot: Hamlet has now committed murder and set the revenge plot into its catastrophic final trajectory. The Ghost's reappearance, invisible to Gertrude, renews the epistemological problem: is the Ghost real or a hallucination? Gertrude's ambiguous response to Hamlet's accusations is never a full denial.",
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"I essentially am not in madness, / But mad in craft"',
        methods: ['Adverbial precision ("essentially")', 'Self-diagnosis of performed madness', 'Distinction between essence and performance'],
        significance: 'Hamlet distinguishes between his essential self and his performed role — "essentially" carries philosophical weight, asserting that his interiority remains intact. The admission to Gertrude is also a risk: she might report it to Claudius.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"Thou wretched, rash, intruding fool, farewell!"',
        methods: ['Adjectival accumulation', 'Dismissive apostrophe', 'Collapsing of murder into irritation'],
        significance: 'The casualness of Hamlet\'s response to killing Polonius is shocking — the accumulation of adjectives positions Polonius as an inconvenience rather than a victim. The tonal disconnect between murder and dismissal reveals how far Hamlet has been displaced from conventional moral categories.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Action and procrastination', 'Madness — performed and real', 'Gender and female subjection', 'Appearance vs reality'],
    characters: ['Hamlet', 'Gertrude', 'Polonius', 'Ghost'],
    aoFocus: ['AO1', 'AO2'],
    examTip: 'Essential for action/procrastination questions — Hamlet finally acts, but misdirects violence. The Gertrude question (is she guilty? does she know?) is permanently unresolved by this scene. Note that her response to Hamlet\'s accusations is never an outright denial — a key ambiguity for AO1 argument.',
  },

  {
    play: 'HAM',
    act: 4,
    scene: 5,
    title: "Ophelia's madness; Laertes's return",
    summary: "Ophelia distributes flowers in apparent madness, encoding directed social criticism within apparently random speech. Laertes returns from France demanding revenge for his father's death. Claudius attempts to manage Laertes politically.",
    dramaticSignificance: "Ophelia's madness is genuine where Hamlet's is performed — the structural contrast is the scene's primary analytical yield. Her flower distribution is not random: the plants encode directed critique of specific people in the court. The mad woman's licence is the only speech-space available to her. AO5: feminist critics identify this scene as Ophelia's only authentic moment of protest.",
    keyQuotes: [
      {
        speaker: 'Ophelia',
        text: '"There\'s rosemary, that\'s for remembrance; pray, love, remember"',
        methods: ['Floral semiotics', 'Fragmented syntax of madness', 'Encoded female protest within convention'],
        significance: 'Rosemary (remembrance), rue (regret), fennel (flattery), columbines (ingratitude) constitute a directed social critique delivered under the cover of madness. Her real meaning is legible to the audience but protected by performed unreason. AO3: Jacobean flower language was a recognised system — the original audience would decode her distribution.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
      {
        speaker: 'Ophelia',
        text: '"We know what we are, but know not what we may be"',
        methods: ['Prophetic doubling', 'Self-knowledge as limit', 'Gnomic register within madness'],
        significance: 'One of the play\'s most resonant observations delivered in apparent derangement — the epistemological problem of the play (knowing vs seeming) is compressed into a statement about identity and futurity. Ophelia articulates what Hamlet has been circling throughout.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Madness — performed and real', 'Gender and female subjection', 'Death and existential uncertainty', 'Revenge and moral paralysis'],
    characters: ['Ophelia', 'Laertes', 'Claudius', 'Gertrude', 'Horatio'],
    aoFocus: ['AO1', 'AO2', 'AO3', 'AO5'],
    examTip: 'Essential for gender questions. Always contrast Ophelia\'s genuine madness with Hamlet\'s performed madness — the structural parallel is the most productive analytical point in the play for gender questions. The flower scene requires knowledge of Jacobean flower symbolism for full AO3 credit.',
    contextNote: 'AO3: Rosemary = remembrance (for Hamlet\'s father? for her father?). Rue = regret, also called herb of grace. Fennel = flattery, columbines = ingratitude — directed at Claudius and Gertrude. Violets (fidelity) "withered all when my father died." The distribution is a directed moral trial of the court.',
  },

  {
    play: 'HAM',
    act: 5,
    scene: 1,
    title: 'The gravediggers; the skull of Yorick',
    summary: "Two gravediggers prepare Ophelia's grave while debating whether she merits Christian burial. Hamlet and Horatio observe, before Hamlet holds Yorick's skull and meditates on mortality. Ophelia's funeral procession arrives; Hamlet and Laertes clash at the graveside.",
    dramaticSignificance: "The skull is the play's central material object — death made concrete, held in the hand. The gravedigger's wordplay (riddles, puns, legal debate) democratises the scene, cutting through hierarchy with vernacular intelligence. Hamlet's late-play engagement with mortality here prefigures his acceptance in Act 5 Scene 2. The scene enacts the levelling of death: even Alexander the Great stops a bunghole.",
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"Alas, poor Yorick! I knew him, Horatio"',
        methods: ['Prosopopoeia (addressing the skull)', 'Collapsing abstract death into physical intimacy', 'Bathetic simplicity of "I knew him"'],
        significance: 'The shift from apostrophe to simple declarative statement deflates heroic elegy into human loss. The skull is both Yorick and all mortality — holding it is a physical confrontation with what death does to the body. "I knew him" reverses the play\'s epistemological anxiety: here Hamlet knows, simply and certainly.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Hamlet',
        text: '"To what base uses we may return, Horatio!"',
        methods: ['Democratic levelling of death', 'Socio-political irony (kings stop bungholes)', 'Bathetic accumulation'],
        significance: 'The meditation on Alexander stopping a bunghole collapses political hierarchy entirely — death is the ultimate leveller. The word "base" carries class resonance: the highest become literally base matter. AO3: the democratic implications were politically charged in a society built on hierarchical distinction.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Death and existential uncertainty', 'Action and procrastination', 'Appearance vs reality'],
    characters: ['Hamlet', 'Horatio', 'First Gravedigger', 'Second Gravedigger', 'Laertes', 'Claudius', 'Gertrude', 'Priest'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'Use for death/mortality questions and as evidence of Hamlet\'s psychological trajectory. The change from the "To be or not to be" philosophical abstraction to the physical reality of the skull marks Hamlet\'s movement toward acceptance — a key AO1 argument about the play\'s structure.',
  },

  {
    play: 'HAM',
    act: 5,
    scene: 2,
    title: 'The final catastrophe; death of Hamlet',
    summary: "The fencing match between Hamlet and Laertes. Gertrude drinks the poisoned wine. Laertes wounds Hamlet with the poisoned blade; they exchange rapiers; Hamlet wounds Laertes. Hamlet kills Claudius. All four die. Horatio survives as witness and narrator.",
    dramaticSignificance: "The catastrophe enacts the play's structural irony — Hamlet achieves revenge but cannot survive it. The mechanism of revenge (the poisoned blade) turns on everyone, including the innocent (Gertrude). 'The rest is silence' frames death as the ultimate unknowable — consistent with the 'undiscovered country' of Act 3. Horatio's survival and promise to 'speak to th'yet unknowing world' positions the play itself as the story that must be told.",
    keyQuotes: [
      {
        speaker: 'Hamlet',
        text: '"There\'s a special providence in the fall of a sparrow"',
        methods: ['Biblical allusion (Matthew 10:29)', 'Calvinist register of predestination', 'Syntactic quietude after action'],
        significance: 'The late Hamlet has moved from paralysis to submission — not passive defeat but a theological reorientation. Providence replaces revenge as the governing logic. AO3: Calvinist predestination theology — election is not earned; the sparrow\'s fall is within divine knowledge. Hamlet\'s acceptance is a distinctly Protestant resolution.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
      {
        speaker: 'Hamlet',
        text: '"The rest is silence"',
        methods: ['Monosyllabic finality', 'Silence as the unknowable', 'Theatrical self-awareness (the "rest" of the play is silence)'],
        significance: 'The three words compress the entire play\'s epistemological problem: after all the words, silence is the only truth. The theatrical pun ("the rest of the play is silence") makes Hamlet\'s death a metatheatrical moment. AO2: on stage, the line is followed by actual silence — the most powerful theatrical effect.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Horatio',
        text: '"Flights of angels sing thee to thy rest"',
        methods: ['Elegiac apostrophe', 'Christian closure against the play\'s Protestant uncertainty', 'Theatrical convention of requiem'],
        significance: 'Horatio offers Christian consolation — but the play has systematically undermined certainty about the afterlife. His elegy is tender but cannot resolve the theological questions the play has raised. AO5: Eliot might argue this consolation is incommensurable with the play\'s emotional reality.',
        aos: ['AO1', 'AO2', 'AO5'],
      },
    ],
    themes: ['Death and existential uncertainty', 'Revenge and moral paralysis', 'Action and procrastination', 'Corruption and political decay'],
    characters: ['Hamlet', 'Laertes', 'Claudius', 'Gertrude', 'Horatio', 'Fortinbras'],
    aoFocus: ['AO1', 'AO2', 'AO3', 'AO5'],
    examTip: 'The closing scenes are frequently neglected in revision — but "The rest is silence" and the sparrow speech are both highly method-rich.',
  },

  // ─── THE DUCHESS OF MALFI ─────────────────────────────

  {
    play: 'MAL',
    act: 1,
    scene: 1,
    title: 'Antonio\'s ideal court; the brothers\' warning',
    summary: 'Antonio praises the reformed French court as a moral counterpoint to Malfi. The Cardinal and Ferdinand warn the Duchess against remarrying with increasing menace. Bosola is established as Ferdinand\'s intelligencer. The Duchess privately signals her intentions to Antonio.',
    dramaticSignificance: 'Webster establishes the court as ideologically corrupt before any dramatic action occurs. Antonio\'s opening description of the ideal court is immediately and systematically ironised by everything that follows. The poniard scene makes patriarchal control physically tangible from the play\'s opening act.',
    keyQuotes: [
      {
        speaker: 'Antonio',
        text: '"A prince\'s court / Is like a common fountain, whence should flow / Pure silver drops in general"',
        methods: ['Fountain metaphor', 'Normative claim as dramatic irony', 'Ironic idealism'],
        significance: 'Antonio\'s opening moral framework is immediately ironised by the court it describes. Webster establishes the standard only to demonstrate its total absence. Kott reads the court as a totalitarian machine, making Antonio\'s naive idealism a political indictment from within.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Antonio (on the Cardinal)',
        text: '"The law to him / Is like a foul black cobweb to a spider"',
        methods: ['Extended simile', 'Moral inversion (law as trap not protection)', 'Arachnid predation metaphor'],
        significance: 'The Cardinal uses law as a spider uses a web — to catch others while moving freely himself. "Foul black" intensifies the moral contamination through colour. The simile inverts the law\'s protective function: it is both instrument and product of his predation.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Ferdinand',
        text: '"You are my sister; / This was my father\'s poniard"',
        methods: ['Prop as patriarchal inheritance', 'Juxtaposition of family bond and weapon', 'Enjambment connecting sisterhood to threat'],
        significance: 'The poniard is patriarchal authority made physical and inherited. The enjambment connects sisterhood to the threat instrumentally: being his sister is what makes the dagger relevant. AO2: on stage, the physical business of presenting the dagger makes the power relationship inescapably bodily from the play\'s opening.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Power and patriarchy', 'Surveillance and secrecy', 'Religion and corruption', 'Female autonomy'],
    characters: ['Antonio', 'Bosola', 'Ferdinand', 'Cardinal', 'Duchess', 'Delio'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'The fountain speech and poniard scene together give you the play\'s entire ideological framework in one act. For any question about power or corruption, establish the Antonio/court contrast early, then show how the rest of the play systematically destroys the ideal.',
    contextNote: 'AO3: Webster\'s source was William Painter\'s Palace of Pleasure (1567), based on Matteo Bandello\'s novella. The historical Duchess of Malfi was Giovanna d\'Aragona. Webster transposes the story to interrogate Jacobean patriarchal ideology through a Renaissance Italian setting.',
  },

  {
    play: 'MAL',
    act: 1,
    scene: 2,
    title: 'The Duchess proposes to Antonio (the wooing scene)',
    summary: 'The Duchess dismisses her waiting-woman and proposes marriage to Antonio herself, giving him her ring. She performs the marriage ceremony informally, with Cariola as hidden witness. Antonio\'s social terror and the Duchess\'s confidence are contrasted throughout.',
    dramaticSignificance: 'The Duchess\'s act of proposing inverts every Jacobean marriage convention — she is simultaneously agent and object of the transaction. She performs the marriage ceremony herself, requiring no male authority. AO3: a widow could legally remarry without family consent; Webster makes this legally permissible act of autonomy the source of all subsequent tragedy, interrogating the gap between law and patriarchal ideology.',
    keyQuotes: [
      {
        speaker: 'Duchess',
        text: '"I am going into a wilderness, / Where I shall find nor path nor friendly clue"',
        methods: ['Spatial metaphor of social transgression', 'Wilderness as uncharted selfhood', 'Enjambment enacting uncertainty'],
        significance: 'The Duchess knows she is crossing into socially unmarked territory. The wilderness metaphor does not express fear but rather a clear-eyed recognition of her transgression. AO3: the wilderness as a space beyond social law was a recognisable Early Modern trope — it figures both danger and freedom.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
      {
        speaker: 'Duchess',
        text: '"Why should only I, / Of all the other princes of the world, / Be cas\'d up, like a holy relic?"',
        methods: ['Rhetorical question', 'Religious metaphor inverted', 'Syntactic indignation across enjambment'],
        significance: 'The relic metaphor exposes the brothers\' control as sacred stasis — to be preserved is to be immobilised. The rhetorical question asserts her particularity ("only I") against a system that would make her generic and passive. Luckyj reads this as the Duchess\'s refusal of the category of "woman" as passivity.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Duchess',
        text: '"I take you for my husband"',
        methods: ['Declarative self-authorisation', 'Marriage formula spoken by the woman', 'Performance of legal agency'],
        significance: 'The declarative simplicity is radical — she uses the marriage formula as agent, not object. She authorises the marriage herself. AO3: the informal marriage ceremony had legal validity in Jacobean England under certain conditions; the Duchess is not merely performing but potentially enacting a legal marriage.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Female autonomy', 'Power and patriarchy', 'Surveillance and secrecy'],
    characters: ['Duchess', 'Antonio', 'Cariola'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'Essential for all female autonomy questions. The Duchess\'s act of proposing is the play\'s central gesture of selfhood — everything that follows is the patriarchal system\'s attempt to punish and erase it. AO3 context on the legal status of informal marriages is a high-value point here.',
  },

  {
    play: 'MAL',
    act: 2,
    scene: 1,
    title: "Bosola suspects the Duchess's pregnancy",
    summary: "Bosola engineers a scene with apricots to confirm the Duchess's pregnancy, reading her physical response as intelligence to report to Ferdinand. The body becomes a site of surveillance.",
    dramaticSignificance: 'The scene literalises the court\'s monitoring of the Duchess\'s body — her physical interior becomes political information. Bosola reads bodily signs rather than verbal ones, exposing the total reach of Ferdinand\'s surveillance system. AO2: on stage the apricot scene is physically uncomfortable — the audience watches a woman\'s body being read against her will.',
    keyQuotes: [
      {
        speaker: 'Bosola',
        text: '"Methinks I see in your face / a strange distraction"',
        methods: ['Visual scrutiny as power', 'Performative reading of the body', '"Methinks" as hedged accusation'],
        significance: 'Bosola reads the Duchess\'s body for signs of pregnancy — surveillance is intimate and bodily here. "Methinks" performs plausible deniability while the reading is hostile and penetrating. AO2: on stage, the gaze is physical — the audience sees Bosola seeing the Duchess.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Bosola',
        text: '"Thou art a box of worm-seed, at best but a salvatory of green mummy"',
        methods: ['Grotesque accumulation', 'Memento mori register', 'Apothecary metaphor reducing body to pharmacological matter'],
        significance: 'Bosola reduces the body to decomposing organic matter — she is not a person but pharmacy-shelf content. "Green mummy" (preserved corpse used in medicine) anticipates her actual death. Dollimore reads this as the ideological exposure of the body as undifferentiated matter beneath all social distinction.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Surveillance and secrecy', 'Female autonomy', 'Madness and psychological collapse'],
    characters: ['Bosola', 'Duchess', 'Castruccio', 'Old Lady'],
    aoFocus: ['AO2', 'AO3'],
    examTip: 'Use for surveillance questions and gender questions. The apricot trap is Webster\'s most theatrical staging of bodily surveillance — the Duchess\'s body is the court\'s most dangerous secret.',
  },

  {
    play: 'MAL',
    act: 2,
    scene: 5,
    title: "Ferdinand's rage; the Cardinal's cold calculation",
    summary: "Ferdinand is told of the Duchess's children and reacts with extreme violence of language. The Cardinal responds with cold political calculation. The contrast between passionate and cerebral modes of patriarchal control is established.",
    dramaticSignificance: 'Ferdinand\'s response reveals the incestuous underpinning of his obsession — he cannot locate the proper object of his violence, displacing it between Antonio and himself. The Cardinal\'s comparative cold highlights the two faces of patriarchal power: passionate and rational, both equally destructive.',
    keyQuotes: [
      {
        speaker: 'Ferdinand',
        text: '"I could kill her now, / In you, or in myself"',
        methods: ['Displaced violence', 'Syntactic identification of self with Antonio', 'Incestuous undercurrent'],
        significance: 'Ferdinand\'s violence cannot locate its proper object. The displacement between Antonio and himself suggests the desire to kill the Duchess is also a desire to destroy himself. Psychoanalytic readings (e.g. Dollimore) frame Ferdinand\'s response as psychosexual — his rage is desire turned to destruction.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Ferdinand',
        text: '"Rhubarb, / Oh, for rhubarb to purge this choler!"',
        methods: ['Humoral register', 'Medical metaphor of emotional excess', 'Comic bathos within violence'],
        significance: 'The rhubarb cry is simultaneously comic and revealing — Ferdinand\'s emotional excess overflows into the language of Galenic medicine (rhubarb was a purgative). AO3: humoral theory held that emotion was physiological; Ferdinand\'s choler (anger) is a medical condition as much as a psychological one.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Power and patriarchy', 'Female autonomy', 'Madness and psychological collapse'],
    characters: ['Ferdinand', 'Cardinal'],
    aoFocus: ['AO2', 'AO3'],
    examTip: 'Use for power/patriarchy questions and to establish Ferdinand\'s psychological instability early in the play. The contrast with the Cardinal\'s cold response is a productive AO1 point: Webster presents two models of oppressive male power.',
  },

  {
    play: 'MAL',
    act: 3,
    scene: 2,
    title: '"This is flesh and blood"; the discovery',
    summary: "Ferdinand obtains a key to the Duchess's chambers and confronts her there. He discovers the truth of Antonio's identity. He pretends to permit the marriage, then withdraws this permission. The Duchess begins to understand the full danger of her position.",
    dramaticSignificance: "The scene marks the transition from secret happiness to open persecution. The Duchess's assertion of her body's vitality against Ferdinand's desire to fix her in static, sexless form is one of the play's key statements of female selfhood. AO2: the physical intimacy of Ferdinand's invasion of the bedroom space is one of the play's most uncomfortable theatrical moments — he has used a key, entering her most private space.",
    keyQuotes: [
      {
        speaker: 'Duchess',
        text: '"This is flesh and blood, sir; / \'Tis not the figure cut in alabaster"',
        methods: ['Bodily assertion against funerary sculpture', 'Contrast of the living and the static', 'Dramatic irony (she will become a figure in death)'],
        significance: 'The Duchess insists on the vitality of her own body against Ferdinand\'s desire to fix her in static, sexless form. Alabaster was the material of tomb effigies — she knows he wants her immobilised and, ultimately, dead. AO2: on stage, this is a physical claim — the actress asserting the body the brothers want to control.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Duchess',
        text: '"What do you think of marriage? [...] I would not change my husband"',
        methods: ['Declarative loyalty', 'Repetition of marriage commitment', 'Defiance through statement of fact'],
        significance: 'Even under Ferdinand\'s interrogation, the Duchess refuses to recant. The declaration of loyalty is simultaneously legal testimony and emotional commitment. AO1: her constancy in this scene is part of Webster\'s consistent characterisation of the Duchess as a woman who knows what she wants and claims it.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Female autonomy', 'Power and patriarchy', 'Surveillance and secrecy'],
    characters: ['Duchess', 'Ferdinand', 'Antonio', 'Cariola'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'The alabaster metaphor is highly method-rich and under-used. The dramatic irony (she will become a figure — a corpse — by Act 4) gives the line double analytical weight. Use for autonomy and power questions.',
  },

  {
    play: 'MAL',
    act: 4,
    scene: 1,
    title: "The dead man's hand; the wax figures",
    summary: "Ferdinand, staging the psychological torment of the Duchess in darkness, presents her with a dead man's hand (apparently Antonio's) and then with wax effigies of Antonio and the children arranged as if dead. The Duchess's response is one of the play's most extreme theatrical moments.",
    dramaticSignificance: 'The dead hand and wax figures are Webster\'s most extreme theatrical staging — he makes the stage literally produce what terror looks like. AO2: the props are central to the scene\'s effect; the Duchess\'s horror must be performed against physical objects.',
    keyQuotes: [
      {
        speaker: 'Duchess',
        text: '"I account this world a tedious theatre, / For I do play a part in\'t \'gainst my will"',
        methods: ['Theatrical metaphor of enforced performance', 'World-as-stage topos inverted', 'Resistance within resignation'],
        significance: 'The Duchess appropriates the theatrical metaphor but inverts it — she is not choosing her role. AO2: the self-referential theatricality is exceptionally dense here; a character in a play describes herself as performing "against her will" in the theatre of the world. The inversion of the conventional world-as-stage (as celebratory) makes it a site of constraint.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Duchess',
        text: '"I am not mad yet, to my cause of sorrow"',
        methods: ['Controlled assertion of sanity', '"Yet" — temporal dread', 'Legal register of testimony'],
        significance: 'The word "yet" is devastating — the Duchess acknowledges that madness might come. The controlled syntax of the sentence performs the very sanity it asserts. Whigham reads this as the Duchess\'s most heroic moment — she maintains rational selfhood in the face of Ferdinand\'s assault on it.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Madness and psychological collapse', 'Death and mortality', 'Power and patriarchy', 'Female autonomy'],
    characters: ['Duchess', 'Ferdinand', 'Bosola', 'Cariola'],
    aoFocus: ['AO2'],
    examTip: 'The wax figures scene is rich for AO2 — it is one of the most explicitly theatrical sequences in the Jacobean repertoire. Always note the stagecraft: darkness, props, the presence of Bosola as observer. The theatrical metaphor quote is one of the most conceptually layered in the play.',
  },

  {
    play: 'MAL',
    act: 4,
    scene: 2,
    title: "The Duchess's death; 'I am Duchess of Malfi still'",
    summary: "The Duchess is prepared for death by Bosola in disguise. She exchanges her final words — declarations of selfhood and meditations on death — before being strangled by the executioners. Cariola and the children are also killed. Ferdinand's reaction on seeing the body marks his psychological collapse.",
    dramaticSignificance: "The Duchess's death is the play's emotional climax — occurring in Act 4, structurally breaking the conventional catastrophe pattern. Her dying is explicitly theatrical: she kneels, arranges herself, takes control of the moment. Webster makes the audience complicit in witnessing. AO2: the scene is the play's central theatrical event, and the Duchess is simultaneously victim and director of her own final scene.",
    keyQuotes: [
      {
        speaker: 'Duchess',
        text: '"I am Duchess of Malfi still"',
        methods: ['Tautological assertion', 'Anaphoric self-naming', 'Monosyllabic resistance'],
        significance: 'The Duchess\'s identity is not contingent on external validation — her selfhood is the claim. The monosyllabic plainness resists Bosola\'s psychological tyranny. Whigham identifies this as "simultaneously transgressive and self-annihilating" — she asserts sovereignty at the moment it is extinguished.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Duchess',
        text: '"I know death hath ten thousand several doors / For men to take their exits"',
        methods: ['Architectural metaphor for death', 'Theatrical lexicon ("exits")', 'Syntactic control as psychological mastery'],
        significance: 'The Duchess uses theatre\'s own vocabulary — "exits" — to frame her death as a deliberate departure. The proliferation of doors (ten thousand) converts death\'s inevitability into a kind of freedom. AO2: "exits" is a stage direction embedded in the speech — she is directing her own departure from the play.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Ferdinand',
        text: '"Cover her face; mine eyes dazzle: she died young"',
        methods: ['Imperative verb (staging direction embedded)', 'Double caesura', 'Monosyllabic close'],
        significance: 'The imperative is simultaneously a command and a stage direction — Webster inscribes the theatrical event into the dialogue. The double caesura enacts psychological fragmentation; "she died young" suppresses guilt beneath apparent elegy. AO2: on stage the pause after each caesura is Ferdinand\'s dissociation made visible.',
        aos: ['AO1', 'AO2'],
      },
    ],
    themes: ['Female autonomy', 'Death and mortality', 'Power and patriarchy', 'Madness and psychological collapse'],
    characters: ['Duchess', 'Bosola', 'Ferdinand', 'Cariola', 'Executioners'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'The most examined scene in The Duchess of Malfi. "I am Duchess of Malfi still" requires tautological assertion, anaphoric self-naming, and monosyllabic rhythm as methods — not just content paraphrase. Ferdinand\'s "Cover her face" is rich for AO2: the embedded stage direction and the double caesura are the two key analytical moves.',
  },

  {
    play: 'MAL',
    act: 5,
    scene: 2,
    title: "Ferdinand's lycanthropy; Bosola's fatalism",
    summary: "Ferdinand's clinical descent into werewolf delusion (lycanthropia) is diagnosed by the Doctor. The Cardinal's cold treatment of Julia reveals his psychological detachment. Bosola overhears the Cardinal's confession and delivers the play's most explicit statement of fatalism.",
    dramaticSignificance: "The perpetrators begin to destroy each other. Ferdinand's lycanthropy renders the incestuous violence of his obsession as physical transformation — he literally becomes the predatory animal his actions always implied. The Cardinal's detachment from feeling is its own form of psychological collapse. Bosola's 'tennis-balls' speech marks his transition from agent to fatalist witness.",
    keyQuotes: [
      {
        speaker: 'Ferdinand',
        text: '"The wolf shall find her grave and scrape it up: / Not to devour the corpse, but to discover / The horrid murder"',
        methods: ['Lycanthropy metaphor', 'Gothic register', 'Displacement of guilt into hallucination'],
        significance: 'Ferdinand\'s lycanthropy is both clinical (his actual condition) and symbolic — he becomes the predatory animal his cruelty always implied. The wolf who discovers the murder is Ferdinand discovering his own guilt. Psychoanalytic readings connect the werewolf with the incestuous desire that drives him — he is consumed by what he repressed.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Bosola',
        text: '"We are merely the stars\' tennis-balls, struck and banded / Which way please them"',
        methods: ['Cosmic metaphor', 'Passive voice construction', 'Fatalistic register', '"Merely" as absolute negation of agency'],
        significance: 'Human agency is negated entirely — fate is a game played by indifferent forces. "Merely" strips human dignity absolutely. Belsey reads Webster as dramatising "the contradictions of a subject position that is simultaneously wilful and subjected." AO3: Jacobean Calvinist predestination theology — election and damnation are not earned.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Madness and psychological collapse', 'Death and mortality', 'Revenge and justice', 'Surveillance and secrecy'],
    characters: ['Ferdinand', 'Cardinal', 'Bosola', 'Julia', 'Doctor'],
    aoFocus: ['AO2', 'AO3'],
    examTip: 'Use lycanthropy for madness questions and "tennis-balls" for death/fate questions.',
    contextNote: 'AO3: Lycanthropia was a recognised clinical condition in Jacobean medical writing — Burton\'s Anatomy of Melancholy (1621) describes it. Webster gives Ferdinand a medically contemporary condition, not mere theatrical excess.',
  },

  {
    play: 'MAL',
    act: 5,
    scene: 5,
    title: "The final catastrophe; Bosola's end",
    summary: "Bosola accidentally kills Antonio in the dark. He then kills the Cardinal and is mortally wounded by Ferdinand. Bosola kills Ferdinand and dies himself. Delio arrives with Antonio's son as a symbol of future hope, however diminished.",
    dramaticSignificance: "The closing catastrophe implicates everyone, including Bosola, who sought justice but dealt it carelessly. The accidental killing of Antonio — the one innocent man — is the play's cruelest stroke. Delio's closing speech frames the tragedy as a meditation on transience.",
    keyQuotes: [
      {
        speaker: 'Bosola',
        text: '"We are only like dead walls, or vaulted graves, / That, ruin\'d, yield no echo"',
        methods: ['Architectural death imagery', 'Simile of moral vacancy', 'Sound as absence (no echo)'],
        significance: 'Bosola recognises his own moral hollowness — he is a dead structure, not a living conscience. The vaulted grave yields no echo: guilt is not confessed but swallowed. Dollimore reads Bosola as the figure who exposes the ideological contradictions of service — he performs the court\'s violence while knowing its wrongness.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Bosola',
        text: '"In a mist; I know not how"',
        methods: ['Spatial disorientation as moral condition', 'Syntactic fragmentation', 'Epistemological failure at the close'],
        significance: 'Bosola dies without understanding what he has done or why — the mist is both literal (stage darkness) and moral. "I know not how" echoes the play\'s persistent epistemological uncertainty: in the end, even the agent of destruction cannot account for his actions.',
        aos: ['AO1', 'AO2'],
      },
      {
        speaker: 'Delio',
        text: '"These wretched eminent things / Leave no more fame behind \'em, than should one / Fall in a frost, and leave his print in snow"',
        methods: ['Snow/frost metaphor for transience', 'Levelling of "eminent" with evanescence', 'Elegiac closing register'],
        significance: 'The closing image converts the play\'s entire catastrophe into a meditation on impermanence. Power leaves the same trace as a footprint in snow — temporary, soon erased. AO3: this is a Jacobean memento mori argument transposed into natural imagery: the mighty are as mortal as the humble.',
        aos: ['AO1', 'AO2', 'AO3'],
      },
    ],
    themes: ['Revenge and justice', 'Death and mortality', 'Madness and psychological collapse', 'Religion and corruption'],
    characters: ['Bosola', 'Cardinal', 'Ferdinand', 'Antonio', 'Delio', 'Duchess\'s son'],
    aoFocus: ['AO1', 'AO2', 'AO3'],
    examTip: 'The final act is frequently neglected in revision. Delio\'s snow-print image and Bosola\'s "In a mist" are both highly method-rich and rarely used by other students — strong differentiators at A*.',
    contextNote: 'AO3: The accidental killing of Antonio literalises the play\'s Calvinist fatalism — even the agent of justice cannot control the consequence of his actions. Providence operates independently of human intention.',
  },

];
