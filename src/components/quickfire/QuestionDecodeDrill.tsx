/**
 * QuestionDecodeDrill — Drill #3
 *
 * Cycle (per question, ~60s):
 *   1. Question shown · 60-second internal timer
 *   2. User picks the precise focus word (multiple choice, distractors test precision)
 *   3. User picks which TWO pairings best illustrate (multi-select from 3)
 *   4. REVEAL → model thesis + decoding note
 *   5. Self-mark → next
 *
 * Five questions per play, drawn from quickfireContent.QUESTION_DECODES.
 */

import { useEffect, useMemo, useState } from 'react';
import type { PlayCode } from '../../types/session';
import { QUESTION_DECODES, type QuestionDecode } from '../../data/quickfireContent';

interface Props {
  play: PlayCode;
  onDone: () => void;
}

const PAIRINGS_BY_PLAY: Record<PlayCode, Array<{ id: string; label: string }>> = {
  HAM: [
    { id: 'ham-gh', label: 'Gertrude × Horatio' },
    { id: 'ham-rg', label: 'Rosencrantz × Guildenstern' },
    { id: 'ham-og', label: 'Ghost × Old Hamlet' },
  ],
  MAL: [
    { id: 'mal-da', label: 'The Duchess × Antonio' },
    { id: 'mal-fc', label: 'Ferdinand × The Cardinal' },
    { id: 'mal-bd', label: 'Bosola × The Duchess' },
  ],
};

const SECONDS_PER_QUESTION = 60;

export function QuestionDecodeDrill({ play, onDone }: Props) {
  const questions = useMemo(
    () => QUESTION_DECODES.filter((q) => q.play === play),
    [play],
  );

  const [index, setIndex] = useState(0);
  const [focusPick, setFocusPick] = useState<string | null>(null);
  const [pairingPicks, setPairingPicks] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [marks, setMarks] = useState<Record<string, 'got' | 'miss'>>({});
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_QUESTION);

  // Per-question countdown
  useEffect(() => {
    if (revealed) return;
    setSecondsLeft(SECONDS_PER_QUESTION);
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [index, revealed]);

  const total = questions.length;
  const done = index >= total;

  if (questions.length === 0) {
    return (
      <p className="qf-mono text-xs opacity-70">
        No question-decoding content available for this play yet.
      </p>
    );
  }

  if (done) {
    const got = Object.values(marks).filter((m) => m === 'got').length;
    return (
      <div className="space-y-6">
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">DRILL COMPLETE</p>
        <h2 className="qf-display text-4xl">{got} / {total} decoded.</h2>
        <p className="text-lg max-w-xl">
          Targeting is the single most common reason a strong essay gets a B
          instead of an A. If you can decode the question in sixty seconds,
          you've already done the hardest part.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setIndex(0); setRevealed(false); setMarks({});
              setFocusPick(null); setPairingPicks([]);
            }}
            className="qf-display text-base px-5 py-2 rounded-sm border-2"
            style={{ borderColor: 'var(--qf-accent)', color: 'var(--qf-accent)' }}
          >
            Run again →
          </button>
          <button
            onClick={onDone}
            className="qf-mono text-xs tracking-widest opacity-70 hover:opacity-100 underline underline-offset-4 self-center"
          >
            BACK TO MODES
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const pairings = PAIRINGS_BY_PLAY[play];
  const idealPairingSet = new Set(q.illustratingPairings);
  const focusCorrect = focusPick === q.focusWord;

  const togglePairing = (id: string) => {
    setPairingPicks((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const canReveal = focusPick !== null && pairingPicks.length === 2;

  const advance = (mark: 'got' | 'miss') => {
    setMarks((prev) => ({ ...prev, [q.id]: mark }));
    setIndex((i) => i + 1);
    setRevealed(false);
    setFocusPick(null);
    setPairingPicks([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
          QUESTION DECODING · {index + 1} / {total}
        </p>
        <div className="flex items-center gap-4">
          {!revealed && (
            <p
              className="qf-mono text-sm tabular-nums"
              style={{ color: secondsLeft <= 10 ? 'var(--qf-accent)' : 'inherit' }}
            >
              0:{String(secondsLeft).padStart(2, '0')}
            </p>
          )}
          <div className="qf-progress-dots">
            {Array.from({ length: total }).map((_, i) => {
              let state: string = 'pending';
              if (i < index) state = marks[questions[i].id] ?? 'pending';
              else if (i === index) state = 'current';
              return <span key={i} className="qf-progress-dot" data-state={state} />;
            })}
          </div>
        </div>
      </div>

      <div>
        <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
          {q.year} · Section {play === 'HAM' ? 'A' : 'B'}
        </p>
        <h2 className="qf-display text-3xl leading-tight">{q.question}</h2>
      </div>

      {!revealed && (
        <>
          <FocusPicker
            options={q.focusOptions}
            selected={focusPick}
            onPick={setFocusPick}
          />

          <PairingPicker
            pairings={pairings}
            picks={pairingPicks}
            onToggle={togglePairing}
          />

          <button
            onClick={() => setRevealed(true)}
            disabled={!canReveal}
            className="qf-display text-lg px-6 py-2 rounded-sm border-2 disabled:opacity-40"
            style={{ borderColor: 'var(--qf-accent)', color: 'var(--qf-accent)' }}
          >
            Reveal model decoding →
          </button>
        </>
      )}

      {revealed && (
        <>
          <div className="qf-reveal space-y-4">
            <div>
              <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
                Focus word
              </p>
              <p className="text-lg">
                <strong>{q.focusWord}</strong>
                {focusPick && (
                  <span
                    className="qf-mono text-xs ml-3"
                    style={{
                      color: focusCorrect
                        ? 'var(--qf-good-ink)'
                        : 'var(--qf-miss-ink)',
                    }}
                  >
                    {focusCorrect ? '✓ you picked this' : `✗ you picked "${focusPick}"`}
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
                Best-illustrating pairings
              </p>
              <div className="flex gap-2 flex-wrap">
                {q.illustratingPairings.map((pid) => {
                  const p = pairings.find((x) => x.id === pid);
                  const userPicked = pairingPicks.includes(pid);
                  return (
                    <span
                      key={pid}
                      className="qf-mono text-xs px-2 py-1 border rounded-sm"
                      style={{
                        borderColor: userPicked ? 'var(--qf-good-ink)' : 'var(--qf-rule)',
                        background: userPicked ? 'var(--qf-good)' : 'transparent',
                        color: userPicked ? 'var(--qf-good-ink)' : 'inherit',
                      }}
                    >
                      {p?.label ?? pid} {userPicked && '✓'}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
                Model thesis sentence
              </p>
              <p
                className="qf-display text-lg leading-relaxed italic border-l-2 pl-4 py-1"
                style={{ borderColor: 'var(--qf-accent)' }}
                dangerouslySetInnerHTML={{ __html: q.modelThesis }}
              />
            </div>

            <div>
              <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
                What the decoding is doing
              </p>
              <p className="text-sm leading-relaxed">{q.decodingNote}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => advance('got')} className="qf-self-mark" data-mark="got">
              ON TARGET →
            </button>
            <button onClick={() => advance('miss')} className="qf-self-mark" data-mark="miss">
              MISSED THE TARGET →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FocusPicker({
  options,
  selected,
  onPick,
}: {
  options: string[];
  selected: string | null;
  onPick: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
        Pick the precise focus word
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const picked = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onPick(opt)}
              className="text-left px-3 py-2 text-sm rounded-sm border transition"
              style={{
                borderColor: picked ? 'var(--qf-accent)' : 'var(--qf-rule)',
                background: picked ? 'var(--qf-decode)' : 'var(--qf-card)',
                color: picked ? 'var(--qf-decode-ink)' : 'inherit',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PairingPicker({
  pairings,
  picks,
  onToggle,
}: {
  pairings: Array<{ id: string; label: string }>;
  picks: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
        Pick the TWO pairings that illustrate it
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {pairings.map((p) => {
          const picked = picks.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className="text-left px-3 py-2 text-sm rounded-sm border transition"
              style={{
                borderColor: picked ? 'var(--qf-accent)' : 'var(--qf-rule)',
                background: picked ? 'var(--qf-decode)' : 'var(--qf-card)',
                color: picked ? 'var(--qf-decode-ink)' : 'inherit',
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
