/**
 * BuildStage — three pickers + reveal of the model paragraph.
 *
 * Picker categories vary by play:
 *   HAM: quote · critic · context
 *   MAL: quote · method · context
 *
 * Each category has 4 options, exactly one marked is_ideal in the DB.
 * After all three categories are picked, the model paragraph reveals
 * (with .match-highlighted spans) along with a checklist of what a
 * Level 5 answer should display.
 */

import { useMemo, useState } from 'react';
import type {
  BuildOptionType,
  Pairing,
  PlayCode,
} from '../../types/session';
import {
  buildSecondaryType,
  type BuildOption,
} from '../../types/session';
import type { BuildSelection } from '../../hooks/useSessionState';

interface Props {
  play: PlayCode;
  pairing: Pairing;
  selection: BuildSelection | undefined;
  onSelect: (field: keyof BuildSelection, value: string) => void;
  onContinue: () => void;
}

export function BuildStage({
  play,
  pairing,
  selection,
  onSelect,
  onContinue,
}: Props) {
  const secondaryType = buildSecondaryType(play);
  const sel = selection ?? {};
  const [revealed, setRevealed] = useState(false);

  // Partition options by type for clean pickers.
  const byType = useMemo(() => {
    const map: Record<BuildOptionType, BuildOption[]> = {
      quote: [], critic: [], method: [], context: [],
    };
    pairing.build.options.forEach((o) => map[o.option_type].push(o));
    return map;
  }, [pairing.build.options]);

  const allPicked = !!sel.quote && !!sel.secondary && !!sel.context;

  return (
    <div className="space-y-6">
      <header>
        <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-2">
          {pairing.eyebrow} · BUILD
        </p>
        <h2
          className="session-display text-2xl sm:text-3xl leading-tight"
          dangerouslySetInnerHTML={{ __html: pairing.build.question }}
        />
        <p
          className="mt-2 text-base opacity-90"
          dangerouslySetInnerHTML={{ __html: pairing.build.instruction }}
        />
      </header>

      <Picker
        title="Pick a quote"
        category="quote"
        options={byType.quote}
        selected={sel.quote}
        onPick={(key) => onSelect('quote', key)}
      />

      <Picker
        title={play === 'HAM' ? 'Pick a critic (AO5)' : 'Pick an AO2 method'}
        category={secondaryType}
        options={byType[secondaryType]}
        selected={sel.secondary}
        onPick={(key) => onSelect('secondary', key)}
      />

      <Picker
        title="Pick a context anchor (AO3)"
        category="context"
        options={byType.context}
        selected={sel.context}
        onPick={(key) => onSelect('context', key)}
      />

      {allPicked && !revealed && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={() => setRevealed(true)}
            className="session-display text-lg px-6 py-2 rounded-sm border-2 hover:bg-current/5 transition"
            style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
          >
            Reveal the paragraph →
          </button>
        </div>
      )}

      {allPicked && revealed && (
        <>
          <ChoiceSummary
            play={play}
            options={pairing.build.options}
            selection={sel}
          />
          <section className="p-5 bg-[color:var(--session-card)] border border-current/15 rounded-sm">
            <p className="session-mono text-[10px] tracking-widest opacity-70 mb-3 uppercase">
              Model Level-5 paragraph
            </p>
            <p
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pairing.build.model_paragraph }}
            />
          </section>
          <section className="p-5 border border-current/15 rounded-sm">
            <p className="session-mono text-[10px] tracking-widest opacity-70 mb-3 uppercase">
              What the answer is doing
            </p>
            <ul className="space-y-2">
              {pairing.build.checklist.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className="session-mono text-[10px] tracking-widest opacity-70 mt-1 shrink-0"
                    style={{ color: 'var(--session-accent)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </section>
          <div className="flex justify-end pt-2">
            <button
              onClick={onContinue}
              className="session-display text-lg px-6 py-2 rounded-sm border-2 hover:bg-current/5 transition"
              style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
            >
              Checkpoint →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Picker
// ──────────────────────────────────────────────────────────────────────────

function Picker({
  title,
  category: _category,
  options,
  selected,
  onPick,
}: {
  title: string;
  category: BuildOptionType;
  options: BuildOption[];
  selected: string | undefined;
  onPick: (key: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="session-mono text-[10px] tracking-widest opacity-70 uppercase mb-2">
        {title}
      </legend>
      <div className="grid gap-2">
        {options.map((opt) => {
          const isPicked = selected === opt.option_key;
          return (
            <button
              key={opt.id}
              onClick={() => onPick(opt.option_key)}
              className="drill-option p-3 rounded-sm text-sm sm:text-base"
              data-state={isPicked ? 'correct' : 'idle'}
              aria-pressed={isPicked}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Choice summary — shows whether each pick was the "ideal" one
// ──────────────────────────────────────────────────────────────────────────

function ChoiceSummary({
  play,
  options,
  selection,
}: {
  play: PlayCode;
  options: BuildOption[];
  selection: BuildSelection;
}) {
  const find = (type: BuildOptionType, key?: string) =>
    options.find((o) => o.option_type === type && o.option_key === key);

  const picks = [
    { label: 'QUOTE', pick: find('quote', selection.quote) },
    {
      label: play === 'HAM' ? 'CRITIC' : 'METHOD',
      pick: find(play === 'HAM' ? 'critic' : 'method', selection.secondary),
    },
    { label: 'CONTEXT', pick: find('context', selection.context) },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {picks.map(({ label, pick }) => {
        const ideal = pick?.is_ideal ?? false;
        return (
          <div
            key={label}
            className="p-3 rounded-sm border"
            style={{
              borderColor: ideal ? 'var(--session-accent)' : 'var(--session-rule)',
              background: ideal ? 'var(--session-match)' : 'transparent',
            }}
          >
            <p className="session-mono text-[9px] tracking-widest opacity-60 uppercase">
              {label} {ideal && '· ideal'}
            </p>
            <p className="text-xs mt-1 leading-snug">{pick?.label ?? '—'}</p>
          </div>
        );
      })}
    </section>
  );
}
