import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";

// Patch environment variables to ensure valid URLs
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

// Initialize NextAuth with the config
export const { auth: middleware } = NextAuth({
  ...authConfig,
  trustHost:
    !process.env.NEXTAUTH_URL || !process.env.NEXTAUTH_URL.startsWith("http")
      ? process.env.TRUST_HOST === "true"
      : false,
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
