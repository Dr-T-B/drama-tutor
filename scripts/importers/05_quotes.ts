import { supabase } from '../lib/supabaseAdmin.js'
import { register } from '../lib/ids.js'
import { ok, err, info, warn, section } from '../lib/log.js'
import {
  readBlock, parseAllVerticalTables, normaliseQuoteId, normaliseThemeCode,
  parseThemeCodeList, parseMethodChain, cleanQuoteText, clean, priorityForTheme,
} from '../lib/parsers.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

// ─── Build lookup maps from DB ────────────────────────────────────────────────
type Lookups = {
  themes:     Map<string, string>   // theme_code → id
  characters: Map<string, string>   // lowercased name/alias → id (within this text)
  methods:    Map<string, string>   // lowercased method name → id
}

async function buildLookups(textId: string): Promise<Lookups> {
  const lookups: Lookups = { themes: new Map(), characters: new Map(), methods: new Map() }

  const { data: themes } = await supabase.from('themes').select('id, theme_code').eq('text_id', textId)
  for (const t of themes ?? []) lookups.themes.set(t.theme_code, t.id)

  const { data: chars } = await supabase.from('characters').select('id, name').eq('text_id', textId)
  for (const c of chars ?? []) lookups.characters.set(c.name.toLowerCase(), c.id)

  const { data: aliases } = await supabase
    .from('character_aliases')
    .select('character_id, alias, characters!inner(text_id)')
    .eq('characters.text_id', textId)
  for (const a of aliases ?? []) {
    lookups.characters.set(a.alias.toLowerCase().trim(), a.character_id)
  }

  const { data: methods } = await supabase.from('ao2_methods').select('id, method_name').eq('text_id', textId)
  for (const m of methods ?? []) lookups.methods.set(m.method_name.toLowerCase(), m.id)
  return lookups
}

// Resolve a "speaker" string to a character_id and a normalised speaker form.
// Returns { characterId, normalisedSpeaker } where normalisedSpeaker matches
// either the character's canonical name or one of its aliases — required by
// the enforce_quote_speaker_character_consistency trigger.
function resolveCharacter(
  speaker: string,
  lookups: Lookups,
): { characterId: string | null; normalisedSpeaker: string } {
  if (!speaker) return { characterId: null, normalisedSpeaker: speaker }
  const raw = speaker.trim()
  const s = raw.toLowerCase()

  // Direct match — speaker text is already a registered name/alias.
  if (lookups.characters.has(s)) {
    return { characterId: lookups.characters.get(s)!, normalisedSpeaker: raw }
  }

  // Compound speakers like "The Duchess / Bosola" — leave unlinked.
  if (s.includes('/') || s.includes(' and ')) {
    return { characterId: null, normalisedSpeaker: raw }
  }

  // Strip parenthetical qualifiers: "Bosola (to the Cardinal)" → "Bosola"
  const stripped = s.replace(/\(.*?\)/g, '').trim()
  if (stripped !== s && lookups.characters.has(stripped)) {
    // Use the title-cased clean form so the trigger sees an alias match.
    const cleaned = raw.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim()
    return { characterId: lookups.characters.get(stripped)!, normalisedSpeaker: cleaned }
  }

  // Try removing leading articles ("The Cardinal" → "Cardinal" if alias only)
  const noLeading = stripped.replace(/^the\s+/, '').trim()
  if (lookups.characters.has(noLeading)) {
    return { characterId: lookups.characters.get(noLeading)!, normalisedSpeaker: raw }
  }
  return { characterId: null, normalisedSpeaker: raw }
}

// Resolve a method-name token to a method_id (text-scoped).
function resolveMethod(token: string, lookups: Lookups): string | null {
  const t = token.toLowerCase().trim()
  if (!t) return null
  if (lookups.methods.has(t)) return lookups.methods.get(t)!
  // Try removing common prefixes/suffixes
  const variants = [
    t.replace(/^imagery\s*[—\-:]\s*/, ''),
    t.replace(/\s+imagery$/, ''),
    t.replace(/^the\s+/, ''),
  ]
  for (const v of variants) {
    if (lookups.methods.has(v)) return lookups.methods.get(v)!
  }
  // Substring match
  for (const [k, v] of lookups.methods.entries()) {
    if (k.includes(t) || t.includes(k)) return v
  }
  return null
}

async function importQuotesFromFile(
  blockFile: string,
  textCode: 'HAM' | 'MAL',
  textId: string,
  lookups: Lookups,
) {
  section(`05 — Quotes (${textCode}) — ${blockFile}`)
  const md = readBlock(blockFile)
  const tables = parseAllVerticalTables(md)
  // Filter: only tables that have a Quote ID field
  const quoteTables = tables.filter(t => t.has('Quote ID') || t.has('Quote ID'))
  info(`Parsed ${quoteTables.length} quote tables`)

  let inserted = 0
  for (const t of quoteTables) {
    const quoteId       = normaliseQuoteId(t.get('Quote ID') ?? t.get('Quote ID') ?? '')
    if (!quoteId) continue
    const quoteText     = cleanQuoteText(t.get('Quote') ?? '')
    const speaker       = clean(t.get('Speaker') ?? '')
    const location      = clean(t.get('Location') ?? '')
    const primaryCode   = normaliseThemeCode(clean(t.get('Primary theme') ?? '').replace(/\\_/g, '_'))
    const secondaryCodes= parseThemeCodeList(t.get('Secondary themes') ?? '')
    const ao2MethodRaw  = clean(t.get('AO2 method') ?? '')
    const methodChain   = parseMethodChain(t.get('Method → Word → Effect → Theme') ?? '')
    const dramaticFn    = clean(t.get('Dramatic function') ?? '')
    const ao3Trigger    = clean(t.get('AO3 context trigger') ?? '')
    const ao5Interp     = clean(t.get('AO5 interpretation') ?? '')
    const examUse       = clean(t.get('Exam use') ?? '')

    if (!quoteText) { err(`${quoteId}: empty quote text`); continue }

    // Resolve FKs
    const primaryThemeId = lookups.themes.get(primaryCode) ?? null
    const { characterId, normalisedSpeaker } = resolveCharacter(speaker, lookups)
    let sceneId: string | null = null
    if (location) {
      const { data } = await supabase
        .from('acts_scenes')
        .select('id')
        .eq('text_id', textId)
        .eq('scene_label', location)
        .maybeSingle()
      sceneId = data?.id ?? null
    }

    // Upsert the quote row
    const { data: quoteRow, error: qErr } = await supabase
      .from('quotes')
      .upsert({
        text_id:             textId,
        primary_theme_id:    primaryThemeId,
        character_id:        characterId,
        scene_id:            sceneId,
        quote_id:            quoteId,
        content:             quoteText,
        speaker:             normalisedSpeaker || null,
        act_scene:           location || null,
        dramatic_moment:     null,
        structural_function: dramaticFn || null,
        exam_sentence:       examUse || null,
        memorisation_priority: priorityForTheme(primaryCode),
      }, { onConflict: 'text_id,quote_id' })
      .select('id')
      .single()
    if (qErr || !quoteRow) { err(`Quote ${quoteId}: ${qErr?.message}`); continue }
    register(`quote:${quoteId}`, quoteRow.id)
    inserted++

    // Idempotent rebuild of child rows
    await supabase.from('quote_secondary_themes').delete().eq('quote_id', quoteRow.id)
    await supabase.from('quote_methods').delete().eq('quote_id', quoteRow.id)
    await supabase.from('quote_ao_links').delete().eq('quote_id', quoteRow.id)

    // Secondary themes
    if (secondaryCodes.length > 0) {
      const rows = secondaryCodes
        .filter(code => lookups.themes.has(code) && code !== primaryCode)
        .map(code => ({ quote_id: quoteRow.id, theme_id: lookups.themes.get(code)! }))
      if (rows.length > 0) {
        const { error } = await supabase.from('quote_secondary_themes').insert(rows)
        if (error) err(`  ${quoteId} secondary themes: ${error.message}`)
      }
    }

    // Methods (split AO2 method on / or ;)
    const methodTokens = ao2MethodRaw
      .split(/[\/;]/)
      .map(s => s.trim())
      .filter(Boolean)
    const seenMethods = new Set<string>()
    for (const token of methodTokens) {
      const methodId = resolveMethod(token, lookups)
      if (!methodId) continue
      if (seenMethods.has(methodId)) continue
      seenMethods.add(methodId)
      const word = methodChain.word || ''
      const { error } = await supabase.from('quote_methods').insert({
        quote_id:       quoteRow.id,
        method_id:      methodId,
        word_or_detail: word || null,
        effect:         methodChain.effect || null,
        exam_sentence:  examUse || null,
      })
      if (error) err(`  ${quoteId} method ${token}: ${error.message}`)
    }

    // AO links
    const aoLinks: Array<{ ao_code: 'AO1' | 'AO2' | 'AO3' | 'AO5'; note: string }> = []
    if (dramaticFn) aoLinks.push({ ao_code: 'AO1', note: dramaticFn })
    if (ao2MethodRaw) aoLinks.push({ ao_code: 'AO2', note: methodChain.effect || ao2MethodRaw })
    if (ao3Trigger) aoLinks.push({ ao_code: 'AO3', note: ao3Trigger })
    if (textCode === 'HAM' && ao5Interp) aoLinks.push({ ao_code: 'AO5', note: ao5Interp })
    if (aoLinks.length > 0) {
      const rows = aoLinks
        .filter(l => l.note && l.note.length > 0)
        .map(l => ({ quote_id: quoteRow.id, ao_code: l.ao_code, note: l.note }))
      if (rows.length > 0) {
        const { error } = await supabase.from('quote_ao_links').insert(rows)
        if (error) err(`  ${quoteId} AO links: ${error.message}`)
      }
    }

    if (inserted % 20 === 0) {
      info(`  …${inserted} ${textCode} quotes processed`)
      // Tiny pause to be polite to the API.
      await new Promise(r => setTimeout(r, 100))
    }
  }
  ok(`${textCode}: imported ${inserted} quotes from ${blockFile}`)
}

console.time('quotes')
const hamLookups = await buildLookups(hamRow.id)
const malLookups = await buildLookups(malRow.id)
await importQuotesFromFile('block3_part1_hamlet_quotes_methods.md', 'HAM', hamRow.id, hamLookups)
await importQuotesFromFile('block3_part2_hamlet_quotes_T07_T12.md',  'HAM', hamRow.id, hamLookups)
await importQuotesFromFile('block6_part1_MAL_T01-T06.md',             'MAL', malRow.id, malLookups)
await importQuotesFromFile('block6_part2_MAL_T07-T12.md',             'MAL', malRow.id, malLookups)
console.timeEnd('quotes')

console.log('\n✅  05 Quotes complete\n')
