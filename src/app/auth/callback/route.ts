import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // ── Brute force protection ─────────────────────────────────────
  const ip = getClientIp(request);
  const rateResult = await checkRateLimit(ip, "/auth/callback", "auth_attempts");

  if (!rateResult.allowed) {
    const waitSeconds = Math.max(1, rateResult.resetAt - Math.floor(Date.now() / 1000));
    return NextResponse.redirect(
      `${origin}/auth?error=too_many_attempts&retry_after=${waitSeconds}`,
      { status: 307 }
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
  }

  // ── Exchange the auth code ─────────────────────────────────────
  let response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth code exchange failed:", error.message);
    return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
  }

  // Only redirect on success — no stale/partial cookie state
  return response;
}
