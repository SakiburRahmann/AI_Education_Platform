"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { FreeResponseData } from "@/types/interactive";

type Props = FreeResponseData & {
  onComplete?: (text: string) => void;
};

export function FreeResponse({ prompt, minWords, placeholder, rubric }: Props) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const meetsMin = minWords ? wordCount >= minWords : true;

  const handleSubmit = () => {
    if (!meetsMin) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="my-3 rounded-xl border bg-card p-4">
        <p className="mb-2 text-sm font-medium">{prompt}</p>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-sm whitespace-pre-wrap">{text}</p>
          <p className="mt-2 text-[10px] text-muted-foreground">{wordCount} words</p>
        </div>
        {rubric && rubric.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-medium text-muted-foreground">Key concepts to check:</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {rubric.map((concept, i) => (
                <span
                  key={i}
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    text.toLowerCase().includes(concept.toLowerCase())
                      ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {text.toLowerCase().includes(concept.toLowerCase()) ? "✓" : "○"} {concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-3 rounded-xl border bg-card p-4">
      <p className="mb-2 text-sm font-medium">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "Write your explanation here..."}
        rows={4}
        className="w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[10px] ${meetsMin ? "text-muted-foreground" : "text-eduai-error"}`}>
          {wordCount} words{minWords ? ` (min ${minWords})` : ""}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || !meetsMin}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Submit
        </button>
      </div>
    </div>
  );
}
