import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PastQuestionSelector } from './PastQuestionSelector';
import {
  buildDuchessSystemPrompt,
  buildDuchessUserMessage,
  buildDuchessUserMessageFromFreeText,
  type PastQuestion,
} from '../lib/duchessEssayPrompt';

// ────────────────────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────────────────────
const S = {
  bg: "#F5F5F7", card: "#FFFFFF", cardHover: "#F0F0F2",
  border: "#D2D2D7", borderFaint: "#E5E5EA",
  accent: "#0071E3", accentHover: "#0077ED", accentBg: "rgba(0,113,227,0.08)",
  text: "#1D1D1F", muted: "#6E6E73", dimmer: "#A1A1A6",
  destructive: "#FF3B30", destructiveBg: "rgba(255,59,48,0.08)",
  teal: "#0F766E", tealBg: "rgba(15,118,110,0.08)",
  slate: "#475569", slateBg: "rgba(71,85,105,0.08)",
  amber: "#B45309", amberBg: "rgba(180,83,9,0.08)",
  green: "#15803D", greenBg: "rgba(21,128,61,0.08)",
  // keep these aliases for legacy references in data-rich sections:
  gold: "#0071E3", goldDim: "#005BB5", goldBg: "rgba(0,113,227,0.08)",
  cream: "#1D1D1F", burg: "#FF3B30", burgBg: "rgba(255,59,48,0.08)",
};

const font = "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
const mono = "'SF Mono', ui-monospace, 'Courier New', monospace";
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 640;
const px = (mobile: number, desktop: number) => IS_MOBILE ? mobile : desktop;

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────
type Scene = {
  id: string;
  title: string;
  stars: number;
  themes: string[];
  ao2: string[];
  ao3: string;
  ao4?: string;
  ao5: string[];
  bestFor: string[];
};

type Critic = {
  name: string;
  school: string;
  foil: boolean;
  core: string;
  dialogic: string;
  bestFor: string;
};

type Play = 'hamlet' | 'duchess';

// ────────────────────────────────────────────────────────────────────────────
// SCENE DATA — Hamlet
// ────────────────────────────────────────────────────────────────────────────
const HAMLET_SCENES: Scene[] = [
  { id:"1.1", title:"Ghost & Battlements", stars:4,
    themes:["Corruption","Death","Appearance vs Reality","Surveillance"],
    ao2:["Supernatural staging: Ghost as theatrical spectacle before the protagonist appears","Dramatic irony: audience knows more than the court","Ghost's silence: refusal to speak creates interpretive anxiety","Disease/decay imagery: Denmark as rotting body politic","Fragmented iambic pentameter signalling political disorder"],
    ao3:"Jacobean succession anxieties (James I/Essex); Protestant–Catholic debate on ghosts and purgatory; legitimate kingship and political instability",
    ao4:"Both plays open with political observers naming corruption before the protagonist appears — Bosola/Marcellus parallel; both courts stage instability through surveillance",
    ao5:["Bradley: Ghost as moral agent driving revenge and justice","Greenblatt: Ghost embodies Elizabethan state anxieties — ambiguous between Catholic purgatorial spirit and Protestant demonic deceiver","Psychoanalytic: Ghost as projection of Hamlet's unconscious grief and guilt"],
    bestFor:["Corruption and the state of Denmark","Denmark as diseased body politic","The supernatural and theatrical effect","Surveillance and political fear"] },

  { id:"1.2", title:"Claudius's Court — First Soliloquy", stars:5,
    themes:["Corruption","Gender & Sexuality","Death","Appearance vs Reality","Madness & Performance"],
    ao2:["Soliloquy: staged inwardness contrasted with public performance of court","Antithesis: Hyperion/satyr — compresses the moral distance between old and new kings","Disease imagery: 'unweeded garden' makes corruption biological","Wordplay: kin/kind; seems — performance as theme","Classical allusion: Hyperion, Niobe, Hercules — grief authenticated through mythology"],
    ao3:"Court performance culture: loyalty must be staged; Protestant attitudes to grief and remarriage; political marriages in Jacobean England; primogeniture and succession anxiety",
    ao4:"Duchess Act 1: both courts demand public performance masking private corruption; female sexuality and remarriage as site of intense male anxiety in both plays",
    ao5:["Jones/Freud: Hamlet's disgust at Gertrude reflects Oedipal repression — the private crime is maternal betrayal as much as political murder","Adelman: Gertrude's remarriage figures a maternal contamination that poisons Hamlet's masculine identity — the mother's body is the play's true crime scene","Greenblatt: Claudius's court as normalised usurpation — performance of grief, diplomacy and loyalty all managed through public spectacle"],
    bestFor:["Hamlet's psychology and delay","Corruption and the new order","Gertrude and female sexuality","Appearance vs reality","Hamlet's relationship with women"] },

  { id:"1.3", title:"Polonius, Laertes & Ophelia", stars:3,
    themes:["Gender & Patriarchal Control","Surveillance","Social Hierarchy"],
    ao2:["Prose vs verse: register encodes authority — Polonius's prose commands, Ophelia's verse obeys","Imperative mood throughout: male authority enacted grammatically","Financial metaphor for female virtue: 'tender yourself more dearly'","Monosyllabic submission: 'I shall obey, my lord' — maximum compression of female agency"],
    ao3:"Daughters as patriarchal property; early modern conduct literature policing female sexuality; arranged marriage and the commodification of women; social hierarchy of service and obedience",
    ao4:"The Duchess defies her brothers' control — both women subject to male surveillance of sexuality, but their responses are structurally opposite: Ophelia's compliance vs the Duchess's assertion",
    ao5:["Jardine: Ophelia as silenced subject whose interiority is suppressed — she becomes an instrument of male intelligence","Showalter: her compliance here pre-conditions her later destruction; obedience is what makes her tragedy tragic rather than merely pathetic"],
    bestFor:["Ophelia and patriarchal control","Gender and female agency","Surveillance as court culture","Foil to the Duchess's autonomy"] },

  { id:"2.2", title:"Court, Players & Mousetrap Plan", stars:4,
    themes:["Madness & Performance","Surveillance","Appearance vs Reality","Revenge & Justice"],
    ao2:["Prose with R&G and Polonius: register of ironic control — Hamlet manages their surveillance through wit","Wordplay and punning: sustained verbal deflection as self-defence","Hecuba speech: theatrical ekphrasis — emotional climax as meta-commentary on genuine feeling vs performance","'Rogue and peasant slave' soliloquy: rhetorical self-accusation, chiasmus, tripling, exclamation as structured self-indictment","Meta-theatrical commentary: Hamlet as critic and director of the players"],
    ao3:"Revenge tragedy convention: Shakespeare deliberately makes Hamlet aware he is failing the genre's expectations; Elizabethan theatre culture; court favourites as political instruments",
    ao4:"Claudius's deployment of R&G parallels Ferdinand/Bosola surveillance structure — both plays weaponise personal relationships as intelligence tools; the 'sponge' metaphor anticipates Bosola's position",
    ao5:["Bradley: the Mousetrap plan reveals Hamlet as strategist, not merely paralysed intellectual — delay is active choosing, not passive failure","Greenblatt: court as culture of surveillance and self-fashioning — Hamlet's performance is intelligible only within this system","Eliot (FOIL — use to disagree): calls the play an 'artistic failure' because emotion exceeds objective correlative — actually this excess is the source of the play's modernity"],
    bestFor:["Hamlet's delay","Surveillance and the court","Theatre and performance as theme","Madness: real or performed?"] },

  { id:"3.1", title:"'To Be or Not To Be' — Hamlet & Ophelia", stars:5,
    themes:["Death & Mortality","Madness & Performance","Surveillance","Gender","Appearance vs Reality"],
    ao2:["Soliloquy with surveillance staging complication: Hamlet's most 'private' speech is watched","Antithesis: 'To be or not to be' — the binary structure enacts the mind's inability to resolve its own division","Volta at 'But that the dread of something after death': the afterlife argument, not moral cowardice, is the actual restraint","Extended metaphors: 'slings and arrows of outrageous fortune'; 'sea of troubles'","Imperatives: 'Get thee to a nunnery' — repeated, escalating, coercive","Prose/verse instability in Hamlet's encounter with Ophelia: emotional disintegration"],
    ao3:"Suicide theologically prohibited in Protestant England ('the Everlasting had not fixed his canon 'gainst self-slaughter'); Stoic philosophy rejected as insufficient; 'nunnery' — convent and Elizabethan slang for brothel; court surveillance as politically normative",
    ao4:"Ophelia's ordeal in 3.1 parallels the Duchess in Acts 3–4: both women receive sustained psychological violence they cannot escape. Compare 'Get thee to a nunnery' with Ferdinand's 'I would have thee build / Far from the court' (1.3)",
    ao5:["Jones: 'nunnery' speech is displaced Oedipal aggression — Hamlet attacks Ophelia as substitute for Gertrude; his disgust at female sexuality is rooted in the Gertrude crisis","Jardine/Showalter: Ophelia is destroyed by a male psychological crisis she didn't create — her 'madness' in Act 4 is the direct consequence of Act 3.1's systematic demolition of her subjectivity","Greenblatt: staged surveillance frames even the most 'private' moment as politically observed — no interior space is exempt from the court's epistemological machinery"],
    bestFor:["Hamlet's delay and the philosophy of action","Death, suicide and mortality","Ophelia as tragic figure","Surveillance and private space","Gender and patriarchal violence","Madness: real or performed?"] },

  { id:"3.3", title:"Claudius Prays — Hamlet Refuses to Kill", stars:4,
    themes:["Revenge & Justice","Religion & Conscience","Corruption","Mortality"],
    ao2:["Prayer soliloquy: Claudius's spiritual self-exposure — the villain unmasks himself without witness","Dramatic irony: Claudius cannot pray despite appearing to; the posture of prayer without the substance","Conditional syntax: 'But O, what form of prayer...' — casuistic self-interrogation","Caesura in 'And now I'll do't —': the physical arrest of the killing blow enacted in syntax itself","Hamlet's theological casuistry: uses religion as pretext — or possibly as genuine moral scruple"],
    ao3:"Protestant soteriology: absolution, prayer, and divine justice; casuistry in Reformation theology; the prayer scene engages anxieties about the afterlife and timing of repentance",
    ao4:"Bosola's moral hesitation in Act 4 of Duchess: both plays stage the morally divided man at the point of action; both characters pause before killing and construct justifications for delay",
    ao5:["Bradley: Hamlet's refusal reflects moral intelligence — to kill a man in prayer, sending his soul to heaven, would corrupt the revenge; this is conscience, not weakness","Jones: the refusal to kill reveals unconscious identification with Claudius — he would be killing a version of his own repressed desire","Mack: the scene embodies the play's world of questions and hiddenness — the audience, like Hamlet, cannot be certain whether his reasoning is genuine or elaborate rationalisation"],
    bestFor:["Hamlet's delay","Religion and conscience","Revenge and justice","Corruption: Claudius's psychological division","The prayer scene as structural irony"] },

  { id:"3.4", title:"The Closet Scene", stars:4,
    themes:["Gender & Sexuality","Corruption","Madness & Performance","Revenge"],
    ao2:["Closet: domestic space violated by political violence — the private made public","Hidden body behind arras: surveillance turns intimacy into a death trap","Ghost visible only to Hamlet: epistemological instability — real presence or projection?","Mirror metaphor: 'look here upon this picture' — Hamlet forces comparison between fathers","Physical confrontation between son and mother: the play's most explicit staging of erotic anxiety"],
    ao3:"Maternal sexuality in early modern culture; the closet as private domestic space; Protestant ghost theology (why only Hamlet sees it?); domestic space as site of political violence in Jacobean drama",
    ao4:"Ferdinand's bedchamber intrusion (Duchess 3.2): both scenes stage male sexual anxiety invading a female domestic space; both Ferdinand and Hamlet arrive at a woman's private room, weapons in hand, driven by sexual anxiety they cannot directly name",
    ao5:["Adelman: the closet is the crisis point of maternal contamination — Hamlet's disgust with female sexuality and his grief converge here at their most violent","Jones: displaced Oedipal aggression at its most explicit — Hamlet attacks the mother he desires and despises","Feminist: the closet becomes the site where male psychological crisis violently resolves itself against Gertrude's body — she is the surface on which the play's real anxieties are written"],
    bestFor:["Hamlet and Gertrude","Madness: real or performed?","Gender and patriarchal violence","Corruption and guilt"] },

  { id:"4.5", title:"Ophelia's Madness — Flowers & Songs", stars:3,
    themes:["Madness & Performance","Gender","Death & Mortality","Grief"],
    ao2:["Mad songs: fragmented, bawdy, formally subversive — what verse suppresses, song releases","Flowers as symbolic speech: rosemary, rue, columbines — each a coded communication","Prose: vernacular register of psychological breakdown","Dramatic irony: audience reads more meaning than the court is willing to acknowledge","Register shift from controlled verse to dislocated song: formal fragmentation mirrors psychological fragmentation"],
    ao3:"Female madness culturally coded as beautiful, passive and non-threatening in early modern period; flowers as symbolic language in herbals and florilegia; song as displacement of censored female expression",
    ao4:"Duchess 4.2: both female figures are destroyed by male authority structures; Ophelia's madness is private grief made public, the Duchess's 4.2 dignity is public defiance. They are structural counterparts in female tragic suffering",
    ao5:["Showalter: Ophelia has become a cultural symbol of female madness shaped by patriarchal interpretation — her songs' meanings are systematically refused by the male characters around her","Neely: Ophelia's mad songs voice what the court suppresses — the bawdy specificity is subversive, not merely pathetic; she is not passive even in her madness"],
    bestFor:["Ophelia as tragic figure","Madness and gender","Female agency and its suppression","Appearance vs reality"] },

  { id:"5.1", title:"Gravedigger Scene — Ophelia's Funeral", stars:5,
    themes:["Death & Mortality","Justice & Class","Love & Grief","Religion"],
    ao2:["Prose for gravediggers: vernacular working-class register doing the court's most necessary work","Dark comedy: riddling logic ('he that is not guilty of his own death shortens not his own life') performs genuine philosophical argument through comic inversion","Yorick's skull: mortality made tangible — the most famous stage prop in Western drama; the abstract made concrete and intimate","Bathos: Alexander → dust → loam → barrel plug — formally comic but philosophically exact","Anaphora: 'Imperious Caesar, dead and turned to clay / Might stop a hole to keep the wind away' — parallel structure enacts the levelling logic","Hamlet's leap into grave: physical embodiment of grief that exceeds language"],
    ao3:"Suicide law and Christian burial: English law denied full rites to suicides — the gravediggers' debate is legally and theologically precise, not merely comic; 'Se offendendo' — comic misuse of legal Latin satirises institutional authority; memento mori tradition; Alexander the Great as contemptus mundi; class and access to religious rights",
    ao4:"Both plays end in spaces of death surrounded by bodies; but the gravedigger scene gives Hamlet philosophical reflection Webster denies the Duchess — she has no equivalent moment of meditative pause before death",
    ao5:["Wilson Knight: 5.1 is where the play's imaginative world of death reaches its most embodied statement — Hamlet holds a skull, not an abstraction","Kott: Shakespearean tragedy reduces kings and clowns alike to material mortality — the skull enacts what language cannot: Alexander stops a bunghole","Bradley: the 'readiness is all' movement toward providential acceptance begins here — the graveyard converts philosophical paralysis into Stoic resignation"],
    bestFor:["Death and mortality","Justice and social hierarchy","Ophelia and grief","Hamlet's psychological arc: from paralysis to readiness"] },

  { id:"5.2", title:"Final Duel — Denouement", stars:5,
    themes:["Revenge & Justice","Death","Providence","Corruption","Kingship"],
    ao2:["Ritualised duel as public theatrical spectacle","Poisoned props: chalice and rapier — corruption literally weaponised","Rapid accumulation of deaths: the play's structural logic made visible","'The readiness is all': Stoic aphorism — acceptance replaces delay","Horatio's framing: 'So shall you hear' — the tragic narrative will be retold, memorialised","Fortinbras: external political restoration gestures toward a new order"],
    ao3:"Providence and divine justice in Reformation theology; duel as both entertainment and political ritual; Fortinbras as instrument of providential justice; Stoic acceptance as the play's final philosophical position",
    ao4:"Both plays end in mass death and political reconstitution; but Hamlet gets Horatio as remembrancer — the Duchess's memory is fragile, dependent on characters who barely knew her",
    ao5:["Bradley: the final scene enacts providential justice — tragic order restored through catastrophe, not despite it","Eagleton: the ending is politically conservative — Fortinbras replaces one dynastic usurper with another; the Grand Mechanism continues","Kott: the Grand Mechanism — characters are destroyed by the structure of their world; the play's ending restores political order by replacing one corrupt form with another"],
    bestFor:["Revenge and justice","Providence and religion","The nature of tragedy","Political power","Comparison with Duchess's ending"] },
];

// ────────────────────────────────────────────────────────────────────────────
// SCENE DATA — Duchess of Malfi
// ────────────────────────────────────────────────────────────────────────────
const DUCHESS_SCENES: Scene[] = [
  { id:"1.1a", title:"Court Corruption — Antonio's Ideal", stars:4,
    themes:["Corruption","Surveillance","Patronage","Moral Decay"],
    ao2:["Bosola's commentary: choric voice naming corruption before the protagonist speaks","Antonio's idealising speech: French court vs Amalfi — the ideal used to expose the real","Disease metaphor: court as 'common fountain' that can be poisoned — systemic not individual corruption","Dramatic irony: the audience sees what Bosola names; both are outside the court's power structure"],
    ao3:"Jacobean court culture and patronage; corruption as endemic to aristocratic power structures; Italian courts as proxies for English political anxieties under James I",
    ao4:"Opening of Hamlet: both plays begin with political observers naming corruption before the protagonist appears — Bosola/Marcellus parallel; both courts open with instability and surveillance",
    ao5:["Dollimore: the opening exposes the ideological mystification of aristocratic power — the court presents itself as honour and rewards corruption","Sinfield: Bosola's commentary embodies the materialist contradiction of the dependent intellectual — he sees clearly and serves anyway"],
    bestFor:["Corruption and court politics","Patronage and social hierarchy","Bosola's moral position","Surveillance as the court's mode"] },

  { id:"1.1b", title:"The Duchess Woos & Secretly Marries Antonio", stars:5,
    themes:["Female Autonomy","Marriage & Sexuality","Class & Hierarchy","Surveillance"],
    ao2:["Reversal of proposal convention: Duchess initiates — a structural assertion of female agency","Ring as symbolic transfer: she gives him the ring, reversing the patriarchal gift economy","Intimate staging against a hostile public world — the private carved out of the political","Conditional speech: managing secrecy while asserting desire — language as both concealment and revelation","Cariola as witness: the domestic female alliance that sustains the marriage"],
    ao3:"Widows' remarriage as culturally transgressive in Jacobean culture; female sexuality as property of male family; class transgression (Duchess × steward Antonio); conduct literature controlling female virtue and remarriage",
    ao4:"Hamlet 1.2: Gertrude's remarriage is Hamlet's contamination — both plays make female sexuality and remarriage a site of intense male anxiety; but Webster endorses the Duchess's choice where Shakespeare suspends judgement on Gertrude",
    ao5:["Luckyj: the Duchess asserts subjecthood through the marriage — Webster gives her an interior life and moral authority that Gertrude is denied; the secret marriage is the play's argument about female agency","Jardine: even in initiating the marriage, the Duchess operates within a patriarchal exchange economy — she is choosing, not escaping, her commodity status; autonomy and constraint are inseparable","Feminist: the secret marriage is simultaneously resistance and trap — autonomy purchased through concealment; the very secrecy that protects her will be used to destroy her"],
    bestFor:["Female autonomy and patriarchal control","Marriage, sexuality and desire","Class and social hierarchy","The Duchess as protagonist and agent"] },

  { id:"2.1-3", title:"Pregnancy, Surveillance & Bosola's Intelligence", stars:4,
    themes:["Surveillance","Secrecy","Gender Control","Corruption","Patronage"],
    ao2:["Bosola's apricots: fertility weaponised as entrapment — the natural body turned into political evidence","Aside and dramatic irony: audience sees what Bosola deduces while the Duchess is unaware","Intelligence reports: Bosola's prose is the language of political management, not feeling","The Duchess's body as political text: pregnancy is evidence the court has been waiting for"],
    ao3:"Jacobean court intelligence practices; the pregnant female body as site of public and political significance; patronage and the moral compromise of the intelligencer who serves against his own conscience",
    ao4:"Hamlet 2.1–2: Polonius/Reynaldo parallel — authority figures deploy servants to gather intelligence on those they fear they cannot control directly; both plays construct surveillance as the court's primary epistemological mode",
    ao5:["Greenblatt: surveillance is the court's governing epistemological tool — knowing the Duchess's secret is having power over her; the court converts all private life into political intelligence","Sinfield: Bosola's complicity embodies the trapped dependent intellectual — he gathers intelligence that will destroy someone he half-admires, because he has no alternative within the system"],
    bestFor:["Surveillance and secrecy","Bosola's moral conflict","The Duchess's body as political property","Patronage and corruption"] },

  { id:"3.2", title:"The Bedchamber — Ferdinand Confronts the Duchess", stars:5,
    themes:["Gender Control","Sexuality & Desire","Surveillance","Madness","Tragic Power"],
    ao2:["Ferdinand's sudden appearance in darkness: theatrical shock — the private made suddenly, violently public","Ferdinand's relationship to the Duchess's hair: fetishised object of obsession","Dagger in darkness: physical threat without a legible target — violence and desire fused","Ferdinand's language: violent, sexually charged, increasingly incoherent — the patriarchal mask slipping","Dramatic irony: Ferdinand has found what he feared but cannot name the desire driving him"],
    ao3:"Incestuous desire as cultural taboo (never named, always staged); the bedchamber as contested site of sexual authority; male honour and female chastity as patriarchal ideology; theatrical shock in Jacobean drama as moral instrument",
    ao4:"Hamlet 3.4 (closet scene): both scenes stage male sexual/psychological violence invading a female domestic space; both Ferdinand and Hamlet arrive at a woman's private room with weapons, driven by sexual anxiety they cannot directly name",
    ao5:["Psychoanalytic: Ferdinand's obsession is sexually disturbed, incestuous — the play stages the symptoms without naming the cause; the very incoherence of his violence is its dramatic argument","Jardine: Ferdinand's desire is patriarchal property anxiety expressed as erotic obsession — the Duchess's body is his to control because it is family property","Luckyj: the bedchamber scene marks the beginning of the Duchess's tragic isolation — the private space that was her refuge becomes the site of her persecution"],
    bestFor:["Female autonomy and patriarchal control","Ferdinand's psychology and madness","Sexuality and desire","The Duchess as tragic figure","Surveillance collapsing private into public"] },

  { id:"4.1", title:"Wax Figures — Psychological Torture", stars:4,
    themes:["Suffering","Theatrical Cruelty","Madness as Spectacle","Death","Patriarchal Punishment"],
    ao2:["Wax figures: theatrical prop staging false death to create real grief — art weaponised as deception","Madmen as theatrical spectacle: the masque tradition inverted from celebration to torture","Dead man's hand: physical Gothic horror — the body as instrument of psychological violence","Bosola as stage manager of the torture: metatheatrical — he is both participant and observer of the cruelty","The Duchess's stoic response: dignity under assault is the play's moral counter-argument"],
    ao3:"Jacobean theatrical culture of spectacular cruelty; masque tradition and its dark inversion — the court entertainment becomes a torture instrument; wax effigies as objects of religious and magical significance; punishment and spectacle as instruments of patriarchal power",
    ao4:"Hamlet 4.5 (Ophelia's madness): both plays use madness as spectacle; but in Duchess the spectacle is deliberately imposed as torture — in Hamlet, Ophelia's genuine madness becomes an uncomfortable spectacle the court misreads",
    ao5:["Gunby: Webster's theatrical genius makes horror beautiful — the wax figures are aesthetically compelling precisely because they are morally monstrous; form and content are in productive tension","Luckyj: the Duchess's survival of this scene — her refusal to collapse — is the play's central argument about dignity; she endures what she cannot prevent","Dollimore: the torture scene exposes the ideological violence embedded in patriarchal power — the brothers are not acting from personal madness but from a social logic that makes the Duchess's body a threat to be destroyed"],
    bestFor:["Suffering and endurance","Theatrical cruelty and spectacle","The Duchess's dignity","Bosola's moral position","Madness weaponised as punishment"] },

  { id:"4.2", title:"The Execution of the Duchess", stars:5,
    themes:["Death & Dignity","Female Heroism","Suffering & Stoicism","Martyrdom","Theatrical Spectacle"],
    ao2:["'I am Duchess of Malfi still': anaphoric identity claim — the play's moral centre spoken by the dying woman","Strangulation as theatrical act: staged before an audience who can see but not stop it — spectacle of patriarchal power made visible","Cariola as structural foil: ordinary fear contrasted with the Duchess's extraordinary calm — dignity is not the default response but the achieved one","Bosola's disguise: the accomplice-as-witness — his moral transformation is staged here","Silence as dramatic technique: the Duchess's final restraint is the refusal to give her murderers the emotional collapse they require"],
    ao3:"Stoic philosophy and the dignified death; Protestant martyrology; the theatrical tradition of the 'good death'; female conduct and virtue in adversity; Jacobean attitudes to death, suffering and the afterlife",
    ao4:"Hamlet 5.2 (final scene): both plays end in mass death; but Hamlet gets a 'good death' ('the readiness is all', providential) — the Duchess's execution is unjust, premature and female. Compare structures of tragic death: providential (Hamlet) vs martyrological (Duchess)",
    ao5:["Luckyj: 'I am Duchess of Malfi still' preserves identity against all attempts at erasure — the play's moral argument is voiced by the dying woman, not by any male survivor; the Duchess wins the moral argument she loses the political one","Bogard: this scene converts Bosola from agent to witness — the beginning of moral awakening that arrives too late to save the one who catalysed it","McLuskie (FOIL — use to complicate): the Duchess's suffering is aestheticised for audience pleasure — Webster makes female virtue beautiful under persecution, which may not constitute a genuine challenge to patriarchal norms; counter with the line itself: 'I am Duchess of Malfi still' resists reduction to spectacle"],
    bestFor:["The Duchess as tragic heroine","Female power and endurance","Death and dignity","Bosola's conscience","Martyrdom and suffering","Webster's tragic vision vs Shakespeare's"] },

  { id:"5.2", title:"Ferdinand's Lycanthropy — Moral Collapse", stars:4,
    themes:["Madness","Guilt","Revenge","Moral Decay"],
    ao2:["Lycanthropy: animalistic transformation as psychological symptom — the patriarchal oppressor becomes the beast his behaviour always implied","Ferdinand's fragmented, bestial language: syntax collapsing as the self collapses","The Doctor scene: clinical observation presented as divine punishment — medical and theological readings converge","Reversal: the oppressor is now destroyed by what he destroyed"],
    ao3:"Lycanthropy in Jacobean medicine and symbolic tradition; the bestiary as cultural-moral taxonomy; madness as divine retribution in Protestant moral framework; collapse of aristocratic authority into animality",
    ao4:"Hamlet 3.3 (Claudius praying): both plays stage the internal collapse of the guilty oppressor; but Claudius retains language and reason — he knows what he has done. Ferdinand disintegrates into bestiality: his madness is not self-knowledge but self-dissolution",
    ao5:["Dollimore: Ferdinand's madness is ideological collapse — when the patriarchal machinery destroys the thing it most desires to possess, it destroys itself; the system is not redemptive, only destructive","Psychoanalytic: lycanthropy is Ferdinand's unconscious transformed into bodily symptom — the incestuous desire that drove his persecution of the Duchess returns as the beast he becomes","Bogard: Ferdinand's collapse validates Bosola's eventual moral awakening — the corruption is not stable but self-consuming; conscience is the system's internal enemy"],
    bestFor:["Madness and moral collapse","Ferdinand's psychology","Revenge and justice","The tragedy of patriarchal power","Contrasting with Hamlet's self-aware guilt"] },

  { id:"5.5", title:"Bosola's Revenge — Final Deaths", stars:4,
    themes:["Revenge & Justice","Death & Mortality","Corruption","Moral Awakening"],
    ao2:["Accumulated deaths: rapid tragic accumulation stages the play's structural argument about corruption — it consumes everything","Bosola's moral recognition arriving too late: the conscience that survives cannot undo what the compliance enabled","Antonio's death by accident vs intention: tragic irony undercuts the revenge narrative","Delio's final speech: remembrance, futility, the children inheriting a ruined world","Echo scene (5.3): the Duchess's voice persisting beyond death — metatheatrical and structural"],
    ao3:"Revenge tragedy convention: avenger destroyed by their own revenge — the instrument of justice is corrupted by it; materialist tragedy: no providential restoration; Catholic Italy read through Protestant anxiety about justice and conscience",
    ao4:"Hamlet 5.2: both plays end with multiple deaths and an external figure attempting to restore order (Fortinbras/Delio); but Fortinbras gestures at a restored state, while Delio's final image is fragile orphaned children inheriting a ruined world — Webster's ending refuses Hamlet's providential closure",
    ao5:["Dollimore: the ending refuses providential comfort — there is material destruction but no moral restoration; the system reproduces its own destruction and nothing is built on the ruins","Bogard: Bosola's death is a tragic awakening, not redemption — the moral consciousness arrives too late, too incomplete; he is not a hero of conscience but a man who discovers conscience after using it too late","Luckyj: the Echo scene (5.3) stages the Duchess's endurance beyond death — her voice is the play's final moral statement; her identity was not erased, only displaced"],
    bestFor:["Revenge and justice","Bosola as protagonist","Tragic structure","Comparison with Hamlet's providential ending"] },
];

// ────────────────────────────────────────────────────────────────────────────
// CRITICS DATA
// ────────────────────────────────────────────────────────────────────────────
const HAMLET_CRITICS: Critic[] = [
  { name:"A.C. Bradley", school:"Character Criticism / Humanist", foil:false,
    core:"Hamlet's melancholy is genuinely constitutional — a temperament intensified by circumstance into near-paralysis. His delay reflects moral intelligence and sensitivity, not weakness or cowardice.",
    dialogic:"Bradley's reading of Hamlet's melancholy as constitutional rather than performed retains diagnostic weight, yet the soliloquies' theatrical self-consciousness — Hamlet watching himself grieve — suggests madness in this play is never quite separable from its own staging.",
    bestFor:"Delay, soliloquies, Hamlet's interiority, melancholy as tragedy" },
  { name:"T.S. Eliot", school:"Modernist Formalist — FOIL: use to disagree with", foil:true,
    core:"Hamlet is 'an artistic failure' because Hamlet's emotion exceeds any 'objective correlative' the action provides. The play charming audiences is not the play Shakespeare wrote.",
    dialogic:"Eliot's verdict that Hamlet's grief lacks an 'objective correlative' has the merit of registering the play's emotional excess, yet the very disproportion he treats as a flaw is arguably the source of Hamlet's modernity — a self that overspills its dramatic situation is precisely what makes the play feel contemporary.",
    bestFor:"Soliloquies (to disagree with), emotional excess, AO5 counterpoint" },
  { name:"Ernest Jones", school:"Psychoanalytic (Freudian)",  foil:false,
    core:"Hamlet's hesitation is unconsciously motivated: Claudius has done what Hamlet himself unconsciously desired, so killing Claudius would mean killing a version of himself.",
    dialogic:"Jones's Oedipal reading illuminates the strange erotic charge of the closet scene and the intensity of Hamlet's attachment to Gertrude, though it underplays the political stakes of the delay — Hamlet's hesitation is also a public crisis of legitimacy, not solely a private neurosis.",
    bestFor:"Delay, closet scene, Gertrude, the prayer scene" },
  { name:"Elaine Showalter", school:"Feminist", foil:false,
    core:"Ophelia's madness is patriarchally framed: her body and voice become a screen onto which male anxieties are projected. The 'female malady' is a cultural category, not a clinical one.",
    dialogic:"Showalter's argument that Ophelia functions as a screen for patriarchal projection illuminates Act 4's male spectatorship, yet her mad songs' bawdy specificity resists pure passivity — she voices what the court suppresses and the men around her refuse to hear.",
    bestFor:"Ophelia, madness and gender, female agency, comparing Hamlet and Ophelia's madness" },
  { name:"Stephen Greenblatt", school:"New Historicist", foil:false,
    core:"The Ghost's ambiguous theological status (Catholic purgatorial spirit? Protestant demonic deceiver?) makes the revenge imperative structurally irresolvable. The court is a culture of surveillance, secrecy, and theatrical self-presentation.",
    dialogic:"Greenblatt's New Historicist reading productively frames Hamlet's indecision as embedded in Reformation theological uncertainty — the Ghost is epistemologically unstable before it is morally demanding — though this risks reducing Hamlet's moral crisis to a purely cultural symptom rather than an individual one.",
    bestFor:"The Ghost and religion, surveillance, corruption and the court, AO3+AO5 dual use" },
  { name:"Janet Adelman", school:"Psychoanalytic / Feminist", foil:false,
    core:"Gertrude's remarriage figures a maternal contamination that poisons Hamlet's masculine identity. The mother's body is the play's true crime scene — more disturbing than Claudius's murder of the king.",
    dialogic:"Adelman's reading of Gertrude as the site of contaminating maternal sexuality complicates the conventional focus on Claudius as villain, locating betrayal in a more uncomfortable maternal register — though this risks reducing the play's political crisis of Denmark to an Oedipal one.",
    bestFor:"Gertrude, closet scene, female sexuality, betrayal, Hamlet's misogyny" },
  { name:"Harold Bloom", school:"Literary Humanism", foil:false,
    core:"Hamlet is uniquely self-overhearing — the first literary consciousness that observes itself thinking. He 'invented the human' — modernity itself is staged in his soliloquies.",
    dialogic:"Bloom's claim that Hamlet invents the human illuminates the extraordinary self-consciousness of the soliloquies — Hamlet hearing himself think, correcting himself mid-sentence — yet this reading risks separating Hamlet from his political context: his consciousness is not free-floating but shaped by a specific court, a specific crime, a specific ghost.",
    bestFor:"Hamlet's interiority, soliloquies, identity and selfhood, AO5 to extend then qualify" },
  { name:"Maynard Mack", school:"New Critical / Thematic", foil:false,
    core:"Hamlet is a world of questions, uncertainty and hiddenness — the play systematically delays resolution of every question it raises. Its keynote is an unsettling interrogative.",
    dialogic:"Mack's reading of the play as a world of questions productively frames Hamlet's delay not as personal failure but as structural necessity — the play refuses to resolve its own interrogatives — yet this risks aestheticising indecision at the expense of examining its political consequences for Denmark.",
    bestFor:"Appearance vs reality, the play's atmosphere of uncertainty, delay as structural not personal" },
  { name:"Jan Kott", school:"Existentialist / Political", foil:false,
    core:"Shakespearean tragedy operates as a Grand Mechanism: characters are destroyed not by individual evil but by the structure of the world they inhabit. Kings and clowns are reduced equally to material mortality.",
    dialogic:"Kott's Grand Mechanism reading illuminates the graveyard scene's democratic levelling — the skull enacts what language cannot: Alexander stops a bunghole — though it underplays the play's investment in individual moral consciousness as a counter to the mechanical destruction of politics.",
    bestFor:"Mortality and the graveyard, tragic structure, the ending (Fortinbras), death and social hierarchy" },
];

const DUCHESS_CRITICS: Critic[] = [
  { name:"Cristina Luckyj", school:"Feminist / Close Reading", foil:false,
    core:"The Duchess is not merely a victim but an agent who asserts her own subjecthood. 'I am Duchess of Malfi still' preserves identity where the patriarchal system seeks to erase it.",
    dialogic:"Luckyj's argument that the Duchess retains agency through self-definition productively resists readings that reduce her to a passive victim of male cruelty, though her agency remains structurally constrained — she can choose how to die, but she cannot choose to live.",
    bestFor:"The Duchess's dignity, female agency, 4.2 execution, identity and selfhood" },
  { name:"Lisa Jardine", school:"Feminist / Materialist", foil:false,
    core:"Women in Jacobean drama are constructed as commodities: objects of exchange, desire, and control within a patriarchal economy. The Duchess's marriage cannot escape this structure even when she initiates it.",
    dialogic:"Jardine's materialist feminist reading illuminates the economic logic of the brothers' obsession — inheritance, bloodline, property — yet the Duchess's reversal of the proposal convention complicates her status as mere commodity: she initiates her own exchange, even if she cannot transcend the system that frames it.",
    bestFor:"The Duchess's marriage, Ferdinand's obsession, gender and economics, class hierarchy" },
  { name:"Jonathan Dollimore", school:"Cultural Materialist", foil:false,
    core:"Jacobean tragedy does not restore moral order — it exposes the ideological violence of power structures. The Duchess of Malfi reveals how patriarchal authority reproduces itself through surveillance, punishment, and the destruction of transgressive female desire.",
    dialogic:"Dollimore's materialist reading usefully denaturalises the play's violence — making it systemic rather than individual evil — though it struggles to account for the play's emotional charge, which repeatedly invites sympathy with individuals against the system that destroys them; the Duchess is not merely a structural position.",
    bestFor:"Corruption and power, tragic structure, Bosola's position, Ferdinand's madness, the ending" },
  { name:"Kathleen McLuskie", school:"Feminist (Critical) — FOIL: use to complicate", foil:true,
    core:"Webster does not simply celebrate the Duchess's autonomy — he makes her suffering pleasurable for an audience, constructing her as a spectacle of female virtue under persecution rather than a genuine challenge to patriarchal norms.",
    dialogic:"McLuskie's critique that the Duchess's suffering is aestheticised for audience pleasure productively questions whether Webster's sympathetic presentation of female agency is genuinely subversive — yet the Duchess's own words ('I am Duchess of Malfi still') actively resist reduction to spectacle: she refuses to perform suffering for her tormentors.",
    bestFor:"The Duchess's agency (to complicate), theatrical spectacle, AO5 counterpoint to Luckyj" },
  { name:"Alan Sinfield", school:"Cultural Materialist", foil:false,
    core:"Bosola's role as intelligencer embodies the ideological contradiction of the dependent intellectual: serving a power structure he despises because he has no alternative, discovering moral agency only when it is too late.",
    dialogic:"Sinfield's materialist reading of Bosola as trapped by patronage illuminates his complicity without reducing it to individual wickedness — yet Bosola's moral awakening, however delayed, complicates pure structural determinism: even within corrupt systems, conscience persists as the system's internal enemy.",
    bestFor:"Bosola, patronage and corruption, moral agency, class resentment" },
  { name:"Frank Whigham / Ralph Berry", school:"New Historicist", foil:false,
    core:"The Duchess of Malfi is structured around Jacobean anxieties about class transgression and social mobility: the brothers are defending a social order against contamination, not simply indulging personal vice.",
    dialogic:"New Historicist readings that foreground class politics illuminate the brothers' apparently pathological obsession as ideologically coherent — they are managing a social threat — though Webster makes this coherence morally grotesque: the defenders of social order are more monstrous than the transgression they police.",
    bestFor:"Class and hierarchy, the brothers' motivation, Antonio's social position, AO3+AO5 dual use" },
];

// ────────────────────────────────────────────────────────────────────────────
// UTILS
// ────────────────────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return <span style={{ color: "#F59E0B", letterSpacing:1 }}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}

function Tag({ children, colour }: { children: React.ReactNode; colour?: string }) {
  return (
    <span style={{ fontSize: px(12,11), padding:"3px 10px", borderRadius:6, background:'#E8E8ED', color: colour || S.text, marginRight:4, marginBottom:4, display:"inline-block", fontFamily:font }}>
      {children}
    </span>
  );
}

function Section({ label, colour, children }: { label: string; colour?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize: px(11,10), fontFamily:font, letterSpacing:1, textTransform:"uppercase", color:colour||S.accent, marginBottom:6, fontWeight:600 }}>{label}</div>
      {children}
    </div>
  );
}

function renderPlan(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} style={{ fontWeight:700, color:S.accent, fontSize:15, marginTop:20, marginBottom:6, fontFamily:font }}>{line.replace(/\*\*/g,'')}</div>;
    }
    if (line.startsWith('**')) {
      const bold = line.match(/\*\*(.*?)\*\*/g)||[];
      let result = line;
      bold.forEach(b => { result = result.replace(b, `<strong style="color:${S.text}">${b.replace(/\*\*/g,'')}</strong>`); });
      return <div key={i} style={{ marginBottom:4, lineHeight:1.7, fontSize:14, fontFamily:font }} dangerouslySetInnerHTML={{__html:result}} />;
    }
    if (line.trim() === '') return <div key={i} style={{ height:8 }} />;
    return <div key={i} style={{ marginBottom:3, lineHeight:1.7, fontSize:14, fontFamily:font, color:S.text }}>{line}</div>;
  });
}

// ────────────────────────────────────────────────────────────────────────────
// THESIS BANK DATA
// ────────────────────────────────────────────────────────────────────────────
const THESIS_BANK = {
  hamlet: [
    { focus: 'Delay', thesis: 'Shakespeare presents delay as the tragic result of moral, spiritual, and political uncertainty.' },
    { focus: 'Madness', thesis: 'Shakespeare presents madness as both performance and fragmentation, destabilising the boundary between strategy and psychological collapse.' },
    { focus: 'Revenge', thesis: 'Shakespeare presents revenge as morally contaminating, turning the revenger into part of the corruption he seeks to punish.' },
    { focus: 'Corruption', thesis: 'Shakespeare presents corruption as systemic rather than individual, using imagery of disease and surveillance to make Denmark appear politically infected.' },
    { focus: 'Women', thesis: 'Shakespeare presents women as constrained by patriarchal structures, though their silence, madness, and sexuality become sites of male anxiety.' },
    { focus: 'Death', thesis: 'Shakespeare presents death as both philosophical abstraction and physical reality, forcing the audience to confront mortality as a theatrical and material fact.' },
    { focus: 'Appearance vs Reality', thesis: 'Shakespeare presents performance as the dominant condition of Elsinore, where truth can only be approached through acting, spying, and theatrical exposure.' },
  ],
  duchess: [
    { focus: 'Power', thesis: 'Webster presents power as corrupt surveillance, transforming authority into coercion and theatrical cruelty.' },
    { focus: 'Gender', thesis: 'Webster presents female autonomy as threatening because Jacobean patriarchy treats the female body as dynastic property.' },
    { focus: 'Corruption', thesis: 'Webster presents corruption as both moral disease and courtly performance, hidden beneath aristocratic elegance.' },
    { focus: 'Madness', thesis: 'Webster presents madness as the outward sign of inward corruption, especially in Ferdinand\'s collapse into animalistic disorder.' },
    { focus: 'Suffering', thesis: 'Webster presents suffering as a test of dignity, using spectacle to contrast the Duchess\'s moral strength with her brothers\' degeneration.' },
    { focus: 'Death', thesis: 'Webster presents death as theatrical revelation, exposing both the Duchess\'s spiritual dignity and the court\'s moral emptiness.' },
    { focus: 'Class', thesis: 'Webster presents social rank as an artificial but violently enforced hierarchy, making the Duchess and Antonio\'s marriage politically explosive.' },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// PLAN TAB
// ────────────────────────────────────────────────────────────────────────────
function PlanTab() {
  const [question, setQuestion] = useState('');
  const [play, setPlay] = useState<Play>('hamlet');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedPast, setSelectedPast] = useState<PastQuestion | null>(null);
  const [activeThemes, setActiveThemes] = useState<string[]>([]);
  const [stopped, setStopped] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sample: Record<Play, string> = {
    hamlet: "Explore how Shakespeare presents Hamlet's treatment of women in the play.",
    duchess: "Explore how Webster presents the relationship between power and suffering in The Duchess of Malfi."
  };

  const useDuchessLockedScaffold = play === 'duchess';
  const showSidebar = play === 'duchess';

  const stopGeneration = () => {
    abortRef.current?.abort();
  };

  const generate = async () => {
    if (!question.trim() && !selectedPast) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true); setError(''); setPlan(''); setStopped(false);
    let aborted = false;
    try {
      let res: Response;
      if (useDuchessLockedScaffold) {
        const system = buildDuchessSystemPrompt();
        const user = selectedPast
          ? buildDuchessUserMessage(selectedPast)
          : buildDuchessUserMessageFromFreeText(question.trim());
        res = await fetch('/api/generate-duchess-essay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system, user }),
          signal: controller.signal,
        });
      } else {
        res = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: question.trim(), play, theme: selectedTheme }),
          signal: controller.signal,
        });
      }
      if (!res.ok || !res.body) throw new Error(`API error ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setPlan(acc);
      }
      if (!acc.trim() && !controller.signal.aborted) throw new Error('Empty stream');
    } catch(e) {
      if ((e as { name?: string }).name === 'AbortError' || controller.signal.aborted) {
        aborted = true;
      } else {
        setError('Generation failed — check your connection and try again.');
      }
    }
    setLoading(false);
    abortRef.current = null;
    setStopped(aborted);
  };

  const formCard = (
    <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:12, padding: IS_MOBILE ? 18 : 28, marginBottom:20, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ marginBottom:16, color:S.text, fontSize: px(13,13), fontFamily:font, letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Select text</div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {(['hamlet','duchess'] as const).map(p => (
          <button key={p} onClick={()=>{ setPlay(p); setSelectedTheme(null); }} style={{ flex:1, padding:"12px 0", borderRadius:8, border:`1px solid ${play===p?S.accent:S.border}`, background:play===p?S.accentBg:'transparent', color:play===p?S.accent:S.text, cursor:'pointer', fontFamily:font, fontSize: px(15,14), fontWeight: play===p ? 600 : 500, transition:'all 0.2s' }}>
            {p==='hamlet' ? 'Hamlet' : IS_MOBILE ? 'Duchess of Malfi' : 'The Duchess of Malfi'}
          </button>
        ))}
      </div>
      <div style={{ marginBottom:8, color:S.text, fontSize: px(13,13), fontFamily:font, letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Thesis Bank — tap to use</div>
      <div style={{ display:'flex', flexWrap:'wrap', marginBottom:20 }}>
        {THESIS_BANK[play].map(({ focus, thesis }) => (
          <span key={focus} onClick={() => { setQuestion(thesis); setSelectedTheme(focus); setSelectedPast(null); }} style={{ fontSize: px(13,12), padding:"4px 11px", borderRadius:6, background: selectedTheme===focus ? S.accentBg : '#E8E8ED', color: selectedTheme===focus ? S.accent : S.text, marginRight:4, marginBottom:4, display:"inline-block", fontFamily:font, cursor:'pointer', transition:'background 0.15s' }}>
            {focus}
          </span>
        ))}
      </div>
      <div style={{ marginBottom:16, color:S.text, fontSize: px(13,13), fontFamily:font, letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Exam question</div>
      <textarea value={question} onChange={e=>{ setQuestion(e.target.value); setSelectedTheme(null); setSelectedPast(null); }}
        placeholder={`e.g. "${sample[play]}"`}
        style={{ width:'100%', minHeight: IS_MOBILE ? 110 : 90, background:'#FFFFFF', border:`1px solid ${S.border}`, borderRadius:8, color:S.text, padding:14, fontSize: px(16,15), fontFamily:font, resize:'vertical', outline:'none', lineHeight:1.6, boxSizing:'border-box' }} />
      <div style={{ display:'flex', flexDirection: IS_MOBILE ? 'column' : 'row', justifyContent:'space-between', alignItems: IS_MOBILE ? 'stretch' : 'center', marginTop:14, gap: IS_MOBILE ? 10 : 0 }}>
        <button onClick={()=>{ setQuestion(sample[play]); setSelectedTheme(null); setSelectedPast(null); }} style={{ background:'transparent', border:`1px solid ${S.border}`, color:S.text, padding:"10px 14px", borderRadius:8, cursor:'pointer', fontFamily:font, fontSize: px(14,13) }}>
          Use sample question
        </button>
        {loading ? (
          <button onClick={stopGeneration} style={{ background:S.destructive, border:`1px solid ${S.destructive}`, color:'#FFFFFF', padding:"12px 28px", borderRadius:8, cursor:'pointer', fontFamily:font, fontSize: px(15,14), fontWeight:600, transition:'all 0.2s' }}>
            ◼ Stop generation
          </button>
        ) : (
          <button onClick={generate} disabled={!question.trim() && !selectedPast} style={{ background:S.accent, border:`1px solid ${S.accent}`, color:'#FFFFFF', padding:"12px 28px", borderRadius:8, cursor:'pointer', fontFamily:font, fontSize: px(15,14), fontWeight:600, transition:'all 0.2s', opacity:(!question.trim() && !selectedPast)?0.5:1 }}>
            {useDuchessLockedScaffold ? 'Generate Model Answer →' : 'Generate Essay Plan →'}
          </button>
        )}
      </div>
    </div>
  );

  const outputBlock = (
    <>
      {error && <div style={{ background:S.destructiveBg, border:`1px solid ${S.destructive}`, color:S.destructive, borderRadius:8, padding:16, fontSize:14, fontFamily:font, marginBottom:20 }}>{error}</div>}

      {(plan || loading) && (
        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:12, padding:28, boxShadow:'0 2px 8px rgba(0,0,0,0.08)', marginBottom:20 }}>
          <div style={{ borderBottom:`1px solid ${S.borderFaint}`, marginBottom:20, paddingBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:S.accent, fontFamily:font, fontWeight:600, fontSize:15 }}>
              {useDuchessLockedScaffold ? 'Model Answer' : 'Essay Plan'}
              {loading && <span style={{ marginLeft:10, color:S.text, fontSize:13, fontWeight:400 }}>· Generating…</span>}
            </span>
            <span style={{ color:S.text, fontSize:12, fontFamily:font }}>{play === 'hamlet' ? 'Section A — 35 marks — 45 min' : 'Section B — 25 marks — 50 min'}</span>
          </div>
          <div>
            {plan
              ? (useDuchessLockedScaffold
                  ? <div className="prose prose-sm max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown></div>
                  : renderPlan(plan))
              : <div style={{ color:S.text, fontFamily:font, fontSize:14 }}>{useDuchessLockedScaffold ? 'Composing your model answer…' : 'Constructing your essay plan…'}</div>}
          </div>
          {stopped && plan && (
            <div style={{ marginTop:16, paddingTop:12, borderTop:`1px solid ${S.borderFaint}`, color:S.text, fontFamily:font, fontSize:13, fontStyle:'italic' }}>
              Generation stopped — partial output preserved above.
            </div>
          )}
        </div>
      )}
    </>
  );

  const sidebar = showSidebar && (
    <aside style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:12, padding: IS_MOBILE ? 16 : 20, boxShadow:'0 2px 8px rgba(0,0,0,0.08)', marginBottom: IS_MOBILE ? 20 : 0 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:8 }}>
        <div style={{ fontSize: px(13,13), color:S.text, fontFamily:font, letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Past Papers</div>
        <button
          onClick={() => setActiveThemes([])}
          disabled={activeThemes.length === 0}
          style={{
            background:'transparent',
            border:`1px solid ${activeThemes.length === 0 ? S.borderFaint : S.border}`,
            color: activeThemes.length === 0 ? S.dimmer : S.text,
            padding:"6px 10px",
            borderRadius:6,
            cursor: activeThemes.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily:font,
            fontSize: px(12,12),
            fontWeight:500,
            opacity: activeThemes.length === 0 ? 0.6 : 1,
            transition:'all 0.15s',
            whiteSpace:'nowrap',
          }}
        >
          Reset all filters
        </button>
      </div>
      <PastQuestionSelector
        selectedQuestionId={selectedPast?.id ?? null}
        onSelect={(q) => { setSelectedPast(q); setQuestion(q.questionText); setSelectedTheme(null); }}
        activeThemes={activeThemes}
        onActiveThemesChange={setActiveThemes}
        collapsibleYears
      />
      {selectedPast && (
        <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', alignItems:'center', gap:8 }}>
          <button
            onClick={() => setSelectedPast(null)}
            style={{ background:'transparent', border:`1px solid ${S.border}`, color:S.text, padding:"8px 14px", borderRadius:8, cursor:'pointer', fontFamily:font, fontSize: px(13,13) }}
          >
            Clear selection
          </button>
          <div style={{ width:'100%', fontSize: px(12,12), color:S.text, fontFamily:font, marginTop:2 }}>
            {selectedPast.year} · {selectedPast.eitherOr} · {selectedPast.marks} marks
          </div>
        </div>
      )}
    </aside>
  );

  const containerMaxWidth = showSidebar ? 1200 : 780;

  return (
    <div style={{ maxWidth: containerMaxWidth, margin:'0 auto', padding: IS_MOBILE ? '0 14px 60px' : '0 20px 60px' }}>
      {showSidebar ? (
        <div className="grid md:grid-cols-[320px_minmax(0,1fr)] gap-6 mb-5">
          <div>{sidebar}</div>
          <div>
            {formCard}
            {outputBlock}
          </div>
        </div>
      ) : (
        <>
          {formCard}
          {outputBlock}
        </>
      )}

      {!plan && !loading && (
        <div style={{ background:S.card, border:`1px solid ${S.borderFaint}`, borderRadius:12, padding:24, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ color:S.text, fontSize:13, fontFamily:font, letterSpacing:1, textTransform:'uppercase', fontWeight:600, marginBottom:14 }}>How to use this tool</div>
          <div style={{ fontSize:15, fontFamily:font, lineHeight:1.8, color:S.text }}>
            <div style={{ marginBottom:8 }}>1. Select Hamlet or The Duchess of Malfi above.</div>
            <div style={{ marginBottom:8 }}>2. Type or paste an Edexcel-style exam question — or use the sample question to see the tool in action.</div>
            <div style={{ marginBottom:8 }}>3. Receive a full A/A* essay plan: controlling thesis, opening move, 3–4 paragraphs (scene → AO2 → AO3 → AO5 dialogically), conclusion, timing guidance.</div>
            <div style={{ marginBottom:0 }}>4. Use the Scene Map and Critics Panel tabs to navigate your knowledge base directly.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SCENES TAB
// ────────────────────────────────────────────────────────────────────────────
function SceneCard({ s, play }: { s: Scene; play: Play }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={()=>setOpen(!open)} style={{ background:open?S.cardHover:S.card, border:`1px solid ${open?S.accent:S.border}`, borderRadius:12, padding:'16px 18px', marginBottom:10, cursor:'pointer', transition:'all 0.2s', boxShadow: open ? '0 2px 8px rgba(0,113,227,0.12)' : '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
        <div>
          <span style={{ color:S.muted, fontSize:11, fontFamily:mono, marginRight:10 }}>{s.id}</span>
          <span style={{ color:S.text, fontFamily:font, fontSize:14, fontWeight:500 }}>{s.title}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <Stars n={s.stars} />
          <span style={{ color:S.muted, fontSize:12 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap' }}>
        {s.themes.slice(0,4).map(t=><Tag key={t}>{t}</Tag>)}
      </div>

      {open && (
        <div style={{ marginTop:18, borderTop:`1px solid ${S.borderFaint}`, paddingTop:18 }} onClick={e=>e.stopPropagation()}>
          <Section label="AO2 — Dramatic Methods" colour={S.teal}>
            {s.ao2.map((m,i)=><div key={i} style={{ fontSize:13, fontFamily:font, lineHeight:1.6, color:S.teal, marginBottom:4 }}>• {m}</div>)}
          </Section>
          <Section label="AO3 — Context" colour={S.amber}>
            <div style={{ fontSize:13, fontFamily:font, lineHeight:1.7, color:S.text }}>{s.ao3}</div>
          </Section>
          <Section label="AO5 — Critical Readings" colour={S.slate}>
            {s.ao5.map((c,i)=><div key={i} style={{ fontSize:13, fontFamily:font, lineHeight:1.6, color:S.text, marginBottom:4 }}>• {c}</div>)}
          </Section>
          <Section label="Best Essay Uses" colour={S.accent}>
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {s.bestFor.map(u=><Tag key={u}>{u}</Tag>)}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

function ScenesTab() {
  const [play, setPlay] = useState<Play>('hamlet');
  const [act, setAct] = useState('all');
  const scenes = play === 'hamlet' ? HAMLET_SCENES : DUCHESS_SCENES;
  const filtered = act === 'all' ? scenes : scenes.filter(s => s.id.startsWith(act));

  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding: IS_MOBILE ? '0 14px 60px' : '0 20px 60px' }}>
      <div style={{ display:'flex', flexDirection: IS_MOBILE ? 'column' : 'row', justifyContent:'space-between', alignItems: IS_MOBILE ? 'flex-start' : 'center', marginBottom:20, gap:12 }}>
        <div style={{ display:'flex', gap:8 }}>
          {(['hamlet','duchess'] as const).map(p=>(
            <button key={p} onClick={()=>{setPlay(p);setAct('all');}} style={{ padding:"10px 16px", borderRadius:8, border:`1px solid ${play===p?S.accent:S.border}`, background:play===p?S.accentBg:'transparent', color:play===p?S.accent:S.muted, cursor:'pointer', fontFamily:font, fontWeight: play===p ? 600 : 400, fontSize: px(14,13), transition:'all 0.2s' }}>
              {p==='hamlet'?'Hamlet': IS_MOBILE ? 'Duchess' : 'The Duchess of Malfi'}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','1','2','3','4','5'].map(a=>(
            <button key={a} onClick={()=>setAct(a)} style={{ padding:"8px 12px", borderRadius:6, border:`1px solid ${act===a?S.accent:S.border}`, background:act===a?S.accentBg:'transparent', color:act===a?S.accent:S.muted, cursor:'pointer', fontFamily:font, fontSize: px(13,11), transition:'all 0.2s' }}>
              {a==='all'?'All':a==='1'?'Act I':a==='2'?'Act II':a==='3'?'Act III':a==='4'?'Act IV':'Act V'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:10, color:S.muted, fontSize: px(13,11), fontFamily:font }}>
        {filtered.length} scene{filtered.length!==1?'s':''} — tap any scene to expand
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:40, color:S.muted, fontFamily:font }}>No scenes match this act filter.</div>
      )}
      {filtered.map(s=><SceneCard key={s.id} s={s} play={play} />)}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CRITICS TAB
// ────────────────────────────────────────────────────────────────────────────
function CriticCard({ c }: { c: Critic }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:S.card, border:`1px solid ${c.foil?S.destructive+'50':S.border}`, borderRadius:12, marginBottom:10, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
      <div onClick={()=>setOpen(!open)} style={{ padding:'16px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <span style={{ fontFamily:font, fontSize:15, fontWeight:600, color:S.text }}>{c.name}</span>
            {c.foil && <span style={{ fontSize:10, background:S.destructiveBg, color:S.destructive, border:`1px solid ${S.destructive}40`, padding:"2px 8px", borderRadius:20, fontFamily:font, fontWeight:600 }}>FOIL — use to disagree</span>}
          </div>
          <div style={{ fontSize:12, color:S.muted, fontFamily:font }}>{c.school}</div>
        </div>
        <span style={{ color:S.muted, fontSize:12 }}>{open?'▲':'▼'}</span>
      </div>

      {open && (
        <div style={{ padding:'0 18px 18px', borderTop:`1px solid ${S.borderFaint}` }}>
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:11, color:S.accent, letterSpacing:1, textTransform:'uppercase', fontFamily:font, fontWeight:600, marginBottom:6 }}>Core position</div>
            <div style={{ fontSize:13, fontFamily:font, lineHeight:1.7, color:S.text, marginBottom:14 }}>{c.core}</div>
          </div>
          <div>
            <div style={{ fontSize:11, color:S.slate, letterSpacing:1, textTransform:'uppercase', fontFamily:font, fontWeight:600, marginBottom:6 }}>Dialogic deployment sentence</div>
            <div style={{ fontSize:13, fontFamily:font, lineHeight:1.7, color:S.text, background:S.slateBg, padding:"12px 14px", borderRadius:8, borderLeft:`3px solid ${S.slate}`, marginBottom:14 }}>{c.dialogic}</div>
          </div>
          <div style={{ fontSize:11, color:S.muted, letterSpacing:1, textTransform:'uppercase', fontFamily:font, fontWeight:600, marginBottom:6 }}>Best deployed for</div>
          <div style={{ fontSize:13, color:S.muted, fontFamily:font }}>{c.bestFor}</div>
        </div>
      )}
    </div>
  );
}

function CriticsTab() {
  const [play, setPlay] = useState<Play>('hamlet');

  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding: IS_MOBILE ? '0 14px 60px' : '0 20px 60px' }}>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {(['hamlet','duchess'] as const).map(p=>(
          <button key={p} onClick={()=>setPlay(p)} style={{ padding:"10px 16px", borderRadius:8, border:`1px solid ${play===p?S.accent:S.border}`, background:play===p?S.accentBg:'transparent', color:play===p?S.accent:S.muted, cursor:'pointer', fontFamily:font, fontWeight: play===p ? 600 : 400, fontSize: px(14,13), transition:'all 0.2s' }}>
            {p==='hamlet'?'Hamlet': IS_MOBILE ? 'Duchess' : 'The Duchess of Malfi'}
          </button>
        ))}
      </div>

      {play === 'duchess' ? (
        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderLeft:`4px solid ${S.destructive}`, borderRadius:12, padding:'18px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize:15, fontFamily:font, fontWeight:600, color:S.destructive, marginBottom:8 }}>AO5 not assessed in Section B</div>
          <div style={{ fontSize:14, fontFamily:font, color:S.text, lineHeight:1.7 }}>
            AO5 (critics) is not assessed in Section B — The Duchess of Malfi.<br />
            Do not use critics in your Duchess essay. Focus on AO1, AO2, and AO3 only.
          </div>
        </div>
      ) : (
        <>
          <div style={{ background:'#F0F7FF', border:`1px solid ${S.accent}30`, borderRadius:12, padding:'12px 16px', marginBottom:16, borderLeft:`4px solid ${S.accent}` }}>
            <div style={{ fontSize:13, fontFamily:font, color:S.text, lineHeight:1.6 }}>
              <strong style={{ color:S.accent }}>AO5 deployment rule:</strong> Never cite critics decoratively. Use tension verbs — <em>complicates, resists, extends, yet, although</em>. Each paragraph should contain 2 critics in productive tension. The dialogic sentence below is portable: substitute the scene/moment for your question's specifics.
            </div>
          </div>
          <div style={{ marginBottom:10, color:S.muted, fontSize: px(13,11), fontFamily:font }}>
            {HAMLET_CRITICS.length} critics — tap to expand core position + dialogic sentence
          </div>
          {HAMLET_CRITICS.map(c=><CriticCard key={c.name} c={c} />)}
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────────────────────────────────
function DramaCompass() {
  const [tab, setTab] = useState('plan');
  const tabs = [
    { id:'plan', label: IS_MOBILE ? 'Plan' : 'Essay Planner' },
    { id:'scenes', label: IS_MOBILE ? 'Scenes' : 'Scene Map' },
    { id:'critics', label: IS_MOBILE ? 'Critics' : 'Critics Panel' },
  ];
  return (
    <div style={{ background:S.bg, minHeight:'100vh', color:S.text, fontFamily:font }}>
      <style>{`
        * { box-sizing: border-box; }
        html { -webkit-text-size-adjust: 100%; }
        textarea:focus { border-color: #0071E3 !important; box-shadow: 0 0 0 3px rgba(0,113,227,0.15) !important; }
        button { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#F5F5F7; } ::-webkit-scrollbar-thumb { background:#D2D2D7; border-radius:2px; }
      `}</style>

      {/* Header */}
      <header style={{ background:'#FFFFFF', backdropFilter:'blur(10px)', borderBottom:`1px solid ${S.border}`, padding: IS_MOBILE ? '14px 16px' : '16px 24px', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:780, margin:'0 auto' }}>
          <div style={{ fontSize: px(18,20), fontWeight:700, color:S.text, letterSpacing:-0.3 }}>Drama Compass</div>
          <div style={{ fontSize: px(11,10), color:S.muted, fontFamily:font, letterSpacing:1, textTransform:'uppercase', marginTop:2 }}>Edexcel 9ET0/01 · Component 1</div>
        </div>
      </header>

      {/* Nav */}
      <nav style={{ background:'#FFFFFF', borderBottom:`1px solid ${S.border}`, padding: IS_MOBILE ? '0 16px' : '0 24px', marginBottom: IS_MOBILE ? 20 : 28 }}>
        <div style={{ maxWidth:780, margin:'0 auto', display:'flex', gap:0 }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding: IS_MOBILE ? "12px 14px" : "14px 20px", background:'transparent', border:'none', borderBottom:`2px solid ${tab===t.id?S.accent:'transparent'}`, color:tab===t.id?S.accent:S.muted, cursor:'pointer', fontFamily:font, fontSize: px(14,14), fontWeight: tab===t.id ? 600 : 400, transition:'all 0.2s', marginRight:IS_MOBILE?0:4, flex: IS_MOBILE ? 1 : 'none', textAlign:'center' }}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      {tab === 'plan' && <PlanTab />}
      {tab === 'scenes' && <ScenesTab />}
      {tab === 'critics' && <CriticsTab />}
    </div>
  );
}

export default DramaCompass;
