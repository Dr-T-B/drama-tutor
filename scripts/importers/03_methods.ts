import { supabase } from '../lib/supabaseAdmin.js'
import { register } from '../lib/ids.js'
import { ok, err, info, section } from '../lib/log.js'
import {
  readBlock, splitByH2, splitByH3, parseVerticalTable, parseInlineEscapedTable,
  methodCategoryFor, clean,
} from '../lib/parsers.js'
import 'dotenv/config'

const { data: hamRow } = await supabase.from('texts').select('id').eq('short_code', 'HAM').single()
const { data: malRow } = await supabase.from('texts').select('id').eq('short_code', 'MAL').single()
if (!hamRow || !malRow) { err('Texts not found.'); process.exit(1) }

type MethodRecord = {
  method_name: string
  method_category: string
  definition: string
  effect_description: string | null
  exam_usage_warning: string | null
}

// ─── Hamlet (block3 part1, section 3b) ────────────────────────────────────────
function parseHamletMethods(md: string): MethodRecord[] {
  const records: MethodRecord[] = []
  // Drill into section ## 3b.
  const h2 = splitByH2(md)
  const toolkit = h2.find(s => /3b\.\s*AO2\s*Dramatic Methods Toolkit/i.test(s.title))
  if (!toolkit) return records
  for (const sec of splitByH3(toolkit.body)) {
    if (!/^\d+\./.test(sec.title)) continue
    const t = parseVerticalTable(sec.body)
    if (t.size === 0) continue
    const name = t.get('Method') ?? sec.title.replace(/^\d+\.\s*/, '')
    if (!name) continue
    records.push({
      method_name:        clean(name),
      method_category:    methodCategoryFor(name),
      definition:         t.get('Definition') ?? '',
      effect_description: t.get('How it works in drama') ?? null,
      exam_usage_warning: t.get('Weak use (Grade B)')
        ? `Weak use: ${t.get('Weak use (Grade B)')}\nA* upgrade: ${t.get('A* upgrade') ?? ''}`.trim()
        : null,
    })
  }
  return records
}

// ─── Duchess (block6 part3) ───────────────────────────────────────────────────
function parseDuchessMethods(md: string): MethodRecord[] {
  const records: MethodRecord[] = []
  for (const sec of splitByH3(md)) {
    if (!/^Method\s*\d+/i.test(sec.title)) continue
    // Block 6p3 puts the entire field-table on a single line.
    const tableLine = sec.body.split('\n').find(l => /\\\|/.test(l) && /\*\*Method\*\*/i.test(l))
    if (!tableLine) continue
    const t = parseInlineEscapedTable(tableLine)
    const name = t.get('Method') ?? sec.title.replace(/^Method\s*\d+\s*[–\-—]\s*/i, '')
    if (!name) continue
    records.push({
      method_name:        clean(name),
      method_category:    methodCategoryFor(name),
      definition:         t.get('Definition') ?? '',
      effect_description: t.get('Effect Description') ?? null,
      exam_usage_warning: t.get('Usage Example') ? `Usage example: ${t.get('Usage Example')}` : null,
    })
  }
  return records
}

async function importMethods(records: MethodRecord[], textCode: 'HAM' | 'MAL', textId: string) {
  section(`03 — AO2 methods (${textCode})`)
  info(`Parsed ${records.length} methods`)
  for (const m of records) {
    if (!m.method_name || !m.definition) {
      err(`Skip method (missing name/definition): ${m.method_name}`)
      continue
    }
    const { data, error } = await supabase
      .from('ao2_methods')
      .upsert({ ...m, text_id: textId }, { onConflict: 'text_id,method_name' })
      .select('id')
      .single()
    if (error || !data) { err(`Method ${m.method_name}: ${error?.message}`); continue }
    register(`method:${textCode}:${m.method_name.toLowerCase()}`, data.id)
    ok(`${textCode} ${m.method_name}`)
  }
}

await importMethods(parseHamletMethods(readBlock('block3_part1_hamlet_quotes_methods.md')), 'HAM', hamRow.id)
await importMethods(parseDuchessMethods(readBlock('block6_part3_duchess_ao2_methods_toolkit.md')), 'MAL', malRow.id)

console.log('\n✅  03 Methods complete\n')
