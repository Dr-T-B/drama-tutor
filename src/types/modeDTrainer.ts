// Mode D — Duchess trainer types
// Duchess only · Section B only · AO1/AO2/AO3 only

export type DuchessAOTag = 'AO1' | 'AO2' | 'AO3'

export type ModeDParagraphSlot = 'INTRODUCTION' | 'BODY_1' | 'BODY_2' | 'BODY_3' | 'CONCLUSION'

export type ModeDDifficultyBand = 'LEVEL_5_ENTRY' | 'LEVEL_5_ADVANCED'

export type ModeDClassification = 'NARRATIVE' | 'CONTEXT' | 'PARTIAL' | 'BEST'

export type ModeDGradeBand = 'U' | 'E' | 'C' | 'A_STAR'

export type ModeDMarkingStatus = 'draft' | 'checked' | 'approved'

export type ModeDQuoteVerificationStatus = 'pending' | 'checked' | 'verified'

// D002R — route
export interface ModeDRoute {
  route_key: string
  model_essay_key: string
  play_code: 'DUCHESS'
  exam_section_code: 'SECTION_B_OTHER_DRAMA'
  ao_profile_lock: string
  route_title: string
  difficulty_band: ModeDDifficultyBand
  is_recommended_route: boolean
  risk_warning: string | null
  thesis_angle: string | null
  is_active: boolean
}

// D003R — round
export interface ModeDRound {
  round_key: string
  route_key: string
  round_number: 1 | 2 | 3 | 4 | 5
  paragraph_slot: ModeDParagraphSlot
  ao_target_codes: DuchessAOTag[]
  time_budget_minutes: number
  paragraph_anchor: string | null
}

// D004D — MCQ stem option
export interface ModeDStemOption {
  option_key: string
  model_essay_key: string
  route_key: string
  play_code: 'DUCHESS'
  exam_section_code: 'SECTION_B_OTHER_DRAMA'
  ao_profile_lock: string
  question_text: string
  route_title: string
  blocked_ao_check: string
  edexcel_compliance_note: string | null
  marking_status: ModeDMarkingStatus
  quote_verification_status: ModeDQuoteVerificationStatus
  round_key: string
  round_number: 1 | 2 | 3 | 4 | 5
  paragraph_slot: ModeDParagraphSlot
  paragraph_function: string | null
  option_label: 'A' | 'B' | 'C' | 'D'
  option_text: string
  classification: ModeDClassification
  grade_band: ModeDGradeBand
  is_best_answer: boolean
  score_value: 0 | 1 | 2 | 4
  ao_tags: DuchessAOTag[]
  primary_ao_focus: DuchessAOTag
  error_type: string
  examiner_diagnosis: string
  student_feedback: string
  upgrade_instruction: string
  is_active: boolean
}

// D007 — annotation
export interface ModeDAnnotation {
  span_text: string
  ao_tags: DuchessAOTag[]
  technique: string
  note: string
}

// D007 — annotated essay paragraph
export interface ModeDAnnotatedParagraph {
  paragraph_key: string
  template_key: 'REVEAL_DUCHESS_SECTION_B'
  model_essay_key: string
  route_key: string
  round_key: string
  round_number: 1 | 2 | 3 | 4 | 5
  paragraph_slot: ModeDParagraphSlot
  paragraph_text: string
  annotations: ModeDAnnotation[]
  examiner_summary: string
  word_count: number
  recommended_reading_time_seconds: number
  marking_status: ModeDMarkingStatus
  quote_verification_status: ModeDQuoteVerificationStatus
  is_active: boolean
}

// Trainer state
export interface ModeDRoundResult {
  round_number: number
  paragraph_slot: ModeDParagraphSlot
  selected: ModeDStemOption
  best: ModeDStemOption
  score: number
}

export interface ModeDTrainerSession {
  routeKey: string
  rounds: ModeDRoundResult[]
}
