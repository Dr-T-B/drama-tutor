/**
 * SessionPage — /session route
 *
 * v3 change: Welcome's onStart now calls session.timerStart() before
 * session.next(). Default timer state is idle on fresh sessions, so the
 * Begin button is the natural place to kick the timer off.
 */

import { useMemo, useState } from 'react';
import { usePlay } from '../contexts/PlayContext';
import { useRevisionSession } from '../hooks/useRevisionSession';
import { useSessionState } from '../hooks/useSessionState';
import type { PlayCode } from '../types/session';

import { SessionShell } from '../components/session/SessionShell';
import { WelcomeStage } from '../components/session/WelcomeStage';
import { OrientStage } from '../components/session/OrientStage';
import { DrillStage } from '../components/session/DrillStage';
import { PivotStage } from '../components/session/PivotStage';
import { BuildStage } from '../components/session/BuildStage';
import { CheckpointStage } from '../components/session/CheckpointStage';
import { SummaryStage } from '../components/session/SummaryStage';

import '../styles/session.css';

export default function SessionPage() {
  const { play: currentPlay } = usePlay();

  const [chosenPlay, setChosenPlay] = useState<PlayCode | null>(
    currentPlay === 'HAM' || currentPlay === 'MAL' ? currentPlay : null,
  );

  const effectivePlay: PlayCode | null =
    currentPlay === 'HAM' || currentPlay === 'MAL'
      ? currentPlay
      : chosenPlay;

  if (!effectivePlay) {
    return <SessionChooser onChoose={setChosenPlay} />;
  }

  return <SessionRunner play={effectivePlay} />;
}

function SessionChooser({ onChoose }: { onChoose: (p: PlayCode) => void }) {
  return (
    <div className="session-root min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <p className="session-mono text-xs tracking-widest opacity-70 mb-3">
          REVISION SESSION · CHOOSE A PLAY
        </p>
        <h1 className="session-display text-3xl mb-6">
          90-minute focused revision
        </h1>
        <p className="mb-8 text-lg leading-relaxed">
          Three character pairings · five-stage cycle · drill, pivot, build.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onChoose('HAM')}
            className="session-display text-left p-6 rounded-sm border border-current/20 hover:border-current/60 transition"
          >
            <span className="session-mono text-[10px] tracking-widest block mb-2 opacity-70">
              SECTION A · AO1+2+3+5
            </span>
            <span className="text-2xl">Hamlet</span>
          </button>
          <button
            onClick={() => onChoose('MAL')}
            className="session-display text-left p-6 rounded-sm border border-current/20 hover:border-current/60 transition"
            data-play="MAL"
          >
            <span className="session-mono text-[10px] tracking-widest block mb-2 opacity-70">
              SECTION B · AO1+2+3
            </span>
            <span className="text-2xl">The Duchess of Malfi</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionRunner({ play }: { play: PlayCode }) {
  const query = useRevisionSession(play);
  const session = useSessionState(play, query.data);

  const orientIndices = useMemo<number[]>(() => {
    if (!query.data) return [];
    let cursor = 1;
    return query.data.map((p) => {
      const start = cursor;
      cursor += 1 + p.drill_questions.length + 3;
      return start;
    });
  }, [query.data]);

  // Welcome's Begin → start timer + advance stage in one click.
  const beginSession = () => {
    if (session.timer.state === 'idle') session.timerStart();
    session.next();
  };

  const jumpToPairing = (i: number) => {
    if (session.timer.state === 'idle') session.timerStart();
    session.goTo(orientIndices[i]);
  };

  if (query.isLoading) {
    return (
      <div className="session-root min-h-screen flex items-center justify-center" data-play={play}>
        <p className="session-mono text-xs tracking-widest opacity-70">
          LOADING SESSION…
        </p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="session-root min-h-screen flex items-center justify-center p-6" data-play={play}>
        <div className="max-w-md">
          <p className="session-mono text-xs tracking-widest mb-3 text-red-700">
            COULD NOT LOAD SESSION
          </p>
          <p className="mb-4">
            {(query.error as Error)?.message ?? 'Unknown error.'}
          </p>
          <button
            onClick={() => query.refetch()}
            className="session-mono text-xs tracking-widest underline"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const { stage } = session;
  const pairings = query.data ?? [];

  return (
    <div className="session-root min-h-screen" data-play={play}>
      <SessionShell play={play} session={session}>
        {stage.kind === 'welcome' && (
          <WelcomeStage
            play={play}
            pairings={pairings}
            onStart={beginSession}
            onJumpToPairing={jumpToPairing}
          />
        )}
        {stage.kind === 'orient' && (
          <OrientStage
            play={play}
            pairing={stage.pairing}
            onContinue={session.next}
          />
        )}
        {stage.kind === 'drill' && (
          <DrillStage
            play={play}
            pairing={stage.pairing}
            question={stage.pairing.drill_questions[stage.questionIndex]}
            questionIndex={stage.questionIndex}
            existingAnswer={
              session.drillAnswers[
                stage.pairing.drill_questions[stage.questionIndex].id
              ]
            }
            onAnswer={session.recordDrillAnswer}
            onContinue={session.next}
          />
        )}
        {stage.kind === 'pivot' && (
          <PivotStage
            play={play}
            pairing={stage.pairing}
            onContinue={session.next}
          />
        )}
        {stage.kind === 'build' && (
          <BuildStage
            play={play}
            pairing={stage.pairing}
            selection={session.buildSelections[stage.pairing.id]}
            onSelect={(field, value) =>
              session.setBuildSelection(stage.pairing.id, field, value)
            }
            onContinue={session.next}
          />
        )}
        {stage.kind === 'checkpoint' && (
          <CheckpointStage
            play={play}
            pairing={stage.pairing}
            pairingIndex={stage.pairingIndex}
            isLast={stage.pairingIndex === pairings.length - 1}
            onContinue={session.next}
          />
        )}
        {stage.kind === 'summary' && (
          <SummaryStage
            play={play}
            pairings={pairings}
            session={session}
          />
        )}
      </SessionShell>
    </div>
  );
}
