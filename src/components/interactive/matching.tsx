"use client";

import { useState } from "react";
import type { MatchingData } from "@/types/interactive";

type Props = MatchingData & {
  onComplete?: (allCorrect: boolean) => void;
};

export function Matching({ pairs, onComplete }: Props) {
  const shuffledLeft = pairs.map((p, i) => ({ id: `l${i}`, text: p.left, pairIdx: i }));
  const shuffledRight = [...pairs.map((p, i) => ({ id: `r${i}`, text: p.right, pairIdx: i }))].sort(() => Math.random() - 0.5);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  const handleLeft = (idx: number) => {
    if (revealed) return;
    setSelectedLeft(idx === selectedLeft ? null : idx);
  };

  const handleRight = (idx: number) => {
    if (selectedLeft === null || revealed) return;
    const newMatches = { ...matches, [selectedLeft]: idx };
    setMatches(newMatches);
    setSelectedLeft(null);
    if (Object.keys(newMatches).length === pairs.length) {
      const allCorrect = Object.entries(newMatches).every(
        ([k, v]) => shuffledLeft[Number(k)].pairIdx === shuffledRight[v].pairIdx
      );
      setRevealed(true);
      onComplete?.(allCorrect);
    }
  };

  const getMatchStatus = (leftIdx: number, rightIdx: number) => {
    if (!revealed) return null;
    if (shuffledLeft[leftIdx].pairIdx === shuffledRight[rightIdx].pairIdx) return "correct";
    if (matches[leftIdx] === rightIdx) return "wrong";
    return null;
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">Match the pairs</p>
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          {shuffledLeft.map((item, i) => {
            const matchedTo = matches[i] !== undefined;
            const status = matchedTo && revealed ? getMatchStatus(i, matches[i]) : null;
            return (
              <button
                key={item.id}
                onClick={() => handleLeft(i)}
                className={`w-full rounded-lg border px-3 py-4 text-left text-sm transition-all ${
                  selectedLeft === i
                    ? "border-primary bg-primary/10"
                    : matchedTo
                      ? status === "correct"
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : "hover:bg-muted"
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
        <div className="flex-1 space-y-2">
          {shuffledRight.map((item, j) => {
            const matchedBy = Object.entries(matches).find(([, v]) => v === j)?.[0];
            const status = matchedBy !== undefined && revealed ? getMatchStatus(Number(matchedBy), j) : null;
            return (
              <button
                key={item.id}
                onClick={() => handleRight(j)}
                className={`w-full rounded-lg border px-3 py-4 text-left text-sm transition-all ${
                  matchedBy !== undefined
                    ? status === "correct"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : "hover:bg-muted"
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
