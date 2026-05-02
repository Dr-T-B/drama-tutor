import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { buildProgressUpdate } from '../lib/srs'
import type { RevisionCard, UserCardProgress, SRSBucket, PlayFilter } from '../types/database'

// Fetch all revision cards for the selected play filter
async function fetchCards(play: PlayFilter): Promise<RevisionCard[]> {
  let query = supabase.from('revision_cards').select(`
    id, text_id, theme_id, quote_id, card_type, ao_focus,
    front_prompt, back_content, difficulty,
    texts!inner(short_code)
  `)
  if (play !== 'both') {
    query = query.eq('texts.short_code', play)
  }
  const { data, error } = await query
  if (error) throw error
  return data as unknown as RevisionCard[]
}

// Fetch all progress rows for this user
async function fetchProgress(userId: string): Promise<UserCardProgress[]> {
  const { data, error } = await supabase
    .from('user_card_progress')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data as UserCardProgress[]
}

export function useRevisionDeck(userId: string | null, play: PlayFilter) {
  const queryClient = useQueryClient()

  const cardsQuery = useQuery({
    queryKey: ['revision_cards', play],
    queryFn: () => fetchCards(play),
    staleTime: 1000 * 60 * 10, // 10 min — seed data doesn't change
    enabled: !!userId,
  })

  const progressQuery = useQuery({
    queryKey: ['card_progress', userId],
    queryFn: () => fetchProgress(userId!),
    staleTime: 1000 * 30,
    enabled: !!userId,
  })

  // Build the due deck:
  // cards that have no progress row (status='new') OR next_review_at <= now
  const now = new Date().toISOString()
  const progressMap = new Map(
    (progressQuery.data ?? []).map(p => [p.revision_card_id, p])
  )

  const dueDeck = (cardsQuery.data ?? [])
    .filter(card => {
      const prog = progressMap.get(card.id)
      if (!prog) return true                              // new — always due
      if (prog.status === 'mastered') return false       // exclude mastered
      return !prog.next_review_at || prog.next_review_at <= now
    })
    .sort((a, b) => {
      const pa = progressMap.get(a.id)
      const pb = progressMap.get(b.id)
      if (!pa && pb) return -1   // new cards first
      if (pa && !pb) return 1
      const ta = pa?.next_review_at ?? ''
      const tb = pb?.next_review_at ?? ''
      return ta.localeCompare(tb)
    })

  const rateMutation = useMutation({
    mutationFn: async ({ cardId, bucket }: { cardId: string; bucket: SRSBucket }) => {
      if (!userId) throw new Error('Not authenticated')
      const payload = buildProgressUpdate(userId, cardId, bucket)
      const { error } = await supabase
        .from('user_card_progress')
        .upsert(payload, { onConflict: 'user_id,revision_card_id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card_progress', userId] })
    },
  })

  return {
    dueDeck,
    progressMap,
    totalCards: cardsQuery.data?.length ?? 0,
    masteredCount: (progressQuery.data ?? []).filter(p => p.status === 'mastered').length,
    isLoading: cardsQuery.isLoading || progressQuery.isLoading,
    rateCard: (cardId: string, bucket: SRSBucket) =>
      rateMutation.mutate({ cardId, bucket }),
    isRating: rateMutation.isPending,
  }
}
