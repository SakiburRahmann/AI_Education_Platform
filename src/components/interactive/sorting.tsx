"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { SortingData } from "@/types/interactive";

type Props = SortingData & {
  onComplete?: (allCorrect: boolean) => void;
};

export function Sorting({ items, correctOrder, onComplete }: Props) {
  const [order, setOrder] = useState<number[]>(
    [...Array(items.length).keys()].sort(() => Math.random() - 0.5)
  );
  const [revealed, setRevealed] = useState(false);

  const move = (idx: number, dir: -1 | 1) => {
    if (revealed) return;
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  };

  const handleSubmit = () => {
    const correct = order.every((v, i) => v === correctOrder[i]);
    setRevealed(true);
    onComplete?.(correct);
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">Arrange in correct order</p>
      <div className="space-y-1.5">
        {order.map((origIdx, i) => (
          <div
            key={origIdx}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              revealed
                ? origIdx === correctOrder[i]
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "bg-background"
            }`}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
              {i + 1}
            </span>
            <span className="flex-1">{items[origIdx]}</span>
            {!revealed && (
              <div className="flex gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-muted disabled:opacity-30 min-h-[44px] min-w-[44px]"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-muted disabled:opacity-30 min-h-[44px] min-w-[44px]"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!revealed && (
        <button
          onClick={handleSubmit}
          className="mt-3 rounded-lg bg-primary px-4 py-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check Order
        </button>
      )}
    </div>
  );
}
