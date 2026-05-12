/**
 * QuickfirePage — /quickfire route
 *
 * Three quick-fire revision drills designed for ≤15-minute sessions:
 *   1. Quote Attribution Flash   (10 min)
 *   2. AO2 Method Priming         (8 min)
 *   3. Question Decoding          (15 min)
 *
 * Respects the existing PlayContext for HAM/MAL selection. If the context
 * is 'both', shows an inline play picker.
 */

import { useState } from 'react';
import { usePlay } from '../contexts/PlayContext';
import type { PlayCode } from '../types/session';

import { QuoteFlashDrill } from '../components/quickfire/QuoteFlashDrill';
import { MethodPrimeDrill } from '../components/quickfire/MethodPrimeDrill';
import { QuestionDecodeDrill } from '../components/quickfire/QuestionDecodeDrill';

import '../styles/quickfire.css';

type Mode = 'flash' | 'method' | 'decode';

const MODES: Array<{
  id: Mode;
  title: string;
  minutes: number;
  tagline: string;
  description: string;
}> = [
  {
    id: 'flash',
    title: 'Quote Attribution Flash',
    minutes: 10,
    tagline: 'Recognition → recall',
    description:
      'See a quote, recall the speaker, ref, method, and AO out loud. Reveal the answer. Self-mark. Ten quotes, twenty seconds each.',
  },
  {
    id: 'method',
    title: 'AO2 Method Priming',
    minutes: 8,
    tagline: 'Vocabulary fluency',
    description:
      'See a method name. Say a quote that uses it. Reveal the canonical example. Twelve methods, the entries you reach for under time pressure.',
  },
  {
    id: 'decode',
    title: 'Question Decoding',
    minutes: 15,
    tagline: 'Targeting the question',
    description:
      "Past Edexcel questions. Identify the focus word precisely, pick the two pairings that illustrate, see a model thesis. Sixty seconds each.",
  },
];

export default function QuickfirePage() {
  const { play } = usePlay();
  const [chosenPlay, setChosenPlay] = useState<PlayCode | null>(
    play === 'HAM' || play === 'MAL' ? play : null,
  );
  const [mode, setMode] = useState<Mode | null>(null);

  const effectivePlay: PlayCode | null =
    play === 'HAM' || play === 'MAL' ? play : chosenPlay;

  if (!effectivePlay) {
    return <PlayChooser onChoose={setChosenPlay} />;
  }

  if (mode === 'flash') {
    return (
      <Frame play={effectivePlay} onExit={() => setMode(null)}>
        <QuoteFlashDrill play={effectivePlay} onDone={() => setMode(null)} />
      </Frame>
    );
  }
  if (mode === 'method') {
    return (
      <Frame play={effectivePlay} onExit={() => setMode(null)}>
        <MethodPrimeDrill play={effectivePlay} onDone={() => setMode(null)} />
      </Frame>
    );
  }
  if (mode === 'decode') {
    return (
      <Frame play={effectivePlay} onExit={() => setMode(null)}>
        <QuestionDecodeDrill play={effectivePlay} onDone={() => setMode(null)} />
      </Frame>
    );
  }

  return <ModeChooser play={effectivePlay} onPick={setMode} />;
}

// ──────────────────────────────────────────────────────────────────────────
// Frame — minimal chrome around any active drill
// ──────────────────────────────────────────────────────────────────────────

function Frame({
  play,
  onExit,
  children,
}: {
  play: PlayCode;
  onExit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="quickfire-root">
      <header className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--qf-rule)' }}>
        <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase">
          QUICKFIRE · {play === 'HAM' ? 'Hamlet' : 'The Duchess of Malfi'}
        </p>
        <button
          onClick={onExit}
          className="qf-mono text-[10px] tracking-widest opacity-60 hover:opacity-100"
        >
          ← BACK
        </button>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// PlayChooser — only when PlayContext is 'both'
// ──────────────────────────────────────────────────────────────────────────

function PlayChooser({ onChoose }: { onChoose: (p: PlayCode) => void }) {
  return (
    <div className="quickfire-root min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <p className="qf-mono text-xs tracking-widest opacity-70 mb-3">QUICKFIRE · CHOOSE A PLAY</p>
        <h1 className="qf-display text-3xl mb-6">Last-minute drills</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => onChoose('HAM')} className="qf-mode-card" data-mode="flash">
            <p className="qf-mono text-[10px] tracking-widest opacity-70">SECTION A</p>
            <p className="qf-display text-2xl mt-2">Hamlet</p>
          </button>
          <button onClick={() => onChoose('MAL')} className="qf-mode-card" data-mode="method">
            <p className="qf-mono text-[10px] tracking-widest opacity-70">SECTION B</p>
            <p className="qf-display text-2xl mt-2">The Duchess of Malfi</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ModeChooser — three pastel cards
// ──────────────────────────────────────────────────────────────────────────

function ModeChooser({ play, onPick }: { play: PlayCode; onPick: (m: Mode) => void }) {
  return (
    <div className="quickfire-root">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <p className="qf-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-3">
            QUICKFIRE · {play === 'HAM' ? 'Hamlet' : 'The Duchess of Malfi'}
          </p>
          <h1 className="qf-display text-4xl sm:text-5xl leading-tight">
            Last-minute drills.<br />
            Active retrieval, not re-reading.
          </h1>
          <p className="mt-4 text-lg max-w-2xl">
            Three time-boxed drills designed for the night before, the morning of,
            or the hour after lunch. Each is built around <em>retrieval</em>: you
            try, you reveal, you self-mark, you move on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => onPick(m.id)}
              className="qf-mode-card"
              data-mode={m.id}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="qf-mono text-[10px] tracking-widest opacity-70 uppercase">
                  {m.minutes} min
                </span>
                <span className="qf-mono text-[10px] tracking-widest opacity-70 uppercase">
                  →
                </span>
              </div>
              <h2 className="qf-display text-2xl leading-tight mb-2">{m.title}</h2>
              <p className="qf-mono text-[10px] tracking-widest opacity-80 uppercase mb-3">
                {m.tagline}
              </p>
              <p className="text-sm leading-relaxed">{m.description}</p>
            </button>
          ))}
        </div>

        <p className="text-sm opacity-80 italic max-w-2xl">
          Note · these drills also work on paper with a kitchen timer. The app
          version is for convenience; the cognitive work is the same. Sleep
          matters more than another lap.
        </p>
      </div>
    </div>
  );
}
