import { supabase } from '../../lib/supabase'
import type {
  EssayBuilderQuestion,
  EssayPathOption,
  EssayPathFeedback,
  EssaySkeleton,
  EssayBuilderAttempt,
  EssayBuilderAttemptChoice,
  PathClassification,
  PlayCode,
} from '../../types/essayBuilder'

export async function fetchQuestions(play: PlayCode): Promise<EssayBuilderQuestion[]> {
  const { data, error } = await supabase
    .from('essay_builder_questions')
    .select('*')
    .eq('play_code', play)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as EssayBuilderQuestion[]
}

export async function fetchQuestion(id: string): Promise<EssayBuilderQuestion> {
  const { data, error } = await supabase
    .from('essay_builder_questions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as EssayBuilderQuestion
}

export async function fetchPaths(questionId: string): Promise<EssayPathOption[]> {
  const { data, error } = await supabase
    .from('essay_path_options')
    .select('*')
    .eq('question_id', questionId)
  if (error) throw error
  return (data ?? []) as EssayPathOption[]
}

export async function fetchFeedback(id: string): Promise<EssayPathFeedback> {
  const { data, error } = await supabase
    .from('essay_path_feedback')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as EssayPathFeedback
}

export async function fetchSkeleton(pathOptionId: string): Promise<EssaySkeleton | null> {
  const { data, error } = await supabase
    .from('essay_skeletons')
    .select('*')
    .eq('path_option_id', pathOptionId)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as EssaySkeleton | null
}

export async function fetchAttempt(id: string): Promise<EssayBuilderAttempt> {
  const { data, error } = await supabase
    .from('essay_builder_attempts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as EssayBuilderAttempt
}

export async function fetchChoicesForAttempt(attemptId: string): Promise<EssayBuilderAttemptChoice[]> {
  const { data, error } = await supabase
    .from('essay_builder_attempt_choices')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('retry_number', { ascending: true })
  if (error) throw error
  return (data ?? []) as EssayBuilderAttemptChoice[]
}

export async function fetchChoice(id: string): Promise<EssayBuilderAttemptChoice> {
  const { data, error } = await supabase
    .from('essay_builder_attempt_choices')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as EssayBuilderAttemptChoice
}

export async function fetchPath(id: string): Promise<EssayPathOption> {
  const { data, error } = await supabase
    .from('essay_path_options')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as EssayPathOption
}

export async function startAttempt(
  questionId: string,
  play: PlayCode,
): Promise<EssayBuilderAttempt> {
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const userId = userData.user?.id
  if (!userId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('essay_builder_attempts')
    .insert({
      user_id: userId,
      question_id: questionId,
      play_code: play,
    })
    .select()
    .single()
  if (error) throw error
  return data as EssayBuilderAttempt
}

export async function recordChoice(
  attemptId: string,
  pathOptionId: string,
  retryNumber: number,
): Promise<EssayBuilderAttemptChoice> {
  const { data, error } = await supabase
    .from('essay_builder_attempt_choices')
    .insert({
      attempt_id: attemptId,
      path_option_id: pathOptionId,
      retry_number: retryNumber,
    })
    .select()
    .single()
  if (error) throw error
  return data as EssayBuilderAttemptChoice
}

export async function completeAttempt(
  attemptId: string,
  outcome: PathClassification,
  unlocked: boolean,
): Promise<void> {
  const { error } = await supabase
    .from('essay_builder_attempts')
    .update({
      completed_at: new Date().toISOString(),
      final_outcome: outcome,
      unlocked_skeleton: unlocked,
    })
    .eq('id', attemptId)
  if (error) throw error
}
