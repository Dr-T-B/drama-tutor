import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type {
  Theme, Character, QuoteAoLink,
  QuoteSecondaryTheme, QuoteEnriched
} from '../types/database'

async function fetchQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      id, quote_id, content, speaker, addressee, act_scene,
      memorisation_priority, dramatic_moment, structural_function, exam_sentence,
      text_id, character_id, primary_theme_id,
      texts!inner(short_code),
      quote_ao_links(ao_code, note),
      quote_secondary_themes(theme_id, relevance_note)
    `)
    .order('quote_id')
  if (error) throw error
  return data
}

async function fetchThemes() {
  const { data, error } = await supabase
    .from('themes')
    .select('id, theme_code, theme_name, text_id')
    .order('theme_code')
  if (error) throw error
  return data as Theme[]
}

async function fetchCharacters() {
  const { data, error } = await supabase
    .from('characters')
    .select('id, name, text_id')
    .order('name')
  if (error) throw error
  return data as Character[]
}

export function useQuotes(userId: string | null) {
  const quotesQ = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
    staleTime: 1000 * 60 * 10,
    enabled: !!userId,
  })

  const themesQ = useQuery({
    queryKey: ['themes'],
    queryFn: fetchThemes,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  const charsQ = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  const isLoading = quotesQ.isLoading || themesQ.isLoading || charsQ.isLoading

  // Build enriched quotes
  const themeMap = new Map((themesQ.data ?? []).map(t => [t.id, t]))
  const charMap  = new Map((charsQ.data ?? []).map(c => [c.id, c]))

  const enriched: QuoteEnriched[] = (quotesQ.data ?? []).map((q: any) => ({
    ...q,
    play: q.texts.short_code as 'HAM' | 'MAL',
    character_name: q.character_id ? (charMap.get(q.character_id)?.name ?? null) : null,
    primary_theme: q.primary_theme_id ? (themeMap.get(q.primary_theme_id) ?? null) : null,
    ao_links: (q.quote_ao_links ?? []) as QuoteAoLink[],
    secondary_themes: (q.quote_secondary_themes ?? []).map((st: QuoteSecondaryTheme) => ({
      theme: themeMap.get(st.theme_id) ?? null,
      relevance_note: st.relevance_note,
    })).filter((st: any) => st.theme !== null),
  }))

  return { enriched, themeMap, charMap, isLoading }
}
