import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit, getClientIp, normalizePath } from "@/lib/rate-limit";
import { generateCsrfToken, CSRF_TOKEN_COOKIE } from "@/lib/csrf";

const CSRF_TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // ── Rate limiting for API routes ─────────────────────────────────
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = getClientIp(request);
    const endpoint = normalizePath(request.nextUrl.pathname);
    const result = await checkRateLimit(ip, endpoint);

    // Set rate-limit headers on every API response
    supabaseResponse.headers.set("X-RateLimit-Limit", String(result.limit));
    supabaseResponse.headers.set("X-RateLimit-Remaining", String(result.remaining));
    supabaseResponse.headers.set("X-RateLimit-Reset", String(result.resetAt));

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.max(1, result.resetAt - Math.floor(Date.now() / 1000))),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetAt),
          },
        }
      );
    }
  }

  // ── Auth session management ──────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Set CSRF token for authenticated users ───────────────────────
  if (user) {
    const token = await generateCsrfToken(user.id, user.id);
    // Set on the request so the CURRENT route handler can read it
    request.cookies.set(CSRF_TOKEN_COOKIE, token);
    // Set on the response so FUTURE requests from the browser have it
    supabaseResponse.cookies.set(CSRF_TOKEN_COOKIE, token, {
      httpOnly: false, // Must be readable by client JS
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: CSRF_TOKEN_EXPIRY,
      path: "/",
    });
  }

  // Redirect unauthenticated users away from /dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from /auth
  if (user && request.nextUrl.pathname === "/auth") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
