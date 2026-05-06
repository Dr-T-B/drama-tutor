// ============================================================================
// Essay Builder — TypeScript types
// Spec: EssayBuilder_v2.md
// Match these to: supabase/migrations/0001_essay_builder.sql
// ============================================================================

// ----------------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------------

export type AOCode = 'AO1' | 'AO2' | 'AO3' | 'AO4' | 'AO5';
export type PlayCode = 'hamlet' | 'duchess_of_malfi';
export type PathClassification = 'correct' | 'partial' | 'wrong' | 'exam_risk';
export type ToneRegister = 'firm_instructive';

// ----------------------------------------------------------------------------
// Question
// ----------------------------------------------------------------------------

export interface EssayBuilderQuestion {
  id: string;
  play_code: PlayCode;
  question_text: string;
  question_year: number | null;
  theme_tags: string[];
  character_focus: string[];
  primary_route_id: string;
  secondary_route_id: string | null;
  relevant_aos: AOCode[];
  created_at: string;
}

// ----------------------------------------------------------------------------
// Path option
// ----------------------------------------------------------------------------

export interface EssayPathOption {
  id: string;
  question_id: string;
  path_label: string;
  route_id: string | null;
  classification: PathClassification;
  thesis_direction: string;
  ao_strengths: AOCode[];
  ao_weaknesses: AOCode[];
  why_attractive: string;
  feedback_id: string;
  unlocks_skeleton: boolean;
  display_order: number | null;
}

// ----------------------------------------------------------------------------
// Feedback (discriminated union by classification)
// ----------------------------------------------------------------------------

export interface AODiagnosis {
  ao: AOCode;
  note: string;
}

export interface AOProblem {
  ao: AOCode;
  descriptor: string;
}

export interface CorrectFeedbackBody {
  why_it_fits: string;
  ao_integration: string;
}

export interface PartialFeedbackBody {
  what_it_misses: string;
  upgrade_advice: string;
  ao_diagnosis: AODiagnosis[];
}

export interface WrongFeedbackBody {
  mismatch: string;
  what_it_becomes: string;
  ao_diagnosis: AODiagnosis;
  redirect: string;
}

export interface ExamRiskFeedbackBody {
  exam_danger: string;
  ao_problem: AOProblem;
  what_it_becomes: string;
  redirect: string;
}

export type FeedbackBody =
  | CorrectFeedbackBody
  | PartialFeedbackBody
  | WrongFeedbackBody
  | ExamRiskFeedbackBody;

// Discriminated by the parent row's classification, not a tag inside the body
export interface EssayPathFeedback {
  id: string;
  classification: PathClassification;
  headline: string;
  body_sections: FeedbackBody;
  tone_register: ToneRegister;
  created_at: string;
}

// Type guards for narrowing in the UI
export function isCorrectFeedback(
  f: EssayPathFeedback
): f is EssayPathFeedback & { body_sections: CorrectFeedbackBody } {
  return f.classification === 'correct';
}
export function isPartialFeedback(
  f: EssayPathFeedback
): f is EssayPathFeedback & { body_sections: PartialFeedbackBody } {
  return f.classification === 'partial';
}
export function isWrongFeedback(
  f: EssayPathFeedback
): f is EssayPathFeedback & { body_sections: WrongFeedbackBody } {
  return f.classification === 'wrong';
}
export function isExamRiskFeedback(
  f: EssayPathFeedback
): f is EssayPathFeedback & { body_sections: ExamRiskFeedbackBody } {
  return f.classification === 'exam_risk';
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------

export interface EssaySkeletonParagraph {
  function: string;
  key_quote_ids: string[];
  ao2_methods: string[];
  ao3_anchor: string;
  ao5_debate: string;
  /**
   * AO4 comparison embed.
   * - Hamlet: MUST be null.
   * - Duchess: MUST be a non-empty string in at least one paragraph.
   * AO4 is embedded inline within paragraph functions, never as a standalone item.
   */
  ao4_embed: string | null;
}

export interface EssaySkeletonConclusion {
  function: string;
  dialectical_move: string;
}

export interface EssaySkeleton {
  id: string;
  path_option_id: string;
  thesis: string;
  paragraphs: EssaySkeletonParagraph[];
  conclusion: EssaySkeletonConclusion;
  /** Non-null when the skeleton is for a `partial` path. */
  upgrade_banner: string | null;
  created_at: string;
}

// ----------------------------------------------------------------------------
// Attempts
// ----------------------------------------------------------------------------

export interface EssayBuilderAttempt {
  id: string;
  user_id: string;
  question_id: string;
  play_code: PlayCode;
  started_at: string;
  completed_at: string | null;
  final_outcome: PathClassification | null;
  unlocked_skeleton: boolean;
}

export interface EssayBuilderAttemptChoice {
  id: string;
  attempt_id: string;
  path_option_id: string;
  retry_number: number;
  chosen_at: string;
}

// ----------------------------------------------------------------------------
// Aggregate result for the feedback page
// ----------------------------------------------------------------------------

export interface EssayBuilderResult {
  attempt: EssayBuilderAttempt;
  choices: EssayBuilderAttemptChoice[];
  selectedPath: EssayPathOption;
  feedback: EssayPathFeedback;
  skeleton: EssaySkeleton | null;
}
