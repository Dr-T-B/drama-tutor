import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Critic, CriticEnriched } from '../types/database'

async function fetchCritics(): Promise<Critic[]> {
  const { data, error } = await supabase
    .from('critics')
    .select('id, name, school, core_position, key_text, source_note')
    .order('name')
  if (error) throw error
  return data as Critic[]
}

async function fetchInterpretationsEnriched() {
  const { data, error } = await supabase
    .from('critic_interpretations')
    .select(`
      id, critic_id, interpretation, usable_ao5_sentence, counter_reading,
      texts!inner(short_code),
      themes(theme_code, theme_name)
    `)
  if (error) throw error
  return data
}

export function useCritics(userId: string | null) {
  const criticsQ = useQuery({
    queryKey: ['critics_list'],
    queryFn: fetchCritics,
    staleTime: 1000 * 60 * 20,
    enabled: !!userId,
  })

  const interpsQ = useQuery({
    queryKey: ['critic_interpretations_enriched'],
    queryFn: fetchInterpretationsEnriched,
    staleTime: 1000 * 60 * 20,
    enabled: !!userId,
  })

  const isLoading = criticsQ.isLoading || interpsQ.isLoading

  const interpsByCritic = new Map<string, any[]>()
  ;(interpsQ.data ?? []).forEach((ci: any) => {
    const arr = interpsByCritic.get(ci.critic_id) ?? []
    arr.push(ci)
    interpsByCritic.set(ci.critic_id, arr)
  })

  const enriched: CriticEnriched[] = (criticsQ.data ?? []).map(c => ({
    ...c,
    interpretations: (interpsByCritic.get(c.id) ?? []).map((ci: any) => ({
      id: ci.id,
      play: ci.texts.short_code as 'HAM' | 'MAL',
      theme_code: ci.themes?.theme_code ?? null,
      theme_name: ci.themes?.theme_name ?? null,
      interpretation: ci.interpretation,
      usable_ao5_sentence: ci.usable_ao5_sentence ?? null,
      counter_reading: ci.counter_reading ?? null,
    })),
  }))

  return { enriched, isLoading }
}
