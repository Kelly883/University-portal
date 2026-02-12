import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "FACULTY" | "STUDENT" | "PARENT";
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "FACULTY" | "STUDENT" | "PARENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "FACULTY" | "STUDENT" | "PARENT";
    id: string;
  }
}
