import { embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { AIKeyManager } from "./key-manager";

export async function generateEmbedding(text: string): Promise<number[]> {
  const keyManager = new AIKeyManager();
  const apiKey = keyManager.getNextKey();
  if (!apiKey) throw new Error("No Google AI API key available");

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google.textEmbeddingModel("text-embedding-004");

  const { embedding } = await embed({
    model,
    value: text,
  });

  keyManager.markSuccess(apiKey);
  return embedding;
}
