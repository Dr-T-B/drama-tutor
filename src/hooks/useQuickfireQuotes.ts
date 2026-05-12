/**
 * useQuickfireQuotes — fetches all drill questions for a play and exposes
 * a shuffled slice for the Quote Attribution Flash drill.
 *
 * Reuses revision_drill_questions (already seeded) rather than introducing
 * a new table — the same content powers the structured session drill and
 * the quickfire flash mode.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { DrillQuestion, PlayCode } from '../types/session';

const HAM_TEXT_ID = '9c213169-bfaa-4fbc-84e0-96b76045a53f';
const MAL_TEXT_ID = '7d4c42dd-79b1-44db-ae66-8c85fe83bd72';
const textIdFor = (play: PlayCode) => (play === 'HAM' ? HAM_TEXT_ID : MAL_TEXT_ID);

// Shape returned from PostgREST when we join through revision_pairings
interface RawQuickfireQuote {
  id: string;
  quote_text: string;
  speaker: string;
  ref: string;
  question_text: string;
  annotation: string;
  aos: string[];
  pairing: { id: string; text_id: string };
}

async function fetchAllQuotes(play: PlayCode): Promise<DrillQuestion[]> {
  const { data, error } = await supabase
    .from('revision_drill_questions')
    .select(`
      id, question_order, quote_text, speaker, ref, question_text, annotation, aos,
      pairing:revision_pairings!inner(id, text_id)
    `)
    .eq('pairing.text_id', textIdFor(play));

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as Array<RawQuickfireQuote & { question_order: number }>).map((r) => ({
    id: r.id,
    question_order: r.question_order,
    quote_text: r.quote_text,
    speaker: r.speaker,
    ref: r.ref,
    question_text: r.question_text,
    annotation: r.annotation,
    aos: r.aos as DrillQuestion['aos'],
    options: [], // not needed for flash mode
  }));
}

/** Fisher–Yates shuffle, seeded by Date.now() if no seed passed */
function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuickfireQuotes(play: PlayCode, count: number = 10, seed?: number) {
  const query = useQuery({
    queryKey: ['quickfire-quotes', play],
    queryFn: () => fetchAllQuotes(play),
    staleTime: 1000 * 60 * 60,
  });

  const quotes = useMemo(() => {
    if (!query.data) return [];
    return shuffle(query.data, seed ?? Date.now()).slice(0, count);
  }, [query.data, count, seed]);

  return { ...query, quotes };
}
