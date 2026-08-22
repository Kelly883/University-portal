
export const runtime = "nodejs";

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

// Simple in-memory store for rate limiting (Note: In production with multiple instances, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "default": { limit: 100, windowMs: 60 * 1000 },
  "auth": { limit: 5, windowMs: 15 * 60 * 1000 },
  "admission": { limit: 3, windowMs: 60 * 60 * 1000 },
};

function getRateLimitConfig(pathname: string): RateLimitConfig {
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth")) {
    return RATE_LIMITS["auth"];
  }
  if (pathname.startsWith("/api/admissions/apply")) {
    return RATE_LIMITS["admission"];
  }
  if (pathname.startsWith("/api")) {
    return RATE_LIMITS["default"];
  }
  return { limit: 1000, windowMs: 60 * 1000 };
}

function checkRateLimit(ip: string, config: RateLimitConfig) {
  const now = Date.now();
  const key = `${ip}:${config.limit}:${config.windowMs}`;
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { count: 1, resetTime: now + config.windowMs };
    rateLimitMap.set(key, record);
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: record.resetTime };
  }

  if (now > record.resetTime) {
    record = { count: 1, resetTime: now + config.windowMs };
    rateLimitMap.set(key, record);
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: record.resetTime };
  }

  if (record.count >= config.limit) {
    return { success: false, limit: config.limit, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  rateLimitMap.set(key, record);
  return { success: true, limit: config.limit, remaining: config.limit - record.count, reset: record.resetTime };
}

export const runtime = "nodejs";

export default auth(async (req) => {
  const { nextUrl } = req;

  try {
    // Rate Limiting Logic for API routes
    if (nextUrl.pathname.startsWith("/api")) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const config = getRateLimitConfig(nextUrl.pathname);
      const result = checkRateLimit(ip, config);

      if (!result.success) {
        return new NextResponse(JSON.stringify({
          error: "Too Many Requests",
          message: "You have exceeded the rate limit. Please try again later."
        }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
          },
        });
      }
    }

    const isLoggedIn = !!req.auth;
    const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
      nextUrl.pathname.startsWith("/admin") ||
      nextUrl.pathname.startsWith("/superadmin") ||
      nextUrl.pathname.startsWith("/student") ||
      nextUrl.pathname.startsWith("/faculty");

    if (isOnDashboard) {
      if (isLoggedIn) return NextResponse.next();
      return Response.redirect(new URL("/login", nextUrl));
    } else if (isLoggedIn) {
      if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
