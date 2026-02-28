'use server';

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.course.findFirst({
      where: {
        id: courseId,
        students: {
          some: { id: session.user.id },
        },
      },
    });

    if (existingEnrollment) {
      return { error: "Already enrolled in this course" };
    }

    // Enroll student
    await prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          connect: { id: session.user.id },
        },
      },
    });

    revalidatePath("/student/course-registration");
    revalidatePath("/student/courses");
    return { success: "Successfully registered for course" };
  } catch (error) {
    console.error("Error registering course:", error);
    return { error: "Failed to register for course" };
  }
}

export async function dropCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          disconnect: { id: session.user.id },
        },
      },
    });

    revalidatePath("/student/course-registration");
    revalidatePath("/student/courses");
    return { success: "Successfully dropped course" };
  } catch (error) {
    console.error("Error dropping course:", error);
    return { error: "Failed to drop course" };
  }
}
