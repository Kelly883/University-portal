import { auth } from "@/auth";
import type { AuthContext } from "@/lib/rbac";

// Map the persisted User.role enum (legacy) to the PRD-aligned RBAC roles used by
// src/lib/rbac.ts. This keeps the database enum stable while enforcing the PRD role model.
const ROLE_MAP: Record<string, string> = {
  SUPERADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  FACULTY: "LECTURER",
  STUDENT: "STUDENT",
  // PRD roles pass through unchanged when already in the new form.
  SUPER_ADMIN: "SUPER_ADMIN",
  REGISTRAR: "REGISTRAR",
  ADMISSIONS_OFFICER: "ADMISSIONS_OFFICER",
  FINANCE_OFFICER: "FINANCE_OFFICER",
  DEPARTMENT_ADMIN: "DEPARTMENT_ADMIN",
  APPLICANT: "APPLICANT",
  SUPPORT_STAFF: "SUPPORT_STAFF",
};

/**
 * Server-side authoritative session resolver. Returns null for unauthenticated
 * or inactive users. NEVER trust client-supplied role/permission values.
 */
export async function getServerAuth(): Promise<AuthContext | null> {
  const session = await auth();
  const user = (session?.user ?? null) as
    | (Record<string, unknown> & { id?: string; role?: string; isActive?: boolean; permissions?: string[] })
    | null;
  if (!user || !user.id) return null;
  if (user.isActive === false) return null;

  const rawRole = (user.role as string) || "STUDENT";
  const role = (ROLE_MAP[rawRole] ?? "STUDENT") as AuthContext["role"];

  return {
    userId: user.id,
    role,
    permissions: Array.isArray(user.permissions) ? (user.permissions as string[]) : [],
  };
}

export function unauthorized(extra?: Record<string, unknown>) {
  return Response.json(
    { error: "Unauthorized", ...extra },
    { status: 401 }
  );
}

export function forbidden(extra?: Record<string, unknown>) {
  return Response.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}

export function badRequest(message: string, extra?: Record<string, unknown>) {
  return Response.json(
    { error: message, ...extra },
    { status: 400 }
  );
}
