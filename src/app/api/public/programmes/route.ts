import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// Public, unauthenticated programme directory with search and filtering (PRD §6).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim();
  const facultyId = sp.get("facultyId");
  const departmentId = sp.get("departmentId");
  const degreeType = sp.get("degreeType");
  const studyLevel = sp.get("studyLevel");

  const where: Prisma.ProgrammeWhereInput = { isActive: true };
  if (facultyId) where.facultyId = facultyId;
  if (departmentId) where.departmentId = departmentId;
  if (degreeType) where.degreeType = degreeType;
  if (studyLevel) where.studyLevel = studyLevel;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
    ];
  }

  const [programmes, faculties, departments] = await Promise.all([
    prisma.programme.findMany({
      where,
      include: { faculty: true, department: true },
      orderBy: { name: "asc" },
      take: 100,
    }),
    prisma.faculty.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
  ]);

  return NextResponse.json({ programmes, filters: { faculties, departments } });
}
