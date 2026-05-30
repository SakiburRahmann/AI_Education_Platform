"use client";

import { useState } from "react";
import type { TrueFalseData } from "@/types/interactive";

type Props = TrueFalseData & {
  onComplete?: (correct: boolean) => void;
};

export function TrueFalse({ statement, answer, explanation, onComplete }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (val: boolean) => {
    if (revealed) return;
    setSelected(val);
    setRevealed(true);
    onComplete?.(val === answer);
  };

  const btnClass = (val: boolean) => {
    if (!revealed) return "border hover:bg-muted";
    if (val === answer) return "border-green-500 bg-green-50 dark:bg-green-950/20";
    if (val === selected && val !== answer) return "border-red-500 bg-red-50 dark:bg-red-950/20";
    return "border opacity-50";
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-3 text-sm font-medium">{statement}</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleSelect(true)}
          className={`${btnClass(true)} flex-1 rounded-lg px-4 py-4 text-sm font-medium transition-all`}
        >
          True
        </button>
        <button
          onClick={() => handleSelect(false)}
          className={`${btnClass(false)} flex-1 rounded-lg px-4 py-4 text-sm font-medium transition-all`}
        >
          False
        </button>
      </div>
      {revealed && explanation && (
        <p className="mt-3 text-xs text-muted-foreground">{explanation}</p>
      )}
    </div>
  );
}
