/**
 * CSRF Protection for API routes.
 *
 * Uses a double-submit cookie pattern:
 * 1. Server sets a CSRF token cookie (SameSite=Strict) for authenticated users
 * 2. Browser automatically submits the cookie on same-site requests
 * 3. Server-side API routes read the cookie and validate the HMAC signature
 *
 * The token is HMAC-signed using a server secret bound to the user's ID,
 * preventing token forgery even if an XSS can read the cookie value.
 */

import { createHmac, timingSafeEqual } from "crypto";

// Name of the CSRF token cookie (must match what middleware sets)
export const CSRF_TOKEN_COOKIE = "csrf-token";

const CSRF_SECRET = process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "csrf-fallback-secret-change-me";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a CSRF token bound to a user's session.
 * Uses HMAC-SHA256 to create a token that cannot be forged without the secret.
 * Bound to user.id (same value for both params since we don't have a dedicated session ID).
 */
export function generateCsrfToken(userId: string, sessionId: string): string {
  const timestamp = Date.now().toString(36);
  const payload = `${userId}:${sessionId}:${timestamp}`;
  const hmac = createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("base64url");
  return `${timestamp}.${hmac}`;
}

/**
 * Validate a CSRF token against the user's session.
 * Returns true if the token is valid and not expired.
 */
export function validateCsrfToken(
  token: string | null | undefined,
  userId: string,
  sessionId: string,
): boolean {
  if (!token || !token.includes(".")) return false;

  const [timestampB36, receivedHmac] = token.split(".");
  if (!timestampB36 || !receivedHmac) return false;

  // Check expiry
  const timestamp = parseInt(timestampB36, 36);
  if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_EXPIRY_MS) return false;

  // Recompute HMAC
  const payload = `${userId}:${sessionId}:${timestampB36}`;
  const expectedHmac = createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("base64url");

  // Constant-time comparison
  try {
    return timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

/**
 * Extract CSRF token from request header or cookie.
 * Checks X-CSRF-Token header first, then falls back to csrf-token cookie.
 */
export function extractCsrfToken(request: Request): string | null {
  // Prefer X-CSRF-Token header (set by client-side JS)
  const headerToken = request.headers.get("x-csrf-token");
  if (headerToken) return headerToken;

  // Fall back to cookie (set by middleware for authenticated users)
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/(?:^|;\s*)csrf-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
