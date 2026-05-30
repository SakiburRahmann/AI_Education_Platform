"use client";

import { useState } from "react";
import type { FillBlankData } from "@/types/interactive";

type Props = FillBlankData & {
  onComplete?: (allCorrect: boolean) => void;
};

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

export function FillBlank({ text, answers, acceptable, onComplete }: Props) {
  const blanks = answers.map((_, i) => i);
  const [values, setValues] = useState<string[]>(answers.map(() => ""));
  const [results, setResults] = useState<boolean[] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const res = blanks.map((i) => {
      const norm = normalize(values[i] || "");
      const accepted = acceptable?.[i] || [];
      return norm === normalize(answers[i]) || accepted.some((a) => norm === normalize(a));
    });
    setResults(res);
    setSubmitted(true);
    onComplete?.(res.every(Boolean));
  };

  const parts = text.split(/(___)/g);
  let blankIdx = 0;

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-3 text-sm leading-relaxed">
        {parts.map((part, i) => {
          if (part !== "___") {
            return <span key={i}>{part}</span>;
          }
          const idx = blankIdx++;
          const isCorrect = results?.[idx];
          return (
            <span key={i} className="relative mx-1 inline-block">
              <input
                type="text"
                value={values[idx]}
                onChange={(e) => {
                  if (submitted) return;
                  const next = [...values];
                  next[idx] = e.target.value;
                  setValues(next);
                }}
                disabled={submitted}
                className={`w-28 border-b-2 bg-transparent px-1 text-center text-sm outline-none transition-colors focus:border-primary ${
                  submitted
                    ? isCorrect
                      ? "border-green-500"
                      : "border-red-500 text-red-500"
                    : "border-muted-foreground/30"
                }`}
              />
              {submitted && !isCorrect && (
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-green-600">
                  {answers[idx]}
                </span>
              )}
            </span>
          );
        })}
      </p>
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={values.some((v) => !v.trim())}
          className="mt-2 rounded-lg bg-primary px-4 py-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          Check
        </button>
      )}
    </div>
  );
}
