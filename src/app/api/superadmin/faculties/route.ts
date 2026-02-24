import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const facultySchema = z.object({
  name: z.string().min(3),
  acronym: z.string().min(2).max(10),
});

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") return new NextResponse("Unauthorized", { status: 403 });

  const faculties = await prisma.faculty.findMany({
    include: {
      _count: {
        select: { departments: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(faculties);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") return new NextResponse("Unauthorized", { status: 403 });

  try {
    const json = await req.json();
    const body = facultySchema.parse(json);

    // Check for existing
    const existing = await prisma.faculty.findFirst({
      where: {
        OR: [
          { name: body.name },
          { acronym: body.acronym },
        ],
      },
    });

    if (existing) {
      return new NextResponse("Faculty with this name or acronym already exists", { status: 409 });
    }

    const faculty = await prisma.faculty.create({
      data: {
        name: body.name,
        acronym: body.acronym,
      },
    });

    await logAudit(
      "CREATE_FACULTY",
      "Faculty",
      session.user.id,
      { name: body.name, acronym: body.acronym },
      faculty.id
    );

    return NextResponse.json(faculty);
  } catch (error) {
    return new NextResponse("Invalid input", { status: 400 });
  }
}
