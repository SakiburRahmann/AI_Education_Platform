import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { aiKeyManager } from "./key-manager";
import type { AITaskType } from "@/types";

type ModelStatus = {
  cooldownUntil: number;
};

class ModelRouter {
  private modelStatuses = new Map<string, ModelStatus>();

  private chains: Record<AITaskType, string[]> = {
    chat: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    lesson_generation: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    quiz_generation: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    file_processing: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    quick_qa: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    embedding: ["models/text-embedding-004"],
    deep_research: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
    search_grounding: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "gemini-3.1-flash-lite",
    ],
  };

  getModelChain(task: AITaskType): string[] {
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

  getNextAvailableModel(task: AITaskType): string | null {
    const chain = this.getModelChain(task);
    for (const modelId of chain) {
      if (this.isModelAvailable(modelId)) {
        return modelId;
      }
    }
    return chain[0] || null;
  }
}

export const modelRouter = new ModelRouter();

export function getModelForTask(task: AITaskType) {
  const modelId = modelRouter.getNextAvailableModel(task);
  if (!modelId) throw new Error(`No available model for task: ${task}`);
  const apiKey = aiKeyManager.getNextKey();
  if (!apiKey) throw new Error("No Google AI API key available");
  return createGoogleGenerativeAI({ apiKey })(modelId);
}

export async function generateWithRetry<T>(
  task: AITaskType,
  generator: (model: ReturnType<typeof getModelForTask>) => Promise<T>
): Promise<T> {
  const chain = modelRouter.getModelChain(task);
  let lastError: Error | null = null;

  for (const modelId of chain) {
    if (!modelRouter.isModelAvailable(modelId)) continue;

    const keyCount = aiKeyManager.getTotalKeyCount() || 1;

    for (let ki = 0; ki < keyCount; ki++) {
      const apiKey = aiKeyManager.getNextKey();
      if (!apiKey) break;

      try {
        const google = createGoogleGenerativeAI({ apiKey });
        const model = google(modelId);
        const result = await generator(model);
        aiKeyManager.markSuccess(apiKey);
        modelRouter.clearModelCooldown(modelId);
        return result;
      } catch (error: any) {
        lastError = error;
        if (error?.status === 429) {
          aiKeyManager.markRateLimited(apiKey, 60);
          modelRouter.markModelRateLimited(modelId, 30);
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
  useSearchGrounding?: boolean;
};

function sendJson(controller: ReadableStreamDefaultController, t: string, c?: string) {
  const encoder = new TextEncoder();
  const msg = c !== undefined ? JSON.stringify({ t, c }) + "\n" : JSON.stringify({ t }) + "\n";
  controller.enqueue(encoder.encode(msg));
}

function isTextPart(part: any): part is { text: string } {
  return typeof part.text === "string";
}

export async function streamWithFallback(
  task: AITaskType,
  buildMessages: () => { role: string; content: string }[],
  systemPrompt: string,
  options?: StreamOptions
): Promise<Response> {
  const chain = modelRouter.getModelChain(task);
  let lastError: Error | null = null;

  for (const modelId of chain) {
    if (!modelRouter.isModelAvailable(modelId)) continue;

    const keyCount = aiKeyManager.getTotalKeyCount() || 1;

    for (let ki = 0; ki < keyCount; ki++) {
      const apiKey = aiKeyManager.getNextKey();
      if (!apiKey) break;

      try {
        const google = createGoogleGenerativeAI({ apiKey });
        const model = google(modelId);

        const result = streamText({
          model,
          messages: buildMessages().map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          system: systemPrompt,
          temperature: options?.temperature ?? 0.7,
          ...(options?.useSearchGrounding && !modelId.startsWith("models/gemma")
            ? { providerOptions: { google: { useSearchGrounding: true } } }
            : {}),
        });

        const reader = result.fullStream.getReader();
        const first = await reader.read();

        if (first.done) {
          reader.releaseLock();
          continue;
        }

        if (first.value.type === "error") {
          throw new Error(
            first.value.error instanceof Error
              ? first.value.error.message
              : String(first.value.error)
          );
        }

        aiKeyManager.markSuccess(apiKey);
        modelRouter.clearModelCooldown(modelId);

        const stream = new ReadableStream({
          async start(controller) {
            if (isTextPart(first.value)) {
              sendJson(controller, first.value.type, first.value.text);
            }
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  sendJson(controller, "done");
                  break;
                }
                if (value.type === "error") {
                  sendJson(
                    controller,
                    "error",
                    value.error instanceof Error
                      ? value.error.message
                      : String(value.error)
                  );
                  break;
                }
                if (isTextPart(value)) {
                  sendJson(controller, value.type, value.text);
                }
              }
            } catch (e: any) {
              sendJson(controller, "error", e?.message || String(e));
            } finally {
              controller.close();
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
          aiKeyManager.markRateLimited(apiKey, 60);
          modelRouter.markModelRateLimited(modelId, 30);
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
