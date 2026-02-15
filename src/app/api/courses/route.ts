import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CourseSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const courses = await prisma.course.findMany({
    include: { faculty: { select: { name: true, email: true } } },
  });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const json = await req.json();
    const body = CourseSchema.parse(json);

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
        facultyId: body.facultyId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
}
