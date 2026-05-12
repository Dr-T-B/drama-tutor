/**
 * QuoteFlashDrill — Drill #1
 *
 * Cycle (per quote):
 *   1. Quote shown alone
 *   2. User recalls aloud: speaker, ref, method, AO (mental rehearsal)
 *   3. User clicks REVEAL → speaker/ref/annotation panel shows
 *   4. User self-marks GOT IT or MISSED → next
 *
 * Ten quotes per run, drawn at random from the play's revision_drill_questions.
 * Final screen: score + retry option.
 */

import { useState } from 'react';
import { useQuickfireQuotes } from '../../hooks/useQuickfireQuotes';
import type { PlayCode } from '../../types/session';

interface Props {
  play: PlayCode;
  onDone: () => void;
}

const ROUND_SIZE = 10;

export function QuoteFlashDrill({ play, onDone }: Props) {
  const { quotes, isLoading, isError, error } = useQuickfireQuotes(play, ROUND_SIZE);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [marks, setMarks] = useState<Record<string, 'got' | 'miss'>>({});

  if (isLoading) {
    return <p className="qf-mono text-xs tracking-widest opacity-70">LOADING QUOTES…</p>;
  }
  if (isError || quotes.length === 0) {
    return (
      <div>
        <p className="qf-mono text-xs tracking-widest text-red-700 mb-3">
          COULD NOT LOAD QUOTES
        </p>
        <p>{(error as Error)?.message ?? 'No quotes available.'}</p>
      </div>
    );
  }

  const total = quotes.length;
  const done = index >= total;

  if (done) {
    const got = Object.values(marks).filter((m) => m === 'got').length;
    const miss = total - got;
    return (
      <div className="space-y-6">
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
          DRILL COMPLETE
        </p>
        <h2 className="qf-display text-4xl">{got} / {total} attributed.</h2>
        <p className="text-lg max-w-xl">
          {got === total
            ? 'Every quote in twenty seconds or less — that\'s the fluency the exam rewards.'
            : miss <= 2
            ? "Strong run. The few you missed are the ones to review tonight."
            : 'A useful diagnostic. The misses tell you where attention is needed.'}
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => { setIndex(0); setRevealed(false); setMarks({}); }}
            className="qf-display text-base px-5 py-2 rounded-sm border-2"
            style={{ borderColor: 'var(--qf-accent)', color: 'var(--qf-accent)' }}
          >
            Another ten →
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

  const q = quotes[index];

  const advance = (mark: 'got' | 'miss') => {
    setMarks((m) => ({ ...m, [q.id]: mark }));
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
          QUOTE FLASH · {index + 1} / {total}
        </p>
        <div className="qf-progress-dots">
          {Array.from({ length: total }).map((_, i) => {
            let state: string = 'pending';
            if (i < index) state = marks[quotes[i].id] ?? 'pending';
            else if (i === index) state = 'current';
            return <span key={i} className="qf-progress-dot" data-state={state} />;
          })}
        </div>
      </div>

      <blockquote
        className="qf-display text-3xl sm:text-4xl leading-snug border-l-2 pl-5 py-3"
        style={{ borderColor: 'var(--qf-accent)' }}
      >
        “{q.quote_text}”
      </blockquote>

      {!revealed && (
        <div className="space-y-4">
          <p className="text-base">
            <strong>Aloud:</strong> name the speaker · the addressee · the act/scene · the
            dramatic moment · one method · one AO.
          </p>
          <button
            onClick={() => setRevealed(true)}
            className="qf-display text-lg px-6 py-2 rounded-sm border-2"
            style={{ borderColor: 'var(--qf-accent)', color: 'var(--qf-accent)' }}
          >
            Reveal →
          </button>
        </div>
      )}

      {revealed && (
        <>
          <div className="qf-reveal">
            <p className="qf-mono text-[10px] tracking-widest opacity-70 uppercase mb-3">
              Attribution
            </p>
            <p className="qf-mono text-xs mb-2">
              <strong>{q.speaker}</strong> · {q.ref} · AO{q.aos.join('+AO')}
            </p>
            <p
              className="text-sm leading-relaxed mt-3 pt-3 border-t"
              style={{ borderColor: 'var(--qf-rule)' }}
              dangerouslySetInnerHTML={{ __html: q.annotation }}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => advance('got')}
              className="qf-self-mark"
              data-mark="got"
            >
              GOT IT →
            </button>
            <button
              onClick={() => advance('miss')}
              className="qf-self-mark"
              data-mark="miss"
            >
              MISSED →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
