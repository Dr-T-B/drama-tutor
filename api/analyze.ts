import { createClient } from '@supabase/supabase-js'

export const config = { maxDuration: 30 }

const GRADE_ORDER: Record<string, number> = { B: 0, A: 1, A_STAR: 2 }

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { themeId, question } = (req.body ?? {}) as { themeId?: string; question?: string }
  if (!themeId || !question) {
    return res.status(400).json({ error: 'themeId and question are required' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch theme first to discover textId.
  const { data: theme, error: themeErr } = await supabase
    .from('themes')
    .select(`
      id, theme_code, theme_name, section_relevance, text_id,
      texts!inner(short_code, title),
      theme_theses(thesis_text, grade_band, ao_focus, examiner_commentary),
      theme_guidance(guidance_type, content, ao_code, target_level)
    `)
    .eq('id', themeId)
    .single()

  if (themeErr || !theme) {
    return res.status(500).json({ error: themeErr?.message ?? 'Theme not found' })
  }

  const textId = (theme as any).text_id
  const playShort = (theme as any).texts.short_code as string
  const playTitle = (theme as any).texts.title as string
  const sectionRelevance = (theme as any).section_relevance as string

  const [
    quotesRes,
    criticsRes,
    charactersRes,
    themeLinksRes,
    methodsRes,
    errorsRes,
    stemsRes,
    plansRes,
  ] = await Promise.all([
    supabase
      .from('quotes')
      .select('*, quote_methods(word_or_detail, effect, ao2_methods(method_name))')
      .eq('primary_theme_id', themeId)
      .order('memorisation_priority', { ascending: false, nullsFirst: false })
      .limit(10),
    supabase
      .from('critic_interpretations')
      .select('*, critics(name, school)')
      .eq('theme_id', themeId),
    supabase
      .from('characters')
      .select('*')
      .eq('text_id', textId)
      .order('name'),
    supabase
      .from('character_theme_links')
      .select('character_id')
      .eq('theme_id', themeId),
    supabase
      .from('ao2_methods')
      .select('*')
      .eq('text_id', textId)
      .order('method_category'),
    supabase
      .from('common_errors')
      .select('*')
      .order('severity', { ascending: false })
      .limit(8),
    supabase.from('paragraph_sentence_stems').select('*'),
    supabase.from('essay_plans').select('*').eq('theme_id', themeId),
  ])

  for (const r of [quotesRes, criticsRes, charactersRes, themeLinksRes, methodsRes, errorsRes, stemsRes, plansRes]) {
    if (r.error) return res.status(500).json({ error: r.error.message })
  }

  const quoteIds = (quotesRes.data ?? []).map((q: any) => q.id)
  const aoByQuote = new Map<string, string[]>()
  if (quoteIds.length) {
    const { data: aoLinks, error: aoErr } = await supabase
      .from('quote_ao_links')
      .select('quote_id, ao_code')
      .in('quote_id', quoteIds)
    if (aoErr) return res.status(500).json({ error: aoErr.message })
    for (const link of aoLinks ?? []) {
      const arr = aoByQuote.get(link.quote_id) ?? []
      arr.push(link.ao_code)
      aoByQuote.set(link.quote_id, arr)
    }
  }
  const quotesWithAo = (quotesRes.data ?? []).map((q: any) => ({
    ...q,
    ao_codes: aoByQuote.get(q.id) ?? [],
  }))

  const linkedIds = new Set((themeLinksRes.data ?? []).map((r: any) => r.character_id))
  const characters = (charactersRes.data ?? []).map((c: any) => ({
    ...c,
    theme_linked: linkedIds.has(c.id),
  }))

  const theses = [...((theme as any).theme_theses ?? [])].sort(
    (a: any, b: any) => (GRADE_ORDER[a.grade_band] ?? 0) - (GRADE_ORDER[b.grade_band] ?? 0)
  )

  const data = {
    theme: {
      id: (theme as any).id,
      theme_code: (theme as any).theme_code,
      theme_name: (theme as any).theme_name,
      section_relevance: sectionRelevance,
      play: playShort,
      play_title: playTitle,
    },
    theses,
    guidance: (theme as any).theme_guidance ?? [],
    quotes: quotesWithAo,
    critics: criticsRes.data ?? [],
    characters,
    methods: methodsRes.data ?? [],
    commonErrors: errorsRes.data ?? [],
    stems: stemsRes.data ?? [],
    essayPlans: plansRes.data ?? [],
  }

  // Build user-message context for Claude.
  const topQuotes = data.quotes.slice(0, 6).map((q: any) => ({
    quote: q.quote_text ?? q.text ?? q.content,
    speaker: q.speaker,
    act_scene: q.act_scene,
    methods: (q.quote_methods ?? []).map((m: any) => ({
      method: m.ao2_methods?.method_name,
      detail: m.word_or_detail,
      effect: m.effect,
    })),
  }))
  const topCritics = data.critics.slice(0, 6).map((c: any) => ({
    name: c.critics?.name,
    school: c.critics?.school,
    interpretation: c.interpretation ?? c.position ?? c.summary,
    usable_ao5_sentence: c.usable_ao5_sentence,
  }))
  const linkedCharacters = data.characters
    .filter((c: any) => c.theme_linked)
    .map((c: any) => ({ name: c.name, function: c.dramatic_function }))
  const aStarTheses = data.theses
    .filter((t: any) => t.grade_band === 'A_STAR' || t.grade_band === 'A')
    .map((t: any) => ({ thesis: t.thesis_text, ao_focus: t.ao_focus, commentary: t.examiner_commentary }))
  const examWarnings = data.guidance
    .filter((g: any) => g.guidance_type === 'exam_warning')
    .map((g: any) => g.content)

  const playLabel = playShort === 'HAM' ? 'Hamlet' : playTitle
  const systemPrompt =
`You are an Edexcel A-Level English Literature senior examiner for Component 1 Drama (9ET0/01), producing an exam-technique framework targeting A*.
Text: ${playLabel} | ${sectionRelevance ?? ''} | Theme: ${(theme as any).theme_name}

AOs for Component 1:
- AO1 (16 marks): Articulate informed, personal and creative responses using concepts and terminology.
- AO2 (16 marks): Analyse how meanings are shaped — methods, form, structure, language. Always methods→meaning, never feature-spotting.
- AO3 (8 marks): Significance and influence of contexts in which texts are written and received.
- AO4 (Section A — Hamlet only): Connections across literary texts.
- AO5 (within AO1): Informed by different interpretations.

Return ONLY valid JSON with this exact structure — no markdown fences, no preamble:
{
  "question_decoded": {
    "command_word": "string",
    "what_is_really_asked": "string",
    "conceptual_trap": "string",
    "examiner_wants": "string"
  },
  "core_argument": {
    "recommended_thesis": "string",
    "argument_direction": "string",
    "dialectical_move": "string",
    "section_note": "string"
  },
  "ao_breakdown": { "ao1": "string", "ao2": "string", "ao3": "string", "ao4": "string", "ao5": "string" },
  "character_guidance": [
    { "name": "string", "priority": "essential|strong|optional", "why": "string", "angle": "string" }
  ],
  "quote_selection": [
    { "quote": "string", "speaker": "string", "why_this_question": "string", "method_to_foreground": "string", "ao5_pairing": "string" }
  ],
  "critic_deployment": [
    { "critic": "string", "position": "string", "when_to_use": "string", "sentence": "string" }
  ],
  "method_focus": [
    { "method": "string", "why_central": "string", "exam_move": "string" }
  ],
  "errors_to_avoid": ["string"],
  "forbidden_moves": ["string"]
}`

  const userMessage =
`EXAM QUESTION:
${question}

THEME: ${(theme as any).theme_name} (${(theme as any).theme_code})
PLAY: ${playLabel}
SECTION: ${sectionRelevance ?? ''}

TOP QUOTES (from candidate's revision data):
${JSON.stringify(topQuotes, null, 2)}

CRITICS (AO5):
${JSON.stringify(topCritics, null, 2)}

THEME-LINKED CHARACTERS:
${JSON.stringify(linkedCharacters, null, 2)}

A/A★ THESES (saved):
${JSON.stringify(aStarTheses, null, 2)}

EXAM WARNINGS (theme-specific):
${JSON.stringify(examWarnings, null, 2)}

Build the A*-targeted framework as specified. Quote selections must be chosen FROM the supplied top quotes list. Critic deployment must use the supplied critics. Return JSON only.`

  let aiJson: any
  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!aiRes.ok) {
      const errText = await aiRes.text()
      return res.status(500).json({ error: `Anthropic API ${aiRes.status}: ${errText}` })
    }

    const aiBody = await aiRes.json()
    let text: string = aiBody?.content?.[0]?.text ?? ''
    text = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()

    try {
      aiJson = JSON.parse(text)
    } catch (parseErr: any) {
      return res.status(500).json({ error: 'Failed to parse AI JSON', raw: text, parseError: String(parseErr) })
    }
  } catch (err: any) {
    return res.status(500).json({ error: `AI call failed: ${String(err?.message ?? err)}` })
  }

  res.status(200).json({ data, ai: aiJson })
}
