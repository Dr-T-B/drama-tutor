// ============================================================================
// AO Integration Trainer — TypeScript types
// Spec: EssayBuilderPrompt_2.md  (Mode C: Detect Failure)
// Match these to: supabase/migrations/0002_ao_integration_trainer.sql
// Reuses AOCode and PlayCode from src/types/essayBuilder.ts.
// ============================================================================

import type { AOCode, PlayCode } from './essayBuilder';
export type { AOCode, PlayCode };

// ----------------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------------

export type SectionCode = 'SECTION_A' | 'SECTION_B';

export type ParagraphClassification =
  | 'A_STAR_INTEGRATED'
  | 'AO_IN_TURNS'
  | 'AO_DOMINANT'
  | 'WRONG_ORDER'
  | 'AO4_BOLTED_ON'
  | 'AO1_DRIFT'
  | 'NARRATIVE_SUMMARY'
  | 'CRITIC_NAME_DROPPING'
  | 'CONTEXT_DUMPING';

/** AO score on a 1–5 rubric. */
export type AOScore = 1 | 2 | 3 | 4 | 5;

export type OptionLabel = 'A' | 'B' | 'C' | 'D';

// ----------------------------------------------------------------------------
// Drill
// ----------------------------------------------------------------------------

export interface AOIntegrationDrill {
  id: string;
  play_code: PlayCode;
  section: SectionCode;
  exam_question: string;
  paragraph_slot: string;
  theme_tag: string | null;
  route_id: string | null;
  target_skill: string | null;
  difficulty: number | null;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------------
// Paragraph option
// ----------------------------------------------------------------------------

export interface AOParagraphOption {
  id: string;
  drill_id: string;
  option_label: OptionLabel;
  paragraph_text: string;
  classification: ParagraphClassification;
  is_best_answer: boolean;

  ao1_score: AOScore;
  ao2_score: AOScore;
  ao3_score: AOScore;
  /** Hamlet drills: always null. Duchess drills: never null. */
  ao4_score: AOScore | null;
  ao5_score: AOScore;

  integration_score: AOScore;
  sequence_score: AOScore;

  examiner_diagnosis: string;
  student_feedback: string;
  improvement_instruction: string;

  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------------
// Attempt
// ----------------------------------------------------------------------------

export interface AOIntegrationAttempt {
  id: string;
  user_id: string;
  drill_id: string;
  selected_option_id: string;
  is_correct: boolean;
  attempt_no: number;
  feedback_shown: boolean;
  created_at: string;
}

// ----------------------------------------------------------------------------
// Type guards by classification — useful for tailored feedback rendering
// ----------------------------------------------------------------------------

export function isAStar(o: AOParagraphOption): boolean {
  return o.classification === 'A_STAR_INTEGRATED';
}
export function isAoInTurns(o: AOParagraphOption): boolean {
  return o.classification === 'AO_IN_TURNS';
}
export function isAoDominant(o: AOParagraphOption): boolean {
  return o.classification === 'AO_DOMINANT';
}
export function isAo4BoltedOn(o: AOParagraphOption): boolean {
  return o.classification === 'AO4_BOLTED_ON';
}
export function isAo1Drift(o: AOParagraphOption): boolean {
  return o.classification === 'AO1_DRIFT';
}
export function isExamRiskParagraph(o: AOParagraphOption): boolean {
  return (
    o.classification === 'NARRATIVE_SUMMARY' ||
    o.classification === 'CRITIC_NAME_DROPPING' ||
    o.classification === 'CONTEXT_DUMPING'
  );
}

// ----------------------------------------------------------------------------
// Aggregate result for the drill page
// ----------------------------------------------------------------------------

export interface AOTrainerResult {
  drill: AOIntegrationDrill;
  options: AOParagraphOption[];
  attempt: AOIntegrationAttempt | null;
  selectedOption: AOParagraphOption | null;
}
