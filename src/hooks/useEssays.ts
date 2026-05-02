import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { PlanParagraph, SentenceStem, EssayPlanEnriched } from '../types/database'

async function fetchEssayPlans() {
  const { data, error } = await supabase
    .from('essay_plans')
    .select(`
      id, text_id, theme_id, question_text, conceptual_thesis,
      timed_plan, target_level, plan_minutes, examiner_rationale,
      texts!inner(short_code),
      themes!inner(theme_code, theme_name)
    `)
    .order('text_id')
  if (error) throw error
  return data
}

async function fetchPlanParagraphs() {
  const { data, error } = await supabase
    .from('plan_paragraphs')
    .select(`
      id, essay_plan_id, paragraph_no, paragraph_function,
      topic_sentence, ao2_move, ao3_move, ao4_move, ao5_move,
      mini_judgement, quote_id,
      quotes(content, speaker)
    `)
    .order('paragraph_no')
  if (error) throw error
  return data
}

async function fetchSentenceStems(): Promise<SentenceStem[]> {
  const { data, error } = await supabase
    .from('paragraph_sentence_stems')
    .select('id, ao_code, stem_label, stem_text, usage_note, target_level')
    .order('ao_code')
  if (error) throw error
  return data as SentenceStem[]
}

export function useEssays(userId: string | null) {
  const plansQ = useQuery({
    queryKey: ['essay_plans'],
    queryFn: fetchEssayPlans,
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  })

  const parasQ = useQuery({
    queryKey: ['plan_paragraphs'],
    queryFn: fetchPlanParagraphs,
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  })

  const stemsQ = useQuery({
    queryKey: ['sentence_stems'],
    queryFn: fetchSentenceStems,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  const isLoading = plansQ.isLoading || parasQ.isLoading || stemsQ.isLoading

  const parasByPlan = new Map<string, PlanParagraph[]>()
  ;(parasQ.data ?? []).forEach((pp: any) => {
    const enrichedPp: PlanParagraph = {
      ...pp,
      quote_content: pp.quotes?.content ?? null,
      quote_speaker: pp.quotes?.speaker ?? null,
    }
    const arr = parasByPlan.get(pp.essay_plan_id) ?? []
    arr.push(enrichedPp)
    parasByPlan.set(pp.essay_plan_id, arr)
  })

  const enriched: EssayPlanEnriched[] = (plansQ.data ?? []).map((ep: any) => ({
    ...ep,
    play: ep.texts.short_code as 'HAM' | 'MAL',
    theme_code: ep.themes.theme_code,
    theme_name: ep.themes.theme_name,
    paragraphs: (parasByPlan.get(ep.id) ?? []).sort(
      (a, b) => a.paragraph_no - b.paragraph_no
    ),
  }))

  return {
    enriched,
    stems: stemsQ.data ?? [],
    isLoading,
  }
}
