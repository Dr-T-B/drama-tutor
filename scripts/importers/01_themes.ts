import { supabase } from '../lib/supabaseAdmin.js'
import { register } from '../lib/ids.js'
import { ok, err, info, section } from '../lib/log.js'
import {
  readBlock, splitByH3, parseHorizontalTable, parseAllHorizontalTables,
  extractThemeCode, clean,
} from '../lib/parsers.js'
import 'dotenv/config'

// Resolve text IDs (assumes 00_seed has run; if running standalone, query directly).
const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) {
  err('Texts not found — run 00_seed first.'); process.exit(1)
}
const hamTextId = hamRow.id
const malTextId = malRow.id

type Guidance = { ao_code: 'AO1' | 'AO3' | 'AO5' | null; guidance_type: 'core_argument' | 'context_trigger' | 'critical_debate'; content: string }
type Thesis   = { grade_band: 'B' | 'A' | 'A_STAR'; thesis_text: string }
type Theme    = { code: string; name: string; guidance: Guidance[]; theses: Thesis[] }

function extractGuidanceAndTheses(body: string): { guidance: Guidance[]; theses: Thesis[] } {
  const guidance: Guidance[] = []

  // Match each labelled paragraph. Paragraphs may span multiple lines.
  const patterns: Array<{ re: RegExp; ao: 'AO1' | 'AO3' | 'AO5' | null; type: Guidance['guidance_type'] }> = [
    { re: /\*\*Core conceptual argument\s*\[AO1\]:\*\*\s*([\s\S]*?)(?=\n\n|\*\*Key scenes|\*\*AO3|\*\*AO5|\*\*\[AO5)/i, ao: 'AO1', type: 'core_argument' },
    { re: /\*\*AO3 context trigger[^*]*\*\*\s*([\s\S]*?)(?=\n\n|\*\*AO5|\*\*\[AO5|$)/i, ao: 'AO3', type: 'context_trigger' },
    { re: /\*\*AO5 alternative interpretation:\*\*\s*([\s\S]*?)(?=\n\n|$)/i, ao: 'AO5', type: 'critical_debate' },
    { re: /\*\*\[AO5\s*[—–-]?\s*optional enrichment\]:?\*\*\s*([\s\S]*?)(?=\n\n|$)/i, ao: 'AO5', type: 'critical_debate' },
  ]
  for (const p of patterns) {
    const m = body.match(p.re)
    if (m && m[1]) {
      const content = clean(m[1]).replace(/\s+/g, ' ').trim()
      if (content && !guidance.some(g => g.guidance_type === p.type)) {
        guidance.push({ ao_code: p.ao, guidance_type: p.type, content })
      }
    }
  }

  const theses: Thesis[] = []
  // The first horizontal table in each theme section is the Level | Version table.
  const tables = parseAllHorizontalTables(body)
  for (const table of tables) {
    for (const row of table) {
      const levelKey = Object.keys(row).find(k => /level/i.test(k))
      const versionKey = Object.keys(row).find(k => /version|central idea|central\s*idea/i.test(k))
      if (!levelKey || !versionKey) continue
      const level = clean(row[levelKey]).replace(/\\\*/g, '*')
      const text  = clean(row[versionKey])
      if (!text) continue
      let band: Thesis['grade_band'] | null = null
      if (/grade\s*b\b/i.test(level)) band = 'B'
      else if (/grade\s*a\*/i.test(level)) band = 'A_STAR'
      else if (/grade\s*a\b/i.test(level) && !/a\*/.test(level)) band = 'A'
      if (band) theses.push({ grade_band: band, thesis_text: text })
    }
    if (theses.length >= 3) break
  }
  return { guidance, theses }
}

function parseThemes(md: string): Theme[] {
  const themes: Theme[] = []
  for (const sec of splitByH3(md)) {
    const tc = extractThemeCode(sec.title)
    if (!tc) continue
    const { guidance, theses } = extractGuidanceAndTheses(sec.body)
    themes.push({ code: tc.code, name: tc.name, guidance, theses })
  }
  return themes
}

async function importThemesForText(textCode: 'HAM' | 'MAL', textId: string, blockFile: string) {
  section(`01 — Themes (${textCode})`)
  const md = readBlock(blockFile)
  const themes = parseThemes(md)
  if (themes.length === 0) { err(`No themes parsed from ${blockFile}`); return }
  info(`Parsed ${themes.length} themes from ${blockFile}`)

  for (const t of themes) {
    const { data: themeRow, error: themeErr } = await supabase
      .from('themes')
      .upsert({
        text_id:    textId,
        theme_code: t.code,
        theme_name: t.name,
        section_relevance: textCode === 'HAM' ? 'SECTION_A' : 'SECTION_B',
      }, { onConflict: 'text_id,theme_code' })
      .select('id')
      .single()

    if (themeErr || !themeRow) { err(`Theme ${t.code}: ${themeErr?.message}`); continue }
    register(`theme:${t.code}`, themeRow.id)

    // Idempotent guidance: delete then insert
    await supabase.from('theme_guidance').delete().eq('theme_id', themeRow.id)
    if (t.guidance.length > 0) {
      const { error: gErr } = await supabase
        .from('theme_guidance')
        .insert(t.guidance.map(g => ({ ...g, theme_id: themeRow.id })))
      if (gErr) err(`  guidance ${t.code}: ${gErr.message}`)
    }

    // Idempotent theses: delete then insert
    await supabase.from('theme_theses').delete().eq('theme_id', themeRow.id)
    if (t.theses.length > 0) {
      const aoFocus = textCode === 'HAM' ? ['AO1', 'AO5'] : ['AO1', 'AO3']
      const { error: tErr } = await supabase
        .from('theme_theses')
        .insert(t.theses.map(th => ({
          theme_id:    themeRow.id,
          grade_band:  th.grade_band,
          thesis_text: th.thesis_text,
          ao_focus:    aoFocus,
        })))
      if (tErr) err(`  theses ${t.code}: ${tErr.message}`)
    }

    ok(`${t.code} — ${t.name} (guidance:${t.guidance.length}, theses:${t.theses.length})`)
  }
}

await importThemesForText('HAM', hamTextId, 'block2_hamlet_conceptual_overview.md')
await importThemesForText('MAL', malTextId, 'block5_duchess_conceptual_overview.md')

console.log('\n✅  01 Themes complete\n')
