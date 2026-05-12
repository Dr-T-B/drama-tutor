/**
 * SessionShell — fixed chrome around the active stage.
 *
 * Header: play title · TimerControls (start/pause/reset/settings) · session RESET link
 * Footer: prev / skip nav (hidden on welcome + summary)
 *
 * The session-level RESET (clears progress and timer) is distinct from the
 * timer-only reset inside TimerControls (only zeroes the timer).
 */

import { type ReactNode } from 'react';
import type { PlayCode } from '../../types/session';
import type { UseSessionStateReturn } from '../../hooks/useSessionState';
import { elapsedMs } from '../../hooks/useSessionState';
import { TimerControls } from './TimerControls';

interface SessionShellProps {
  play: PlayCode;
  session: UseSessionStateReturn;
  children: ReactNode;
}

const PLAY_LABEL: Record<PlayCode, string> = {
  HAM: 'Hamlet',
  MAL: 'The Duchess of Malfi',
};

const PLAY_AO: Record<PlayCode, string> = {
  HAM: 'AO1 · AO2 · AO3 · AO5',
  MAL: 'AO1 · AO2 · AO3',
};

export function SessionShell({ play, session, children }: SessionShellProps) {
  const {
    stage,
    stageIndex,
    totalStages,
    prev,
    next,
    reset,
    timer,
    timerStart,
    timerPause,
    timerResume,
    timerReset,
    setTargetMinutes,
  } = session;

  // Stage progress (separate from timer progress)
  const stageProgress = totalStages > 0 ? (stageIndex / (totalStages - 1)) * 100 : 0;

  // Timer progress for the bar
  const targetMs = timer.targetMinutes * 60_000;
  const timerProgress = Math.min(100, (elapsedMs(timer) / targetMs) * 100);

  const showNav = stage.kind !== 'welcome' && stage.kind !== 'summary';
  const showSessionReset = stageIndex > 0;

  const handleSessionReset = () => {
    const ok = window.confirm(
      'Reset this session?\n\nYour drill answers, build picks, and the timer will all be cleared.',
    );
    if (ok) reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-current/15 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
              Revision Session · {PLAY_AO[play]}
            </p>
            <h1 className="session-display text-xl sm:text-2xl truncate">
              {PLAY_LABEL[play]}
            </h1>
          </div>

          <div className="flex items-start gap-3 shrink-0">
            <TimerControls
              timer={timer}
              onStart={timerStart}
              onPause={timerPause}
              onResume={timerResume}
              onReset={timerReset}
              onSetTargetMinutes={setTargetMinutes}
            />
            {showSessionReset && (
              <button
                onClick={handleSessionReset}
                className="session-mono text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:underline underline-offset-4 transition-opacity mt-1"
                title="Clear all progress and restart this session"
              >
                RESET
              </button>
            )}
          </div>
        </div>

        {/* Stage progress bar (matches v2 layout — left-to-right fill) */}
        <div className="max-w-3xl mx-auto mt-3 h-px bg-current/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-500"
            style={{
              width: `${stageProgress}%`,
              background: 'var(--session-accent)',
            }}
          />
        </div>
        <div className="max-w-3xl mx-auto mt-2 flex items-center justify-between gap-3">
          <p className="session-mono text-[10px] tracking-widest opacity-60">
            STAGE {stageIndex + 1} OF {totalStages} · {stageLabel(stage.kind)}
          </p>
          <p className="session-mono text-[10px] tracking-widest opacity-50">
            TIMER {timerProgress.toFixed(0)}%
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>

      {showNav && (
        <footer className="border-t border-current/15 px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={prev}
              disabled={stageIndex === 0}
              className="session-mono text-xs tracking-widest opacity-70 hover:opacity-100 disabled:opacity-30"
            >
              ← BACK
            </button>
            <button
              onClick={next}
              className="session-mono text-xs tracking-widest opacity-70 hover:opacity-100"
            >
              SKIP →
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

function stageLabel(kind: string): string {
  switch (kind) {
    case 'welcome': return 'WELCOME';
    case 'orient': return 'ORIENT';
    case 'drill': return 'DRILL';
    case 'pivot': return 'PIVOT';
    case 'build': return 'BUILD';
    case 'checkpoint': return 'CHECKPOINT';
    case 'summary': return 'SUMMARY';
    default: return kind.toUpperCase();
  }
}
