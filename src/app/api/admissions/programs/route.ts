
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch courses where the creator (faculty) has the role of ADMIN or SUPERADMIN
    const courses = await prisma.course.findMany({
      where: {
        faculty: {
          role: {
            in: ["ADMIN", "SUPERADMIN"],
          },
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
