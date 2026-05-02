export interface RevisionCard {
  id: string
  text_id: string
  theme_id: string | null
  quote_id: string | null
  card_type: 'quote' | 'theme'
  ao_focus: string
  front_prompt: string
  back_content: string
  difficulty: number | null
}

export interface UserCardProgress {
  user_id: string
  revision_card_id: string
  status: 'new' | 'learning' | 'reviewing' | 'mastered'
  confidence: number | null       // 1–5
  last_reviewed_at: string | null // ISO string
  next_review_at: string | null   // ISO string
}

export type SRSBucket = 'again' | 'hard' | 'good' | 'easy'
export type PlayFilter = 'HAM' | 'MAL' | 'both'

export interface Quote {
  id: string
  quote_id: string            // e.g. "HAM_Q003"
  content: string
  speaker: string
  addressee: string | null
  act_scene: string | null
  memorisation_priority: number | null   // 1–5
  dramatic_moment: string | null
  structural_function: string | null
  exam_sentence: string | null
  text_id: string
  character_id: string | null
  primary_theme_id: string | null
}

export interface QuoteAoLink {
  quote_id: string
  ao_code: 'AO1' | 'AO2' | 'AO3' | 'AO5'
  note: string | null
}

export interface QuoteSecondaryTheme {
  quote_id: string
  theme_id: string
  relevance_note: string | null
}

export interface Theme {
  id: string
  theme_code: string
  theme_name: string
  text_id: string
  section_relevance: string | null
  created_at: string
  updated_at: string
}

export interface Character {
  id: string
  name: string
  text_id: string
}

// Enriched quote assembled client-side from the above
export interface QuoteEnriched extends Quote {
  play: 'HAM' | 'MAL'
  character_name: string | null
  primary_theme: Theme | null
  ao_links: QuoteAoLink[]
  secondary_themes: Array<{ theme: Theme; relevance_note: string | null }>
}

export type GradeBand = 'B' | 'A' | 'A_STAR'

export interface ThemeThesis {
  id: string
  theme_id: string
  grade_band: GradeBand
  thesis_text: string
  ao_focus: string[]          // parsed from Postgres array e.g. ['AO1','AO5']
  examiner_commentary: string | null
}

export interface ThemeGuidance {
  id: string
  theme_id: string
  ao_code: string
  guidance_type: string
  content: string
  target_level: string | null
}

export interface CriticInterpretation {
  id: string
  critic_id: string
  text_id: string
  theme_id: string | null
  character_id: string | null
  interpretation: string
  usable_ao5_sentence: string | null
  counter_reading: string | null
  critic_name: string         // joined from critics.name
  critic_school: string       // joined from critics.school
}

export interface ThemeEnriched extends Theme {
  play: 'HAM' | 'MAL'
  theses: ThemeThesis[]
  guidance: ThemeGuidance[]
  critic_views: CriticInterpretation[]
  quote_count: number
}

export interface Critic {
  id: string
  name: string
  school: string
  core_position: string
  key_text: string | null
  source_note: string | null    // birth/death dates e.g. "1851–1935"
}

export interface CriticEnriched extends Critic {
  interpretations: Array<{
    id: string
    play: 'HAM' | 'MAL'
    theme_code: string | null
    theme_name: string | null
    interpretation: string
    usable_ao5_sentence: string | null
    counter_reading: string | null
  }>
}
