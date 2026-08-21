import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden, badRequest } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { gradePoint } from "@/lib/grades";
import { applyTransition, transitionPermission, isEditable, requiresAudit } from "@/lib/results";

const enterSchema = z.object({
  studentId: z.string().cuid(),
  courseId: z.string().cuid(),
  sessionId: z.string().cuid(),
  semesterId: z.string().cuid(),
  grade: z.string().min(1),
  creditUnits: z.number().int().positive(),
});

const transitionSchema = z.object({
  id: z.string().cuid(),
  action: z.enum(["submit", "approve", "publish", "reopen"]),
});

export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();
  if (!hasPermission(ctx, "results.view")) return forbidden();

  const sp = req.nextUrl.searchParams;
  const where: Prisma.ResultWhereInput = {};
  if (sp.get("status")) where.status = sp.get("status")!;
  if (sp.get("sessionId")) where.sessionId = sp.get("sessionId")!;
  if (sp.get("semesterId")) where.semesterId = sp.get("semesterId")!;
  if (sp.get("courseId")) where.courseId = sp.get("courseId")!;
  // Lecturers see only results for courses they are assigned to.
  if (ctx.role === "LECTURER") {
    const owned = await prisma.course.findMany({ where: { facultyId: ctx.userId }, select: { id: true } });
    where.courseId = { in: owned.map((c) => c.id) };
  }

  const results = await prisma.result.findMany({ where, orderBy: { updatedAt: "desc" }, take: 200 });
  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();
  if (!hasPermission(ctx, "results.enter")) return forbidden();

  const json = await req.json().catch(() => null);
  const parsed = enterSchema.safeParse(json);
  if (!parsed.success) return badRequest("Invalid request", { issues: parsed.error.flatten() });

  const { studentId, courseId, sessionId, semesterId, grade, creditUnits } = parsed.data;

  // Lecturers may only enter grades for courses assigned to them (PRD §15).
  if (ctx.role === "LECTURER") {
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { facultyId: true } });
    if (!course || course.facultyId !== ctx.userId) return forbidden();
  }

  const existing = await prisma.result.findUnique({
    where: { studentId_courseId_sessionId_semesterId: { studentId, courseId, sessionId, semesterId } },
  });
  if (existing && !isEditable(existing.status as any)) {
    return badRequest("Result is locked; it has already been approved/published", { status: existing.status });
  }

  const points = gradePoint(grade);
  const result = await prisma.result.upsert({
    where: { studentId_courseId_sessionId_semesterId: { studentId, courseId, sessionId, semesterId } },
    update: { grade, creditUnits, gradePoints: points, status: "DRAFT" },
    create: {
      studentId,
      courseId,
      sessionId,
      semesterId,
      grade,
      creditUnits,
      gradePoints: points,
      status: "DRAFT",
    },
  });

  await logAudit("RESULT_ENTER", "Result", ctx.userId!, { grade, creditUnits, status: "DRAFT" }, result.id, studentId);
  return NextResponse.json({ result }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const json = await req.json().catch(() => null);
  const parsed = transitionSchema.safeParse(json);
  if (!parsed.success) return badRequest("Invalid request", { issues: parsed.error.flatten() });

  const { id, action } = parsed.data;
  const perm = transitionPermission(action);
  if (!perm || !hasPermission(ctx, perm as any)) return forbidden();

  const result = await prisma.result.findUnique({ where: { id } });
  if (!result) return badRequest("Result not found");

  const transition = applyTransition(result.status as any, action);
  if (!transition.ok) return badRequest(transition.reason ?? "Invalid transition", { status: result.status });

  const updated = await prisma.result.update({
    where: { id },
    data: {
      status: transition.next!,
      publishedAt: action === "publish" ? new Date() : null,
      approvedBy: action === "approve" || action === "publish" ? ctx.userId! : result.approvedBy,
      approvedAt: action === "approve" || action === "publish" ? new Date() : result.approvedAt,
    },
  });

  if (requiresAudit(action)) {
    await logAudit(
      `RESULT_${action.toUpperCase()}`,
      "Result",
      ctx.userId!,
      { from: result.status, to: transition.next },
      id,
      result.studentId
    );
  }
  return NextResponse.json({ result: updated });
}
