// Mode D foundation reference data — idempotent upsert
// Seeds: essay path model, routes (A, B, C placeholder), round maps, reveal template.
import { supabase } from '../lib/supabaseAdmin.js'
import { ok, err, info, section } from '../lib/log.js'
import 'dotenv/config'

section('13 — Mode D foundation (essay model, routes, round maps, reveal template)')

const MODEL_ESSAY_KEY = 'MODE_D_D001R_DUCHESS_CONTROL_001'
const QUESTION_TEXT   = 'Explore Webster\'s presentation of control in The Duchess of Malfi.'

// ── D001R: essay path model ──────────────────────────────────────────────────
const { error: e1 } = await supabase
  .from('mode_d_essay_path_models')
  .upsert([{
    model_essay_key: MODEL_ESSAY_KEY,
    play_code: 'DUCHESS',
    question_text: QUESTION_TEXT,
    is_active: true,
  }], { onConflict: 'model_essay_key' })
if (e1) { err(`essay_path_models: ${e1.message}`); process.exit(1) }
ok('mode_d_essay_path_models upserted')

// ── D007-templates: reveal template ─────────────────────────────────────────
const { error: e2 } = await supabase
  .from('mode_d_reveal_templates')
  .upsert([{
    template_key: 'REVEAL_DUCHESS_SECTION_B',
    play_code: 'DUCHESS',
    exam_section_code: 'SECTION_B_OTHER_DRAMA',
    ao_profile_lock: 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY',
    is_active: true,
  }], { onConflict: 'template_key' })
if (e2) { err(`reveal_templates: ${e2.message}`); process.exit(1) }
ok('mode_d_reveal_templates upserted')

// ── D002R: route bank ────────────────────────────────────────────────────────
const ROUTES = [
  {
    route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL',
    model_essay_key: MODEL_ESSAY_KEY,
    play_code: 'DUCHESS',
    exam_section_code: 'SECTION_B_OTHER_DRAMA',
    ao_profile_lock: 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY',
    route_title: 'Patriarchal Control',
    difficulty_band: 'LEVEL_5_ENTRY',
    is_recommended_route: true,
    risk_warning: 'Can become sociological if AO2 is thin.',
    thesis_angle: 'gendered/dynastic power over body, marriage, identity',
    is_active: true,
  },
  {
    route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE',
    model_essay_key: MODEL_ESSAY_KEY,
    play_code: 'DUCHESS',
    exam_section_code: 'SECTION_B_OTHER_DRAMA',
    ao_profile_lock: 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY',
    route_title: 'Court Surveillance',
    difficulty_band: 'LEVEL_5_ADVANCED',
    is_recommended_route: false,
    risk_warning: 'Can over-focus on Bosola and lose the Duchess/control question.',
    thesis_angle: 'corrupt court system of spying, observation and political calculation',
    is_active: true,
  },
  {
    route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_C_RESISTANCE_IDENTITY',
    model_essay_key: MODEL_ESSAY_KEY,
    play_code: 'DUCHESS',
    exam_section_code: 'SECTION_B_OTHER_DRAMA',
    ao_profile_lock: 'DUCHESS_SECTION_B_AO1_AO2_AO3_ONLY',
    route_title: 'Resistance and Identity',
    difficulty_band: 'LEVEL_5_ADVANCED',
    is_recommended_route: false,
    risk_warning: 'Can collapse into character study if the Duchess is romanticised.',
    thesis_angle: "the Duchess's self-definition as resistance to dynastic erasure",
    is_active: false,
  },
]

const { error: e3 } = await supabase
  .from('mode_d_route_bank')
  .upsert(ROUTES, { onConflict: 'route_key' })
if (e3) { err(`route_bank: ${e3.message}`); process.exit(1) }
ok(`mode_d_route_bank upserted (${ROUTES.length} routes)`)

// ── D003R: round maps ────────────────────────────────────────────────────────
const ROUNDS = [
  // Route A — Patriarchal Control
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL_R1_INTRODUCTION', route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL', round_number: 1, paragraph_slot: 'INTRODUCTION', ao_target_codes: ['AO1','AO2'], time_budget_minutes: 4, paragraph_anchor: 'patriarchal control as thesis; brothers opening imperatives' },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL_R2_BODY_1',       route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL', round_number: 2, paragraph_slot: 'BODY_1',       ao_target_codes: ['AO1','AO2'], time_budget_minutes: 5, paragraph_anchor: 'grammar of control: imperative mood, prop, blocking, register' },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL_R3_BODY_2',       route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL', round_number: 3, paragraph_slot: 'BODY_2',       ao_target_codes: ['AO1','AO2','AO3'], time_budget_minutes: 6, paragraph_anchor: 'Bosola as intelligencer; spatial collapse; apricot trick' },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL_R4_BODY_3',       route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL', round_number: 4, paragraph_slot: 'BODY_3',       ao_target_codes: ['AO1','AO2'], time_budget_minutes: 6, paragraph_anchor: "Duchess's declarative ontology; tragic contradiction" },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL_R5_CONCLUSION',   route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL', round_number: 5, paragraph_slot: 'CONCLUSION',   ao_target_codes: ['AO1','AO3'], time_budget_minutes: 4, paragraph_anchor: 'dialectical verdict; self-consuming apparatus' },
  // Route B — Court Surveillance
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE_R1_INTRODUCTION', route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE', round_number: 1, paragraph_slot: 'INTRODUCTION', ao_target_codes: ['AO1','AO2'], time_budget_minutes: 4, paragraph_anchor: 'Bosola as intelligencer and court spy' },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE_R2_BODY_1',       route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE', round_number: 2, paragraph_slot: 'BODY_1',       ao_target_codes: ['AO1','AO2'], time_budget_minutes: 5, paragraph_anchor: 'Bosola as intelligencer and court spy' },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE_R3_BODY_2',       route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE', round_number: 3, paragraph_slot: 'BODY_2',       ao_target_codes: ['AO1','AO2','AO3'], time_budget_minutes: 6, paragraph_anchor: 'court, household, marriage, or surveillance structure' },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE_R4_BODY_3',       route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE', round_number: 4, paragraph_slot: 'BODY_3',       ao_target_codes: ['AO1'], time_budget_minutes: 6, paragraph_anchor: "Duchess's self-definition, torment, or death scene" },
  { round_key: 'MODE_D_D003R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE_R5_CONCLUSION',   route_key: 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE', round_number: 5, paragraph_slot: 'CONCLUSION',   ao_target_codes: ['AO1','AO3'], time_budget_minutes: 4, paragraph_anchor: 'death, aftermath, collapse of controllers' },
]

const { error: e4 } = await supabase
  .from('mode_d_paragraph_round_map')
  .upsert(ROUNDS, { onConflict: 'round_key' })
if (e4) { err(`paragraph_round_map: ${e4.message}`); process.exit(1) }
ok(`mode_d_paragraph_round_map upserted (${ROUNDS.length} rounds)`)

info('Foundation import complete. Run importers 14 and 15 for stem/paragraph content.')
console.log('\n✅  13 Mode D foundation complete\n')
