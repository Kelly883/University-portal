import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const departmentSchema = z.object({
  name: z.string().min(3),
  acronym: z.string().min(2).max(10),
  facultyId: z.string().min(1),
});

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") return new NextResponse("Unauthorized", { status: 403 });

  const departments = await prisma.department.findMany({
    include: {
      faculty: {
        select: { id: true, name: true, acronym: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(departments);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") return new NextResponse("Unauthorized", { status: 403 });

  try {
    const json = await req.json();
    const body = departmentSchema.parse(json);

    // Check for existing in same faculty or same acronym globally
    const existing = await prisma.department.findFirst({
      where: {
        OR: [
          { name: body.name, facultyId: body.facultyId }, // Unique name per faculty
          { acronym: body.acronym }, // Unique acronym globally
        ],
      },
    });

    if (existing) {
      return new NextResponse("Department with this name/acronym already exists", { status: 409 });
    }

    const department = await prisma.department.create({
      data: {
        name: body.name,
        acronym: body.acronym,
        facultyId: body.facultyId,
      },
    });

    await logAudit(
      "CREATE_DEPARTMENT",
      "Department",
      session.user.id,
      { name: body.name, acronym: body.acronym, facultyId: body.facultyId },
      department.id
    );

    return NextResponse.json(department);
  } catch (error) {
    return new NextResponse("Invalid input", { status: 400 });
  }
}
