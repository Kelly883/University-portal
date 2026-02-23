import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CourseSchema } from "@/lib/schemas"; // I might need to update this schema too
import { NextResponse } from "next/server";
import { z } from "zod";

// Extended schema for new fields
const ExtendedCourseSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  department: z.string().optional(),
  level: z.string().optional(),
  price: z.number().default(0),
  facultyId: z.string().min(1),
  description: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const courses = await prisma.course.findMany({
    include: { faculty: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const session = await auth();
  
  // Check for ADMIN or SUPERADMIN role
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  // Check for permission if ADMIN
  if (session?.user?.role === "ADMIN") {
    const permissions = (session.user as any).permissions || [];
    if (!permissions.includes("courses:create") && !permissions.includes("courses:manage")) {
       return new NextResponse("Forbidden: Insufficient Permissions", { status: 403 });
    }
  }

  try {
    const json = await req.json();
    const body = ExtendedCourseSchema.parse(json);

    const existingCourse = await prisma.course.findUnique({
      where: { code: body.code },
    });

    if (existingCourse) {
      return new NextResponse("Course code already exists", { status: 409 });
    }

    const course = await prisma.course.create({
      data: {
        name: body.name,
        code: body.code,
        department: body.department,
        level: body.level,
        price: body.price,
        facultyId: body.facultyId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Course creation error:", error);
    return new NextResponse("Invalid request data", { status: 400 });
  }
}
