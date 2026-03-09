
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all departments
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
