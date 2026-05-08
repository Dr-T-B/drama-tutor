// Mode D data-access layer — all queries apply DUCHESS_LOCK
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { DUCHESS_LOCK, DUCHESS_LOCK_CACHE_KEY } from '../features/mode-d/aoProfileLock'
import type {
  ModeDRoute,
  ModeDStemOption,
  ModeDAnnotatedParagraph,
} from '../types/modeDTrainer'

const ROUTE_A_KEY = 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_A_PATRIARCHAL_CONTROL'
const ROUTE_B_KEY = 'MODE_D_D002R_DUCHESS_CONTROL_ROUTE_B_COURT_SURVEILLANCE'
const STALE = 1000 * 60 * 5

// ── Routes ───────────────────────────────────────────────────────────────────

export async function getDuchessRoutes(): Promise<ModeDRoute[]> {
  const { data, error } = await supabase
    .from('mode_d_route_bank')
    .select('*')
    .eq('ao_profile_lock', DUCHESS_LOCK)
    .eq('play_code', 'DUCHESS')
    .order('is_recommended_route', { ascending: false })
  if (error) throw error
  return (data ?? []) as ModeDRoute[]
}

export function useDuchessRoutes() {
  return useQuery({
    queryKey: ['mode-d', DUCHESS_LOCK_CACHE_KEY, 'routes'],
    queryFn: getDuchessRoutes,
    staleTime: STALE,
  })
}

// ── MCQ stems (D004D) ────────────────────────────────────────────────────────

export async function getDuchessOptionsByRoute(routeKey: string): Promise<ModeDStemOption[]> {
  const { data, error } = await supabase
    .from('mode_d_duchess_mcq_stem_options')
    .select('*')
    .eq('ao_profile_lock', DUCHESS_LOCK)
    .eq('route_key', routeKey)
    .eq('is_active', true)
    .order('round_number', { ascending: true })
    .order('option_label', { ascending: true })
  if (error) throw error
  return (data ?? []) as ModeDStemOption[]
}

export async function getDuchessPatriarchalControlOptions(): Promise<ModeDStemOption[]> {
  return getDuchessOptionsByRoute(ROUTE_A_KEY)
}

export async function getDuchessCourtSurveillanceOptions(): Promise<ModeDStemOption[]> {
  return getDuchessOptionsByRoute(ROUTE_B_KEY)
}

export function useDuchessOptionsByRoute(routeKey: string) {
  return useQuery({
    queryKey: ['mode-d', DUCHESS_LOCK_CACHE_KEY, 'stems', routeKey],
    queryFn: () => getDuchessOptionsByRoute(routeKey),
    enabled: !!routeKey,
    staleTime: STALE,
  })
}

// ── Annotated essay paragraphs (D007) ────────────────────────────────────────

export async function getDuchessAnnotatedEssayParagraphs(
  routeKey: string,
): Promise<ModeDAnnotatedParagraph[]> {
  // The DUCHESS_LOCK is enforced via route_key FK — no ao_profile_lock column on this table.
  const { data, error } = await supabase
    .from('mode_d_annotated_essay_paragraphs')
    .select('*')
    .eq('route_key', routeKey)
    .eq('is_active', true)
    .order('round_number', { ascending: true })
  if (error) throw error
  return (data ?? []) as ModeDAnnotatedParagraph[]
}

export async function getPatriarchalControlReveal(): Promise<ModeDAnnotatedParagraph[]> {
  return getDuchessAnnotatedEssayParagraphs(ROUTE_A_KEY)
}

export function useDuchessAnnotatedParagraphs(routeKey: string) {
  return useQuery({
    queryKey: ['mode-d', DUCHESS_LOCK_CACHE_KEY, 'reveal', routeKey],
    queryFn: () => getDuchessAnnotatedEssayParagraphs(routeKey),
    enabled: !!routeKey,
    staleTime: STALE,
  })
}

export function usePatriarchalControlReveal() {
  return useDuchessAnnotatedParagraphs(ROUTE_A_KEY)
}
