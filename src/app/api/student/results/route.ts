import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden } from "@/lib/server-auth";
import { canAccessStudentRecord, hasPermission } from "@/lib/rbac";
import { calculateGpa, calculateCgpa, academicStanding } from "@/lib/grades";

export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const studentId = req.nextUrl.searchParams.get("studentId") ?? ctx.userId!;
  if (!canAccessStudentRecord(ctx, studentId)) return forbidden();

  const results = await prisma.result.findMany({
    where: { studentId },
    orderBy: [{ sessionId: "asc" }, { semesterId: "asc" }],
  });

  const published = results.filter((r) => r.status === "PUBLISHED");
  const bySemester = new Map<string, { courseCode: string; creditUnits: number; grade: string }[]>();
  for (const r of published) {
    const key = `${r.sessionId}:${r.semesterId}`;
    if (!bySemester.has(key)) bySemester.set(key, []);
    bySemester.get(key)!.push({ courseCode: r.courseId, creditUnits: r.creditUnits, grade: r.grade });
  }

  const semesters = Array.from(bySemester.values());
  const gpaPerSemester = semesters.map((s) => calculateGpa(s));
  const cgpa = calculateCgpa(semesters);

  return NextResponse.json({
    results: published,
    gpaPerSemester,
    cgpa: cgpa.gpa,
    standing: academicStanding(cgpa.gpa),
  });
}
