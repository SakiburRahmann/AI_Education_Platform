"use client";

import type { ReactNode } from "react";
import type { InteractiveComponentData } from "@/types/interactive";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { MultipleChoice } from "./multiple-choice";
import { TrueFalse } from "./true-false";
import { FillBlank } from "./fill-blank";
import { Flashcard } from "./flashcard";
import { Matching } from "./matching";
import { Sorting } from "./sorting";
import { ConceptSlider } from "./concept-slider";
import { Timeline } from "./timeline";
import { Hotspot } from "./hotspot";
import { FreeResponse } from "./free-response";
import { BranchingScenario } from "./branching-scenario";

const COMPONENT_BLOCK_RE = /<<<(\{[\s\S]*?\})>>>/g;

function parseBlocks(content: string): { type: "text" | "component"; value: string | InteractiveComponentData }[] {
  const parts: { type: "text" | "component"; value: string | InteractiveComponentData }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  COMPONENT_BLOCK_RE.lastIndex = 0;

  while ((match = COMPONENT_BLOCK_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    try {
      const data = JSON.parse(match[1]) as InteractiveComponentData;
      parts.push({ type: "component", value: data });
    } catch {
      parts.push({ type: "text", value: match[0] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

function renderComponent(data: InteractiveComponentData) {
  switch (data.type) {
    case "multiple_choice":
      return <MultipleChoice key={crypto.randomUUID()} {...data} />;
    case "true_false":
      return <TrueFalse key={crypto.randomUUID()} {...data} />;
    case "fill_blank":
      return <FillBlank key={crypto.randomUUID()} {...data} />;
    case "flashcard":
      return <Flashcard key={crypto.randomUUID()} {...data} />;
    case "matching":
      return <Matching key={crypto.randomUUID()} {...data} />;
    case "sorting":
      return <Sorting key={crypto.randomUUID()} {...(data as any)} />;
    case "concept_slider":
      return <ConceptSlider key={crypto.randomUUID()} {...data} />;
    case "timeline":
      return <Timeline key={crypto.randomUUID()} {...data} />;
    case "hotspot":
      return <Hotspot key={crypto.randomUUID()} {...data} />;
    case "free_response":
      return <FreeResponse key={crypto.randomUUID()} {...data} />;
    case "branching_scenario":
      return <BranchingScenario key={crypto.randomUUID()} {...data} />;
    default:
      return null;
  }
}

export function InteractiveContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  if (blocks.length === 1 && blocks[0].type === "text") {
    return <MarkdownRenderer content={content} />;
  }

  const elements: ReactNode[] = blocks.map((block, i) => {
    if (block.type === "text") {
      const text = block.value as string;
      if (!text.trim()) return null;
      return <MarkdownRenderer key={`t${i}`} content={text} />;
    }
    return <div key={`c${i}`}>{renderComponent(block.value as InteractiveComponentData)}</div>;
  });

  return <>{elements}</>;
}
