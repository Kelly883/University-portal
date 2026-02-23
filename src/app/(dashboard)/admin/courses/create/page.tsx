import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateCourseForm from "@/components/admin/create-course-form";
import prisma from "@/lib/prisma";

export default async function CreateCoursePage() {
  const session = await auth();
  
  // 1. Authentication Check
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Permission Check
  // Allow SUPERADMIN or ADMIN with 'courses:create' permission
  const permissions = (session.user as any).permissions || [];
  const hasPermission = 
    session.user.role === "SUPERADMIN" || 
    (session.user.role === "ADMIN" && (permissions.includes("courses:create") || permissions.includes("courses:manage")));

  if (!hasPermission) {
    redirect("/admin/courses?error=unauthorized");
  }

  // 3. Fetch Data for Form (Faculty list)
  const faculty = await prisma.user.findMany({
    where: { role: "FACULTY" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="container mx-auto pb-10">
      <CreateCourseForm facultyList={faculty} />
    </div>
  );
}
