import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, User, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CoursesPage() {
  const session = await auth();
  
  // Fetch courses with faculty info
  const courses = await prisma.course.findMany({
    include: {
      faculty: {
        select: { name: true, email: true }
      },
      _count: {
        select: { students: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Check permissions for showing "Create Course" button
  const permissions = (session?.user as any)?.permissions || [];
  const canCreate = 
    session?.user?.role === "SUPERADMIN" || 
    (session?.user?.role === "ADMIN" && (permissions.includes("courses:create") || permissions.includes("courses:manage")));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Manage academic courses and curriculum.</p>
        </div>
        {canCreate && (
          <Link href="/admin/courses/create">
            <Button className="gap-2">
              <Plus size={16} /> Create Course
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {course.code}
              </CardTitle>
              <Badge variant={course.price > 0 ? "secondary" : "outline"}>
                {course.price > 0 ? `₦${course.price.toLocaleString()}` : "Free"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={course.name}>{course.name}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {course.department} • Level {course.level}
              </p>
              
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span className="truncate max-w-[100px]">{course.faculty.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{course._count.students} Students</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">No courses</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating a new course.</p>
            {canCreate && (
              <div className="mt-6">
                <Link href="/admin/courses/create">
                  <Button variant="outline" className="gap-2">
                    <Plus size={16} /> Create Course
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
