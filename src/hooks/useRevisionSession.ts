/**
 * useRevisionSession — fetches the full nested session for one play
 * via a single PostgREST resource-embedding select.
 *
 * Returns three pairings (in order), each fully hydrated with characters,
 * drill questions + options, pivot, build + options.
 *
 * Assumes a `supabase` client export at '@/lib/supabase'. Adjust the import
 * path to match your project layout if needed.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  Pairing,
  PairingId,
  PlayCode,
  Pivot,
  PivotMode,
} from '../types/session';

const HAM_TEXT_ID = '9c213169-bfaa-4fbc-84e0-96b76045a53f';
const MAL_TEXT_ID = '7d4c42dd-79b1-44db-ae66-8c85fe83bd72';

const textIdFor = (play: PlayCode): string =>
  play === 'HAM' ? HAM_TEXT_ID : MAL_TEXT_ID;

// What we ask PostgREST for. Comma-separated, nested via `name(*)`.
// Aliased so the response uses the readable JS-side names.
const PAIRING_SELECT = `
  id,
  text_id,
  pairing_order,
  title,
  eyebrow,
  tagline,
  diagram_svg,
  diagram_caption,
  characters:revision_pairing_characters(
    id, display_order, name, role,
    dramatic_function, key_argument, aos
  ),
  drill_questions:revision_drill_questions(
    id, question_order, quote_text, speaker, ref,
    question_text, annotation, aos,
    options:revision_drill_options(
      id, option_order, option_text, is_correct
    )
  ),
  pivot:revision_pivots(
    pairing_id, mode,
    anchor_quote, anchor_ref,
    reading_a_name, reading_a_tag, reading_a_position,
    reading_a_critic_id, reading_a_year,
    reading_b_name, reading_b_tag, reading_b_position,
    reading_b_critic_id, reading_b_year,
    prompt, model_sentence, model_why
  ),
  build:revision_builds(
    pairing_id, question, instruction, model_paragraph, checklist,
    options:revision_build_options(
      id, option_type, option_order, option_key, label, is_ideal
    )
  )
`;

interface RawPairing {
  id: PairingId;
  text_id: string;
  pairing_order: number;
  title: string;
  eyebrow: string;
  tagline: string;
  diagram_svg: string;
  diagram_caption: string;
  characters: Pairing['characters'];
  drill_questions: Array<
    Omit<Pairing['drill_questions'][number], 'options'> & {
      options: Pairing['drill_questions'][number]['options'];
    }
  >;
  pivot: Pivot[] | Pivot | null;   // PostgREST returns array for has-one — we collapse
  build: Array<{
    pairing_id: PairingId;
    question: string;
    instruction: string;
    model_paragraph: string;
    checklist: string[];
    options: Pairing['build']['options'];
  }> | null;
}

/** PostgREST returns arrays even for unique FKs — normalise. */
function firstOrNull<T>(value: T[] | T | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function normalisePairing(raw: RawPairing): Pairing {
  const pivot = firstOrNull(raw.pivot);
  const build = firstOrNull(raw.build);

  if (!pivot) {
    throw new Error(`Pairing ${raw.id} is missing its pivot row.`);
  }
  if (!build) {
    throw new Error(`Pairing ${raw.id} is missing its build row.`);
  }

  // Sort nested arrays defensively — PostgREST honours order via column,
  // but explicit sort keeps the React render stable.
  const characters = [...raw.characters].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const drill_questions = raw.drill_questions
    .map((q) => ({
      ...q,
      options: [...q.options].sort((a, b) => a.option_order - b.option_order),
    }))
    .sort((a, b) => a.question_order - b.question_order);

  return {
    id: raw.id,
    text_id: raw.text_id,
    pairing_order: raw.pairing_order,
    title: raw.title,
    eyebrow: raw.eyebrow,
    tagline: raw.tagline,
    diagram_svg: raw.diagram_svg,
    diagram_caption: raw.diagram_caption,
    characters,
    drill_questions,
    pivot: pivot as Pivot,
    build: {
      pairing_id: build.pairing_id,
      question: build.question,
      instruction: build.instruction,
      model_paragraph: build.model_paragraph,
      checklist: build.checklist,
      options: [...build.options].sort(
        (a, b) =>
          a.option_type.localeCompare(b.option_type) ||
          a.option_order - b.option_order,
      ),
    },
  };
}

async function fetchRevisionSession(play: PlayCode): Promise<Pairing[]> {
  const { data, error } = await supabase
    .from('revision_pairings')
    .select(PAIRING_SELECT)
    .eq('text_id', textIdFor(play))
    .order('pairing_order');

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as RawPairing[]).map(normalisePairing);
}

export function useRevisionSession(play: PlayCode) {
  return useQuery({
    queryKey: ['revision-session', play],
    queryFn: () => fetchRevisionSession(play),
    staleTime: 1000 * 60 * 60,   // content is essentially static — 1h is fine
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/** Convenience for stage components that don't need the whole list. */
export function selectPairingByIndex(
  pairings: Pairing[] | undefined,
  index: number,
): Pairing | undefined {
  return pairings?.[index];
}

export type { PivotMode };
