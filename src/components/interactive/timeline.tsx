"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { TimelineData } from "@/types/interactive";

type Props = TimelineData & {
  onComplete?: (allCorrect: boolean) => void;
};

export function Timeline({ events, interactive = false, onComplete }: Props) {
  const [order, setOrder] = useState<number[]>(
    interactive
      ? [...Array(events.length).keys()].sort(() => Math.random() - 0.5)
      : events.map((_, i) => i)
  );
  const [revealed, setRevealed] = useState(false);

  const move = (idx: number, dir: -1 | 1) => {
    if (revealed) return;
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= events.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  };

  const handleCheck = () => {
    const correct = order.every((v, i) => v === i);
    setRevealed(true);
    onComplete?.(correct);
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      {interactive && (
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Arrange the events in chronological order
        </p>
      )}
      <div className="relative space-y-0">
        {order.map((origIdx, i) => {
          const event = events[origIdx];
          const isCorrect = revealed && origIdx === i;
          const isWrong = revealed && origIdx !== i;
          return (
            <div key={origIdx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  isCorrect ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-950/20" :
                  isWrong ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950/20" :
                  "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                {i < events.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
              </div>
              <div className={`mb-4 min-w-0 flex-1 rounded-lg border px-3 py-2 ${
                isCorrect ? "border-green-200 bg-green-50 dark:bg-green-950/10" :
                isWrong ? "border-red-200 bg-red-50 dark:bg-red-950/10" :
                "bg-background"
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold">{event.year}</span>
                    <span className="ml-2 text-sm">{event.label}</span>
                  </div>
                  {interactive && !revealed && (
                    <div className="flex gap-0.5 shrink-0">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-muted disabled:opacity-30 min-h-[44px] min-w-[44px]">
                        <ArrowUp className="h-5 w-5" />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === events.length - 1} className="flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-muted disabled:opacity-30 min-h-[44px] min-w-[44px]">
                        <ArrowDown className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                {event.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {interactive && !revealed && (
        <button
          onClick={handleCheck}
          className="rounded-lg bg-primary px-4 py-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Check Order
        </button>
      )}
      {revealed && (
        <p className={`mt-2 text-xs font-medium ${order.every((v, i) => v === i) ? "text-green-600" : "text-red-500"}`}>
          {order.every((v, i) => v === i) ? "Correct order!" : "Some events are out of order."}
        </p>
      )}
    </div>
  );
}
