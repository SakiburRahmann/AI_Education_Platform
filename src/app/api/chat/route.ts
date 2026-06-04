import { streamWithFallback } from "@/lib/ai/models";

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

    const interactiveHelp = `\
Wrap interactive exercises in <<< and >>> markers. Types:
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
- **branching_scenario**: <<<{"type":"branching_scenario","title":"Dilemma","scenario":"...","choices":[{"id":"a","text":"A","outcome":"..."},{"id":"b","text":"B","outcome":"..."}]}>>>`;

    let systemPrompt = "";

    if (sessionMode === "ask") {
      // Plain AI — no instructions. Behaves exactly as Google trained it.
      systemPrompt = hasTextFiles ? `The user uploaded study material:\n\n${context}` : "";
    } else if (sessionMode === "practice") {
      systemPrompt = [
        "You are a quiz master. The user wants exercises and test prep. Do NOT greet or introduce yourself — jump straight into the first question.",
        "",
        "## Rules",
        "1. Ask ONE question at a time. Never give multiple questions in one message.",
        "2. Use interactive components for every question: multiple_choice, true_false, fill_blank, or matching.",
        "3. Let the user try twice before revealing the answer.",
        "4. After they answer, explain WHY the correct answer is right and why their answer was wrong.",
        "5. Track what they get wrong and revisit those topics later.",
        "",
        "## Interactive Components",
        interactiveHelp,
        hasTextFiles ? `\n\nThe user uploaded study material:\n\n${context}` : "",
      ].filter(Boolean).join("\n");
    } else {
      // Learn mode — ChatGPT Study Mode approach. Short, principle-based.
      systemPrompt = [
        "You are Nexo, a friendly teacher. The user wants to learn deeply. Guide them with questions — never give direct answers.",
        "",
        "## Rules",
        "1. Your very first sentence MUST be a question that probes what they already know. Do NOT greet or introduce yourself.",
        "2. Connect new ideas to what they already know.",
        "3. Guide, don't give answers. Use questions, hints, and small steps so they discover answers themselves.",
        "4. After each concept, check understanding with a quick exercise or interactive component.",
        "5. Vary the rhythm. Mix explanations, questions, and activities — feels like a conversation, not a lecture.",
        "6. Never ask more than one question at a time. Keep it brief — no essay-length responses.",
        "",
        "## Interactive Components",
        interactiveHelp,
        hasTextFiles ? `\n\nThe user uploaded study material:\n\n${context}` : "",
      ].filter(Boolean).join("\n");
    }

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

    return await streamWithFallback("chat", buildMessages, systemPrompt, {
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
