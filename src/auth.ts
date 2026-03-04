import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.isActive = (user as any).isActive;
        
        // Fetch assigned permissions from DB
        const assignedPermissions = await prisma.adminPermission.findMany({
          where: { adminId: user.id },
          select: { permission: true },
        });
        
        const dbPermissions = (user as any).permissions || [];
        const extraPermissions = assignedPermissions.map(p => p.permission);
        
        token.permissions = [...dbPermissions, ...extraPermissions];
      }
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        // Handle legacy email/password format
        if (credentials.email && !credentials.identifier) {
          credentials.identifier = credentials.email;
          credentials.identifierType = "email";
        }

        // Validation schema for different login types
        const loginSchema = z.object({
          identifier: z.string(),
          identifierType: z.enum(["email", "staffId", "matricNo"]),
          password: z.string().min(6),
        });

        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { identifier, identifierType, password } = parsedCredentials.data;
          
          let user = null;

          // Find user based on identifier type
          if (identifierType === "email") {
            user = await prisma.user.findUnique({ where: { email: identifier } });
          } else if (identifierType === "staffId") {
            user = await prisma.user.findUnique({ where: { staffId: identifier } });
          } else if (identifierType === "matricNo") {
            user = await prisma.user.findUnique({ where: { matricNo: identifier } });
          }

          if (!user || !user.password) {
            console.log("User not found or no password set");
            return null;
          }
          
          if (!user.isActive) {
            console.log("User is inactive");
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
