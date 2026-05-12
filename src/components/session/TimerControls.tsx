/**
 * TimerControls — compact timer with start/pause/reset and a gear-icon
 * popover for changing the target duration.
 *
 * Visual state:
 *   idle      → big "START" button (no time shown yet, just 0:00)
 *   running   → time ticking, ⏸ pause + ⟲ reset visible
 *   paused    → time frozen, ▶ resume + ⟲ reset visible
 *
 * Settings popover (gear): change target minutes (5–360).
 *
 * The component reads the timer snapshot every 500ms while running and
 * does its own ticking with a stable interval — the parent state only
 * mutates on user actions, not on every tick.
 */

import { useEffect, useRef, useState } from 'react';
import type { TimerSnapshot } from '../../hooks/useSessionState';
import { elapsedMs } from '../../hooks/useSessionState';

interface Props {
  timer: TimerSnapshot;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSetTargetMinutes: (minutes: number) => void;
}

export function TimerControls({
  timer,
  onStart,
  onPause,
  onResume,
  onReset,
  onSetTargetMinutes,
}: Props) {
  const [now, setNow] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Tick only while running; otherwise time is stable.
  useEffect(() => {
    if (timer.state !== 'running') return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [timer.state]);

  // Close settings on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

  const elapsed = elapsedMs(timer, now);
  const targetMs = timer.targetMinutes * 60_000;
  const remaining = Math.max(0, targetMs - elapsed);
  const overtime = elapsed > targetMs;
  const progress = Math.min(1, elapsed / targetMs);

  return (
    <div className="flex items-center gap-3 relative">
      <div className="flex flex-col items-end">
        <div
          className="session-mono text-sm tabular-nums leading-none"
          style={{
            color: overtime ? 'var(--session-accent)' : 'inherit',
            fontWeight: timer.state === 'running' ? 600 : 400,
          }}
        >
          {formatMs(elapsed)}
        </div>
        <div className="session-mono text-[9px] tracking-widest opacity-50 leading-tight mt-0.5">
          {overtime
            ? `+${formatMs(elapsed - targetMs)} over`
            : `${formatMs(remaining)} left`}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {timer.state === 'idle' && (
          <IconButton onClick={onStart} title="Start timer" aria-label="Start">
            ▶
          </IconButton>
        )}
        {timer.state === 'running' && (
          <>
            <IconButton onClick={onPause} title="Pause timer" aria-label="Pause">
              ⏸
            </IconButton>
            <IconButton onClick={onReset} title="Reset timer" aria-label="Reset timer">
              ⟲
            </IconButton>
          </>
        )}
        {timer.state === 'paused' && (
          <>
            <IconButton onClick={onResume} title="Resume timer" aria-label="Resume">
              ▶
            </IconButton>
            <IconButton onClick={onReset} title="Reset timer" aria-label="Reset timer">
              ⟲
            </IconButton>
          </>
        )}
        <IconButton
          onClick={() => setSettingsOpen((v) => !v)}
          title="Timer settings"
          aria-label="Timer settings"
          aria-expanded={settingsOpen}
        >
          ⚙
        </IconButton>
      </div>

      {settingsOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 z-20 w-64 p-4 rounded-sm border shadow-lg"
          style={{
            background: 'var(--session-card)',
            borderColor: 'var(--session-rule)',
          }}
        >
          <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
            Timer settings
          </p>
          <label className="block">
            <span className="text-xs opacity-80 block mb-1">Target duration (minutes)</span>
            <input
              type="number"
              min={1}
              max={360}
              step={1}
              value={timer.targetMinutes}
              onChange={(e) => onSetTargetMinutes(Number(e.target.value))}
              className="w-full px-2 py-1 text-sm tabular-nums border bg-transparent"
              style={{ borderColor: 'var(--session-rule)' }}
            />
          </label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[30, 60, 90, 120].map((m) => (
              <button
                key={m}
                onClick={() => onSetTargetMinutes(m)}
                className="session-mono text-[10px] tracking-widest px-2 py-1 border opacity-80 hover:opacity-100"
                style={{
                  borderColor: 'var(--session-rule)',
                  background:
                    timer.targetMinutes === m ? 'var(--session-match)' : 'transparent',
                }}
              >
                {m}m
              </button>
            ))}
          </div>
          <p className="text-[10px] opacity-60 mt-3 leading-snug">
            Changes apply immediately. The bar in the header tracks progress against this target.
          </p>
        </div>
      )}

      {/* hidden — but exposes progress to the parent header via CSS var if needed */}
      <span className="sr-only" data-progress={progress.toFixed(3)} />
    </div>
  );
}

function IconButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={
        'w-7 h-7 flex items-center justify-center text-sm rounded-sm border opacity-70 hover:opacity-100 transition ' +
        (rest.className ?? '')
      }
      style={{
        borderColor: 'var(--session-rule)',
        background: 'var(--session-card)',
      }}
    >
      {children}
    </button>
  );
}

function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
