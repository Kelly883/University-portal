import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PaymentSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (session.user.role === "STUDENT" && session.user.id !== studentId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const payments = await prisma.payment.findMany({
    where: studentId ? { studentId } : {},
    include: { student: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STUDENT") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const json = await req.json();
    const body = PaymentSchema.parse(json);

    if (session.user.role === "STUDENT" && session.user.id !== body.studentId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: body.studentId,
        amount: body.amount,
        status: body.status,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
}
