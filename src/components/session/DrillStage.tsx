/**
 * DrillStage — single quote drill with 4 options.
 *
 * After answering, all options stay visible: the correct one highlights,
 * the chosen-wrong one shows strikethrough, the others fade. The annotation
 * reveals beneath. "Continue" advances to the next stage (which may be the
 * next drill question or the pivot, depending on questionIndex).
 */

import { useState } from 'react';
import type {
  DrillQuestion,
  Pairing,
  PlayCode,
} from '../../types/session';
import type { DrillAnswer } from '../../hooks/useSessionState';

interface Props {
  play: PlayCode;
  pairing: Pairing;
  question: DrillQuestion;
  questionIndex: number;
  existingAnswer: DrillAnswer | undefined;
  onAnswer: (
    questionId: string,
    selectedOptionOrder: number,
    isCorrect: boolean,
  ) => void;
  onContinue: () => void;
}

export function DrillStage({
  play: _play,
  pairing,
  question,
  questionIndex,
  existingAnswer,
  onAnswer,
  onContinue,
}: Props) {
  // Track local selection — preferring any existing answer.
  const [selected, setSelected] = useState<number | null>(
    existingAnswer?.selectedOptionOrder ?? null,
  );

  const handleSelect = (optionOrder: number, isCorrect: boolean) => {
    if (selected !== null) return;     // already answered
    setSelected(optionOrder);
    onAnswer(question.id, optionOrder, isCorrect);
  };

  const answered = selected !== null;

  return (
    <div className="space-y-6">
      <header>
        <p className="session-mono text-[10px] tracking-[0.18em] opacity-70 uppercase mb-2">
          {pairing.eyebrow} · DRILL {questionIndex + 1} OF{' '}
          {pairing.drill_questions.length}
        </p>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {question.aos.map((ao) => (
            <span
              key={ao}
              className="session-mono text-[10px] tracking-wider px-1.5 py-0.5 border border-current/30"
            >
              AO{ao}
            </span>
          ))}
        </div>
      </header>

      <blockquote
        className="session-display text-2xl sm:text-3xl leading-snug border-l-2 pl-5 py-2"
        style={{ borderColor: 'var(--session-accent)' }}
      >
        “{question.quote_text}”
      </blockquote>
      <p className="session-mono text-[10px] tracking-widest opacity-60 -mt-3">
        {question.speaker.toUpperCase()} · {question.ref}
      </p>

      <p className="text-base font-medium pt-2">{question.question_text}</p>

      <div className="grid gap-2">
        {question.options.map((opt) => {
          const isThis = selected === opt.option_order;
          let state: 'idle' | 'correct' | 'incorrect' | 'selected-wrong' = 'idle';
          if (answered) {
            if (opt.is_correct) state = 'correct';
            else if (isThis) state = 'selected-wrong';
            else state = 'incorrect';
          }
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.option_order, opt.is_correct)}
              disabled={answered}
              data-state={state}
              className="drill-option p-3 rounded-sm text-sm sm:text-base"
            >
              <span className="session-mono text-[10px] tracking-widest opacity-50 mr-2">
                {String.fromCharCode(64 + opt.option_order)}
              </span>
              {opt.option_text}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 p-4 rounded-sm border border-current/15 bg-[color:var(--session-bg-deep)]">
          <p className="session-mono text-[10px] tracking-widest opacity-70 mb-2 uppercase">
            Annotation
          </p>
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.annotation }}
          />
        </div>
      )}

      {answered && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onContinue}
            className="session-display text-lg px-6 py-2 rounded-sm border-2 hover:bg-current/5 transition"
            style={{ borderColor: 'var(--session-accent)', color: 'var(--session-accent)' }}
          >
            {questionIndex < pairing.drill_questions.length - 1
              ? 'Next drill →'
              : 'To the pivot →'}
          </button>
        </div>
      )}
    </div>
  );
}
