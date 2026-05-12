/**
 * PivotStage — discriminated by pairing.pivot.mode.
 *
 *   critic_dialectic  (HAM): two named critics, two positions, AO5 weave
 *   interpretive      (MAL): anchor quote, two text-grounded readings, no AO5
 *
 * Both modes reveal a model dialectical sentence + "why this works"
 * commentary after a deliberate hold.
 */

import { useState } from 'react';
import type { Pairing, PlayCode } from '../../types/session';

interface Props {
  play: PlayCode;
  pairing: Pairing;
  onContinue: () => void;
}

export function PivotStage({ play, pairing, onContinue }: Props) {
  const { pivot } = pairing;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-6">
      <header>
        <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-2">
          {pairing.eyebrow} · PIVOT ·{' '}
          {pivot.mode === 'critic_dialectic' ? 'CRITIC DIALECTIC' : 'INTERPRETIVE PIVOT'}
        </p>
        <h2 className="session-display text-2xl sm:text-3xl">
          Hold two readings in tension.
        </h2>
      </header>

      {pivot.mode === 'interpretive' && (
        <figure className="border-l-2 pl-5 py-2" style={{ borderColor: 'var(--session-accent)' }}>
          <blockquote className="session-display text-2xl leading-snug">
            “{pivot.anchor_quote}”
          </blockquote>
          <figcaption className="session-mono text-[10px] tracking-widest opacity-60 mt-2">
            {pivot.anchor_ref.toUpperCase()}
          </figcaption>
        </figure>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReadingCard
          name={pivot.reading_a_name}
          tag={pivot.reading_a_tag}
          position={pivot.reading_a_position}
          year={pivot.mode === 'critic_dialectic' ? pivot.reading_a_year : null}
        />
        <ReadingCard
          name={pivot.reading_b_name}
          tag={pivot.reading_b_tag}
          position={pivot.reading_b_position}
          year={pivot.mode === 'critic_dialectic' ? pivot.reading_b_year : null}
        />
      </div>

      <div className="mt-6 p-5 bg-[color:var(--session-card)] border border-current/15 rounded-sm">
        <p
          className="text-base mb-4"
          dangerouslySetInnerHTML={{ __html: pivot.prompt }}
        />

        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="session-mono text-xs tracking-widest opacity-80 hover:opacity-100 underline underline-offset-4"
          >
            REVEAL MODEL SENTENCE
          </button>
        )}

        {revealed && (
          <div className="space-y-4 mt-3">
            <div>
              <p className="session-mono text-[10px] tracking-widest opacity-70 mb-2 uppercase">
                Model dialectical sentence
              </p>
              <p
                className="text-base leading-relaxed border-l-2 pl-4 italic"
                style={{ borderColor: 'var(--session-accent)' }}
                dangerouslySetInnerHTML={{ __html: pivot.model_sentence }}
              />
            </div>
            <div>
              <p className="session-mono text-[10px] tracking-widest opacity-70 mb-2 uppercase">
                Why this works
              </p>
              <p
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: pivot.model_why }}
              />
            </div>
            {play === 'MAL' && (
              <p className="session-mono text-[10px] tracking-widest opacity-60 pt-3 border-t border-current/10">
                NOTE · SECTION B IS AO1+2+3 ONLY. NO CRITIC WEAVE-IN REQUIRED.
              </p>
            )}
          </div>
        )}
      </div>

      {revealed && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onContinue}
            className="session-display text-lg px-6 py-2 rounded-sm border-2 hover:bg-current/5 transition"
            style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
          >
            Build the paragraph →
          </button>
        </div>
      )}
    </div>
  );
}

function ReadingCard({
  name,
  tag,
  position,
  year,
}: {
  name: string;
  tag: string | null;
  position: string;
  year: string | null;
}) {
  return (
    <article className="p-5 bg-[color:var(--session-card)] border border-current/15 rounded-sm">
      <p className="session-display text-xl">{name}</p>
      {(tag || year) && (
        <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase mt-1">
          {[year, tag].filter(Boolean).join(' · ')}
        </p>
      )}
      <p
        className="text-sm leading-relaxed mt-3"
        dangerouslySetInnerHTML={{ __html: position }}
      />
    </article>
  );
}
