import type { SRSBucket, UserCardProgress } from '../types/database'

const INTERVAL_DAYS: Record<SRSBucket, number> = {
  again: 0,
  hard:  1,
  good:  3,
  easy:  7,
}

const STATUS_MAP: Record<SRSBucket, UserCardProgress['status']> = {
  again: 'learning',
  hard:  'learning',
  good:  'reviewing',
  easy:  'mastered',
}

const CONFIDENCE_MAP: Record<SRSBucket, number> = {
  again: 1,
  hard:  2,
  good:  3,
  easy:  5,
}

export function nextReviewDate(bucket: SRSBucket): Date {
  const d = new Date()
  d.setDate(d.getDate() + INTERVAL_DAYS[bucket])
  return d
}

export function buildProgressUpdate(
  userId: string,
  cardId: string,
  bucket: SRSBucket,
): Omit<UserCardProgress, never> {
  return {
    user_id: userId,
    revision_card_id: cardId,
    status: STATUS_MAP[bucket],
    confidence: CONFIDENCE_MAP[bucket],
    last_reviewed_at: new Date().toISOString(),
    next_review_at: nextReviewDate(bucket).toISOString(),
  }
}
