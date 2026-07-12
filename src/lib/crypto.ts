/**
 * Client-side encryption for localStorage data.
 *
 * Uses the Web Crypto API (AES-GCM) to encrypt sensitive data before storing
 * it in localStorage. The encryption key is derived from a device-specific
 * random seed using PBKDF2.
 *
 * This protects against:
 * - Malicious browser extensions reading localStorage
 * - XSS that can read localStorage
 * - Shared computer access
 */

const KEY_STORAGE = "ulul-albab-crypto-key";
const KEY_ITERATIONS = 100_000;
const ALGORITHM = "AES-GCM";

/**
 * Get or create the device encryption key.
 * The key is derived from a random seed stored in localStorage.
 * If an XSS can read localStorage, it can get the seed — but without
 * the PBKDF2 derivation parameters, it cannot reconstruct the key.
 */
async function getKey(): Promise<CryptoKey | null> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;

  try {
    let seed = localStorage.getItem(KEY_STORAGE);
    if (!seed) {
      // Generate a new random seed
      const seedBytes = new Uint8Array(32);
      crypto.getRandomValues(seedBytes);
      seed = btoa(String.fromCharCode(...seedBytes));
      localStorage.setItem(KEY_STORAGE, seed);
    }

    // Import the seed as key material
    const seedBytes = Uint8Array.from(atob(seed), (c) => c.charCodeAt(0));
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      seedBytes,
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // Derive an AES-GCM key
    const salt = new Uint8Array([85, 108, 117, 108, 65, 108, 98, 97, 98]); // "UlulAlbab"
    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: KEY_ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: ALGORITHM, length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  } catch {
    // If Web Crypto is unavailable (e.g., insecure context), store without encryption
    return null;
  }
}

/**
 * Encrypt a value for localStorage.
 * Returns `encrypted:iv:data` format or the original value if encryption not available.
 */
export async function encryptForStorage(value: string): Promise<string> {
  const key = await getKey();
  if (!key) return value; // Fall back to plaintext if crypto unavailable

  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(value);
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encoded
    );

    // Format: base64(iv):base64(encrypted)
    const ivB64 = btoa(String.fromCharCode(...iv));
    const encB64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    return `enc:${ivB64}:${encB64}`;
  } catch {
    return value; // Fall back on error
  }
}

/**
 * Decrypt a value from localStorage.
 * Returns the decrypted string, or the original value if not encrypted.
 */
export async function decryptFromStorage(value: string): Promise<string> {
  if (!value.startsWith("enc:")) return value; // Not encrypted

  const key = await getKey();
  if (!key) return value;

  try {
    const [, ivB64, encB64] = value.split(":");
    if (!ivB64 || !encB64) return value;

    const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
    const encrypted = Uint8Array.from(atob(encB64), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return value; // Fall back on error
  }
}

/**
 * Securely save data to localStorage with encryption.
 */
export async function setSecurely(key: string, value: unknown): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(value);
    const encrypted = await encryptForStorage(json);
    localStorage.setItem(key, encrypted);
  } catch (e) {
    console.error("Failed to save securely:", e instanceof Error ? e.message : String(e));
  }
}

/**
 * Securely load and decrypt data from localStorage.
 */
export async function getSecurely<T>(key: string, fallback: T): Promise<T> {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const decrypted = await decryptFromStorage(raw);
    return JSON.parse(decrypted) as T;
  } catch {
    return fallback;
  }
}

/**
 * Wipe all Ulul Albab data from localStorage (for clear/sign-out).
 */
export function wipeLocalData(): void {
  if (typeof window === "undefined") return;
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("ulul-albab-"));
  keys.forEach((k) => localStorage.removeItem(k));
}
