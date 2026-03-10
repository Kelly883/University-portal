import prisma from "@/lib/prisma";

export async function logAudit(
  action: string,
  entity: string,
  performerId: string,
  details?: Record<string, unknown> | string | number | boolean | null,
  entityId?: string,
  targetUserId?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        performerId,
        details: details ? details : undefined,
        entityId,
        targetUserId,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw, just log error so main flow isn't interrupted
  }
}
