import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { EnrollmentSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "FACULTY") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const json = await req.json();
    const body = EnrollmentSchema.parse(json);

    const enrollment = await prisma.course.update({
      where: { id: body.courseId },
      data: {
        students: {
          connect: { id: body.studentId },
        },
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "FACULTY") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const json = await req.json();
    const body = EnrollmentSchema.parse(json);

    const unenrollment = await prisma.course.update({
      where: { id: body.courseId },
      data: {
        students: {
          disconnect: { id: body.studentId },
        },
      },
    });

    return NextResponse.json(unenrollment);
  } catch (error) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
}
