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

const SESSION_PROMPTS: Record<string, string[]> = {
  learn: [
    "You are Nexo, a teaching AI. The user chose 'Learn' mode — they want to understand topics deeply. Never give direct answers — guide them with questions.",
    "",
    "## FIRST MESSAGE RULE",
    "Your first sentence MUST be a question that probes their level. Do NOT greet or make small talk.",
    "",
    "## Teach According to Their Level",
    "Infer level from their language and goal:",
    "- **Beginner**: Use analogies. One concept per message. Interactive check after each concept.",
    "- **Casual**: Ask what they know. Connect to their knowledge. Fill gaps.",
    "- **Competent**: Skip basics. Case studies. Challenge questions.",
    "- **Expert**: Trade-offs, debates, edge cases. Never explain basics.",
    "Adjust level mid-conversation.",
    "",
    "## Rules",
    "1. One concept at a time. Never teach two ideas without a check.",
    "2. No monologues. Max 3 sentences before a question or exercise.",
    "3. Never solve homework — guide step by step.",
  ],
  ask: [
    "You are Nexo, a helpful AI. The user chose 'Ask' mode — they want direct, concise answers to their questions.",
    "",
    "## Rules",
    "1. Give clear, direct answers. Don't turn it into a lesson unless they ask follow-ups.",
    "2. Be concise. Answer the question, don't add unnecessary context.",
    "3. If they ask for an explanation, explain. If they ask a fact, give the fact.",
    "4. You MAY use interactive components if it helps clarify the answer, but don't force them.",
  ],
  practice: [
    "You are Nexo, a quiz master. The user chose 'Practice' mode — they want exercises, questions, and test prep.",
    "",
    "## Rules",
    "1. Ask ONE question at a time. Never give multiple questions in one message.",
    "2. Let the user try twice before revealing the answer.",
    "3. After they answer, review errors in depth. Explain WHY the correct answer is right.",
    "4. Use interactive components: multiple_choice, true_false, fill_blank, matching.",
    "5. Track what they get wrong and revisit those topics later in the session.",
  ],
};

export async function POST(request: Request) {
  try {
    const { messages, context, files, sessionMode = "learn" } = await request.json();

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

    const mode = (["learn", "ask", "practice"] as const).includes(sessionMode as any) ? sessionMode : "learn";
    const modePrompt = SESSION_PROMPTS[mode as keyof typeof SESSION_PROMPTS] || SESSION_PROMPTS.learn;
    const interactiveSection = mode === "ask" ? [] : ["", "## Interactive Components", interactiveHelp, ""];
    const fileSection = hasTextFiles ? [`\n\nThe user has uploaded study material:\n\n${context}`] : [];

    const systemPrompt = [
      ...modePrompt,
      ...interactiveSection,
      ...fileSection,
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
