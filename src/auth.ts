import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Adapter } from "next-auth/adapters";

import prisma from "@/lib/prisma"; // Updated import to use alias
import { authConfig } from "./auth.config";

// Patch environment variables to ensure valid URLs
// This fixes "TypeError: Invalid URL" when NEXTAUTH_URL is set to just the hostname (e.g. in Railway)
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

// Simple in-memory rate limiter for credential-based sign-ins.
// NOTE: This is per-process only. Replace with Redis/Upstash for production.
declare global {
  // eslint-disable-next-line no-var
  var credentialsRateLimiter: Map<string, { count: number; first: number }> | undefined;
}

const credentialsLimiter = globalThis.credentialsRateLimiter ?? new Map<string, { count: number; first: number }>();
globalThis.credentialsRateLimiter = credentialsLimiter;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  // Cookie security defaults - enforce Secure cookies in production
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      },
    },
  },
  // Only enable trustHost when explicitly set (safer default)
  trustHost: process.env.TRUST_HOST === 'true' || false,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Disallow automatic linking of accounts by email in production.
      // Set to true only for controlled testing environments.
      allowDangerousEmailAccountLinking: false,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            identifier: z.string(),
            identifierType: z.enum(["email", "staffId", "matricNo"]).default("email"),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { identifier, identifierType, password } = parsedCredentials.data;

          // Rate limit by identifier (per-account) to mitigate brute force attempts.
          const key = `cred:${identifier}`;
          const now = Date.now();
          const windowMs = 15 * 60 * 1000; // 15 minutes
          const maxAttempts = 5;
          const entry = credentialsLimiter.get(key) ?? { count: 0, first: now };
          if (now - entry.first > windowMs) {
            entry.count = 0;
            entry.first = now;
          }
          if (entry.count >= maxAttempts) {
            // Soft-fail - don't reveal rate limit to client via different status
            return null;
          }

          let user = null;

          // Find user based on identifier type
          if (identifierType === "email") {
            user = await prisma.user.findUnique({
              where: { email: identifier },
            });
          } else if (identifierType === "staffId") {
            user = await prisma.user.findUnique({
              where: { staffId: identifier },
            });
          } else if (identifierType === "matricNo") {
            user = await prisma.user.findUnique({
              where: { matricNo: identifier },
            });
          }

          if (!user || !user.password) {
            entry.count += 1;
            credentialsLimiter.set(key, entry);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            entry.count += 1;
            credentialsLimiter.set(key, entry);
            return null;
          }

          // Success: clear limiter entry for this identifier
          credentialsLimiter.delete(key);
          return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
