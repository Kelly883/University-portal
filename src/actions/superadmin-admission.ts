'use server';

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveAdmission(admissionId: string) {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const admission = await prisma.admission.findUnique({
      where: { id: admissionId }
    });

    if (!admission) {
      return { error: "Admission record not found" };
    }

    if (admission.status === "APPROVED") {
        return { error: "Admission is already approved" };
    }

    // Generate Matric Number: DEPT/YEAR/SEQUENTIAL_NUMBER
    // 1. Get Department Code (First 3 letters of program or generic 'GEN')
    const deptCode = admission.program.substring(0, 3).toUpperCase();
    
    // 2. Get Year
    const year = new Date().getFullYear();

    // 3. Get Sequential Number (Count existing approved students in this year + 1)
    const count = await prisma.user.count({
        where: {
            role: "STUDENT",
            createdAt: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`)
            }
        }
    });
    
    const sequence = (count + 1).toString().padStart(4, '0');
    const matricNo = `${deptCode}/${year}/${sequence}`;

    let resultMatricNo = matricNo;

    // Transaction: Create User Account & Update Admission Status
    await prisma.$transaction(async (tx) => {
        // 1. Create User
        await tx.user.create({
            data: {
                name: `${admission.firstName} ${admission.lastName}`,
                email: admission.email,
                matricNo: matricNo,
                password: admission.password, // Already hashed from admission form
                role: "STUDENT",
                emailVerified: new Date(),
                image: null, 
            }
        });

        // 2. Update Admission
        await tx.admission.update({
            where: { id: admissionId },
            data: {
                status: "APPROVED",
                updatedAt: new Date()
            }
        });

        // 3. Create Audit Log
        await tx.auditLog.create({
            data: {
                action: "APPROVE_ADMISSION",
                entity: "Admission",
                entityId: admissionId,
                details: { matricNo, program: admission.program },
                performerId: session.user.id!
            }
        });
    });

    revalidatePath("/superadmin/admissions");
    return { success: true, matricNo: resultMatricNo };

  } catch (error) {
    console.error("Error approving admission:", error);
    return { error: "Failed to approve admission" };
  }
}

export async function rejectAdmission(admissionId: string) {
    const session = await auth();
  
    if (session?.user?.role !== "SUPERADMIN") {
      return { error: "Unauthorized" };
    }

    try {
        await prisma.admission.update({
            where: { id: admissionId },
            data: {
                status: "REJECTED",
                updatedAt: new Date()
            }
        });

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: "REJECT_ADMISSION",
                entity: "Admission",
                entityId: admissionId,
                details: { status: "REJECTED" },
                performerId: session.user.id!
            }
        });

        revalidatePath("/superadmin/admissions");
        return { success: true };
    } catch (error) {
        console.error("Error rejecting admission:", error);
        return { error: "Failed to reject admission" };
    }
}
