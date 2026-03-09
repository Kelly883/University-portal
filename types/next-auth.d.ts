import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "SUPERADMIN" | "ADMIN" | "FACULTY" | "STUDENT" | "PARENT";
      id: string;
      matricNo?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "SUPERADMIN" | "ADMIN" | "FACULTY" | "STUDENT" | "PARENT";
    matricNo?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "SUPERADMIN" | "ADMIN" | "FACULTY" | "STUDENT" | "PARENT";
    id: string;
    matricNo?: string;
  }
}
