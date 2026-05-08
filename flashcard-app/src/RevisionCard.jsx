import { useState } from 'react';

const sampleCard = {
  id: 'ham-3-3-caesura',
  ao_tag: 'AO2',
  card_type: 'Quote',
  context: 'Hamlet 3.3',
  cue: '"And now I\'ll do\'t —"',
  question: 'What does the caesura enact here, and how does form mirror content?',
  reveal:
    'The caesura in "And now I\'ll do\'t —" (3.3) enacts the physical arrest of the killing blow in the syntax itself [AO2], so that Shakespeare\'s punctuation performs the delay that the speech\'s content rationalises, fusing form and theme at the level of the individual line.',
};

const ratings = [
  { label: 'Again', hint: '< 1 min',  bg: 'bg-red-100',    text: 'text-red-700'    },
  { label: 'Hard',  hint: '~ 6 min',  bg: 'bg-orange-100', text: 'text-orange-700' },
  { label: 'Good',  hint: '~ 10 min', bg: 'bg-blue-100',   text: 'text-blue-700'   },
  { label: 'Easy',  hint: '~ 4 days', bg: 'bg-green-100',  text: 'text-green-700'  },
];

export default function RevisionCard() {
  const [revealed, setRevealed] = useState(false);
  const [lastRating, setLastRating] = useState(null);

  const handleRate = (label) => {
    setLastRating(label);
    setTimeout(() => {
      setRevealed(false);
      setLastRating(null);
    }, 600);
  };

  const card = sampleCard;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Revision</h1>
            <p className="mt-1 text-sm text-slate-500">Card 1 of 216 · Hamlet</p>
          </div>
          <div className="rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
            215 to go
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              {card.ao_tag}
            </span>
            <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200">
              {card.card_type} · {card.context}
            </span>
          </div>

          <p className="text-2xl font-serif text-white leading-relaxed">
            {card.cue}
          </p>

          <p className="mt-4 text-base italic text-slate-400 leading-relaxed">
            {card.question}
          </p>

          {revealed && (
            <div className="mt-6 border-t border-slate-700 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Model analysis
              </p>
              <p className="mt-3 text-base text-slate-100 leading-relaxed">
                {card.reveal}
              </p>
            </div>
          )}

          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="mt-8 w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 active:scale-[0.99]"
            >
              Show analysis · <span className="text-slate-500 font-normal">space</span>
            </button>
          )}
        </div>

        {revealed && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {ratings.map((r) => (
              <button
                key={r.label}
                onClick={() => handleRate(r.label)}
                className={`group rounded-xl ${r.bg} px-3 py-3 transition hover:brightness-95 active:scale-[0.98] ${
                  lastRating === r.label ? 'ring-2 ring-slate-900' : ''
                }`}
              >
                <div className={`text-base font-semibold ${r.text}`}>{r.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">{r.hint}</div>
              </button>
            ))}
          </div>
        )}

        {!revealed && (
          <p className="mt-6 text-center text-xs text-slate-400">
            Try to recall the analysis in your head before revealing it.
          </p>
        )}
      </div>
    </div>
  );
}