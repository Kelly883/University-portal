import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role as string;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnSuperadmin = nextUrl.pathname.startsWith("/superadmin");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnFaculty = nextUrl.pathname.startsWith("/faculty");
      const isOnStudent = nextUrl.pathname.startsWith("/student");
      
      // Public routes check (login is public)
      // If user is NOT logged in and trying to access protected routes
      if (!isLoggedIn) {
        if (isOnDashboard || isOnSuperadmin || isOnAdmin || isOnFaculty || isOnStudent) {
          return false; // Redirect to login
        }
        return true;
      }

      // RBAC logic
      if (isOnSuperadmin && userRole !== "SUPERADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      if (isOnAdmin && userRole !== "ADMIN" && userRole !== "SUPERADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      if (isOnFaculty && userRole !== "FACULTY" && userRole !== "SUPERADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      if (isOnStudent && userRole !== "STUDENT" && userRole !== "SUPERADMIN") return Response.redirect(new URL("/dashboard", nextUrl));

      // Redirect authenticated users from root or login to dashboard
      if (isOnDashboard) {
        return true;
      } else if (isLoggedIn && nextUrl.pathname === "/") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.permissions = (user as any).permissions;
        token.isActive = (user as any).isActive;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
        (session.user as any).permissions = token.permissions;
        (session.user as any).isActive = token.isActive;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
  trustHost: true,
} satisfies NextAuthConfig;
