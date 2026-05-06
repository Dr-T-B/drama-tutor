import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  completeAttempt,
  fetchAttempt,
  fetchChoice,
  fetchChoicesForAttempt,
  fetchFeedback,
  fetchPath,
  fetchPaths,
  fetchQuestion,
  fetchQuestions,
  fetchSkeleton,
  recordChoice,
  startAttempt,
} from './api'
import type { PathClassification, PlayCode } from '../../types/essayBuilder'

const STALE = 1000 * 60 * 5

export function useQuestions(play: PlayCode | null) {
  return useQuery({
    queryKey: ['eb', 'questions', play],
    queryFn: () => fetchQuestions(play as PlayCode),
    enabled: !!play,
    staleTime: STALE,
  })
}

export function useQuestion(id: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'question', id],
    queryFn: () => fetchQuestion(id!),
    enabled: !!id,
    staleTime: STALE,
  })
}

export function usePaths(questionId: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'paths', questionId],
    queryFn: () => fetchPaths(questionId!),
    enabled: !!questionId,
    staleTime: STALE,
  })
}

export function usePath(id: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'path', id],
    queryFn: () => fetchPath(id!),
    enabled: !!id,
    staleTime: STALE,
  })
}

export function useFeedback(id: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'feedback', id],
    queryFn: () => fetchFeedback(id!),
    enabled: !!id,
    staleTime: STALE,
  })
}

export function useSkeleton(pathOptionId: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'skeleton', pathOptionId],
    queryFn: () => fetchSkeleton(pathOptionId!),
    enabled: !!pathOptionId,
    staleTime: STALE,
  })
}

export function useAttempt(id: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'attempt', id],
    queryFn: () => fetchAttempt(id!),
    enabled: !!id,
  })
}

export function useChoicesForAttempt(attemptId: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'choices', attemptId],
    queryFn: () => fetchChoicesForAttempt(attemptId!),
    enabled: !!attemptId,
  })
}

export function useChoice(id: string | undefined) {
  return useQuery({
    queryKey: ['eb', 'choice', id],
    queryFn: () => fetchChoice(id!),
    enabled: !!id,
  })
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: ({ questionId, play }: { questionId: string; play: PlayCode }) =>
      startAttempt(questionId, play),
  })
}

export function useRecordChoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      attemptId,
      pathOptionId,
      retryNumber,
    }: {
      attemptId: string
      pathOptionId: string
      retryNumber: number
    }) => recordChoice(attemptId, pathOptionId, retryNumber),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['eb', 'choices', vars.attemptId] })
    },
  })
}

export function useCompleteAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      attemptId,
      outcome,
      unlocked,
    }: {
      attemptId: string
      outcome: PathClassification
      unlocked: boolean
    }) => completeAttempt(attemptId, outcome, unlocked),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['eb', 'attempt', vars.attemptId] })
    },
  })
}
