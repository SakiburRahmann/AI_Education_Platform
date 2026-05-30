"use client";

import { useState } from "react";
import type { MultipleChoiceData } from "@/types/interactive";

type Props = MultipleChoiceData & {
  onComplete?: (correct: boolean) => void;
};

export function MultipleChoice({ question, options, correctIndex, explanation, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    onComplete?.(i === correctIndex);
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-3 text-sm font-medium">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let stateClass = "answer-card";
          if (revealed && i === correctIndex) stateClass += " correct";
          else if (revealed && i === selected && i !== correctIndex) stateClass += " wrong";
          else if (selected === i) stateClass += " selected";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`${stateClass} flex w-full items-center gap-3 rounded-lg border px-4 py-4 text-left text-sm transition-all`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {revealed && explanation && (
        <p className="mt-3 text-xs text-muted-foreground">{explanation}</p>
      )}
    </div>
  );
}
