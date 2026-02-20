import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./src/lib/prisma";

// Patch environment variables to ensure valid URLs
// This fixes "TypeError: Invalid URL" when NEXTAUTH_URL is set to just the hostname (e.g. in Railway)
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

const { auth } = NextAuth({
  ...authConfig,
  // Trust host for production deployments (Railway, Vercel, etc.)
  // Middleware must match the trustHost setting in src/auth.ts
  trustHost:
    !process.env.NEXTAUTH_URL || !process.env.NEXTAUTH_URL.startsWith("http")
      ? process.env.TRUST_HOST === "true"
      : false,
});

export async function middleware(request: NextRequest) {
  // Check if trying to access superadmin signup page
  if (request.nextUrl.pathname === "/superadmin-signup") {
    try {
      // Check if a superadmin already exists
      const superadminExists = await prisma.user.findFirst({
        where: { role: "SUPERADMIN" },
      });

      // If superadmin exists, redirect to login
      if (superadminExists) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("Error checking superadmin existence:", error);
      // Continue to signup page if there's an error checking
    }
  }

  // Use auth for protected routes if needed
  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
