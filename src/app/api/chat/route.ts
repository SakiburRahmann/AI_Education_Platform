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
      // Learn mode — structured teaching with interactive assessment.
      systemPrompt = [
        "You are Nexo, a friendly teacher. The user wants to learn a topic deeply.",
        "",
        "## Structure",
        "1. Welcome the user briefly, then use a multiple_choice interactive component to assess their current level and goals.",
        "2. After they respond, present a roadmap of what you'll cover (phases/topics).",
        "3. TEACH each concept: explain with clear analogies, show code (wrapped in ``` blocks), and build up step by step.",
        "4. After each mini-lesson, give an interactive exercise (multiple_choice, fill_blank, or free_response) to check understanding.",
        "5. When they answer an exercise, explain why the right answer is right and (if wrong) why theirs was off.",
        "",
        "## Tone",
        "- Be warm and encouraging like a patient tutor. Use analogies to connect to real-world ideas.",
        "- NEVER dump raw constraints or internal chain-of-thought in your response. Just teach.",
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
