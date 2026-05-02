import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type {
  ThemeThesis, ThemeGuidance,
  CriticInterpretation, ThemeEnriched
} from '../types/database'

async function fetchThemesWithDetails() {
  const { data, error } = await supabase
    .from('themes')
    .select(`
      id, text_id, theme_code, theme_name, section_relevance,
      texts!inner(short_code),
      theme_theses(id, theme_id, grade_band, thesis_text, ao_focus,
                   examiner_commentary),
      theme_guidance(id, theme_id, ao_code, guidance_type, content,
                     target_level)
    `)
    .order('theme_code')
  if (error) throw error
  return data
}

async function fetchCriticInterpretations() {
  const { data, error } = await supabase
    .from('critic_interpretations')
    .select(`
      id, critic_id, text_id, theme_id, character_id,
      interpretation, usable_ao5_sentence, counter_reading,
      critics(name, school)
    `)
  if (error) throw error
  return data
}

async function fetchQuoteThemeCounts() {
  // Count quotes per theme via primary_theme_id
  const { data: primary, error: e1 } = await supabase
    .from('quotes')
    .select('primary_theme_id')
  if (e1) throw e1

  // Count secondary theme links
  const { data: secondary, error: e2 } = await supabase
    .from('quote_secondary_themes')
    .select('theme_id')
  if (e2) throw e2

  // Build combined count map  theme_id → count
  const counts = new Map<string, number>()
  ;(primary ?? []).forEach((r: any) => {
    if (r.primary_theme_id) {
      counts.set(r.primary_theme_id, (counts.get(r.primary_theme_id) ?? 0) + 1)
    }
  })
  ;(secondary ?? []).forEach((r: any) => {
    if (r.theme_id) {
      counts.set(r.theme_id, (counts.get(r.theme_id) ?? 0) + 1)
    }
  })
  return counts
}

const GRADE_ORDER: Record<string, number> = { B: 0, A: 1, A_STAR: 2 }

export function useThemes(userId: string | null) {
  const themesQ = useQuery({
    queryKey: ['themes_detail'],
    queryFn: fetchThemesWithDetails,
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  })

  const criticsQ = useQuery({
    queryKey: ['critic_interpretations'],
    queryFn: fetchCriticInterpretations,
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  })

  const countsQ = useQuery({
    queryKey: ['theme_quote_counts'],
    queryFn: fetchQuoteThemeCounts,
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  })

  const isLoading = themesQ.isLoading || criticsQ.isLoading || countsQ.isLoading

  // Group critic interpretations by theme_id
  const ciByTheme = new Map<string, CriticInterpretation[]>()
  ;(criticsQ.data ?? []).forEach((ci: any) => {
    if (!ci.theme_id) return
    const enriched: CriticInterpretation = {
      ...ci,
      critic_name: ci.critics?.name ?? 'Unknown',
      critic_school: ci.critics?.school ?? '',
    }
    const arr = ciByTheme.get(ci.theme_id) ?? []
    arr.push(enriched)
    ciByTheme.set(ci.theme_id, arr)
  })

  const enriched: ThemeEnriched[] = (themesQ.data ?? []).map((t: any) => ({
    id: t.id,
    text_id: t.text_id,
    theme_code: t.theme_code,
    theme_name: t.theme_name,
    section_relevance: t.section_relevance,
    created_at: t.created_at,
    updated_at: t.updated_at,
    play: t.texts.short_code as 'HAM' | 'MAL',
    theses: [...(t.theme_theses ?? [])].sort(
      (a: any, b: any) => (GRADE_ORDER[a.grade_band] ?? 0) - (GRADE_ORDER[b.grade_band] ?? 0)
    ) as ThemeThesis[],
    guidance: (t.theme_guidance ?? []) as ThemeGuidance[],
    critic_views: ciByTheme.get(t.id) ?? [],
    quote_count: countsQ.data?.get(t.id) ?? 0,
  }))

  return { enriched, isLoading }
}
