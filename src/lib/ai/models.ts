import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, stepCountIs } from "ai";
import type { Tool } from "ai";
import { z } from "zod";
import { AIKeyManager } from "./key-manager";
import type { AITaskType } from "@/types";

type ModelStatus = {
  cooldownUntil: number;
};

/**
 * Per-request model router. Create one per serverless invocation so that
 * rate-limit cooldowns don't leak between users.
 */
export class ModelRouter {
  private modelStatuses = new Map<string, ModelStatus>();

  private chains: Record<AITaskType | "vision", string[]> = {
    chat: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    lesson_generation: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    quiz_generation: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    file_processing: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    quick_qa: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    embedding: ["models/text-embedding-004"],
    deep_research: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    search_grounding: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    vision: [
      "gemma-4-31b-it",
      "gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
  };

  getModelChain(task: AITaskType | "vision"): string[] {
    return this.chains[task] || this.chains.chat;
  }

  markModelRateLimited(modelId: string, cooldownSeconds = 30) {
    this.modelStatuses.set(modelId, {
      cooldownUntil: Date.now() + cooldownSeconds * 1000,
    });
  }

  isModelAvailable(modelId: string): boolean {
    const status = this.modelStatuses.get(modelId);
    if (!status) return true;
    return Date.now() >= status.cooldownUntil;
  }

  clearModelCooldown(modelId: string) {
    this.modelStatuses.delete(modelId);
  }

  getNextAvailableModel(task: AITaskType | "vision"): string | null {
    const chain = this.getModelChain(task);
    for (const modelId of chain) {
      if (this.isModelAvailable(modelId)) {
        return modelId;
      }
    }
    return chain[0] || null;
  }
}

// ─── Factory helpers ─────────────────────────────────────────────

/** Create a request-scoped router + key-manager pair. */
export function createAIServices() {
  return {
    router: new ModelRouter(),
    keyManager: new AIKeyManager(),
  };
}

// ─── Higher-level helpers (accept instances) ─────────────────────

/** @deprecated Use a request-scoped instance with createAIServices() instead. */
export const modelRouter = new ModelRouter();

/** @deprecated Use a request-scoped instance with createAIServices() instead. */
export function getModelForTask(
  task: AITaskType | "vision",
  router: ModelRouter,
  keyManager: AIKeyManager,
) {
  const modelId = router.getNextAvailableModel(task);
  if (!modelId) throw new Error(`No available model for task: ${task}`);
  const apiKey = keyManager.getNextKey();
  if (!apiKey) throw new Error("No Google AI API key available");
  return createGoogleGenerativeAI({ apiKey })(modelId);
}

export async function generateWithRetry<T>(
  task: AITaskType | "vision",
  generator: (model: ReturnType<typeof getModelForTask>) => Promise<T>,
): Promise<T> {
  const { router, keyManager } = createAIServices();
  const chain = router.getModelChain(task);
  let lastError: Error | null = null;

  for (const modelId of chain) {
    if (!router.isModelAvailable(modelId)) continue;

    const keyCount = keyManager.getTotalKeyCount() || 1;

    for (let ki = 0; ki < keyCount; ki++) {
      const apiKey = keyManager.getNextKey();
      if (!apiKey) break;

      try {
        const google = createGoogleGenerativeAI({ apiKey });
        const model = google(modelId);
        const result = await generator(model);
        keyManager.markSuccess(apiKey);
        router.clearModelCooldown(modelId);
        return result;
      } catch (error: any) {
        lastError = error;
        if (error?.status === 429) {
          keyManager.markRateLimited(apiKey, 60);
          router.markModelRateLimited(modelId, 30);
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error(`All models exhausted for task: ${task}`);
}

type StreamOptions = {
  temperature?: number;
  hasImages?: boolean;
};

function sendJson(controller: ReadableStreamDefaultController, t: string, c?: string) {
  const encoder = new TextEncoder();
  const msg = c !== undefined ? JSON.stringify({ t, c }) + "\n" : JSON.stringify({ t }) + "\n";
  controller.enqueue(encoder.encode(msg));
}

function isTextPart(part: any): part is { text: string } {
  return typeof part.text === "string";
}

const webSearch: Tool<any, any> = {
  description:
    "Search the web for current information. Use this when you need up-to-date facts, news, or data beyond your training knowledge.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The search query to look up on the web"),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "UlulAlbab/1.0" },
      });
      const data = await res.json();
      if (data.AbstractText) {
        return `${data.AbstractText}\n\nSource: ${data.AbstractSource || "DuckDuckGo"}`;
      }
      if (data.RelatedTopics?.length) {
        return data.RelatedTopics.slice(0, 5)
          .map((r: any) => r.Text || r.Result || "")
          .filter(Boolean)
          .join("\n\n");
      }
      return "No relevant results found.";
    } catch {
      return "Web search is currently unavailable. Please try again later.";
    }
  },
};

export async function streamWithFallback(
  task: AITaskType | "vision",
  buildMessages: () => { role: string; content: string | { type: "text" | "image"; text?: string; image?: string }[] }[],
  systemPrompt: string | undefined,
  options?: StreamOptions
): Promise<Response> {
  const { router, keyManager } = createAIServices();
  const effectiveTask = options?.hasImages ? "vision" : task;
  const chain = router.getModelChain(effectiveTask);
  let lastError: Error | null = null;

  for (const modelId of chain) {
    if (!router.isModelAvailable(modelId)) continue;

    const keyCount = keyManager.getTotalKeyCount() || 1;

    for (let ki = 0; ki < keyCount; ki++) {
      const apiKey = keyManager.getNextKey();
      if (!apiKey) break;

      try {
        const google = createGoogleGenerativeAI({ apiKey });
        const model = google(modelId);

        const result = streamText({
          model,
          messages: buildMessages() as any,
          ...(systemPrompt !== undefined ? { system: systemPrompt } : {}),
          temperature: options?.temperature ?? 0.7,
          maxRetries: 2,
          tools: { webSearch },
          stopWhen: stepCountIs(10),
        });

        const reader = result.fullStream.getReader();

        // Peek at first event to trigger API call and detect errors early
        const first = await reader.read();
        if (first.done) {
          reader.releaseLock();
          continue;
        }
        if (first.value.type === "error") {
          const errMsg = first.value.error instanceof Error ? first.value.error.message : String(first.value.error);
          throw Object.assign(new Error(errMsg), { status: 429 });
        }

        keyManager.markSuccess(apiKey);
        router.clearModelCooldown(modelId);

        const stream = new ReadableStream({
          async start(controller) {
            try {
              // Forward the peeked first event if it carries text
              if (isTextPart(first.value)) {
                sendJson(controller, first.value.type, first.value.text);
              }

              // Forward remaining events via the same reader
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  sendJson(controller, "done");
                  break;
                }
                if (value.type === "error") {
                  const errTxt = value.error instanceof Error ? value.error.message : String(value.error);
                  sendJson(controller, "error", errTxt);
                  break;
                }
                if (isTextPart(value)) {
                  sendJson(controller, value.type, value.text);
                }
              }
            } catch (e: any) {
              sendJson(controller, "error", e?.message || String(e));
            } finally {
              try { controller.close(); } catch { /* already closed */ }
            }
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      } catch (error: any) {
        lastError = error;
        console.error(`Model ${modelId} failed:`, error?.message || error);
        if (error?.status === 429) {
          keyManager.markRateLimited(apiKey, 60);
          router.markModelRateLimited(modelId, 30);
          continue;
        }
        break;
      }
    }
  }

  return new Response(
    JSON.stringify({
      error: "All models exhausted",
      lastError: lastError?.message || "Unknown",
      retryAfter: 30,
    }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}
