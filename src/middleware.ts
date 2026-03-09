
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Simple in-memory store for rate limiting (Note: In production with multiple instances, use Redis)
// Using Map<string, { count: number, resetTime: number }>
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "default": { limit: 100, windowMs: 60 * 1000 }, // 100 req per minute
  "auth": { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 req per 15 minutes
  "admission": { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 req per hour
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
  return { limit: 1000, windowMs: 60 * 1000 }; // High limit for static assets/pages
}

function checkRateLimit(ip: string, config: RateLimitConfig) {
  const now = Date.now();
  const key = `${ip}:${config.limit}:${config.windowMs}`; // Unique bucket per config
  
  // Clean up old entries periodically or check on access
  // Ideally use a proper cache with TTL
  
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
  rateLimitMap.set(key, record); // Update count
  return { success: true, limit: config.limit, remaining: config.limit - record.count, reset: record.resetTime };
}

export default auth((req) => {
  const { nextUrl } = req;
  
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
    
    // Add Rate Limit headers to successful responses (optional, can be done in return)
  }

  // Auth Logic (from auth.config.ts or custom)
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
    // Redirect logged-in users away from login/register pages
    if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
       return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  // Matcher ignoring static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
