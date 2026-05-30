"use client";

import { useState } from "react";
import type { BranchingScenarioData } from "@/types/interactive";

type Props = BranchingScenarioData & {
  onComplete?: (choiceId: string) => void;
};

export function BranchingScenario({ title, scenario, choices, onComplete }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChoose = (id: string) => {
    setSelectedId(id);
    onComplete?.(id);
  };

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      {title && (
        <p className="mb-2 text-xs font-semibold text-eduai-primary uppercase tracking-wider">{title}</p>
      )}
      <p className="mb-4 text-sm leading-relaxed">{scenario}</p>

      {!selectedId ? (
        <div className="space-y-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase">What do you do?</p>
          {choices.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChoose(c.id)}
              className="flex w-full items-center gap-3 rounded-lg border px-4 py-4 text-left text-sm transition-all hover:border-primary hover:bg-primary/5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium text-muted-foreground">
                {String.fromCharCode(65 + choices.indexOf(c))}
              </span>
              <span>{c.text}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-l-4 border-eduai-primary bg-muted/20 px-4 py-3">
          <p className="text-xs font-medium text-eduai-primary mb-1">Outcome</p>
          <p className="text-sm">{choices.find((c) => c.id === selectedId)?.outcome}</p>
        </div>
      )}
    </div>
  );
}
