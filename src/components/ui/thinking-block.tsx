"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  content: string;
  isStreaming?: boolean;
};

function cleanThinking(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (/^#{1,6}\s/.test(trimmed)) return trimmed.replace(/^#{1,6}\s*/, "");
      if (/^[-*_]{3,}$/.test(trimmed)) return "";
      if (/^>\s?/.test(trimmed)) return trimmed.replace(/^>\s?/, "");
      return trimmed;
    })
    .filter(Boolean)
    .join("\n")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/___(.+?)___/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n");
}

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

  const cleaned = cleanThinking(content);
  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;

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
        <div className="border-t px-3 py-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {cleaned.split("\n\n").map((para, i) => (
            <p key={i} className="mb-2 last:mb-0">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}
