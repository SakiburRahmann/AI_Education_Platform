type KeyStatus = {
  key: string;
  cooldownUntil: number;
  failureCount: number;
};

/**
 * Manages Google AI API key rotation and rate-limit tracking.
 *
 * Designed to be created per-request (not a module-level singleton) so that
 * cooldown state does not leak between serverless function invocations.
 * In serverless environments (Vercel), each request creates a fresh instance,
 * avoiding cross-user state bleed while still cycling through keys within
 * a single request.
 */
export class AIKeyManager {
  private keys: KeyStatus[] = [];
  private currentIndex = 0;

  constructor() {
    this.loadKeys();
  }

  private loadKeys() {
    const keys: string[] = [];
    let i = 1;
    while (true) {
      const key = process.env[`GOOGLE_API_KEY_${i}`];
      if (!key) break;
      keys.push(key);
      i++;
    }

    if (keys.length === 0) {
      console.error("No Google AI API keys configured. Set GOOGLE_API_KEY_1.");
    }

    this.keys = keys.map((key) => ({
      key,
      cooldownUntil: 0,
      failureCount: 0,
    }));
  }

  /**
   * Returns the next available API key, or null if ALL keys are on cooldown.
   * Callers should handle null by queuing or returning a clear error.
   */
  getNextKey(): string | null {
    if (this.keys.length === 0) return null;

    const now = Date.now();

    // Find an available key (not on cooldown)
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      const status = this.keys[this.currentIndex];

      if (now >= status.cooldownUntil) {
        return status.key;
      }
    }

    // All keys are on cooldown — return null so the caller can handle it gracefully
    const earliestCooldown = Math.min(
      ...this.keys.map((k) => k.cooldownUntil)
    );
    const waitMs = earliestCooldown - now;
    console.error(`All API keys on cooldown. Next available in ${waitMs}ms`);
    return null;
  }

  markRateLimited(key: string, cooldownSeconds = 60) {
    const status = this.keys.find((k) => k.key === key);
    if (status) {
      status.cooldownUntil = Date.now() + cooldownSeconds * 1000;
      status.failureCount++;
    }
  }

  markSuccess(key: string) {
    const status = this.keys.find((k) => k.key === key);
    if (status) {
      status.failureCount = 0;
    }
  }

  getAvailableKeyCount(): number {
    const now = Date.now();
    return this.keys.filter((k) => now >= k.cooldownUntil).length;
  }

  getTotalKeyCount(): number {
    return this.keys.length;
  }
}

/** @deprecated Use `new AIKeyManager()` instead — serverless-safe, request-scoped instances. */
export const aiKeyManager = new AIKeyManager();
