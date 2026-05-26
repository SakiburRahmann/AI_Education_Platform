import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { aiKeyManager } from "@/lib/ai/key-manager";

function getProvider() {
  const apiKey = aiKeyManager.getNextKey();
  if (!apiKey) throw new Error("No Google AI API key available");
  return createGoogleGenerativeAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const google = getProvider();
    const model = google("models/gemma-4-31b-it");

    const system = [
      "You are Nexo, EduAI's AI learning companion. You help students understand their study materials.",
      "You are knowledgeable, patient, and explain concepts clearly with examples.",
      "When given study material context, answer questions based on that material.",
      "If asked to generate lessons, create structured content with clear headings and key points.",
      "If asked to generate quizzes, create questions with multiple choice or true/false format.",
      "Be concise but thorough. Use markdown formatting for clarity.",
      context ? `\n\nThe user has uploaded the following study material for context:\n\n${context}` : "",
    ].filter(Boolean).join("\n");

    const result = streamText({
      model,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      system,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    if (error.message?.includes("API key")) {
      return new Response(JSON.stringify({ error: "API key unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
