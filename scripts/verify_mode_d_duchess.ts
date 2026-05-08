// Mode D Duchess verification script
// Checks DB state after imports. Exit 0 = all checks pass.
import { supabase } from './lib/supabaseAdmin.js'
import { ok, err, info, section } from './lib/log.js'
import 'dotenv/config'

section('Mode D Duchess — post-import verification')

let allPassed = true
function check(label: string, passed: boolean, detail?: string) {
  if (passed) {
    ok(label)
  } else {
    err(`FAIL: ${label}${detail ? ` — ${detail}` : ''}`)
    allPassed = false
  }
}

// ── D004D Route B ────────────────────────────────────────────────────────────
const { count: routeBCount } = await supabase
  .from('mode_d_duchess_mcq_stem_options')
  .select('*', { count: 'exact', head: true })
  .eq('route_key', 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE')
check('D004D Route B row count = 20', routeBCount === 20, `got ${routeBCount}`)

const { count: routeBBestCount } = await supabase
  .from('mode_d_duchess_mcq_stem_options')
  .select('*', { count: 'exact', head: true })
  .eq('route_key', 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE')
  .eq('is_best_answer', true)
check('D004D Route B best answers = 5', routeBBestCount === 5, `got ${routeBBestCount}`)

const { data: r5BestRows } = await supabase
  .from('mode_d_duchess_mcq_stem_options')
  .select('ao_tags')
  .eq('route_key', 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE')
  .eq('round_number', 5)
  .eq('is_best_answer', true)
const r5HasAO2 = (r5BestRows ?? []).some((r: any) => Array.isArray(r.ao_tags) && r.ao_tags.includes('AO2'))
check('D004D Route B R5 best excludes AO2', !r5HasAO2)

const { count: totalDuchessCount } = await supabase
  .from('mode_d_duchess_mcq_stem_options')
  .select('*', { count: 'exact', head: true })
check('D004D total Duchess rows ≥ 20', (totalDuchessCount ?? 0) >= 20, `got ${totalDuchessCount}`)

// ── D007 Patriarchal Control paragraphs ─────────────────────────────────────
const { count: paraCount } = await supabase
  .from('mode_d_annotated_essay_paragraphs')
  .select('*', { count: 'exact', head: true })
  .eq('route_key', 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL')
check('D007 Patriarchal Control paragraph count = 5', paraCount === 5, `got ${paraCount}`)

const { data: paraRows } = await supabase
  .from('mode_d_annotated_essay_paragraphs')
  .select('round_number, annotations, marking_status, quote_verification_status')
  .eq('route_key', 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL')

const distinctRounds = new Set((paraRows ?? []).map((r: any) => r.round_number))
check('D007 distinct round_numbers = 5', distinctRounds.size === 5, `got ${distinctRounds.size}`)

const allHaveAnnotations = (paraRows ?? []).every((r: any) =>
  Array.isArray(r.annotations) && r.annotations.length > 0
)
check('D007 all paragraphs have non-empty annotations', allHaveAnnotations)

const noneHaveAO4AO5 = (paraRows ?? []).every((r: any) =>
  !Array.isArray(r.annotations) || r.annotations.every((a: any) =>
    !Array.isArray(a.ao_tags) || (!a.ao_tags.includes('AO4') && !a.ao_tags.includes('AO5'))
  )
)
check('D007 no AO4/AO5 in annotations', noneHaveAO4AO5)

const r5Para = (paraRows ?? []).find((r: any) => r.round_number === 5)
const r5AnnotNoAO2 = !r5Para || (r5Para.annotations ?? []).every((a: any) =>
  !Array.isArray(a.ao_tags) || !a.ao_tags.includes('AO2')
)
check('D007 R5 annotations exclude AO2', r5AnnotNoAO2)

const allDraftPending = (paraRows ?? []).every((r: any) =>
  r.marking_status === 'draft' && r.quote_verification_status === 'pending'
)
check('D007 all paragraphs draft + pending on import', allDraftPending)

// ── AO contamination check ───────────────────────────────────────────────────
const { data: stemRows } = await supabase
  .from('mode_d_duchess_mcq_stem_options')
  .select('ao_tags, option_key')
  .eq('route_key', 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE')

const noAO4AO5InStems = (stemRows ?? []).every((r: any) =>
  !Array.isArray(r.ao_tags) || (!r.ao_tags.includes('AO4') && !r.ao_tags.includes('AO5'))
)
check('D004D Route B no AO4/AO5 in ao_tags', noAO4AO5InStems)

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('')
if (allPassed) {
  console.log('✅  All Mode D Duchess checks passed\n')
  process.exit(0)
} else {
  console.log('❌  Some checks failed — see errors above\n')
  process.exit(1)
}
