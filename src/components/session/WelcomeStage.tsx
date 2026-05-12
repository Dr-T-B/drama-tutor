/**
 * WelcomeStage — first stage in the session.
 * Explains the 5-stage cycle, sets the target, previews the three pairings
 * as clickable pastel cards.
 *
 * Cards use the .pastel-card class which the stylesheet tints differently
 * for each :nth-child position. Same structure as v2; only the className
 * has changed.
 */

import type { Pairing, PlayCode } from '../../types/session';

interface Props {
  play: PlayCode;
  pairings: Pairing[];
  onStart: () => void;
  onJumpToPairing: (pairingIndex: number) => void;
}

const PLAY_NAME: Record<PlayCode, string> = {
  HAM: 'Hamlet',
  MAL: 'The Duchess of Malfi',
};

const SECTION_LABEL: Record<PlayCode, string> = {
  HAM: 'Edexcel Paper 1 · Section A · Drama',
  MAL: 'Edexcel Paper 1 · Section B · Drama',
};

export function WelcomeStage({ play, pairings, onStart, onJumpToPairing }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-3">
          {SECTION_LABEL[play]}
        </p>
        <h2 className="session-display text-4xl sm:text-5xl leading-tight">
          90 minutes.<br />
          Three pairings.<br />
          One exam-ready habit.
        </h2>
      </div>

      <p className="text-lg leading-relaxed max-w-2xl">
        You will work through <em>three character pairings</em> from{' '}
        <em>{PLAY_NAME[play]}</em>. Each pairing follows the same five-stage
        cycle — designed to mirror exactly what a Level 4–5 paragraph asks of
        you in the exam.
      </p>

      <section>
        <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase mb-3">
          The cycle
        </p>
        <CycleDiagram />
      </section>

      <section>
        <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase mb-3">
          What's ahead · jump in anywhere
        </p>
        <div className="pastel-card-grid grid grid-cols-1 md:grid-cols-3 gap-3">
          {pairings.map((p, i) => (
            <PairingCard
              key={p.id}
              pairing={p}
              order={i + 1}
              onJump={() => onJumpToPairing(i)}
            />
          ))}
        </div>
      </section>

      <p className="text-base leading-relaxed max-w-2xl">
        Aim for <strong>thirty minutes per pairing</strong>. The timer in the
        header has start, pause, and reset controls, and you can change the
        target duration via the gear icon. Your progress is saved automatically
        between visits.
      </p>

      <button
        onClick={onStart}
        className="session-display text-xl px-8 py-3 rounded-sm border-2 hover:bg-current/5 transition"
        style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
      >
        Begin from pairing 1 →
      </button>
    </div>
  );
}

function PairingCard({
  pairing,
  order,
  onJump,
}: {
  pairing: Pairing;
  order: number;
  onJump: () => void;
}) {
  const drillCount = pairing.drill_questions.length;
  return (
    <button
      onClick={onJump}
      className="pastel-card text-left p-5 rounded-sm transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="session-mono text-[10px] tracking-widest opacity-60 uppercase">
          Pairing {order}
        </span>
        <span
          className="session-mono text-[10px] tracking-widest opacity-0 group-hover:opacity-90 transition-opacity"
          style={{ color: 'var(--session-accent)' }}
        >
          JUMP IN →
        </span>
      </div>

      <p className="session-mono text-[10px] tracking-[0.16em] opacity-70 uppercase mb-2">
        {pairing.eyebrow.replace(/^PAIRING [IVX]+ · /, '')}
      </p>

      <h3
        className="session-display text-2xl leading-tight mb-3"
        dangerouslySetInnerHTML={{ __html: pairing.title }}
      />

      <p
        className="text-sm leading-snug opacity-85 mb-4"
        dangerouslySetInnerHTML={{ __html: pairing.tagline }}
      />

      <div className="pt-3 border-t border-current/10 flex gap-3 flex-wrap">
        <Stat label="DRILLS" value={drillCount} />
        <Stat label="PIVOT" value={1} />
        <Stat label="BUILD" value={1} />
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-baseline gap-1 session-mono text-[10px] tracking-widest opacity-70">
      <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--session-accent)' }}>
        {value}
      </span>
      <span>{label}</span>
    </span>
  );
}

function CycleDiagram() {
  const stages = [
    { label: 'ORIENT', sub: 'Pairing diagram + character cards' },
    { label: 'DRILL', sub: '5 quotes · identify the method' },
    { label: 'PIVOT', sub: 'Two readings · build the dialectic' },
    { label: 'BUILD', sub: 'Compose a Level-5 paragraph' },
    { label: 'CHECKPOINT', sub: 'What you can take into the exam' },
  ];
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-5 gap-px border border-current/15 bg-current/15">
      {stages.map((s, i) => (
        <li key={s.label} className="bg-[color:var(--session-card)] px-3 py-4">
          <span className="session-mono text-[9px] tracking-widest opacity-60 block">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="session-mono text-xs font-bold tracking-widest block mt-1">
            {s.label}
          </span>
          <span className="text-xs leading-snug opacity-80 block mt-2">
            {s.sub}
          </span>
        </li>
      ))}
    </ol>
  );
}
