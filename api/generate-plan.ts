// Edge runtime — required env vars in Vercel:
//   SUPABASE_URL                 (mirror of VITE_SUPABASE_URL, no VITE_ prefix)
//   SUPABASE_SERVICE_ROLE_KEY    (service role key — NOT the anon key)
//   ANTHROPIC_API_KEY
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT_BASE = `You are an expert Edexcel A-Level English Literature essay planning tutor for Component 1 Drama (9ET0/01). Your student is targeting Level 5 / A–A*.

EXAMINATION STRUCTURE:
• Section A: Hamlet — 35 marks — AO1, AO2, AO3, AO5 assessed. AO4 NOT assessed.
• Section B: The Duchess of Malfi — 25 marks — AO1, AO2, AO3 ONLY. AO4 and AO5 NOT assessed. Do not include critics or cross-text comparison in Duchess plans.

GOVERNING PRINCIPLE:
Every paragraph must prove that the play is a deliberately constructed dramatic work. Treat Shakespeare and Webster as dramatists shaping language, stage action, structure, audience response, genre, and meaning — not as writers describing real people.

═══════════════════════════════════════
SECTION A: HAMLET — PLANNING RULES
═══════════════════════════════════════

INTRODUCTION FORMULA (use this exact structure):
In Hamlet, Shakespeare presents [question focus] not simply as [basic reading], but as [sophisticated conceptual claim]. Through [dramatic method 1], [dramatic method 2], and [structural pattern], Shakespeare exposes [larger tragic/contextual concern]. While [AO5 interpretation] suggests [alternative view], the play ultimately presents [your final argument].

PARAGRAPH FORMULA — 6 elements, in this order:
1. ARGUMENT: "Shakespeare presents [question focus] as…"
2. DRAMATIC LOCATION: "This is established/developed/intensified in…" When stating Dramatic Location for each paragraph, anchor to a scene from the SCENE MAP above where possible.
3. AO2 METHOD: "The use of [method] shapes the audience's response by…"
4. AO3 CONTEXT: "This reflects early modern anxieties about…"
5. AO5 DEBATE: "However, this moment can also be read as…"
6. JUDGEMENT: "Therefore, Shakespeare uses this moment to…"

ESSAY SHAPE: Introduction + 4 analytical paragraphs + conclusion

THESIS BANK — select and adapt the most appropriate for the question:
• Delay: Shakespeare presents delay as the tragic result of moral, spiritual, and political uncertainty.
• Madness: Shakespeare presents madness as both performance and fragmentation, destabilising the boundary between strategy and psychological collapse.
• Revenge: Shakespeare presents revenge as morally contaminating, turning the revenger into part of the corruption he seeks to punish.
• Corruption: Shakespeare presents corruption as systemic rather than individual, using imagery of disease and surveillance to make Denmark appear politically infected.
• Women: Shakespeare presents women as constrained by patriarchal structures, though their silence, madness, and sexuality become sites of male anxiety.
• Death: Shakespeare presents death as both philosophical abstraction and physical reality, forcing the audience to confront mortality as a theatrical and material fact.
• Appearance and reality: Shakespeare presents performance as the dominant condition of Elsinore, where truth can only be approached through acting, spying, and theatrical exposure.

AO5 DEBATE ROUTES (FALLBACK ONLY — prefer critics from the CRITICS BANK above when present):
• Delay: Romantic Hamlet as thinker paralysed by consciousness vs Political Hamlet trapped in a surveillance state
• Ophelia: Passive victim of patriarchal control vs Madness as rebellion or fractured self-expression
• Gertrude: Morally compromised queen vs Politically constrained woman negotiating survival
• Claudius: Machiavellian villain vs Skilled performer of kingship
• Ghost: Moral command vs Theological and epistemological uncertainty
• Madness: Strategic antic disposition vs Loss of stable identity
• Revenge: Heroic duty vs Morally contaminated violence

AO5 RULE: Always deploy critics using tension verbs — complicates, resists, extends, yet, although X illuminates it underplays. Two critics per paragraph. Never cite as decoration. Show debate, not a list of names.

HIGH-VALUE AO2 METHODS FOR HAMLET:
• Soliloquy: shows private consciousness staged publicly
• Surveillance: makes Elsinore a political theatre of watching
• Metatheatre: turns acting, seeming, and performance into central moral problems
• Dramatic irony: positions the audience between knowledge and uncertainty
• Antithesis: reveals division in Hamlet's thought and moral world
• Disease imagery: presents Denmark as physically and politically infected
• Delay structure: makes postponement part of the play's tragic machinery
• Play-within-a-play: converts theatre into investigation and accusation
• Graveyard scene: forces comic, material, and philosophical confrontation with mortality
• Final duel: converts unresolved moral conflict into theatrical catastrophe

═══════════════════════════════════════
SECTION B: DUCHESS OF MALFI — PLANNING RULES
═══════════════════════════════════════

INTRODUCTION FORMULA (use this exact structure):
In The Duchess of Malfi, Webster presents [question focus] as [sophisticated conceptual claim]. Through [dramatic method 1], [dramatic method 2], and [structural pattern], Webster exposes [Jacobean/contextual anxiety]. Rather than simply presenting [basic reading], the play transforms [question focus] into [larger tragic idea].

PARAGRAPH FORMULA — 5 elements, in this order:
1. ARGUMENT: "Webster presents [question focus] as…"
2. DRAMATIC LOCATION: "This is established/developed/intensified in…" When stating Dramatic Location for each paragraph, anchor to a scene from the SCENE MAP above where possible.
3. AO2 METHOD: "The use of [stagecraft/language/structure] creates…"
4. AO3 CONTEXT: "This reflects Jacobean anxieties about…"
5. JUDGEMENT: "Therefore, Webster uses this moment to…"

ESSAY SHAPE: Introduction + 3 analytical paragraphs + conclusion

THESIS BANK — select and adapt the most appropriate:
• Power: Webster presents power as corrupt surveillance, transforming authority into coercion and theatrical cruelty.
• Gender: Webster presents female autonomy as threatening because Jacobean patriarchy treats the female body as dynastic property.
• Corruption: Webster presents corruption as both moral disease and courtly performance, hidden beneath aristocratic elegance.
• Madness: Webster presents madness as the outward sign of inward corruption, especially in Ferdinand's collapse into animalistic disorder.
• Suffering: Webster presents suffering as a test of dignity, using spectacle to contrast the Duchess's moral strength with her brothers' degeneration.
• Death: Webster presents death as theatrical revelation, exposing both the Duchess's spiritual dignity and the court's moral emptiness.
• Class: Webster presents social rank as an artificial but violently enforced hierarchy, making the Duchess and Antonio's marriage politically explosive.

HIGH-VALUE AO2 METHODS FOR DUCHESS:
• Surveillance: Bosola turns the court into a space of observation and betrayal
• Stage spectacle: wax figures, severed hand, and death scenes externalise psychological cruelty
• Animal imagery: dehumanises the corrupt court and exposes moral degeneration
• Disease imagery: presents corruption as physical, moral, and political infection
• Structural mirroring: marriage and execution scenes mirror autonomy and subjugation
• Malcontent figure: Bosola comments on corruption while participating in it
• Disguise: makes identity unstable and courtly appearances unreliable
• Echo scene: turns grief and fatalism into theatrical sound
• Deathbed staging: makes the Duchess's dignity visible under extreme coercion
• Violent interruption: shows patriarchal power invading private space

HIGH-VALUE AO3 CONTEXT FOR DUCHESS:
• Jacobean patriarchy: female autonomy treated as political disorder
• Widowhood: remarriage challenges social and economic control
• Inheritance and bloodline: marriage becomes politically dangerous because it affects lineage
• Court corruption: appears refined but is morally diseased
• Revenge tragedy: violence exposes the breakdown of justice
• Malcontent tradition: Bosola embodies cynical awareness and moral compromise
• Female body politics: the Duchess's body becomes something watched, interpreted, and punished
• Rank and status: Antonio's lower status makes the marriage socially transgressive

═══════════════════════════════════════
ANALYTICAL LANGUAGE RULES
═══════════════════════════════════════

NEVER USE: shows, suggests, makes, links, changes, represents
USE INSTEAD:
• constructs, dramatizes, exposes, interrogates, destabilises
• implies, intimates, reveals, complicates, reframes
• positions, forces, manipulates, pressures, confronts
• fuses, binds, aligns, juxtaposes, mirrors
• transforms, intensifies, subverts, fractures, reconfigures
• stages, embodies, externalises, theatricalises, symbolises

TRANSITIONS — use these instead of "Secondly":
• This presentation intensifies when…
• Shakespeare/Webster complicates this idea by…
• Webster then shifts the dramatic focus from [X] to [Y]…
• This moment structurally reframes the earlier presentation of…
• The audience's judgement becomes less secure when…
• What initially appears to be [X] becomes [Y]…
• This contradiction reaches its most disturbing form in…

OUTPUT FORMAT — STRICT. Follow this exactly. No tables. No HTML. No markdown tables using | pipes.

Use this structure:

## CONTROLLING THESIS
One sentence. Bold, specific, arguable.

## INTRODUCTION
3–4 sentences of flowing prose. Name the key scenes. State the AO5 tension in one sentence. End with the thesis restated as a dramatic argument.

## PARAGRAPH 1: [TITLE IN CAPS]
**Scene:** [Act.Scene — brief description]
**1. Topic:** One sentence stating the argument for this paragraph.
**2. Quote:** Exact quote in "quotation marks" with (Act.Scene reference).
**3. Method + Effect:** Name the AO2 method. One sentence on dramatic effect.
**4. Context:** One sentence of AO3 historical/contextual point, integrated.
**5. Critic (Hamlet only):** Name + position in one sentence. One counter-position.

[Repeat PARAGRAPH structure for each paragraph — 3 paragraphs total]

## CONCLUSION
2 sentences. Return to thesis. Name the biggest AO5 tension unresolved.

## PRE-WRITING CHECKLIST
- Thesis locked? [ ]
- 3 quotes selected from the bank? [ ]
- AO5 debate route chosen (Hamlet only)? [ ]
- Timing: Section A 8 min plan / 58 min write. Section B 6 min plan / 42 min write.

CRITICAL: You must use quotes from the NEHA'S QUOTE BANK section, scenes from the SCENE MAP section (if present), and critics from the CRITICS BANK section (Hamlet only, if present). Do not use any other quotes, scenes, or critics. Do not use tables at any point in the output.`;

// ────────────────────────────────────────────────────────────────────────────
// THEME KEYWORD MAPS — short labels matching the frontend thesis bank tags
// ────────────────────────────────────────────────────────────────────────────
const HAMLET_THEME_KEYWORDS: Record<string, string[]> = {
  'Delay': ['delay', 'procrastinat', 'hesitat', 'inaction', 'postpone'],
  'Madness': ['madness', 'mad ', 'insan', 'antic', 'unhinged', 'derange', 'lunatic'],
  'Revenge': ['revenge', 'vengeance', 'avenge', 'retribution', 'reveng'],
  'Corruption': ['corrupt', 'rotten', 'diseased', 'decay', 'infect', 'sick'],
  'Women': ['women', 'woman', 'female', 'ophelia', 'gertrude', 'patriarch', 'misogyn', 'mother', 'sexual'],
  'Death': ['death', 'mortality', 'die', 'dying', 'graveyard', 'skull', 'mortal'],
  'Appearance vs Reality': ['appearance', 'reality', 'seem', 'performance', 'pretend', 'mask', 'theatrical', 'act ', 'spy', 'surveillance'],
};

const DUCHESS_THEME_KEYWORDS: Record<string, string[]> = {
  'Power': ['power', 'authority', 'tyrann', 'control', 'ferdinand', 'cardinal'],
  'Gender': ['gender', 'women', 'woman', 'female', 'patriarch', 'autonomy', 'duchess', 'widow'],
  'Corruption': ['corrupt', 'court', 'diseased', 'decay', 'rotten'],
  'Madness': ['madness', 'mad ', 'lycanthrop', 'animal', 'wolf'],
  'Suffering': ['suffer', 'pain', 'torture', 'tormen', 'cruelty', 'cruel'],
  'Death': ['death', 'mortality', 'die', 'dying', 'execution'],
  'Class': ['class', 'rank', 'status', 'antonio', 'social', 'lineage', 'birth', 'transgress'],
};

// Map short labels (used in keyword maps and frontend tags) to the full DB
// theme_name strings stored in public.themes. The database stores long-form
// theme names like "Madness, Performance and Psychological Dislocation"; the
// frontend and keyword detection use short labels. This bridge keeps both
// surfaces ergonomic while letting us filter quotes by primary_theme_id.
const HAMLET_SHORT_TO_DB_THEMES: Record<string, string[]> = {
  'Delay': ['Revenge, Delay and Action'],
  'Madness': ['Madness, Performance and Psychological Dislocation'],
  'Revenge': ['Revenge, Delay and Action', 'Violence, Revenge Tragedy and Catastrophe'],
  'Corruption': ['Power, Corruption and Political Disorder', 'Disease, Decay and Moral Contamination'],
  'Women': ['Gender, Sexuality and Patriarchal Control', 'Family, Inheritance and Dynastic Breakdown'],
  'Death': ['Mortality, Death and the Afterlife'],
  'Appearance vs Reality': ['Appearance, Reality and Theatricality', 'Surveillance, Secrecy and Political Control'],
};

const DUCHESS_SHORT_TO_DB_THEMES: Record<string, string[]> = {
  'Power': ['Tyranny, Power and Male Authority'],
  'Gender': ['Gender, Sexuality and the Control of the Female Body', 'Defiance, Female Agency and Self-Determination'],
  'Corruption': ['Corruption, Moral Decay and the Italian Court', 'Disease, Poison and the Corrupted Body', 'Religion, Hypocrisy and Institutional Corruption'],
  'Madness': ['Imprisonment, Surveillance and Psychological Torture'],
  'Suffering': ['The Body, Spectacle and Theatrical Violence', 'Imprisonment, Surveillance and Psychological Torture'],
  'Death': ['Death, Dying and the Art of the Good Death'],
  'Class': ['Social Class, Merit and Aristocratic Hierarchy', 'Isolation, Loyalty and Betrayal'],
};

function detectThemes(question: string, play: string): string[] {
  const q = question.toLowerCase();
  const map = play === 'hamlet' ? HAMLET_THEME_KEYWORDS : DUCHESS_THEME_KEYWORDS;
  const matches: string[] = [];
  for (const [theme, keywords] of Object.entries(map)) {
    if (keywords.some(kw => q.includes(kw))) matches.push(theme);
  }
  return matches;
}

function shortLabelsToDbThemeNames(play: string, shortLabels: string[]): string[] {
  const map = play === 'hamlet' ? HAMLET_SHORT_TO_DB_THEMES : DUCHESS_SHORT_TO_DB_THEMES;
  const out = new Set<string>();
  for (const label of shortLabels) {
    const dbNames = map[label];
    if (dbNames) for (const n of dbNames) out.add(n);
  }
  return Array.from(out);
}

// ────────────────────────────────────────────────────────────────────────────
// SUPABASE BOOTSTRAP
// ────────────────────────────────────────────────────────────────────────────
function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('[generate-plan] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function getTextId(supabase: SupabaseClient, play: string): Promise<string | null> {
  const shortCode = play.toLowerCase().startsWith('h') ? 'HAM' : 'MAL';
  const { data, error } = await supabase
    .from('texts')
    .select('id')
    .eq('short_code', shortCode)
    .single();
  if (error || !data) {
    console.error('[generate-plan] Text not found for short_code:', shortCode, error?.message);
    return null;
  }
  return data.id as string;
}

async function getThemeIdsForLabels(
  supabase: SupabaseClient,
  textId: string,
  shortLabels: string[],
  play: string,
): Promise<string[]> {
  const dbThemeNames = shortLabelsToDbThemeNames(play, shortLabels);
  if (dbThemeNames.length === 0) return [];
  const { data, error } = await supabase
    .from('themes')
    .select('id, theme_name')
    .eq('text_id', textId)
    .in('theme_name', dbThemeNames);
  if (error || !data) {
    console.error('[generate-plan] Theme lookup failed:', error?.message);
    return [];
  }
  return (data as Array<{ id: string }>).map(r => r.id);
}

// ────────────────────────────────────────────────────────────────────────────
// QUOTE BANK
// ────────────────────────────────────────────────────────────────────────────
type QuoteRow = {
  id: string;
  content: string | null;
  speaker: string | null;
  act_scene: string | null;
  exam_sentence: string | null;
  primary_theme_id: string | null;
  scene_id: string | null;
  characters: { name: string } | null;
  themes: { theme_name: string } | null;
  quote_methods: Array<{
    word_or_detail: string | null;
    effect: string | null;
    exam_sentence: string | null;
    ao2_methods: { method_name: string } | null;
  }> | null;
};

const QUOTE_SELECT = `id, content, speaker, act_scene, exam_sentence, primary_theme_id, scene_id,
       characters ( name ),
       themes:primary_theme_id ( theme_name ),
       quote_methods ( word_or_detail, effect, exam_sentence,
         ao2_methods ( method_name ) )`;

function formatQuote(q: QuoteRow): string {
  const content = (q.content ?? '').replace(/\s+/g, ' ').trim();
  const character = q.characters?.name ?? q.speaker ?? 'Unknown';
  const theme = q.themes?.theme_name ?? 'General';
  const examSentence = q.exam_sentence ?? '';
  const methods = q.quote_methods ?? [];

  const methodLines = methods.length > 0
    ? methods
        .map(m => {
          const methodName = m.ao2_methods?.method_name ?? '—';
          const wod = m.word_or_detail ?? '—';
          const eff = m.effect ?? '—';
          return `  • Method: ${methodName} | Word/detail: ${wod} | Effect: ${eff}`;
        })
        .join('\n')
    : '  • Method: — | Word/detail: — | Effect: —';

  const exemplar = methods[0]?.exam_sentence ?? examSentence ?? '—';

  return `[THEME: ${theme}] [${character}] "${content}"\n${methodLines}\n  → Exam sentence: ${exemplar}`;
}

async function buildQuoteBank(
  play: string,
  question: string,
  themeOverride: string | null,
): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) return '(quote bank unavailable — Supabase env vars missing)';

  const textId = await getTextId(supabase, play);
  if (!textId) return '(quote bank unavailable — text not found)';

  const matchedShortLabels = themeOverride ? [themeOverride] : detectThemes(question, play);
  const FINAL_CAP = 30;

  if (matchedShortLabels.length === 0) {
    console.error(
      '[generate-plan] No theme detected for question, using broad bank:',
      question.slice(0, 80),
    );
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select(QUOTE_SELECT)
      .eq('text_id', textId);
    if (error || !quotes) {
      console.error('[generate-plan] Quote query failed:', error?.message);
      return '(quote bank unavailable — query failed)';
    }
    if ((quotes as unknown as QuoteRow[]).length === 0) {
      console.error('[generate-plan] Zero quotes returned for play:', play);
    }
    const rows = (quotes as unknown as QuoteRow[])
      .filter(q => (q.content ?? '').trim().length > 0)
      .sort((a, b) => {
        const ta = a.themes?.theme_name ?? '';
        const tb = b.themes?.theme_name ?? '';
        const ca = a.characters?.name ?? '';
        const cb = b.characters?.name ?? '';
        return ta.localeCompare(tb) || ca.localeCompare(cb);
      })
      .slice(0, FINAL_CAP);
    return rows.map(formatQuote).join('\n\n');
  }

  const themeIds = await getThemeIdsForLabels(supabase, textId, matchedShortLabels, play);

  // Primary query: filtered to matched themes (no limit on this slice).
  let primary: QuoteRow[] = [];
  if (themeIds.length > 0) {
    const { data, error } = await supabase
      .from('quotes')
      .select(QUOTE_SELECT)
      .eq('text_id', textId)
      .in('primary_theme_id', themeIds);
    if (error || !data) {
      console.error('[generate-plan] Quote query failed:', error?.message);
      return '(quote bank unavailable — query failed)';
    }
    primary = (data as unknown as QuoteRow[]).filter(q => (q.content ?? '').trim().length > 0);
  }

  if (primary.length === 0) {
    console.error('[generate-plan] Theme(s) detected but no quotes found:', matchedShortLabels.join(', '));
  }

  // Top up with cross-theme quotes (ordered by character) up to FINAL_CAP.
  let topUp: QuoteRow[] = [];
  if (primary.length < FINAL_CAP) {
    const { data, error } = await supabase
      .from('quotes')
      .select(QUOTE_SELECT)
      .eq('text_id', textId);
    if (error || !data) {
      console.error('[generate-plan] Quote top-up query failed:', error?.message);
    } else {
      const seen = new Set(primary.map(q => q.id));
      topUp = (data as unknown as QuoteRow[])
        .filter(q => !seen.has(q.id) && (q.content ?? '').trim().length > 0)
        .sort((a, b) => {
          const ca = a.characters?.name ?? a.speaker ?? '';
          const cb = b.characters?.name ?? b.speaker ?? '';
          return ca.localeCompare(cb);
        });
    }
  }

  const combined = [...primary, ...topUp].slice(0, FINAL_CAP);
  if (combined.length === 0) {
    console.error('[generate-plan] Zero quotes returned for play:', play);
    return '(quote bank unavailable — no quotes)';
  }
  return combined.map(formatQuote).join('\n\n');
}

// ────────────────────────────────────────────────────────────────────────────
// CRITICS BANK — Hamlet only (AO5 not assessed for Duchess)
// ────────────────────────────────────────────────────────────────────────────
type CriticRow = {
  themes: string[] | null;
  short_quote: string | null;
  usable_ao5_sentence: string | null;
  interpretation: string | null;
  critics: { name: string; school: string | null; core_position: string | null } | null;
};

async function buildCriticsBank(play: string, matchedShortLabels: string[]): Promise<string> {
  if (play === 'duchess' || play === 'duchess_of_malfi') return '';

  const supabase = getSupabase();
  if (!supabase) return '(critics bank unavailable — Supabase env vars missing)';

  const textId = await getTextId(supabase, play);
  if (!textId) return '(critics bank unavailable — text not found)';

  const { data, error } = await supabase
    .from('critic_interpretations')
    .select(`themes, short_quote, usable_ao5_sentence, interpretation,
             critics!inner ( name, school, core_position )`)
    .eq('text_id', textId);
  if (error || !data) {
    console.error('[generate-plan] Critics query failed:', error?.message);
    return '(critics bank unavailable — query failed)';
  }

  const all = data as unknown as CriticRow[];
  if (all.length === 0) {
    console.error('[generate-plan] Zero critics returned for play:', play);
    return '(critics bank unavailable — no critics)';
  }

  // Filter to rows whose themes array overlaps matched short labels (case-insensitive substring).
  const labelsLc = matchedShortLabels.map(l => l.toLowerCase());
  const matching = labelsLc.length === 0
    ? all
    : all.filter(c => {
        const tags = (c.themes ?? []).map(t => t.toLowerCase());
        return tags.some(tag => labelsLc.some(l => tag.includes(l) || l.includes(tag)));
      });

  if (matching.length === 0 && labelsLc.length > 0) {
    console.error('[generate-plan] Theme(s) detected but no critics found:', matchedShortLabels.join(', '));
  }

  const rows = (matching.length > 0 ? matching : all).slice(0, 8);

  return rows
    .map(c => {
      const name = c.critics?.name ?? 'Unknown critic';
      const tagList = (c.themes ?? []).join(', ') || 'general';
      const position = c.usable_ao5_sentence
        ?? c.interpretation
        ?? c.short_quote
        ?? c.critics?.core_position
        ?? '—';
      return `[THEME: ${tagList}] ${name} — "${position}"`;
    })
    .join('\n\n');
}

// ────────────────────────────────────────────────────────────────────────────
// SCENES BANK — acts_scenes table (Hamlet + Duchess)
// ────────────────────────────────────────────────────────────────────────────
type SceneRow = {
  id: string;
  scene_label: string | null;
  act_no: number | null;
  scene_no: number | null;
  synopsis: string | null;
  structural_function: string | null;
};

async function buildScenesBank(play: string, matchedShortLabels: string[]): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) return '(scenes bank unavailable — Supabase env vars missing)';

  const textId = await getTextId(supabase, play);
  if (!textId) return '(scenes bank unavailable — text not found)';

  // Try to derive scene relevance from quotes whose primary_theme_id is in matched themes.
  let prioritySceneIds: Set<string> = new Set();
  if (matchedShortLabels.length > 0) {
    const themeIds = await getThemeIdsForLabels(supabase, textId, matchedShortLabels, play);
    if (themeIds.length > 0) {
      const { data: themedQuotes, error: tqErr } = await supabase
        .from('quotes')
        .select('scene_id')
        .eq('text_id', textId)
        .in('primary_theme_id', themeIds);
      if (tqErr) {
        console.error('[generate-plan] Scenes-by-theme lookup failed:', tqErr.message);
      } else if (themedQuotes) {
        for (const r of themedQuotes as Array<{ scene_id: string | null }>) {
          if (r.scene_id) prioritySceneIds.add(r.scene_id);
        }
      }
    }
  }

  const { data, error } = await supabase
    .from('acts_scenes')
    .select('id, scene_label, act_no, scene_no, synopsis, structural_function')
    .eq('text_id', textId)
    .order('act_no', { ascending: true })
    .order('scene_no', { ascending: true });
  if (error || !data) {
    console.error('[generate-plan] Scenes query failed:', error?.message);
    return '(scenes bank unavailable — query failed)';
  }
  const scenes = data as SceneRow[];
  if (scenes.length === 0) {
    console.error('[generate-plan] Zero scenes returned for play:', play);
    return '(scenes bank unavailable — no scenes)';
  }

  const priority = scenes.filter(s => prioritySceneIds.has(s.id));
  const rest = scenes.filter(s => !prioritySceneIds.has(s.id));
  const ordered = [...priority, ...rest].slice(0, 6);

  return ordered
    .map(s => {
      const label = s.scene_label ?? `${s.act_no ?? '?'}.${s.scene_no ?? '?'}`;
      const blurb = s.synopsis ?? s.structural_function ?? '—';
      return `[${label}] ${blurb}`;
    })
    .join('\n');
}

// ────────────────────────────────────────────────────────────────────────────
// HANDLER
// ────────────────────────────────────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body: { question?: string; play?: string; theme?: string | null };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { question, play, theme } = body;
  if (!question || !play) {
    return new Response(JSON.stringify({ error: 'Missing question or play' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const matchedThemes = theme ? [theme] : detectThemes(question, play);

  const [quoteBank, scenesBank, criticsBank] = await Promise.all([
    buildQuoteBank(play, question, theme ?? null),
    buildScenesBank(play, matchedThemes),
    buildCriticsBank(play, matchedThemes),
  ]);

  const sectionParts: string[] = [
    SYSTEM_PROMPT_BASE,
    '',
    '═══════════════════════════════════════',
    "## NEHA'S QUOTE BANK (USE THESE — DO NOT INVENT QUOTES)",
    '═══════════════════════════════════════',
    '',
    quoteBank,
  ];

  if (scenesBank && !scenesBank.startsWith('(scenes bank unavailable')) {
    sectionParts.push(
      '',
      '═══════════════════════════════════════',
      "## NEHA'S SCENE MAP (USE FOR DRAMATIC LOCATION)",
      '═══════════════════════════════════════',
      '',
      scenesBank,
    );
  }

  if (criticsBank && !criticsBank.startsWith('(critics bank unavailable')) {
    sectionParts.push(
      '',
      '═══════════════════════════════════════',
      "## NEHA'S CRITICS BANK (HAMLET ONLY — USE THESE FOR AO5)",
      '═══════════════════════════════════════',
      '',
      criticsBank,
      '',
      'For AO5 paragraphs, prefer critics from this bank over the hardcoded AO5 DEBATE ROUTES section. The hardcoded routes are fallback positions; the bank above is current curated content.',
    );
  }

  sectionParts.push(
    '',
    'You MUST use quotes from the QUOTE BANK in the essay plan. Reference the exact quote text, AO2 method(s), and exam sentence provided. Do not fabricate quotes, scenes, or critics not listed in this prompt.',
  );

  const systemPrompt = sectionParts.join('\n');

  const userMsg = `EXAM QUESTION (${
    play === 'hamlet'
      ? 'Section A — Hamlet, 35 marks'
      : 'Section B — The Duchess of Malfi, 25 marks'
  }):\n\n${question}`;

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      stream: true,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMsg }],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text();
    return new Response(errText, { status: upstream.status });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buf = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;
            try {
              const evt = JSON.parse(payload);
              if (
                evt.type === 'content_block_delta' &&
                evt.delta?.type === 'text_delta' &&
                typeof evt.delta.text === 'string'
              ) {
                controller.enqueue(encoder.encode(evt.delta.text));
              }
            } catch {
              // ignore malformed SSE chunks
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
