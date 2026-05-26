"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  content: string;
  isStreaming?: boolean;
};

export function ThinkingBlock({ content, isStreaming }: Props) {
  const [open, setOpen] = useState(true);
  const prevStreaming = useRef(isStreaming);

  useEffect(() => {
    if (!prevStreaming.current && isStreaming) {
      setOpen(true);
    }
    if (prevStreaming.current && !isStreaming) {
      setOpen(false);
    }
    prevStreaming.current = isStreaming;
  }, [isStreaming]);

  if (!content) return null;

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="mb-3 rounded-lg border bg-muted/30 text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="shrink-0">{open ? "▼" : "▶"}</span>
        <span>
          {isStreaming
            ? "Thinking..."
            : `Thought for ${wordCount} words`}
        </span>
      </button>
      {open && (
        <div className="border-t px-3 py-2 text-xs leading-relaxed text-muted-foreground/80 whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
}
