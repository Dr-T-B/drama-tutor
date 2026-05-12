/**
 * SummaryStage — closes the session.
 * Shows drill correctness, build "ideal pick" rate, time taken,
 * and a print button that produces a re-drill handout.
 */

import { useMemo } from 'react';
import type {
  Pairing,
  PlayCode,
  BuildOptionType,
} from '../../types/session';
import { buildSecondaryType } from '../../types/session';
import type { UseSessionStateReturn } from '../../hooks/useSessionState';

interface Props {
  play: PlayCode;
  pairings: Pairing[];
  session: UseSessionStateReturn;
}

export function SummaryStage({ play, pairings, session }: Props) {
  const drillStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    pairings.forEach((p) =>
      p.drill_questions.forEach((q) => {
        const a = session.drillAnswers[q.id];
        if (a) {
          answered += 1;
          if (a.isCorrect) correct += 1;
        }
      }),
    );
    return { answered, correct, total: pairings.reduce((n, p) => n + p.drill_questions.length, 0) };
  }, [pairings, session.drillAnswers]);

  const buildStats = useMemo(() => {
    const secondary: BuildOptionType = buildSecondaryType(play);
    let totalIdeal = 0;
    let pickedIdeal = 0;
    pairings.forEach((p) => {
      const sel = session.buildSelections[p.id] ?? {};
      const findIdeal = (type: BuildOptionType) =>
        p.build.options.find((o) => o.option_type === type && o.is_ideal);
      const wasIdeal = (type: BuildOptionType, key?: string) =>
        !!key && p.build.options.some(
          (o) => o.option_type === type && o.option_key === key && o.is_ideal,
        );
      totalIdeal += [findIdeal('quote'), findIdeal(secondary), findIdeal('context')]
        .filter(Boolean).length;
      if (wasIdeal('quote', sel.quote)) pickedIdeal += 1;
      if (wasIdeal(secondary, sel.secondary)) pickedIdeal += 1;
      if (wasIdeal('context', sel.context)) pickedIdeal += 1;
    });
    return { pickedIdeal, totalIdeal };
  }, [pairings, play, session.buildSelections]);

  const elapsedMin = session.finishedAt
    ? Math.round((session.finishedAt - session.startedAt) / 60000)
    : Math.round((Date.now() - session.startedAt) / 60000);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8">
      <header>
        <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-3">
          SESSION COMPLETE
        </p>
        <h2 className="session-display text-4xl sm:text-5xl leading-tight">
          Three pairings worked through.<br />
          Take this into the exam.
        </h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat
          label="Drill accuracy"
          value={
            drillStats.answered
              ? `${drillStats.correct} / ${drillStats.answered}`
              : '—'
          }
          sub={
            drillStats.answered === drillStats.total
              ? 'All 15 attempted'
              : `${drillStats.total - drillStats.answered} skipped`
          }
        />
        <Stat
          label="Ideal build picks"
          value={`${buildStats.pickedIdeal} / ${buildStats.totalIdeal || 9}`}
          sub="Quote · critic/method · context"
        />
        <Stat
          label="Time taken"
          value={`${elapsedMin} min`}
          sub="Target: 90"
        />
      </div>

      <section className="space-y-3">
        <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase">
          Jump back to any stage
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {pairings.map((p, i) => {
            const baseStage = 1 + i * (1 + p.drill_questions.length + 3); // welcome + (orient + drills + pivot + build + checkpoint)
            return (
              <button
                key={p.id}
                onClick={() => session.goTo(baseStage)}
                className="text-left p-3 border border-current/15 rounded-sm hover:border-current/40 bg-[color:var(--session-card)]"
              >
                <p className="session-mono text-[10px] tracking-widest opacity-60 uppercase">
                  Pairing {i + 1}
                </p>
                <p className="session-display text-lg mt-1">{p.title}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className="session-display text-base px-5 py-2 rounded-sm border-2 hover:bg-current/5 transition"
          style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
        >
          Print re-drill handout
        </button>
        <button
          onClick={() => {
            if (window.confirm('Reset this session? Your progress will be cleared.')) {
              session.reset();
            }
          }}
          className="session-mono text-xs tracking-widest opacity-70 hover:opacity-100 underline underline-offset-4"
        >
          RESET SESSION
        </button>
      </section>

      {/* Re-drill handout, only visible when printing */}
      <PrintableHandout play={play} pairings={pairings} />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-4 bg-[color:var(--session-card)] border border-current/15 rounded-sm">
      <p className="session-mono text-[10px] tracking-widest opacity-70 uppercase">
        {label}
      </p>
      <p className="session-display text-3xl mt-1 tabular-nums">{value}</p>
      <p className="text-xs opacity-70 mt-1">{sub}</p>
    </div>
  );
}

function PrintableHandout({
  play,
  pairings,
}: {
  play: PlayCode;
  pairings: Pairing[];
}) {
  return (
    <div className="session-print hidden print:block p-6 text-black bg-white">
      <h1 className="text-3xl mb-1">
        Re-drill — {play === 'HAM' ? 'Hamlet' : 'The Duchess of Malfi'}
      </h1>
      <p className="text-xs mb-6">
        15 quotes · identify the method · annotate AOs
      </p>
      {pairings.map((p) => (
        <section key={p.id} className="mb-6">
          <h2 className="text-base font-bold border-b border-black pb-1 mb-3">
            {p.eyebrow}
          </h2>
          {p.drill_questions.map((q, i) => (
            <div key={q.id} className="mb-3 break-inside-avoid">
              <p className="text-xs text-gray-700">
                {i + 1}. {q.speaker} · {q.ref} · AO{q.aos.join('+AO')}
              </p>
              <p className="text-base italic">“{q.quote_text}”</p>
              <p className="text-xs">Method:&nbsp;______________________________</p>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
