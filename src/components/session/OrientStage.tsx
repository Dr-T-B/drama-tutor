/**
 * OrientStage — opens a pairing.
 * Renders the inline SVG diagram from Supabase + two character cards.
 *
 * SECURITY NOTE: diagram_svg is rendered via dangerouslySetInnerHTML.
 * The content is admin-authored and sanitised at insert time; Neha (the
 * student user) has read-only access. Do not relax RLS for these tables.
 */

import type { Pairing, PlayCode } from '../../types/session';

interface Props {
  play: PlayCode;
  pairing: Pairing;
  onContinue: () => void;
}

export function OrientStage({ play: _play, pairing, onContinue }: Props) {
  return (
    <div className="space-y-8">
      <header>
        <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-2">
          {pairing.eyebrow}
        </p>
        <h2
          className="session-display text-3xl sm:text-4xl leading-tight"
          dangerouslySetInnerHTML={{ __html: pairing.title }}
        />
        <p
          className="mt-3 text-lg italic max-w-2xl"
          dangerouslySetInnerHTML={{ __html: pairing.tagline }}
        />
      </header>

      <figure className="session-diagram">
        <div dangerouslySetInnerHTML={{ __html: pairing.diagram_svg }} />
        <figcaption className="session-mono text-[10px] tracking-widest opacity-60 mt-3 px-1">
          {pairing.diagram_caption}
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pairing.characters.map((c) => (
          <article
            key={c.id}
            className="p-5 bg-[color:var(--session-card)] border border-current/15 rounded-sm"
          >
            <header className="mb-3 pb-3 border-b border-current/10">
              <h3 className="session-display text-2xl">{c.name}</h3>
              <p className="session-mono text-[10px] tracking-widest opacity-70 mt-1 uppercase">
                {c.role}
              </p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {c.aos.map((ao) => (
                  <span
                    key={ao}
                    className="session-mono text-[10px] tracking-wider px-1.5 py-0.5 border border-current/30"
                  >
                    AO{ao}
                  </span>
                ))}
              </div>
            </header>
            <p className="session-mono text-[10px] tracking-widest opacity-60 uppercase mb-1">
              Dramatic function
            </p>
            <p
              className="text-sm mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: c.dramatic_function }}
            />
            <p className="session-mono text-[10px] tracking-widest opacity-60 uppercase mb-1">
              Key critical argument
            </p>
            <p
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: c.key_argument }}
            />
          </article>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onContinue}
          className="session-display text-lg px-6 py-2 rounded-sm border-2 hover:bg-current/5 transition"
          style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
        >
          Begin drill →
        </button>
      </div>
    </div>
  );
}
