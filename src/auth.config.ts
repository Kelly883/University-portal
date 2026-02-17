import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnSuperadmin = nextUrl.pathname.startsWith("/superadmin");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnFaculty = nextUrl.pathname.startsWith("/faculty");
      const isOnStudent = nextUrl.pathname.startsWith("/student");
      
      // Public routes
      if (!isLoggedIn) {
        if (isOnDashboard || isOnSuperadmin || isOnAdmin || isOnFaculty || isOnStudent) {
          return false; // Redirect to login
        }
        return true;
      }

      // RBAC logic
      if (isOnSuperadmin && userRole !== "SUPERADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      if (isOnAdmin && userRole !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      if (isOnFaculty && userRole !== "FACULTY") return Response.redirect(new URL("/dashboard", nextUrl));
      if (isOnStudent && userRole !== "STUDENT") return Response.redirect(new URL("/dashboard", nextUrl));

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
