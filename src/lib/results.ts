// Result lifecycle state machine (PRD §12). Pure and unit-tested. The API layer enforces
// the permission required for each transition via src/lib/rbac.ts.

export type ResultStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED";

export type ResultAction = "enter" | "submit" | "approve" | "publish" | "reopen";

// Allowed transitions. `enter` is data entry that does not change status until submitted.
const TRANSITIONS: Record<ResultAction, { from: ResultStatus[]; to: ResultStatus }> = {
  enter: { from: ["DRAFT", "SUBMITTED"], to: "DRAFT" },
  submit: { from: ["DRAFT"], to: "SUBMITTED" },
  approve: { from: ["SUBMITTED"], to: "APPROVED" },
  publish: { from: ["APPROVED"], to: "PUBLISHED" },
  reopen: { from: ["APPROVED", "PUBLISHED"], to: "DRAFT" },
};

export function transitionPermission(action: ResultAction): string | null {
  switch (action) {
    case "enter":
      return "results.enter";
    case "submit":
      return "results.enter";
    case "approve":
      return "results.approve";
    case "publish":
      return "results.publish";
    case "reopen":
      return "results.approve"; // reopening published results needs approval authority
    default:
      return null;
  }
}

export interface TransitionResult {
  ok: boolean;
  next: ResultStatus | null;
  reason?: string;
}

export function applyTransition(current: ResultStatus, action: ResultAction): TransitionResult {
  const t = TRANSITIONS[action];
  if (!t) return { ok: false, next: null, reason: `Unknown action: ${action}` };
  if (!t.from.includes(current)) {
    return {
      ok: false,
      next: null,
      reason: `Cannot ${action} a result in status ${current}`,
    };
  }
  return { ok: true, next: t.to };
}

// A result can be edited (grade entered/changed) only before it is approved.
export function isEditable(status: ResultStatus): boolean {
  return status === "DRAFT" || status === "SUBMITTED";
}

// Post-publication changes are restricted and must be audited (PRD §12, §30).
export function requiresAudit(action: ResultAction): boolean {
  return action === "publish" || action === "reopen" || action === "approve";
}
