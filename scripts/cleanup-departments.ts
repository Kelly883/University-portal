import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting department cleanup...");

  // Fetch all departments including their faculty
  const departments = await prisma.department.findMany({
    include: {
      faculty: true,
    },
  });

  console.log(`Found ${departments.length} departments.`);

  let deletedCount = 0;

  for (const dept of departments) {
    let shouldDelete = false;
    let reason = "";

    // Criteria for "incorrectly created" departments
    // 1. Missing name or acronym
    if (!dept.name || dept.name.trim() === "") {
      shouldDelete = true;
      reason = "Missing name";
    } else if (!dept.acronym || dept.acronym.trim() === "") {
      shouldDelete = true;
      reason = "Missing acronym";
    }
    
    // 2. Invalid Faculty (should be caught by foreign key, but checking anyway)
    // Note: Prisma include would be null if faculty doesn't exist but relation is required so this shouldn't happen unless data integrity is broken at DB level
    if (!dept.faculty) {
      shouldDelete = true;
      reason = "Orphaned (No Faculty)";
    }

    // 3. Check for suspicious names (optional, based on user report of "unauthorized" creation)
    // For now, we only delete clearly invalid data.
    
    if (shouldDelete) {
      console.log(`Deleting department ${dept.id} (${dept.name || "Unnamed"}): ${reason}`);
      await prisma.department.delete({
        where: { id: dept.id },
      });
      deletedCount++;
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedCount} invalid departments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
