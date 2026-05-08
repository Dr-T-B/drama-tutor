// Mode D — D007 Patriarchal Control annotated essay paragraphs importer (idempotent)
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import { validateD007Paragraphs } from '../validators/d007_validator.js'
import 'dotenv/config'

section('15 — D007 Patriarchal Control annotated essay paragraphs (5 rows)')

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonPath   = resolve(__dirname, '../../data/mode_d/d007_duchess_patriarchal_control_paragraphs.json')
const rows       = JSON.parse(readFileSync(jsonPath, 'utf-8'))

info(`Loaded ${rows.length} rows from ${jsonPath}`)

// Validate
const failures = validateD007Paragraphs(rows)
if (failures.length > 0) {
  err(`Validation failed with ${failures.length} error(s):`)
  for (const f of failures) {
    const spanPart = f.span ? ` [span: "${f.span.substring(0, 40)}…"]` : ''
    console.error(`    [${f.row}]${spanPart} ${f.rule}: ${JSON.stringify(f.value)}`)
  }
  process.exit(1)
}
ok('All rows passed D007 validation')

// Upsert idempotent
let inserted = 0
let updated  = 0
let failed   = 0

for (const row of rows) {
  const { data: existing } = await supabase
    .from('mode_d_annotated_essay_paragraphs')
    .select('paragraph_key')
    .eq('paragraph_key', row.paragraph_key)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('mode_d_annotated_essay_paragraphs')
      .update(row)
      .eq('paragraph_key', row.paragraph_key)
    if (error) { err(`update ${row.paragraph_key}: ${error.message}`); failed++; continue }
    updated++
  } else {
    const { error } = await supabase
      .from('mode_d_annotated_essay_paragraphs')
      .insert(row)
    if (error) { err(`insert ${row.paragraph_key}: ${error.message}`); failed++; continue }
    inserted++
  }
}

if (failed > 0) {
  err(`${failed} rows failed`)
  process.exit(1)
}

ok(`${inserted} inserted, ${updated} updated, 0 failed (of ${rows.length})`)
console.log('\n✅  15 D007 Patriarchal Control paragraphs complete\n')
