import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized } from "@/lib/server-auth";

// Examination schedule for a session/semester. Same scoping rules as the timetable.
export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const sp = req.nextUrl.searchParams;
  const where: Prisma.ExamWhereInput = {};
  if (sp.get("sessionId")) where.sessionId = sp.get("sessionId")!;
  if (sp.get("semesterId")) where.semesterId = sp.get("semesterId")!;
  if (ctx.role === "LECTURER") {
    const owned = await prisma.course.findMany({ where: { facultyId: ctx.userId }, select: { id: true } });
    where.courseId = { in: owned.map((c) => c.id) };
  }

  const exams = await prisma.exam.findMany({ where, orderBy: { date: "asc" } });
  return NextResponse.json({ exams });
}
