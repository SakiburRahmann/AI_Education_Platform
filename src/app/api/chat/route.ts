import { streamWithFallback } from "@/lib/ai/models";

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hasFiles = !!context;
    const task = hasFiles ? "file_processing" : "chat";

    const systemPrompt = [
      "You are Nexo, EduAI's AI learning companion. You help students understand their study materials.",
      "You are knowledgeable, patient, and explain concepts clearly with examples.",
      "When given study material context, answer questions based on that material.",
      "If asked to generate lessons, create structured content with clear headings and key points.",
      "If asked to generate quizzes, create questions with multiple choice or true/false format.",
      "Be concise but thorough. Use markdown formatting for clarity.",
      "If you need current information, rely on your training data — do not claim you can browse the web.",
      context ? `\n\nThe user has uploaded the following study material for context:\n\n${context}` : "",
    ].filter(Boolean).join("\n");

    const buildMessages = () =>
      messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }));

    return await streamWithFallback(task, buildMessages, systemPrompt, {
      useSearchGrounding: !hasFiles,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
