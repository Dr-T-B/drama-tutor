import { supabase } from '../lib/supabaseAdmin.js'
import { register } from '../lib/ids.js'
import { ok, err, info, section } from '../lib/log.js'
import { readBlock, splitByH2, splitByH3, clean } from '../lib/parsers.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

type CharRecord = {
  name: string
  dramatic_function?: string
  key_argument?: string
  trajectory?: string
}

function extractField(body: string, label: string): string | undefined {
  const re = new RegExp(`\\*\\*${label}[^*]*\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i')
  const m = body.match(re)
  if (!m || !m[1]) return undefined
  return clean(m[1]).replace(/\s+/g, ' ').trim() || undefined
}

function parseCharacters(md: string): CharRecord[] {
  const characters: CharRecord[] = []
  // Find the "Character Analysis" section (## 2c. or ## 5c.)
  const h2 = splitByH2(md)
  const charSection = h2.find(s => /character\s*analysis/i.test(s.title))
  if (!charSection) return characters
  for (const sec of splitByH3(charSection.body)) {
    const name = clean(sec.title)
    if (!name || /completion|next step|tragic genre|act-by-act/i.test(name)) continue
    characters.push({
      name,
      dramatic_function: extractField(sec.body, 'Dramatic function'),
      key_argument: extractField(sec.body, 'Key character argument'),
      trajectory: extractField(sec.body, 'AO2 — Dominant methods'),
    })
  }
  return characters
}

// Title-case a heading like "HAMLET" → "Hamlet", "THE DUCHESS" → "The Duchess"
function normaliseName(raw: string): string {
  const t = raw.trim()
  if (!t) return t
  return t.split(/\s+/).map(w => w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(' ')
}

async function importCharactersForText(textCode: 'HAM' | 'MAL', textId: string, blockFile: string, extraNames: string[]) {
  section(`02 — Characters (${textCode})`)
  const md = readBlock(blockFile)
  const records = parseCharacters(md)
  info(`Parsed ${records.length} character profiles from ${blockFile}`)

  const seen = new Set<string>()
  for (const c of records) {
    const name = normaliseName(c.name)
    seen.add(name.toLowerCase())
    const { data, error } = await supabase
      .from('characters')
      .upsert({
        text_id:  textId,
        name,
        dramatic_function: c.dramatic_function ?? null,
        key_argument:      c.key_argument ?? null,
        trajectory:        c.trajectory ?? null,
      }, { onConflict: 'text_id,name' })
      .select('id')
      .single()
    if (error || !data) { err(`Char ${name}: ${error?.message}`); continue }
    register(`character:${textCode}:${name}`, data.id)
    register(`character:${textCode}:${name.toLowerCase()}`, data.id)
    ok(`Character ${name}`)
  }

  // Insert minimal stub characters for speakers that appear in quotes but lack full profiles.
  for (const extra of extraNames) {
    if (seen.has(extra.toLowerCase())) continue
    const { data, error } = await supabase
      .from('characters')
      .upsert({
        text_id: textId,
        name: extra,
        dramatic_function: 'Speaker referenced in the quote bank.',
        key_argument: null,
      }, { onConflict: 'text_id,name' })
      .select('id')
      .single()
    if (error || !data) { err(`Char ${extra}: ${error?.message}`); continue }
    register(`character:${textCode}:${extra}`, data.id)
    register(`character:${textCode}:${extra.toLowerCase()}`, data.id)
    ok(`Character ${extra} (stub)`)
  }
}

// Speakers from the quote bank that don't have full profiles in the conceptual blocks.
const HAM_EXTRA = ['Ghost', 'Laertes', 'Marcellus', 'Fortinbras']
const MAL_EXTRA: string[] = []   // block5 covers all named speakers

await importCharactersForText('HAM', hamRow.id, 'block2_hamlet_conceptual_overview.md', HAM_EXTRA)
await importCharactersForText('MAL', malRow.id, 'block5_duchess_conceptual_overview.md', MAL_EXTRA)

// ─── Aliases ──────────────────────────────────────────────────────────────────
section('02 — Character aliases')

const aliasMap: Array<{ text: 'HAM' | 'MAL'; canonical: string; aliases: Array<{ alias: string; type: 'display' | 'alternate_name' | 'abbreviation' }> }> = [
  { text: 'HAM', canonical: 'Ghost',     aliases: [{ alias: 'King Hamlet', type: 'alternate_name' }, { alias: 'the Ghost', type: 'display' }] },
  { text: 'HAM', canonical: 'Hamlet',    aliases: [{ alias: 'Prince Hamlet', type: 'display' }] },
  { text: 'MAL', canonical: 'The Duchess', aliases: [{ alias: 'Duchess', type: 'display' }, { alias: 'The Duchess of Malfi', type: 'display' }] },
  { text: 'MAL', canonical: 'The Cardinal', aliases: [{ alias: 'Cardinal', type: 'display' }] },
]

for (const { text, canonical, aliases } of aliasMap) {
  const textId = text === 'HAM' ? hamRow.id : malRow.id
  const { data: charRow } = await supabase
    .from('characters')
    .select('id')
    .eq('text_id', textId)
    .eq('name', canonical)
    .single()
  if (!charRow) { err(`Alias parent missing: ${canonical}`); continue }
  for (const a of aliases) {
    const { error } = await supabase
      .from('character_aliases')
      .upsert({ character_id: charRow.id, alias: a.alias, alias_type: a.type })
    if (error) err(`  alias ${canonical} → ${a.alias}: ${error.message}`)
    else ok(`  alias ${canonical} → ${a.alias}`)
  }
}

console.log('\n✅  02 Characters complete\n')
