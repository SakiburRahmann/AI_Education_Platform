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
      "models/gemini-3-flash-live",
      "models/gemini-2.5-flash-audio",
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
    ],
    lesson_generation: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "models/gemini-3.1-flash-lite",
    ],
    quiz_generation: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "models/gemini-3.1-flash-lite",
    ],
    file_processing: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "models/gemini-3.1-flash-lite",
    ],
    quick_qa: [
      "models/gemini-3-flash-live",
      "models/gemini-2.5-flash-audio",
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
    ],
    embedding: ["models/text-embedding-004"],
    deep_research: [
      "models/gemma-4-31b-it",
      "models/gemma-4-26b-a4b-it",
      "models/gemini-3.1-flash-lite",
    ],
    search_grounding: [
      "models/gemini-3-flash-live",
      "models/gemini-2.5-flash-audio",
      "models/gemma-4-31b-it",
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

export async function streamWithFallback(
  task: AITaskType,
  buildMessages: () => { role: string; content: string }[],
  systemPrompt: string,
  options?: { temperature?: number }
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
        });

        aiKeyManager.markSuccess(apiKey);
        modelRouter.clearModelCooldown(modelId);

        const response = result.toTextStreamResponse();
        return response;
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

  return new Response(
    JSON.stringify({ error: "All models exhausted", retryAfter: 30 }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}
