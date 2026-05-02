import { supabase } from '../lib/supabaseAdmin.js'
import { register } from '../lib/ids.js'
import { ok, err, info, section } from '../lib/log.js'
import {
  readBlock, splitByH2, splitByH3, parseVerticalTable,
  parseThemeCodeList, clean,
} from '../lib/parsers.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
if (!hamRow) { err('Texts not found.'); process.exit(1) }

type CriticRec = {
  name: string
  school: string
  core_position: string
  key_text: string
  source_note: string
  worked_example: string
  theme_codes: string[]      // codes from "What X unlocks"
}

function parseCritics(md: string): CriticRec[] {
  const records: CriticRec[] = []
  const h2 = splitByH2(md)
  const profiles = h2.find(s => /4a\.\s*AO5 Critical Profiles/i.test(s.title))
  if (!profiles) return records
  for (const sec of splitByH3(profiles.body)) {
    // Heading like "1. A.C. BRADLEY (1851–1935)" or "4. ELAINE SHOWALTER (b. 1941)"
    const m = sec.title.match(/^\d+\.\s*(.+?)\s*\(([^)]*\d{4}[^)]*)\)$/)
    if (!m) continue
    const rawName = m[1].trim()
    const dates = m[2].trim()
    const t = parseVerticalTable(sec.body)
    if (t.size === 0) continue
    // The "What X unlocks" key uses the critic's surname; find it dynamically.
    const unlocksKey = [...t.keys()].find(k => /^What\s+.+?\s+unlocks$/i.test(k))
    const unlocksText = unlocksKey ? t.get(unlocksKey) ?? '' : ''
    records.push({
      name:           toTitleCase(rawName),
      school:         t.get('School') ?? '',
      core_position:  t.get('Core position on *Hamlet*') ?? t.get('Core position') ?? '',
      key_text:       t.get('Key text') ?? '',
      source_note:    `${dates}`,
      worked_example: t.get('Worked example') ?? '',
      theme_codes:    parseThemeCodeList(unlocksText),
    })
  }
  return records
}

function toTitleCase(s: string): string {
  // Preserve initials like "A.C." — only transform fully-uppercase tokens.
  return s.split(/\s+/).map(w => {
    if (/[a-z]/.test(w)) return w
    if (/^[A-Z]\.[A-Z]\./.test(w)) return w     // A.C., T.S.
    return w[0] + w.slice(1).toLowerCase()
  }).join(' ')
}

section('04 — Critics')
const critics = parseCritics(readBlock('block4_hamlet_critics_plans_models.md'))
info(`Parsed ${critics.length} critics`)

// Resolve theme IDs that were registered by 01_themes.
async function getThemeId(code: string): Promise<string | null> {
  const { data } = await supabase
    .from('themes').select('id').eq('theme_code', code).maybeSingle()
  return data?.id ?? null
}

for (const c of critics) {
  // Insert / lookup critic. "critics" has unique (name, coalesce(key_text, '')).
  // Use select-then-insert pattern since onConflict can't directly target a coalesce expression.
  let criticId: string
  const { data: existing } = await supabase
    .from('critics')
    .select('id')
    .eq('name', c.name)
    .eq('key_text', c.key_text)
    .maybeSingle()
  if (existing) {
    criticId = existing.id
    await supabase.from('critics').update({
      school: c.school, core_position: c.core_position, source_note: c.source_note,
    }).eq('id', criticId)
  } else {
    const { data: inserted, error } = await supabase
      .from('critics')
      .insert({
        name: c.name, school: c.school, core_position: c.core_position,
        key_text: c.key_text, source_note: c.source_note,
      })
      .select('id')
      .single()
    if (error || !inserted) { err(`Critic ${c.name}: ${error?.message}`); continue }
    criticId = inserted.id
  }
  register(`critic:${c.name}`, criticId)
  ok(`Critic ${c.name}`)

  // Insert one critic_interpretation row per linked Hamlet theme.
  // Idempotent: delete existing rows for (critic_id, text_id) then insert fresh.
  await supabase
    .from('critic_interpretations')
    .delete()
    .eq('critic_id', criticId)
    .eq('text_id', hamRow.id)

  if (c.theme_codes.length === 0) {
    // Insert one general row pointing to no specific theme.
    await supabase.from('critic_interpretations').insert({
      critic_id:           criticId,
      text_id:             hamRow.id,
      theme_id:            null,
      character_id:        null,
      interpretation:      c.core_position,
      usable_ao5_sentence: c.worked_example || null,
    })
    continue
  }

  for (const code of c.theme_codes) {
    const themeId = await getThemeId(code)
    if (!themeId) continue
    const { error } = await supabase.from('critic_interpretations').insert({
      critic_id:           criticId,
      text_id:             hamRow.id,
      theme_id:            themeId,
      character_id:        null,
      interpretation:      c.core_position,
      usable_ao5_sentence: c.worked_example || null,
    })
    if (error) err(`  interp ${c.name} → ${code}: ${error.message}`)
  }
}

console.log('\n✅  04 Critics complete\n')
