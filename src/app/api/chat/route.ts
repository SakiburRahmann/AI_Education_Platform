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

    // No system prompt — AI behaves as Google trained it
    const systemPrompt: string | undefined = hasTextFiles ? `The user uploaded study material:\n\n${context}` : undefined;

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
