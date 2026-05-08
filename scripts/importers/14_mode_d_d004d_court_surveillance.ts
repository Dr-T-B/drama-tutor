// Mode D — D004D Route B Court Surveillance importer (idempotent)
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import { validateD004DRows } from '../validators/d004d_validator.js'
import 'dotenv/config'

section('14 — D004D Route B Court Surveillance (20 stems)')

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonPath   = resolve(__dirname, '../../data/mode_d/d004_duchess_court_surveillance_stems.json')
const rows       = JSON.parse(readFileSync(jsonPath, 'utf-8'))

info(`Loaded ${rows.length} rows from ${jsonPath}`)

// Validate
const failures = validateD004DRows(rows)
if (failures.length > 0) {
  err(`Validation failed with ${failures.length} error(s):`)
  for (const f of failures) {
    console.error(`    [${f.row}] ${f.rule}: ${JSON.stringify(f.value)}`)
  }
  process.exit(1)
}
ok('All rows passed D004D validation')

// Upsert idempotent
let inserted = 0
let updated  = 0
let failed   = 0

for (const row of rows) {
  const { data: existing } = await supabase
    .from('mode_d_duchess_mcq_stem_options')
    .select('option_key')
    .eq('option_key', row.option_key)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('mode_d_duchess_mcq_stem_options')
      .update(row)
      .eq('option_key', row.option_key)
    if (error) { err(`update ${row.option_key}: ${error.message}`); failed++; continue }
    updated++
  } else {
    const { error } = await supabase
      .from('mode_d_duchess_mcq_stem_options')
      .insert(row)
    if (error) { err(`insert ${row.option_key}: ${error.message}`); failed++; continue }
    inserted++
  }
}

if (failed > 0) {
  err(`${failed} rows failed`)
  process.exit(1)
}

ok(`${inserted} inserted, ${updated} updated, 0 failed (of ${rows.length})`)
console.log('\n✅  14 D004D Court Surveillance complete\n')
