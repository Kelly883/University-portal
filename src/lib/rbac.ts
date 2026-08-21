// Server-side Role-Based Access Control (RBAC).
// Authorization must ALWAYS be enforced server-side. Client/hidden routes are NOT security.
// Maps PRD §24 roles to granular permissions. Permissions are stored as the PRD string format
// (e.g. "students.view") on the User.permissions field and/or derived from role.

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "REGISTRAR",
  "ADMISSIONS_OFFICER",
  "FINANCE_OFFICER",
  "LECTURER",
  "DEPARTMENT_ADMIN",
  "STUDENT",
  "APPLICANT",
  "SUPPORT_STAFF",
] as const;

export type Role = (typeof ROLES)[number];

// Every granular permission the system understands.
export const ALL_PERMISSIONS = [
  "students.view",
  "students.edit",
  "students.delete",
  "applications.review",
  "applications.approve",
  "applications.reject",
  "fees.view",
  "fees.manage",
  "payments.verify",
  "payments.refund",
  "payments.view",
  "courses.manage",
  "courses.view",
  "results.enter",
  "results.approve",
  "results.publish",
  "results.view",
  "announcements.manage",
  "announcements.view",
  "news.manage",
  "events.manage",
  "users.manage",
  "roles.manage",
  "settings.manage",
  "audit_logs.view",
  "reports.view",
  "tickets.view",
  "tickets.manage",
  "documents.view",
  "documents.manage",
  "notifications.manage",
  "admissions.manage",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

// Default permission sets per role. Super admin implicitly has everything (see hasPermission).
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [...ALL_PERMISSIONS],
  ADMIN: [
    "students.view",
    "students.edit",
    "applications.review",
    "fees.view",
    "courses.view",
    "results.view",
    "announcements.manage",
    "announcements.view",
    "news.manage",
    "events.manage",
    "users.manage",
    "roles.manage",
    "settings.manage",
    "audit_logs.view",
    "reports.view",
    "tickets.view",
    "tickets.manage",
    "documents.view",
    "notifications.manage",
    "admissions.manage",
  ],
  REGISTRAR: [
    "students.view",
    "students.edit",
    "applications.review",
    "applications.approve",
    "applications.reject",
    "fees.view",
    "results.view",
    "results.publish",
    "announcements.view",
    "audit_logs.view",
    "reports.view",
    "documents.view",
    "documents.manage",
    "admissions.manage",
  ],
  ADMISSIONS_OFFICER: [
    "students.view",
    "applications.review",
    "applications.approve",
    "applications.reject",
    "announcements.view",
    "reports.view",
    "documents.view",
    "admissions.manage",
  ],
  FINANCE_OFFICER: [
    "fees.view",
    "fees.manage",
    "payments.verify",
    "payments.refund",
    "payments.view",
    "students.view",
    "reports.view",
    "documents.view",
  ],
  // Lecturers only access courses/students assigned to them (enforced in canAccessCourse /
  // route layer). They do NOT get blanket courses.view / students.view (least privilege).
  LECTURER: [
    "results.enter",
    "results.view",
    "announcements.view",
    "announcements.manage",
    "tickets.view",
  ],
  DEPARTMENT_ADMIN: [
    "students.view",
    "students.edit",
    "courses.manage",
    "courses.view",
    "results.enter",
    "results.approve",
    "results.view",
    "announcements.manage",
    "announcements.view",
    "reports.view",
    "tickets.view",
    "tickets.manage",
  ],
  SUPPORT_STAFF: ["tickets.view", "tickets.manage", "students.view", "announcements.view"],
  STUDENT: ["results.view", "announcements.view", "tickets.view"],
  APPLICANT: ["applications.review", "announcements.view"],
};

export interface AuthContext {
  userId?: string;
  role?: Role | string;
  // Explicitly granted permissions (string format). Merged with role defaults.
  permissions?: string[];
}

/**
 * Resolve the full effective permission set for an auth context.
 * Super admin always effectively has every permission.
 */
export function effectivePermissions(ctx: AuthContext): Set<string> {
  const role = ctx.role as Role | undefined;
  const base = role && ROLE_PERMISSIONS[role] ? [...ROLE_PERMISSIONS[role]] : [];
  const explicit = (ctx.permissions ?? []).filter((p) => ALL_PERMISSIONS.includes(p as Permission));
  return new Set([...base, ...explicit]);
}

/**
 * Authoritative server-side permission check.
 */
export function hasPermission(ctx: AuthContext | null | undefined, permission: Permission): boolean {
  if (!ctx || !ctx.role) return false;
  if (ctx.role === "SUPER_ADMIN") return true;
  return effectivePermissions(ctx).has(permission);
}

export function hasAnyPermission(
  ctx: AuthContext | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(ctx, p));
}

export function hasRole(ctx: AuthContext | null | undefined, role: Role): boolean {
  return !!ctx && ctx.role === role;
}

/**
 * Object-level authorization: a student may only access their own record unless they
 * hold a privileged permission. Prevents IDOR/BOLA (PRD §29, §44).
 */
export function canAccessStudentRecord(
  ctx: AuthContext | null | undefined,
  targetStudentId: string
): boolean {
  if (!ctx || !ctx.userId) return false;
  if (ctx.userId === targetStudentId) return true;
  return hasAnyPermission(ctx, ["students.view"]);
}

/**
 * A lecturer may only access courses/students assigned to them unless granted broader access.
 */
export function canAccessCourse(
  ctx: AuthContext | null | undefined,
  course: { lecturerId?: string; departmentId?: string }
): boolean {
  if (!ctx) return false;
  if (hasAnyPermission(ctx, ["courses.view", "courses.manage"])) return true;
  if (ctx.role === "LECTURER" && course.lecturerId && course.lecturerId === ctx.userId) return true;
  return false;
}

/**
 * Finance users must NOT gain access to unrelated academic administration.
 */
export function isRestrictedToFinanceOnly(ctx: AuthContext | null | undefined): boolean {
  if (!ctx) return false;
  return ctx.role === "FINANCE_OFFICER";
}
