
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleAdmissionPermission(adminId: string, hasPermission: boolean, permission: "MANAGE_ADMISSIONS" | "VIEW_ADMISSION_DASHBOARD" = "MANAGE_ADMISSIONS") {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    if (hasPermission) {
      // Grant Permission
      await prisma.adminPermission.upsert({
        where: {
          adminId_permission: {
            adminId,
            permission,
          },
        },
        create: {
          adminId,
          permission,
          grantedBy: session.user.id,
        },
        update: {}, // Already exists
      });
    } else {
      // Revoke Permission
      await prisma.adminPermission.deleteMany({
        where: {
          adminId,
          permission,
        },
      });
    }

    revalidatePath("/superadmin/permissions");
    return { success: true };
  } catch (error) {
    console.error("Error toggling permission:", error);
    return { success: false, error: "Failed to update permission" };
  }
}
