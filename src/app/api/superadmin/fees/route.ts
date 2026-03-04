
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const feeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  level: z.string().min(1, "Level is required"),
  currency: z.string().default("NGN"),
  priority: z.number().min(1, "Priority must be at least 1"),
  dueDate: z.string().optional().transform(str => str ? new Date(str) : null),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = feeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid data", errors: result.error.errors }, { status: 400 });
    }

    const { name, amount, level, currency, priority, dueDate } = result.data;

    // Check for duplicate priority in the same level
    const existingFee = await prisma.feeStructure.findFirst({
      where: { level, priority },
    });

    if (existingFee) {
      return NextResponse.json({ 
        message: `A fee with priority ${priority} already exists for level ${level}. Please choose a different priority.` 
      }, { status: 409 });
    }

    // Check for duplicate name in the same level
    const duplicateName = await prisma.feeStructure.findFirst({
        where: { name, level }
    });

    if (duplicateName) {
        return NextResponse.json({
            message: `A fee named '${name}' already exists for level ${level}.`
        }, { status: 409 });
    }

    const fee = await prisma.feeStructure.create({
      data: {
        name,
        amount,
        level,
        currency,
        priority,
        dueDate,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CREATE_FEE",
        entity: "FeeStructure",
        entityId: fee.id,
        details: { name, amount, level, priority },
        performerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, fee }, { status: 201 });

  } catch (error: any) {
    console.error("Fee creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "SUPERADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const fees = await prisma.feeStructure.findMany({
            orderBy: [
                { level: 'asc' },
                { priority: 'asc' }
            ]
        });

        return NextResponse.json(fees);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
