import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      include: {
        performer: {
          select: { name: true, email: true },
        },
        targetUser: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to 100 recent logs
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Fetch Audit Logs Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
