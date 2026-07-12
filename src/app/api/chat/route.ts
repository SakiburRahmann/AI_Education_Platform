import { createClient } from "@/lib/supabase/server";
import { streamWithFallback } from "@/lib/ai/models";
import { z } from "zod";

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).min(1),
  context: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    dataUrl: z.string(),
    type: z.string(),
  })).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let parsed;
    try {
      const body = await request.json();
      parsed = ChatRequestSchema.safeParse(body);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!parsed.success) {
      return new Response(JSON.stringify({
        error: "Invalid request body",
        details: parsed.error.flatten().fieldErrors,
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages, context, files } = parsed.data;
    const hasImages = !!files?.length;
    const hasTextFiles = !!context;

    const systemPrompt: string | undefined = hasTextFiles
      ? `The user uploaded study material:\n\n${context}`
      : undefined;

    type ChatMessage = { role: string; content: string | { type: "text" | "image"; text?: string; image?: string }[] };

    const buildMessages = (): ChatMessage[] =>
      messages.map((m) => {
        if (m.role !== "user" || !hasImages || !files) {
          return { role: m.role, content: m.content };
        }
        return {
          role: m.role,
          content: [
            ...files.map((f) => ({
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
  } catch (error) {
    console.error("Chat error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
