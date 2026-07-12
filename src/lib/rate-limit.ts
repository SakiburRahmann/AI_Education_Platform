import { createAdminClient } from "@/lib/supabase/server";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/chat": { limit: 20, windowMs: 60_000 },          // 20 req/min
  "/api/leaderboard": { limit: 30, windowMs: 60_000 },    // 30 req/min
  "/api/files/upload": { limit: 10, windowMs: 60_000 },   // 10 req/min
  "/api/files/process": { limit: 10, windowMs: 60_000 },  // 10 req/min
  default: { limit: 60, windowMs: 60_000 },                // 60 req/min fallback
};

const AUTH_LIMITS = {
  auth_callback: { limit: 5, windowMs: 60_000 },           // 5 attempts/min
};

/**
 * Extract the real client IP from request headers.
 * On Vercel Edge, x-forwarded-for is sanitized and provides the real client IP.
 */
export function getClientIp(request: Request): string {
  // Vercel sanitizes x-forwarded-for at the edge — use it directly
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  // Fall back to x-real-ip for non-Vercel environments
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

/**
 * Extract the clean endpoint path (strip query params, normalize).
 */
export function normalizePath(pathname: string): string {
  // Strip trailing slash
  let path = pathname.replace(/\/$/, "");
  // Strip IDs from path segments (UUIDs, numbers)
  path = path.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "/:id");
  path = path.replace(/\/\d+/g, "/:id");
  return path || "/";
}

/**
 * Check rate limit for a given IP and endpoint.
 * Uses Supabase as the distributed counter store.
 * Fail-open: returns { allowed: true } if the database is unreachable.
 */
export async function checkRateLimit(
  ip: string,
  endpointPath: string,
  table: "rate_limits" | "auth_attempts" = "rate_limits",
  customLimits?: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  try {
    const supabase = createAdminClient();
    const rules = table === "auth_attempts" ? AUTH_LIMITS.auth_callback : (RATE_LIMITS[endpointPath] || RATE_LIMITS.default);
    const { limit, windowMs } = customLimits || rules;
    const now = Date.now();
    const windowStart = new Date(now - windowMs).toISOString();

    if (table === "rate_limits") {
      // Cleanup old entries first (best-effort)
      try {
        await supabase
          .from("rate_limits")
          .delete()
          .lt("created_at", new Date(now - windowMs * 2).toISOString())
          .limit(1000);
      } catch {
        // Cleanup failures are non-critical
      }

      // Count existing requests in this window
      const { count } = await supabase
        .from("rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .eq("endpoint_path", endpointPath)
        .gte("window_start", windowStart);

      const currentCount = count || 0;

      if (currentCount >= limit) {
        const oldestEntry = await supabase
          .from("rate_limits")
          .select("window_start")
          .eq("ip_address", ip)
          .eq("endpoint_path", endpointPath)
          .gte("window_start", windowStart)
          .order("window_start", { ascending: true })
          .limit(1)
          .single();

        const resetAt = oldestEntry.data?.window_start
          ? new Date(oldestEntry.data.window_start).getTime() + windowMs
          : now + windowMs;

        return { allowed: false, remaining: 0, limit, resetAt: Math.ceil(resetAt / 1000) };
      }

      // Record this request
      await supabase.from("rate_limits").insert({
        ip_address: ip,
        endpoint_path: endpointPath,
        request_count: 1,
        window_start: new Date().toISOString(),
      });

      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        limit,
        resetAt: Math.ceil((now + windowMs) / 1000),
      };
    } else {
      // Auth attempts table
      try {
        await supabase
          .from("auth_attempts")
          .delete()
          .lt("created_at", new Date(now - windowMs * 2).toISOString())
          .limit(1000);
      } catch {
        // Cleanup failures are non-critical
      }

      const { count } = await supabase
        .from("auth_attempts")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .eq("attempt_type", "auth_callback")
        .gte("window_start", windowStart);

      const currentCount = count || 0;

      if (currentCount >= limit) {
        const oldestEntry = await supabase
          .from("auth_attempts")
          .select("window_start")
          .eq("ip_address", ip)
          .eq("attempt_type", "auth_callback")
          .gte("window_start", windowStart)
          .order("window_start", { ascending: true })
          .limit(1)
          .single();

        const resetAt = oldestEntry.data?.window_start
          ? new Date(oldestEntry.data.window_start).getTime() + windowMs
          : now + windowMs;

        return { allowed: false, remaining: 0, limit, resetAt: Math.ceil(resetAt / 1000) };
      }

      await supabase.from("auth_attempts").insert({
        ip_address: ip,
        attempt_type: "auth_callback",
        attempt_count: 1,
        window_start: new Date().toISOString(),
      });

      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        limit,
        resetAt: Math.ceil((now + windowMs) / 1000),
      };
    }
  } catch (error) {
    // Fail-open: if rate limiter is unreachable, allow the request
    console.error("Rate limit check failed:", error instanceof Error ? error.message : String(error));
    return { allowed: true, remaining: 999, limit: 999, resetAt: Math.ceil((Date.now() + 60000) / 1000) };
  }
}
