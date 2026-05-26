import { embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { aiKeyManager } from "./key-manager";

function getProvider() {
  const apiKey = aiKeyManager.getNextKey();
  if (!apiKey) throw new Error("No Google AI API key available");
  return createGoogleGenerativeAI({ apiKey });
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const google = getProvider();
  const model = google.textEmbeddingModel("text-embedding-004");

  const { embedding } = await embed({
    model,
    value: text,
  });

  const apiKey = aiKeyManager.getNextKey();
  if (apiKey) aiKeyManager.markSuccess(apiKey);

  return embedding;
}
