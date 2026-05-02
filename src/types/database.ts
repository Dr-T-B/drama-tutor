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
