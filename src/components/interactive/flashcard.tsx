"use client";

import { useState } from "react";
import type { FlashcardData } from "@/types/interactive";

type Props = FlashcardData & {
  onComplete?: (known: boolean) => void;
};

export function Flashcard({ front, back, onComplete }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const handleKnown = () => {
    setDone(true);
    onComplete?.(true);
  };

  const handleAgain = () => {
    setFlipped(false);
    setDone(false);
  };

  return (
    <div className="my-3">
      <div
        onClick={() => !done && setFlipped(!flipped)}
        className="group relative h-40 cursor-pointer rounded-xl border bg-card p-6 transition-all hover:shadow-md"
      >
        <div className="flex h-full items-center justify-center text-center">
          <p className="text-sm font-medium">{flipped ? back : front}</p>
        </div>
        <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {flipped ? "Click to flip back" : "Click to flip"}
        </span>
      </div>
      {flipped && !done && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleAgain}
            className="flex-1 rounded-lg border px-3 py-4 text-xs font-medium transition-colors hover:bg-muted"
          >
            Need Review
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 rounded-lg bg-green-500 px-3 py-4 text-xs font-medium text-white transition-colors hover:bg-green-600"
          >
            Got It
          </button>
        </div>
      )}
      {done && (
        <p className="mt-2 text-center text-xs text-green-600">Marked as known</p>
      )}
    </div>
  );
}
