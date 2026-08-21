export interface AnnouncementScopes {
  audience: string; // GENERAL | FACULTY | DEPARTMENT | PROGRAMME | STUDENT
  facultyId?: string | null;
  departmentId?: string | null;
  programmeId?: string | null;
  targetUserId?: string | null;
}

export interface Viewer {
  id: string;
  role: string;
  facultyId?: string | null;
  departmentId?: string | null;
  programmeId?: string | null;
}

const STAFF_ROLES = ["ADMIN", "SUPERADMIN", "FACULTY", "DEPARTMENT_ADMIN", "SUPPORT_STAFF"];

/**
 * Server-side audience enforcement for announcements. A viewer sees an announcement only when its
 * audience scope matches their identity. Prevents leaking student-targeted or scoped announcements.
 */
export function announcementVisibleTo(a: AnnouncementScopes, me: Viewer | null): boolean {
  if (a.audience === "GENERAL") return true;
  if (!me) return false;

  switch (a.audience) {
    case "FACULTY":
      return STAFF_ROLES.includes(me.role) || (!!a.facultyId && a.facultyId === me.facultyId);
    case "DEPARTMENT":
      return !!a.departmentId && a.departmentId === me.departmentId;
    case "PROGRAMME":
      return !!a.programmeId && a.programmeId === me.programmeId;
    case "STUDENT":
      return !!a.targetUserId && a.targetUserId === me.id;
    default:
      return false;
  }
}
