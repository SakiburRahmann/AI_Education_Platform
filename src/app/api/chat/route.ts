import { streamWithFallback } from "@/lib/ai/models";

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
    const task = hasImages || hasTextFiles ? "file_processing" : "chat";

    const systemPrompt = [
      "You are Nexo, EduAI's AI learning companion. You help students understand their study materials.",
      "You are knowledgeable, patient, and explain concepts clearly with examples.",
      "When given study material context, answer questions based on that material.",
      "If asked to generate lessons, create structured content with clear headings and key points.",
      "If asked to generate quizzes, create questions with multiple choice or true/false format.",
      "Be concise but thorough. Use markdown formatting for clarity.",
      "You have access to a web search tool. When you need current or up-to-date information, search the web using the tool provided to you.",
      hasTextFiles ? `\n\nThe user has uploaded the following study material for context:\n\n${context}` : "",
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
