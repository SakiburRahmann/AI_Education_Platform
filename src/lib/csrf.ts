/**
 * CSRF Protection for API routes.
 *
 * Uses a double-submit cookie pattern with Web Crypto API (HMAC-SHA256).
 * Works on BOTH Edge runtime (middleware) and Node.js runtime (API routes).
 *
 * Pattern:
 * 1. Middleware sets a CSRF token cookie (SameSite=Strict) for authenticated users
 * 2. Browser automatically submits the cookie on same-site requests
 * 3. Server-side API routes read the cookie and validate the HMAC signature
 */

// Name of the CSRF token cookie (must match between middleware and API routes)
export const CSRF_TOKEN_COOKIE = "csrf-token";

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get the CSRF HMAC key from the environment.
 * Uses Web Crypto API to import the secret as an HMAC key.
 */
async function getHmacKey(algorithm: HmacImportParams): Promise<CryptoKey> {
  const secret =
    (typeof process !== "undefined" && process.env?.SUPABASE_JWT_SECRET) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_SERVICE_ROLE_KEY) ||
    "csrf-fallback-secret-change-me";

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  return crypto.subtle.importKey(
    "raw",
    keyData,
    algorithm,
    false,
    ["sign", "verify"]
  );
}

/**
 * Generate an HMAC-SHA256 signature for a payload.
 * Uses Web Crypto API (works on both Edge and Node.js).
 */
async function signHmac(payload: string): Promise<string> {
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const key = await getHmacKey(algorithm);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(algorithm, key, encoder.encode(payload));
  // Convert ArrayBuffer to base64url
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Generate a CSRF token bound to a user's session.
 * Uses HMAC-SHA256 via Web Crypto API.
 */
export async function generateCsrfToken(userId: string, sessionId: string): Promise<string> {
  const timestamp = Date.now().toString(36);
  const payload = `${userId}:${sessionId}:${timestamp}`;
  const hmac = await signHmac(payload);
  return `${timestamp}.${hmac}`;
}

/**
 * Validate a CSRF token against the user's session.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function validateCsrfToken(
  token: string | null | undefined,
  userId: string,
  sessionId: string,
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;

  const [timestampB36, receivedHmac] = token.split(".");
  if (!timestampB36 || !receivedHmac) return false;

  // Check expiry
  const timestamp = parseInt(timestampB36, 36);
  if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_EXPIRY_MS) return false;

  // Recompute HMAC using Web Crypto
  const payload = `${userId}:${sessionId}:${timestampB36}`;
  const expectedHmac = await signHmac(payload);

  // Constant-time comparison
  if (receivedHmac.length !== expectedHmac.length) return false;
  let result = 0;
  for (let i = 0; i < receivedHmac.length; i++) {
    result |= receivedHmac.charCodeAt(i) ^ expectedHmac.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Extract CSRF token from request header or cookie.
 * Checks in order:
 * 1. X-CSRF-Token header (set by client-side JS via double-submit pattern)
 * 2. Request cookies API (set by middleware via request.cookies.set())
 * 3. Raw Cookie header (submitted by browser from previous Set-Cookie)
 */
export function extractCsrfToken(request: Request): string | null {
  // Prefer X-CSRF-Token header (set by client-side JS)
  const headerToken = request.headers.get("x-csrf-token");
  if (headerToken) return headerToken;

  // Check request.cookies API (set by middleware via request.cookies.set())
  // This is the path that works for the SAME request where middleware ran
  if ("cookies" in request) {
    const reqCookies = (request as any).cookies;
    if (reqCookies && typeof reqCookies.get === "function") {
      const cookieVal = reqCookies.get(CSRF_TOKEN_COOKIE);
      if (cookieVal && cookieVal.value) {
        return decodeURIComponent(cookieVal.value);
      }
    }
  }

  // Fall back to raw Cookie header (set by browser from previous response)
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/(?:^|;\s*)csrf-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
