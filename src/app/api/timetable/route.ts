import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized } from "@/lib/server-auth";

// Timetable entries for a session/semester. Students and lecturers see the same schedule
// scoped by their courses; privileged roles may read any.
export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const sp = req.nextUrl.searchParams;
  const where: Prisma.TimetableEntryWhereInput = {};
  if (sp.get("sessionId")) where.sessionId = sp.get("sessionId")!;
  if (sp.get("semesterId")) where.semesterId = sp.get("semesterId")!;
  if (ctx.role === "LECTURER") {
    const owned = await prisma.course.findMany({ where: { facultyId: ctx.userId }, select: { id: true } });
    where.courseId = { in: owned.map((c) => c.id) };
  }

  const entries = await prisma.timetableEntry.findMany({ where, orderBy: [{ day: "asc" }, { startTime: "asc" }] });
  return NextResponse.json({ entries });
}
