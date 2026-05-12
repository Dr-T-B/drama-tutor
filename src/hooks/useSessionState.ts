/**
 * useSessionState — drives the 29-stage session machine for one play, plus
 * a controllable timer (start / pause / resume / reset) with a configurable
 * target duration.
 *
 * Storage schema bumped to v2. v1 sessions are migrated forward without
 * losing progress: the existing startedAt becomes the timer's activeRunStartedAt
 * and the timer enters 'running' state.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Pairing, PairingId, PlayCode } from '../types/session';

export type StageDescriptor =
  | { kind: 'welcome' }
  | { kind: 'orient'; pairingIndex: number; pairing: Pairing }
  | {
      kind: 'drill';
      pairingIndex: number;
      questionIndex: number;
      pairing: Pairing;
    }
  | { kind: 'pivot'; pairingIndex: number; pairing: Pairing }
  | { kind: 'build'; pairingIndex: number; pairing: Pairing }
  | { kind: 'checkpoint'; pairingIndex: number; pairing: Pairing }
  | { kind: 'summary' };

export interface DrillAnswer {
  selectedOptionOrder: number;
  isCorrect: boolean;
  answeredAt: number;
}

export interface BuildSelection {
  quote?: string;
  secondary?: string;
  context?: string;
}

export type TimerState = 'idle' | 'running' | 'paused';

export interface TimerSnapshot {
  state: TimerState;
  accumulatedMs: number;
  activeRunStartedAt: number | null;
  targetMinutes: number;
}

interface PersistedStateV2 {
  version: 2;
  stageIndex: number;
  drillAnswers: Record<string, DrillAnswer>;
  buildSelections: Record<PairingId, BuildSelection>;
  startedAt: number;
  finishedAt: number | null;
  timer: TimerSnapshot;
}

// v1 schema (no timer block) — read-only, migrated forward on load
interface PersistedStateV1 {
  version?: 1;
  stageIndex: number;
  drillAnswers: Record<string, DrillAnswer>;
  buildSelections: Record<PairingId, BuildSelection>;
  startedAt: number;
  finishedAt: number | null;
}

const STORAGE_VERSION = 2;
const DEFAULT_TARGET_MIN = 90;
const storageKey = (play: PlayCode) => `revision-session-${play}-v${STORAGE_VERSION}`;
const legacyKey = (play: PlayCode) => `revision-session-${play}-v1`;

const defaultTimer = (): TimerSnapshot => ({
  state: 'idle',
  accumulatedMs: 0,
  activeRunStartedAt: null,
  targetMinutes: DEFAULT_TARGET_MIN,
});

const defaultState = (): PersistedStateV2 => {
  const now = Date.now();
  return {
    version: 2,
    stageIndex: 0,
    drillAnswers: {},
    buildSelections: {} as Record<PairingId, BuildSelection>,
    startedAt: now,
    finishedAt: null,
    timer: defaultTimer(),
  };
};

function migrateV1(v1: PersistedStateV1): PersistedStateV2 {
  return {
    version: 2,
    stageIndex: v1.stageIndex,
    drillAnswers: v1.drillAnswers,
    buildSelections: v1.buildSelections,
    startedAt: v1.startedAt,
    finishedAt: v1.finishedAt,
    timer: {
      state: 'running',
      accumulatedMs: 0,
      activeRunStartedAt: v1.startedAt,
      targetMinutes: DEFAULT_TARGET_MIN,
    },
  };
}

function loadState(play: PlayCode): PersistedStateV2 {
  if (typeof window === 'undefined') return defaultState();
  try {
    const v2Raw = window.localStorage.getItem(storageKey(play));
    if (v2Raw) {
      const parsed = JSON.parse(v2Raw) as PersistedStateV2;
      if (parsed.version === 2) return parsed;
    }
    const v1Raw = window.localStorage.getItem(legacyKey(play));
    if (v1Raw) {
      const parsed = JSON.parse(v1Raw) as PersistedStateV1;
      return migrateV1(parsed);
    }
    return defaultState();
  } catch {
    return defaultState();
  }
}

function saveState(play: PlayCode, state: PersistedStateV2) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(play), JSON.stringify(state));
  } catch {
    /* quota exceeded — silent */
  }
}

function buildStages(pairings: Pairing[]): StageDescriptor[] {
  const stages: StageDescriptor[] = [{ kind: 'welcome' }];
  pairings.forEach((pairing, pairingIndex) => {
    stages.push({ kind: 'orient', pairingIndex, pairing });
    pairing.drill_questions.forEach((_, questionIndex) => {
      stages.push({ kind: 'drill', pairingIndex, questionIndex, pairing });
    });
    stages.push({ kind: 'pivot', pairingIndex, pairing });
    stages.push({ kind: 'build', pairingIndex, pairing });
    stages.push({ kind: 'checkpoint', pairingIndex, pairing });
  });
  stages.push({ kind: 'summary' });
  return stages;
}

/** Compute elapsed ms from a timer snapshot at a given moment. */
export function elapsedMs(timer: TimerSnapshot, now = Date.now()): number {
  if (timer.state === 'running' && timer.activeRunStartedAt) {
    return timer.accumulatedMs + (now - timer.activeRunStartedAt);
  }
  return timer.accumulatedMs;
}

export interface UseSessionStateReturn {
  stage: StageDescriptor;
  stageIndex: number;
  totalStages: number;

  startedAt: number;
  finishedAt: number | null;
  isFinished: boolean;
  drillAnswers: Record<string, DrillAnswer>;
  buildSelections: Record<PairingId, BuildSelection>;

  // Timer
  timer: TimerSnapshot;
  timerStart: () => void;
  timerPause: () => void;
  timerResume: () => void;
  timerReset: () => void;
  setTargetMinutes: (minutes: number) => void;

  // Navigation
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;

  // Recording
  recordDrillAnswer: (
    questionId: string,
    selectedOptionOrder: number,
    isCorrect: boolean,
  ) => void;
  setBuildSelection: (
    pairingId: PairingId,
    field: keyof BuildSelection,
    value: string,
  ) => void;

  reset: () => void;
}

export function useSessionState(
  play: PlayCode,
  pairings: Pairing[] | undefined,
): UseSessionStateReturn {
  const [state, setState] = useState<PersistedStateV2>(() => loadState(play));

  // Reload when play changes
  const lastPlay = useRef(play);
  useEffect(() => {
    if (lastPlay.current !== play) {
      lastPlay.current = play;
      setState(loadState(play));
    }
  }, [play]);

  useEffect(() => {
    saveState(play, state);
  }, [play, state]);

  const stages = useMemo<StageDescriptor[]>(
    () => (pairings ? buildStages(pairings) : [{ kind: 'welcome' }]),
    [pairings],
  );

  const clamped = Math.min(state.stageIndex, stages.length - 1);
  const stage = stages[clamped] ?? stages[0];

  const next = useCallback(() => {
    setState((s) => {
      const newIndex = Math.min(s.stageIndex + 1, stages.length - 1);
      const reachedSummary = stages[newIndex]?.kind === 'summary';
      // Pause timer on summary
      const nextTimer = reachedSummary && s.timer.state === 'running'
        ? pauseSnapshot(s.timer)
        : s.timer;
      return {
        ...s,
        stageIndex: newIndex,
        finishedAt: reachedSummary && !s.finishedAt ? Date.now() : s.finishedAt,
        timer: nextTimer,
      };
    });
  }, [stages]);

  const prev = useCallback(() => {
    setState((s) => ({ ...s, stageIndex: Math.max(s.stageIndex - 1, 0) }));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setState((s) => ({
        ...s,
        stageIndex: Math.max(0, Math.min(index, stages.length - 1)),
      }));
    },
    [stages.length],
  );

  const recordDrillAnswer = useCallback(
    (questionId: string, selectedOptionOrder: number, isCorrect: boolean) => {
      setState((s) => ({
        ...s,
        drillAnswers: {
          ...s.drillAnswers,
          [questionId]: { selectedOptionOrder, isCorrect, answeredAt: Date.now() },
        },
      }));
    },
    [],
  );

  const setBuildSelection = useCallback(
    (pairingId: PairingId, field: keyof BuildSelection, value: string) => {
      setState((s) => ({
        ...s,
        buildSelections: {
          ...s.buildSelections,
          [pairingId]: { ...(s.buildSelections[pairingId] ?? {}), [field]: value },
        },
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState(defaultState());
  }, []);

  // ── Timer controls ───────────────────────────────────────────────────────
  const timerStart = useCallback(() => {
    setState((s) =>
      s.timer.state === 'running'
        ? s
        : {
            ...s,
            timer: {
              ...s.timer,
              state: 'running',
              activeRunStartedAt: Date.now(),
            },
          },
    );
  }, []);

  const timerPause = useCallback(() => {
    setState((s) => (s.timer.state === 'running' ? { ...s, timer: pauseSnapshot(s.timer) } : s));
  }, []);

  const timerResume = timerStart; // semantically the same operation

  const timerReset = useCallback(() => {
    setState((s) => ({
      ...s,
      timer: {
        state: s.timer.state === 'running' ? 'running' : 'idle',
        accumulatedMs: 0,
        activeRunStartedAt: s.timer.state === 'running' ? Date.now() : null,
        targetMinutes: s.timer.targetMinutes,
      },
    }));
  }, []);

  const setTargetMinutes = useCallback((minutes: number) => {
    const clamped = Math.max(1, Math.min(360, Math.round(minutes)));
    setState((s) => ({ ...s, timer: { ...s.timer, targetMinutes: clamped } }));
  }, []);

  return {
    stage,
    stageIndex: clamped,
    totalStages: stages.length,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    isFinished: state.finishedAt !== null,
    drillAnswers: state.drillAnswers,
    buildSelections: state.buildSelections,
    timer: state.timer,
    timerStart,
    timerPause,
    timerResume,
    timerReset,
    setTargetMinutes,
    next,
    prev,
    goTo,
    recordDrillAnswer,
    setBuildSelection,
    reset,
  };
}

function pauseSnapshot(t: TimerSnapshot): TimerSnapshot {
  if (t.state !== 'running' || !t.activeRunStartedAt) return t;
  return {
    ...t,
    state: 'paused',
    accumulatedMs: t.accumulatedMs + (Date.now() - t.activeRunStartedAt),
    activeRunStartedAt: null,
  };
}
