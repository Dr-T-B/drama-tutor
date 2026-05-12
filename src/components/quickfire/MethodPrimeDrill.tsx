/**
 * MethodPrimeDrill — Drill #2
 *
 * Cycle (per method):
 *   1. Method name + definition shown
 *   2. User says a quote that uses it (out loud, in their head)
 *   3. REVEAL → canonical example quote(s) appear
 *   4. Self-mark → next
 *
 * Filters methods by play (HAM/MAL) where one is more central; otherwise
 * shows all. Twelve methods per run by default.
 */

import { useMemo, useState } from 'react';
import type { PlayCode } from '../../types/session';
import { AO2_METHODS, type MethodCard } from '../../data/quickfireContent';

interface Props {
  play: PlayCode;
  onDone: () => void;
}

const ROUND_SIZE = 12;

export function MethodPrimeDrill({ play, onDone }: Props) {
  // Prefer methods whose examples include the chosen play, but allow any if
  // we don't have enough — methods are useful across both texts anyway.
  const methods = useMemo<MethodCard[]>(() => {
    const preferred = AO2_METHODS.filter((m) =>
      m.examples.some((e) => e.play === play),
    );
    const rest = AO2_METHODS.filter(
      (m) => !m.examples.some((e) => e.play === play),
    );
    return [...preferred, ...rest].slice(0, ROUND_SIZE);
  }, [play]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [marks, setMarks] = useState<Record<string, 'got' | 'miss'>>({});

  const total = methods.length;
  const done = index >= total;

  if (done) {
    const got = Object.values(marks).filter((m) => m === 'got').length;
    return (
      <div className="space-y-6">
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">DRILL COMPLETE</p>
        <h2 className="qf-display text-4xl">{got} / {total} primed.</h2>
        <p className="text-lg max-w-xl">
          {got >= total - 1
            ? 'Method vocabulary is fluent — these terms will land naturally in tomorrow\'s paragraphs.'
            : 'Useful run. The methods you missed are the ones worth saying aloud a few times before bed.'}
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => { setIndex(0); setRevealed(false); setMarks({}); }}
            className="qf-display text-base px-5 py-2 rounded-sm border-2"
            style={{ borderColor: 'var(--qf-accent)', color: 'var(--qf-accent)' }}
          >
            Another round →
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

  const m = methods[index];

  const advance = (mark: 'got' | 'miss') => {
    setMarks((prev) => ({ ...prev, [m.method]: mark }));
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
          METHOD PRIMING · {index + 1} / {total}
        </p>
        <div className="qf-progress-dots">
          {Array.from({ length: total }).map((_, i) => {
            let state: string = 'pending';
            if (i < index) state = marks[methods[i].method] ?? 'pending';
            else if (i === index) state = 'current';
            return <span key={i} className="qf-progress-dot" data-state={state} />;
          })}
        </div>
      </div>

      <div>
        <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-3">
          The method
        </p>
        <h2 className="qf-display text-4xl leading-tight mb-3">{m.method}</h2>
        <p className="text-base leading-relaxed opacity-90">{m.definition}</p>
      </div>

      {!revealed && (
        <div className="space-y-3">
          <p className="text-base">
            <strong>Aloud:</strong> name a line from {' '}
            {m.examples.some((e) => e.play === 'HAM') && m.examples.some((e) => e.play === 'MAL')
              ? 'either play'
              : m.examples[0].play === 'HAM'
              ? 'Hamlet'
              : 'The Duchess of Malfi'}{' '}
            that uses this method.
          </p>
          <button
            onClick={() => setRevealed(true)}
            className="qf-display text-lg px-6 py-2 rounded-sm border-2"
            style={{ borderColor: 'var(--qf-accent)', color: 'var(--qf-accent)' }}
          >
            Reveal example →
          </button>
        </div>
      )}

      {revealed && (
        <>
          <div className="qf-reveal space-y-3">
            <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase">
              Canonical example{m.examples.length > 1 ? 's' : ''}
            </p>
            {m.examples.map((ex, i) => (
              <div key={i} className="border-l-2 pl-4 py-1" style={{ borderColor: 'var(--qf-accent)' }}>
                <p className="qf-display text-xl leading-snug">“{ex.quote}”</p>
                <p className="qf-mono text-[10px] tracking-widest opacity-70 mt-1 uppercase">
                  {ex.source}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => advance('got')} className="qf-self-mark" data-mark="got">
              HAD IT →
            </button>
            <button onClick={() => advance('miss')} className="qf-self-mark" data-mark="miss">
              MISSED →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
