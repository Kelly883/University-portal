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
        token.matricNo = user.matricNo;
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
            
            let user: any = null;

            // Find user based on identifier type
          if (identifierType === "email") {
            const userByEmail = await prisma.user.findUnique({ where: { email: identifier } });
            
            if (userByEmail) {
              user = userByEmail;
            } else {
              // Check if there is a pending admission with this email
              const admission = await prisma.admission.findFirst({
                  where: { email: identifier }
              });

              if (admission) {
                  if (admission.status === 'PENDING') {
                      // Check password for pending admission so we don't leak existence
                      if (admission.password) {
                          const passwordsMatch = await bcrypt.compare(password, admission.password);
                          if (passwordsMatch) {
                              // We can't return a user object because they aren't a user yet.
                              // Throwing an error here is caught by NextAuth and displayed to the user.
                              throw new Error("Admission in progress, check in later");
                          }
                      }
                  } else if (admission.status === 'REJECTED') {
                      if (admission.password) {
                          const passwordsMatch = await bcrypt.compare(password, admission.password);
                          if (passwordsMatch) {
                              throw new Error("Admission application was not successful");
                          }
                      }
                  } else if (admission.status === 'APPROVED') {
                      // If approved but not yet a user (shouldn't happen if workflow is correct, but safe fallback)
                      // Or if they haven't received credentials yet.
                      // Ideally, approval creates a User record.
                      if (admission.password) {
                          const passwordsMatch = await bcrypt.compare(password, admission.password);
                          if (passwordsMatch) {
                              throw new Error("Admission approved! Please check your email for student credentials.");
                          }
                      }
                  }
              }
            }
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
