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
