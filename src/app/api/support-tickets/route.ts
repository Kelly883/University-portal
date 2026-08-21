import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden, badRequest } from "@/lib/server-auth";
import { canAccessStudentRecord, hasPermission } from "@/lib/rbac";

const ticketSchema = z.object({
  studentId: z.string().cuid(),
  category: z.string().min(2),
  subject: z.string().min(3),
  description: z.string().min(5),
});

function generateTicketId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TKT-${new Date().getFullYear()}-${rand}`;
}

export async function GET(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  if (hasPermission(ctx, "tickets.manage")) {
    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const tickets = await prisma.supportTicket.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ tickets });
  }

  const studentId = req.nextUrl.searchParams.get("studentId") ?? ctx.userId!;
  if (!canAccessStudentRecord(ctx, studentId)) return forbidden();
  const tickets = await prisma.supportTicket.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ tickets });
}

export async function POST(req: NextRequest) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const json = await req.json().catch(() => null);
  const parsed = ticketSchema.safeParse(json);
  if (!parsed.success) return badRequest("Invalid request", { issues: parsed.error.flatten() });

  const { studentId } = parsed.data;
  if (!canAccessStudentRecord(ctx, studentId)) return forbidden();

  const ticket = await prisma.supportTicket.create({
    data: {
      ticketId: generateTicketId(),
      studentId,
      category: parsed.data.category,
      subject: parsed.data.subject,
      description: parsed.data.description,
      status: "OPEN",
    },
  });
  return NextResponse.json({ ticket }, { status: 201 });
}
