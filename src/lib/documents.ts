import type { AuthContext } from "./rbac.ts";
import { hasPermission } from "./rbac.ts";

export interface DocumentRecord {
  id: string;
  ownerId: string;
  ownerType: "STUDENT" | "APPLICANT";
  type: string;
  filename: string;
  storageKey: string;
  accessible: boolean;
}

/**
 * Object-level authorization for document access (PRD §20, §29).
 * Documents are never served from predictable public URLs; every request must pass this gate.
 */
export function canAccessDocument(ctx: AuthContext | null, doc: DocumentRecord): boolean {
  if (!ctx || !ctx.userId) return false;
  if (!doc.accessible) return false; // revoked / unavailable
  if (doc.ownerId === ctx.userId) return true; // owner
  // Privileged roles with document access.
  if (hasPermission(ctx, "documents.view")) return true;
  if (hasPermission(ctx, "documents.manage")) return true;
  return false;
}
