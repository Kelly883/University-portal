import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import CourseRegistrationClient from "@/components/student/course-registration-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CourseRegistrationPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch enrolled courses
  const enrolledCourses = await prisma.course.findMany({
    where: {
      students: {
        some: { id: userId }
      }
    },
    include: {
      faculty: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      code: 'asc'
    }
  });

  // Fetch available courses (not enrolled)
  const availableCourses = await prisma.course.findMany({
    where: {
      NOT: {
        students: {
          some: { id: userId }
        }
      }
    },
    include: {
      faculty: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      code: 'asc'
    }
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-tight">
          Course Registration
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse available courses and manage your academic enrollments.
        </p>
      </div>

      <CourseRegistrationClient 
        availableCourses={availableCourses} 
        enrolledCourses={enrolledCourses} 
      />
    </div>
  );
}
