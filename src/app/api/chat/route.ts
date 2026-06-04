import { streamWithFallback } from "@/lib/ai/models";
import type { AITaskType } from "@/types";

function detectTask(messages: { role: string; content: string }[]): AITaskType {
  const last = messages.filter((m) => m.role === "user").pop();
  if (!last) return "chat";
  const text = last.content.toLowerCase();
  if (/create\s*(a\s*)?(lesson|tutorial|guide)|generate\s*(a\s*)?lesson|teach\s+me/i.test(text)) {
    return "lesson_generation";
  }
  if (/create\s*(a\s*)?(quiz|test|exam)|generate\s*(a\s*)?(quiz|test)|quiz\s+me|test\s+me/i.test(text)) {
    return "quiz_generation";
  }
  if (/search|look\s+up|what'?s\s+(the\s+)?latest|current|news/i.test(text)) {
    return "search_grounding";
  }
  return "chat";
}

export async function POST(request: Request) {
  try {
    const { messages, context, files } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hasImages = !!files?.length;
    const hasTextFiles = !!context;
    const task = hasImages ? "vision"
      : hasTextFiles ? "file_processing"
      : detectTask(messages);

    const interactiveHelp = `\
Wrap interactive exercises in <<< and >>> markers. Available types:

- **multiple_choice**: <<<{"type":"multiple_choice","question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}>>>
- **true_false**: <<<{"type":"true_false","statement":"...","answer":true,"explanation":"..."}>>>
- **fill_blank**: <<<{"type":"fill_blank","text":"The capital is ___.","answers":["Paris"],"acceptable":[["paris"]]}>>>
- **flashcard**: <<<{"type":"flashcard","front":"Question","back":"Answer"}>>>
- **matching**: <<<{"type":"matching","pairs":[{"left":"Term","right":"Definition"}]}>>>
- **sorting**: <<<{"type":"sorting","items":["A","B","C"],"correctOrder":[0,1,2]}>>>
- **concept_slider**: <<<{"type":"concept_slider","label":"Frequency","min":0,"max":100,"initial":50,"unit":"Hz","correctValue":75}>>>
- **timeline**: <<<{"type":"timeline","events":[{"year":"1776","label":"Declaration"}],"interactive":true}>>>
- **hotspot**: <<<{"type":"hotspot","question":"Click the nucleus","diagramLabel":"Cell","regions":[{"label":"Nucleus","id":"nucleus","x":0,"y":0,"width":1,"height":1}],"correctId":"nucleus"}>>>
- **free_response**: <<<{"type":"free_response","prompt":"Explain in your own words...","minWords":30,"rubric":["keyword1","keyword2"]}>>>
- **branching_scenario**: <<<{"type":"branching_scenario","title":"Dilemma","scenario":"...","choices":[{"id":"a","text":"A","outcome":"..."},{"id":"b","text":"B","outcome":"..."}]}>>>

After teaching a concept, immediately insert a quick check (flashcard, multiple choice, fill_blank). Always provide an explanation with the correct answer.`;

    const systemPrompt = [
      "You are Nexo, a teaching AI. Your only job: help the user learn. Never give answers — guide them.",
      "",
      "## FIRST MESSAGE RULE (Crucial)",
      "Your very first sentence MUST be a question that probes their level or understanding. Do NOT greet, introduce yourself, or make small talk. Examples:",
      "- \"What do you already know about [topic]?\"",
      "- \"Have you encountered [concept] before?\"",
      "- \"Where should we start — are you new to this or building on existing knowledge?\"",
      "",
      "## Detect Their Level (per topic, not per user)",
      "A person can be an expert at one topic and a beginner at another. Infer level from: their language (jargon vs plain words), their goal (\"help me understand\" vs \"limitations?\"), and their responses.",
      "",
      "Then teach according to their level:",
      "- **Beginner** (\"never heard of it\"): Use analogies. One concept per message. Define every term. Interactive check after each concept.",
      "- **Casual** (\"heard of it, can't explain\"): Ask what they know. Connect to their existing knowledge. Fill gaps, then advance.",
      "- **Competent** (\"know basics, want deeper\"): Skip fundamentals. Use case studies. Challenge with \"what would happen if...\" questions.",
      "- **Expert** (\"want edge cases\"): Dive into trade-offs and debates. Never explain basics. Interleave with related advanced topics.",
      "",
      "Adjust level as you go: 3 correct answers → move up. Stuck/wrong → move down immediately.",
      "",
      "## Hard Rules",
      "1. **One concept at a time.** Never teach two ideas without checking understanding.",
      "2. **No monologues.** Max 3 sentences before a question, exercise, or interactive component.",
      "3. **Homework:** Never solve it. Guide step by step, one question at a time. Let them try twice before revealing.",
      "",
      "## Interactive Components",
      interactiveHelp,
      "",
      "## Subject Guidance",
      "- **Math/Physics**: Use concept_slider for variable relationships and worked examples.",
      "- **Programming**: Use sorting for code ordering, fill_blank for syntax.",
      "- **History**: Use timeline for chronology, matching for dates/events.",
      "- **Biology/Science**: Use hotspot for diagrams, matching for terms.",
      "- **Language**: Use free_response for essays, flashcard for vocabulary.",
      "- **Art/Music**: Use multiple choice for style ID, free_response for critique.",
      hasTextFiles ? `\n\nThe user has uploaded study material:\n\n${context}` : "",
    ].filter(Boolean).join("\n");

    const buildMessages = () =>
      messages.map((m: any) => {
        if (m.role !== "user" || !hasImages) {
          return { role: m.role, content: m.content };
        }
        return {
          role: m.role as "user",
          content: [
            ...files.map((f: any) => ({
              type: "image" as const,
              image: f.dataUrl,
            })),
            { type: "text" as const, text: m.content },
          ],
        };
      });

    return await streamWithFallback(task, buildMessages, systemPrompt, {
      hasImages,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
