import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden, badRequest } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { announcementVisibleTo } from "@/lib/announcements";

const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  imageUrl: z.string().url().optional().or(z.literal("")),
  audience: z.enum(["GENERAL", "FACULTY", "DEPARTMENT", "PROGRAMME", "STUDENT"]).default("GENERAL"),
  facultyId: z.string().cuid().optional(),
  departmentId: z.string().cuid().optional(),
  programmeId: z.string().cuid().optional(),
  targetUserId: z.string().cuid().optional(),
  expireAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const now = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [{ expireAt: null }, { expireAt: { gt: now } }],
    },
    orderBy: { publishAt: "desc" },
    take: 50,
  });

  // Server-side audience filtering: a user only sees announcements scoped to them.
  const me = await prisma.user.findUnique({
    where: { id: ctx.userId! },
    select: { id: true, role: true, facultyId: true, departmentId: true, programmeId: true },
  });

  const visible = announcements.filter((a) => announcementVisibleTo(a, me));
  return NextResponse.json({ announcements: visible });
}

export async function POST(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();
  if (!hasPermission(ctx, "announcements.manage")) return forbidden();

  const json = await req.json().catch(() => null);
  const parsed = announcementSchema.safeParse(json);
  if (!parsed.success) return badRequest("Invalid request", { issues: parsed.error.flatten() });

  const data = parsed.data;
  const announcement = await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || null,
      audience: data.audience,
      facultyId: data.facultyId,
      departmentId: data.departmentId,
      programmeId: data.programmeId,
      targetUserId: data.targetUserId,
      expireAt: data.expireAt ? new Date(data.expireAt) : null,
      createdById: ctx.userId!,
    },
  });
  return NextResponse.json({ announcement }, { status: 201 });
}
