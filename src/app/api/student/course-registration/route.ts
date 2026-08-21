import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden, badRequest } from "@/lib/server-auth";
import { hasPermission, canAccessStudentRecord } from "@/lib/rbac";
import { validateCourseRegistration, type CourseInfo } from "@/lib/course-registration";

const registrationSchema = z.object({
  studentId: z.string().cuid(),
  sessionId: z.string().cuid(),
  semesterId: z.string().cuid(),
  courseIds: z.array(z.string().cuid()).min(1),
});

export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();
  const studentId = req.nextUrl.searchParams.get("studentId") ?? ctx.userId!;
  if (!canAccessStudentRecord(ctx, studentId)) return forbidden();
  const regs = await prisma.courseRegistration.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ registrations: regs });
}

export async function POST(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const json = await req.json().catch(() => null);
  const parsed = registrationSchema.safeParse(json);
  if (!parsed.success) return badRequest("Invalid request", { issues: parsed.error.flatten() });

  const { studentId, sessionId, semesterId, courseIds } = parsed.data;

  if (!canAccessStudentRecord(ctx, studentId)) {
    return forbidden();
  }

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { level: true, programmeId: true, departmentId: true },
  });
  if (!student) return badRequest("Student not found");

  const semester = await prisma.semester.findUnique({ where: { id: semesterId } });
  if (!semester) return badRequest("Semester not found");

  const now = new Date();
  const registrationOpen = !!semester.registrationStart && !!semester.registrationEnd &&
    now >= semester.registrationStart && now <= semester.registrationEnd;

  const courses = await prisma.course.findMany({ where: { id: { in: courseIds } } });
  if (courses.length !== courseIds.length) return badRequest("One or more courses are invalid");

  const selected: CourseInfo[] = courses.map((c) => ({
    id: c.id,
    code: c.code,
    creditUnits: c.credits,
    level: c.level ?? undefined,
    type: (c.type as CourseInfo["type"]) ?? "COMPULSORY",
    prerequisites: c.prerequisites ?? [],
    active: true,
  }));

  const existing = await prisma.courseRegistration.findMany({
    where: { studentId, sessionId, semesterId },
    select: { courseId: true },
  });

  const result = validateCourseRegistration(selected, {
    registrationOpen,
    windowStart: semester.registrationStart ?? undefined,
    windowEnd: semester.registrationEnd ?? undefined,
    now,
    minCredits: 15,
    maxCredits: 24,
    requiredElectiveCredits: 3,
  }, {
    level: student.level ?? "100",
    programmeId: student.programmeId ?? undefined,
    departmentId: student.departmentId ?? undefined,
    passedCourseIds: [],
    currentlyRegisteredIds: existing.map((e) => e.courseId),
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Registration rejected", errors: result.errors }, { status: 422 });
  }

  const created = await prisma.$transaction(
    courseIds.map((courseId) =>
      prisma.courseRegistration.upsert({
        where: { studentId_courseId_sessionId_semesterId: { studentId, courseId, sessionId, semesterId } },
        update: { status: "ACTIVE" },
        create: {
          studentId,
          courseId,
          sessionId,
          semesterId,
          type: courses.find((c) => c.id === courseId)?.type ?? "COMPULSORY",
        },
      })
    )
  );

  return NextResponse.json({ ok: true, totalCredits: result.totalCredits, registrations: created }, { status: 201 });
}
