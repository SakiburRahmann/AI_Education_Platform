"use client";

import { useState } from "react";
import type { HotspotData } from "@/types/interactive";

type Props = HotspotData & {
  onComplete?: (correct: boolean) => void;
};

export function Hotspot({ question, diagramLabel, regions, correctId, explanation, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleClick = (id: string) => {
    if (revealed) return;
    setSelected(id);
    const correct = id === correctId;
    setRevealed(true);
    onComplete?.(correct);
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-3 text-sm font-medium">{question}</p>
      <div className="mb-3 rounded-lg border-2 border-dashed bg-muted/20 p-4">
        <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">{diagramLabel}</p>
        <div className="grid grid-cols-2 gap-2">
          {regions.map((r) => {
            let stateClass = "border hover:bg-muted cursor-pointer";
            if (revealed && r.id === correctId) stateClass = "border-green-500 bg-green-50 dark:bg-green-950/20";
            else if (revealed && r.id === selected && r.id !== correctId) stateClass = "border-red-500 bg-red-50 dark:bg-red-950/20";
            else if (selected === r.id) stateClass = "border-primary bg-primary/10";

            return (
              <button
                key={r.id}
                onClick={() => handleClick(r.id)}
                className={`rounded-lg border-2 px-3 py-4 text-center text-sm font-medium transition-all ${stateClass}`}
                style={{
                  gridColumn: r.x === 0 ? "1" : r.x === 1 ? "2" : "1 / -1",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
      {revealed && (
        <p className={`text-xs font-medium ${selected === correctId ? "text-green-600" : "text-red-500"}`}>
          {selected === correctId ? "Correct!" : `That's not right. The correct answer was ${regions.find(r => r.id === correctId)?.label}.`}
        </p>
      )}
      {revealed && explanation && (
        <p className="mt-1 text-xs text-muted-foreground">{explanation}</p>
      )}
    </div>
  );
}
