import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupInvalidDepartments() {
  console.log("Starting department cleanup...");

  try {
    // 1. Find departments without a valid faculty
    // Since our schema enforces facultyId, invalid ones might be those with IDs not in Faculty table
    // But Prisma foreign keys usually prevent this unless constraints were disabled.
    // However, we can check for logic violations if any.
    
    // For this task, "unauthorized departments" likely refers to those created without proper process.
    // We can't easily identify them by data alone unless we have audit logs.
    // But we can ensure all departments have valid relations.
    
    // Let's delete departments that might have been created with "test" or "invalid" data if any pattern matches
    // Or simpler: Just ensure strict integrity going forward (which the new API does).
    
    // If the user implies "incorrectly created", maybe they mean duplicates or those with missing info.
    
    const departments = await prisma.department.findMany({
      include: { faculty: true }
    });

    console.log(`Found ${departments.length} departments.`);

    let deletedCount = 0;

    for (const dept of departments) {
      if (!dept.facultyId) {
         console.log(`Deleting orphan department: ${dept.name}`);
         await prisma.department.delete({ where: { id: dept.id } });
         deletedCount++;
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} invalid departments.`);
  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupInvalidDepartments();
