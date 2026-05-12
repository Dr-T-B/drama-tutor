/**
 * Revision Session types
 * Mirrors the schema in supabase/migrations/<timestamp>_revision_session_schema.sql
 *
 * Two play codes only — HAM (Hamlet) and MAL (Duchess of Malfi).
 * Section A (HAM) carries AO1+AO2+AO3+AO5.
 * Section B (MAL) carries AO1+AO2+AO3 only — no AO5.
 */

export type PlayCode = 'HAM' | 'MAL';
export type AoCode = '1' | '2' | '3' | '4' | '5';

export type PairingId =
  | 'ham-gh'
  | 'ham-rg'
  | 'ham-og'
  | 'mal-da'
  | 'mal-fc'
  | 'mal-bd';

export interface PairingCharacter {
  id: string;
  display_order: number;
  name: string;
  role: string;
  dramatic_function: string;   // may contain <em>
  key_argument: string;        // may contain <em>
  aos: AoCode[];
}

export interface DrillOption {
  id: string;
  option_order: number;
  option_text: string;
  is_correct: boolean;
}

export interface DrillQuestion {
  id: string;                   // e.g. 'gh-q1'
  question_order: number;
  quote_text: string;
  speaker: string;
  ref: string;                  // act.scene, e.g. '1.2'
  question_text: string;
  annotation: string;           // may contain <strong>, <em>
  aos: AoCode[];
  options: DrillOption[];       // exactly 4, one is_correct
}

/**
 * Discriminated pivot — HAM pairings use 'critic_dialectic' with
 * two named critics; MAL pairings use 'interpretive' with two
 * text-grounded readings around an anchor quote.
 */
export type PivotMode = 'critic_dialectic' | 'interpretive';

interface PivotBase {
  pairing_id: PairingId;
  prompt: string;
  model_sentence: string;       // may contain <em>
  model_why: string;            // may contain <em>
}

export interface CriticDialecticPivot extends PivotBase {
  mode: 'critic_dialectic';
  reading_a_name: string;
  reading_a_tag: string | null;
  reading_a_position: string;   // may contain <em>
  reading_a_critic_id: string | null;
  reading_a_year: string | null;
  reading_b_name: string;
  reading_b_tag: string | null;
  reading_b_position: string;
  reading_b_critic_id: string | null;
  reading_b_year: string | null;
  anchor_quote: null;
  anchor_ref: null;
}

export interface InterpretivePivot extends PivotBase {
  mode: 'interpretive';
  anchor_quote: string;
  anchor_ref: string;
  reading_a_name: string;
  reading_a_tag: string | null;
  reading_a_position: string;
  reading_b_name: string;
  reading_b_tag: string | null;
  reading_b_position: string;
  reading_a_critic_id: null;
  reading_a_year: null;
  reading_b_critic_id: null;
  reading_b_year: null;
}

export type Pivot = CriticDialecticPivot | InterpretivePivot;

/** Build picker option types differ between HAM and MAL */
export type BuildOptionType = 'quote' | 'critic' | 'method' | 'context';

export interface BuildOption {
  id: string;
  option_type: BuildOptionType;
  option_order: number;
  option_key: string;
  label: string;
  is_ideal: boolean;
}

export interface Build {
  pairing_id: PairingId;
  question: string;
  instruction: string;
  model_paragraph: string;      // contains <span class="match">...</span>
  checklist: string[];
  options: BuildOption[];       // mixed types, partition client-side
}

export interface Pairing {
  id: PairingId;
  text_id: string;
  pairing_order: number;
  title: string;
  eyebrow: string;
  tagline: string;
  diagram_svg: string;          // raw SVG, rendered via dangerouslySetInnerHTML
  diagram_caption: string;
  characters: PairingCharacter[];        // length 2
  drill_questions: DrillQuestion[];      // length 5
  pivot: Pivot;
  build: Build;
}

/** Helper: which AO5 mode applies to a play */
export const playSupportsAO5 = (play: PlayCode): boolean => play === 'HAM';

/** Helper: the second build-picker category by play */
export const buildSecondaryType = (play: PlayCode): BuildOptionType =>
  play === 'HAM' ? 'critic' : 'method';
