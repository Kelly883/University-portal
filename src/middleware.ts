
export const runtime = "nodejs";

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

export default auth(async (req) => {
  const { nextUrl } = req;
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
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
