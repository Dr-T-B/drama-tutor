import type { AOKey } from '../data/actScenes'

export type { AOKey }

export type EssayPlay = 'HAM' | 'MAL'
export type EssayCategory = 'character_study' | 'thematic'
export type EssayProbability =
  | 'very_high'
  | 'high'
  | 'medium_high'
  | 'medium'
  | 'low'

export interface Essay {
  id: string
  play: EssayPlay
  year: number | null
  section: 'A' | 'B'
  question_number: number | null
  question_text: string
  category: EssayCategory
  primary_theme: string
  secondary_themes: string[]
  related_acts: string[]
  related_quotes: string[]
  aos: AOKey[]
  word_count_approx: number
  probability_2026: EssayProbability
  rationale_2026: string
  content_markdown: string
}
