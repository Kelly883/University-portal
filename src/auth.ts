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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
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

          if (!user || !user.password) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
