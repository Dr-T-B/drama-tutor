import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type {
  TimingStrategy, GradeLevelDescriptor, CommonError, VocabularyTerm
} from '../types/database'

async function fetchTimingStrategies(): Promise<TimingStrategy[]> {
  const { data, error } = await supabase
    .from('timing_strategies')
    .select(`id, section, total_minutes, planning_minutes,
             writing_minutes, checking_minutes, recommended_paragraphs,
             strategy_note`)
    .order('section')
  if (error) throw error
  return data as TimingStrategy[]
}

async function fetchGradeDescriptors(): Promise<GradeLevelDescriptor[]> {
  const { data, error } = await supabase
    .from('grade_level_descriptors')
    .select(`id, level_no, grade_band, descriptor,
             examiner_translation, success_criteria`)
    .order('level_no')
  if (error) throw error

  const seen = new Set<number>()
  return (data as GradeLevelDescriptor[]).filter(row => {
    if (seen.has(row.level_no)) return false
    seen.add(row.level_no)
    return true
  })
}

async function fetchCommonErrors(): Promise<CommonError[]> {
  const { data, error } = await supabase
    .from('common_errors')
    .select(`id, error_name, error_description,
             symptom_in_student_writing, correction_strategy, severity`)
    .order('error_name')
  if (error) throw error
  return data as CommonError[]
}

async function fetchVocabularyTerms(): Promise<VocabularyTerm[]> {
  const { data, error } = await supabase
    .from('vocabulary_terms')
    .select('id, term, definition, usage_in_analysis, ao_relevance, target_level')
    .order('term')
  if (error) throw error
  return data as VocabularyTerm[]
}

export function useExamSkills(userId: string | null) {
  const timingQ = useQuery({
    queryKey: ['timing_strategies'],
    queryFn: fetchTimingStrategies,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  const gradesQ = useQuery({
    queryKey: ['grade_level_descriptors'],
    queryFn: fetchGradeDescriptors,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  const errorsQ = useQuery({
    queryKey: ['common_errors'],
    queryFn: fetchCommonErrors,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  const vocabQ = useQuery({
    queryKey: ['vocabulary_terms'],
    queryFn: fetchVocabularyTerms,
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  })

  return {
    timing: timingQ.data ?? [],
    grades: gradesQ.data ?? [],
    errors: errorsQ.data ?? [],
    vocab: vocabQ.data ?? [],
    isLoading: timingQ.isLoading || gradesQ.isLoading || errorsQ.isLoading || vocabQ.isLoading,
  }
}
