import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";

// Patch environment variables to ensure valid URLs
// This fixes "TypeError: Invalid URL" when NEXTAUTH_URL is set to just the hostname (e.g. in Railway)
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
