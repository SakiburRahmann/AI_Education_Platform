import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { aiKeyManager } from "./key-manager";
import type { AITaskType } from "@/types";

function getGoogleProvider() {
  const apiKey = aiKeyManager.getNextKey();
  if (!apiKey) {
    throw new Error("No Google AI API key available");
  }
  return createGoogleGenerativeAI({ apiKey });
}

const MODEL_MAP: Record<AITaskType, string> = {
  chat: "models/gemini-2.0-flash-exp",
  lesson_generation: "models/gemma-4-31b-it",
  quiz_generation: "models/gemma-4-26b-a4b-it",
  quick_qa: "models/gemini-2.0-flash-exp",
  embedding: "models/text-embedding-004",
  deep_research: "models/gemini-2.0-flash-exp",
  search_grounding: "models/gemini-2.0-flash-exp",
};

export function getModelForTask(task: AITaskType) {
  const google = getGoogleProvider();
  return google(MODEL_MAP[task]);
}

export async function generateWithRetry<T>(
  task: AITaskType,
  generator: (model: ReturnType<typeof getModelForTask>) => Promise<T>
): Promise<T> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const model = getModelForTask(task);
      const result = await generator(model);
      const apiKey = aiKeyManager.getNextKey();
      if (apiKey) aiKeyManager.markSuccess(apiKey);
      return result;
    } catch (error: any) {
      lastError = error;
      if (error?.status === 429) {
        const apiKey = aiKeyManager.getNextKey();
        if (apiKey) aiKeyManager.markRateLimited(apiKey, 60);
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
          continue;
        }
      }
      throw error;
    }
  }

  throw lastError;
}
