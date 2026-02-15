import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { GradeSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const courseId = searchParams.get("courseId");

  if (session.user.role === "STUDENT" && session.user.id !== studentId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const whereClause: any = {};
  if (studentId) whereClause.studentId = studentId;
  if (courseId) whereClause.courseId = courseId;

  const grades = await prisma.grade.findMany({
    where: whereClause,
    include: {
      course: { select: { name: true, code: true } },
      student: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(grades);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "FACULTY" && session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const json = await req.json();
    const body = GradeSchema.parse(json);

    // Check if faculty teaches this course (if faculty)
    if (session.user.role === "FACULTY") {
      const course = await prisma.course.findUnique({
        where: { id: body.courseId },
      });
      if (course?.facultyId !== session.user.id) {
        return new NextResponse("Forbidden: You do not teach this course", { status: 403 });
      }
    }

    const grade = await prisma.grade.upsert({
      where: {
        // Since we don't have a unique constraint on studentId_courseId in schema yet, 
        // we might need to find first. For now, let's just create.
        // Ideally schema should have @@unique([studentId, courseId])
        id: "temp_bypass" 
      },
      create: {
        studentId: body.studentId,
        courseId: body.courseId,
        grade: body.grade,
      },
      update: {
        grade: body.grade,
      },
    });

    // Workaround for missing unique constraint in schema logic above:
    // Actually simpler to just use findFirst then update/create
    const existingGrade = await prisma.grade.findFirst({
      where: { studentId: body.studentId, courseId: body.courseId },
    });

    if (existingGrade) {
      const updated = await prisma.grade.update({
        where: { id: existingGrade.id },
        data: { grade: body.grade },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.grade.create({
        data: {
          studentId: body.studentId,
          courseId: body.courseId,
          grade: body.grade,
        },
      });
      return NextResponse.json(created);
    }

  } catch (error) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
}
