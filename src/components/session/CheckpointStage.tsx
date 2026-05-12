/**
 * CheckpointStage — a brief pause between pairings.
 * Restates the dramatic function of the pair and gives Neha a beat.
 */

import type { Pairing, PlayCode } from '../../types/session';

interface Props {
  play: PlayCode;
  pairing: Pairing;
  pairingIndex: number;
  isLast: boolean;
  onContinue: () => void;
}

export function CheckpointStage({
  play: _play,
  pairing,
  pairingIndex,
  isLast,
  onContinue,
}: Props) {
  return (
    <div className="space-y-6 max-w-2xl">
      <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
        {pairing.eyebrow} · CHECKPOINT
      </p>
      <h2 className="session-display text-3xl sm:text-4xl leading-tight">
        Pairing {pairingIndex + 1} complete.
      </h2>

      <div className="p-5 bg-[color:var(--session-card)] border border-current/15 rounded-sm space-y-3">
        <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase">
          What you can take into the exam
        </p>
        <ul className="space-y-2 text-sm">
          {pairing.characters.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span
                className="session-mono text-[10px] tracking-widest mt-1 shrink-0"
                style={{ color: 'var(--session-accent)' }}
              >
                {c.name.split(/[\s(]/)[0].toUpperCase()}
              </span>
              <span
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.key_argument }}
              />
            </li>
          ))}
        </ul>
      </div>

      <p className="text-base opacity-90">
        {isLast
          ? 'Three pairings down. Move to the summary to print a re-drill handout or revisit any stage.'
          : 'Stretch. Drink water. Move to the next pairing when ready.'}
      </p>

      <div className="flex justify-end pt-2">
        <button
          onClick={onContinue}
          className="session-display text-lg px-6 py-2 rounded-sm border-2 hover:bg-current/5 transition"
          style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
        >
          {isLast ? 'Summary →' : 'Next pairing →'}
        </button>
      </div>
    </div>
  );
}
